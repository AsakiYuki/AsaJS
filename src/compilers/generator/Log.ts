import { Class } from "../../components/Class";

export const Logs: Array<{ type: "warning" | "error"; message: string }> = [];

export class Log extends Class {
    static warning(message: string) {
        Logs.push({
            type: "warning",
            message: `\x1b[93m[Warning]\x1b[0m >> ${message}`,
        });
    }

    static error(message: string) {
        Logs.push({
            type: "error",
            message: `\x1b[31m[Error]\x1b[0m >> ${message}`,
        });
    }
}
