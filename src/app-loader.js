import {Framework, ViewTemplate} from './constant';

/**
 * parse app.js content
 */
export const parseAppFile =function (appName,framework,view,noView){
    let method,
        commonImport=`path = require('path'),
    scanner = require('route-scanner')`;
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
        let hbsPartial='';
        if(ViewTemplate.HBS===view){
            hbsPartial='app.engine(\'hbs\',require(\'hbs\').__express); ';
        }
        viewEngineCode=`
// view engine setup
${hbsPartial}
app.set('view engine', '${view}');
app.set('views', path.join(__dirname, 'views'));
        `;
    }

    return `const createError = require('http-errors'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    cors=require('cors'),
    app = express(),
    ${commonImport};

${viewEngineCode}

app.use(logger('${appName}'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  add cors
app.use(cors());

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
    let viewImport='',
        viewEngineCode='';
    if(noView){
        // html
        viewImport=`views = require('koa-views'),  // not support when you select hbs as viewEngine
                `;
        viewEngineCode=`
app.use(views(__dirname + '/views', {
  extension: 'html'
}));
        `;
    }else{
        switch (view){
            case ViewTemplate.PUG:
                viewImport='views = require(\'koa-views\'),  // not support when you select hbs as viewEngine';
                viewEngineCode=`
app.use(views(__dirname + '/views', {
  extension: '${view}'
}));
        `;
                break;
            case ViewTemplate.HBS:
            default:
                viewImport='hbs = require(\'koa-hbs\'),';
                viewEngineCode=`
app.use(hbs.middleware({
    viewPath:path.join(__dirname,'views'),
    defaultLayout:path.join(__dirname , 'views'),
    extname: ".hbs",
    locals:{
        layout:'layout'
    }
}));
                `;
                break;
        }

    }
    return `const Koa = require('koa'),
    app = new Koa(),
    ${viewImport}
    json = require('koa-json'),
    onerror = require('koa-onerror'),
    bodyparser = require('koa-bodyparser'),
    logger = require('koa-logger'),
    cors = require('koa2-cors');
    ${commonImport};

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(path.join(__dirname, 'public')));

// set view
${viewEngineCode}

//  add cors
app.use(cors());

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
    /*replacePaths:[{
        from:'/index',
        to:'/'
    }],
    extraMaps:[{
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