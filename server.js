import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import fetch from 'isomorphic-fetch';
import path from 'path';
import {fileURLToPath} from 'url';
import serveStatic from 'koa-static';

const app = new Koa();
const router = new Router();
const port = 3011;

app.use(cors({origin: '*'}));

router.get('/', (ctx) => {
    ctx.type = 'html';
    ctx.body = createReadStream('index.html');
});

// get access to main.css, main.js for index.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(serveStatic(path.join(__dirname + '')));

app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(router.routes());

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

