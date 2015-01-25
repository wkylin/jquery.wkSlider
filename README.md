jquery.wkSlider
===============

jQuery图片轮播(焦点图)插件jquery.wkSlider


jquery.wkSlider相关介绍

---

 1. RequireJS模块化管理;
 2. 兼容IE6+，Chrome，Firefox，Opera，safari;
 3. 可左右，可快可慢，可指定默认显示第N张，支持放大镜，多参数自由设定;
 4. 代码简洁，运行效率高，用户体验良好:)
 

相关默认参数：

---

    $.fn.wkSlider.defaults = {
        fullScreen: false, //是否全屏展示
        offsetSize: 1, //移动距离，默认一个图片的宽度
        showSize: 1, //可视区域显示图片数量
        itemPadding: 0,//图片之间的边距
        auto: true, //是否自动播放
        curPage: 1, //默认加载哪一张图片
        speed: 600, //滑动速度 
        interval: 2000,//间隔时间
        direction: "left",//移动方向 可指定为 right
        type: "rectangle", // 类型显示方式 可以指定为 dot或figure
        showAlt: false, //是否显示图片alt说明文案
        showArrow: true, //是否默认显示左右方向箭头
        hoverShowArrow: true, //是否悬停时显示左右方向箭头
        showAmount: false, //是否显示图片总数及当前哪一张
        azimuth: "top",  // 说明文案及箭头显示方位 
        showType: true, // 是否显示类型
        typePosition: "inner", //显示方位
        magnifier: {
            "isShow": false, //是否支持放大镜
            "isMark": true, //是否需要蒙板
            "azimuth": "left", //放大区域的方位
            "magWidth": "100", //可以拖动放大镜的宽度
            "magHeight": "100" //可以拖动放大镜的高度
        }
    };


版权声明：

---

1. 自由转载-保持署名（创意共享3.0许可证）
