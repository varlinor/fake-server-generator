import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

import {Framework, Operation} from './constant';
import Koa2TemplateLoader from './koa2-template';
import ExpressTemplateLoader from './express-template';


const _def_opts = {
    appName: '',
    destPath: '',
    port:3000,
    framework: '',
    view: '',
    noView: false,
    git: false,
    eslint: false,
};

/**
 * generator framework template
 */
class ServerGenerator {

    constructor(opts) {
        this.options = Object.assign({}, _def_opts, opts);
        this.template = null;
    }

    generator() {
        // load to map
        this.__loadTemplate();
        // process map
        this.__processTemplates();
        // init git
        this.__initGit();
    }

    __loadTemplate() {
        let {framework}=this.options,
            ParseClass = undefined;
        switch (framework) {
            case Framework.KOA2:
                ParseClass = Koa2TemplateLoader;
                break;
            case Framework.EXPRESS:
            default:
                ParseClass = ExpressTemplateLoader;
                break;
        }
        if (ParseClass !== null) {
            this.template = new ParseClass(this.options).getTemplate();
        }
    }

    __processTemplates() {
        let self = this,
            {appName, destPath} = self.options;
        if (self.template) {
            for (let [k, {operation, path: p, content}] of self.template) {
                // console.log(k,operation,p,content);
                const genPath = path.join(destPath, k);
                switch (operation) {
                    case Operation.Write:
                        console.log('write', path.dirname(genPath));
                        ensureParent(genPath);
                        shell.echo(content).to(genPath);
                        if (k.indexOf('bin') > -1 && k.indexOf('www') > 0) {
                            console.log('add x to file:bin/www');
                            shell.chmod('u+x', genPath);
                        }
                        break;
                    case Operation.Copy:
                        let sr = path.join(__dirname, '../', p);
                        console.log('copy', sr, ' to ', genPath);
                        ensureParent(genPath);
                        shell.cp('-r', sr, genPath);
                        break;
                    case Operation.MakeDir:
                        console.log('mkdir', genPath);
                        shell.mkdir('-p', genPath);
                        break;
                    case Operation.None:
                    default:
                        break;
                }
            }
            // finish generator
            console.log(`You can start your app[${appName}] with this command:`);
            const helpInfo=`
    cd ${appName}/
    npm install
    npm start
`;
            console.log(helpInfo);
        }
    }

    __initGit(){
        let {destPath,git}=this.options;
        if(git){
            // entry destpath
            shell.cd(destPath);
            // git init
            shell.exec('git init');
        }
    }


}

/**
 * ensure parent exist
 * @param dirPath
 */
const ensureParent = function (dirPath) {
    if (dirPath) {
        let parentPath = path.dirname(dirPath);
        if (!fs.existsSync(parentPath)) {
            shell.mkdir('-p', parentPath);
        }
    }
};

export default ServerGenerator;