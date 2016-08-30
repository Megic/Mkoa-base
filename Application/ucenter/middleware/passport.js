module.exports = function(app){
    $M.passport = require('koa-passport');
    var LocalStrategy = require('passport-local').Strategy;//本地登录
    $M.passport.use(new LocalStrategy(function (username, password, done){
//查找用户
       $D('member').findOne({where:{
            password:$F.encode.md5(password),
            $or: [
                {phone:username},{email:username},{username:username}
            ]
        }}).then(function (user) {
            done(null,user);
        });

    }));

    $M.passport.serializeUser(function(user, done) {//登录成功后执行
        done(null, user)
    });

    $M.passport.deserializeUser(function(user, done) {//如果登录了每次访问执行
        done(null, user)
    });

    app.use($F.convert($M.passport.initialize()));
    app.use($F.convert($M.passport.session()));

};
