import { Token } from './../ast/token';
import { Context, ParserState } from '../common';
import { toHex, fromCodePoint } from './common';
import { addDiagnostic, addLexerDiagnostic, DiagnosticSource, DiagnosticKind } from '../diagnostic';
import { DiagnosticCode } from '../diagnostic/diagnostic-code';
import { Char } from './char';
import { AsciiCharFlags, AsciiCharTypes } from './asciiChar';

export const leadingZeroChar = [
  /*   0 - Null               */ Char.Unknown,
  /*   1 - Start of Heading   */ Char.Unknown,
  /*   2 - Start of Text      */ Char.Unknown,
  /*   3 - End of Text        */ Char.Unknown,
  /*   4 - End of Transm.     */ Char.Unknown,
  /*   5 - Enquiry            */ Char.Unknown,
  /*   6 - Acknowledgment     */ Char.Unknown,
  /*   7 - Bell               */ Char.Unknown,
  /*   8 - Backspace          */ Char.Unknown,
  /*   9 - Horizontal Tab     */ Char.Unknown,
  /*  10 - Line Feed          */ Char.Unknown,
  /*  11 - Vertical Tab       */ Char.Unknown,
  /*  12 - Form Feed          */ Char.Unknown,
  /*  13 - Carriage Return    */ Char.Unknown,
  /*  14 - Shift Out          */ Char.Unknown,
  /*  15 - Shift In           */ Char.Unknown,
  /*  16 - Data Line Escape   */ Char.Unknown,
  /*  17 - Device Control 1   */ Char.Unknown,
  /*  18 - Device Control 2   */ Char.Unknown,
  /*  19 - Device Control 3   */ Char.Unknown,
  /*  20 - Device Control 4   */ Char.Unknown,
  /*  21 - Negative Ack.      */ Char.Unknown,
  /*  22 - Synchronous Idle   */ Char.Unknown,
  /*  23 - End of Transmit    */ Char.Unknown,
  /*  24 - Cancel             */ Char.Unknown,
  /*  25 - End of Medium      */ Char.Unknown,
  /*  26 - Substitute         */ Char.Unknown,
  /*  27 - Escape             */ Char.Unknown,
  /*  28 - File Separator     */ Char.Unknown,
  /*  29 - Group Separator    */ Char.Unknown,
  /*  30 - Record Separator   */ Char.Unknown,
  /*  31 - Unit Separator     */ Char.Unknown,
  /*  32 - Space              */ Char.Unknown,
  /*  33 - !                  */ Char.Unknown,
  /*  34 - "                  */ Char.Unknown,
  /*  35 - #                  */ Char.Unknown,
  /*  36 - $                  */ Char.Unknown,
  /*  37 - %                  */ Char.Unknown,
  /*  38 - &                  */ Char.Unknown,
  /*  39 - '                  */ Char.Unknown,
  /*  40 - (                  */ Char.Unknown,
  /*  41 - )                  */ Char.Unknown,
  /*  42 - *                  */ Char.Unknown,
  /*  43 - +                  */ Char.Plus,
  /*  44 - ,                  */ Char.Unknown,
  /*  45 - -                  */ Char.Hyphen,
  /*  46 - .                  */ Char.Period,
  /*  47 - /                  */ Char.Unknown,
  /*  48 - 0                  */ Char.Zero,
  /*  49 - 1                  */ Char.One,
  /*  50 - 2                  */ Char.Two,
  /*  51 - 3                  */ Char.Three,
  /*  52 - 4                  */ Char.Four,
  /*  53 - 5                  */ Char.Five,
  /*  54 - 6                  */ Char.Six,
  /*  55 - 7                  */ Char.Seven,
  /*  56 - 8                  */ Char.Eight,
  /*  57 - 9                  */ Char.Nine,
  /*  58 - :                  */ Char.Unknown,
  /*  59 - ;                  */ Char.Unknown,
  /*  60 - <                  */ Char.Unknown,
  /*  61 - =                  */ Char.Unknown,
  /*  62 - >                  */ Char.Unknown,
  /*  63 - ?                  */ Char.Unknown,
  /*  64 - @                  */ Char.Unknown,
  /*  65 - A                  */ Char.UpperA,
  /*  66 - B                  */ Char.UpperB,
  /*  67 - C                  */ Char.UpperC,
  /*  68 - D                  */ Char.UpperD,
  /*  69 - E                  */ Char.UpperE,
  /*  70 - F                  */ Char.UpperF,
  /*  71 - G                  */ Char.Unknown,
  /*  72 - H                  */ Char.Unknown,
  /*  73 - I                  */ Char.Unknown,
  /*  74 - J                  */ Char.Unknown,
  /*  75 - K                  */ Char.Unknown,
  /*  76 - L                  */ Char.Unknown,
  /*  77 - M                  */ Char.Unknown,
  /*  78 - N                  */ Char.Unknown,
  /*  79 - O                  */ Char.UpperO,
  /*  80 - P                  */ Char.Unknown,
  /*  81 - Q                  */ Char.Unknown,
  /*  82 - R                  */ Char.Unknown,
  /*  83 - S                  */ Char.Unknown,
  /*  84 - T                  */ Char.Unknown,
  /*  85 - U                  */ Char.Unknown,
  /*  86 - V                  */ Char.Unknown,
  /*  87 - W                  */ Char.Unknown,
  /*  88 - X                  */ Char.UpperX,
  /*  89 - Y                  */ Char.Unknown,
  /*  90 - Z                  */ Char.Unknown,
  /*  91 - [                  */ Char.Unknown,
  /*  92 - \                  */ Char.Unknown,
  /*  93 - ]                  */ Char.Unknown,
  /*  94 - ^                  */ Char.Unknown,
  /*  95 - _                  */ Char.Underscore,
  /*  96 - `                  */ Char.Unknown,
  /*  97 - a                  */ Char.LowerA,
  /*  98 - b                  */ Char.LowerB,
  /*  99 - c                  */ Char.LowerC,
  /* 100 - d                  */ Char.LowerD,
  /* 101 - e                  */ Char.LowerE,
  /* 102 - f                  */ Char.LowerF,
  /* 103 - g                  */ Char.Unknown,
  /* 104 - h                  */ Char.Unknown,
  /* 105 - i                  */ Char.Unknown,
  /* 106 - j                  */ Char.Unknown,
  /* 107 - k                  */ Char.Unknown,
  /* 108 - l                  */ Char.Unknown,
  /* 109 - m                  */ Char.Unknown,
  /* 110 - n                  */ Char.LowerN,
  /* 111 - o                  */ Char.LowerO,
  /* 112 - p                  */ Char.Unknown,
  /* 113 - q                  */ Char.Unknown,
  /* 114 - r                  */ Char.Unknown,
  /* 115 - s                  */ Char.Unknown,
  /* 116 - t                  */ Char.Unknown,
  /* 117 - u                  */ Char.Unknown,
  /* 118 - v                  */ Char.Unknown,
  /* 119 - w                  */ Char.Unknown,
  /* 120 - x                  */ Char.LowerX,
  /* 121 - y                  */ Char.Unknown,
  /* 122 - z                  */ Char.Unknown,
  /* 123 - {                  */ Char.Unknown,
  /* 124 - |                  */ Char.Unknown,
  /* 125 - }                  */ Char.Unknown,
  /* 126 - ~                  */ Char.Unknown,
  /* 127 - Delete             */ Char.Unknown
];

