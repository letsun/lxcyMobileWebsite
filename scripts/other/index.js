$(function () {

    // 禁止页面滚动
    $('#container').on('touchmove',function (e) {
        e.preventDefault();
    });
});
