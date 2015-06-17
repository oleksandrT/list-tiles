$(function () {
    if ($(".key-feature-tile").length > 0) {

        var featureTileController = (function () {

            //Resizes the text/image block
            //And sets left and right margins of .text-container based on screen width
            var Resizer = function () {
                this.MAX_SCREEN_WIDTH = 1280;
                this.WIDTH_BREAKPOINT_1024 = 1024;
                this.WIDTH_BREAKPOINT_768 = 768;
                this.MIN_MARGIN = 10;
                this.MAX_MARGIN = 50;
                this.CIRCLE_VERTICAL_DEVIATION = 40;
                this.CIRCLE_MARGIN_LEFT = 55;
                this.MARGIN_DELTA = this.MAX_MARGIN - this.MIN_MARGIN;
                this.MARGIN_COEFFICIENT = (this.MAX_SCREEN_WIDTH / 2 - this.WIDTH_BREAKPOINT_768 / 2) / this.MARGIN_DELTA;
                this.WIDTH_BREAKPOINT_WITH_MARGIN = this.WIDTH_BREAKPOINT_768 / 2 - this.MARGIN_COEFFICIENT * this.MIN_MARGIN;

                this.redCircles = $(".red-circle");
                this.rows = $(".key-feature-tile .row");
            };

            Resizer.prototype = {
                resize: function () {
                    var _this = this;
                    _this.rows.each(function (i, row) {
                        var content = $(row).find(".key-feature-tile-content");
                        var imgNode = $(row).find(".image-content");
                        var textContainer = $(row).find(".text-container");
                        var redCircle = $(_this.redCircles[i]);
                        var margin;

                        if (window.innerWidth >= _this.WIDTH_BREAKPOINT_768) {
                            var circleWidth = redCircle.width();
                            var circleMarginTop;

                            //Set text/image height
                            if (textContainer.height() > imgNode.height()) {
                                content.height(textContainer.height());
                                imgNode.height(textContainer.height());
                            } else {
                                content.height(imgNode.height());
                                textContainer.height(imgNode.height());
                            }

                            //Set text left/right margins
                            margin = (imgNode.width() - _this.WIDTH_BREAKPOINT_WITH_MARGIN) / _this.MARGIN_COEFFICIENT;
                            textContainer.css("margin-left", margin);
                            textContainer.css("margin-right", margin);

                            if (window.innerWidth >= _this.WIDTH_BREAKPOINT_1024) {
                                circleMarginTop = (imgNode.height() - circleWidth) + circleWidth / 2;
                            } else {
                                circleMarginTop = (imgNode.height() - circleWidth) + circleWidth / 2 - _this.CIRCLE_VERTICAL_DEVIATION;
                            }

                            if (redCircle.css("display") !== "none") {
                                if (redCircle.hasClass("right-align")) {
                                    redCircle.css("margin-left", $(row).width() - _this.CIRCLE_MARGIN_LEFT - redCircle.width());
                                }

                                redCircle.css("margin-top", circleMarginTop);
                            }
                        } else {
                            //removeAttribute not working in safari
                            content.attr("style", "");
                            imgNode.attr("style", "");
                            textContainer.attr("style", "");

                            //Set text left/right margins
                            margin = (window.innerWidth - imgNode.width()) / 2;
                            textContainer.css("margin-left", margin);
                            textContainer.css("margin-right", margin);
                        }
                    });
                }
            };

            return {
                Resizer: Resizer
            };
        })();

        var resizer = new featureTileController.Resizer();

        $(window).on("load", function() {
            resizer.resize();
        });

        $(window).on("resize", function() {
            resizer.resize();
        });
    }
});