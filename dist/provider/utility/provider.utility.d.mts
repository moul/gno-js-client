import { SessionAccountInfo } from "../types/session.mjs";
//#region src/provider/utility/provider.utility.d.ts
/**
 * Encodes VM query parameters into a Uint8Array suitable for abciQuery data.
 * Joins params with the given separator and encodes to UTF-8 bytes.
 * @param {string[]} params the params for the ABCI call
 * @param {string} separator the separator for ABCI call parameters (default: "")
 */
declare const encodeVMQueryData: (params: string[], separator?: string) => Uint8Array;
declare const extractStringFromResponse: (abciData: string | null) => string;
/**
 * Decodes an ABCI payload that is allowed to be empty.
 *
 * A query can legitimately succeed and produce nothing — a `Render` that
 * returns an empty string, for instance. The response adapter collapses an
 * empty payload to `null`, so text results have to read a missing payload as
 * empty; whether the query actually failed has already been settled by
 * `assertNoABCIError`.
 * @param {string | null} abciData the base64 `ResponseBase.Data`
 */
declare const extractOptionalStringFromResponse: (abciData: string | null) => string;
declare const toRecord: (value: unknown) => Record<string, unknown>;
declare const toNumberOrUndefined: (value: unknown) => number | undefined;
declare const toStringOrUndefined: (value: unknown) => string | undefined;
declare const toStringArrayOrUndefined: (value: unknown) => string[] | undefined;
declare const normalizeSessionAccount: (raw: unknown) => SessionAccountInfo;
//#endregion
export { encodeVMQueryData, extractOptionalStringFromResponse, extractStringFromResponse, normalizeSessionAccount, toNumberOrUndefined, toRecord, toStringArrayOrUndefined, toStringOrUndefined };
//# sourceMappingURL=provider.utility.d.mts.map