require('common.css');//加载公共css
require('../css/main.css');
var $C=require('$C');
window.$C.loginPath=$C.adminLoginPath;//未登录地址设置为管理登录地址
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');
// var $router=require('$R');
require('$router');//加载路由器
//菜单开关
$('#toggle-menu').click(function(){$('body').toggleClass('gc-close')});
//菜单数据
var data={
    "mainurl": "page/index",//默认页面
        "leftMenu": {//左边菜单
        "2": [
            {
                "icon": "&#xe615;",
                "name": "信息设置",
                "url": "",
                "children": [
                    {
                        "name": "修改个人信息",
                        "url": "user/setInfo"
                    },
                    {
                        "name": "修改登录密码",
                        "url": "user/changePassword"
                    }
                ]
            }
        ],
        "1": [
            {
                "icon": "&#xe618;",
                "name": "搜索",
                "url": "",
                "children": [
                    {
                        "name": "1",
                        "url": "1"
                    },{
                        "name": "2",
                        "url": "2"
                    }
                ]
            },
            {
                "icon": "&#xe607;",
                "name": "用户管理",
                "url": "",
                "children": [
                    {
                        "name": "用户列表",
                        "url": "user/list"
                    }
                ]
            }
        ]
    },
    "topMenu": [//顶部菜单
        {
            "icon": "&#xe613;",
            "name": "系统管理",
            "url": "page/index",
            "id": 1
        },
        {
            "icon": "&#xe607;",
            "name": "个人设置",
            "url": "user/setInfo",
            "id": 2
        }
    ]
};


var vm=avalon.define({
    $id:'main',
    lgout:$F.lgout,
    mainurl:'',
    curMenu:0,//当前组
    chooseMenu:function(id){
        vm.curMenu=id;
        $F.setCookie('adminsys-menu',id,1000 * 60 * 60);//1小时过期
        vm.leftMenu.removeAll();
        vm.leftMenu.pushArray(data.leftMenu[id]);
    },
    topMenu:[],
    leftMenu:[],
    getIframe:function(){
      return `<iframe src="${vm.mainurl}" frameborder="0" width="100%" height="100%"  ></iframe>`;
    }
});

vm.topMenu=data.topMenu;//设置顶部菜单
var menuId=$F.getCookie('adminsys-menu');
vm.chooseMenu(menuId?menuId:1);//默认菜单

vm.mainurl = window.location.href.split('#!/?')[1]?window.location.href.split('#!/?')[1]:data.mainurl;
//添加路由规则
avalon.router.add("/", function (a) {
   vm.mainurl = window.location.href.split('#!/?')[1];
});

//启动路由监听
avalon.history.start({
    root: "/adminsys/main"
});

//启动扫描机制,让avalon接管页面
avalon.scan(document.body);
$F.hideLoading();




