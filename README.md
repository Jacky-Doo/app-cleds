app-cleds

＝＝＝＝＝＝＝

## Mongodb数据库启动
mongod --dbpath [数据库地址] --fork --syslog

## gulp构建命令
1.前端开发环境build: `gulp build:dev`
2.前端产品环境build： `gulp build`
3.后端开发环境启动: `gulp node-server:dev`
4.后端产品环境启动: `gulp node-server`
5.后端debuge启动: `gulp node-server:debug`
6.前后端开发环境build和启动: `gulp dev`
7.前后端产品环境build和启动: `gulp pdt`

## aliyun部署
开发机器运行`gulp build`生成产品环境的前端资源，然后更新到github；
aliyun机器`cd /www/app-cleds`，执行`git pull`更新代码，`forever start server/start.js`运行node应用；
