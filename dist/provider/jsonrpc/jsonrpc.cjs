require("../../_virtual/_rolldown/runtime.cjs");
const require_provider = require("../provider.cjs");
let _gnolang_tm2_rpc = require("@gnolang/tm2-rpc");
//#region src/provider/jsonrpc/jsonrpc.ts
/**
* Provider based on JSON-RPC HTTP requests
*/
var GnoJSONRPCProvider = class GnoJSONRPCProvider extends require_provider.BaseGnoProvider {
	/**
	* Creates a new instance of the GNO JSON-RPC Provider
	* @param {string} baseURL the JSON-RPC URL of the node
	*/
	static async create(baseURL) {
		return new GnoJSONRPCProvider(await _gnolang_tm2_rpc.Tm2Client.connect(baseURL));
	}
};
//#endregion
exports.GnoJSONRPCProvider = GnoJSONRPCProvider;

//# sourceMappingURL=jsonrpc.cjs.map