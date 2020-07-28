import {Framework} from './constant';

/**
 * parse app.js content
 */
export const parseAppFile =function (appName,framework,view,noView){
    let method,
        commonImport=`
    path = require('path'),
    scanner = require('route-scanner')
        `;
    switch (framework) {
        case Framework.KOA2:
            method=formatAppForKoa2;
            break;
        case Framework.EXPRESS:
        default:
            method=formatAppForExpress;
            break;
    }
    return method(appName,view,noView,commonImport);
};

const formatAppForExpress=function (appName,view,noView,commonImport) {
    let viewEngineCode='';
    if(noView){
        // html
        viewEngineCode='';
    }else{
        viewEngineCode=`
app.engine('${view}',require('${view}').__express);
app.set('view engine', '${view}');
app.set('views', path.join(__dirname, 'views'));
        `;
    }

    return `
const createError = require('http-errors'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    app = express(),
    ${commonImport};

// view engine setup
${viewEngineCode}

app.use(logger('${appName}'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  load routers
scanner(app,{
    debug:false,
    routerPath: path.join(__dirname, 'routes'),
    prefix:'${appName}',   //  modifier
    replacePaths:[{
        from:'/index',
        to:'/'
    }],
    /*extraMaps:[{
        rootPath:path.join(__dirname, '/other-paths'),
        fileMaps:[{
            url:'/admin',
            file:'admin.js'
        }]
    }]*/
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
    `;
};

const formatAppForKoa2=function (appName,view,noView,commonImport) {
    let viewEngineCode='';
    if(noView){
        // html
        viewEngineCode='';
    }else{
        viewEngineCode=`
app.use(views(__dirname + '/views', {
  extension: '${view}'
}));
        `;
    }
    return `
const Koa = require('koa'),
    app = new Koa(),
    views = require('koa-views'),
    json = require('koa-json'),
    onerror = require('koa-onerror'),
    bodyparser = require('koa-bodyparser'),
    logger = require('koa-logger'),
    ${commonImport};

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

// set view
${viewEngineCode}

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(\`\${ctx.method} \${ctx.url} - \${ms}ms\`);
});

//  load routers
scanner(app,{
    debug:false,
    routerPath: path.join(__dirname, 'routes'),
    prefix:'${appName}',   //  modifier
    replacePaths:[{
        from:'/index',
        to:'/'
    }],
    /*extraMaps:[{
        rootPath:path.join(__dirname, '/other-paths'),
        fileMaps:[{
            url:'/admin',
            file:'admin.js'
        }]
    }]*/
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
    `;
};