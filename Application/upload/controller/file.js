/**
 * Created by Megic on 2016/3/21 0021.
 */
module.exports = function ($this) {
    var fs = require('fs');
    var wu = require("../lib/webuploader");
    var path = require("path");
    var fscp = require('co-fs-plus');//文件夹等操作
    var cs = require('co-stream');
    var main = {};
    //用于分片合并时的同步标识位
    var lockMark = [];
    function isImage(name){//判定是否是图片后缀
        var ext = null;
        name = name.toLowerCase();
        var i = name.lastIndexOf(".");
        if(i > -1){
             ext = name.substring(i);
        }
        var imgExt = new Array(".png",".jpg",".jpeg",".bmp",".gif");//图片文件的后缀名
        return $F._.contains(imgExt,ext);
    }

    main['_init'] = function *() {//先执行的公共函数
        if (!$this.isAuthenticated()){
            $this.error(401);//没登录
        }
    };
    main['_after'] = function *() {//后行的公共函数
        //console.log('公共头部');
    };
    //返回分页数据
    main['findAll'] = function *() {
        var perPages=$this.GET['perPages']?parseInt($this.GET['perPages']):10;//每页数据数
        var currentPage=$this.GET['currentPage']?parseInt($this.GET['currentPage']):1;//查询页码
        var where = {
            memberId:$this['req'].user.id
        };
        if($this.GET['type'])where.type=$this.GET['type'];
        var res = yield $D('files').findAndCountAll({
            where: where,
            limit: perPages,
            offset: perPages * (currentPage - 1)
        }, {raw: true});
        if (res)$this.success(res);
    };
    //****************************大图分片上传图片************/
    main['add'] = function *() {
        var fields=$this.POST['fields'];
        var status=$this.POST['status'];
        if(!status){//上传
            if($this.FILES.file){
                var filePath = $C.staticpath + $this.FILES.file.path;
                var isChunks = !(!fields['chunks'] || parseInt(fields['chunks']) <= 0);
                fields.userId = $this['req'].user.id;
                if (!fields.name)fields.name = $this.FILES.file.name;//名称丢失
                var unionName = wu.createUniqueFileName(fields);//唯一名称

                if (isChunks) {//分片
                    var upDir = $C.upload + '/' + unionName;//新命名
                    console.log('创建'+upDir);
                    if (fs.existsSync(upDir) || (yield fscp.mkdirp(upDir, '0755'))) {//创建分片文件夹
                        //更新tmp文件的修改时间
                        fs.open(upDir + ".tmp", "w", function (err, fd) {
                            if (err) {
                                console.error(err);
                            } else {
                                var time = new Date();
                                fs.futimes(fd, time, time, function (err) {
                                    if (err) {
                                        console.error(err);
                                    }
                                    fs.close(fd);
                                });
                            }
                        });
                        filePath = upDir + '/' + fields['chunk'];//分片名字
                        var res = yield $D('fileInfo').findOne({
                            where: {
                                memberId: $this['req'].user.id,
                                sign: unionName
                            }
                        });
                        if (res) {
                            res.chunk += 1;//分片+1
                            res.save();
                        } else {
                            yield $D('fileInfo').build({
                                chunks: fields.chunks,
                                chunk: 1,//第一片
                                size: fields.size,
                                sign: unionName,
                                isall: 0,
                                name: fields.name,
                                md5: fields.md5,
                                memberId: $this['req'].user.id
                            }).save();//保存图片数据
                        }
                        //查找分片信息
                    } else {
                        $this.body = {"status": 0};
                    }
                } else {//非分片，一次性上传
                    yield $D('files').build({//保存图片
                        memberId: $this['req'].user.id,
                        path: $this.FILES.file.path,
                        name: $this.FILES.file.name,
                        groupid: 0,
                        type: isImage($this.FILES.file.name)?1:2,
                        hostid: 0,
                        status: 1
                    }).save();//保存图片数据
                    yield $D('fileInfo').build({
                        chunks: 1,
                        chunk: 1,//第一片
                        size: fields.size,
                        path: $this.FILES.file.path,
                        sign: unionName,
                        isall: 1,
                        name: fields.name,
                        md5: fields.md5,
                        memberId: $this['req'].user.id
                    }).save();//保存上传记录,防止二次上传
                }
                fs.renameSync($this.FILES.file.oldPath, filePath);
                $this.body = {"status": 1, "path": $this.FILES.file.path};
            }else{
                $this.body = {"status": 0}; //不存在文件信息，或者文件大小/类型错误
            }

        }else if(status== "md5Check"){  //秒传校验
            var finish=yield $D('fileInfo').findOne({where:{//查找分片状态
                memberId: $this['req'].user.id,
                sign:$this.POST.sign
            },raw: true});
            if(finish){
                $this.body={"ifExist":1, "path":finish.path};
            }else{
                $this.body={"ifExist":0};
            }
        }else if(status== "chunkCheck") {  //分片校验
            var pic=path.join($C.upload, $this.POST['name'], $this.POST['chunkIndex']);
            var check=false;
            if(fs.existsSync(pic)){
                var stats=fs.statSync(pic);
                if(stats.size == $this.POST.size){
                    check=true;
                }
            }
            if(check){
                $this.body={"ifExist":1};
            }else{
                $this.body={"ifExist":0};
            }

        }else if(status== "chunksMerge") {   //分片合并
            var name=$this.POST['name'];
            //同步机制
            if($F._.contains(lockMark,name)){
                $this.body={"status":0};
            }else{
                lockMark.push(name);
                var newFileName = $this.filePath+wu.randomFileName($this.POST.ext);
                var targetStream = fs.createWriteStream(newFileName);
                var cout = new (cs.Writer)(targetStream);
                var dir=path.join($C.upload,name);
                for(var i=0;i<$this.POST.chunks;i++){
                    var chunkFile=path.join(dir,i.toString());
                    var input = fs.createReadStream(chunkFile);
                    var cin = new (cs.Reader)(input);
                    var txt='';
                    while (txt = yield cin.read()) {
                        yield cout.write(txt); // or: yield cout.writeline(txt)
                    }
                    //yield* cs.wait(input);
                    fs.unlinkSync(chunkFile);//删除文件
                }
                //yield* cs.wait(targetStream);
                fs.unlinkSync(path.join($C.upload, name) + ".tmp");//删除tmp文件
                fs.rmdirSync(path.join($C.upload, name));//删除切片文件夹
                // todo 这里其实需要把该文件和其前端校验的md5保存在数据库中，供秒传功能检索
                lockMark = $F._.without(lockMark,name);

                var newPath=newFileName.replace($C.staticpath,'');
                var resInfo = yield $D('fileInfo').findOne({where:{//查找分片状态
                    memberId: $this['req'].user.id,
                    sign:name
                }});
                resInfo.isall=1;resInfo.path=$C.host+newPath;resInfo.save();
                yield $D('files').build({//保存文件
                    memberId: $this['req'].user.id,
                    path:newPath,
                    name:resInfo.name,
                    groupid:0,
                    type:isImage(resInfo.name)?1:2,
                    hostid:0,
                    status:1
                }).save();//保存图片数据

                $this.body={"status":1, "path":newPath};

            }


        }

    };//****************************

    return main;
};