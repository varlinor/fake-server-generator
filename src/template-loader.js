import fs from 'fs';
import path from 'path';

import {TemplatePath, Operation, createFileObject, TemplateDirType} from './constant';
import {parseBinFile} from './bin-loader';
import {parseAppFile} from './app-loader';

/**
 * base class for template loader
 */
class TemplateLoader {
    constructor(setting){
        this.setting=setting;
        this.template=new Map();  //  path => content
        this.__init();
    }

    __init() {
        let {git,eslint}=this.setting,
            bin=this.parseBinContent(),
            app=this.parseAppContent(),
            pkg=this.parsePkgContent();
        //  add eslint dependencies
        if(eslint){
            this.addDepenency(pkg,'eslint','^7.5.0',true);
            this.addDepenency(pkg,'eslint-plugin-import','^2.22.0',true);
            this.addDepenency(pkg,'eslint-config-airbnb','^18.2.0',true);
        }

        this.template.set(path.join(TemplatePath.BinPath,'www'),
            createFileObject(Operation.Write,{content:bin}));
        this.template.set(path.join(TemplatePath.AppPath,'app.js'),
            createFileObject(Operation.Write,{content:app}));
        this.template.set(path.join(TemplatePath.PkgPath,'package.json'),
            createFileObject(Operation.Write,{content:pkg}));
        this.addRouteFiles();
        this.addViews();
        addPublics(this.template);
        git && addGitignore(this.template);
        eslint && addESLintFiles(this.template);
    }

    getTemplate(){
        return this.template;
    }

    /**
     * return bin/www content
     */
    parseBinContent(){
        //  default load
        let {appName, framework, port} = this.setting;
        return parseBinFile(appName, framework, port);
    }

    /**
     * return app.js content
     */
    parseAppContent(){
        let {appName,framework,view,noView}=this.setting;
        return parseAppFile(appName,framework,view,noView);
    }

    /**
     * add router files
     */
    addRouteFiles(){
        let {framework}=this.setting,
            files=this.listFiles(TemplateDirType.Routes,framework);
        console.log(files);
        files.map( f =>{
            this.template.set(path.join(TemplatePath.RoutePath,f.name.replace(`${framework}.js`,'js')),
                createFileObject(Operation.Copy,{path:`/templates/${TemplateDirType.Routes}/${f.name}`})) ;
        });
    }

    /**
     * add views files
     */
    addViews(){
        let {view,noView}=this.setting;
        if(noView){
            view='html';
        }
        let files=this.listFiles(TemplateDirType.Views,view);
        console.log(files);
        files.map( f =>{
            let destP='',
                srcP=`/templates/${TemplateDirType.Views}/${f.name}`;
            if(noView){
                destP=path.join(TemplatePath.PublicPath,f.name);
            }else{
                destP=path.join(TemplatePath.ViewPath,f.name);
            }
            this.template.set(destP,
                createFileObject(Operation.Copy,{path:srcP})) ;
        });
    }

    /**
     * return package.json content
     */
    parsePkgContent(){}

    /**
     * load files by view type and framework type
     * @param type  views / routes
     * @param key  framework / view  value
     */
    listFiles(type,key){
        let queryPath=path.resolve(__dirname,'../templates',type),
            vRex=new RegExp('\\w*(.'+key+')'),
            rRex=new RegExp('\\w*(.'+key+'.js)');
        return fs.readdirSync(queryPath,{withFileTypes:true}).filter( fd =>{
            if(fd.isFile()){
                if(type===TemplateDirType.Views){
                    return vRex.test(fd.name);
                }else if(type===TemplateDirType.Routes){
                    return rRex.test(fd.name);
                }
            }
        });
    }

    getDefaultPkg(){
        return {
            version: '0.1.0',
            private: true,
            scripts: {
                start: 'node ./bin/www',
                dev:'nodemon ./bin/www',
            },
            dependencies: {
                'route-scanner': '^0.2.1',
                'mockjs':'^1.1.0',
            },
            devDependencies:{
                'nodemon': '^2.0.4'
            }
        };
    }

    addDepenency(p,name,version,isDev=false){
        if(isDev){
            p.devDependencies[name]=version;
        }else{
            p.dependencies[name]=version;

        }
    }
}

const addGitignore = function (map){
    map.set(path.join(TemplatePath.GitIgnore,'.gitignore'),
        createFileObject(Operation.Copy,{path:'/templates/gitignore'}));
    return map;
};

const addPublics = function (map){
    map.set(path.join(TemplatePath.PublicPath,'/images'),createFileObject(Operation.MakeDir));
    map.set(path.join(TemplatePath.PublicPath,'/javascripts'),createFileObject(Operation.MakeDir));
    map.set(path.join(TemplatePath.PublicPath,'/stylesheets/base.css'),
        createFileObject(Operation.Copy,{path:'/templates/base.css'}));
    return map;
};

const addESLintFiles =function (map) {
    map.set(path.join(TemplatePath.ESLint,'.eslintignore'),
        createFileObject(Operation.Copy,{path:'/templates/eslintignore'}));
    map.set(path.join(TemplatePath.ESLint,'.eslintrc.js'),
        createFileObject(Operation.Copy,{path:'/templates/eslintrc.js'}));
    return map;
};

export default TemplateLoader;