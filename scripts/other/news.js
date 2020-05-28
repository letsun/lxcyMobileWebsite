//var baseUrl = "http://test-iwsct2.ebiaoji.com/letsun/gw/json/";
// var baseUrl = "http://192.168.1.27:8081/letsun/gw/json/";
var baseUrl = "https://mobile.letsun.com.cn/letsun/gw/json/";

var caseNum; // 总数据量
var type = 1; // 类型（1为 公司新闻，2为 行业动态）
var searchValue; // 输入框输入的值

$(function() {
	// 禁止页面滚动
	$('#container').on('touchmove',function (e) {
	    e.preventDefault()
	});
	
	// 点击搜索
	$('#form-btn').on('click',function(){
		searchValue = $('#searchVal').val();
		console.log(searchValue);
		if(searchValue == ''){
			common.alert({
				content: '请输入您想要了解的关键词',
				mask: true
			});
			return
		}
		search();
	})
	
	// 点击热点新闻标题
	$('.hotNews-title').on('click',function(){
		let id = $(this).attr('data-id');
		window.location.href = 'newsDetail.html?id=' + id;
	})
	
	// 点击tab
	$('.nav-item').on('click',function(){
		$(this).addClass('active').siblings().removeClass('active');
		let index = $(this).index();
		
		if(index == 0){
			type = 1;
			init();
		}else{
			type = 2;
			init();
		}
	})

	init();
	// 初始化列表数据
	function init() {
		$('#case-list').html('');
		let page = 1;
		// 初始化数据 newsList/{type}/{pageIndex}/{num}
		$.ajax({
			url: baseUrl + 'newsList/' + type + '/' + page + '/' + 10, // type类型（1为 全部案例，2为 智慧营销，3为追踪溯源）pageIndex 请求页码 num 每页展示数量
			type: 'GET',
			success: function(res) {
				// console.log(res.result)
				if (res.code === '200') {
					var data = res.result;
					// caseNum = data.caseNum;
					
					$('.hotNews-title').html(data.hotNews[0].title).attr('data-id',data.hotNews[0].id);
					$('.hotNews-dec').html(data.hotNews[0].desc);
					$('.hotNews-time').html(data.hotNews[0].publishTime);
					$('.hotNews-browse').find('span').html(data.hotNews[0].browseNum);
					
					render(data.newsList);
					if (data.newsList.length >= 10) {
						$('#loading').show();
					}

					$('#loadingWrapper').hide();
				} else {
					common.alert({
						content: res.msg,
						mask: true
					});
				}
			}
		});
	}
	
	// 输入框搜索
	function search() {
		$('#case-list').html('');
		let page = 1;

		$.ajax({
			url: baseUrl + 'newsSearch/' + type + '/' + page + '/' + 10 + '?content=' + searchValue, // 类型（1为 公司新闻，2为 行业动态）pageIndex 请求页码 num 每页展示数量
			type: 'GET',
			success: function(res) {
				// console.log(res.result)
				if (res.code === '200') {
					var data = res.result;
					// caseNum = data.caseNum;
					
					$('#list').html('');
					render(data.newsList);
					if (data.newsList.length >= 10) {
						$('#loading').show();
					}
	
					$('#loadingWrapper').hide();
				} else {
					common.alert({
						content: res.msg,
						mask: true
					});
				}
			}
		});
	}

	var hasNext = true; // 是否有下一页
	var page = 1;

	var scrollWra = new BScroll('#container', {
		scrollbar: {
			fade: true
		},
		click: true,
		pullUpLoad: {
			threshold: 0
		}
	});

	scrollWra.on('pullingUp', () => {
		// if(page * 10 >= caseNum){
		// 	hasNext = false;
		// }
		
		// if (!hasNext) {
		// 	$('#loading').text('已经没有更多了');
		// 	return;
		// }
		// $('#loading').text('正在加载中...');

		page++;
		
		// 拉取数据
		$.ajax({
			url: baseUrl + 'newsList/' + type + '/' + page + '/' + 10, // type类型（1为 全部案例，2为 智慧营销，3为追踪溯源）pageIndex 请求页码 num 每页展示数量
			type: 'GET',
			success: function(res) {
				// console.log(res.result)
				if (res.code === '200') {
					var data = res.result;
					caseNum = data.caseNum;
			
					// hasNext = data.hasNext;
					render(data.newsList);
					if (data.newsList.length >= 10) {
						$('#loading').show();
					}
	
					$('#loadingWrapper').hide();
				} else {
					common.alert({
						content: res.msg,
						mask: true
					});
				}
			}
		});
		
	});

	/**
	 * 渲染数据
	 * @param  object data 需要的数据
	 * @return null
	 */
	function render(data) {
		var html = '';
		for (var i = 0; i < data.length; i++) {
			html+= '<a class="item" href="newsDetail.html?id=' + data[i].id + '">'
			html+= '    <div class="item-infor">'
			html+= '        <div class="item-title">' + data[i].title + '</div>'
			html+= '        <div class="item-dec">' + data[i].desc + '</div>'
			
			html+= '        <div class="item-bottom">'
			html+= '            <div class="item-time">' + data[i].publishTime + '</div>'
			html+= '           <div class="item-browse"><span>' + data[i].browseNum + '</span>人浏览</div>'
			html+= '            <div class="item-share">'
			html+= '                <img class="share-key" src="../images/1_52.png" alt="">'
			html+= '                <div class="share-val">分享</div>'
			html+= '            </div>'
			html+= '        </div>'
			html+= '    </div>'
			html+= '    <div class="item-img">'
			html+= '        <img src="' + data[i].thumbnail + '" alt="">'
			html+= '    </div>'
			html+= '</a>'
		}

		$('#list').append(html);

		scrollWra.finishPullUp();
		scrollWra.refresh();
	}

});
