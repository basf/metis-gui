const connect = require('connect');
const { createProxyMiddleware } = require('http-proxy-middleware');
const sirv = require('sirv');

const port = process.env.SERVER_PORT || 5000;
const dir = process.env.SERVER_DIR || 'dist';

const server = connect();

if (process.env.PROXY_PATH && process.env.PROXY_TARGET) {
    server.use(createProxyMiddleware(`${process.env.PROXY_PATH}/**`, {
        target: process.env.PROXY_TARGET, 
        changeOrigin: true, 
        pathRewrite: {'/api' : ''},
        onProxyReq(proxyReq, req) { 
            Object.entries(req.headers).forEach(([ name, value ]) => {
                if (name.includes('x-')) {
                    proxyReq.setHeader(name, value);
                }
            });
        }
    }));
}

server.use(sirv(dir, { dev: true, single: true }));

server.listen(port, () => {
    console.log(`[SRV] Local server: http://localhost:${port}/ \n`);
});