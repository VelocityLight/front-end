//清空并初始化表格
function setInitTable(){
    $("table[id=data-table]").empty();
    $("table[id=data-table]").html(
                '<tr>'
                +'		<th style="text-align:center;width:10%">服务ID</th>'
                +'		<th style="text-align:center;width:20%">服务名</th>'
                +'		<th style="text-align:center;width:30%">报警时间</th>'
            //    +'		<th>设备名称</th>'
                +'		<th style="text-align:center;width:40%">服务详情</th>'
            //    +'		<th>任务图表</th>'
                +' </tr>');
}


//根据页码发起请求获取数据
function get_task(page, pageSize){
	var data = {"page":page, "pageSize":pageSize};
	$.ajax({
		type : "GET",
    	async : false,
    	url : "/monitor/getallservice.do",
    	data : data,
    	dataType : "json",
    	//jsonp : "callback",
        success: function(json){
        	//console.log("start request");
        	if (json.code == 200){
        		setInitTable();
        		
        		var arr = json.data;
        		for(var j=0; j < arr.length; j++){
        			$("table[id=data-table]").append(
							' <tr> '
							 + '     <td id="tid">' + ((page-1)*pageSize+j+1) + '</td> '
							 + '     <td id="tname'+ (j+1) +'">' + arr[j].serviceName + '</td>'
							 + '     <td id="tmen_av">' + arr[j].time + '</td>'
							 + '     <td id="plot-' + (j) + '"><input type="button" value="详情" class="btn btn-info btn-sm" onclick="serverInfo('+ (j) +')"> <input type="button" id="release-'+(j)+'" class="btn btn-danger btn-sm" value="发布"> <input type="button" id="configue-'+(j)+'" class="btn btn-success btn-sm" value="配置"> <input type="button" id="mode-'+(j)+'" class="btn btn-warning btn-sm" style="width:70px;" value="无模式"></td>'
							 + '</tr>');
        			$("#release-"+j).click({json:arr, int:j}, function(event){
        				releaseServer(event.data.int, event.data.json);
        			});
        			$("#configue-"+j).click({int:j}, function(event){
        				configue(event.data.int);
        			});
        			$("#mode-"+j).click({int:j}, function(event){
        				mode(event.data.int);
        			});
        			getprjmode(j);
        		}
        		setPageBar(page,json.totalPage,pageSize);
			} else {
				alert("serviceName is Null or not exist.");
			};
		},
	});
}

$(document).ready(function(){
	//初始化显示
    get_task(1,10);
    
   

    
});


