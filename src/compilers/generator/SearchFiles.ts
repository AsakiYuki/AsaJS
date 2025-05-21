import { Class } from "../../components/Class";
import fs from "fs";

interface CallbackValue {
    folder?: string;
    file: string;
    path: string;
}


function searchForEachFileRecursion(
    path: string,
    callback: (value: CallbackValue) => void,
    $1: string = "",
    $2: string = "",
    $3: string = ""
) {
    if (fs.statSync(path).isDirectory())
        for (const file of fs.readdirSync(path))
            searchForEachFileRecursion(
                `${path}/${file}`,
                callback,
                file,
                `${$2}/${file}`,
                $2.match(/(?<=\/)\w+$/)?.[0]
            );
    else
        callback({
            file: $1,
            folder: $3 === "" ? undefined : $3,
            path: $2.slice(1),
        });
}


export class SearchFiles extends Class {
    static array(folderPath: string, prefix?: string): Array<string> {
        const paths: Array<string> = [];
        SearchFiles.forEach(folderPath, value =>
            paths.push(`${prefix ? `${prefix}/` : ""}${value.path}`)
        );
        return paths;
    }

    static forEach(folderPath: string, callback: (value: CallbackValue) => void): void {
        searchForEachFileRecursion(folderPath, callback);
    }
}
