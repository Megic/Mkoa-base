/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('memberOpen',{
                openid: {
                        type: DataTypes.STRING(32),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '第三方用户标识'
                      },
                memberId: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '用户标记'
                      },
                type: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '第三方类型'
                      }}, {
        tableName:$C.prefix+'memberOpen',
        comment: ' 第三方绑定数据表',
        timestamps:true,
        indexes:[],
        paranoid:false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};