import { Class } from "../../components/Class";
import { Vector3, Vector4 } from "../../types/values/Vector";

export class ColorHandler extends Class {
    static parse(data: string): Vector3 | Vector4 | null {
        if (data.startsWith("#")) data = data.slice(1);

        try {
            const color = parseInt(data, 16);
            switch (data.length) {
                case 3:
                    return [((color >> 8) & 15) / 15, ((color >> 4) & 15) / 15, (color & 15) / 15];
                case 6:
                    return [
                        ((color >> 16) & 255) / 255,
                        ((color >> 8) & 255) / 255,
                        (color & 255) / 255,
                    ];
                case 4:
                    return [
                        ((color >> 16) & 15) / 15,
                        ((color >> 8) & 15) / 15,
                        ((color >> 4) & 15) / 15,
                        (color & 15) / 15,
                    ];
                case 8:
                    return [
                        ((color >> 24) & 255) / 255,
                        ((color >> 16) & 255) / 255,
                        ((color >> 8) & 255) / 255,
                        (color & 255) / 255,
                    ];
                default:
                    return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
