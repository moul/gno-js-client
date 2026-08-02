//#region src/provider/types/session.d.ts
interface SessionAccountInfo {
  address: string;
  public_key?: unknown;
  account_number?: string;
  sequence?: string;
  master_address: string;
  expires_at?: number;
  spend_limit?: string;
  spend_period?: number;
  spend_used?: string;
  spend_reset?: number;
  allow_paths?: string[];
}
//#endregion
export { SessionAccountInfo };
//# sourceMappingURL=session.d.mts.map