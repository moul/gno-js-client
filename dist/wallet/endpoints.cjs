//#region src/wallet/endpoints.ts
let MsgEndpoint = /* @__PURE__ */ function(MsgEndpoint) {
	MsgEndpoint["MSG_SEND"] = "/bank.MsgSend";
	MsgEndpoint["MSG_ADD_PKG"] = "/vm.m_addpkg";
	MsgEndpoint["MSG_CALL"] = "/vm.m_call";
	MsgEndpoint["MSG_RUN"] = "/vm.m_run";
	MsgEndpoint["MSG_CREATE_SESSION"] = "/auth.m_create_session";
	MsgEndpoint["MSG_REVOKE_SESSION"] = "/auth.m_revoke_session";
	MsgEndpoint["MSG_REVOKE_ALL_SESSIONS"] = "/auth.m_revoke_all_sessions";
	return MsgEndpoint;
}({});
//#endregion
exports.MsgEndpoint = MsgEndpoint;

//# sourceMappingURL=endpoints.cjs.map