export const Framework={
        EXPRESS:'express',
        KOA2:'koa2',
        EGG2:'egg2'
    },
    ViewTemplate={
        HBS:'hbs',
        PUG:'pug'
    },
    TemplateDirType={
        Routes:'routes',
        Views:'views',
    },
    TemplatePath={
        BinPath:'/bin',
        AppPath:'./',
        PublicPath:'/public',
        RoutePath:'/routes',
        ViewPath:'/views',
        GitIgnore:'./',
        PkgPath:'./',
        ESLint:'./'
    },
    Operation={
        Write:'w',
        Copy:'c',
        MakeDir:'m',
        None:'n',
    },
    DEF_FILE_OBJ={
        operation:Operation.None,
        path:undefined,
        content:undefined
    };

export function createFileObject(operation,opts){
    let set={};
    if(Operation.Write===operation){
        set={operation,content:opts.content};
    }else if(Operation.Copy===operation){
        set={operation,path:opts.path};
    }else{
        set={operation};
    }
    return Object.assign({},DEF_FILE_OBJ,set);
}

