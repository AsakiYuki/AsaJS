// Env
export const env = `const env = {};

module.exports = { env };`;

// Global variables
export const globalVariables = `const {} = require("asajs");

const global_variables = {};

module.exports = { global_variables };`;

// Config
export const config = `/**
 * Configuration object for the JsonUI Scripting build process.
 * @type {import('asajs').Config}
 */
const config = {
    compiler: {
        autoCompress: false,
        fileExtension: "json",
        encodeJson: false,
        UI: {
            nameLength: 32,
            namespaceAmount: 16,
            namespaceLength: 32,
            obfuscateName: false,
            obfuscateType: false,
        },
    },
    installer: {
        autoInstall: true,
        developEvironment: true,
        previewVersion: false,
        customPath: false,
        installPath: "/your/minecraft/data/path",
    },
    manifest: {
        name: "JsonUI Scripting",
        description: "Build with JsonUI Scripting <3",
    },
};

module.exports = { config }`;

// Gitignore
export const gitignore = `# Node packages
node_modules

# Build Folders
.minecraft
.build
.save

# Build variables
asakiyuki.env.cjs

# Compress package
Minecraft-UIBuild.mcpack`;
