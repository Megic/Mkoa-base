/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('memberGroup',{
                name: {
                        type: DataTypes.STRING(40),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '用户组名称'
                      },
                rules: {
                        type: DataTypes.STRING(255),
                        allowNull:true,
                        unique:false,
                        comment: '规则ID[逗号隔开]'
                      },
                status: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '状态'
                      }}, {
        tableName:$C.prefix+'memberGroup',
        comment: '用户组',
        timestamps:true,
        indexes:[],
        paranoid:false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};