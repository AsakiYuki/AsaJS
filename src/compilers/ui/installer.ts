import os from "os"
import path from "path"

export function getGamedataPath() {
	switch (os.platform()) {
		case "win32": {
			if (/Windows (10|11)/.test(os.version())) {
				return path.join(process.env.APPDATA!, "Minecraft Bedrock\\Users\\Shared\\games\\com.mojang")
			}
		}

		default: {
			console.error(`Your platform is not supported the install feature yet! \nYour OS version: ${os.version()}`)
			process.exit(1)
		}
	}
}
