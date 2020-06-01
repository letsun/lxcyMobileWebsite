//var baseUrl = "http://test-iwsct2.ebiaoji.com/letsun/gw/json/";
// var baseUrl = "http://192.168.1.27:8081/letsun/gw/json/";
var baseUrl = "https://mobile.letsun.com.cn/letsun/gw/json/";

var data; // 页面详情数据
$(function() {
	//右上角按钮切换
	$(".header .nav-wra .nav-btn").click(function() {
		$(".header .nav-wra .nav-btn .old-img").toggle();
		$(".header .nav-wra .nav-btn .new-img").toggle();
		$(".header .nav-list").slideToggle();
	})

	// 填写信息关闭按钮
	$('.close-demand').on('click', function() {
		$('.demand-win').hide();
	})
	
	// tab切换
	$('.tab-item').on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');
		let index = $(this).index();
		// console.log(index)
		if(index == 0 || index == 1 || index == 2){
			window.location.href = 'phonecaseList.html';
		}else {
			$('.demand-win').show();
		}
	})

	// 获取路径参数
	var search = window.location.search;//获取参数 
	var id = getSearchString('id', search); //结果：2
	// console.log(id)
	//key(需要检索的键） url（传入的需要分割的url地址，例：?id=2&age=18）
	function getSearchString(key, Url) {
	    var str = Url;
	    str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
	    // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
	    var arr = str.split("&");
	    var obj = new Object();
	    // 将每一个数组元素以=分隔并赋给obj对象
	    for (var i = 0; i < arr.length; i++) {
	        var tmp_arr = arr[i].split("=");
	        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
	    }
	    return obj[key];
	}
	
	// 点击公司新闻和行业动态
	$('.nav-item').on('click',function(){
		window.location.href = 'phonenews.html';
	})
	
	// 点击prev-btn上一个案例
	$('.span2').on('click',function(){
		id = $(this).attr('data-id');
		init();
	})
	
	// 相关新闻 related-title
	$('.related-list').on('click','.related-title',function(){
		id = $(this).attr('data-id');
		console.log(id)
		init();
	})
	
	
	init();
	// 初始化列表数据
	function init() {
		$('#case-list').html('');
		
		// 初始化数据
		$.ajax({
			url: baseUrl + 'newsDetail/' + id, // 类型（1为 公司新闻，2为 行业动态）pageIndex 请求页码 num 每页展示数量
			type: 'GET',
			success: function(res) {
				// console.log(res.result)
				if (res.code === '200') {
					data = res.result;
					correlationNews = data.correlationNews;

					$('.news-time').html(data.publishTime);  // 缩略图
					$('.news-title').html(data.title);	
					$('.news-browse').find('span').html(data.browseNum);
					$('.news-dec').html(data.content);
					
					// 上一页
					$('.pre-title').html(data.prevInfo.title).attr('data-id',data.prevInfo.id);
	
					// 下一页
					$('.next-title').html(data.nextInfo.title).attr('data-id',data.nextInfo.id);
					
					// 相关新闻
					render(correlationNews);
				} else {
					common.alert({
						content: res.msg,
						mask: true
					});
				}
			}
		});
	}
	
	/**
	 * 渲染数据
	 * @param  object data 需要的数据
	 * @return null
	 */
	function render(data) {
		var html = '';
		for (var i = 0; i < data.length; i++) {
			html+= '<div class="related-item">'
			html+= '    <div class="related-title" data-id=' + data[i].id + '>' + data[i].title + '</div>'
			html+= '    <div class="related-bottom">'
			html+= '        <div class="related-browse">' +  data[i].browseNum + '人浏览</div>'
			html+= '        <div class="related-time">' +  data[i].publishTime + '</div>'
			html+= '    </div>'
			html+= '</div>'
		}
	
		$('.related-list').append(html);
	}
	
});
