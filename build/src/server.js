"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const http = __importStar(require("node:http"));
const url = __importStar(require("node:url"));
// set up web server
const server = http.createServer(listener);
// last known count
let count = 0;
// Map of file extensions to mime types
const mimeTypes = {
    ico: 'image/x-icon',
    js: 'text/javascript',
    css: 'text/css',
    svg: 'image/svg+xml'
};
// Process requests based on pathname
async function listener(request, response) {
    const { pathname } = url.parse(request.url);
    if (pathname === '/') {
        await main(request, response);
    }
    else if (pathname && fs.existsSync(`public${pathname}`)) {
        try {
            const contents = fs.readFileSync(`public${pathname}`, 'utf-8');
            const mimeType = mimeTypes[pathname.split('.').pop()] || 'application/octet-stream';
            response.writeHead(200, { 'Content-Type': mimeType });
            response.write(contents, 'utf-8');
        }
        catch (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.write(error + '\n');
        }
        response.end();
    }
    else {
        response.writeHead(404);
        response.end('Not found.');
    }
}
// Main page
async function main(_request, response) {
    // increment counter in counter.txt file
    try {
        count = parseInt(fs.readFileSync('counter.txt', 'utf-8')) + 1;
    }
    catch (_a) {
        count = 1;
    }
    fs.writeFileSync('counter.txt', count.toString());
    // render HTML response
    try {
        let contents = fs.readFileSync('views/index.tmpl', 'utf-8');
        contents = contents.replace('@@COUNT@@', count.toString());
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(contents, 'utf-8');
    }
    catch (error) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write(error + '\n');
    }
    response.end();
}
// Start web server on port 3000
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
