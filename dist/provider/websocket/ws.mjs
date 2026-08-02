import { BaseGnoProvider } from "../provider.mjs";
import { Tm2Client } from "@gnolang/tm2-rpc";
//#region src/provider/websocket/ws.ts
/**
* Provider based on WebSocket connections
*/
var GnoWSProvider = class GnoWSProvider extends BaseGnoProvider {
	/**
	* Creates a new instance of the {@link GnoWSProvider}
	* @param {string} baseURL the WS URL of the node
	*/
	static async create(baseURL) {
		return new GnoWSProvider(await Tm2Client.connect(baseURL));
	}
	/**
	* Closes the WS connection
	*/
	closeConnection() {
		this.client.disconnect();
	}
};
//#endregion
export { GnoWSProvider };

//# sourceMappingURL=ws.mjs.map