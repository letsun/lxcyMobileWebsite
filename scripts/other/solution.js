$(function(){
	//右上角按钮切换
	$(".header .nav-wra .nav-btn").click(function() {
		$(".header .nav-wra .nav-btn .old-img").toggle();
		$(".header .nav-wra .nav-btn .new-img").toggle();
		$(".header .nav-list").slideToggle();
	})
	
	// 点击tab切换成不同行业
	$(".icon-wrap").click(function() {
		let index = $(this).index();
		
		$('.module').hide().eq(index).show();
	})
	
})

