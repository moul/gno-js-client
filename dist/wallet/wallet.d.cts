import { Any } from "../proto/google/protobuf/any.cjs";
import { MemPackage } from "../proto/gno/vm.cjs";
import { GnoProvider } from "../provider/provider.cjs";
import { Constructor, Realm, Return, UnionToIntersection } from "./helpers.cjs";
import { AccountWalletOption, BroadcastTransactionMap, CreateWalletOptions, Signer, TxFee, Wallet } from "@gnolang/tm2-js-client";
import { LedgerConnector } from "@cosmjs/ledger-amino";

//#region src/wallet/wallet.d.ts
/**
 * Remaps factory method return types so that calling e.g.
 * `AugmentedWallet.fromMnemonic(...)` returns `GnoWallet & Ext`.
 */
type AugmentedWalletStatics<Ext> = {
  createRandom(options?: AccountWalletOption): Promise<GnoWallet & Ext>;
  fromSigner(signer: Signer): Promise<GnoWallet & Ext>;
  fromMnemonic(mnemonic: string, options?: CreateWalletOptions): Promise<GnoWallet & Ext>;
  fromPrivateKey(privateKey: Uint8Array, options?: AccountWalletOption): Promise<GnoWallet & Ext>;
  fromLedger(connector: LedgerConnector, options?: CreateWalletOptions): GnoWallet & Ext;
};
/**
 * GnoWallet is an extension of the TM2 wallet with
 * specific functionality for Gno chains
 */
declare class GnoWallet extends Wallet {
  protected provider: GnoProvider;
  static realms: Realm[];
  constructor();
  static addRealm<T extends Realm | Realm[]>(realms: T): (Constructor<GnoWallet & UnionToIntersection<Return<T>["realm"]>> & AugmentedWalletStatics<UnionToIntersection<Return<T>["realm"]>> & typeof GnoWallet) | (Constructor<GnoWallet & Return<T>["realm"]> & AugmentedWalletStatics<Return<T>["realm"]> & typeof GnoWallet);
  /**
   * Generates a private key-based wallet, using a random seed
   * @param {AccountWalletOption} options the account options
   */
  static createRandom(options?: AccountWalletOption): Promise<GnoWallet>;
  /**
   * Generates a custom signer-based wallet
   * @param {Signer} signer the custom signer implementing the Signer interface
   */
  static fromSigner(signer: Signer): Promise<GnoWallet>;
  /**
   * Generates a bip39 mnemonic-based wallet
   * @param {string} mnemonic the bip39 mnemonic
   * @param {CreateWalletOptions} options the wallet generation options
   */
  static fromMnemonic(mnemonic: string, options?: CreateWalletOptions): Promise<GnoWallet>;
  /**
   * Generates a private key-based wallet
   * @param {string} privateKey the private key
   * @param {AccountWalletOption} options the account options
   */
  static fromPrivateKey(privateKey: Uint8Array, options?: AccountWalletOption): Promise<GnoWallet>;
  /**
   * Creates a Ledger-based wallet
   * @param {LedgerConnector} connector the Ledger device connector
   * @param {CreateWalletOptions} options the wallet generation options
   */
  static fromLedger(connector: LedgerConnector, options?: CreateWalletOptions): GnoWallet;
  /**
   * Returns the connected provider, if any
   * (Here to ensure correct GnoProvider inference)
   */
  getProvider: () => GnoProvider;
  /**
   * Initiates a native currency transfer transaction between accounts
   * @param {string} to the bech32 address of the receiver
   * @param {Map<string, number>} funds the denomination -> value map for funds
   * @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
   * @param {TxFee} [fee] the custom transaction fee, if any
   */
  transferFunds: <K extends keyof BroadcastTransactionMap>(to: string, funds: Map<string, number>, endpoint: K, fee?: TxFee) => Promise<BroadcastTransactionMap[K]["result"]>;
  /**
   * Creates a new account session for the current wallet address
   * @param {Any} sessionKey the session public key wrapped as Any
   * @param {bigint} expiresAt the unix timestamp expiry, or 0 for no expiry
   * @param {string} spendLimit the std.Coins spending limit string, or empty for no spending
   * @param {string[]} allowPaths the allowed realm paths, or empty for unrestricted paths
   * @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
   * @param {bigint} [spendPeriod] the spending period in seconds, or 0 for lifetime cap
   * @param {TxFee} [fee] the custom transaction fee, if any
   */
  createSession: <K extends keyof BroadcastTransactionMap>(sessionKey: Any, expiresAt: bigint, spendLimit: string, allowPaths: string[], endpoint: K, spendPeriod?: bigint, fee?: TxFee) => Promise<BroadcastTransactionMap[K]["result"]>;
  /**
   * Revokes an account session for the current wallet address
   * @param {Any} sessionKey the session public key wrapped as Any
   * @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
   * @param {TxFee} [fee] the custom transaction fee, if any
   */
  revokeSession: <K extends keyof BroadcastTransactionMap>(sessionKey: Any, endpoint: K, fee?: TxFee) => Promise<BroadcastTransactionMap[K]["result"]>;
  /**
   * Revokes all account sessions for the current wallet address
   * @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
   * @param {TxFee} [fee] the custom transaction fee, if any
   */
  revokeAllSessions: <K extends keyof BroadcastTransactionMap>(endpoint: K, fee?: TxFee) => Promise<BroadcastTransactionMap[K]["result"]>;
  /**
   * Invokes the specified method on a GNO contract
   * @param {string} path the gno package / realm path
   * @param {string} method the method name
   * @param {string[]} args the method arguments, if any
   * @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
   * @param {Map<string, number>} [funds] the denomination -> value map for funds, if any
   * @param {Map<string, number>} [maxDeposit] the denomination -> value map for max storage deposit, if any
   * @param {TxFee} [fee] the custom transaction fee, if any
   */
  callMethod: <K extends keyof BroadcastTransactionMap>(path: string, method: string, args: string[] | null, endpoint: K, funds?: Map<string, number>, maxDeposit?: Map<string, number>, fee?: TxFee) => Promise<BroadcastTransactionMap[K]["result"]>;
  /**
   * Deploys the specified package / realm
   * @param {MemPackage} gnoPackage the package / realm to be deployed
   * @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
   * @param {Map<string, number>} [funds] the denomination -> value map for funds, if any
   * @param {Map<string, number>} [maxDeposit] the denomination -> value map for max storage deposit, if any
   * @param {TxFee} [fee] the custom transaction fee, if any
   */
  deployPackage: <K extends keyof BroadcastTransactionMap>(gnoPackage: MemPackage, endpoint: K, funds?: Map<string, number>, maxDeposit?: Map<string, number>, fee?: TxFee) => Promise<BroadcastTransactionMap[K]["result"]>;
  /**
   * Executes arbitrary Gno code
   * @param {MemPackage} gnoPackage the gno package being executed
   * @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
   * @param {Map<string, number>} [funds] the denomination -> value map for funds, if any
   * @param {Map<string, number>} [maxDeposit] the denomination -> value map for max storage deposit, if any
   * @param {TxFee} [fee] the custom transaction fee, if any
   */
  executePackage: <K extends keyof BroadcastTransactionMap>(gnoPackage: MemPackage, endpoint: K, funds?: Map<string, number>, maxDeposit?: Map<string, number>, fee?: TxFee) => Promise<BroadcastTransactionMap[K]["result"]>;
}
//#endregion
export { GnoWallet };
//# sourceMappingURL=wallet.d.cts.map