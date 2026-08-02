import { GnoWallet } from "./wallet.mjs";

//#region src/wallet/helpers.d.ts
type Constructor<T> = new (...args: unknown[]) => T;
type AnyFunction = (...args: unknown[]) => any;
type UnionToIntersection<Union> = (Union extends unknown ? (argument: Union) => void : never) extends ((argument: infer Intersection) => void) ? Intersection : never;
type Return<T> = T extends AnyFunction ? ReturnType<T> : T extends AnyFunction[] ? UnionToIntersection<ReturnType<T[number]>> : never;
type RealmInterface = {
  [key: string]: unknown;
};
type Realm = (instance: GnoWallet) => {
  realm: RealmInterface;
};
declare const parseGnoReturns: (result: string) => Array<unknown>;
//#endregion
export { AnyFunction, Constructor, Realm, RealmInterface, Return, UnionToIntersection, parseGnoReturns };
//# sourceMappingURL=helpers.d.mts.map