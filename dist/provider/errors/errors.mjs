import { _defineProperty } from "../../_virtual/_@oxc-project_runtime@0.122.0/helpers/defineProperty.mjs";
import { ABCIErrorKey, TM2Error } from "@gnolang/tm2-js-client";
//#region src/provider/errors/errors.ts
/**
* Amino type URLs of the errors a Gno node can report through
* `ResponseBase.Error`.
*
* The `/vm.*` entries mirror the types registered in
* gno.land/pkg/sdk/vm/package.go; `/abci.StringError` is the tm2 catch-all
* used for anything that is not an ABCI error type (a VM panic, most notably).
*/
let GnoErrorType = /* @__PURE__ */ function(GnoErrorType) {
	GnoErrorType["INVALID_PKG_PATH"] = "/vm.InvalidPkgPathError";
	GnoErrorType["NO_RENDER_DECL"] = "/vm.NoRenderDeclError";
	GnoErrorType["PKG_EXIST"] = "/vm.PkgExistError";
	GnoErrorType["INVALID_STMT"] = "/vm.InvalidStmtError";
	GnoErrorType["INVALID_EXPR"] = "/vm.InvalidExprError";
	GnoErrorType["TYPE_CHECK"] = "/vm.TypeCheckError";
	GnoErrorType["UNAUTHORIZED_USER"] = "/vm.UnauthorizedUserError";
	GnoErrorType["INVALID_PACKAGE"] = "/vm.InvalidPackageError";
	GnoErrorType["INVALID_FILE"] = "/vm.InvalidFileError";
	GnoErrorType["OBJECT_NOT_FOUND"] = "/vm.ObjectNotFoundError";
	GnoErrorType["STRING"] = "/abci.StringError";
	return GnoErrorType;
}({});
/**
* Base class for errors the node reports inside `ResponseBase.Error`.
*
* These are application-level failures: the RPC call itself succeeded (the
* node answered with HTTP 200), but the query was refused. `type` carries the
* amino type URL so callers can branch on the exact condition without parsing
* messages, and `log` keeps the untouched `ResponseBase.Log` (a Go stack
* trace) for debugging.
*/
var GnoABCIError = class extends TM2Error {
	constructor(type, message, log) {
		super(message, log);
		_defineProperty(this, "type", void 0);
		this.type = type;
		this.name = type.startsWith("/") ? type.slice(1) : type;
	}
};
/** The requested package path does not exist on chain */
var InvalidPkgPathError = class extends GnoABCIError {
	constructor(message = "invalid package path", log) {
		super(GnoErrorType.INVALID_PKG_PATH, message, log);
	}
};
/** The package exists but declares no `Render` function */
var NoRenderDeclError = class extends GnoABCIError {
	constructor(message = "render function not declared", log) {
		super(GnoErrorType.NO_RENDER_DECL, message, log);
	}
};
/** The package path is already taken */
var PkgExistError = class extends GnoABCIError {
	constructor(message = "package already exists", log) {
		super(GnoErrorType.PKG_EXIST, message, log);
	}
};
/** The submitted statement could not be parsed */
var InvalidStmtError = class extends GnoABCIError {
	constructor(message = "invalid statement", log) {
		super(GnoErrorType.INVALID_STMT, message, log);
	}
};
/** The submitted expression could not be parsed */
var InvalidExprError = class extends GnoABCIError {
	constructor(message = "invalid expression", log) {
		super(GnoErrorType.INVALID_EXPR, message, log);
	}
};
/** The package did not pass type checking */
var TypeCheckError = class extends GnoABCIError {
	constructor(errors = [], message, log) {
		super(GnoErrorType.TYPE_CHECK, message ?? ["invalid gno package; type check errors:", ...errors].join("\n"), log);
		_defineProperty(this, "errors", void 0);
		this.errors = errors;
	}
};
/** The caller is not allowed to perform the operation */
var UnauthorizedUserError = class extends GnoABCIError {
	constructor(message = "unauthorized user", log) {
		super(GnoErrorType.UNAUTHORIZED_USER, message, log);
	}
};
/** The package is malformed or unavailable */
var InvalidPackageError = class extends GnoABCIError {
	constructor(message = "invalid package", log) {
		super(GnoErrorType.INVALID_PACKAGE, message, log);
	}
};
/** The requested file is not part of the package */
var InvalidFileError = class extends GnoABCIError {
	constructor(message = "file is not available", log) {
		super(GnoErrorType.INVALID_FILE, message, log);
	}
};
/** The referenced object does not exist */
var ObjectNotFoundError = class extends GnoABCIError {
	constructor(message = "object not found", log) {
		super(GnoErrorType.OBJECT_NOT_FOUND, message, log);
	}
};
/**
* A failure the node could not express as a typed ABCI error — most commonly
* a VM panic. The message is the panic text.
*/
var StringError = class extends GnoABCIError {
	constructor(message = "unknown error", log) {
		super(GnoErrorType.STRING, message, log);
	}
};
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
const parseABCIErrorLog = (log) => {
	if (!log) return;
	const tracesAt = log.indexOf("Msg Traces:");
	if (tracesAt < 0) return;
	let traces = log.slice(tracesAt + 11);
	for (const terminator of ["\nStack Trace:", "\n--= /Error =--"]) {
		const end = traces.indexOf(terminator);
		if (end >= 0) traces = traces.slice(0, end);
	}
	const lines = traces.split("\n");
	const first = lines.findIndex((line) => /^\s*\d+\s+\S+ - /.test(line));
	if (first < 0) return;
	const message = [lines[first].replace(/^\s*\d+\s+\S+ - /, "")];
	for (const line of lines.slice(first + 1)) {
		if (/^\s*\d+\s+\S+ - /.test(line)) break;
		message.push(line);
	}
	return message.join("\n").trim() || void 0;
};
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
const constructGnoError = (error, log) => {
	const raw = error;
	const type = String(raw[ABCIErrorKey] ?? "");
	const message = (typeof raw.value === "string" && raw.value.length > 0 ? raw.value : void 0) ?? parseABCIErrorLog(log);
	switch (type) {
		case GnoErrorType.INVALID_PKG_PATH: return new InvalidPkgPathError(message, log);
		case GnoErrorType.NO_RENDER_DECL: return new NoRenderDeclError(message, log);
		case GnoErrorType.PKG_EXIST: return new PkgExistError(message, log);
		case GnoErrorType.INVALID_STMT: return new InvalidStmtError(message, log);
		case GnoErrorType.INVALID_EXPR: return new InvalidExprError(message, log);
		case GnoErrorType.TYPE_CHECK: return new TypeCheckError(Array.isArray(raw.errors) ? raw.errors.map(String) : [], message, log);
		case GnoErrorType.UNAUTHORIZED_USER: return new UnauthorizedUserError(message, log);
		case GnoErrorType.INVALID_PACKAGE: return new InvalidPackageError(message, log);
		case GnoErrorType.INVALID_FILE: return new InvalidFileError(message, log);
		case GnoErrorType.OBJECT_NOT_FOUND: return new ObjectNotFoundError(message, log);
		case GnoErrorType.STRING: return new StringError(message, log);
		default: return new GnoABCIError(type || "unknown", message ?? `unknown error: ${type || JSON.stringify(error)}`, log);
	}
};
/**
* Throws the matching {@link GnoABCIError} when the node reported a failure.
*
* VM failures come back as a regular HTTP 200 response with `Data: null`, so
* this has to be called before any attempt to read the payload — otherwise the
* caller only sees an uninitialized response and loses the actual cause.
* @param {ABCIResponseBase} responseBase the `ResponseBase` of the ABCI response
*/
const assertNoABCIError = (responseBase) => {
	if (responseBase.Error) throw constructGnoError(responseBase.Error, responseBase.Log);
};
//#endregion
export { GnoABCIError, GnoErrorType, InvalidExprError, InvalidFileError, InvalidPackageError, InvalidPkgPathError, InvalidStmtError, NoRenderDeclError, ObjectNotFoundError, PkgExistError, StringError, TypeCheckError, UnauthorizedUserError, assertNoABCIError, constructGnoError, parseABCIErrorLog };

//# sourceMappingURL=errors.mjs.map