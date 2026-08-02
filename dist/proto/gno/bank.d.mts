import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

//#region src/proto/gno/bank.d.ts
declare const protobufPackage = "gno.bank";
/** MsgSend is the fund transfer tx message */
interface MsgSend {
  /** the bech32 address of the fund sender */
  from_address: string;
  /** the bech32 address of the fund receiver */
  to_address: string;
  /** the denomination and amount of fund sent ("<amount><denomination>") */
  amount: string;
}
declare const MsgSend: MessageFns<MsgSend>;
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> } : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };
interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
//#endregion
export { MsgSend };
//# sourceMappingURL=bank.d.mts.map