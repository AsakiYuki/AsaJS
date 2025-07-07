import { config, env, globalVariables, gitignore } from "../../template";
import { GenerateDir } from "./GenerateDir";
import fs from "fs";

export function firstRun() {
    // Template Object
    const template: { [file: string]: string } = {
        ".gitignore": gitignore,
        "asakiyuki.config.cjs": config
            .replace("{packname}", "AsaJS")
            .replace("{packdescription}", "Build with AsaJS <3")
            .replace("{autoinstall}", "true")
            .replace("{development}", "true")
            .replace("{preview}", "false"),
        "asakiyuki.global_variables.cjs": globalVariables,
        "asakiyuki.env.cjs": env,
    };

    // Generator
    for (const file in template) {
        if (!fs.existsSync(file)) {
            GenerateDir(file);
            fs.writeFileSync(file, template[file], "utf-8");
        }
    }
}
