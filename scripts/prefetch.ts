import { Github, PFFS } from "./components"

Github.readFile("KalmeMarq", "Bugrock-JSON-UI-Schemas", "main", "ui.schema.json").then(data => {
	PFFS.writeFile("ui.schema.json", data)
})
