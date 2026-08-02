import { ABCIResponseBase, TM2Error } from "@gnolang/tm2-js-client";

//#region src/provider/errors/errors.d.ts
/**
 * Amino type URLs of the errors a Gno node can report through
 * `ResponseBase.Error`.
 *
 * The `/vm.*` entries mirror the types registered in
 * gno.land/pkg/sdk/vm/package.go; `/abci.StringError` is the tm2 catch-all
 * used for anything that is not an ABCI error type (a VM panic, most notably).
 */
declare enum GnoErrorType {
  INVALID_PKG_PATH = "/vm.InvalidPkgPathError",
  NO_RENDER_DECL = "/vm.NoRenderDeclError",
  PKG_EXIST = "/vm.PkgExistError",
  INVALID_STMT = "/vm.InvalidStmtError",
  INVALID_EXPR = "/vm.InvalidExprError",
  TYPE_CHECK = "/vm.TypeCheckError",
  UNAUTHORIZED_USER = "/vm.UnauthorizedUserError",
  INVALID_PACKAGE = "/vm.InvalidPackageError",
  INVALID_FILE = "/vm.InvalidFileError",
  OBJECT_NOT_FOUND = "/vm.ObjectNotFoundError",
  STRING = "/abci.StringError"
}
/**
 * Base class for errors the node reports inside `ResponseBase.Error`.
 *
 * These are application-level failures: the RPC call itself succeeded (the
 * node answered with HTTP 200), but the query was refused. `type` carries the
 * amino type URL so callers can branch on the exact condition without parsing
 * messages, and `log` keeps the untouched `ResponseBase.Log` (a Go stack
 * trace) for debugging.
 */
declare class GnoABCIError extends TM2Error {
  /** The amino type URL of the error, e.g. `/vm.NoRenderDeclError` */
  readonly type: string;
  constructor(type: string, message: string, log?: string);
}
/** The requested package path does not exist on chain */
declare class InvalidPkgPathError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/** The package exists but declares no `Render` function */
declare class NoRenderDeclError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/** The package path is already taken */
declare class PkgExistError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/** The submitted statement could not be parsed */
declare class InvalidStmtError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/** The submitted expression could not be parsed */
declare class InvalidExprError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/** The package did not pass type checking */
declare class TypeCheckError extends GnoABCIError {
  /** The individual type-check failures, as reported by the node */
  readonly errors: string[];
  constructor(errors?: string[], message?: string, log?: string);
}
/** The caller is not allowed to perform the operation */
declare class UnauthorizedUserError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/** The package is malformed or unavailable */
declare class InvalidPackageError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/** The requested file is not part of the package */
declare class InvalidFileError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/** The referenced object does not exist */
declare class ObjectNotFoundError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/**
 * A failure the node could not express as a typed ABCI error — most commonly
 * a VM panic. The message is the panic text.
 */
declare class StringError extends GnoABCIError {
  constructor(message?: string, log?: string);
}
/**
 * Extracts the human-readable message out of a `ResponseBase.Log`.
 *
 * tm2 renders wrapped errors as:
 *
 * ```
 * --= Error =--
 * Data: vm.InvalidPkgPathError{...}
 * Msg Traces:
 *     0  /gnoroot/gno.land/pkg/sdk/vm/errors.go:58 - package not found: gno.land/r/does/not/exist
 * Stack Trace:
 *     ...
 * ```
 *
 * The first msg trace is the innermost — and most specific — message, so that
 * is what gets surfaced. Errors that were never wrapped have no `Msg Traces:`
 * block at all (the log is just the Go dump of the error value), in which case
 * there is nothing to extract.
 * @param {string} [log] the raw `ResponseBase.Log`
 * @returns {string | undefined} the extracted message, if any
 */
declare const parseABCIErrorLog: (log?: string) => string | undefined;
/**
 * Builds the appropriate error for a populated `ResponseBase.Error`.
 *
 * The node reports VM-level failures with HTTP 200 and a null `Data`, so the
 * only way to tell a missing package from a package without a `Render` is to
 * read this object; the message is recovered from the error value itself when
 * it carries one, and from the log otherwise.
 * @param {object} error the `ResponseBase.Error` object
 * @param {string} [log] the accompanying `ResponseBase.Log`
 * @returns {GnoABCIError} the typed error
 */
declare const constructGnoError: (error: NonNullable<ABCIResponseBase["Error"]>, log?: string) => GnoABCIError;
/**
 * Throws the matching {@link GnoABCIError} when the node reported a failure.
 *
 * VM failures come back as a regular HTTP 200 response with `Data: null`, so
 * this has to be called before any attempt to read the payload — otherwise the
 * caller only sees an uninitialized response and loses the actual cause.
 * @param {ABCIResponseBase} responseBase the `ResponseBase` of the ABCI response
 */
declare const assertNoABCIError: (responseBase: ABCIResponseBase) => void;
//#endregion
export { GnoABCIError, GnoErrorType, InvalidExprError, InvalidFileError, InvalidPackageError, InvalidPkgPathError, InvalidStmtError, NoRenderDeclError, ObjectNotFoundError, PkgExistError, StringError, TypeCheckError, UnauthorizedUserError, assertNoABCIError, constructGnoError, parseABCIErrorLog };
//# sourceMappingURL=errors.d.mts.map