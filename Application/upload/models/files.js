/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('files',{
                memberId: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '用户ID'
                      },
                path: {
                        type: DataTypes.STRING(255),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '存储路径'
                      },
                name: {
                        type: DataTypes.STRING(50),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '文件名称'
                      },
                groupid: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '分组ID'
                      },
                type: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '文件类型 1图片 2其他'
                      },
                hostid: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '存储服务器ID[0为本地]'
                      },
                status: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '状态'
                      }}, {
        tableName:$C.prefix+'files',
        comment: '用户图片数据表',
        timestamps:true,
        indexes:[],
        paranoid:false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};