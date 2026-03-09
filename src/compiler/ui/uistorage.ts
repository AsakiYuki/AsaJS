import { InitStorage, storage } from "./initstorate.js"

export function GetUIStorage(namespace: string, file: string): UIStorage {
	const $ = storage.get(file)
	if ($) {
		if ($.isUI) {
			const $ui = $ as UIStorage
			if ($ui.namespace === namespace) return $ui
			else throw new Error("UI already exists")
		} else throw new Error(`${file} is not a UI file`)
	} else {
		const ui = new UIStorage(namespace, file)
		storage.set(file, ui)
		return ui
	}
}

class UIStorage extends InitStorage {
	isUI = true

	constructor(
		public namespace: string,
		file: string,
	) {
		super(file)
	}

	public toJSON() {
		return {
			namespace: this.namespace,
			...this.get(),
		}
	}
}
