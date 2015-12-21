// 将一个表单的数据返回成JSON对象  
$.fn.serializeObject = function() {  
	var o = {};  
	var a = this.serializeArray();  
	$.each(a, function() {  
    	if (o[this.name]) {  
      	if (!o[this.name].push) {  
        	o[this.name] = [ o[this.name] ];  
      	}  
      	o[this.name].push(this.value || '');  
    }else {  
      	o[this.name] = this.value || '';  
    }  
  });  
  return o;  
};

function serverInfo(k){
	var serviceName = document.getElementById("tname"+(k+1)).innerHTML;
	window.location.href = encodeURI("/serviceDetail.htm?serviceName="+serviceName);
}

$(function() {
    var vdefault = $('#keysearch').val();
	$("#keysearch").focus(function() {
            //获得焦点时，如果值为默认值，则设置为空
            if ($(this).val() == vdefault) {
                $(this).val("");
            }
    });
	$("#keysearch").blur(function() {
            //失去焦点时，如果值为空，则设置为默认值
            if ($(this).val()== "") {
                $(this).val(vdefault);
            }
    });
	$("#keysearch").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $("#submit").click();
        }
    });
	
	$("#submit").click(function(){
    	var form = document.getElementById("form");
		var service = form.elements["serviceName"].value;
		var data = {};
		var flag = 0;
		if(service == "输入服务名查询"){
			alert("查询服务名不能为空");
			return;
		}
		
		//alert(service);
		$.ajax({
			type : "GET",
	    	async : false,
	    	url : "/monitor/getallservice.do",
	    	data : data,
	    	dataType : "json",
	    	//jsonp : "callback",
	        success: function(json){
	        	if(json.code == 200){	
	        		$.each(json.data, function(i, item){
	        			if(item.serviceName == service){
		      				setInitTable();	
		      				$("table[id=data-table]").append(
		      						' <tr> '
		      						 + '     <td id="tid">' + (i+1) + '</td> '
		      						 + '     <td id="tname'+ (i+1) +'">' + service + '</td>'
		      						 + '     <td id="tmen_av">' + item.time + '</td>'
		      						 + '     <td id="plot-' + (i) + '"><input type="button" value="详情" class="btn btn-info btn-sm" onclick="serverInfo('+ (i) +')"> <input type="button" id="release-'+(i)+'" class="btn btn-danger btn-sm" value="发布"> <input type="button" id="configue-'+(i)+'" class="btn btn-success btn-sm" value="配置"> <input type="button" id="mode-'+(i)+'" class="btn btn-warning btn-sm" value="无模式"></td>'
		      						 + '</tr>');
		      				flag = 1;
		      				$("#release-"+i).click({json:json.data, int:i}, function(event){
		        				releaseServer(event.data.int, event.data.json);
		        			});
		      				$("#configue-"+i).click({int:i}, function(event){
		        				configue(event.data.int);
		        			});
		      				$("#mode-"+i).click({int:i}, function(event){
		        				mode(event.data.int);
		        			});
		      				getprjmode(i);
	        			}
	        		});
	        		if(flag == 0)
	        			alert("查询无此服务");
	        		if(flag == 1 && document.title == "WatchDog首页"){
	        			$("#home-ground").hide();
	        			$("#under-ground").hide();
	        			$("#content").show();
	        			$("#body").css("padding-top","80px");
	        		}
	        	}
	        }
		});
    });
	
});
