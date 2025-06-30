import { UUID } from "crypto";
import { ManifestInterface, SemverString, Type, Version } from "../../types/objects/Manifest";
import { Save } from "./Save";

interface ManifestHeader {
	name: string;
	description?: string;
	uuid?: UUID;
	version?: Version | SemverString;
}

interface ManifestMetadata {
	authors?: Array<string>;
	license?: string;
	url?: string;
	producType?: string;
	generatedWith?: object;
}

export class Manifest {
	manifest: ManifestInterface;

	constructor(header: ManifestHeader, type: Type = Type.Resources, metadata?: ManifestMetadata) {
		const uuid = Save.uuid();

		this.manifest = {
			format_version: 2,
			header: {
				name: header.name,
				uuid: header.uuid || uuid[0],
				description: header.description,
				version: header.version || [1, 0, 0],
			},
			modules: [
				{
					type: type,
					uuid: uuid[1],
					version: [1, 0, 0],
				},
			],
			metadata: metadata && {
				authors: metadata.authors,
				license: metadata.license,
				url: metadata.url,
				product_type: metadata.producType,
				generated_with: metadata.generatedWith,
			},
		};
	}

	buildJson() {
		return JSON.stringify(this.manifest, null, 4);
	}
}
