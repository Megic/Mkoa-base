/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('memberRule',{
                title: {
                        type: DataTypes.STRING(40),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '规则描述'
                      },
                name: {
                        type: DataTypes.STRING(60),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '规则名称/标记'
                      },
                status: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '状态'
                      }}, {
        tableName:$C.prefix+'memberRule',
        comment: '权限规则表',
        timestamps:true,
        indexes:[],
        paranoid:false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};