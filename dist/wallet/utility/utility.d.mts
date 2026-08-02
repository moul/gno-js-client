import { Any } from "../../proto/google/protobuf/any.mjs";
//#region src/wallet/utility/utility.d.ts
/**
 * Converts a fund map to a concatenated string representation ("<value><denomination>")
 * @param funds
 */
declare const fundsToCoins: (funds?: Map<string, number>) => string;
/**
 * This is constant for now,
 * but should be fetched as an estimation
 * from the Tendermint node once this functionality
 * is available.
 *
 * Each package call / deployment
 * costs a fixed 1 GNOT
 * https://github.com/gnolang/gno/issues/649
 */
declare const defaultTxFee = "1000000ugnot";
declare const PUB_KEY_SECP256K1_TYPE_URL = "/tm.PubKeySecp256k1";
/**
 * Wraps a compressed secp256k1 public key into the TM2 protobuf Any format.
 * @param {Uint8Array} rawPubKeyBytes the compressed secp256k1 public key bytes
 */
declare const secp256k1PubKeyToAny: (rawPubKeyBytes: Uint8Array) => Any;
/**
 * Decodes (and unrolls) Transaction messages into full objects
 * @param {Any[]} messages the encoded transaction messages
 */
declare const decodeTxMessages: (messages: Any[]) => unknown[];
//#endregion
export { PUB_KEY_SECP256K1_TYPE_URL, decodeTxMessages, defaultTxFee, fundsToCoins, secp256k1PubKeyToAny };
//# sourceMappingURL=utility.d.mts.map