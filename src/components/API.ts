import { Config } from "../../config.js"

export const API_events: { onBuildFinish: ((config: Config) => void)[] } = {
	onBuildFinish: [],
}

export const API = {
	onBuildFinish: function (callback: (config: Config) => void) {
		API_events.onBuildFinish.push(callback)
	},
}
