//获取url参数
function request(paras){ 
    var url = location.href;  
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
    var paraObj = {}; 
    for (var i=0; j=paraString[i]; i++){  
        paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
    }  
    var returnValue = paraObj[paras.toLowerCase()]; 
    if(typeof(returnValue)=="undefined"){  
        return "";  
    }else{  
        return returnValue;  
    } 
}

//判断对象是否为json格式，返回true/false
function isjson(obj){
	var isjson = typeof(obj)=="object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
}

function setInitTable(){
    $("table[id=data-table]").empty();
    $("table[id=data-table]").html(
                '<tr>'
                +'		<th style="text-align:center;width:25%">服务名</th>'
                +'		<th style="text-align:center;width:25%">机器名</th>'
                +'		<th style="text-align:center;width:25%">报警时间</th>'
                +'		<th style="text-align:center;width:25%">详细日志</th>'
                +' </tr>');
}


function saddDetail(j, i, json){
	if(isjson(json)){
		for(var key in json){
			if(key != "errorMsg" && key!= "script" && key!="scriptName" && key!="result" && key!="log"){
				if(json[key] != undefined && json[key] != ""){
					$("table[id=s-hide-table-"+ (j) + "-" + (i) + "]").append(
							' <tr> '
							 + '     <td style="background-color:#e6e6e6">' + key + '</td> '   
							 + '     <td>' + json[key] + '</td>'
							 + '</tr>'
					);
				}
			}
		}
		var arr = json.log;
		if(arr != undefined && arr != ""){
			var logs = "";
			var length = arr.length;
			
			for(var s = 0; s<length; s++){
				logs += '<p style="float:left;">'+arr[s]+'</p>';
			}
			$("table[id=s-hide-table-"+ (j) + "-" + (i) + "]").append(
					' <tr> '
					 + '     <td style="background-color:#e6e6e6">' + "log" + '</td> '   
					 + '     <td>' + logs + '</td>'
					 + '</tr>'
			);
			$("#open-log-"+(j)+"-"+(i)).click(function(){
				$("#s-hiders"+(j)+"-"+(i)).toggle();
				document.getElementById("open-log-"+(j)+"-"+(i)).innerHTML=(document.getElementById("open-log-"+(j)+"-"+(i)).innerHTML == "展开")?"收起":"展开";
			});
		}else{
			$("#open-log-"+(j)+"-"+(i)).css({cursor:"not-allowed",color:"black"});
		}
	}else{
		$("table[id=s-hide-table-"+ (j) + "-" + (i) + "]").append(
				' <tr> '
				 + '     <td style="background-color:#e6e6e6">' + "报警信息" + '</td> '   
				 + '     <td>' + json + '</td>'
				 + '</tr>'
		);
	}
}

//设置详细日志
function addDetail(j,json){
	if(json == ""){
		$("table[id=hide-table-"+ j + "]").append(
				' <tr> '
				 + '     <td style="background-color:#e6e6e6">' + "无报警信息" + '</td> '   
				 + '</tr>'
		);
	}else if(!isjson(json)){
		$("table[id=hide-table-"+ j + "]").append(
				' <tr> '
				 + '     <td style="background-color:#e6e6e6">' + "报警信息" + '</td> '   
				 + '     <td>' + json + '</td>'
				 + '</tr>'
		);
	}else{
		var results = json.results;
		if(results != undefined && results != ""){	
		    $("table[id=hide-table-"+ j + "]").html(
		                '<tr>'
		                +'		<th style="text-align:center;background:#999999;width:40%">script</th>'
		                +'		<th style="text-align:center;background:#999999;width:10%">result</th>'
		                +'		<th style="text-align:center;background:#999999;width:40%">errormsg</th>'
		                +'		<th style="text-align:center;background:#999999;width:10%">log</th>'
		                +' </tr>');
			var flag = 0;
			for(var i=0; i<results.length; i++){
				if(results[i].result == "fail"){
					flag = 1;
					$("table[id=hide-table-"+ j + "]").append(
							' <tr> '
							+' <td> ' + results[i].script + '</td>'
							+' <td> ' + results[i].result + '</td>'
							+' <td> ' + results[i].errorMsg + '</td>'
							+' <td id="open-log-'+(j)+"-"+(i)+'" class="txt_url">展开</td>'
							+' </tr>'
					);
					$("table[id=hide-table-"+ j + "]").append(
							' <tr id="s-hiders' + (j) + "-" + (i) + '" style="display:none;"> '
	    					+' 	     <td colspan="4"> '
	    					+'			<div> '
	    					+'          	<table class="table table-bordered" id="s-hide-table-'+(j) + "-" + (i) +'" style="width:95%;margin:0 auto"></table>'
	    					+'          </div> '
	    					+'       </td>'
	    					+'</tr>'	
					);
					
					saddDetail(j,i,results[i]);
					
				}
			}
			if(!flag){
				$("table[id=hide-table-"+ j + "]").append(
						' <tr class="tr_bg"> '
						+ '     <td colspan="4">' +"全部样例均通过"+ '</td> '
    					+ '</tr>'
				);
			}
		}else{
			$("table[id=hide-table-"+ j + "]").append(
					' <tr> '
					 + '     <td style="background-color:#e6e6e6">无报警日志</td> '   
					 + '</tr>'
			);
		}		
		
	}
	
	$("#plot-"+ j).click(function(){
		$("#hiders" + j).toggle();
	});
}


//根据页码发起请求获取数据
function get_task(page, pageSize){
	var serviceName = decodeURI(request('serviceName'));
	var data = {"serviceName":serviceName, "page":page, "pageSize":pageSize};
	var total = 0;
	$.ajax({
		type : "GET",
    	async : false,
    	url : "/monitor/getresult",
    	data : data,
    	dataType : "json",
    	//jsonp : "callback",
        success: function(json){
        	//console.log("start request");
        	if (json.code == 200){
        		setInitTable();
        		var arr = json.data;
        		for(var j = 0; j < arr.length; j++){
        			if(!arr[j].机器名) arr[j].机器名="";
        			$("table[id=data-table]").append(
							' <tr> '
							 + '     <td>' + serviceName + '</td> '
							 + '     <td id="tname'+ (j+1) +'">' + arr[j].机器名 + '</td>'
							 + '     <td id="tmen_av">' + arr[j].报警时间 + '</td>'
							 + '     <td><input type="button" class="btn btn-info btn-sm" id="plot-' + (j) + '" value="详情展开"></td>'
							 + '</tr>');
        			$("table[id=data-table]").append(
        					' <tr id="hiders' + (j) + '" style="display:none;"> '
        					+' 	     <td colspan="4"> '
        					+'			<div> '
        					+'          	<table class="table table-bordered" id="hide-table-'+(j)+'" style="width:90%;margin:0px auto"></table>'
        					+'          </div> '
        					+'       </td>'
        					+'</tr>'
        			);
        			addDetail(j, arr[j].报警信息);
        		};
        		setPageBar(page,json.totalPage,pageSize);
			} else {
				setInitTable();
				$("table[id=data-table]").append(
    					' <tr class="tr_bg"> '
						+ '     <td colspan="4">' +"无报警信息"+ '</td> '
    					+ '</tr>');
			};
		},
		
	});
}



$(function(){
	//初始化显示
	get_task(1,10);
	
});