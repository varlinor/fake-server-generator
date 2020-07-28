import path from 'path';
import program from 'commander';
import colors from 'colors';

import {version} from '../package.json';
import {Framework,ViewTemplate} from './constant';

import ServerGenerator from './factory';

program
    .name('fs-gen')
    .version(version)
    .usage('[options] [dir]')
    .option('-f, --framework <framework>','specify <framework> support (express|koa2) (default to express)')
    .option('-E, --express','specify express as framework')
    .option('-K, --koa2','specify koa2 as framework')
    .option('    --view <engine>', 'add view <engine> support (hbs|pug) (defaults to hbs)')
    .option('    --no-view', 'use static html instead of view engine')
    .option('-p, --port <port>','specify <port> to this server')
    .option('    --git', 'init git and add .gitignore')
    .option('    --eslint','add .eslintrc.js and .eslintignore')
    .parse(process.argv);

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */

const createAppName= function(pathName) {
    return path.basename(pathName)
        .replace(/[^A-Za-z0-9.-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
};

const parseArguments= function(pro){
    let settings={},
        {framework,view,express,koa2,git,eslint}=pro,
        destPath= program.args.shift() || '.',
        appName=createAppName(path.resolve(destPath)) || 'demo';
    settings.destPath=destPath;
    settings.appName=appName;
    if(view===false){
        settings.noView=true;
    }else{
        settings.view=view || ViewTemplate.HBS;
    }
    if(koa2 ){
        settings.framework=Framework.KOA2;
    }else if(express){
        settings.framework=Framework.EXPRESS;
    }else{
        settings.framework=framework || Framework.EXPRESS;
    }
    settings.git=git || false;
    settings.eslint=eslint || false;
    console.log(settings);
    return settings;
};

const settings=parseArguments(program),
    serverGen=new ServerGenerator(settings);

// generator project
serverGen.generator();

