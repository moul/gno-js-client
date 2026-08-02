//#region src/wallet/helpers.ts
const bigIntTypes = new Set([
	"int",
	"int64",
	"uint",
	"uint64"
]);
const parseGnoReturns = (result) => {
	const ret = [];
	const values = result.split("\n").filter((v) => v.length > 0);
	for (let i = 0; i < values.length; i++) {
		const inner = values[i].slice(1, -1);
		const lastSpace = inner.lastIndexOf(" ");
		const rawValue = inner.substring(0, lastSpace);
		const gnoType = inner.substring(lastSpace + 1);
		if (bigIntTypes.has(gnoType)) ret.push(BigInt(rawValue));
		else ret.push(JSON.parse(rawValue));
	}
	return ret;
};
//#endregion
export { parseGnoReturns };

//# sourceMappingURL=helpers.mjs.map