<div align="center">
<img src="./resources/logo.png" />

<h2 align="center">
    <a href="https://asajs.asakiyuki.com/">AsaJS</a> - The <a href="https://www.minecraft.net/en-us">Minecraft: Bedrock Edition</a> JSON-UI Framework
</h2>
    
[![asajs version](https://img.shields.io/npm/v/asajs.svg?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/asajs)
[![asajs license](https://img.shields.io/npm/l/asajs.svg?style=for-the-badge&labelColor=000000)](https://github.com/AsakiYuki/AsaJS/blob/main/README.md)
[![asajs downloads](https://img.shields.io/npm/dm/asajs.svg?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/asajs)
</div>

**AsaJS** is a NodeJS library designed to empower developers to create **JSON-UI** packages for Minecraft: Bedrock Edition using **JavaScript** or **TypeScript**.

Say goodbye to the tedious and repetitive nature of manual JSON editing. AsaJS streamlines your workflow by bringing the programmatic flexibility to Minecraft UI development.

## 🛠 Installation

To use AsaJS, ensure you have **[Node.js](https://nodejs.org/en)** installed on your system.

```bash
npx create-asajs
```

## 📖 "Hello World!" Example

Creating a custom UI with AsaJS is straightforward. Here is how you can insert a custom label onto the Minecraft Start Screen:

```javascript
import { Anchor, Label, Modify } from "asajs"

const label = Label({
	text: "Hello World from my Custom UI!",
	shadow: true,
	anchor: Anchor.TOP_MIDDLE,
	offset: [0, 10],
})

// This code injects the label into the top of the start screen
Modify("start", "start_screen_content").insertChild(label)
```

<!-- ## 📚 Documentation

Detailed guides and API references are available at: 👉 https://asajs.asakiyuki.com/ -->

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.
