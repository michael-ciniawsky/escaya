import { BindingType, Context, ParserState, Flags } from '../common';
import { ScopeKind } from './common';
import { addEarlyDiagnostic, addDiagnostic, DiagnosticKind, DiagnosticSource } from '../diagnostic';
import { DiagnosticCode } from '../diagnostic/diagnostic-code';
import { Constants } from '../constants';

/**
 * Lexical scope interface
 */
export interface ScopeState {
  parent: ScopeState | undefined;
  type: ScopeKind;
  scopeError?: ScopeError | null;
}

/** Scope error interface */
export interface ScopeError {
  code: DiagnosticCode;
  start: number;
}

export function createScope(): ScopeState {
  return {
    parent: void 0,
    type: ScopeKind.Block
  };
}

export function createParentScope(parent: ScopeState | undefined, type: ScopeKind): ScopeState {
  return {
    parent,
    type,
    scopeError: void 0
  };
}
export function addVarOrBlock(
  parser: ParserState,
  context: Context,
  scope: ScopeState,
  name: string,
  bindingType: BindingType
  // origin: Origin
) {
  if (bindingType & BindingType.Var) {
    addVarName(parser, context, scope, name, bindingType);
  } else {
    addBlockName(parser, context, scope, name, bindingType /*, origin*/);
  }
}

export function addVarName(
  state: ParserState,
  context: Context,
  scope: ScopeState,
  name: string,
  bindingType: BindingType
): void {
  if (scope) {
    let currentScope: any = scope;
    while (currentScope && (currentScope.type & ScopeKind.FunctionRoot) === 0) {
      if (currentScope['#' + name] & (BindingType.Let | BindingType.Const | BindingType.FunctionLexical)) {
        addEarlyDiagnostic(state, context, DiagnosticCode.DupLexBind, name);
      } else if (currentScope['#' + name] & (BindingType.CatchIdentifier | BindingType.CatchPattern)) {
        if (context & Constants.StrictOrNoWebCompat || (currentScope['#' + name] & BindingType.CatchIdentifier) === 0) {
          addEarlyDiagnostic(state, context, DiagnosticCode.BoundClause, name);
        }
      }

      currentScope['#' + name] = bindingType;

      currentScope = currentScope.parent;
    }
  }
}

export function addBlockName(
  state: ParserState,
  context: Context,
  scope: any,
  name: string,
  bindingType: BindingType
  // origin: Origin
) {
  if (scope) {
    const value = scope['#' + name];

    if (value && (value & BindingType.Empty) === 0) {
      if (bindingType & BindingType.ArgumentList) {
        scope.scopeError = { start: state.startIndex, key: name, code: DiagnosticCode.DuplicateIdentifier };
      } else if (
        (context & Context.OptionsDisableWebCompat) !== Context.OptionsDisableWebCompat &&
        value & BindingType.FunctionLexical &&
        context & Context.InBlock
      ) {
      } else {
        addEarlyDiagnostic(state, context, DiagnosticCode.DupBind, name);
      }
    }

    if (
      scope.type & ScopeKind.FunctionBody &&
      scope.parent['#' + name] &&
      (scope.parent['#' + name] & BindingType.Empty) === 0
    ) {
      addEarlyDiagnostic(state, context, DiagnosticCode.DupBind, name);
    }

    if (scope.type & ScopeKind.ArrowParams && value && (value & BindingType.Empty) === 0) {
      if (bindingType & BindingType.ArgumentList) {
        scope.scopeError = { start: state.startIndex, key: name, code: DiagnosticCode.DuplicateIdentifier };
      }
    }

    if (scope.type & ScopeKind.CatchBlock) {
      if (scope.parent['#' + name] & (BindingType.CatchIdentifier | BindingType.CatchPattern)) {
        addEarlyDiagnostic(state, context, DiagnosticCode.ShadowClause, name);
      }
    }

    scope['#' + name] = bindingType;
  }
}
