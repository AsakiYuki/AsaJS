import fs from "fs";
import { Class } from "../components/Class";
import { jsonFilePath, WritePreComment } from "./PreCompile";
import { Obj } from "./reader/Object";

export class Encoder extends Class {
    static count: number = 0;

    static start() {
        for (const path of jsonFilePath) {
            const code = Encoder.readCode(path);
            const encode = Encoder.encode(code);
            Encoder.replaceCode(path, encode);
            Encoder.count++;
        }
    }

    static replaceCode(path: string, code: any) {
        fs.writeFileSync(path, WritePreComment(code).replaceAll("\\\\", "\\"), "utf-8");
    }

    static encode(code: any): any {
        return Array.isArray(code) ? Encoder.encodeArray(code) : Encoder.encodeObject(code);
    }

    static encodeArray(code: any[]): any[] {
        return code.map(value => {
            const valueType = typeof value;

            if (valueType === "object") {
                return Encoder.encode(value);
            } else if (valueType === "string") return Encoder.encodeString(value);
            else return value;
        });
    }

    static encodeObject(code: any): object {
        return Obj.map(code, (key, value): any => {
            const valueType = typeof value;
            key = Encoder.encodeString(key);

            if (valueType === "object") {
                return {
                    key,
                    value: Encoder.encode(value),
                };
            } else if (valueType === "string") {
                return { key, value: Encoder.encodeString(value) };
            } else return { key, value };
        });
    }

    static encodeString(code: string) {
        return Array.from(code)
            .map(char => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`)
            .join("");
    }

    static readCode(path: string) {
        return JSON.parse(fs.readFileSync(path, "utf-8"));
    }
}
