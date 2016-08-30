require('./msg.css');
var avalon=require('avalon');
function msg(text,icon,time){
    time=time?time:2000;
    var id='mkoaMsg_'+new Date().getTime();
    var div=avalon.parseHTML('<div id="'+id+'" class="mkoa-msg"><div class="mkoa-msg-bd">'+icon+text+'</div></div>');
    body.appendChild(div);
    setTimeout(function(){
        body.removeChild(document.getElementById(id));
    },time);
}
var body=document.body;
var $msg={};
$msg.success=function(text,time){
    msg(text,'<i class="f-icon mkoa-msg-icon mkoa-msg-success mkoa-msg-com">&#xe60f;</i>',time);
};
$msg.error=function(text,time){
    msg(text,'<i class="f-icon mkoa-msg-icon mkoa-msg-error mkoa-msg-com">&#xe60d;</i>',time);
};
$msg.loading=function(text,type){
    text=text?text:'正在处理';
    type=type?type:1;
    var icon;
    switch (type){
        case 1:
            icon='&#xe611;';
            break;
        case 2:
            icon='&#xe603;';
            break;
        case 3:
            icon='&#xe602;';
            break;
    }
    $msg.closeLoading();
    var div=avalon.parseHTML('<div id="mkoaMsg_mark"><div id="mkoaMsg_loading" class="mkoa-msg"><div class="mkoa-msg-loading"><i class="f-icon mkoa-msg-icon">'+icon+'</i><p>'+text+'</p></div></div></div>');
    body.appendChild(div);
};
$msg.closeLoading=function(){
    var div=document.getElementById('mkoaMsg_mark');
    if(div)body.removeChild(div);
};

module.exports=$msg;