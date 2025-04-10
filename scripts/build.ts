import debounceFn from "debounce-fn";
import { buildSync } from "esbuild";
import { rmSync, watch, writeFileSync } from "fs";
import path from "path";
import { performance } from "perf_hooks";
import glob from "tiny-glob";
import ts, { CompilerOptions } from "typescript";
import { DateUtils } from "./utils";

const buildTypes = process.argv.includes("--types");
const sourcemap = process.argv.includes("--sourcemap");
const watchMode = process.argv.includes("--watch");

async function build() {
    console.clear();
    const startTime = performance.now();

    console.log("\x1b[32mCleaning dist directory\x1b[0m");
    rmSync("dist/cjs", {
        force: true,
        recursive: true,
    });
    rmSync("dist/esm", {
        force: true,
        recursive: true,
    });

    const target = ["ESNext", "node8.17"];
    const entryPoints = await glob("./src/**/*.ts");

    console.log("\x1b[34mBuilding dist for node (cjs)...\x1b[0m");
    buildSync({
        entryPoints,
        outdir: "./dist/cjs",
        bundle: false,
        sourcemap,
        minify: false,
        format: "cjs",
        platform: "node",
        target,
    });
    writeFileSync("./dist/cjs/package.json", '{"type": "commonjs"}', {
        flag: "w",
    });

    console.log("\x1b[34mBuilding dist for node type=module (esm)...\x1b[0m");
    buildSync({
        entryPoints: ["./src/index.ts"],
        outdir: "./dist/esm",
        bundle: true,
        sourcemap,
        minify: false,
        splitting: true,
        format: "esm",
        platform: "node",
        target,
    });
    writeFileSync("./dist/esm/package.json", '{"type": "module"}', {
        flag: "w",
    });

    const endTime = performance.now();
    const executionTime = (endTime - startTime) / 1000;
    console.log(`\x1b[32mBuild Success with execution time ${executionTime.toFixed(2)}s\x1b[0m`);
}

const compilerOptions: CompilerOptions = {
    declaration: true,
    emitDeclarationOnly: true,
    declarationDir: "./dist/types/",
};

let program: ts.Program | undefined;

async function setupCompiler() {
    const configPath = ts.findConfigFile("../", ts.sys.fileExists, "tsconfig.json");
    if (!configPath) {
        throw new Error("tsconfig.json not found");
    }

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        path.dirname(configPath)
    );

    return ts.createProgram(parsedConfig.fileNames, {
        ...parsedConfig.options,
        ...compilerOptions,
    });
}

async function generateTypes() {
    const start = performance.now();
    console.log(`\x1b[34mGenerating declaration types...\x1b[0m`);

    if (!program) program = await setupCompiler();

    const emitResult = program.emit();

    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    if (allDiagnostics.length)
        console.log(
            ts.formatDiagnosticsWithColorAndContext(allDiagnostics, {
                getCanonicalFileName: n => n,
                getCurrentDirectory: () => process.cwd(),
                getNewLine: () => "\n",
            })
        );
    console.log(
        "\x1b[34mBuild types completed in",
        DateUtils.greatestFormat(performance.now() - start),
        "\x1b[0m"
    );
}

function run() {
    build();
    buildTypes && generateTypes();
}

run();

if (watchMode) {
    watch("./src", { recursive: true }, debounceFn(run, { wait: 300 }));
}
