#!/usr/bin/env node
const require_runtime = require("./_virtual/_rolldown/runtime.cjs");
const require_jsonrpc = require("./provider/jsonrpc/jsonrpc.cjs");
let fs = require("fs");
fs = require_runtime.__toESM(fs);
let path = require("path");
path = require_runtime.__toESM(path);
let yargs = require("yargs");
yargs = require_runtime.__toESM(yargs);
let yargs_helpers = require("yargs/helpers");
//#region src/cli/generate-module.ts
function gnoTypeToTS(gnoType) {
	switch (gnoType) {
		case "string": return "string";
		case "bool": return "boolean";
		case "int":
		case "int64":
		case "uint":
		case "uint64": return "bigint";
		case "int8":
		case "int16":
		case "int32":
		case "uint8":
		case "uint16":
		case "uint32":
		case "float32":
		case "float64":
		case "byte":
		case "rune": return "number";
		case "error": return "string";
		default: return "unknown";
	}
}
/**
* Returns true if the parameter is a VM-injected context (std.Caller)
* that should not be exposed to the user.
*/
function isContextParam(param) {
	return param.Type.startsWith("interface {");
}
/**
* Sanitize a Gno parameter name into a valid TypeScript identifier.
* The VM uses names like ".arg_0" for unnamed params.
*/
function sanitizeParamName(name) {
	return name.replace(/^[^a-zA-Z_$]+/, "") || "arg";
}
/**
* Filter out VM-injected context parameters from a function's param list.
*/
function filterUserParams(params) {
	if (!params) return [];
	return params.filter((p) => !isContextParam(p)).map((p) => ({
		...p,
		Name: sanitizeParamName(p.Name)
	}));
}
function normalizeResults(results) {
	return results || [];
}
function realmPathToSegments(realmPath) {
	return realmPath.replace(/^gno\.land\//, "").split("/").filter((s) => s.length > 0);
}
/**
* Ensure the realm path has the gno.land prefix required by the VM.
* Accepts both "/r/demo/boards" and "gno.land/r/demo/boards".
*/
function normalizeRealmPath(realmPath) {
	if (realmPath.startsWith("/")) return "gno.land" + realmPath;
	return realmPath;
}
function buildReturnType(results) {
	if (results.length === 0) return "void";
	return "[" + results.map((r) => gnoTypeToTS(r.Type)).join(", ") + "]";
}
function buildParamsType(params) {
	if (params.length === 0) return "";
	return `params: { ${params.map((p) => `${p.Name}: ${gnoTypeToTS(p.Type)}`).join("; ")} }`;
}
function buildEvalExpression(funcName, params) {
	if (params.length === 0) return `\`${funcName}()\``;
	return `\`${funcName}(${params.map((p) => {
		if (p.Type === "string") return `"\${params.${p.Name}}"`;
		return `\${params.${p.Name}}`;
	}).join(",")})\``;
}
function buildCallArgs(params) {
	if (params.length === 0) return "[]";
	return `[${params.map((p) => `String(params.${p.Name})`).join(", ")}]`;
}
function generateModule(realmPath, signatures) {
	const segments = realmPathToSegments(realmPath);
	const lines = [];
	lines.push("/* eslint-disable max-lines-per-function */");
	lines.push("/* eslint-disable max-lines */");
	lines.push("// Auto-generated module for " + realmPath + " — DO NOT EDIT");
	lines.push("import { TransactionEndpoint, TxFee } from \"@gnolang/tm2-js-client\";");
	lines.push("import { GnoWallet } from \"@gnolang/gno-js-client\";");
	lines.push("// Imported with leading underscore to avoid linting errors about unused imports in void-returning functions");
	lines.push("import { parseGnoReturns as _parseGnoReturns } from \"@gnolang/gno-js-client\";");
	lines.push("");
	lines.push(`const realm = "${realmPath}";`);
	lines.push("");
	const processed = signatures.map((sig) => ({
		...sig,
		Params: filterUserParams(sig.Params),
		Results: normalizeResults(sig.Results)
	}));
	for (const sig of processed) {
		const returnType = buildReturnType(sig.Results);
		if (returnType !== "void") lines.push(`type ${sig.FuncName}Return = ${returnType};`);
	}
	lines.push("");
	lines.push("const queryClient = (wallet: GnoWallet) => {");
	lines.push("	return {");
	for (let i = 0; i < processed.length; i++) {
		const sig = processed[i];
		const paramsType = buildParamsType(sig.Params);
		const hasReturn = buildReturnType(sig.Results) !== "void";
		const returnTypeStr = hasReturn ? `${sig.FuncName}Return` : "void";
		const evalExpr = buildEvalExpression(sig.FuncName, sig.Params);
		const paramsList = paramsType ? `${paramsType}, height?: number` : "height?: number";
		lines.push(`\t\tasync ${sig.FuncName}(${paramsList}):Promise<${returnTypeStr}> {`);
		if (hasReturn) {
			lines.push(`\t\t\tconst result = await wallet.getProvider().evaluateExpression(realm, ${evalExpr}, height);`);
			lines.push(`\t\t\treturn _parseGnoReturns(result) as ${returnTypeStr};`);
		} else {
			lines.push(`\t\t\tawait wallet.getProvider().evaluateExpression(realm, ${evalExpr}, height);`);
			lines.push("			return;");
		}
		lines.push("		}" + (i < processed.length - 1 ? "," : ""));
	}
	lines.push("	}");
	lines.push("}");
	lines.push("");
	lines.push("const txClient = (wallet: GnoWallet) => {");
	lines.push("	return {");
	for (let i = 0; i < processed.length; i++) {
		const sig = processed[i];
		const paramsType = buildParamsType(sig.Params);
		const hasReturn = buildReturnType(sig.Results) !== "void";
		const returnTypeStr = hasReturn ? `${sig.FuncName}Return` : "void";
		const callArgs = buildCallArgs(sig.Params);
		const paramsList = paramsType ? `${paramsType}, funds: Map<string, number>, maxDeposit: Map<string, number>, fee: TxFee` : "funds: Map<string, number>, maxDeposit: Map<string, number>, fee: TxFee";
		lines.push(`\t\tasync ${sig.FuncName}(${paramsList}):Promise<${returnTypeStr}> {`);
		lines.push("			const resp = await wallet.callMethod(");
		lines.push("				realm,");
		lines.push(`\t\t\t\t"${sig.FuncName}",`);
		lines.push(`\t\t\t\t${callArgs},`);
		lines.push("				TransactionEndpoint.BROADCAST_TX_COMMIT,");
		lines.push("				funds,");
		lines.push("				maxDeposit,");
		lines.push("				fee");
		lines.push("			);");
		lines.push("			if (resp.deliver_tx.ResponseBase.Error) {");
		lines.push("				throw new Error(resp.deliver_tx.ResponseBase.Log || JSON.stringify(resp.deliver_tx.ResponseBase.Error));");
		lines.push("			}");
		if (hasReturn) {
			lines.push("			const result = atob(resp.deliver_tx.ResponseBase.Data as string);");
			lines.push(`\t\t\treturn _parseGnoReturns(result) as ${returnTypeStr};`);
		}
		lines.push("		}" + (i < processed.length - 1 ? "," : ""));
	}
	lines.push("	}");
	lines.push("}");
	lines.push("");
	lines.push("class RealmModule {");
	lines.push("	public query: ReturnType<typeof queryClient>;");
	lines.push("	public tx: ReturnType<typeof txClient>;");
	lines.push("");
	lines.push("	constructor(wallet: GnoWallet) {");
	lines.push("		this.tx = txClient(wallet);");
	lines.push("		this.query = queryClient(wallet);");
	lines.push("	}");
	lines.push("}");
	lines.push("");
	const opening = segments.map((seg) => `{ ${seg}: `).join("");
	const closing = " }".repeat(segments.length);
	lines.push("const Realm = (wallet: GnoWallet) => {");
	lines.push("	return {");
	lines.push(`\t\trealm: { realms: ${opening}new RealmModule(wallet)${closing} }`);
	lines.push("	}");
	lines.push("}");
	lines.push("");
	lines.push("export default Realm;");
	lines.push("");
	return lines.join("\n");
}
async function generateAndWrite(provider, realmPath, outRoot) {
	console.log(`Fetching function signatures for ${realmPath}...`);
	let signatures;
	try {
		signatures = await provider.getFunctionSignatures(realmPath);
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		throw new Error(`Failed to fetch function signatures for "${realmPath}" from provider:\n  ${msg}\n\nPlease verify:\n  - The realm path "${realmPath}" exists on the chain`, { cause: err });
	}
	if (!signatures || signatures.length === 0) {
		console.log("  No exported functions, skipping.");
		return false;
	}
	console.log(`  ${signatures.length} function(s) found.`);
	const code = generateModule(realmPath, signatures);
	const segments = realmPathToSegments(realmPath);
	const outDir = path.join(outRoot, ...segments);
	fs.mkdirSync(outDir, { recursive: true });
	const outFile = path.join(outDir, "module.ts");
	fs.writeFileSync(outFile, code, "utf-8");
	console.log(`  Written to ${outFile}`);
	return true;
}
function writeIndex(outRoot, realmPaths) {
	const lines = [];
	for (const realmPath of realmPaths) {
		const segments = realmPathToSegments(realmPath);
		const alias = segments.join("_");
		const importPath = "./" + segments.join("/") + "/module.js";
		lines.push(`export { default as ${alias} } from '${importPath}';`);
	}
	lines.push("");
	const outFile = path.join(outRoot, "index.ts");
	fs.writeFileSync(outFile, lines.join("\n"), "utf-8");
	console.log(`\nIndex written to ${outFile}`);
}
async function main() {
	const argv = await (0, yargs.default)((0, yargs_helpers.hideBin)(process.argv)).option("realm", {
		type: "string",
		describe: "Realm path, e.g. gno.land/r/demo/boards or /r/demo/boards"
	}).option("prefix", {
		type: "string",
		describe: "Path prefix — generate modules for all realms under this path, e.g. /r/gnoland"
	}).option("remote", {
		type: "string",
		demandOption: true,
		describe: "JSON-RPC endpoint URL, e.g. http://localhost:26657"
	}).option("out", {
		type: "string",
		default: ".",
		describe: "Root output directory"
	}).check((argv) => {
		if (argv.realm && argv.prefix) throw new Error("--realm and --prefix are mutually exclusive");
		return true;
	}).help().parseAsync();
	const provider = await require_jsonrpc.GnoJSONRPCProvider.create(argv.remote);
	const generated = [];
	if (argv.realm) {
		const realmPath = normalizeRealmPath(argv.realm);
		if (await generateAndWrite(provider, realmPath, argv.out)) generated.push(realmPath);
	} else {
		const prefix = argv.prefix ? normalizeRealmPath(argv.prefix) : "gno.land/r/";
		console.log(`Discovering realms under ${prefix}...`);
		const realmPaths = await provider.getRealmPaths(prefix);
		if (realmPaths.length === 0) {
			console.log("No realms found.");
			return;
		}
		console.log(`Found ${realmPaths.length} realm(s).\n`);
		for (const realmPath of realmPaths) try {
			if (await generateAndWrite(provider, realmPath, argv.out)) generated.push(realmPath);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.error(`  Skipping ${realmPath}: ${msg}`);
		}
	}
	if (generated.length > 0) writeIndex(argv.out, generated);
}
main().catch((err) => {
	console.error("Error:", err.message || err);
	process.exit(1);
});
//#endregion

//# sourceMappingURL=generate-module.cjs.map