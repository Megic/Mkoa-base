require('./style.css');
var $C=require('$C');
var $=require('$');
var $F=require('$F');
var $msg=require('$msg');
require('$pager');
var layer=require('layer');
var avalon=require('avalon');
var main={};
var init=require('./upload');//初始化上传控件
var index;

//打开选择用户窗口
main.open=function(options,callback){
    options.type=options.type?options.type:0;
    var indexId=new Date().getTime();
    var imgListMvName='upload-image-list-'+indexId;
    var imgListPager='upload-image-pager-'+indexId;
    //文件列表
    var fileListMvName='upload-file-list-'+indexId;
    var fileListPager='upload-file-pager-'+indexId;
    function chooseFile(url){
        callback(url);//返回选中文件地址
        layer.close(index);
        //清空相关VM
        avalon.vmodels[imgListMvName]=null;
        delete avalon.vmodels[imgListMvName];
        avalon.vmodels[imgListPager]=null;
        delete avalon.vmodels[imgListPager];
        avalon.vmodels[fileListMvName]=null;
        delete avalon.vmodels[fileListMvName];
        avalon.vmodels[fileListPager]=null;
        delete avalon.vmodels[fileListPager];
    }
    var tab=[];
    tab.push({
        title: '上传文件',
        content:`
            <div id="uploader">
            <div class="queueList">
                <div id="dndArea" class="placeholder">
                    <div id="filePicker"></div>
                    <p>或将文件拖到这里，单次最多可选100个</p>
                </div>
            </div>
            <div class="statusBar" style="display:none;">
                <div class="progress">
                    <span class="text">0%</span>
                    <span class="percentage"></span>
                </div><div class="info"></div>
                <div class="btns">
                    <div id="filePicker2"></div><div class="uploadBtn">开始上传</div>
                </div>
            </div>
        </div>`
    });
    if(options.type!=2)tab.push({
        title: '已上传图片',
        content: `
            <div id="${imgListMvName}" ms-controller="${imgListMvName}" class="f-m5">
           <table  class="mkoa-table">
            <thead>
            <tr><th width="30">ID</th><th>图片</th><th width="130">上传时间</th><th width="60">操作</th></tr>
            </thead>
            <tbody>
            <tr ms-for="el in @pager.listData">
                <td>{{el.id}}</td><td align="center"><img width="100" ms-attr="{src:$C.imagePath+el.path,title:el.name}" alt=""></td><td>{{el.updatedAt|date("yyyy-MM-dd HH:ss")}}</td><td><button class="f-btn" ms-click="@choose(el.path)">选择</button></td>
            </tr>
            </tbody>
        </table>
        <wbr ms-widget="[{is:'mk-pager',id:'${imgListPager}' },@pager]" />
        </div>
           `
    });
    if(options.type!=1)tab.push({
        title: '已上传文件',
        content:  `
            <div id="${fileListMvName}" ms-controller="${fileListMvName}" class="f-m5">
           <table  class="mkoa-table">
            <thead>
            <tr><th width="30">ID</th><th>文件名</th><th width="130">上传时间</th><th width="60">操作</th></tr>
            </thead>
            <tbody>
            <tr ms-for="el in @pager.listData">
                <td>{{el.id}}</td><td align="center">{{el.name}}</td><td>{{el.updatedAt|date("yyyy-MM-dd HH:ss")}}</td><td><button class="f-btn" ms-click="@choose(el.path)">选择</button></td>
            </tr>
            </tbody>
        </table>
        <wbr ms-widget="[{is:'mk-pager',id:'${fileListPager}' },@pager]" />
        </div>
           `
    });

    index=layer.tab({
        area: ['600px', '450px'],
        tab:tab,
        success: function(){
              //上传的图片列表模型定义
              var vmImage = avalon.define({
                  $id: imgListMvName,
                  choose:function(url){
                      chooseFile(url);
                  },
                  pager: {
                      totalItems: 0,//总条数
                      perPages: 10,//每页显示条数
                      showPages: 5,//页码显示数量
                      listData: [],
                      getData: function (option) {
                          $F.GET($C.apiPath + 'upload/file/findAll?type=1',option, function (data) {//获取列表数据
                              if (option.currentPage == 1)vmImage.pager.totalItems = data.count;
                              vmImage.pager.listData = data.rows;
                          });
                      }
                  }
              });
            //上传的文件列表模型定义
            var vmFile = avalon.define({
                $id: fileListMvName,
                choose:function(url){
                    chooseFile(url);
                },
                pager: {
                    totalItems: 0,//总条数
                    perPages: 10,//每页显示条数
                    showPages: 5,//页码显示数量
                    listData: [],
                    getData: function (option) {
                        $F.GET($C.apiPath + 'upload/file/findAll',option, function (data) {//获取列表数据
                            if (option.currentPage == 1)vmFile.pager.totalItems = data.count;
                            vmFile.pager.listData = data.rows;
                        });
                    }
                }
            });

            avalon.scan(document.body);
            init($C.apiPath,options.userInfo,function(url){//选中上传图片
                chooseFile(url);
            });
        }
    });

};

module.exports=main;
