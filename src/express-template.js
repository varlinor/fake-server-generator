import TemplateLoader from './template-loader';
import {ViewTemplate} from './constant';


class ExpressTemplateLoader extends TemplateLoader {

    constructor(setting) {
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
            keywords:['fake-server-generator','fake-server','express'],
        });

        // process framework
        this.addDepenency(pkg,'cors','^2.8.5');
        this.addDepenency(pkg,'cookie-parser','~1.4.4');
        this.addDepenency(pkg,'debug','~2.6.9');
        this.addDepenency(pkg,'express','~4.16.0');
        this.addDepenency(pkg,'http-errors','~1.6.2');
        this.addDepenency(pkg,'morgan','~1.9.0');

        // process view
        if(!noView){
            if(ViewTemplate.PUG===view){
                this.addDepenency(pkg,'pug','^3.0.0');
            }else {
                this.addDepenency(pkg,'hbs','^4.1.1');
            }
        }
        return JSON.stringify(pkg, null, 2);
    }
}

export default ExpressTemplateLoader;