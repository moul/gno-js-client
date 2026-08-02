import { BaseGnoProvider } from "../provider.mjs";
import { Tm2Client } from "@gnolang/tm2-rpc";
//#region src/provider/jsonrpc/jsonrpc.ts
/**
* Provider based on JSON-RPC HTTP requests
*/
var GnoJSONRPCProvider = class GnoJSONRPCProvider extends BaseGnoProvider {
	/**
	* Creates a new instance of the GNO JSON-RPC Provider
	* @param {string} baseURL the JSON-RPC URL of the node
	*/
	static async create(baseURL) {
		return new GnoJSONRPCProvider(await Tm2Client.connect(baseURL));
	}
};
//#endregion
export { GnoJSONRPCProvider };

//# sourceMappingURL=jsonrpc.mjs.map