export function scanNumber(state: ParserState, context: Context, ch: number, isFloat: boolean): Token {
  state.index -= 1;
  const start = state.index;

  const enum NumberKind {
    None = 0,
    Decimal = 1 << 0,
    Hex = 1 << 1,
    Octal = 1 << 2,
    Binary = 1 << 3,
    DecimalWithLeadingZero = 1 << 9,
    ImplicitOctal = 1 << 10
  }

  // Optimization: most decimal values fit into 4 bytes.
  let value = 0;
  let type = NumberKind.Decimal;
  let disallowBigInt = false;
  let source = state.source;
  let index = state.index;

  ch = state.source.charCodeAt(index);

  if (isFloat) {
    do {
      ch = source.charCodeAt(++index);
    } while (ch <= Char.Nine && ch >= Char.Zero);

    disallowBigInt = true;
  } else {
    // Zero digits - '0' - is structured as an optimized finite state machine
    // and does a quick scan for a hexadecimal, binary, octal or implicit octal
    if (ch === Char.Zero) {
      index++; // skips '0'

      ch = source.charCodeAt(index);

      if (AsciiCharTypes[ch] & AsciiCharFlags.OctHexBin) {
        let digits = 0;
        let allowSeparator: 0 | 1 = 1;
        let separatorAllowed = false;
        let isPreviousTokenSeparator = false;

        loop: do {
          switch (leadingZeroChar[ch]) {
            // `x`, `X`
            case Char.LowerX:
            case Char.UpperX:
              if (type & 0b00001110) {
                addDiagnostic(
                  state,
                  context,
                  DiagnosticSource.Lexer,
                  DiagnosticCode.UnexpectedIdentNumber,
                  DiagnosticKind.Error
                );
                break loop;
              }
              type = NumberKind.Hex;
              break;

            // `b`, `B`
            case Char.LowerB:
            case Char.UpperB:
              if (type === NumberKind.Hex) {
                allowSeparator = 0;
                isPreviousTokenSeparator = false;
                value = value * 0x0010 + toHex(ch);
                break;
              }

              if (type & 0b00001100) {
                addDiagnostic(
                  state,
                  context,
                  DiagnosticSource.Lexer,
                  DiagnosticCode.UnexpectedIdentNumber,
                  DiagnosticKind.Error
                );
                break loop;
              }

              type = NumberKind.Binary;
              break;

            // `o`, `O`
            case Char.LowerO:
            case Char.UpperO:
              if (type & 0b00001110) {
                addDiagnostic(
                  state,
                  context,
                  DiagnosticSource.Lexer,
                  DiagnosticCode.UnexpectedIdentNumber,
                  DiagnosticKind.Error
                );
                break loop;
              }
              type = NumberKind.Octal;
              break;

            // `0`...`7`
            case Char.Zero:
            case Char.One:
              if (type & NumberKind.Binary) {
                allowSeparator = 0;
                isPreviousTokenSeparator = false;
                value = value * 2 + (ch - Char.Zero);
                break;
              }
            case Char.Two:
            case Char.Three:
            case Char.Four:
            case Char.Five:
            case Char.Six:
            case Char.Seven:
              if (type & NumberKind.Octal) {
                allowSeparator = 0;
                isPreviousTokenSeparator = false;
                value = value * 8 + (ch - Char.Zero);
                break;
              }

            // `8`...`9`, `a-f`...`A-F`
            case Char.Eight:
            case Char.Nine:
            case Char.LowerA:
            case Char.LowerC:
            case Char.LowerD:
            case Char.LowerE:
            case Char.LowerF:
            case Char.UpperA:
            case Char.UpperC:
            case Char.UpperD:
            case Char.UpperE:
            case Char.UpperF:
              if (type & NumberKind.Hex) {
                allowSeparator = 0;
                isPreviousTokenSeparator = false;
                value = value * 0x0010 + toHex(ch);
                break;
              }
              addLexerDiagnostic(
                state,
                context,
                index,
                index,
                type & NumberKind.Binary ? DiagnosticCode.BinarySequence : DiagnosticCode.OctalSequence
              );
              break loop;

            // `_`
            case Char.Underscore:
              if (allowSeparator === 0) {
                // For cases like '0b1__2' we need to consume '__' so we can correctly parse out two
                // numeric literal - '1' - and '2'. '0b' and '__' are invalid characters and should
                // only be consumed.
                if (state.source.charCodeAt(index + 1) === Char.Underscore) {
                  addLexerDiagnostic(state, context, index, index + 1, DiagnosticCode.ContinuousNumericSeparator);
                  state.index += 5;
                  state.tokenValue = value;
                  return Token.NumericLiteral;
                }
                addLexerDiagnostic(state, context, index, index + 1, DiagnosticCode.SeparatorsDisallowed);
              }
              allowSeparator = 1;
              break;
            // `n`
            case Char.LowerN:
              state.tokenValue = value;
              state.index = index + 1;
              return Token.BigIntLiteral;
          }

          digits++;
          index++;
          ch = source.charCodeAt(index);
        } while (AsciiCharTypes[ch] & (AsciiCharFlags.IsSeparator | AsciiCharFlags.Hex | AsciiCharFlags.OctHexBin));

        if (AsciiCharTypes[ch] & 0b000000011) {
          addLexerDiagnostic(state, context, index, index, DiagnosticCode.IdafterNumber);
          index++; // skip invalid chars
        }

        if (type & 0b00001110 && digits <= 1) {
          addLexerDiagnostic(
            state,
            context,
            index - 1,
            index,
            type & NumberKind.Binary
              ? // Binary integer literal like sequence without any digits
                DiagnosticCode.BinarySequenceNoDigits
              : type & NumberKind.Octal
              ? // Octal integer literal like sequence without any digits
                DiagnosticCode.OctalSequenceNoDigits
              : // Hex integer literal like sequence without any digits
                DiagnosticCode.HexSequenceNoDigits
          );

          // We can't avoid this branching if we want to avoid double diagnostics, or
          // we can but it will require use of 2x 'charCodeAt' and some unnecessary
          // property / meber access.
        } else if (allowSeparator === 1) {
          // It's more performance and memory friendly to do a 'start + 2' here rather than
          // than to give the 'start' variable a new value.
          addLexerDiagnostic(state, context, start + 2, index + 1, DiagnosticCode.TrailingNumericSeparator);
        }

        state.index = index;
        state.tokenValue = value;
        return Token.NumericLiteral;
      }

      // Implicit octal with fallback to decimal with leading zero
      if (ch >= Char.Zero && ch <= Char.Eight) {
        // Octal integer literals are not permitted in strict mode code
        if (context & Context.Strict) {
          addLexerDiagnostic(state, context, start, index, DiagnosticCode.StrictOctal);
        }

        // BigInt suffix is invalid in non-octal decimal integer literal,
        // so we need to set 'disallowBigInt' to 'true' here
        disallowBigInt = true;

        type = NumberKind.ImplicitOctal;

        do {
          value = value * 8 + (ch - Char.Zero);

          ch = source.charCodeAt(++index);

          if (ch >= Char.Eight) {
            type = NumberKind.DecimalWithLeadingZero;
            break;
          }
        } while (ch >= Char.Zero && ch <= Char.Nine);

        if (ch === Char.Underscore) {
          addLexerDiagnostic(state, context, start + 1, index, DiagnosticCode.UnderscoreAfterZero);
        }

        // BigInt suffix is disallowed in legacy octal integer literal
        if (ch === Char.LowerN) {
          addLexerDiagnostic(state, context, index, index, DiagnosticCode.InvalidBigIntLiteral);
        }

        if (type === NumberKind.ImplicitOctal) {
          state.index = index;
          state.tokenValue = value;
          return Token.NumericLiteral;
        }
      }
    }

    let digit = 9;

    while (ch <= Char.Nine && ch >= Char.Zero) {
      value = value * 10 + (ch - Char.Zero);
      ch = source.charCodeAt(++index);
      --digit;
    }

    if (
      digit >= 0 &&
      (AsciiCharTypes[ch] & 0b000000011) === 0 &&
      type !== NumberKind.DecimalWithLeadingZero &&
      ch !== Char.Period
    ) {
      // Most numbers are pure decimal integers without fractional component
      // or exponential notation - handle that with optimized code
      state.tokenValue = value;
      state.index = index;
      return Token.NumericLiteral;
    }

    if (ch === Char.Period) {
      disallowBigInt = true;
      ch = source.charCodeAt(++index);
      while (ch <= Char.Nine && ch >= Char.Zero) {
        ch = source.charCodeAt(++index);
      }
    }
  }

  if (ch === Char.LowerN) {
    if (disallowBigInt) {
      // It's safe to continue to parse as normal in 'recovery mode'
      addLexerDiagnostic(state, context, index, index, DiagnosticCode.InvalidBigIntLiteral);
    }
    state.tokenValue = source.slice(start, index);
    state.index = index + 1; // skips: 'n'
    return Token.BigIntLiteral;
  }

  if ((ch | 32) === Char.LowerE) {
    index++;
    ch = source.charCodeAt(index);

    // '-', '+'
    if (ch === Char.Plus || ch === Char.Hyphen) {
      index++;
      ch = source.charCodeAt(index);
    }
    let digits = 0;

    while (ch <= Char.Nine && ch >= Char.Zero) {
      ch = source.charCodeAt(++index);
      digits++;
    }
    if (digits === 0) {
      addLexerDiagnostic(state, context, index, index, DiagnosticCode.MissingExponent);
      // For cases like '1e!', '1e€' etc we do a 'index + 1' so we can consume the
      // invalid char. If we do it this way, we will avoid parsing out an invalid
      // 'UnaryExpression for cases like '1e!' and for this last case - '1e€', the '€'
      // will be consumed anyway and never seen again.
      index++;
    }
  }
  // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
  // The SourceCharacter immediately following a NumericLiteral must not be an IdentifierStart or DecimalDigit.
  // For example : 3in is an error and not the two input elements 3 and in
  if ((AsciiCharTypes[ch] & 0b00000000000000000000000000000011) > 0) {
    addLexerDiagnostic(state, context, index, index, DiagnosticCode.IdafterNumber);
  }

  state.index = index;
  state.tokenValue = parseFloat(source.slice(start, index));
  return Token.NumericLiteral;
}
