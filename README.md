#quickworkCli

nodejs-based a apache tool 

基于nodejs实现的apache 启动停止及项目快速切换命令行工具

#可以干什么
主要做得工作是：

>>  配置项目地址

>>  查看单个或所有配置的项目地址

>>  切换apache的DocumentRoot 地址

>>  启动apache

>>  停止apache

#Usage
首先确保apache server能正常使用，并且  `apache -k start` 、 `apache -k stop` and `apache -k restart`这些命令都是可用的。

在使用前，需要先配置 `apache.json` 添加apache的lib路径
所以需要对`apache.json`进行修改 

  
    {
      "apache" : {
              "path" : "",
              "listen" "80"
          }
    
    }

或者可以通过命令来添加apache lib路径


    qk --config path [path]



设置项目路径 key 项目进行切换时需要,  address 实际的项目路径  :

    qk -a, --add [key] [address]


通过key 切换至指定的项目上 :

    qk --switch [key]

查看已经配置的所有项目路径 :

    qk -f , --find [key]

查看已经配置的所有项目路径:

    qk -f , --find



停止apache :

    qk -p , --stop


启动apache :

    qk -s , --start

重启apache :

    qk -r, --restart



