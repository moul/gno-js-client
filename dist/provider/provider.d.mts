import { SessionAccountInfo } from "./types/session.mjs";
import { FunctionSignature } from "./types/vm.mjs";
import { BaseTm2Provider, Provider } from "@gnolang/tm2-js-client";

//#region src/provider/provider.d.ts
/**
 * GnoProvider is the Provider interface for Gno-specific functionality
 */
interface GnoProvider extends Provider {
  /**
   * Executes the Render(<path>) method in read-only mode
   * @param {string} packagePath the gno package path
   * @param {string} path the render path
   * @param {number} [height=0] the height for querying.
   */
  getRenderOutput(packagePath: string, path: string, height?: number): Promise<string>;
  /**
   * Fetches public facing function signatures
   * @param {string} packagePath the gno package path
   * @param {number} [height=0] the height for querying.
   */
  getFunctionSignatures(packagePath: string, height?: number): Promise<FunctionSignature[]>;
  /**
   * Fetches all account sessions for a master address.
   * @param {string} masterAddress the bech32 address of the master account
   * @param {number} [height=0] the height for querying.
   */
  getSessions(masterAddress: string, height?: number): Promise<SessionAccountInfo[]>;
  /**
   * Fetches a single account session.
   * @param {string} masterAddress the bech32 address of the master account
   * @param {string} sessionAddress the bech32 address of the session account
   * @param {number} [height=0] the height for querying.
   */
  getSession(masterAddress: string, sessionAddress: string, height?: number): Promise<SessionAccountInfo>;
  /**
   * Evaluates any expression in readonly mode and returns the results
   * @param {string} packagePath the gno package path
   * @param {string} expression the expression to be evaluated
   * @param {number} [height=0] the height for querying.
   */
  evaluateExpression(packagePath: string, expression: string, height?: number): Promise<string>;
  /**
   * Fetches the file content, or the list of files if the path is a directory
   * @param {string} packagePath the gno package path
   * @param {number} [height=0] the height for querying.
   */
  getFileContent(packagePath: string, height?: number): Promise<string>;
}
/**
 * Base implementation of GnoProvider backed by a Tm2Client.
 * Provides all VM query methods; subclasses only need a static `create()` factory.
 */
declare abstract class BaseGnoProvider extends BaseTm2Provider implements GnoProvider {
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
  private abciQuery;
  evaluateExpression(packagePath: string, expression: string, height?: number): Promise<string>;
  getFileContent(packagePath: string, height?: number): Promise<string>;
  getFunctionSignatures(packagePath: string, height?: number): Promise<FunctionSignature[]>;
  getSessions(masterAddress: string, height?: number): Promise<SessionAccountInfo[]>;
  getSession(masterAddress: string, sessionAddress: string, height?: number): Promise<SessionAccountInfo>;
  getRenderOutput(packagePath: string, path: string, height?: number): Promise<string>;
  getRealmPaths(prefix: string): Promise<string[]>;
}
//#endregion
export { BaseGnoProvider, GnoProvider };
//# sourceMappingURL=provider.d.mts.map