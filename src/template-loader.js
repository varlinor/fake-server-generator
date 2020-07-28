import path from 'path';

import {TemplatePath,Operation,createFileObject} from './constant';

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
        // console.log(this.template);
    }

    getTemplate(){
        return this.template;
    }

    /**
     * return bin/www content
     */
    parseBinContent(){}

    /**
     * return app.js content
     */
    parseAppContent(){}

    /**
     * add router files
     */
    addRouteFiles(){}

    /**
     * add views files
     */
    addViews(){}

    /**
     * return package.json content
     */
    parsePkgContent(){}

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