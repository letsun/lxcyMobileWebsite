//var baseUrl = "http://test-iwsct2.ebiaoji.com/letsun/gw/json/";
// var baseUrl = "http://192.168.1.27:8081/letsun/gw/json/";
var baseUrl = "https://mobile.letsun.com.cn/letsun/gw/json/";

var type = 2; // 类型（1为 公司新闻，2为 行业动态）
var budget; // 预算
var messageList = []; // 留言信息列表

$(function() {
	//右上角按钮切换
	$(".header .nav-wra .nav-btn").click(function() {
		$(".header .nav-wra .nav-btn .old-img").toggle();
		$(".header .nav-wra .nav-btn .new-img").toggle();
		$(".header .nav-list").slideToggle();
	})
	
	// 后台上传的轮播图
	$.ajax({
		url: baseUrl + "banner", // 数据接口
		type: 'GET',
		success: function(res) {
			if (res.code === '200') {
				var data = res.result.homeImgList;
				console.log(data)

				var html = '';
				for (var i = 0; i < data.length; i++) {
					html += '<div class="swiper-slide">'
					html += '<a href="' + data[i].url + '"><img src="' + data[i].imgUrl + '" alt=""></a>'
					html += '</div>'
				}
				$('.swiper-wrapper').append(html);

				// 初始化banner
				var swiper = new Swiper('.swiper-container', {
					loop: true,
					autoplay: 2000,
					pagination: '.swiper-pagination',
				});
			} else {
				common.alert({
					content: res.msg,
					mask: true
				});
			}
		}
	});

	//智慧营销选项卡
	$(".module2 .tab-wrap .tab-title li").click(function() {
		$(this).addClass("active").siblings().removeClass("active");
		$(".module2 .tab-wrap .tab-content li").hide().eq($(this).index()).show();
	});

	//新闻动态选项卡
	$(".module3 .news-tab .news-title").click(function() {
		$(this).addClass("active").siblings().removeClass("active");

		if ($(".module3 .news-tab .news-title").eq(0).hasClass("active")) {
			$(".module3 .news-tab .news-title .title-icon1").hide();
			$(".module3 .news-tab .news-title .title-icon2").show();

			type = 1;
			indexNews();
		} else {
			$(".module3 .news-tab .news-title .title-icon1").show();
			$(".module3 .news-tab .news-title .title-icon2").hide();

		}

		if ($(".module3 .news-tab .news-title").eq(1).hasClass("active")) {
			$(".module3 .news-tab .news-title .title-icon3").hide();
			$(".module3 .news-tab .news-title .title-icon4").show();
			type = 2;
			indexNews();
		} else {
			$(".module3 .news-tab .news-title .title-icon3").show();
			$(".module3 .news-tab .news-title .title-icon4").hide();

		}

	})

	//视频播放
	$(".poster-btn").click(function() {
		$(".poster-wrap").hide();
		$(".video-wrap .video-player").trigger("play");

		$(".video-wrap .video-player").on("ended", function() {
			$(".poster-wrap").show();
		})

	})


	// 首页客户案例列表
	$.ajax({
		url: baseUrl + "caseList", // 数据接口
		type: 'GET',
		success: function(res) {
			if (res.code === '200') {
				var caseList = res.result.caseList;

				var html = '';
				for (var i = 0; i < caseList.length; i++) {
					if (i <= 13) {
                        html += '<li>'
                        html += '	<img src="' + caseList[i].imgUrl + '">'
                        html += '	<div class="demo-img-content">' + caseList[i].title + '</div>'
                        html += '</li>'
					}

				}
				$('.demo-img-list').append(html);
			} else {
				common.alert({
					content: res.msg,
					mask: true
				});
			}
		}
	});
	
	// 填写信息关闭按钮
	$('.close-demand').on('click', function() {
		$('.demand-win').hide();
	})
	
	// 申请试用按钮
	$('.apply-btn').on('click', function() {
		$('body').css('overflow','hidden');
		$('.demand-win').show();
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
				} else {
					common.alert({
						content: data.msg,
						mask: true
					});
				}
			}
		});
	})


	indexNews();

	function indexNews() {
		// 首页新闻列表
		$.ajax({
			url: baseUrl + "indexNews/" + type, // 数据接口
			type: 'GET',
			success: function(res) {
				if (res.code === '200') {
					$('.news-list').html('');
					var hotNews = res.result.hotNews;
					var newsList = res.result.newsList;

					var html = '';
					html += '<li>'
					html += '	<div class="news-title">' + hotNews[0].title + '</div>'
					html += '	<div class="news-desc">' + hotNews[0].desc + '</div>'
					html += '	<img class="hot-img" src="' + hotNews[0].thumbnail + '">'
					html += '	<div class="data-share">'
					html += '		<span class="news-date">' + hotNews[0].publishTime + '</span>'
					html += '		<span class="times">' + hotNews[0].browseNum + '人浏览</span>'
					html += '		<span class="share"><img src="../images/1_52.png">分享</span>'
					html += '	</div>'
					html += '</li>'

					for (var i = 0; i < 3; i++) {
						html += '<li>'
						html += '	<div class="news-title">' + newsList[i].title + '</div>'
						html += '	<div class="news-content">' + newsList[i].desc + '</div>'
						html += '	<img src="' + newsList[i].thumbnail + '" class="news-img">'
						html += '	<div class="data-share">'
						html += '		<span class="news-date">' + newsList[i].publishTime + '</span>'
						html += '		<span class="times">' + newsList[i].browseNum + '人浏览</span>'
						html += '		<span class="share"><img src="../images/1_52.png">分享</span>'
						html += '	</div>'
						html += '</li>'
					}
					$('.news-list').append(html);
				} else {
					common.alert({
						content: res.msg,
						mask: true
					});
				}
			}
		});
	}
})
