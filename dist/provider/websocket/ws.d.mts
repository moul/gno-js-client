import { BaseGnoProvider } from "../provider.mjs";

//#region src/provider/websocket/ws.d.ts
/**
 * Provider based on WebSocket connections
 */
declare class GnoWSProvider extends BaseGnoProvider {
  /**
   * Creates a new instance of the {@link GnoWSProvider}
   * @param {string} baseURL the WS URL of the node
   */
  static create(baseURL: string): Promise<GnoWSProvider>;
  /**
   * Closes the WS connection
   */
  closeConnection(): void;
}
//#endregion
export { GnoWSProvider };
//# sourceMappingURL=ws.d.mts.map