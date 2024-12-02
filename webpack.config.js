const path = require('path');
module.exports = {
    entry: {
        index: './src/index.js', 
    },
    output: {
        filename: 'bundle.js', 
        path: path.resolve('./build'),
    },

    devServer: {
        static: {
            directory: path.join(__dirname, './build'),
        },
        port: 8080, // 預覽網頁要跑在哪個port
    },
    mode: 'development'
};