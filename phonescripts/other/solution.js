var baseUrl = "https://mobile.letsun.com.cn/letsun/gw/json/";
var id;

$(function () {
	//右上角按钮切换
	$(".header .nav-wra .nav-btn").click(function () {
		$(".header .nav-wra .nav-btn .old-img").toggle();
		$(".header .nav-wra .nav-btn .new-img").toggle();
		$(".header .nav-list").slideToggle();
	})

	// 点击tab切换成不同行业

	$("#container").on('click', '.icon-wrap', function () {
		let index = $(this).index();
		let id = $(this).attr('data-id');
		planSolution(id,index);
	})


	$.ajax({
		url: baseUrl + "navCon", // 数据接口
		type: 'GET',
		success: function (res) {
			if (res.code === '200') {
				var id = res.result.jiejfaList[0].id;
				var index  = 0;
				planSolution(id,index)
			}
		}
	});


	function planSolution(id,index) {
		$.ajax({
			url: baseUrl + "planSolution/" + id, // 数据接口
			type: 'GET',
			success: function (res) {
				if (res.code === '200') {
					var solutionList = res.result.solutionList;
					var industryNeed = res.result.industryNeed;
					var html = '';
					for (var i = 0; i < solutionList.length; i++) {
						html += '<div class="icon-wrap" data-id= "' + solutionList[i].id + '">';
						if (index == i) {
							html += '<img class="icon" src="' + solutionList[i].icon2 + '">';
						} else {
							html += '<img class="icon" src="' + solutionList[i].icon1 + '">';
						}

						html += '<div class="icon-text"> ' + solutionList[i].name + '</div>';
						html += '</div>';
					}

					var html1 = '';
					for(var i = 0 ; i < industryNeed.length; i++) {
						html1 += '<li class="icon-text"> ' + industryNeed[i] + '</li>';
					}

					
					$('.toggle-icon-wrap').html(html);
					$('.right-info').html(html1)
					$('#bgImg').attr("src",res.result.bgImg)
					$('#title').html(res.result.title);
					$('#desc').html(res.result.desc);
					$('#policyReq').html(res.result.policyReq);
					$('#planUs').html(res.result.planUs)
				}
			}
		});

	}




})

