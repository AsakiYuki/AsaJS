import { InitStorage, storage } from "./initstorate.js"

export function GetModifyStorage(file: string): ModifyStorage {
	const $ = storage.get(file)
	if ($) {
		if ($.isUI) throw new Error(`${file} is not a Modify file`)
		else {
			return $ as ModifyStorage
		}
	} else {
		const modify = new ModifyStorage(file)
		storage.set(file, modify)
		return modify
	}
}

class ModifyStorage extends InitStorage {
	isUI = false

	constructor(file: string) {
		super(file)
	}

	public toJSON() {
		return this.get()
	}
}
