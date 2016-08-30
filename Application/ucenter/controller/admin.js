/**
 * Created by megic on 2015/11/28 0028.
 */
module.exports = function ($this) {
    var main = {};
    main['_init'] = function *() {//先执行的公共函数
        if (!this.isAuthenticated())$this.error(401);//没登录
    };
    main['_after'] = function *() {//后行的公共函数
        //console.log('公共头部');
    };
    main['setInfo'] = function *() {//修改用户信息
        if($this.POST['phone']||$this.POST['email']||$this.POST['username']) {
            var res, resData;
            var orlist=[];
            if($this.POST['phone'])orlist.push({phone: $this.POST['phone']});
            if($this.POST['email'])orlist.push({email: $this.POST['email']});
            if($this.POST['username'])orlist.push({username: $this.POST['username']});
            var user = yield $D('member').findOne({
                where: {$or:orlist,id:{$ne:$this['req'].user.id}}
            });
            if(user){
                $this.error('登录帐号/手机号码/Email已被他人使用');
            }else{
                yield $D('member').update($this.POST, {where:{id:$this['req'].user.id}});
                $this.success();
            }
        }else{
            $this.error($this.langs['erroField']);
        }

    };
    //****************************
    //修改密码
    main['changePws'] = function *() {
        var rules = {
            oldpassword:{rule:'required|between:6,32',error:'密码不能少于6个字符'},
            password: {rule:'required|between:6,32',error:'密码不能少于6个字符'}
        };
        var check = $F.V.validate($this.POST, rules);//验证数据
        if (check.status) {/*通过验证*/
            var where={
                password:$F.encode.md5($this.POST['oldpassword'])
            };
            var res = yield $D('member').findOne({where: where});
            if(res){
                res.password=$F.encode.md5($this.POST['password']);
                res.save();
                $this.success();
            }else{
                $this.error('原密码错误！');
            }

        } else {
            $this.error(rules[check.rejects[0].field].error);//数据验证有误
        }
    };
    return main;
};