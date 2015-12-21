function textLimit() {
	var maxl = 100;
	var s = document.getElementById("description").value.length+1;
    if (s > maxl)
    	document.getElementById("description").value = document.getElementById("description").value.substr(0, maxl - 1);
    else
        document.getElementById("length").innerHTML = "(已输入：" + s + "/" + maxl+ " 字符)";
}
function releaseServer(j,arr){
	var tips = "输入需要验证的IP地址列表、域名或机器名，以分号，逗号，空格或者换行符分割";
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
	$("#servicelist").append('<option>' + arr[j].serviceName + '</option>');
	for(var i=0; i<arr.length; i++){
		if(arr[i].serviceName != arr[j].serviceName){
			$("#servicelist").append(
					'<option>' + arr[i].serviceName + '</option>'
			);
		}
	}
	$("#job-release").modal('show');
}


function closeJobModal(){
	$("#job-release").modal('hide');
}
//判断ip字符串组成
function isFormat(str){
	var reg = /^[.,0-9]*$/;
	return reg.test(str);
}
function jobOprate(){
	var iplist = $("#ipDesc").val();
	var service = $("#servicelist").val();
	var description = $("#description").val();
	if(description == "发布验证任务描述，字数少于100字") description="";
	var ip = iplist.replace(/[,;，。；\t\n\s]+/g,",");
	ip = ip.replace(/(,*$)/g,"");
	ip = ip.replace(/^,*/g,"");
	//if(!isFormat(ip)){
	//	alert("输入ip格式错误，请按照标准格式输入");
	//}else{
	var data={"serviceName":service, "iplist":ip, "fbName":description};
	$.ajax({
		type : "GET",
		data : data,
		url : "/monitor/createfbjob",
		dataType : "json",
        success: function(json){
        	if (json.code == 200){
        		if(document.title == "服务监控"){
        			window.location.href = encodeURI("/release.htm");
        		}else if(document.title == "发布验证"){
        			window.location.href = window.location.href;
        		}
        	}else{
        		alert("创建任务失败,请检查输入项是否合法");
        	}
        }
	});
	//}
}
