{
    "targets": [
        {
            "target_name": "asajs-compiler",
            "sources": [
                "src/native/main.cpp",
            ],

            "dependencies": [
                "<!(node -p \"require('node-addon-api').targets\"):node_addon_api",
            ],

            "msvs_settings": {
                "VCCLCompilerTool": {
                    "LanguageStandard": "stdcpp20"
                }
            }
        }
    ]
}
