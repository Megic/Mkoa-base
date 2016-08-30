module.exports={"modelName":"member","comment":"用户表","indexes":"","buildViews":"false","timestamps":"true","paranoid":"false","root":"ucenter","filepath":"admin","fields":[{"name":"name","comment":"昵称/姓名","type":"STRING(40)","allowNull":true,"unique":false,"defaultValue":"","validate":{"rule":"max:40","error":"用户名长度有误"}},{"name":"phone","comment":"手机号码","type":"STRING(11)","allowNull":true,"unique":true,"defaultValue":"","validate":{"rule":"phone","error":"手机号码错误"}},{"name":"email","comment":"邮箱","type":"STRING(80)","allowNull":true,"unique":true,"defaultValue":"","validate":{"rule":"email","error":"邮箱格式错误"}},{"name":"username","comment":"用户名","type":"STRING(30)","allowNull":true,"unique":true,"defaultValue":"","validate":{"rule":"between:3,30","error":"用户名长度不在3-30个字符内"}},{"name":"password","comment":"密码","type":"CHAR(32)","allowNull":true,"unique":false,"defaultValue":"","validate":{"rule":"between:6,32","error":"密码不能少于6个字符"}},{"name":"money","comment":"余额","type":"INTEGER","allowNull":false,"unique":false,"defaultValue":"0","validate":{"rule":"integer","error":"验证失败!"}},{"name":"headimgurl","comment":"用户头像","type":"STRING","allowNull":true,"unique":false,"defaultValue":"","validate":{"rule":"","error":"验证失败!"}},{"name":"groupId","comment":"所属用户组","type":"INTEGER","allowNull":false,"unique":false,"defaultValue":"0","validate":{"rule":"required","error":"验证失败!"}},{"name":"status","comment":"状态","type":"INTEGER","allowNull":false,"unique":false,"defaultValue":"1","validate":{"rule":"required","error":"用户状态必须填写"}}]};