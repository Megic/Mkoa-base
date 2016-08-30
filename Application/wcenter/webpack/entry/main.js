require('common.css');//加载公共css
require('../css/main.css');
var $C=require('$C');
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');

// //菜单开关
// $('#toggle-menu').click(function(){$('body').toggleClass('gc-close')});



var vm=avalon.define({
    $id:'main',
    lgout:$F.lgout,
    mainurl:'page/index',
    topMenu:[{
        "icon": "&#xe613;",
        "name": "管理",
        "url": "page/index",
        "id": 1
    }]
});


$F.hideLoading();




