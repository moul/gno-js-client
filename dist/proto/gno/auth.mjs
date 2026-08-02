import { Any } from "../google/protobuf/any.mjs";
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
function createBaseMsgCreateSession() {
	return {
		creator: "",
		session_key: void 0,
		expires_at: 0n,
		allow_paths: [],
		spend_limit: "",
		spend_period: 0n
	};
}
const MsgCreateSession = {
	encode(message, writer = new BinaryWriter()) {
		if (message.creator !== "") writer.uint32(10).string(message.creator);
		if (message.session_key !== void 0) Any.encode(message.session_key, writer.uint32(18).fork()).join();
		if (message.expires_at !== 0n) {
			if (BigInt.asIntN(64, message.expires_at) !== message.expires_at) throw new globalThis.Error("value provided for field message.expires_at of type sint64 too large");
			writer.uint32(24).sint64(message.expires_at);
		}
		for (const v of message.allow_paths) writer.uint32(34).string(v);
		if (message.spend_limit !== "") writer.uint32(42).string(message.spend_limit);
		if (message.spend_period !== 0n) {
			if (BigInt.asIntN(64, message.spend_period) !== message.spend_period) throw new globalThis.Error("value provided for field message.spend_period of type sint64 too large");
			writer.uint32(48).sint64(message.spend_period);
		}
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMsgCreateSession();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.creator = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.session_key = Any.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 24) break;
					message.expires_at = reader.sint64();
					continue;
				case 4:
					if (tag !== 34) break;
					message.allow_paths.push(reader.string());
					continue;
				case 5:
					if (tag !== 42) break;
					message.spend_limit = reader.string();
					continue;
				case 6:
					if (tag !== 48) break;
					message.spend_period = reader.sint64();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
			session_key: isSet(object.session_key) ? Any.fromJSON(object.session_key) : void 0,
			expires_at: isSet(object.expires_at) ? BigInt(object.expires_at) : 0n,
			allow_paths: globalThis.Array.isArray(object?.allow_paths) ? object.allow_paths.map((e) => globalThis.String(e)) : [],
			spend_limit: isSet(object.spend_limit) ? globalThis.String(object.spend_limit) : "",
			spend_period: isSet(object.spend_period) ? BigInt(object.spend_period) : 0n
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.creator !== void 0) obj.creator = message.creator;
		if (message.session_key !== void 0) obj.session_key = Any.toJSON(message.session_key);
		if (message.expires_at !== void 0) obj.expires_at = message.expires_at.toString();
		if (message.allow_paths?.length) obj.allow_paths = message.allow_paths;
		if (message.spend_limit !== void 0) obj.spend_limit = message.spend_limit;
		if (message.spend_period !== void 0) obj.spend_period = message.spend_period.toString();
		return obj;
	},
	create(base) {
		return MsgCreateSession.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMsgCreateSession();
		message.creator = object.creator ?? "";
		message.session_key = object.session_key !== void 0 && object.session_key !== null ? Any.fromPartial(object.session_key) : void 0;
		message.expires_at = object.expires_at ?? 0n;
		message.allow_paths = object.allow_paths?.map((e) => e) || [];
		message.spend_limit = object.spend_limit ?? "";
		message.spend_period = object.spend_period ?? 0n;
		return message;
	}
};
function createBaseMsgRevokeSession() {
	return {
		creator: "",
		session_key: void 0
	};
}
const MsgRevokeSession = {
	encode(message, writer = new BinaryWriter()) {
		if (message.creator !== "") writer.uint32(10).string(message.creator);
		if (message.session_key !== void 0) Any.encode(message.session_key, writer.uint32(18).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMsgRevokeSession();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.creator = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.session_key = Any.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
			session_key: isSet(object.session_key) ? Any.fromJSON(object.session_key) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.creator !== void 0) obj.creator = message.creator;
		if (message.session_key !== void 0) obj.session_key = Any.toJSON(message.session_key);
		return obj;
	},
	create(base) {
		return MsgRevokeSession.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMsgRevokeSession();
		message.creator = object.creator ?? "";
		message.session_key = object.session_key !== void 0 && object.session_key !== null ? Any.fromPartial(object.session_key) : void 0;
		return message;
	}
};
function createBaseMsgRevokeAllSessions() {
	return { creator: "" };
}
const MsgRevokeAllSessions = {
	encode(message, writer = new BinaryWriter()) {
		if (message.creator !== "") writer.uint32(10).string(message.creator);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMsgRevokeAllSessions();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.creator = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return { creator: isSet(object.creator) ? globalThis.String(object.creator) : "" };
	},
	toJSON(message) {
		const obj = {};
		if (message.creator !== void 0) obj.creator = message.creator;
		return obj;
	},
	create(base) {
		return MsgRevokeAllSessions.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMsgRevokeAllSessions();
		message.creator = object.creator ?? "";
		return message;
	}
};
function isSet(value) {
	return value !== null && value !== void 0;
}
//#endregion
export { MsgCreateSession, MsgRevokeAllSessions, MsgRevokeSession };

//# sourceMappingURL=auth.mjs.map