const require_auth = require("../../proto/gno/auth.cjs");
const require_bank = require("../../proto/gno/bank.cjs");
const require_vm = require("../../proto/gno/vm.cjs");
require("../../proto/index.cjs");
const require_endpoints = require("../endpoints.cjs");
let _gnolang_tm2_js_client = require("@gnolang/tm2-js-client");
//#region src/wallet/utility/utility.ts
/**
* Converts a fund map to a concatenated string representation ("<value><denomination>")
* @param funds
*/
const fundsToCoins = (funds) => {
	if (!funds) return "";
	const result = [];
	funds.forEach((value, denomination) => {
		result.push(`${value}${denomination}`);
	});
	return result.join(",");
};
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
const defaultTxFee = "1000000ugnot";
const PUB_KEY_SECP256K1_TYPE_URL = _gnolang_tm2_js_client.Secp256k1PubKeyType;
/**
* Wraps a compressed secp256k1 public key into the TM2 protobuf Any format.
* @param {Uint8Array} rawPubKeyBytes the compressed secp256k1 public key bytes
*/
const secp256k1PubKeyToAny = (rawPubKeyBytes) => ({
	type_url: PUB_KEY_SECP256K1_TYPE_URL,
	value: _gnolang_tm2_js_client.PubKeySecp256k1.encode({ key: rawPubKeyBytes }).finish()
});
const pubKeyAnyToAminoJson = (pubKey) => {
	if (!pubKey) return;
	if (pubKey.type_url !== PUB_KEY_SECP256K1_TYPE_URL) return {
		type_url: pubKey.type_url,
		value: (0, _gnolang_tm2_js_client.uint8ArrayToBase64)(pubKey.value)
	};
	return {
		"@type": pubKey.type_url,
		value: (0, _gnolang_tm2_js_client.uint8ArrayToBase64)(_gnolang_tm2_js_client.PubKeySecp256k1.decode(pubKey.value).key)
	};
};
/**
* Decodes (and unrolls) Transaction messages into full objects
* @param {Any[]} messages the encoded transaction messages
*/
const decodeTxMessages = (messages) => {
	return messages.map((m) => {
		switch (m.type_url) {
			case require_endpoints.MsgEndpoint.MSG_CALL: {
				const decodedMessage = require_vm.MsgCall.decode(m.value);
				const messageJson = require_vm.MsgCall.toJSON(decodedMessage);
				return {
					"@type": m.type_url,
					send: "",
					...messageJson
				};
			}
			case require_endpoints.MsgEndpoint.MSG_SEND: {
				const decodedMessage = require_bank.MsgSend.decode(m.value);
				const messageJson = require_bank.MsgSend.toJSON(decodedMessage);
				return {
					"@type": m.type_url,
					...messageJson
				};
			}
			case require_endpoints.MsgEndpoint.MSG_ADD_PKG: {
				const decodedMessage = require_vm.MsgAddPackage.decode(m.value);
				const messageJson = require_vm.MsgAddPackage.toJSON(decodedMessage);
				return {
					"@type": m.type_url,
					...messageJson
				};
			}
			case require_endpoints.MsgEndpoint.MSG_RUN: {
				const decodedMessage = require_vm.MsgRun.decode(m.value);
				const messageJson = require_vm.MsgRun.toJSON(decodedMessage);
				return {
					"@type": m.type_url,
					...messageJson
				};
			}
			case require_endpoints.MsgEndpoint.MSG_CREATE_SESSION: {
				const decodedMessage = require_auth.MsgCreateSession.decode(m.value);
				const messageJson = require_auth.MsgCreateSession.toJSON(decodedMessage);
				return {
					"@type": m.type_url,
					...messageJson,
					session_key: pubKeyAnyToAminoJson(decodedMessage.session_key)
				};
			}
			case require_endpoints.MsgEndpoint.MSG_REVOKE_SESSION: {
				const decodedMessage = require_auth.MsgRevokeSession.decode(m.value);
				const messageJson = require_auth.MsgRevokeSession.toJSON(decodedMessage);
				return {
					"@type": m.type_url,
					...messageJson,
					session_key: pubKeyAnyToAminoJson(decodedMessage.session_key)
				};
			}
			case require_endpoints.MsgEndpoint.MSG_REVOKE_ALL_SESSIONS: {
				const decodedMessage = require_auth.MsgRevokeAllSessions.decode(m.value);
				const messageJson = require_auth.MsgRevokeAllSessions.toJSON(decodedMessage);
				return {
					"@type": m.type_url,
					...messageJson
				};
			}
			default: throw new Error(`unsupported message type ${m.type_url}`);
		}
	});
};
//#endregion
exports.PUB_KEY_SECP256K1_TYPE_URL = PUB_KEY_SECP256K1_TYPE_URL;
exports.decodeTxMessages = decodeTxMessages;
exports.defaultTxFee = defaultTxFee;
exports.fundsToCoins = fundsToCoins;
exports.secp256k1PubKeyToAny = secp256k1PubKeyToAny;

//# sourceMappingURL=utility.cjs.map