require("../_virtual/_rolldown/runtime.cjs");
const require_endpoints = require("./endpoints.cjs");
const require_errors = require("./errors/errors.cjs");
require("./errors/index.cjs");
const require_provider_utility = require("./utility/provider.utility.cjs");
require("./utility/index.cjs");
let _gnolang_tm2_js_client = require("@gnolang/tm2-js-client");
//#region src/provider/provider.ts
/**
* Base implementation of GnoProvider backed by a Tm2Client.
* Provides all VM query methods; subclasses only need a static `create()` factory.
*/
var BaseGnoProvider = class extends _gnolang_tm2_js_client.BaseTm2Provider {
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
		const abciResponse = (0, _gnolang_tm2_js_client.adaptAbciQueryResponse)(await this.client.abciQuery({
			path,
			data,
			height: height ?? 0,
			prove: false
		}));
		require_errors.assertNoABCIError(abciResponse.response.ResponseBase);
		return abciResponse;
	}
	async evaluateExpression(packagePath, expression, height) {
		return require_provider_utility.extractOptionalStringFromResponse((await this.abciQuery(`vm/${require_endpoints.VMEndpoint.EVALUATE}`, require_provider_utility.encodeVMQueryData([packagePath, expression], "."), height)).response.ResponseBase.Data);
	}
	async getFileContent(packagePath, height) {
		return require_provider_utility.extractOptionalStringFromResponse((await this.abciQuery(`vm/${require_endpoints.VMEndpoint.FILE_CONTENT}`, require_provider_utility.encodeVMQueryData([packagePath]), height)).response.ResponseBase.Data);
	}
	async getFunctionSignatures(packagePath, height) {
		const responseRaw = require_provider_utility.extractStringFromResponse((await this.abciQuery(`vm/${require_endpoints.VMEndpoint.FUNCTION_SIGNATURES}`, require_provider_utility.encodeVMQueryData([packagePath]), height)).response.ResponseBase.Data);
		return JSON.parse(responseRaw);
	}
	async getSessions(masterAddress, height) {
		const { ResponseBase } = (await this.abciQuery(`auth/accounts/${masterAddress}/sessions`, new Uint8Array(), height)).response;
		if (!ResponseBase.Data) return [];
		const raw = require_provider_utility.extractStringFromResponse(ResponseBase.Data);
		if (raw.trim() === "") return [];
		return JSON.parse(raw).map(require_provider_utility.normalizeSessionAccount);
	}
	async getSession(masterAddress, sessionAddress, height) {
		const raw = require_provider_utility.extractStringFromResponse((await this.abciQuery(`auth/accounts/${masterAddress}/session/${sessionAddress}`, new Uint8Array(), height)).response.ResponseBase.Data);
		return require_provider_utility.normalizeSessionAccount(JSON.parse(raw));
	}
	async getRenderOutput(packagePath, path, height) {
		return require_provider_utility.extractOptionalStringFromResponse((await this.abciQuery(`vm/${require_endpoints.VMEndpoint.RENDER}`, require_provider_utility.encodeVMQueryData([packagePath, path], ":"), height)).response.ResponseBase.Data);
	}
	async getRealmPaths(prefix) {
		const { ResponseBase } = (await this.abciQuery("vm/qpaths", require_provider_utility.encodeVMQueryData([prefix]))).response;
		if (!ResponseBase.Data) return [];
		const raw = require_provider_utility.extractStringFromResponse(ResponseBase.Data);
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed.map((p) => typeof p === "string" ? p : p.path);
		} catch {}
		return raw.split("\n").filter((p) => p.length > 0);
	}
};
//#endregion
exports.BaseGnoProvider = BaseGnoProvider;

//# sourceMappingURL=provider.cjs.map