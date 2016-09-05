/**
* Created by Mkoa
*/
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('fileInfo',{
                chunks: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '总分块数'
                      },
                chunk: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '第几分块'
                      },
                size: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '文件大小(KB)'
                      },
                isall: {
                        type: DataTypes.BOOLEAN,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '传输完成'
                      },
                name: {
                        type: DataTypes.STRING(50),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '文件名'
                      },
                md5: {
                        type: DataTypes.CHAR(32),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: 'MD5校验'
                      },
                sign: {
                        type: DataTypes.CHAR(32),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '唯一标识'
                      },
                path: {
                        type: DataTypes.STRING(255),
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '文件访问地址'
                      },
                memberId: {
                        type: DataTypes.INTEGER,
                        allowNull:false,
                        defaultValue:'0',
                        unique:false,
                        comment: '用户ID'
                      }}, {
        tableName:$C.prefix+'fileInfo',
        comment: '分片上传文件信息表',
        timestamps:true,
        indexes:[],
        paranoid:false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};