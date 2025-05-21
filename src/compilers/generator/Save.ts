import fs from "fs";
import { Class } from "../../components/Class";
import { Random } from "../../components/Random";
import { UUID } from "../../types/objects/Manifest";
type ReturnValue = () => any;


export class Save extends Class {
    static isSaveCreated: boolean = false;

    private static write(file: fs.PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView, options?: fs.WriteFileOptions) {
        fs.writeFileSync(file, JSON.stringify(data), options);
    }

    private static read(path: fs.PathOrFileDescriptor, options?: {
        encoding?: null | undefined;
        flag?: string | undefined;
    } | null) {
        return JSON.parse(fs.readFileSync(path, options) as any);
    }

    static createFile(
        path: string,
        data: ReturnValue,
        write: Function = fs.writeFileSync,
        read: Function = fs.readFileSync
    ) {
        if (!Save.isSaveCreated && !fs.existsSync(".save")) fs.mkdirSync(".save");
        Save.isSaveCreated = true;
        if (!fs.existsSync(`.save/${path}`)) {
            const $ = data();
            write(`.save/${path}`, $, "utf-8");
            return $;
        } else return read(`.save/${path}`, "utf-8");
    }

    static createJson(path: string, data: ReturnValue) {
        return Save.createFile(path, data, this.write, this.read);
    }

    static updateFile(
        path: string,
        data: ReturnValue,
        write: Function = fs.writeFileSync,
        read: Function = fs.readFileSync
    ) {
        if (!Save.isSaveCreated && !fs.existsSync(".save")) fs.mkdirSync(".save");
        const backup = read(`.save/${path}`, "utf-8");
        write(`.save/${path}`, data());
        return backup;
    }

    static updateJson(path: string, data: ReturnValue) {
        return Save.updateFile(path, data, fs.read, fs.readFileSync);
    }

    static uuid(): [UUID, UUID] {
        return <[UUID, UUID]>Save.createJson("uuid", () => ({
            uuid: [Random.getUUID(), Random.getUUID()],
        })).uuid;
    }

    static resource(mcVersion: "stable" | "preview" = "stable") {
        return Save.createJson(`compile-${mcVersion}`, () => ({
            isDevelopment: true,
            folderName: Random.getName(),
        }));
    }

    static getBuildID() {
        return Save.createJson("buildID", () => [Random.genString(16)])[0];
    }
}
