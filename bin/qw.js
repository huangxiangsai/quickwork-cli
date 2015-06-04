#!/usr/bin/env node

'use strict';
var program = require('commander');
var fs = require('fs');
var exec = require('child_process').exec;
var pro = require(__dirname+'/properties.js').pro;
var config = require(__dirname+'/apache.json');

var param = {};

var ctrl = {
	switch : function(value) { //切换项目
		if(!value){
			ctrl.restartApache();
			return ;
		}

		param.value = value;
		var active = pro().searchOne('active'); //当前的目录 key
 
		var activeDir = pro().searchOne(value);
		
		if(!activeDir){
			console.log("没有找到对应的项目");
			return;
		}

		//修改apache配置文件
		var confPath = config.apache.path;
		var regRoot = /\nDocumentRoot\s+"(.*)"/;
		var confText = fs.readFileSync(confPath, 'utf8');
		console.log('修改 docuemntROOT : '+activeDir);
		confText = confText.replace(regRoot, '\nDocumentRoot "'+activeDir +'"');
		fs.writeFile(confPath, confText,  function(error,stdout){
			console.log('修改 http.conf success.');
			if(!error){
				//重启服务
				ctrl.restartApache();
			}else{
				console.log('修改apache配置文件出错');
			}
		})
	
	},
	start : function() { //启动apache
		exec('httpd -k start',function(error,stdout,stderr) {
			if(!error){
				console.log("httpd runned .....");
				changeActiveConfig();
			}else{
				console.log('启动出错');
			}				
		});	
	},
	stop : function() { //停止apache
		exec('httpd -k stop',function(error,stdout,stderr) {
			if(!error){
				console.log("httpd stoped .....");
				callback && callback();
			}else{
				console.log('停止出错');
				console.log(error);
			}		
		});
	},
	restartApache : function() { //重启apache
		console.log('开始重启apache server ...');
		exec('httpd -k restart',function(error,stdout,stderr) {
			if(!error){
				console.log('httpd restart success.');
				changeActiveConfig();
			}
		});
	},
	active : function() {  // 查看当前的项目路径
		var active = pro().searchOne('active'); //当前的目录 key
		var activeDir = pro().searchOne(active);
		console.log("当前的项目路径是："+activeDir);
	},
	search : function(key) {//查询已有的项目路径配置文件
		if(key){
			pro().searchOne(key,function (error,data) {
				if(!error){
					console.log(key+" 对应的项目路径是："+data);
				}
			});
			return;
		}

		pro().search(null,function(error,data) {
			if(!error){
				console.log(data.result);
			}
		});
	},
	add : function (obj) {	
		console.log(obj);
		pro().save(obj,function () {
		});
	}
		
}

var changeActiveConfig = function() {
	param.value && pro().save([{
		key : "active",
		value : param.value
	}]);
	console.log("更新当前目录key success");
};

//命令行设置
program.version("1.0.0")
	.option("--switch [key]","active project ",ctrl.switch)
	.option("-f, --find [key]","serach someting one project address",ctrl.search)
	.option("-p, ---stop","stop apache",ctrl.stop)
	.option("-s, --start","start apache",ctrl.start)
	.option("-r, --restart","restart apache",ctrl.restartApache)
	.option("-c, --cur","search current project",ctrl.active)
	.option("-a, --add <key>=<value>","add project address",function (arg) {
			var arr = arg.split("=");
			if(arr.length == 2){
				if(!arr[1]){
					console.log("-a, --add  参数设置有误请以：key=value的形式");
				}else{
					ctrl.add([{key : arr[0] , value : arr[1] }] );
				}
			
			}else{
				console.log("-a, --add  参数设置有误请以：key=value的形式");
			};
	})

	.option("--config <path>","config apache lib path ",function (path) {
		console.log(path);
	})
	.parse(process.argv);


if(process.argv.length === 3 && program.switch === true){ //没有[key]时执行
	ctrl.switch(false);
	return ;
}

if(process.argv.length === 3 && program.find  === true){  //没有[key]时执行
	ctrl.search(false);
	return ;
}

if(process.argv.length === 2 ){
	ctrl.restartApache();  //没有参数时执行
}

