#dps

执行node npmAll.js 安装所需依赖（自动进入Application相关目录执行npm install），等待提示“所有依赖安装完成”即安装结束。

修改config/dev/config.js 等相关配置

全局安装webpack npm install webpack -g

进入webpack模块目录，编译静态文件

```
cd Application/webpack
webpack
```
        
执行node app.js启动