require('common.css');//加载公共css
require('../css/main.css');
var $C=require('$C');
window.$C.loginPath=$C.adminLoginPath;//未登录地址设置为管理登录地址
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');
//菜单开关
$('#toggle-menu').click(function(){$('body').toggleClass('gc-close')});
$("body").delegate(".gc-menu-a", "click", function() {$('.gc-menu-a').removeClass('on');$(this).addClass("on");});//左边子菜单
var data={
    "mainurl": "page/index",
        "leftMenu": {
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
                        "name": "测试-百度",
                        "url": "http://baidu.com"
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
    "topMenu": [
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
        vm.leftMenu.removeAll();
        vm.leftMenu.pushArray(data.leftMenu[id]);
    },
    topMenu:[],
    leftMenu:[]
});
vm.leftMenu=data.leftMenu['1'];//默认菜单
//vm.leftMenu=data.leftMenu;
vm.topMenu=data.topMenu;
vm.curMenu=data.topMenu[0].id;
vm.mainurl=data.mainurl;

$F.hideLoading();




