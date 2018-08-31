const PROXY_CONFIG = [
    {
        context: [
            '/api',
        ],
        target: "http://10.39.168.98:8020",
        secure: false
    },
    // {
    //     context: [
    //         "/api",
    //     ],
    //     target: "http://47.104.74.139:8080",
    //     // target: "http://10.39.168.98:8021",
    //     secure: false
    // },

];

module.exports = PROXY_CONFIG;
