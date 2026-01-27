import { RandomString } from "../components/Utils.js"

const namespaces = Array.from({ length: 15 }, () => RandomString(16))

export function RandomNamespace() {
	return namespaces[Math.floor(Math.random() * namespaces.length)]
}
