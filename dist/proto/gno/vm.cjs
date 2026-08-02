const require_any = require("../google/protobuf/any.cjs");
let _bufbuild_protobuf_wire = require("@bufbuild/protobuf/wire");
function createBaseMsgCall() {
	return {
		caller: "",
		send: "",
		max_deposit: "",
		pkg_path: "",
		func: "",
		args: []
	};
}
const MsgCall = {
	encode(message, writer = new _bufbuild_protobuf_wire.BinaryWriter()) {
		if (message.caller !== "") writer.uint32(10).string(message.caller);
		if (message.send !== "") writer.uint32(18).string(message.send);
		if (message.max_deposit !== "") writer.uint32(26).string(message.max_deposit);
		if (message.pkg_path !== "") writer.uint32(34).string(message.pkg_path);
		if (message.func !== "") writer.uint32(42).string(message.func);
		for (const v of message.args) writer.uint32(50).string(v);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof _bufbuild_protobuf_wire.BinaryReader ? input : new _bufbuild_protobuf_wire.BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMsgCall();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.caller = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.send = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.max_deposit = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.pkg_path = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.func = reader.string();
					continue;
				case 6:
					if (tag !== 50) break;
					message.args.push(reader.string());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			caller: isSet(object.caller) ? globalThis.String(object.caller) : "",
			send: isSet(object.send) ? globalThis.String(object.send) : "",
			max_deposit: isSet(object.max_deposit) ? globalThis.String(object.max_deposit) : "",
			pkg_path: isSet(object.pkg_path) ? globalThis.String(object.pkg_path) : "",
			func: isSet(object.func) ? globalThis.String(object.func) : "",
			args: globalThis.Array.isArray(object?.args) ? object.args.map((e) => globalThis.String(e)) : []
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.caller !== void 0) obj.caller = message.caller;
		if (message.send !== void 0) obj.send = message.send;
		if (message.max_deposit !== void 0) obj.max_deposit = message.max_deposit;
		if (message.pkg_path !== void 0) obj.pkg_path = message.pkg_path;
		if (message.func !== void 0) obj.func = message.func;
		if (message.args?.length) obj.args = message.args;
		return obj;
	},
	create(base) {
		return MsgCall.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMsgCall();
		message.caller = object.caller ?? "";
		message.send = object.send ?? "";
		message.max_deposit = object.max_deposit ?? "";
		message.pkg_path = object.pkg_path ?? "";
		message.func = object.func ?? "";
		message.args = object.args?.map((e) => e) || [];
		return message;
	}
};
function createBaseMsgAddPackage() {
	return {
		creator: "",
		package: void 0,
		send: "",
		max_deposit: ""
	};
}
const MsgAddPackage = {
	encode(message, writer = new _bufbuild_protobuf_wire.BinaryWriter()) {
		if (message.creator !== "") writer.uint32(10).string(message.creator);
		if (message.package !== void 0) MemPackage.encode(message.package, writer.uint32(18).fork()).join();
		if (message.send !== "") writer.uint32(26).string(message.send);
		if (message.max_deposit !== "") writer.uint32(34).string(message.max_deposit);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof _bufbuild_protobuf_wire.BinaryReader ? input : new _bufbuild_protobuf_wire.BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMsgAddPackage();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.creator = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.package = MemPackage.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 26) break;
					message.send = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.max_deposit = reader.string();
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
			package: isSet(object.package) ? MemPackage.fromJSON(object.package) : void 0,
			send: isSet(object.send) ? globalThis.String(object.send) : "",
			max_deposit: isSet(object.max_deposit) ? globalThis.String(object.max_deposit) : ""
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.creator !== void 0) obj.creator = message.creator;
		if (message.package !== void 0) obj.package = MemPackage.toJSON(message.package);
		if (message.send !== void 0) obj.send = message.send;
		if (message.max_deposit !== void 0) obj.max_deposit = message.max_deposit;
		return obj;
	},
	create(base) {
		return MsgAddPackage.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMsgAddPackage();
		message.creator = object.creator ?? "";
		message.package = object.package !== void 0 && object.package !== null ? MemPackage.fromPartial(object.package) : void 0;
		message.send = object.send ?? "";
		message.max_deposit = object.max_deposit ?? "";
		return message;
	}
};
function createBaseMsgRun() {
	return {
		caller: "",
		send: "",
		max_deposit: "",
		package: void 0
	};
}
const MsgRun = {
	encode(message, writer = new _bufbuild_protobuf_wire.BinaryWriter()) {
		if (message.caller !== "") writer.uint32(10).string(message.caller);
		if (message.send !== "") writer.uint32(18).string(message.send);
		if (message.max_deposit !== "") writer.uint32(26).string(message.max_deposit);
		if (message.package !== void 0) MemPackage.encode(message.package, writer.uint32(34).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof _bufbuild_protobuf_wire.BinaryReader ? input : new _bufbuild_protobuf_wire.BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMsgRun();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.caller = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.send = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.max_deposit = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.package = MemPackage.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			caller: isSet(object.caller) ? globalThis.String(object.caller) : "",
			send: isSet(object.send) ? globalThis.String(object.send) : "",
			max_deposit: isSet(object.max_deposit) ? globalThis.String(object.max_deposit) : "",
			package: isSet(object.package) ? MemPackage.fromJSON(object.package) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.caller !== void 0) obj.caller = message.caller;
		if (message.send !== void 0) obj.send = message.send;
		if (message.max_deposit !== void 0) obj.max_deposit = message.max_deposit;
		if (message.package !== void 0) obj.package = MemPackage.toJSON(message.package);
		return obj;
	},
	create(base) {
		return MsgRun.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMsgRun();
		message.caller = object.caller ?? "";
		message.send = object.send ?? "";
		message.max_deposit = object.max_deposit ?? "";
		message.package = object.package !== void 0 && object.package !== null ? MemPackage.fromPartial(object.package) : void 0;
		return message;
	}
};
function createBaseMemPackage() {
	return {
		name: "",
		path: "",
		files: [],
		type: void 0,
		info: void 0
	};
}
const MemPackage = {
	encode(message, writer = new _bufbuild_protobuf_wire.BinaryWriter()) {
		if (message.name !== "") writer.uint32(10).string(message.name);
		if (message.path !== "") writer.uint32(18).string(message.path);
		for (const v of message.files) MemFile.encode(v, writer.uint32(26).fork()).join();
		if (message.type !== void 0) require_any.Any.encode(message.type, writer.uint32(34).fork()).join();
		if (message.info !== void 0) require_any.Any.encode(message.info, writer.uint32(42).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof _bufbuild_protobuf_wire.BinaryReader ? input : new _bufbuild_protobuf_wire.BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMemPackage();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.name = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.path = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.files.push(MemFile.decode(reader, reader.uint32()));
					continue;
				case 4:
					if (tag !== 34) break;
					message.type = require_any.Any.decode(reader, reader.uint32());
					continue;
				case 5:
					if (tag !== 42) break;
					message.info = require_any.Any.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			name: isSet(object.name) ? globalThis.String(object.name) : "",
			path: isSet(object.path) ? globalThis.String(object.path) : "",
			files: globalThis.Array.isArray(object?.files) ? object.files.map((e) => MemFile.fromJSON(e)) : [],
			type: isSet(object.type) ? require_any.Any.fromJSON(object.type) : void 0,
			info: isSet(object.info) ? require_any.Any.fromJSON(object.info) : void 0
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.name !== void 0) obj.name = message.name;
		if (message.path !== void 0) obj.path = message.path;
		if (message.files?.length) obj.files = message.files.map((e) => MemFile.toJSON(e));
		if (message.type !== void 0) obj.type = require_any.Any.toJSON(message.type);
		if (message.info !== void 0) obj.info = require_any.Any.toJSON(message.info);
		return obj;
	},
	create(base) {
		return MemPackage.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMemPackage();
		message.name = object.name ?? "";
		message.path = object.path ?? "";
		message.files = object.files?.map((e) => MemFile.fromPartial(e)) || [];
		message.type = object.type !== void 0 && object.type !== null ? require_any.Any.fromPartial(object.type) : void 0;
		message.info = object.info !== void 0 && object.info !== null ? require_any.Any.fromPartial(object.info) : void 0;
		return message;
	}
};
function createBaseMemFile() {
	return {
		name: "",
		body: ""
	};
}
const MemFile = {
	encode(message, writer = new _bufbuild_protobuf_wire.BinaryWriter()) {
		if (message.name !== "") writer.uint32(10).string(message.name);
		if (message.body !== "") writer.uint32(18).string(message.body);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof _bufbuild_protobuf_wire.BinaryReader ? input : new _bufbuild_protobuf_wire.BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMemFile();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.name = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.body = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	},
	fromJSON(object) {
		return {
			name: isSet(object.name) ? globalThis.String(object.name) : "",
			body: isSet(object.body) ? globalThis.String(object.body) : ""
		};
	},
	toJSON(message) {
		const obj = {};
		if (message.name !== void 0) obj.name = message.name;
		if (message.body !== void 0) obj.body = message.body;
		return obj;
	},
	create(base) {
		return MemFile.fromPartial(base ?? {});
	},
	fromPartial(object) {
		const message = createBaseMemFile();
		message.name = object.name ?? "";
		message.body = object.body ?? "";
		return message;
	}
};
function isSet(value) {
	return value !== null && value !== void 0;
}
//#endregion
exports.MemFile = MemFile;
exports.MemPackage = MemPackage;
exports.MsgAddPackage = MsgAddPackage;
exports.MsgCall = MsgCall;
exports.MsgRun = MsgRun;

//# sourceMappingURL=vm.cjs.map