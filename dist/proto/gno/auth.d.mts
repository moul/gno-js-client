import { Any } from "../google/protobuf/any.mjs";
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

//#region src/proto/gno/auth.d.ts
declare const protobufPackage = "gno.auth";
/** MsgCreateSession creates a new account session. */
interface MsgCreateSession {
  /** the bech32 address of the session creator */
  creator: string;
  /** the session public key wrapped as a TM2 pubkey Any */
  session_key?: Any | undefined;
  /** unix timestamp expiry, or 0 for no expiry */
  expires_at: bigint;
  /** allowed realm paths, or empty for unrestricted paths */
  allow_paths: string[];
  /** spending limit as a std.Coins string, or empty for no spending */
  spend_limit: string;
  /** spending period in seconds, or 0 for lifetime cap */
  spend_period: bigint;
}
/** MsgRevokeSession revokes an existing account session. */
interface MsgRevokeSession {
  /** the bech32 address of the session creator */
  creator: string;
  /** the session public key wrapped as a TM2 pubkey Any */
  session_key?: Any | undefined;
}
/** MsgRevokeAllSessions revokes all sessions for the creator. */
interface MsgRevokeAllSessions {
  /** the bech32 address of the session creator */
  creator: string;
}
declare const MsgCreateSession: MessageFns<MsgCreateSession>;
declare const MsgRevokeSession: MessageFns<MsgRevokeSession>;
declare const MsgRevokeAllSessions: MessageFns<MsgRevokeAllSessions>;
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
export { MsgCreateSession, MsgRevokeAllSessions, MsgRevokeSession };
//# sourceMappingURL=auth.d.mts.map