require('common.css');//加载公共css
require('../../css/commom.css');
require('../../css/user/setInfo.css');
require('$pager');
var $C=require('$C');
window.$C.loginPath=$C.adminLoginPath;//未登录地址设置为管理登录地址
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');

var vm=avalon.define({
    $id:'main',
    pager: {
        totalItems:0,//总条数
        perPages:10,//每页显示条数
        showPages:5,//页码显示数量
        listData:[],
        getData:function(option){
            $F.GETLoaing($C.apiPath+'admin/member/findAll',option,function(data){//获取列表数据
                if(option.currentPage==1)vm.pager.totalItems=data.count;
                vm.pager.listData=data.rows;
            });
        }
    }
});
// setTimeout(function(){
//     "use strict";
//     vm.config.totalItems=1000;
// },1000)

$F.hideLoading();


