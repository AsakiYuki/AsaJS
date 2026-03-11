import path from "path"
import { storage } from "../../compiler/storage.js"
import { JsonBuilder } from "./JsonBuilder.js"
import {
	Capabilitie,
	Dependencie,
	FormatVersion,
	Header,
	ManifestObject,
	Metadata,
	Module,
	Setting,
} from "../../types/components/manifest.js"

export class Manifest extends JsonBuilder {
	protected modules: Module[] = []
	protected dependencies: Dependencie[] = []
	protected capabilities: Capabilitie[] = []
	protected metadata: Metadata = {}
	protected settings: Setting[] = []

	constructor(
		folder: string,
		protected readonly format_version: FormatVersion,
		protected readonly header: Header,
	) {
		const file = path.join(folder, "manifest.json")
		super(file)
		storage.set(file, this)
	}

	public addModules(...modules: Module[]) {
		this.modules.push(...modules)
		return this
	}

	public addDependencies(...dependencies: Dependencie[]) {
		this.dependencies.push(...dependencies)
		return this
	}

	public addCapabilities(...capabilities: Capabilitie[]) {
		this.capabilities.push(...capabilities)
		return this
	}

	public setMetadata(metadata: Metadata) {
		Object.assign(this.metadata, metadata)
		return this
	}

	public addSettings(...settings: Setting[]) {
		this.settings.push(...settings)
		return this
	}

	public toJSON(): ManifestObject {
		const manifest: ManifestObject = {
			format_version: this.format_version,
			header: this.header,
		}

		if (this.modules.length > 0) manifest.modules = this.modules
		if (this.dependencies.length > 0) manifest.dependencies = this.dependencies
		if (this.capabilities.length > 0) manifest.capabilities = this.capabilities
		if (Object.keys(this.metadata).length > 0) manifest.metadata = this.metadata
		if (this.settings.length > 0) manifest.settings = this.settings

		return manifest
	}
}
