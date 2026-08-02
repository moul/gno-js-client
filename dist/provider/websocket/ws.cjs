const require_provider = require("../provider.cjs");
let _gnolang_tm2_rpc = require("@gnolang/tm2-rpc");
//#region src/provider/websocket/ws.ts
/**
* Provider based on WebSocket connections
*/
var GnoWSProvider = class GnoWSProvider extends require_provider.BaseGnoProvider {
	/**
	* Creates a new instance of the {@link GnoWSProvider}
	* @param {string} baseURL the WS URL of the node
	*/
	static async create(baseURL) {
		return new GnoWSProvider(await _gnolang_tm2_rpc.Tm2Client.connect(baseURL));
	}
	/**
	* Closes the WS connection
	*/
	closeConnection() {
		this.client.disconnect();
	}
};
//#endregion
exports.GnoWSProvider = GnoWSProvider;

//# sourceMappingURL=ws.cjs.map