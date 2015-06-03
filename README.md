#quickworkCli

nodejs-based a apache tool 

基于nodejs实现的apache 启动停止及项目快速切换工具

#可以干什么
只要做得工作是：

>>  配置项目地址
>>  查看单个或所有配置的项目地址
>>  切换apache的DocumentRoot 地址
>>  启动apache
>>  停止apache

#Usage
first mark sure apache server is not disabled , there is `apache -k start` 、 `apache -k stop` and `apache -k restart` 
command line


before using,  by `apache.json` ,to get apache project addr 

so you need change `apache.json`   e.g.:

    {
      "apache" : {
              "path" : "",
              "listen" "80"
          }
    
    }


or

by command line :

    qk config path [path]
    qk config listen [listen]

then 

add project address by below command :

    qk save [key] [address]


active project by below command :

    qk -a , -active [key]

serach someting one project address by below command :

    qk -f , -find [key]

serach all project address by below command :

    qk -f , -find



stop apache by below command :

    qk -sp , -stop


start apache by below command :

    qk -st , -start

restart apache by below command :

    qk -r, -restart



