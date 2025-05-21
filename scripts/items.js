const fs = require("fs");
(async () => {
    const itemsList = await fetch("https://api.asakiyuki.com/games/minecraft/item-ids").then(v =>
        v.json()
    );

    const list = [];

    for (const key in itemsList) {
        const id = itemsList[key];
        list.push(`    '${key}' = ${id * 65536}`);
    }

    fs.writeFileSync(
        "src/types/enums/ItemAuxID.ts",
        `export enum ItemAuxID {\n${list.join(",\n")}\n}`,
        "utf-8"
    );
})();
