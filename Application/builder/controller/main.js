/**
 * Created by megic on 2015-06-11.
 */

module.exports = function($this){
    var fs = require('fs');
    var fscp = require('co-fs-plus');//文件夹等操作
    var main={};

    main['_init']=function *(){//先执行的公共函数不会被缓存部分
        // console.log()
        // console.log($SYS.sequelize.modelManager)
    };
    main['_after']=function *(){//后行的公共函数
        //console.log('公共头部');

    };
    main['getMenu']=function *(){//查找模块目录
        //读取菜单数据
        var libArr={};
        var apppath=$C.ROOT+ '/' +$C.application;
        function walk(apppath,appname){
            var dirList = fs.readdirSync(apppath);
            dirList.forEach(function(item){
                if(fs.statSync(apppath + '/' + item).isDirectory()){
                    walk(apppath + '/' + item);
                    libArr[appname].push({"name":item,"url":"#!/?"+appname+"/admin/"+item+"/list"});
                }});
        }
        var moudelList = fs.readdirSync(apppath);
        moudelList.forEach(function(item){
            if(fs.statSync(apppath + '/' + item).isDirectory()){
                var mdPath=apppath + '/' + item+ '/views/admin/' ;//存在管理文件夹
                if(fs.existsSync(mdPath)){
                    libArr[item]=[];
                    walk(mdPath,item);
                }
            }});

        $this.success(libArr);
    };
    //main['getMenu']=function *(){//输出菜单数据
    //    //读取菜单数据
    //    var menuData={};
    //    var menupath=$this.modulePath+'data/menu.json';
    //    if (fs.existsSync($this.modulePath+'data') || (yield fscp.mkdirp($this.modulePath+'data', '0755'))) {//判定文件夹是否存在
    //        if (fs.existsSync(menupath)) {
    //            var menuJson = fs.readFileSync($this.modulePath + 'data/menu.json', 'utf-8');
    //            menuData = JSON.parse(menuJson);
    //        }
    //    }
    //    $this.success(menuData);
    //};
    main['eModel']=function *(){
        var data=require($this.modulePath+'data/module/'+$this.GET['file']);
        data['filepath']=data['filepath']?data['filepath']:'';
        yield $this.display(data);
    };
    main['list']=function *(){//模型列表
        var dirList=[];
        if(fs.existsSync($this.modulePath+'data/module')){
            dirList = fs.readdirSync($this.modulePath+'data/module');
        }
        yield $this.display({dirList:JSON.stringify(dirList)});
    };
    //生成模型文件
    main['buildModel']=function *(){
        $this['POST']['fields']=JSON.parse($this['POST']['fields']);
        var rules = {
            modelName:{rule:'required|string',error:'模型名称有误'}
        };

        var r=$F.V.validate($this['POST'], rules);

        if(r.status==1&&$this['POST']['fields'].length>0){
            var fieldsARR='{';
            var len= $this['POST']['fields'].length;
            //生成字段
            for(var i=0; i<len; i++){
                if(i)fieldsARR+=',';
                var defaultSTR=`
                        defaultValue:'${$this['POST']['fields'][i].defaultValue}',`;
                if($this['POST']['fields'][i].defaultValue=='')defaultSTR='';
                fieldsARR+=`
                ${$this['POST']['fields'][i].name}: {
                        type: DataTypes.${$this['POST']['fields'][i].type},
                        allowNull:${$this['POST']['fields'][i].allowNull},${defaultSTR}
                        unique:${$this['POST']['fields'][i].unique},
                        comment: '${$this['POST']['fields'][i].comment}'
                      }`;
            }
            fieldsARR+='}';
            var res=fs.readFileSync($this.modulePath+'lib/model.tpl','utf-8');
            var fixArr=['','mysql','pgsql'];

            // res=res.replace('{{%prefix%}}',$C[fixArr[$C.sqlType]].prefix);
            res=res.replace(/{{%name%}}/g,$this['POST'].modelName);
            res=res.replace('{{%comment%}}',$this['POST'].comment);
            res=res.replace('{{%timestamps%}}',$this['POST'].timestamps);
            res=res.replace('{{%indexes%}}',$this['POST'].indexes?$this['POST'].indexes:'[]');
            res=res.replace('{{%paranoid%}}',$this['POST'].paranoid);
            res=res.replace('{{%fields%}}',fieldsARR);
            var modelPath=$C.ROOT + '/' + $C.application + '/' + $this['POST'].root + '/models/';
            if (fs.existsSync(modelPath) || (yield fscp.mkdirp(modelPath, '0755'))) {//判定文件夹是否存在
                var fileName=modelPath+$this['POST'].modelName+'.js';
                fs.writeFileSync(fileName,res);
                $SYS.modelPath[$this['POST'].modelName]=fileName;
                //删除模型缓存
            }
            if (fs.existsSync($this.modulePath+'data/module') || (yield fscp.mkdirp($this.modulePath+'data/module', '0755'))) {//判定文件夹是否存在
                fs.writeFileSync($this.modulePath+'data/module/'+$this['POST'].modelName+'.js','module.exports='+JSON.stringify($this['POST'])+';');
            }

                //实时生成数据表
                delete require.cache[require.resolve($SYS.modelPath[$this['POST'].modelName])];//删除缓存
                var modelbody=require( $SYS.modelPath[$this['POST'].modelName])($SYS.sequelize,require('sequelize'));
                modelbody.sync({force: true});//写入数据表



            //编辑安装锁
            var filePath=$C.ROOT+'/install.json';
            var modelData=[];
            if(fs.existsSync(filePath)){
                var res=fs.readFileSync(filePath,'utf-8');
                if(res)modelData=JSON.parse(res);
            }else{
                fs.writeFileSync(filePath,JSON.stringify(modelData));
            }
            if(modelData.indexOf($this['POST'].modelName+'.js')==-1) modelData.push($this['POST'].modelName+'.js');
            fs.writeFileSync(filePath,JSON.stringify(modelData));

            $this.success('生成模型成功!');

        }else{
            $this.error('数据有误');
        }

    };
    //生成控制器
    main['buildController']=function *(){
        $this['POST']['fields']=JSON.parse($this['POST']['fields']);
        var rules = {
            modelName:{rule:'required|string',error:'模型名称有误'}
        };
        var pathPrefix=$this['POST']['filepath']?$this['POST']['filepath']+'/':'';
        var r=$F.V.validate($this['POST'], rules);
        if(r.status==1&&$this['POST']['fields'].length>0){
            var fieldsARR='{';
            var len= $this['POST']['fields'].length;
            //生成字段
            for(var i=0; i<len; i++){
                if(i)fieldsARR+=',';
                fieldsARR+=`
                ${$this['POST']['fields'][i].name}: {rule:'${$this['POST']['fields'][i].validate.rule}',error:'${$this['POST']['fields'][i].validate.error}'}`;
            }
            fieldsARR+='}';
            var res=fs.readFileSync($this.modulePath+'lib/controller.tpl','utf-8');
            res=res.replace(/{{%name%}}/g,$this['POST'].modelName);
            res=res.replace('{{%rules%}}',fieldsARR);
            // var modelPath=$C.ROOT + '/' + $C.application + '/' + $this['POST'].root + '/controller/'+pathPrefix;
            var modelPath=$C.ROOT + '/' + $C.application + '/builder/controller/'+pathPrefix;
            if (fs.existsSync(modelPath) || (yield fscp.mkdirp(modelPath, '0755'))) {//判定文件夹是否存在
                fs.writeFileSync(modelPath+$this['POST'].modelName+'.js',res);
            }
            $this.success('成功生成控制器!');

        }else{
            $this.error('数据有误');
        }

    };
    //生成常用视图
    main['buildViews']=function *(){
        var pathPrefix=$this['POST']['filepath']?$this['POST']['filepath']+'/':'';
        $this['POST']['fields']=JSON.parse($this['POST']['fields']);
        var rules = {
            modelName:{rule:'required|string',error:'模型名称有误'}
        };
        var r=$F.V.validate($this['POST'], rules);
        if(r.status==1&&$this['POST']['fields'].length>0){
            //读取菜单数据
            var menuData={};
            var menupath=$this.modulePath+'data/menu.json';
            if (fs.existsSync($this.modulePath+'data') || (yield fscp.mkdirp($this.modulePath+'data', '0755'))) {//判定文件夹是否存在
                if (fs.existsSync(menupath)) {
                    var menuJson = fs.readFileSync($this.modulePath + 'data/menu.json', 'utf-8');
                    menuData = JSON.parse(menuJson);
                }
            }
            if(!menuData[$this['POST'].root]){
                menuData[$this['POST'].root]=[];
            }
            if($F._.where(menuData[$this['POST'].root], {"name":$this['POST'].modelName}).length<1){
                menuData[$this['POST'].root].push(
                    {name:$this['POST'].modelName,url:"#!/?"+$this['POST'].root+"/"+pathPrefix+$this['POST'].modelName+"/list"}
                );
            }

            //保存菜单数据
            fs.writeFileSync(menupath,JSON.stringify(menuData));
            //生成index文件
            var index=fs.readFileSync($this.modulePath+'lib/admin.tpl.html','utf-8');

           // index=index.replace('{{%menuData%}}',JSON.stringify(menuData));
           // var vPath=$C.ROOT + '/' + $C.application + '/' + $this['POST'].root + '/views/';
            var vPath=$C.ROOT + '/' + $C.application + '/builder/views/';

            if (fs.existsSync(vPath) || (yield fscp.mkdirp(vPath, '0755'))) {//判定文件夹是否存在
                fs.writeFileSync($C.ROOT + '/' + $C.application + '/builder/views/admin.html',index);
            }

            vPath=vPath+pathPrefix;
            //拼接页面代码
            var len= $this['POST']['fields'].length;
            //生成字段
            var titleSTR='',searchSTR='',listSTR='',formSTR='',vmSTR={},fieldsARR='{';
            for(var i=0; i<len; i++){
                //list页面
                titleSTR+=`<th>${$this['POST']['fields'][i].comment}</th>`;
                listSTR+=`<td>{{el.${$this['POST']['fields'][i].name}}}</td>`;
                searchSTR+=`<option value="${$this['POST']['fields'][i].name}">${$this['POST']['fields'][i].comment}</option>`;
                //add页面
                formSTR+=`<tr><td class="mkoa-form-title"><span>${$this['POST']['fields'][i].comment}</span></td>
                <td><input type="text" ms-duplex="form.${$this['POST']['fields'][i].name}"/></td></tr>`;
                vmSTR[$this['POST']['fields'][i].name]="";
                //验证数据
                if(i)fieldsARR+=',';
                fieldsARR+=`
                ${$this['POST']['fields'][i].name}: {rule:'${$this['POST']['fields'][i].validate.rule}',error:'${$this['POST']['fields'][i].validate.error}'}`;

            }
            if($this['POST']['timestamps']){
                titleSTR+=`<th width="155">创建时间</th>`;
                listSTR+=`<td>{{el.createdAt|date("yyyy-MM-dd HH:mm:ss")}}</td>`;
            }
            fieldsARR+='}';

            //生成list文件
            // var controllerPath=$this['POST'].root+'/'+pathPrefix+$this['POST'].modelName+'/';
            var controllerPath='builder/'+pathPrefix+$this['POST'].modelName+'/';

            var list=fs.readFileSync($this.modulePath+'lib/list.tpl.html','utf-8');//读取模板
            list=list.replace('{{%searchSTR%}}',searchSTR);
            list=list.replace('{{%titleSTR%}}',titleSTR);
            list=list.replace('{{%listSTR%}}',listSTR);
            list=list.replace(/{{%name%}}/g,$this['POST'].modelName);
            list=list.replace(/{{%mroot%}}/g,$this['POST'].root);
            list=list.replace(/{{%controllerPath%}}/g,controllerPath);
            vPath=vPath+$this['POST'].modelName+'/';
            if (fs.existsSync(vPath) || (yield fscp.mkdirp(vPath, '0755'))) {//判定文件夹是否存在
                fs.writeFileSync(vPath+'list.html',list);
            }
            //生成addItem文件

            var addItem=fs.readFileSync($this.modulePath+'lib/addItem.tpl.html','utf-8');//读取模板
            addItem=addItem.replace('{{%rules%}}',fieldsARR);
            addItem=addItem.replace('{{%formSTR%}}',formSTR);
            addItem=addItem.replace('{{%vmSTR%}}',JSON.stringify(vmSTR));
            addItem=addItem.replace(/{{%name%}}/g,$this['POST'].modelName);
            addItem=addItem.replace(/{{%mroot%}}/g,$this['POST'].root);
            addItem=addItem.replace(/{{%controllerPath%}}/g,controllerPath);
            fs.writeFileSync(vPath+'addItem.html',addItem);


            $this.success('成功生成视图!');

        }else{
            $this.error('数据有误');
        }

    };


    return main;
};
