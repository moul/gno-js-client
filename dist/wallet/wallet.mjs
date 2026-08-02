import { MsgCreateSession, MsgRevokeAllSessions, MsgRevokeSession } from "../proto/gno/auth.mjs";
import { MsgSend } from "../proto/gno/bank.mjs";
import { MsgAddPackage, MsgCall, MsgRun } from "../proto/gno/vm.mjs";
import "../proto/index.mjs";
import { _defineProperty } from "../_virtual/_@oxc-project_runtime@0.122.0/helpers/defineProperty.mjs";
import { MsgEndpoint } from "./endpoints.mjs";
import { decodeTxMessages, defaultTxFee, fundsToCoins } from "./utility/utility.mjs";
import "./utility/index.mjs";
import { Wallet } from "@gnolang/tm2-js-client";
//#region src/wallet/wallet.ts
function deepAssign(target, source) {
	for (const key of Object.keys(source)) {
		const srcVal = source[key];
		const tgtVal = target[key];
		if (tgtVal && srcVal && typeof tgtVal === "object" && typeof srcVal === "object" && Object.getPrototypeOf(srcVal) === Object.prototype && Object.getPrototypeOf(tgtVal) === Object.prototype) deepAssign(tgtVal, srcVal);
		else target[key] = srcVal;
	}
}
/**
* GnoWallet is an extension of the TM2 wallet with
* specific functionality for Gno chains
*/
var GnoWallet = class extends Wallet {
	constructor() {
		super();
		_defineProperty(
			this,
			/**
			* Returns the connected provider, if any
			* (Here to ensure correct GnoProvider inference)
			*/
			"getProvider",
			() => {
				return this.provider;
			}
		);
		_defineProperty(
			this,
			/**
			* Initiates a native currency transfer transaction between accounts
			* @param {string} to the bech32 address of the receiver
			* @param {Map<string, number>} funds the denomination -> value map for funds
			* @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
			* @param {TxFee} [fee] the custom transaction fee, if any
			*/
			"transferFunds",
			async (to, funds, endpoint, fee) => {
				const amount = fundsToCoins(funds);
				const sender = await this.getAddress();
				const txFee = fee ? fee : {
					gas_wanted: 60000n,
					gas_fee: defaultTxFee
				};
				const sendMsg = {
					from_address: sender,
					to_address: to,
					amount
				};
				const tx = {
					messages: [{
						type_url: MsgEndpoint.MSG_SEND,
						value: MsgSend.encode(sendMsg).finish()
					}],
					fee: txFee,
					memo: "",
					signatures: []
				};
				const signedTx = await this.signTransaction(tx, decodeTxMessages);
				return this.sendTransaction(signedTx, endpoint);
			}
		);
		_defineProperty(
			this,
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
			"createSession",
			async (sessionKey, expiresAt, spendLimit, allowPaths, endpoint, spendPeriod = 0n, fee) => {
				const creator = await this.getAddress();
				const txFee = fee ? fee : {
					gas_wanted: 60000n,
					gas_fee: defaultTxFee
				};
				const createSessionMsg = {
					creator,
					session_key: sessionKey,
					expires_at: expiresAt,
					allow_paths: allowPaths,
					spend_limit: spendLimit,
					spend_period: spendPeriod
				};
				const tx = {
					messages: [{
						type_url: MsgEndpoint.MSG_CREATE_SESSION,
						value: MsgCreateSession.encode(createSessionMsg).finish()
					}],
					fee: txFee,
					memo: "",
					signatures: []
				};
				const signedTx = await this.signTransaction(tx, decodeTxMessages);
				return this.sendTransaction(signedTx, endpoint);
			}
		);
		_defineProperty(
			this,
			/**
			* Revokes an account session for the current wallet address
			* @param {Any} sessionKey the session public key wrapped as Any
			* @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
			* @param {TxFee} [fee] the custom transaction fee, if any
			*/
			"revokeSession",
			async (sessionKey, endpoint, fee) => {
				const creator = await this.getAddress();
				const txFee = fee ? fee : {
					gas_wanted: 60000n,
					gas_fee: defaultTxFee
				};
				const revokeSessionMsg = {
					creator,
					session_key: sessionKey
				};
				const tx = {
					messages: [{
						type_url: MsgEndpoint.MSG_REVOKE_SESSION,
						value: MsgRevokeSession.encode(revokeSessionMsg).finish()
					}],
					fee: txFee,
					memo: "",
					signatures: []
				};
				const signedTx = await this.signTransaction(tx, decodeTxMessages);
				return this.sendTransaction(signedTx, endpoint);
			}
		);
		_defineProperty(
			this,
			/**
			* Revokes all account sessions for the current wallet address
			* @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
			* @param {TxFee} [fee] the custom transaction fee, if any
			*/
			"revokeAllSessions",
			async (endpoint, fee) => {
				const creator = await this.getAddress();
				const txFee = fee ? fee : {
					gas_wanted: 60000n,
					gas_fee: defaultTxFee
				};
				const revokeAllSessionsMsg = { creator };
				const tx = {
					messages: [{
						type_url: MsgEndpoint.MSG_REVOKE_ALL_SESSIONS,
						value: MsgRevokeAllSessions.encode(revokeAllSessionsMsg).finish()
					}],
					fee: txFee,
					memo: "",
					signatures: []
				};
				const signedTx = await this.signTransaction(tx, decodeTxMessages);
				return this.sendTransaction(signedTx, endpoint);
			}
		);
		_defineProperty(
			this,
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
			"callMethod",
			async (path, method, args, endpoint, funds, maxDeposit, fee) => {
				const amount = fundsToCoins(funds);
				const maxDepositAmount = fundsToCoins(maxDeposit);
				const caller = await this.getAddress();
				const txFee = fee ? fee : {
					gas_wanted: 60000n,
					gas_fee: defaultTxFee
				};
				const callMsg = {
					caller,
					send: amount,
					max_deposit: maxDepositAmount,
					pkg_path: path,
					func: method,
					args: args || []
				};
				const tx = {
					messages: [{
						type_url: MsgEndpoint.MSG_CALL,
						value: MsgCall.encode(callMsg).finish()
					}],
					fee: txFee,
					memo: "",
					signatures: []
				};
				const signedTx = await this.signTransaction(tx, decodeTxMessages);
				return this.sendTransaction(signedTx, endpoint);
			}
		);
		_defineProperty(
			this,
			/**
			* Deploys the specified package / realm
			* @param {MemPackage} gnoPackage the package / realm to be deployed
			* @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
			* @param {Map<string, number>} [funds] the denomination -> value map for funds, if any
			* @param {Map<string, number>} [maxDeposit] the denomination -> value map for max storage deposit, if any
			* @param {TxFee} [fee] the custom transaction fee, if any
			*/
			"deployPackage",
			async (gnoPackage, endpoint, funds, maxDeposit, fee) => {
				const amount = fundsToCoins(funds);
				const maxDepositAmount = fundsToCoins(maxDeposit);
				const caller = await this.getAddress();
				const txFee = fee ? fee : {
					gas_wanted: 60000n,
					gas_fee: defaultTxFee
				};
				const addPkgMsg = {
					creator: caller,
					package: gnoPackage,
					send: amount,
					max_deposit: maxDepositAmount
				};
				const tx = {
					messages: [{
						type_url: MsgEndpoint.MSG_ADD_PKG,
						value: MsgAddPackage.encode(addPkgMsg).finish()
					}],
					fee: txFee,
					memo: "",
					signatures: []
				};
				const signedTx = await this.signTransaction(tx, decodeTxMessages);
				return this.sendTransaction(signedTx, endpoint);
			}
		);
		_defineProperty(
			this,
			/**
			* Executes arbitrary Gno code
			* @param {MemPackage} gnoPackage the gno package being executed
			* @param {TransactionEndpoint} endpoint the transaction broadcast type (sync / commit)
			* @param {Map<string, number>} [funds] the denomination -> value map for funds, if any
			* @param {Map<string, number>} [maxDeposit] the denomination -> value map for max storage deposit, if any
			* @param {TxFee} [fee] the custom transaction fee, if any
			*/
			"executePackage",
			async (gnoPackage, endpoint, funds, maxDeposit, fee) => {
				const amount = fundsToCoins(funds);
				const maxDepositAmount = fundsToCoins(maxDeposit);
				const caller = await this.getAddress();
				const txFee = fee ? fee : {
					gas_wanted: 60000n,
					gas_fee: defaultTxFee
				};
				const runMsg = {
					caller,
					send: amount,
					package: gnoPackage,
					max_deposit: maxDepositAmount
				};
				const tx = {
					messages: [{
						type_url: MsgEndpoint.MSG_RUN,
						value: MsgRun.encode(runMsg).finish()
					}],
					fee: txFee,
					memo: "",
					signatures: []
				};
				const signedTx = await this.signTransaction(tx, decodeTxMessages);
				return this.sendTransaction(signedTx, endpoint);
			}
		);
		this.constructor.realms.forEach((realm) => {
			const realmInstance = realm(this);
			deepAssign(this, realmInstance.realm);
		});
	}
	static addRealm(realms) {
		const currentRealms = this.realms;
		class AugmentedWallet extends this {}
		_defineProperty(AugmentedWallet, "realms", currentRealms.concat(realms));
		if (Array.isArray(realms)) return AugmentedWallet;
		return AugmentedWallet;
	}
	/**
	* Generates a private key-based wallet, using a random seed
	* @param {AccountWalletOption} options the account options
	*/
	static async createRandom(options) {
		const wallet = await Wallet.createRandom(options);
		const gnoWallet = new this();
		gnoWallet.signer = wallet.getSigner();
		return gnoWallet;
	}
	/**
	* Generates a custom signer-based wallet
	* @param {Signer} signer the custom signer implementing the Signer interface
	*/
	static async fromSigner(signer) {
		const wallet = await Wallet.fromSigner(signer);
		const gnoWallet = new this();
		gnoWallet.signer = wallet.getSigner();
		return gnoWallet;
	}
	/**
	* Generates a bip39 mnemonic-based wallet
	* @param {string} mnemonic the bip39 mnemonic
	* @param {CreateWalletOptions} options the wallet generation options
	*/
	static async fromMnemonic(mnemonic, options) {
		const wallet = await Wallet.fromMnemonic(mnemonic, options);
		const gnoWallet = new this();
		gnoWallet.signer = wallet.getSigner();
		return gnoWallet;
	}
	/**
	* Generates a private key-based wallet
	* @param {string} privateKey the private key
	* @param {AccountWalletOption} options the account options
	*/
	static async fromPrivateKey(privateKey, options) {
		const wallet = await Wallet.fromPrivateKey(privateKey, options);
		const gnoWallet = new this();
		gnoWallet.signer = wallet.getSigner();
		return gnoWallet;
	}
	/**
	* Creates a Ledger-based wallet
	* @param {LedgerConnector} connector the Ledger device connector
	* @param {CreateWalletOptions} options the wallet generation options
	*/
	static fromLedger(connector, options) {
		const wallet = Wallet.fromLedger(connector, options);
		const gnoWallet = new this();
		gnoWallet.signer = wallet.getSigner();
		return gnoWallet;
	}
};
_defineProperty(GnoWallet, "realms", []);
//#endregion
export { GnoWallet };

//# sourceMappingURL=wallet.mjs.map