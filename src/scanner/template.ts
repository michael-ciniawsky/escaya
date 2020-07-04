import { ParserState, Context } from '../common';
import { fromCodePoint, toHex } from './common';
import { Token } from '../token';
import { Chars } from './chars';
import { addDiagnostic, DiagnosticKind, DiagnosticSource, DiagnosticCode } from '../diagnostics';
import { unicodeLookup } from './unicode';

/**
 * Scan a template section. It can start either from the quote or closing brace.
 */
export function scanTemplateSpan(parser: ParserState, context: Context): Token {
  parser.index++;

  let ret: string | null = '';
  let lastIsCR = 0;
  let start = parser.index;
  let ch = parser.source.charCodeAt(parser.index);

  while (parser.index < parser.length) {
    // '`'
    if (ch === Chars.Backtick) {
      parser.tokenValue = ret;
      parser.index++; // skips '`'
      parser.tokenRaw = parser.source.slice(start, parser.index - 1);
      return Token.TemplateTail;
    }

    // '${'
    if (ch === Chars.Dollar) {
      const index = parser.index + 1;
      if (index < parser.length && parser.source.charCodeAt(index) === Chars.LeftBrace) {
        parser.index = index + 1; // Consume '$', '{'
        parser.tokenValue = ret;
        parser.tokenRaw = parser.source.slice(start, parser.index - 2);
        return Token.TemplateCont;
      }
      ret += '$';
    }

    // Escape character
    if (ch === Chars.Backslash) {
      parser.index++;
      let ch = parser.source.charCodeAt(parser.index);
      // The TV of LineContinuation :: \ LineTerminatorSequence is the empty
      // code unit sequence.
      if ((unicodeLookup[(ch >>> 5) + 69632] >>> ch) & 31 & 1) {
        if (ch === Chars.CarriageReturn) {
          parser.index++;
          if (parser.source.charCodeAt(parser.index) === Chars.LineFeed) {
            parser.lastChar = ch;
            parser.index++;
          }
        }
        parser.columnOffset = parser.index;
        parser.line++;
      } else {
        const code = parseTemplateEscape(parser, context, ch);
        // Invalid escape sequence checking is handled in the parser
        ret = code < 0 ? null : (ret as string) + code;
      }
    } else {
      parser.index++;
      if ((unicodeLookup[(ch >>> 5) + 69632] >>> ch) & 31 & 1) {
        // The TRV of LineTerminatorSequence :: <CR> is the CV 0x000A.
        // The TRV of LineTerminatorSequence :: <CR><LF> is the sequence
        // consisting of the CV 0x000A.
        if (ch === Chars.CarriageReturn) {
          lastIsCR = 1;
          parser.line++;
          parser.columnOffset = parser.index;
        } else if (ch === Chars.LineFeed || (ch ^ Chars.LineSeparator) <= 1) {
          if (lastIsCR === 0) parser.line++;
          parser.columnOffset = parser.index;
          lastIsCR = 1;
        }
      }
      if (ret != null) ret += fromCodePoint(ch);
    }
    ch = parser.source.charCodeAt(parser.index);
  }

  addDiagnostic(parser, context, DiagnosticSource.Lexer, DiagnosticCode.UnterminatedTemplate, DiagnosticKind.Error);

  parser.tokenValue = ret;

  return Token.TemplateTail;
}

