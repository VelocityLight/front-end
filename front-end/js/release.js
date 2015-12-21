function releaseWithoutServerName(){
	var arr;
	$.ajax({
		type : "GET",
    	async : false,
    	url : "/monitor/getallservice.do",
    	dataType : "json",
    	//jsonp : "callback",
        success: function(json){
        	//console.log("start request");
        	if (json.code == 200){
        		arr = json.data;
        	}
		},
	});
	var tips = "需要验证的IP地址列表，以分号，逗号，空格或者换行符分割";
	$("#ipDesc").val(tips);
	$("#ipDesc").focus(function() {
        //获得焦点时，如果值为默认值，则设置为空
		if($(this).val() == tips)
            $(this).val("");
	});
	$("#ipDesc").blur(function() {
        //失去焦点时，如果值为空，则设置为默认值
        if ($(this).val()== "") {
            $(this).val(tips);
        }
	});
	
	var des = "发布验证任务描述，字数少于100字";
	$("#description").val(des);
	$("#description").focus(function() {
		if($(this).val() == des)
            $(this).val("");
	});
	$("#description").blur(function() {
        //失去焦点时，如果值为空，则设置为默认值
        if ($(this).val()== "") {
            $(this).val(des);
        }
	});
	$("#servicelist").empty();
	for(var i=0; i<arr.length; i++){
		$("#servicelist").append(
				'<option>' + arr[i].serviceName + '</option>'
		);
	}
	$("#job-release").modal('show');
}


function setInitTable(){
    $("table[id=data-table]").empty();
    $("table[id=data-table]").html(
                '<tr>'
                +'		<th style="text-align:center;width:10%">ip地址</th>'
                +'		<th style="text-align:center;width:10%">服务名</th>'
                +'		<th style="text-align:center;width:30%">服务描述</th>'
            //    +'		<th>设备名称</th>'
                +'		<th style="text-align:center;width:10%">状态</th>'
                +'		<th style="text-align:center;width:40%">操作</th>'
            //    +'		<th>任务图表</th>'
                +' </tr>');
}

//判断对象是否为json格式，返回true/false
function isjson(obj){
	var isjson = typeof(obj)=="object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
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

function addDetail(j, json){
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
			
			for(var i=0; i<results.length; i++){
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
		}else{
			$("table[id=hide-table-"+ j + "]").append(
					' <tr> '
					 + '     <td style="background-color:#e6e6e6">无报警日志</td> '   
					 + '</tr>'
			);
		}
	}
	$("#blog-"+j).click(function(){
		$("#hiders"+j).toggle();
	});
	
}

function setStop(j,page,pageSize){
	var status = document.getElementById("tmen-"+(j)).innerHTML;
	var fbName = document.getElementById("tdes-"+(j)).innerHTML;
	var service = document.getElementById("tname-"+(j)).innerHTML;
	var ip = document.getElementById("tid-"+(j)).innerHTML;
	var jobId = document.getElementById("tjob-"+(j)).innerHTML;
	if(status == "排队中"){
		$("#stop-"+j).click(function(){
			var data = {"serviceName":service,"fbName":fbName,"ip":ip,"jobId":jobId};
			$.ajax({
				type : "GET",
		    	async : false,
		    	url : "/monitor/stopfbjob",
		    	data : data,
		    	dataType : "json",
		    	//jsonp : "callback",
		        success: function(json){
		        	alert(json.data);
		        	if(json.code == 200){
		        		$("#stop-"+j).addClass("disabled");
		        		get_task(page,pageSize);
		        	}		        	
		        }	
		   });
		});		
	}else{
		$("#stop-"+j).addClass("disabled");
	}
}

//根据页码发起请求获取数据
function get_task(page,pageSize){
	var data = {"page":page,"pageSize":pageSize};
	$.ajax({
		type : "GET",
    	async : false,
    	url : "/monitor/getfbresult",
    	data : data,
    	dataType : "json",
    	//jsonp : "callback",
        success: function(json){
        	//console.log("start request");
        	if (json.code == 200){
        		$("table[id=data-table]").empty();
        		setInitTable();
        		var arr = json.data;
        		for(var j = 0; j<arr.length; j++){
        			if(arr[j].fbName == "发布验证任务描述，字数少于100字") arr[j].faName="";
        			
        			$("table[id=data-table]").append(
							' <tr> '
							 + '     <td id="tid-'+(j)+'">' + arr[j].ip + '</td> '
							 + '     <td id="tname-'+(j)+'">'+ arr[j].serviceName + '</td>'
							 + '     <td id="tdes-'+(j)+'">' + arr[j].fbName + '</td>'
							 + '     <td id="tmen-'+(j)+'"></td>'
							 + '     <td id="tjob-'+(j)+'" style="display:none;">' + arr[j].jobId + '</td>'
							 + '     <td id="plot-' + (j) + '"><input type="button" class="btn btn-info btn-sm" id="blog-'+(j)+'" value="详细日志"> <input type="button" id="stop-'+(j)+'" class="btn btn-sm btn-warning" value="停止验证"></td>'
							 + '</tr>');
        			if(arr[j].status == 0){
        				$("#tmen-"+j).css("background-color","#90EE90");
        				document.getElementById("tmen-"+(j)).innerHTML = "成功";
        			}else if(arr[j].status == 1){
        				$("#tmen-"+j).css("background-color","#FF6347");
        				document.getElementById("tmen-"+(j)).innerHTML = "失败";
        			}else if(arr[j].status == 2){
        				$("#tmen-"+j).css("background-color","#87CEEB");
        				document.getElementById("tmen-"+(j)).innerHTML = "排队中";
        			}else if(arr[j].status == 3){
        				$("#tmen-"+j).css("background-color","#F0E68C");
        				document.getElementById("tmen-"+(j)).innerHTML = "执行中";
        			}else if(arr[j].status == 4){
        				$("#tmen-"+j).css("background-color","#DCB5FF");
        				document.getElementById("tmen-"+(j)).innerHTML = "运行超时";
        			}
        			$("table[id=data-table]").append(
        					' <tr id="hiders' + (j) + '" style="display:none;"> '
        					+' 	     <td colspan="5"> '
        					+'			<div> '
        					+'          	<table class="table table-bordered" id="hide-table-'+(j)+'" style="width:90%;margin:0 auto"></table>'
        					+'          </div> '
        					+'       </td>'
        					+'</tr>'
        			);
        			addDetail(j, arr[j].jobResult);
        			setStop(j,page,pageSize);
        			
        		};
        		setPageBar(page,json.totalPage,pageSize);
        		/*
        		每5秒读取函数
        		setInterval(function() {
    			    get_task(page, pageSize);
    			    
    			    alert(page+" "+pageSize);
    		    },5000);
        		*/
			} else {
				alert("serviceName is Null or not exist.");
			};
		},
	});
}

$(function(){
	get_task(1,10);
	
});