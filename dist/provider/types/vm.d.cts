//#region src/provider/types/vm.d.ts
interface FunctionSignature {
  FuncName: string;
  Params: NamedType[];
  Results: NamedType[];
}
interface NamedType {
  Name: string;
  Type: string;
  Value: string;
}
//#endregion
export { FunctionSignature, NamedType };
//# sourceMappingURL=vm.d.cts.map