export function parseTemplateEscape(parser: ParserState, context: Context, ch: number): string | number {
  parser.index++;
  switch (ch) {
    case Chars.LowerB:
      return '\b';
    case Chars.LowerT:
      return '\t';
    case Chars.LowerN:
      return '\n';
    case Chars.LowerV:
      return '\v';
    case Chars.LowerF:
      return '\f';
    case Chars.LowerR:
      return '\r';
    case Chars.SingleQuote:
      return "'";
    case Chars.DoubleQuote:
      return '"';

    // ASCII escapes
    case Chars.LowerX:
      const ch1 = parser.source.charCodeAt(parser.index);
      const hi = toHex(ch1);
      if (hi < 0)
        if ((context & Context.TaggedTemplate) !== Context.TaggedTemplate) {
          addDiagnostic(
            parser,
            context,
            DiagnosticSource.Lexer,
            DiagnosticCode.InvalidHexEscapeSequence,
            DiagnosticKind.Error
          );
        }
      parser.index++;
      const ch2 = parser.source.charCodeAt(parser.index);
      const lo = toHex(ch2);
      if (lo < 0)
        if ((context & Context.TaggedTemplate) !== Context.TaggedTemplate) {
          addDiagnostic(
            parser,
            context,
            DiagnosticSource.Lexer,
            DiagnosticCode.InvalidHexEscapeSequence,
            DiagnosticKind.Error
          );
        }

      return (hi << 4) | lo;

    // UCS-2/Unicode escapes
    case Chars.LowerU:
      ch = parser.source.charCodeAt(parser.index);

      if (ch === Chars.LeftBrace) {
        parser.index++; // skips: '{'

        // \u{N}
        // The first digit is required, so handle it *out* of the loop.
        ch = parser.source.charCodeAt(parser.index);

        let digit = toHex(ch);

        if (digit < 0) {
          if ((context & Context.TaggedTemplate) !== Context.TaggedTemplate) {
            addDiagnostic(
              parser,
              context,
              DiagnosticSource.Lexer,
              DiagnosticCode.InvalidHexEscapeSequence,
              DiagnosticKind.Error
            );
          }
          return -1;
        }
        let code = 0;

        while (digit >= 0) {
          code = (code << 4) | digit;
          // Check this early to avoid `code` wrapping to a negative on overflow (which is
          // reserved for abnormal conditions).
          if (code > Chars.LastUnicodeChar) {
            if ((context & Context.TaggedTemplate) !== Context.TaggedTemplate) {
              addDiagnostic(
                parser,
                context,
                DiagnosticSource.Lexer,
                DiagnosticCode.UnicodeOverflow,
                DiagnosticKind.Error
              );
            }
            return -1;
          }
          digit = toHex((ch = parser.source.charCodeAt(++parser.index)));
        }
        if (parser.source.charCodeAt(parser.index) !== Chars.RightBrace) {
          if ((context & Context.TaggedTemplate) !== Context.TaggedTemplate) {
            addDiagnostic(
              parser,
              context,
              DiagnosticSource.Lexer,
              DiagnosticCode.InvalidHexEscapeSequence,
              DiagnosticKind.Error
            );
          }
          return -1;
        }
        return fromCodePoint(code);
      }

      // \uNNNN
      let code = 0;

      for (let i = 0; i < 4; i++) {
        let digit = toHex(ch);

        if (digit < 0) {
          if ((context & Context.TaggedTemplate) !== Context.TaggedTemplate) {
            addDiagnostic(
              parser,
              context,
              DiagnosticSource.Lexer,
              DiagnosticCode.InvalidHexEscapeSequence,
              DiagnosticKind.Error
            );
          }
          return -1;
        }
        code = (code << 4) | digit;
        ch = parser.source.charCodeAt(++parser.index);
      }
      return fromCodePoint(code);

    case Chars.Zero: // fall through
    case Chars.One: // fall through
    case Chars.Two: // fall through
    case Chars.Three: // fall through
    case Chars.Four: // fall through
    case Chars.Five: // fall through
    case Chars.Six: // fall through
    case Chars.Seven:
      const next = parser.source.charCodeAt(parser.index);

      // NotEscapeSequence :
      //   0 DecimalDigit
      //   DecimalDigit but not 0

      if (ch === Chars.Zero && (next < Chars.Zero || next > Chars.Nine)) return '\0';

      if ((context & Context.TaggedTemplate) !== Context.TaggedTemplate) {
        addDiagnostic(parser, context, DiagnosticSource.Lexer, DiagnosticCode.TemplateBadEscape, DiagnosticKind.Error);
      }

      // Continue to parse out the octal escapes in 'recovery mode' as if we were in sloppy mode
      // even if template literals may not contain octal escape sequences

      if (next >= Chars.Zero && next <= Chars.Nine) parser.index++;
      return -1;

    // `8`, `9` (invalid escapes)
    case Chars.Eight:
    case Chars.Nine:
      if ((context & Context.TaggedTemplate) !== Context.TaggedTemplate) {
        addDiagnostic(parser, context, DiagnosticSource.Lexer, DiagnosticCode.TemplateBadEscape, DiagnosticKind.Error);
      }
      return -1;
  }

  // Other escaped characters are interpreted as their non-escaped version.
  return fromCodePoint(ch);
}

export function scanTemplateTail(parser: ParserState, context: Context): boolean {
  if (parser.index >= parser.length) {
    addDiagnostic(parser, context, DiagnosticSource.Lexer, DiagnosticCode.UnterminatedTemplate, DiagnosticKind.Error);
    return false;
  }

  parser.index--;
  parser.token = scanTemplateSpan(parser, context);
  return true;
}