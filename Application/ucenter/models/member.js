/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('member',{
                name: {
                        type: DataTypes.STRING(40),
                        allowNull:true,
                        unique:false,
                        comment: '昵称/姓名'
                      },
                phone: {
                        type: DataTypes.STRING(11),
                        allowNull:true,
                        unique:false,
                        comment: '手机号码'
                      },
                email: {
                        type: DataTypes.STRING(80),
                        allowNull:false,
                        unique:false,
                        comment: '邮箱'
                      },
                username: {
                        type: DataTypes.STRING(30),
                        allowNull:true,
                        unique:false,
                        comment: '用户名'
                      },
                password: {
                        type: DataTypes.CHAR(32),
                        allowNull:true,
                        unique:false,
                        comment: '密码'
                      },
                money: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '余额'
                      },
                headimgurl: {
                        type: DataTypes.STRING,
                        allowNull:true,
                        unique:false,
                        comment: '用户头像'
                      },
                groupId: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '所属用户组'
                      },
                sessionId: {
                        type: DataTypes.CHAR(32),
                        allowNull:true,
                        unique:false,
                        comment: 'sessionId'
                      },
                adminId: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '管理组'
                      },
                orgId: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '组织ID'
                      },
                status: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'1',
                        unique:false,
                        comment: '状态'
                      }}, {
        tableName:$C.prefix+'member',
        comment: '用户表',
        timestamps:true,
        indexes:[],
        paranoid:false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};