
function setPageJump(page,pageSize){
	$("#pageJump-"+page).click(function(){
		get_task(page,pageSize);
	});
}
function setPagePrev(page,pageSize){
	$("#prevPage").click(function(){
		get_task(page,pageSize);
	});
}
function setPageNext(page,pageSize){
	$("#prevNext").click(function(){
		get_task(page,pageSize);
	});
}
function setPageSelect(pageSize,totalPage){
	$("#pageSelect").click(function(){
		var page = $("#textAppend").val();
		if($.isNumeric(page) && page<=totalPage){
			page = parseInt(page);
			get_task(page,pageSize);
		}
	});
	
}


function setPageBar(page,totalPage,pageSize){
	$("#setPage").empty();
	if(page-1 == 0){
		$("#setPage").append(
				'<li class="disabled"><a>«上一页</a><li>'		
		);
	}else{
		$("#setPage").append(
				'<li><a id="prevPage">«上一页</a><li>'		
		);
		setPagePrev(page-1, pageSize);
	}
	
	var pageMaxOutput = 5;
	var startPage = page - Math.floor(pageMaxOutput/2);
	startPage = startPage<1?1:startPage;
	var endPage = page + Math.floor(pageMaxOutput/2);
	endPage = endPage>totalPage?totalPage:endPage;
	var curPage = endPage - startPage + 1;
	if(curPage < pageMaxOutput && startPage>1){
		startPage = startPage-(pageMaxOutput - curPage);
		startPage = startPage<1 ? 1:startPage;
		curPage = endPage - startPage + 1;
	}
	if(curPage < pageMaxOutput && endPage<totalPage){
		endPage = endPage + (pageMaxOutput-curPage);
		endPage = endPage>totalPage?totalPage : endPage;
	}
	for(var j=startPage; j<=endPage; j++){
		if(j == page){
			$("#setPage").append(
					'<li class="active"><a id="pageJump-'+(j)+'">'+j+'</a></li>'
			);
		}else{
				
			$("#setPage").append(
					'<li> <a id="pageJump-'+(j)+'">'+j+'</a></li>'
			);
		
		}
		setPageJump(j,pageSize);
	}
	
	if(page == totalPage){
		$("#setPage").append(
				'<li class="disabled"><a>下一页»</a><li>'		
		);
	}else{
		$("#setPage").append(
				'<li><a id="prevNext">下一页»</a><li>'		
		);
		setPageNext(page+1, pageSize);
	}
	$("#setPage").append(
			'<li style="margin-left:20px">共'+totalPage+'页,到<input type="field" id="textAppend" class="textappend"></li>'
	);
	$("#textAppend").focus(function(){
		$("#textAppend").css("width","80px");
	});
	$("#setPage").append(
			'<li><button class="pageSelect" id="pageSelect">确定</button></li>'
			+'<span>页</span>'
	);
	setPageSelect(pageSize,totalPage);
}

