function configue(j){
	getprj(j);
	$("#configue").modal('show');
}

function closeConfigue(){
	$("#configue").modal('hide');
}

function ConfigueOprate(){

	var map = [];
	
	map["mServiceName"]=$("#mServiceName").val();
	map["mCmd"]=$("#mCmd").val();
	map["mConcurrent"]=$("#mConcurrent").val();
	map["mMode"]=$("input[name='mode']:checked").val();
	
	map["mSvnUrl"]=$("#mSvnUrl").val();
	map["mSvnVersion"]=$("#mSvnVersion").val();
	var flag = 0;
	for(var key in map){
		var tips = "tip"+key;
		document.getElementById(tips).innerHTML = "";
		if(map[key] == "" || map[key]==undefined){		
			document.getElementById(tips).innerHTML = "输入不能为空";
			flag = 1;
		}
	}
	if(!flag){
		updateprj();
	}
}

function getprj(k){
	var serviceName = document.getElementById("tname"+(k+1)).innerHTML;
	var data = {"serviceName":serviceName};
	$.ajax({
		type : "GET",
    	async : false,
    	url : "/monitor/getprj",
    	data : data,
    	dataType : "json",
    	success : function(json){
    		if(json.code == 200){
    			for(var key in json.data){
    				var mkey = "m"+key.substring(0,1).toUpperCase()+key.substr(1);
    				var tips = "tip"+mkey;
    				if(mkey == "mSvnVersion"){
    					$("#"+mkey).val("latest");
    				}else if(mkey == "mMode"){
    					$($('#mMode'+'input').eq(0)).prop('checked',false);
    					$($('#mMode'+'input').eq(1)).prop('checked',false);
    					$($('#mMode'+'input').eq(2)).prop('checked',false);
    					$($('#mMode'+'input').eq(3)).prop('checked',false);
    				}else if(mkey == "mServiceName"){
						$("#"+mkey).val(data.serviceName);
					}else{
    					$("#"+mkey).val("");
    				}
    				document.getElementById(tips).innerHTML = "";
    				if(json.data[key] != ""){
    					if(mkey == "mMode"){
    						var list;
    						if(json.data[key] == "NORMAL") list=0;
    						else if(json.data[key] == "DEBUG") list=1;
    						else if(json.data[key] == "STOP") list=2;
    						else if(json.data[key] == "NOALARM") list=3;
    						$("#mMode").find("input").eq(list).prop("checked",true);
    					}else if(mkey == "mServiceName"){
    						$("#"+mkey).val(data.serviceName);
    					}else{
    						$("#"+mkey).val(json.data[key]);
    					}
    				}
    			}
    		}
    	}
	});
}

function updateprj(){
	var serviceName = $("#mServiceName").val();
	var cmd = $("#mCmd").val();
	var concurrent = $("#mConcurrent").val();
	var mode = $('input:radio[name="mode"]:checked').val();
	var svnUrl = $("#mSvnUrl").val();
	var svnVersion = $("#mSvnVersion").val();
	var data = {"serviceName":serviceName, "cmd":cmd, "concurrent":concurrent, "mode":mode, "svnUrl":svnUrl, "svnVersion":svnVersion};
	$.ajax({
		type : "POST",
    	async : false,
    	url : "/monitor/updateprj",
    	data : data,
    	dataType : "json",
    	success : function(json){
    		if(json.code == 200){
    			alert("项目创建成功");
    			closeConfigue();
    		}else if(json.code == 500){
    			alert("项目创建失败，请检查传入的参数是否正确");
    		}
    	}
	});
	
}




function mode(j){
	var modes = document.getElementById("mode-"+(j)).value;
	var list;
	if(modes == "NORMAL") list=0;
	else if(modes == "DEBUG") list=1;
	else if(modes == "STOP") list=2;
	else if(modes == "NOALARM") list=3;
	$("#mode-view").find("input").eq(list).prop("checked",true);
	$("#mode-foot").empty();
	$("#mode-foot").append(
		'<button type="button" class="btn btn-default" onclick="closeMode()">关闭</button>'
		+'<button id="jobOk" type="button" class="btn btn-primary" onclick="ModeOprate('+(j)+')">确定</button>'
	);
	$("#mode").modal('show');
}
function closeMode(){
	$("#mode").modal('hide');
}
function ModeOprate(j){
	
	var modes = $("input[name='mode2']:checked").val();
	var serviceName = document.getElementById("tname"+(j+1)).innerHTML;
	var data = {"serviceName":serviceName, "mode":modes};
	$.ajax({
		type : "POST",
    	async : false,
    	url : "/monitor/updateprjmode",
    	data : data,
    	dataType : "json",
    	success : function(json){
    		if(json.code == 200){
    			alert("修改模式成功");
    			document.getElementById("mode-"+(j)).value = modes;
    			$("#mode").modal('hide');
    		}else{
    			alert("修改模式失败");
    		}
    	}
	});
}
function getprjmode(j){
	var serviceName = document.getElementById("tname"+(j+1)).innerHTML;
	var data = {"serviceName":serviceName};
	$.ajax({
		type : "GET",
    	async : false,
    	url : "/monitor/getprjmode",
    	data : data,
    	dataType : "json",
    	success : function(json){
    		if(json.code == 200){
    			if(json.data != "")
    				document.getElementById("mode-"+(j)).value = json.data;
    		}
    	}
	});
}