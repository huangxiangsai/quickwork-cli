#!/usr/bin/env node

'use strict';
var program = require('commander');
var fs = require('fs');
var exec = require('child_process').exec;
var pro = require('./properties.js').pro;

var status = { //状态
	code : 200,
	msg : ''
};
 

var param = {};




var ctrl = {
	switch : function(value) {
		if(!value){
			restartApache();
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
		var confPath = "D:\\tool\\PHP\\Apache24\\conf\\httpd.conf";
		var regRoot = /\nDocumentRoot\s+"(.*)"/;
		var confText = fs.readFileSync(confPath, 'utf8');
		console.log('修改 docuemntROOT : '+activeDir);
		confText = confText.replace(regRoot, '\nDocumentRoot "'+activeDir +'"');
		fs.writeFile(confPath, confText,  function(error,stdout){
			console.log('修改 http.conf success.');
			if(!error){
				//重启服务
				restartApache();
			}else{
				console.log('修改apache配置文件出错');
			}
		})
	
	},
	start : function() {
		startApache();
	},
	stop : function() {
		stopApache();
	},
	restartApache : function() {
		restartApache();
	},
	active : function() {
		var active = pro().searchOne('active'); //当前的目录 key
		var activeDir = pro().searchOne(active);
		console.log("当前的项目目录是："+activeDir);
	},
	search : function(key) {
		if(key){
			pro().searchOne(key,function () {
				if(!error){
					console.log(data.result);
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

/**
 * [parseParam 解析传入的参数]
 * @return {[type]} [description]
 */
var parseParam = function(params) {
	var h = params[0];
	if(!h){
		param.handler = "restartApache";  //默认操作重启服务
		return;
	}


	var type = h.split("=");
	var handler = type[0];
	var value = type[1];
	if(type.length == 1 && handler == 'switch'){
		status.code = 404;
		status.msg = '请输入要切换的目录key,使用serach查询key';
		return;
	}

	if(handler == 'save'){
		var data =  value.split(":");
		value  = {
			key : data[0],
			value : data[1]
		}
	}

	param.handler = handler; //功能名
	param.value = value || undefined;  //功能对应的参数 可能为空
};

var restartApache = function() {
	console.log('开始重启apache server ...');
	exec('httpd -k restart',function(error,stdout,stderr) {
		if(!error){
			console.log('httpd restart success.');
			changeActiveConfig();
		}
	});

};

var stopApache = function(callback) {
	exec('httpd -k stop',function(error,stdout,stderr) {
		if(!error){
			console.log("httpd stoped .....");
			callback && callback();
		}else{
			console.log('停止出错');
			console.log(error);
		}
		
		
	});
};

var startApache = function() {
	exec('httpd -k start',function(error,stdout,stderr) {
		if(!error){
			console.log("httpd runned .....");
			changeActiveConfig();
		}else{
			console.log('启动出错');
		}				
	});	
};

var changeActiveConfig = function() {
	
	param.value && pro().save({
		'active' : {
			value : param.value
		}
	});
	console.log("更新当前目录key success");
};

// parseParam(params); //解析参数

if(status.code != 200){
	console.log(msg);
	return ;
}

function chanage (param) {
	if(param === true){
		return false;
	}
	return param;
	
}


program.version("1.0.0")
	.option("-a, --active [key]","active project ")
	.option("-f, --find","serach someting one project address")
	.option("-p, ---stop","stop apache")
	.option("-s, --start","start apache")
	.option("-r, --restart","restart apache")
	.option("-c, --cur","search current project")
	.option("-d, --add <key>=<value>","add project address")
	.parse(process.argv);

if(program.active){
	ctrl.switch(chanage(program.active));
}

if(program.find){
	ctrl.search(chanage(program.find));
}

if(program.stop){
	ctrl.stop();
}

if(program.start){
	ctrl.start();
}

if(program.restart){
	ctrl.restart();
}


if(program.cur){
	ctrl.active();
}

if(program.add){
	
	var arr = program.add.split("=");
	if(arr.length == 2){
		if(!arr[1]){
			console.log("-d, --add  参数设置有误请以：key=value的形式");
		}else{
			ctrl.add([{key : arr[0] , value : arr[1] }] );
		}
	
	}else{
		console.log("-d, --add  参数设置有误请以：key=value的形式");
	}
}







// program.command('config')
// 	.description('config apache lib path and listen ')
// 	.option("-p, --path [path]" , "lib path")
// 	.option("-l, --listen [listen]" , "port listen")
// 	.action(function (option) {
// 		console.log(arguments);
// 		console.log(option.path);
// 	});

// program.option("--add [key] [value]","add project address")
// 	.option("-a, --active","active project ")
// 	.option("-f, --find","serach someting one project address")
// 	.option("-p, ---stop","stop apache")
// 	.option("-s, --start","start apache")
// 	.option("-r, --restart","restart apache")
// 	.action(function (options) {
// 		console.log(options);
// 		if(options){
// 			console.log(options);
// 		}
// 	});

// ctrl[param.handler](param.value);

