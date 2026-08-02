import { Any } from "../google/protobuf/any.mjs";
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

//#region src/proto/gno/vm.d.ts
declare const protobufPackage = "gno.vm";
/**
 * MsgCall is the method invocation tx message,
 * denoted as "m_call"
 */
interface MsgCall {
  /** the bech32 address of the caller */
  caller: string;
  /** the amount of funds to be deposited to the package, if any ("<amount><denomination>") */
  send: string;
  /** the amount of funds to lock for the storage, if any ("<amount><denomination>") */
  max_deposit: string;
  /** the gno package path */
  pkg_path: string;
  /** the function name being invoked */
  func: string;
  /** the function arguments */
  args: string[];
}
/**
 * MsgAddPackage is the package deployment tx message,
 * denoted as "m_addpkg"
 */
interface MsgAddPackage {
  /** the package deployer */
  creator: string;
  /** the package being deployed */
  package?: MemPackage | undefined;
  /** the amount of funds to be deposited at deployment, if any ("<amount><denomination>") */
  send: string;
  /** the amount of funds to put down for the storage fee, if any ("<amount><denomination>") */
  max_deposit: string;
}
/**
 * MsgRun is the execute arbitrary Gno code tx message,
 * denoted as "m_run"
 */
interface MsgRun {
  /** the bech32 address of the caller */
  caller: string;
  /** the amount of funds to be deposited to the package, if any ("<amount><denomination>") */
  send: string;
  /** the amount of funds to put down for the storage fee, if any ("<amount><denomination>") */
  max_deposit: string;
  /** the package being executed */
  package?: MemPackage | undefined;
}
/**
 * MemPackage is the metadata information tied to
 * package / realm deployment
 */
interface MemPackage {
  /** the name of the package */
  name: string;
  /** the gno path of the package */
  path: string;
  /** the associated package gno source */
  files: MemFile[];
  /** the (user defined) package type */
  type?: Any | undefined;
  /** the (user defined) extra information */
  info?: Any | undefined;
}
/**
 * MemFile is the metadata information tied to
 * a single gno package / realm file
 */
interface MemFile {
  /** the name of the source gno file */
  name: string;
  /** the content of the source gno file */
  body: string;
}
declare const MsgCall: MessageFns<MsgCall>;
declare const MsgAddPackage: MessageFns<MsgAddPackage>;
declare const MsgRun: MessageFns<MsgRun>;
declare const MemPackage: MessageFns<MemPackage>;
declare const MemFile: MessageFns<MemFile>;
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
export { MemFile, MemPackage, MsgAddPackage, MsgCall, MsgRun };
//# sourceMappingURL=vm.d.mts.map