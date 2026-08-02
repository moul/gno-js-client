const require_toPropertyKey = require("./toPropertyKey.cjs");
//#region \0@oxc-project+runtime@0.122.0/helpers/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = require_toPropertyKey.toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
exports._defineProperty = _defineProperty;
