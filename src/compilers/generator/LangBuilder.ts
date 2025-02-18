import fs from "fs-extra";
import { Class } from "../../compoments/Class";
import { localizeText } from "../../compoments/LocalizeText";

export class LangBuilder extends Class {
    static build(buildPath: string) {
        fs.mkdirSync(`${buildPath}/texts`, { recursive: true });

        for (const langFile in localizeText) {
            const langContent: Record<string, string> = localizeText[langFile];
            let text = "## The entire text below is built entirely using JSONUI SCRIPTING!";

            for (const key in langContent) {
                text += `\n${key}=${langContent[key]}`;
            }

            if (fs.pathExistsSync(`.bedrock/texts/${langFile}.lang`)) {
                const content = fs.readFileSync(`.bedrock/texts/${langFile}.lang`, "utf-8");
                fs.writeFileSync(
                    `${buildPath}/texts/${langFile}.lang`,
                    `${content}\n\n${text}`,
                    "utf-8"
                );
                console.timeLog("COMPILER", `${langFile}.lang has been updated!`);
            } else {
                fs.writeFileSync(`${buildPath}/texts/${langFile}.lang`, text, "utf-8");
                console.timeLog("COMPILER", `${langFile}.lang has been generated!`);
            }
        }

        return Object.keys(localizeText).length;
    }
}
