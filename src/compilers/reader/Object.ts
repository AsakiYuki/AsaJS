import { Class } from "../../components/Class";

type CallbackObject = (key: string, value: any) => void;
type CallbackObjectMap = (key: string, value: any) => { key: string; value: any };

export class Obj extends Class {
    static forEach(data: object, callback: CallbackObject): void {
        for (const key in data) {
            const element = (<any>data)[key];
            callback(key, element);
        }
    }

    static map(data: object, callback: CallbackObjectMap): object {
        for (const key in data) {
            const getdata = callback(key, (<any>data)[key]);
            delete (<any>data)[key];
            (<any>data)[getdata.key] = getdata.value;
        }
        return data;
    }
}
