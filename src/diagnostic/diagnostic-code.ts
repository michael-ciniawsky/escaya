/**
 * Unique codes for each diagnostic message which can be generated.
 */
export enum DiagnosticCode {
  Unexpected,
  UnexpectedKeyword,
  UnexpectedIdentifier,
  UnexpectedEOF,
  ExpectedIdentifier,
  Expected,
  UnexpectedToken,
  ExpectedExpression,
  ExpectedStatement,
  InvalidCharacter,
  MissingFuncName,
  MissingClassName,
  UnterminatedRegExp,
  DuplicateRegExpFlag,
  UnknownRegExpFlag,
  ExpectedParamDecl,
  ExpectedVarOrLexDecl,
  ExpectedForDecl,
  StrictModeReserved,
  ExpectedBindingIdent,
  ExpectedAnIdentifier,
  UnexpectedYieldAsIdent,
  UnexpectedAwaitAsIdent,
  AwaitInParameter,
  YieldInParameter,
  NewlineAfterThrow,
  IllegalReturn,
  CompundArrLit,
  CompundObjLit,
  ExpectedImportDecl,
  ExpectedExportDecl,
  InvalidSuperProperty,
  InvalidSuperCall,
  ChainingNoSuper,
  InvalidExponentation,
  StrictDelete,
  ColonExpected,
  YieldAsIdent,
  AwaitAsIdent,
  ExpectedAccessor,
  StaticPrototype,
  InvalidBreak,
  IllegalContinue,
  StrictWith,
  InvalidCoalescing,
  MissingDestructInit,
  ExpectedArrow,

  // Lexer
  InvalidTrailSurrogate,
  InvalidUnicodeEscapeSequence,
  UnicodeOverflow,
  InvalidHexEscapeSequence,
  InvalidAstralCharacter,
  UnterminatedTemplate,
  UnsupportedUnicodeIdent,
  TemplateBadEscape,
  UnterminatedString,
  StrictOctalEscape,
  InvalidEightAndNine,

  IdafterNumber,
  MissingExponent,
  InvalidBigIntLiteral,
  UnexpectedIdentNumber,
  BinarySequenceNoDigits,
  OctalSequenceNoDigits,
  HexSequenceNoDigits,
  BinarySequence,
  OctalSequence,
  StrictOctal,
  UnknownDigit,
  ContinuousNumericSeparator,
  TrailingNumericSeparator,
  UnderscoreAfterZero,
  SeparatorsDisallowed,
  DisallowedLetInStrict,
  ForOfLet,
  StrictFunction,
  WebCompatFunction,
  SloppyFunction,
  ClassForbiddenAsStatement,
  AsyncFunctionInSingleStatementContext,
  ChainNoTemplate,
  BlockBodyAccessedWithoutGroup,
  ArrowOperatorToRight,
  BlockBodyInvokedWithoutGroup,
  BlockBodyTaggedWithoutGroup,
  StrictInvalidLetInExprPos,
  UnclosedComment,
  InvalidLetConstBinding,
  YieldAsFuncName,
  AwaitAsFuncName,
  UnexpectedYieldAsBIdent,
  UnexpectedAwaitAsBIdent,
  ExpectedSemicolon,
  InvalidNewTarget,
  ExportInScript,
  ImportInScript,
  InvalidBindingDestruct,
  InvalidLHS,
  LHSPreOp,
  LHSPostOp,
  ObjCoverInit,
  ForbiddenTrailing,
  InvalidSPI,

  /* Annex B */
  AnnexBB32,
  AnnexBB34
}
