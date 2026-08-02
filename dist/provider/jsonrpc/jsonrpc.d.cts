import { BaseGnoProvider } from "../provider.cjs";

//#region src/provider/jsonrpc/jsonrpc.d.ts
/**
 * Provider based on JSON-RPC HTTP requests
 */
declare class GnoJSONRPCProvider extends BaseGnoProvider {
  /**
   * Creates a new instance of the GNO JSON-RPC Provider
   * @param {string} baseURL the JSON-RPC URL of the node
   */
  static create(baseURL: string): Promise<GnoJSONRPCProvider>;
}
//#endregion
export { GnoJSONRPCProvider };
//# sourceMappingURL=jsonrpc.d.cts.map