// Env
export const env = `const env = {};

module.exports = { env };`;

// Global variables
export const globalVariables = `const {} = require("asajs");

const global_variables = {};

module.exports = { global_variables };`;

// Config
export const config = `/**
 * Configuration object for the AsaJS build process.
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
            optimizeControls: true,
            obfuscateName: false,
            obfuscateType: false,
        },
    },
    installer: {
        autoInstall: {autoinstall},
        allowGDK: true,
        installGDKUser: "{userid}",
        developEvironment: {development},
        previewVersion: {preview},
        customPath: false,
        installPath: "/your/minecraft/data/path",
    },
    manifest: {
        name: "{packname}",
        description: "{packdescription}",
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
