import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
function createBaseMsgSend() {
	return {
		from_address: "",
		to_address: "",
		amount: ""
	};
}
const MsgSend = {
	encode(message, writer = new BinaryWriter()) {
		if (message.from_address !== "") writer.uint32(10).string(message.from_address);
		if (message.to_address !== "") writer.uint32(18).string(message.to_address);
		if (message.amount !== "") writer.uint32(26).string(message.amount);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMsgSend();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.from_address = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.to_address = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.amount = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			from_address: isSet(object.from_address) ? globalThis.String(object.from_address) : "",
			to_address: isSet(object.to_address) ? globalThis.String(object.to_address) : "",
			amount: isSet(object.amount) ? globalThis.String(object.amount) : ""
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.from_address !== void 0) obj.from_address = message.from_address;
		if (message.to_address !== void 0) obj.to_address = message.to_address;
		if (message.amount !== void 0) obj.amount = message.amount;
		return obj;
	},
	create(base) {
		return MsgSend.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMsgSend();
		message.from_address = object.from_address ?? "";
		message.to_address = object.to_address ?? "";
		message.amount = object.amount ?? "";
		return message;
	}
};
function isSet(value) {
	return value !== null && value !== void 0;
}
//#endregion
export { MsgSend };

//# sourceMappingURL=bank.mjs.map