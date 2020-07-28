import TemplateLoader from './template-loader';

class Koa2TemplateLoader extends TemplateLoader{

    constructor(setting){
        super(setting);
    }

    parseBinContent(){}

    parseAppContent(){}

    addRouteFiles(){}

    addViews(){}

    parsePkgContent(){}
}

export default Koa2TemplateLoader;