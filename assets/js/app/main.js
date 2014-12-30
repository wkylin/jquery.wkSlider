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

        $('#J_Slider').wkSlider({
            type: 'figure',
            showType:true,
            typePosition: "outer",
            magnifier:{
                "isShow":true,
                "azimuth":"left",
                "magWidth":"150",
                "magHeight":"100"
            }
        });

        $('#J_mySlider').wkSlider({
            type: 'figure',
            direction: "left",
            showArrow: true,
            hoverShowArrow:true,
            auto: false,
            showAmount:false,
            showType:true,
            typePosition: "outer",
            magnifier:{
                "isShow":true,
                "isMark":false
            }
        });

        $('#J_SliderText').wkSlider({
            showArrow: false,
            showType:false,
            typePosition: "outer",
            auto:false
        });
    });
});

