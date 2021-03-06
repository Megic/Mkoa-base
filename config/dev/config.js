
module.exports=function(root){
    return {
        V :'1.0',//版本
        // $common:{//模块相关常用修改配置建议以$开头，避免冲突
        //   key:'sdf'
        // },
        prefix:'mkoa_',//数据表前缀
        ormStore:{//orm数据库配置,default为默认链接配置
            'default':{//默认
                username:'postgres'
                ,password:'root'
                ,database:'dps'
                ,option:{
                    dialect:'postgres' //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
                    ,host:'localhost'
                    ,port:5432
                }
            }
        },
        //cookie session配置
        sessionStore:{
            type:2 //1 mysql 2pgsql  3 memcached  4 redis
            ,pgsql:{
                username:'postgres'
                ,password:'root'
                ,database:'dps'
                ,host:'localhost'
                ,port:5432
            }
        },
        sessionConfig:{
            key: 'Mkoa:sid',
            prefix: 'Mkoa:sess:',
            rolling: false,
            cookie: {
                // domain:'.gzyuanri.com',
                maxage:30 * 24 * 60 * 60 * 1000
            }
        },
        // cors:{
        //     origin:'http://t1.gzyuanri.com'//允许发来请求的域名，对应响应的`Access-Control-Allow-Origin`，
        //     // ,allowMethods:'',//允许的方法，默认'GET,HEAD,PUT,POST,DELETE'，对应`Access-Control-Allow-Methods`，
        //     // exposeHeaders:'',//允许客户端从响应头里读取的字段，对应`Access-Control-Expose-Headers`，
        //     // allowHeaders:'',//这个字段只会在预请求的时候才会返回给客户端，标示了哪些请求头是可以带过来的，对应`Access-Control-Allow-Headers`，
        //     // maxAge:'',//也是在预请求的时候才会返回，标明了这个预请求的响应所返回信息的最长有效期，对应`Access-Control-Max-Age`
        //     ,credentials:true//标示该响应是合法的，对应`Access-Control-Allow-Credentials`
        // },
        syncModel:true,
        formLimit: 7*1024*1024,//post最大长度
        maxFieldsSize: 7*1024*1024,//最大上传文件
        proxy:false,//如果用nginx代理，设置为true
        fileType:['gif','jpg','png','jpeg','zip'],//允许上传文件的类型
        host:'',//访问域名，模板使用
        openSocket:false,//是否开启socket.io
        openRewrite:true,
        port:80,    //端口设置
        logger:true,   //输出调试内容
        loggerType:1,//1：console 2file
        controllerCache:1,//是否关闭控制器缓存，方便开发,正式环境设为0
        //执行默认模块
        defaultPath:"index.html"//默认访问路径
    }

};