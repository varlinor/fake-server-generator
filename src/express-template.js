import TemplateLoader from './template-loader';
import {parseBinFile} from './bin-loader';
import {parseAppFile} from './app-loader';

class ExpressTemplateLoader extends TemplateLoader {

    constructor(setting) {
        super(setting);
    }

    parseBinContent() {
        let {appName, framework, port} = this.setting;
        return parseBinFile(appName, framework, port);
    }

    parseAppContent() {
        let {appName,framework,view,noView}=this.setting;
        return parseAppFile(appName,framework,view,noView);
    }

    addRouteFiles() {
    }

    addViews() {
    }

    parsePkgContent() {
    }
}

export default ExpressTemplateLoader;