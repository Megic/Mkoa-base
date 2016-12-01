/**
 * Created by megic on 2015/11/28 0028.
 */
module.exports = function ($this) {
    var main = {};
    main['_init'] = function *() {//先执行的公共函数
        // console.log();
        // console.log(yield $this.sessionStore.get($this.cookies.get($C.sessionConfig['key'])))
        // console.log($this.cookies.get($C.sessionConfig['key']).length);
    };
    main['_after'] = function *() {//后行的公共函数
        //console.log('公共头部');
    };
    //**************************** 简易png验证码
    var captchapng = require('captchapng');
    main['captcha']=function *(){//图片验证码
        var num=parseInt(Math.random()*9000+1000);
        var p = new captchapng(80,30,num); // width,height,numeric captcha
        p.color(86, 172, 232);  // First color: background (red, green, blue, alpha) //别急演示
        p.color(255, 255, 255, 255); // Second color: paint (red, green, blue, alpha)
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        $this.session.ucenter_captcha = num;//记录session
        $this.type = 'image/png';
        $this.body = imgbase64;
    };//****************************
    //****************************
    main['checkLogin']=function *(){//判断用户是否已登录
        if ($this.isAuthenticated()){
            $this.success(this.req.user); //已经登录
        }else{
            $this.error(401);
        }
    };//****************************
    main['register'] = function *() {
        var needCheck=1;//是否需要审核
        if ($this.isAuthenticated()) {
            $this.error('您已登陆，退出登陆后再操作！'); //已经登录
            return;
        }
       //验证码检测
        if(parseInt($this.POST['captcha'])!=$this.session.ucenter_captcha){
            $this.error($this.langs['captchaError']);return;
        }else{
            $this.session.ucenter_captcha=null;
        }

        $this.POST['status']=needCheck?0:1;
        $this.POST['groupId']=1;//默认用户组
        /*验证规则*/
        var rules = {
            name: {rule:'max:40',error:'用户名长度有误'},
            phone: {rule:'phone',error:'手机号码错误'},
            email: {rule:'email',error:'邮箱格式错误'},
            username: {rule:'between:3,30',error:'用户名长度不在3-30个字符内'},
            password: {rule:'required|between:6,32',error:'密码不能少于6个字符'},
            headimgurl: {rule:'max:250',error:'头像地址有误'},
            groupId: {rule:'required',error:'验证失败!'}};

        var check = $F.V.validate($this.POST, rules);//验证数据
        if($this.POST['phone']||$this.POST['email']||$this.POST['username']) {
            if (check.status) {/*通过验证*/
                var res, resData;
                var orlist=[];
                //检查手机、邮箱、账户名是否重复
                if($this.POST['phone'])orlist.push({phone: $this.POST['phone']});
                if($this.POST['email'])orlist.push({email: $this.POST['email']});
                if($this.POST['username'])orlist.push({username: $this.POST['username']});
                var user = yield $D('member').findOne({
                    where: {$or:orlist}
                });
                if (!user) {//不存在重复信息，注册新用户
                    $this.POST['password'] = $F.encode.md5($this.POST['password']);//加密密码
                    $this.POST['sessionId']=$this.cookies.get($C.sessionConfig['key']);//记录sessionId
                    res = yield $D('member').build($this.POST).save({fields:['name','phone','email','username','headimgurl','password','sessionId','groupId','status']});
                    // yield $D('memberExtend').build({//填写用户扩展信息
                    //     memberId:res.id,extend:{}}
                    // ).save();
                    // resData = res;
                    if(!needCheck)yield $this.logIn(res);//登录注册用户
                    $this.success({user:res,needCheck:needCheck});
                } else {
                    $this.error($this.langs['doubleUser']);//用户重复
                }

            } else {
                $this.error(rules[check.rejects[0].field].error);//数据验证有误
            }
        }else{
            $this.error($this.langs['erroField']);
        }
    };
    //****************************
    main['login']=function *(){//用户登录
        //验证码检测
        if(parseInt($this.POST['captcha'])!=$this.session.ucenter_captcha){
            $this.error($this.langs['captchaError']);return;
        }else{$this.session.ucenter_captcha=null;}

        if ($this.isAuthenticated()){
            $this.error($this.langs['hasLogin']);//已经登录
        }else{
            if($this.POST['username']&&$this.POST['password']) {
                yield $M.passport.authenticate('local', function*(err, user) {
                    if (err) throw err;
                    if (user === false) {
                        $this.error($this.langs['errorInfo']);//帐号密码错误
                    } else {
                        if(user.status==1){//状态正常
                            yield $this.logIn(user);
                            yield $D('member').update({sessionId:$this.cookies.get($C.sessionConfig['key'])}, {where:{id:user.id}});//记录当前用户sessionId
                            $this.success(user);
                        }else{
                            $this.error($this.langs['backStatus']);
                        }

                    }
                });
            }else{
                $this.error($this.langs['filedEmpty']);//不能为空
            }
        }

    };//***************************************************
    main['lgout']=function *(){//退出登录
        $this.logout();
        $this.error(401);//退出成功，返回401
    };//***************************************************

    return main;
};