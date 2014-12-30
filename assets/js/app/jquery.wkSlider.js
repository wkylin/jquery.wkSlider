/**
 * 已知Bug 暂无
 */
;
(function ($) {
    $.fn.wkSlider = function (options) {

        var opts = $.extend(true,{}, $.fn.wkSlider.defaults, options);
        var pageNum = opts.curPage;
        return this.each(function () {
            var scrollTimer;
            var $slider = $(this);
            var $sliderView = $slider.find(".arrow-slider");
            var $sliderItem = $slider.find("li");
            var $sliderUl = $slider.find("ul:first");
            var len = $sliderUl.find("li").size();
            var mo = len % opts.offsetSize;
            var num = opts.offsetSize - mo;

            //不足1页时自动补足
            if (mo != 0 || len < opts.showSize) {
                $sliderUl.find("li:lt(" + num + ")").clone().appendTo($sliderUl);
            }

            //设置移动宽度不能大于显示总宽度
            if (opts.offsetSize > opts.showSize) {
                opts.offsetSize = opts.showSize;
            }

            //设置显示个数不能大于总个数
            if (opts.showSize > len) {
                opts.showSize = len;
            }

            var totalSize = $sliderUl.find("li").size();
            var width = ($sliderItem.width() + opts.itemPadding) * opts.showSize - opts.itemPadding;

            $sliderUl.find("li").css({"padding-right": opts.itemPadding}).each(function (index, ele) {
                $(ele).attr("data-item", "item" + index);
            });
            // $sliderUl.find("li:first").addClass("cur");
            if (opts.fullScreen) {
                fullPage();
                $sliderUl.find("li").each(function () {
                    var imgSrc = $(this).find("img").attr("src");
                    var temSrc = imgSrc.substring(imgSrc.indexOf('image'));
                    $(this).find("img").hide();
                    $(this).css({"background": 'url(' + temSrc + ') center top no-repeat transparent'});
                });
                $(window).resize(function () {
                    fullPage();
                });
            } else {
                $sliderUl.width(($sliderItem.width() + opts.itemPadding) * totalSize).height($sliderItem.height());
                $sliderView.height($sliderItem.height()).width(width);
                $slider.width(width);
            }

            //显示类型
            $slider.addClass("slider-" + opts.type).addClass("slider-" + opts.typePosition);

            //总数及页数
            var $currentPage;

            //if (opts.offsetSize == opts.showSize ) {

            $('<div class="slider-total"><span class="slider-current-page">' + pageNum + '</span>/<span class="slider-items">' + totalSize / opts.offsetSize + '</span></div>').appendTo($slider);
            if (opts.showAmount) {
                $slider.find($(".slider-total")).css({"display": "block"});
            } else {
                $slider.find($(".slider-total")).css({"display": "none"});
            }

            //图片说明性文案
            var showAlt = function () {
                $.each($sliderUl.find("li"), function (key, slide) {
                    var $img = $(slide).find('img');
                    var caption = $img.attr('alt');
                    if (caption && opts.showAlt) {
                        caption = $('<div class="slider-tips">' + caption + '</div>');
                        caption.appendTo($(slide)).width($img.width());
                    }
                });
            }();

            if (opts.showType && !opts.showAlt) {

                //showType==true 时隐藏
                $slider.find($(".slider-total")).css({"display": "none"});

                //showSize为1时才显示 showType
                if (opts.showSize == 1) {
                    var markers = function () {
                        var marker = [];
                        marker.push('<div class="slider-markers-box"><ul class="slider-markers">');

                        for (var i = 0; i < len; i++) {
                            marker.push('<li>' + (i + 1) + '</li>');
                        }
                        marker.push('</ul></div>');
                        $slider.append(marker.join(''));
                        $($slider.find(".slider-markers li").eq(opts.curPage - 1)).addClass("active-marker");

                        // mouseover
                        $slider.find(".slider-markers").delegate("li", "mouseover", function () {
                            clearInterval(scrollTimer);
                        });

                        //click
                        $slider.find(".slider-markers").delegate("li", "click", function () {

                            var index = $(this).index(); // 顺序排位置

                            if (!$sliderUl.is(":animated") && index != "undefind") {
                                var ind = $sliderUl.find("li[data-item$=" + index + "]").index(); // 目标元素当前dom中的位置

                                var curInd = parseInt($sliderUl.find("li").eq(0).data("item").match(/\d+/)[0]); // 当前显示的dom
                                if (index === curInd) {
                                    return;
                                }
                                if (index > curInd) {
                                    $sliderUl.stop().animate({ left: '-=' + $sliderItem.outerWidth(true) * ind}, opts.speed, function () {
                                        $sliderUl.css({"left": 0}).find("li").slice(0, ind).appendTo($sliderUl);
                                        //$sliderUl.find("li").removeClass("cur");
                                        //$sliderUl.find("li:first").addClass("cur");

                                        //放大镜效果
                                        if (options.typePosition == "outer" && opts.showSize==1) {
                                            if(opts.magnifier.isShow){
                                                magnifier();
                                            }
                                        }
                                    });
                                } else {
                                    var $toBeMoved = $sliderUl.find("li").slice(ind, len);
                                    $toBeMoved.prependTo($sliderUl);
                                    $sliderUl.css({"left": "-=" + $sliderItem.outerWidth(true) * $toBeMoved.length});
                                    $sliderUl.stop().animate({"left": 0}, opts.speed, function () {
                                        //$sliderUl.find("li").removeClass("cur");
                                        // $sliderUl.find("li:first").addClass("cur");

                                        //放大镜效果
                                        if (options.typePosition == "outer" && opts.showSize==1) {
                                            if(opts.magnifier.isShow){
                                                magnifier();
                                            }
                                        }
                                    });
                                }
                            }

                            $(this).siblings().removeClass("active-marker").end().addClass("active-marker");
                            $slider.find(".slider-current-page").text(index + 1);
                            pageNum = parseInt($slider.find(".slider-current-page").text());
                        });

                        //mouseout
                        $slider.find(".slider-markers").delegate("li", "mouseout", function () {
                            if (!opts.auto) {
                                clearInterval(scrollTimer);
                            } else {
                                scrollTimer = setInterval(function () {
                                    sliderBox($sliderView);
                                }, opts.interval);
                            }
                        });
                    }();
                }
            }


            //默认显示第几页
            $sliderUl.animate({ left: '-=' + $sliderItem.outerWidth(true) * opts.offsetSize * (opts.curPage - 1)}, 0, function () {
                $sliderUl.css({"left": 0}).find("li:lt(" + opts.offsetSize * (opts.curPage - 1) + ")").appendTo($sliderUl);
            });

            //轮播
            $sliderView.parents(".arrow-slider-content").hover(function () {
                clearInterval(scrollTimer);
            }, function () {
                if (!opts.auto) {
                    clearInterval(scrollTimer);
                } else {
                    scrollTimer = setInterval(function () {
                        sliderBox($sliderView);
                    }, opts.interval);
                }
            });


            //是否显示箭头
            if (opts.showArrow) {
                showArrow();
                //只有一页时取消绑定事件
                if (len == opts.offsetSize || len == opts.showSize) {
                    opts.auto = false;
                    $slider.find(".arrow-slider-left").unbind("click").unbind("mouseover");
                    $slider.find(".arrow-slider-right").unbind("click").unbind("mouseover");
                }
            }

            //是否自动
            if (opts.auto) {
                $sliderView.trigger("mouseleave");
            }

            //放大镜效果
            if (options.typePosition == "outer" && opts.showSize==1) {
                if(opts.magnifier.isShow){
                    magnifier();
                }
            }


            // 全屏显示
            function fullPage() {
                $slider.width($(window).width());
                $sliderUl.width(($sliderItem.width() + opts.itemPadding) * totalSize).height($sliderItem.height());
                $sliderView.height($sliderItem.height()).width($(window).width());
                $sliderUl.find("li").height($sliderItem.height()).width($(window).width())
            }

            //显示Arrow
            function showArrow() {
                var showArrowMarkup = '<div class="arrow-slider-left">left</div>' + '<div class="arrow-slider-right">right</div>';
                $(showArrowMarkup).appendTo($slider);
                var $prevBtn = $slider.find(".arrow-slider-left");
                var $nextBtn = $slider.find(".arrow-slider-right");

                var arrowTop = parseInt(($sliderItem.height() - $prevBtn.height()) / 2);

                if (opts.typePosition == "inner") {
                    $prevBtn.css({"top": arrowTop, "left": $prevBtn.width() / 3});
                    $nextBtn.css({"top": arrowTop, "right": $prevBtn.width() / 3});
                } else if (opts.typePosition == "outer") {
                    $prevBtn.css({"top": arrowTop, "left": -$prevBtn.width() * 1.5});
                    $nextBtn.css({"top": arrowTop, "right": -$prevBtn.width() * 1.5});
                }


                //显示左右箭头
                if(opts.showArrow){
                    //悬停出现左右箭头
                    if(opts.hoverShowArrow){
                        if (options.typePosition == "inner") {
                            $slider.hover(function () {
                                hideArrowForOne($prevBtn,$nextBtn);
                            }, function () {
                                $prevBtn.hide();
                                $nextBtn.hide();
                            });
                        }
                    }else{
                        hideArrowForOne($prevBtn,$nextBtn);
                    }
                }



                //绑定mouseover
                $prevBtn.bind("mouseover", function () {
                    $(this).addClass("arrow-slider-left-hover");
                    clearInterval(scrollTimer);
                }).bind("mouseout", function () {
                    $(this).removeClass("arrow-slider-left-hover");

                    if (!opts.auto) {
                        clearInterval(scrollTimer);
                    } else {
                        scrollTimer = setInterval(function () {
                            sliderBox($sliderView);
                        }, opts.interval);
                    }

                });

                //绑定mouseover
                $nextBtn.bind("mouseover", function () {
                    $(this).addClass("arrow-slider-right-hover");
                    clearInterval(scrollTimer);
                }).bind("mouseout", function () {
                    $(this).removeClass("arrow-slider-right-hover");
                    if (!opts.auto) {
                        clearInterval(scrollTimer);
                    } else {
                        scrollTimer = setInterval(function () {
                            sliderBox($sliderView);
                        }, opts.interval);
                    }
                });

                //向左 按钮 向右移动
                $prevBtn.click(function () {
                    if (!$sliderUl.is(":animated")) {
                        $sliderUl.find("li").slice(len - opts.offsetSize, len).insertBefore($sliderUl.find("li:first"));
                        $sliderUl.css({left: '-=' + $sliderItem.outerWidth(true) * opts.offsetSize});
                        $sliderUl.animate({left: '+=' + $sliderItem.outerWidth(true) * opts.offsetSize}, opts.speed, function () {
                            $sliderUl.css({"left": 0});
                            //放大镜效果
                            if (options.typePosition == "outer" && opts.showSize==1) {
                                if(opts.magnifier.isShow){
                                    magnifier();
                                }
                            }
                        });
                        if ($slider.find(".slider-current-page").size() > 0) {
                            $currentPage = $slider.find(".slider-current-page");
                            if (parseInt($currentPage.text()) == 1) {
                                pageNum = Math.ceil(totalSize / opts.offsetSize);
                                $currentPage.text(parseInt(pageNum--));
                            } else {
                                $currentPage.text(parseInt($currentPage.text()) - 1);
                            }

                            pageNum = $currentPage.text();
                            //当前显示数字
                            var markersItem = $slider.find("ul:last").find("li");
                            markersItem.removeClass("active-marker");
                            $(markersItem.eq($currentPage.text() - 1)).addClass("active-marker");
                        }

                    }
                });

                //往右 按钮 向左移动
                $nextBtn.click(function () {
                    if (!$sliderUl.is(":animated")) {

                        $sliderUl.animate({ left: '-=' + $sliderItem.outerWidth(true) * opts.offsetSize}, opts.speed, function () {
                            $sliderUl.css({"left": 0}).find("li:lt(" + opts.offsetSize + ")").appendTo($sliderUl);
                            //放大镜效果
                            if (options.typePosition == "outer" && opts.showSize==1) {
                                if(opts.magnifier.isShow){
                                    magnifier();
                                }
                            }
                        });

                        if ($slider.find(".slider-current-page").size() > 0) {
                            $currentPage = $slider.find(".slider-current-page");
                            if (parseInt($currentPage.text()) == Math.ceil(totalSize / opts.offsetSize)) {
                                pageNum = 0;
                                $currentPage.text(++pageNum);
                            } else {
                                $currentPage.text(1 + parseInt($currentPage.text()));
                            }
                            pageNum = $currentPage.text();
                            //当前显示数字
                            var markersItem = $slider.find("ul:last").find("li");
                            markersItem.removeClass("active-marker");
                            $(markersItem.eq($currentPage.text() - 1)).addClass("active-marker");
                        }
                    }
                });
            }

            //一张图片时不显示左右箭头
            function hideArrowForOne(prevBtn,nextBtn){
                if (len == opts.offsetSize || len == opts.showSize) {
                    prevBtn.hide();
                    nextBtn.hide();
                }else{
                    prevBtn.show();
                    nextBtn.show();
                }
            }

            //放大镜函数
            function magnifier(){
                if($slider.find(".slider-magnifier").size()>0){
                    $slider.find(".slider-magnifier").remove();
                }
                var $curMagnifier=$sliderView.find(".arrow-slider-box").find("li:first");
                var $firstImg=$curMagnifier.find("img:first");
                var magnifier='<div class="slider-magnifier">'+
                    '<div class="magnifier-mark"></div>'+
                    '<div class="magnifier-float"></div>'+
                    '<div class="magnifier-box">'+
                    '   <img src="'+$firstImg.data("image") + '" width="'+$firstImg.data("img-width")+'" height="'+$firstImg.data("img-height")+'" alt=""/>'+
                    '</div>'+
                    '</div>';

                $(magnifier).appendTo($slider);

                var $mfMark=$slider.find(".magnifier-mark");
                var $mfBig=$slider.find(".magnifier-box");
                var $mfFloat=$slider.find(".magnifier-float");
                var $mfBigImg=$mfBig.find("img");

                //由放大镜大小计算放大后的区域的大小
                var floatW=opts.magnifier.magWidth;
                var floatH=opts.magnifier.magHeight;

                var smallImgWidth=$curMagnifier.width();
                var bigImgWidth=$mfBigImg.width();

                var magBigWidth=floatW * bigImgWidth / smallImgWidth;
                var magBigHeight=floatH * bigImgWidth / smallImgWidth;



                $mfMark.hover(function(){
                    clearInterval(scrollTimer);
                    $mfFloat.css({"width":floatW,"height":floatH}).show();
                    $mfBig.css({"width":magBigWidth,"height":magBigHeight}).show();
                },function(){
                    $mfFloat.hide();
                    $mfBig.hide();
                });

                if(opts.magnifier.azimuth == "left"){
                    $mfBig.css({"left":-(magBigWidth+10)});
                }else{
                    $mfBig.css({"left":($curMagnifier.width()+10)});
                }
                $mfMark.on("mousemove",function(event){
                    var left = event.clientX - ($sliderView.offset().left-$(document).scrollLeft())  - $mfFloat.width() / 2;
                    var top = event.clientY - ($sliderView.offset().top-$(document).scrollTop()) - $mfFloat.height() / 2;

                    if (left < 0) {
                        left = 0;
                    } else if (left > ($mfMark.width() - $mfFloat.width())) {
                        left = $mfMark.width() - $mfFloat.width();
                    }

                    if (top < 0) {
                        top = 0;
                    } else if (top > ($mfMark.height() - $mfFloat.height())) {
                        top = $mfMark.height() - $mfFloat.height();
                    }

                    $mfFloat.css({"left":left,"top":top});

                    var percentX = left / ($mfMark.width() - $mfFloat.width());
                    var percentY = top / ($mfMark.height() - $mfFloat.height());

                    $mfBigImg.css({"left":-percentX*($mfBigImg.width()-$mfBig.width()),"top":-percentY*($mfBigImg.height()-$mfBig.height())});

                });
            }


            //私有函数
            function sliderBox(obj) {

                var $self = obj.find("ul:first");

                if (opts.direction == "left") {
                    $self.stop().animate({ left: '-=' + $sliderItem.outerWidth(true) * opts.offsetSize}, opts.speed, function () {
                        $self.css({"left": 0}).find("li:lt(" + opts.offsetSize + ")").appendTo($self);

                        //放大镜效果
                        if (options.typePosition == "outer" && opts.showSize==1) {
                            if(opts.magnifier.isShow){
                                magnifier();
                            }
                        }
                    });
                    if (pageNum == Math.ceil(totalSize / opts.showSize)) {
                        pageNum = 0;
                    }
                    if ($slider.find(".slider-current-page").size() > 0) {
                        $slider.find(".slider-current-page").text(++pageNum);
                    }
                } else {
                    $sliderUl.find("li").slice(len - opts.offsetSize, len).insertBefore($sliderUl.find("li:first"));
                    $sliderUl.css({left: '-=' + $sliderItem.outerWidth(true) * opts.offsetSize});
                    $sliderUl.stop().animate({left: '+=' + $sliderItem.outerWidth(true) * opts.offsetSize}, opts.speed, function () {
                        $sliderUl.css({"left": 0});
                        //放大镜效果
                        if (options.typePosition == "outer" && opts.showSize==1) {
                            if(opts.magnifier.isShow){
                                magnifier();
                            }
                        }
                    });

                    if ($slider.find(".slider-current-page").size() > 0) {
                        $currentPage = $slider.find(".slider-current-page");
                        if ($currentPage.text() == 1) {
                            pageNum = Math.ceil(totalSize / opts.showSize);
                        }
                        $currentPage.text(pageNum--);
                    }
                }
                var markersItem = $slider.find("ul:last").find("li");
                markersItem.removeClass("active-marker");
                $(markersItem.eq(pageNum - 1)).addClass("active-marker");
            }
        });
    };
    // 暴露插件的默认配置
    $.fn.wkSlider.defaults = {
        fullScreen: false,
        offsetSize: 1,
        showSize: 1,
        itemPadding: 0,//图片之间的边距
        auto: true,
        curPage: 1,
        speed: 600,
        interval: 2000,
        direction: "left",// right
        type: "rectangle", // dot/figure
        showAlt: false,
        showArrow: true,
        hoverShowArrow:true,
        showAmount: false,
        showType: true, //show type
        typePosition: "inner", //outer
        magnifier:{
            "isShow":false,
            "azimuth":"left",
            "magWidth":"100",
            "magHeight":"100"
        }
    };
})(jQuery);

