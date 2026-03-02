#!/usr/bin/env node

import { input, confirm } from "@inquirer/prompts"
import fs from "fs/promises"
import { spawnSync } from "child_process"
import os from "os"
import p from "path"

async function setup({
	path,
	name,
	npmName,
	useTypeScript,
	allowCompiler,
	autoInstall,
	installToPreview,
	nightly,
}: {
	path: string
	name: string
	npmName: string
	useTypeScript: boolean
	allowCompiler: boolean
	autoInstall: boolean
	installToPreview: boolean
	nightly: boolean
}) {
	await Promise.all([
		fs.mkdir(p.join(path, "src"), { recursive: true }),
		fs.mkdir(p.join(path, "build"), { recursive: true }),
		fs.mkdir(p.join(path, "custom"), { recursive: true }),
	])

	const mapping: Record<string, string | number | boolean> = {
		projectName: name,
		allowCompiler,
		autoInstall,
		installToPreview,
	}

	let pkg = "asajs"
	if (nightly) pkg += "@indev"

	await fs.writeFile(
		p.join(path, "package.json"),
		JSON.stringify(
			{
				name: npmName,
				description: "Create your Minecraft JSON-UI resource packs using JavaScript.",
				type: "module",
				main: "src/index.js",
				scripts: useTypeScript
					? {
							build: "npx bun src/index.ts",
							dev: "npx bun --watch src/index.ts",
						}
					: {
							build: "node src/index.js",
							dev: "node src/index.js",
						},
			},
			null,
			4,
		),
	)

	spawnSync("npm.cmd", ["install", pkg], {
		cwd: path,
		stdio: "inherit",
		shell: true,
	})

	await Promise.all([
		fs.copyFile(
			p.join(__dirname, "../resources/code.js"),
			p.join(path, "src", useTypeScript ? "index.ts" : "index.js"),
		),
		fs.copyFile(p.join(__dirname, "../resources/pack_icon.png"), p.join(path, "build/pack_icon.png")),
		fs.writeFile(
			p.join(path, "asajs.config.js"),
			await fs.readFile(p.join(__dirname, "../resources/config.txt"), "utf-8").then(v => {
				return v.replace(/{\w+}/g, v => {
					const map = mapping[v.slice(1, -1)]
					return `${map === undefined ? v : map}`
				})
			}),
			"utf-8",
		),
	])
}

async function run() {
	const { path, name } = (await input({
		message: "What is your project name?",
		default: "my-project",
	}).then(async v => {
		const name = v
			.match(/[a-zA-Z0-9]+/g)
			?.join("-")
			.toLowerCase()

		if (!name) {
			console.error("Invalid project name")
			process.exit(1)
		}

		try {
			if (await fs.stat(name)) {
				console.error("Project name already exists")
				process.exit(1)
			}
		} catch (error) {
			return {
				path: name,
				name: v,
			}
		}
	}))!

	const useTypeScript = await confirm({
		message: "Do you want to use TypeScript?",
		default: true,
	})

	const nightly = await confirm({
		message: "Do you want to use nightly version?",
		default: false,
	})

	const allowCompiler = await confirm({
		message: "Do you want to allow the compiler to build the project into output files?",
		default: true,
	})

	const autoInstall =
		allowCompiler && ["win32"].includes(os.platform())
			? await confirm({
					message:
						"Do you want the pack to be automatically installed into the game after it finishes building?",
					default: true,
				})
			: false

	const installToPreview = autoInstall
		? await confirm({
				message: "Do you want the pack to be installed into the Minecraft Preview version?",
				default: false,
			})
		: false

	await setup({
		path: p.resolve(process.cwd(), path),
		name,
		npmName: path,
		useTypeScript,
		allowCompiler,
		autoInstall,
		installToPreview,
		nightly,
	})
}

run()
