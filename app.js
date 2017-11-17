const path = require('path');
const _ = require('lodash');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const staticServer = require('koa-static');
const views = require('koa-views');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const DB_FACADE = require('./DB_FACADE');


// 设置cookie的key
app.keys = ["key", "keykeys"];


app.use(async (ctx, next) => {
    await next();
    if(parseInt(ctx.status) === 404){
        ctx.body = '404';
    }
});


router
    .get('/', async (ctx, next) => {
        
        ctx.res.setHeader('Cache-Control', "no-cache");
        ctx.res.setHeader('Content-Type', 'text/html');
        ctx.res.writeHead('200');
        
        
        // 输出框架
        ctx.res.write(DB_FACADE.get_portal())
        
        
        
        /* 
        // worst
        // 串行
        let users = await DB_FACADE.get_users()
        ctx.res.write(users)
        
        let posts = await DB_FACADE.get_posts()
        ctx.res.write(posts)
        
        ctx.res.end()
        */
        
        
        
        /*
        // better
        // 并行 一次性返回
        let data = await Promise.all( [DB_FACADE.get_users(), DB_FACADE.get_posts()] )
        ctx.res.write(data[0])
        ctx.res.write(data[1])
        ctx.res.write("</body></html>")
        ctx.res.end()
        */
        
        
        
        // best - bigpipe!
        // 并行 实时返回
        await Promise.all( [DB_FACADE.get_users().then(r=>{
                                ctx.res.write(r)
                            }), 
                            DB_FACADE.get_posts().then(r=>{
                                ctx.res.write(r)
                            }),
                            DB_FACADE.get_hobbies().then(r=>{
                                ctx.res.write(r)
                            })] )
        
        ctx.res.write("</body></html>")
        ctx.res.end()
        
        
    })

    
// 静态资源处理
//app.use(staticServer(path.join(__dirname)));


// log
app.use(async (ctx, next) => {
    let reqTime = new Date();
    await next();
    let resTime = new Date();
    let data = ctx.method === 'POST' ? JSON.stringify(ctx.request.body) : JSON.stringify(ctx.query);
    console.log(ctx.ip, reqTime, resTime-reqTime, ctx.method, ctx.path, ctx.protocol, ctx.status, ctx.headers['user-agent'], data);
});


// body parser 解析
//app.use(bodyParser());


// 路由
app
    .use(router.routes())
    .use(router.allowedMethods());

  
app.on('error', function(err, ctx){
    console.error('server error::', err, ctx);
});

app.listen(8048);
