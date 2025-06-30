import fs from "fs";

export function GenerateDir(installPath: string, path?: string): void {
    path = path ? `${installPath}/${path}` : installPath;

    if (!fs.existsSync(path)) {
        let lastPath = "";
        const folderPath = path.split("/") || [];
        folderPath.pop();
        for (const folder of folderPath) {
            if (!(folder === "" || fs.existsSync(`${lastPath}${folder}`)))
                fs.mkdirSync(`${lastPath}${folder}`);
            lastPath = `${lastPath}${folder}/`;
        }
    }
}
