const PROXY_CONFIG = [
    {
        context: [
            '/api/menus',
            '/api/views',
            '/api/setting'
        ],
        target: "http://10.39.168.98:8020",
        secure: false
    },
    {
        context: [
            "/api",
        ],
        target: "http://10.39.168.98:8021",
        secure: false
    },

];

module.exports = PROXY_CONFIG;
