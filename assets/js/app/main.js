// 为requirejs 模块名做全局配置

requirejs.config({
    baseUrl: './js',
    paths: {
        'jquery': 'libs/jquery-1.8.2',
        'wkSlider': 'app/jquery.wkSlider'
    }
});
// 非AMD模块配置
requirejs.config({
    shim: {
        'wkSlider': {
            deps: ['jquery'],
            exports: 'jQuery.fn.wkSlider'
        }
    }
});

requirejs([ 'jquery', 'wkSlider'], function ($) {
     $(function () {
        $('#J_mySlider').wkSlider({
            type: 'figure',
            direction: "left",
            showArrow: true,
            hoverShowArrow:false,
            auto: true,
            showAlt:false,
            showAmount:true,
            showType:false,
            azimuth:"top",
            typePosition: "outer",
            magnifier:{
                "isShow":true,
                "isMark":true
            }
        });
    });
});

