import { VMEndpoint } from "./endpoints.mjs";
import { assertNoABCIError } from "./errors/errors.mjs";
import "./errors/index.mjs";
import { encodeVMQueryData, extractOptionalStringFromResponse, extractStringFromResponse, normalizeSessionAccount } from "./utility/provider.utility.mjs";
import "./utility/index.mjs";
import { BaseTm2Provider, adaptAbciQueryResponse } from "@gnolang/tm2-js-client";
//#region src/provider/provider.ts
/**
* Base implementation of GnoProvider backed by a Tm2Client.
* Provides all VM query methods; subclasses only need a static `create()` factory.
*/
var BaseGnoProvider = class extends BaseTm2Provider {
	/**
	* Runs an ABCI query and surfaces node-side failures as typed errors.
	*
	* A VM-level failure is not a transport error: it comes back as a regular
	* HTTP 200 response with `ResponseBase.Error` set and `Data` null. Checking
	* it here — rather than in each caller — is what keeps "package not found"
	* distinguishable from "package declares no Render".
	* @param {string} path the ABCI query path
	* @param {Uint8Array} data the query payload
	* @param {number} [height=0] the height for querying.
	*/
	async abciQuery(path, data, height) {
		const abciResponse = adaptAbciQueryResponse(await this.client.abciQuery({
			path,
			data,
			height: height ?? 0,
			prove: false
		}));
		assertNoABCIError(abciResponse.response.ResponseBase);
		return abciResponse;
	}
	async evaluateExpression(packagePath, expression, height) {
		return extractOptionalStringFromResponse((await this.abciQuery(`vm/${VMEndpoint.EVALUATE}`, encodeVMQueryData([packagePath, expression], "."), height)).response.ResponseBase.Data);
	}
	async getFileContent(packagePath, height) {
		return extractOptionalStringFromResponse((await this.abciQuery(`vm/${VMEndpoint.FILE_CONTENT}`, encodeVMQueryData([packagePath]), height)).response.ResponseBase.Data);
	}
	async getFunctionSignatures(packagePath, height) {
		const responseRaw = extractStringFromResponse((await this.abciQuery(`vm/${VMEndpoint.FUNCTION_SIGNATURES}`, encodeVMQueryData([packagePath]), height)).response.ResponseBase.Data);
		return JSON.parse(responseRaw);
	}
	async getSessions(masterAddress, height) {
		const { ResponseBase } = (await this.abciQuery(`auth/accounts/${masterAddress}/sessions`, new Uint8Array(), height)).response;
		if (!ResponseBase.Data) return [];
		const raw = extractStringFromResponse(ResponseBase.Data);
		if (raw.trim() === "") return [];
		return JSON.parse(raw).map(normalizeSessionAccount);
	}
	async getSession(masterAddress, sessionAddress, height) {
		const raw = extractStringFromResponse((await this.abciQuery(`auth/accounts/${masterAddress}/session/${sessionAddress}`, new Uint8Array(), height)).response.ResponseBase.Data);
		return normalizeSessionAccount(JSON.parse(raw));
	}
	async getRenderOutput(packagePath, path, height) {
		return extractOptionalStringFromResponse((await this.abciQuery(`vm/${VMEndpoint.RENDER}`, encodeVMQueryData([packagePath, path], ":"), height)).response.ResponseBase.Data);
	}
	async getRealmPaths(prefix) {
		const { ResponseBase } = (await this.abciQuery("vm/qpaths", encodeVMQueryData([prefix]))).response;
		if (!ResponseBase.Data) return [];
		const raw = extractStringFromResponse(ResponseBase.Data);
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed.map((p) => typeof p === "string" ? p : p.path);
		} catch {}
		return raw.split("\n").filter((p) => p.length > 0);
	}
};
//#endregion
export { BaseGnoProvider };

//# sourceMappingURL=provider.mjs.map