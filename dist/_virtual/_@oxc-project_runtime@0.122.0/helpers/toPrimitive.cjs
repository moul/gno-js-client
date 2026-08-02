const require_typeof = require("./typeof.cjs");
//#region \0@oxc-project+runtime@0.122.0/helpers/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != require_typeof._typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != require_typeof._typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
exports.toPrimitive = toPrimitive;
