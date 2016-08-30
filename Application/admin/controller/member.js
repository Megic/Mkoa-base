/**
 * Created by megic on 2015/11/28 0028.
 */
module.exports = function ($this) {
    var main = {};
    main['_init'] = function *() {//先执行的公共函数
        if (!this.isAuthenticated())$this.error(401);//没登录
        if($this['req']['user'].groupId!=2)$this.error(403);//没有权限
    };
    main['_after'] = function *() {//后行的公共函数
        //console.log('公共头部');
    };
    //返回分页数据
    main['findAll'] = function *() {
        var perPages=$this.GET['perPages']?parseInt($this.GET['perPages']):10;//每页数据数
        var currentPage=$this.GET['currentPage']?parseInt($this.GET['currentPage']):1;//查询页码
        var where = {};
        var res = yield $D('member').findAndCountAll({
            where: where,
            limit: perPages,
            offset: perPages * (currentPage - 1)
        }, {raw: true});
        if (res)$this.success(res);
    };
    return main;
};