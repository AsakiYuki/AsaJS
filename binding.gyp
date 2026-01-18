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

            "cflags_cc": [ "-std=c++17" ],
        }
    ]
}
