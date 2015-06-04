/**
 * 匹配文件解析类
 */

var fs = require('fs');

function Properties (path) {
	this.path = path;
	this.exists = fs.existsSync(path);
	if(this.exists){
		this.content = fs.readFileSync(path, 'utf-8');
	}else{
		fs.writeFileSync(path, '#first line descript', 'utf-8');
	}
}

Properties.prototype = {
	regNote : /^\#+/g,//匹配注释
	regBreak : /\n+|(?=\\n)+/g , //匹配换行符
	regBlack : /^\s+/g , //匹配空格
	content : '',

	contentLine : function() { //内容数组 拆分成行
		if(!!this.content){
			var temp = this.content.replace(this.regBlack, '');
			
			temp = this.content.replace(this.regBreak, '|'); //去除空格
			return temp.split('|');
		}
		return [];
	},
	/**
	 * [save 保存或修改配置]
	 * @param  {[type]} {data} [description] exmplate : [{key : '', value : '', des : ''}]
	 * @return {[type]}      [description]
	 */
	save : function(dataArray,callback) {
		//查看是否存在 有修改 没有添加
		var contentline = this.contentLine();
		for(var i = 0 ; i < contentline.length ; i++){

			if((!this.regNote.test(contentline[i])) && contentline[i] != '' ){//过滤掉注释行 与 空的行
				var key = contentline[i].split("=")[0];
				var value = contentline[i].split('=')[1];

				for(var j =0 ; j < dataArray.length ;j++){
					var data = dataArray[j];
					if( data.key ==  key && !!data.value){//已有 修改value
						contentline[i] = key +"="+data.value;
						delete data.key;
					}
				}
			}			
		}

		for(var i =0 ; i < dataArray.length ;i++){
			var data = dataArray[i];
			// console.log(data);
			data.des && contentline.push("#"+data.des);
			data.key && data.value && contentline.push(data.key+"="+data.value);
		}
		var content = contentline.join("|").replace(/\|/g, '\n');
		
		fs.writeFileSync(this.path, content, 'utf-8');
	},
	/**
	 * 查询出匹配文件内容
	 * @param  {[type]} type [返回的格式类型 默认string] 可以是 json  array 
	 * @return {[type]}      [description]
	 */
	search: function(type,callback) {
		type = type || 'string';
		var contentline = this.contentLine();
		var result = [];
		var index = 0;

		switch(type){
			case 'string':
				callback && callback(null,{result : contentline.join("|").replace(/\|/g, '\n')});
				return contentline.join("|").replace(/\|/g, '\n');
				break;
			case 'json':
				var data = {};
				for(var i = 0 ; i < contentline.length ; i++){
					if((!this.regNote.test(contentline[i])) && contentline[i] != '' ){//过滤掉注释行 与 空的行
						var key = contentline[i].split("=")[0];
						var value = contentline[i].split('=')[1];
						data[key] = value;
					}			
				}
				callback && callback(null,{result : data});
				return data;
				break;
			case 'array':
				for(var i = 0 ; i < contentline.length ; i++){
					if((!this.regNote.test(contentline[i])) && contentline[i] != '' ){//过滤掉注释行 与 空的行
						result[index++] = contentline[i];
					}			
				}
				callback && callback(null,{result : result});
				return result;
				break;
			default:
				
				break;
		}
		callback && callback(["type error "],null);
		return result;

	},
	searchOne : function(key, callback) {
		var result = "";
		var contentline = this.contentLine();
		for(var i = 0 ; i < contentline.length ; i++){
			if((!this.regNote.test(contentline[i])) && contentline[i] != '' ){//过滤掉注释行 与 空的行
				var lkey = contentline[i].split("=")[0];
				var value = contentline[i].split('=')[1];
				if(lkey == key){
					result = value;
				}		
			}			
		}
		callback && callback(null,result);
		return result;

	}
};	


exports.pro = function (path) {
	path = path || __dirname+"\\project.properties";
	return new Properties(path);
}

// test
// var test = new Properties("test.properties");
// test.serachOne('active',function(error , value){
// 	console.log(value);
// });
