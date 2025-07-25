import fs from "fs";
import { Configs } from "./Config";

if (!fs.existsSync("comment.txt")) {
    fs.writeFileSync("comment.txt", "", "utf-8");
}

const timeMap: Record<string, number> = {};

console.time = function (label: string) {
    timeMap[label] = performance.now();
};

console.timeLog = function (tag: string, ...data) {
    const now = performance.now();
    const time = now - timeMap[tag];
    console.log(
        `\x1b[90m[${time.toFixed(2)}ms]`,
        `\x1b[32m[${tag}]\x1b[0m`,
        ">>",
        ...data,
        "\x1b[0m"
    );
};

console.timeEnd = function (label: string) {
    delete timeMap[label];
};

export function WritePreComment(data: any) {
    const comment = "This file is generated by the AsaJS compiler. Do not edit it directly.";

    if (fs.readFileSync("comment.txt", "utf-8").trim() !== "") {
        const info = fs.readFileSync("comment.txt", "utf-8").replaceAll("\n", "\n * ");
        return `/*\n * ${comment}\n * ----------------------------------------------------------------------\n * ${info}\n */\n${JSON.stringify(
            data
        )}`;
    } else {
        return `// ${comment}\n${JSON.stringify(data)}`;
    }
}

export const jsonFilePath: string[] = [];
export function UIWriteJson(file: string, data: any, options?: fs.WriteFileOptions) {
    const writeData = JSON.stringify(data);

    if (writeData == "{}") return;

    if (Configs.getConfig().compiler.encodeJson) {
        fs.writeFileSync(file, writeData, options);
    } else {
        fs.writeFileSync(file, WritePreComment(data), options);
    }
    jsonFilePath.push(file);
}
