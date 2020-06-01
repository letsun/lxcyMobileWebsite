//var baseUrl = "http://test-iwsct2.ebiaoji.com/letsun/gw/json/";
// var baseUrl = "http://192.168.1.27:8081/letsun/gw/json/";
var baseUrl = "https://mobile.letsun.com.cn/letsun/gw/json/";

var data; // 页面详情数据
var messageList = []; // 留言信息列表

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
			window.location.href = 'caseList.html';
		}else {
			$('.demand-win').show();
		}
	})
	
	// tab切换
	$('.check-item').on('click', function() {
		
		$(this).addClass('active').siblings().removeClass('active');
		budget = $(this).find('.check-text').html();
	})
	
	// select-item选中留言内容
	$('.select-item').on('click', function() {
		var itemValue = $(this).html();
		
		if($(this).hasClass('multi-active')){
			$(this).removeClass('multi-active');
	
			for(var i=0;i<messageList.length;i++){
				if(messageList[i] == itemValue) {
					messageList.splice(i, 1);
				}
			}
			// console.log(messageList);
		}else{
			$(this).addClass('multi-active');
			messageList.push(itemValue);
			// console.log(messageList);
		}
		
	})
	
	// 点击提交需求 submit-btn
	$('.submit-btn').on('click', function() {
		let company = $('.company').val();
		let email = $('.email').val();
		let name = $('.name').val();
		let mobile = $('.mobile').val();
		let comment = messageList.join(',');
		console.log(comment)
		
		if(company == ''){
			common.alert({
				content: '请填写您的公司名称',
				mask: true
			});
			return
		} else if(email == ''){
			common.alert({
				content: '请填写您的邮箱',
				mask: true
			});
			return
		} else if(name == ''){
			common.alert({
				content: '请填写您的姓名',
				mask: true
			});
			return
		} else if(mobile == ''){
			common.alert({
				content: '请填写您的电话号码',
				mask: true
			});
			return
		}
	
		var length = $('.check-item').length;
		for(var i=0;i<length;i++){
			let index = $('.check-item').eq(i).index();
			if($('.check-item').eq(index).hasClass('active')){
				budget = $('.check-item').eq(i).find('.check-text').html();
			}
		}
		
		// 提交需求
		$.ajax({
			url: baseUrl + 'requirementData', // type类型（1为 全部案例，2为 智慧营销，3为追踪溯源）pageIndex 请求页码 num 每页展示数量
			type: 'POST',
			data: {
				name: name,
				mobile: mobile,
				email: email,
				company: company,
				budget: budget,
				comment: comment
			},
			success: function(res) {
				var data = JSON.parse(res);
				if (data.code == 200) {
					common.alert({
						content: '信息提交成功',
						mask: true
					});
					$('.demand-win').hide();
					
					$('.company').val('');
					$('.email').val('');
					$('.name').val('');
					$('.mobile').val('');
					$('.check-item').removeClass('active').eq(0).addClass('active');
					$('.select-item').removeClass('multi-active');
					messageList = [];
				} else {
					common.alert({
						content: data.msg,
						mask: true
					});
				}
			}
		});
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
	
	// 点击prev-btn上一个案例
	$('.prev-btn').on('click',function(){
		id = data.prevInfo.id;
		init();
	})
	
	// 点击next-btn下一个案例
	$('.next-btn').on('click',function(){
		id = data.nextInfo.id;
		init();
	})
	
	init();
	// 初始化列表数据
	function init() {
		$('#case-list').html('');
		
		// 初始化数据
		$.ajax({
			url: baseUrl + 'caseDetail/' + id, // type类型（1为 全部案例，2为 智慧营销，3为追踪溯源）pageIndex 请求页码 num 每页展示数量
			type: 'GET',
			success: function(res) {
				// console.log(res.result)
				if (res.code === '200') {
					data = res.result;

					$('.info-img').attr('src',data.thumbnail);  // 缩略图
					$('.info-title').html(data.title);	
					$('.service-dec').html(data.serviceDesc);
					$('.info-dec').html(data.desc);

					$('.info-bottom').html(data.content)
				} else {
					common.alert({
						content: res.msg,
						mask: true
					});
				}
			}
		});
	}

});
