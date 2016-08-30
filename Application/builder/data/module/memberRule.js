module.exports={"modelName":"memberRule","comment":"权限规则表","indexes":"","buildViews":"false","timestamps":"true","paranoid":"false","root":"ucenter","filepath":"admin","fields":[{"name":"title","comment":"规则描述","type":"STRING(40)","allowNull":false,"unique":false,"defaultValue":"0","validate":{"rule":"required","error":"验证失败!"}},{"name":"name","comment":"规则名称/标记","type":"STRING(60)","allowNull":false,"unique":false,"defaultValue":"0","validate":{"rule":"required","error":"验证失败!"}},{"name":"status","comment":"状态","type":"INTEGER","allowNull":false,"unique":false,"defaultValue":"0","validate":{"rule":"required","error":"验证失败!"}}]};