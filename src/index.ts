import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import koaBody from 'koa-body';

const items = [
  { id: 100, iname: 'Quartz Analog Wrist Watch', price: 'US $4.99' },
  { id: 101, iname: 'Leather Peep Pump Heels', price: 'US $33.56' },
  { id: 102, iname: 'Apple iPod', price: 'US $219.99' },
  { id: 103, iname: 'Prince Phantom 97P Tennnis Racket', price: 'US $50.00' },
];

const app = new Koa();
const router = new Router({
  prefix: "/api"
})

app.use(json())
app.use(logger())
app.use(bodyParser())
app.use(koaBody({ multipart: true }));

app.use(async (ctx, next) => {
  ctx.body = ctx.origin;
  await next();
})

app.use(async (ctx, next) => {
  const now = new Date();
  await next();
  console.log(ctx.origin, new Date().getTime() - now.getTime());
})

router.get('/info', async (ctx, next) => {
  ctx.body = items;
  await next()
});

router.get('/404', async (ctx, next) => {
  ctx.status = 404;
  await next()
  ctx.body = items;
});


router.post('', async (ctx, next) => {
  const body = ctx.request.body;
  ctx.body = body;
  await next();
})
app.use(router.routes()).use(router.allowedMethods());


app.on('error', function (err) {
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("bootstarp service port 3000");
});