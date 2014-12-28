// 为requirejs 模块名做全局配置
// 此处配置与打包配置无关（官方解释）
// 打包配置，需要重写，写在了gruntfile.js中
// 请保持两处命名一致
requirejs.config({
    baseUrl: './js',
    paths: {
        'jquery': 'libs/jquery-1.8.2',
        'slider': 'app/jquery.slider'
    }
});
// 非AMD模块配置
requirejs.config({
    shim: {
        'slider': {
            deps: ['jquery'],
            exports: 'jQuery.fn.slider'
        }
    }
});

requirejs([ 'jquery', 'slider'], function ($) {
    $(function () {

        $('#J_Slider').wkSlider({
            type: 'figure',
            direction: "left",
            showArrow: true,
            hoverShowArrow:true,
            auto: false,
            showAmount:false,
            showType:true,
            typePosition: "outer",
            magnifier:{
                "isShow":true
            }
        });

        $('#J_SliderText').wkSlider({
            showArrow: false,
            showType:false,
            typePosition: "outer"
        });
    });
});

