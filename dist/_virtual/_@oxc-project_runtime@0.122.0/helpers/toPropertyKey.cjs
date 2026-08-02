const require_typeof = require("./typeof.cjs");
const require_toPrimitive = require("./toPrimitive.cjs");
//#region \0@oxc-project+runtime@0.122.0/helpers/toPropertyKey.js
function toPropertyKey(t) {
	var i = require_toPrimitive.toPrimitive(t, "string");
	return "symbol" == require_typeof._typeof(i) ? i : i + "";
}
//#endregion
exports.toPropertyKey = toPropertyKey;
