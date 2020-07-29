import TemplateLoader from './template-loader';
import {ViewTemplate} from './constant';

class Koa2TemplateLoader extends TemplateLoader{

    constructor(setting){
        super(setting);
    }

    // parseBinContent() { }

    // parseAppContent() { }

    // addRouteFiles() { }

    // addViews() { }

    parsePkgContent() {
        let {appName,view,noView}=this.setting;
        const pkg=Object.assign({},this.getDefaultPkg(),{
            name:appName,
            description:'fake api service, develop init faster!',
            keywords:['fake-server-generator','fake-server','koa2'],
        });

        // process framework
        this.addDepenency(pkg,'debug','~2.6.9');
        this.addDepenency(pkg,'koa','^2.13.0');
        this.addDepenency(pkg,'koa-bodyparser','^4.2.1');
        this.addDepenency(pkg,'koa-convert','^1.2.0');
        this.addDepenency(pkg,'koa2-cors','^2.0.6');
        this.addDepenency(pkg,'koa-json','^2.0.2');
        this.addDepenency(pkg,'koa-logger','^3.2.0');
        this.addDepenency(pkg,'koa-onerror','^4.1.0');
        this.addDepenency(pkg,'koa-router','^7.4.0');
        this.addDepenency(pkg,'koa-static','^5.0.0');

        // process view
        if(!noView){
            if(ViewTemplate.PUG===view){
                this.addDepenency(pkg,'koa-views','^6.2.0');
                this.addDepenency(pkg,'pug','^3.0.0');
            }else {
                this.addDepenency(pkg,'koa-hbs','^1.0.0');
            }
        }
        return JSON.stringify(pkg, null, 2);
    }
}

export default Koa2TemplateLoader;