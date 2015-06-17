$(function () {

    //TODO: delete console msgs
    var body = $("body");
    var indicationTileElements = $(".indications-tile");
    var indicationTiles = [];
    if (indicationTileElements.length > 0) {

        //Define namespace for Indications and classes for indication tile control
        var indicationsTileController = (function () {

            //Pointer model
            //Visually points to clicked item
            var Pointer = function (pointerInstance) {
                this.instance = pointerInstance;
                this.initialOffsetX = parseInt(this.instance.css("left"), 10);
                this.offsetX;
            }

            Pointer.prototype = {
                slideIn: function () {
                    var _this = this;
                    _this.instance.css({
                        transform: "translateX(" + _this.offsetX + "px)"
                    });
                },

                slideOut: function () {
                    var _this = this;
                    _this.instance.css({
                        transform: "translateX(" + _this.initialOffsetX + "px)"
                    });
                }
            }

            //Presenter model
            //Displays detailed info about clicked item
            var Presenter = function (presenterElement) {
                this.instance = presenterElement;
                this.pointer = new Pointer(this.instance.find(".triangle"));
                this.content = this.instance.find(".content");
                this.txtContainer = this.instance.find(".text-container");
                this.txtContent = this.instance.find(".text-content");
                this.imgContent = this.instance.find(".image-holder .detailed-img");
                this.videoIcon = this.instance.find(".video-icon");
                this.videoContent = this.instance.find(".indication-video");
                this.isInitialized = false;
                this.isOpened = false;
            }

            Presenter.prototype = {
                init: function () {
                    var _this = this;

                    //Animations synchronization
                    _this.instance.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (event) {
                        if (_this.isOpened) {
                            _this.instance.css("overflow", "visible");
                            _this.pointer.slideIn();
                        } else {
                            _this.instance.css({
                                visibility: "hidden"
                            });
                        }
                    });

                    _this.pointer.instance.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (event) {
                        event.stopPropagation();

                        if (!_this.isOpened) {
                            _this.instance.css({
                                overflow: "hidden",
                                height: 0
                            });
                        }
                        _this.instance.removeClass("no-transition");
                    });

                    //Fires animations
                    _this.imgContent.on("load", function () {
                        var container = _this.instance.find(".details-container");
                        var containerHeight = container.height();
                        var isMobile = _this.adjustElements($(".indications-item"));

                        if (_this.isOpened) {
                            if (isMobile) {
                                _this.instance.addClass("no-transition");
                                _this.instance.css({
                                    height: containerHeight
                                });
                            }

                            _this.pointer.slideIn();
                        } else {
                            _this.instance.css({
                                visibility: "visible",
                                height: containerHeight
                            });
                            _this.isOpened = true;
                        }

                        //If img is not loaded during interval than trigger "load" event as is
                    }).each(function () {
                        if (_this.isInitialized) {
                            var count = 0;
                            var self = this;

                            var timer = setInterval(function () {
                                if (self.complete || count > 50) {
                                    clearInterval(timer);
                                    $(self).load();
                                } else {
                                    count++;
                                }
                            }, 10);
                        }
                    });

                    _this.isInitialized = true;
                },

                setPosition: function (body, tile, itemPadding) {
                    var _this = this;
                    var contentDisplacement;
                    var indicationTileDisplacement;
                    var contentWidth = tile.width();
                    var indicationTileWidth = body.width();

                    if (window.innerWidth < 768) {
                        indicationTileDisplacement = ((body.width() - tile.width()) / 2) + itemPadding;
                        contentDisplacement = (body.width() - tile.width()) / 2;
                    } else {
                        indicationTileDisplacement = (body.width() - tile.width()) / 2;
                        contentDisplacement = indicationTileDisplacement;
                    }

                    _this.instance.css({
                        "width": indicationTileWidth,
                        "left": -indicationTileDisplacement
                    });

                    _this.content.css({
                        "width": contentWidth,
                        "left": contentDisplacement
                    });
                },

                show: function (dataSource, target, tryOpenSameItem) {
                    var _this = this;
                    _this.pointer.offsetX = dataSource.offset().left + (dataSource.width() / 2 - _this.pointer.initialOffsetX);

                    if (tryOpenSameItem) {
                        _this.imgContent.load();
                    } else {
                        //His majesty IE needs src assignment to trigger "load" event
                        _this.imgContent.removeAttr("src");
                        _this.imgContent.attr("src", dataSource.data("imageUrl"));
                        _this.txtContent.html(dataSource.data("text"));

                        if (dataSource.attr("data-video") === "True") {
                            _this.videoContent.attr("data-webm", dataSource.data("webm"));
                            _this.videoContent.attr("data-mp4", dataSource.data("mp4"));
                            _this.videoContent.addClass("video");
                            _this.videoContent.css("cursor", "pointer");
                            _this.videoIcon.removeClass("hidden");
                        } else {
                            _this.videoContent.attr("data-webm", "");
                            _this.videoContent.attr("data-mp4", "");
                            _this.videoContent.removeClass("video");
                            _this.videoContent.css("cursor", "default");
                            _this.videoIcon.addClass("hidden");
                        }

                        target.after(_this.instance);
                    }
                },

                hide: function () {
                    var _this = this;
                    _this.isOpened = false;
                    _this.pointer.slideOut();
                },

                adjustElements: function (items) {
                    var _this = this;

                    if (window.innerWidth >= 768) {
                        _this.txtContainer.height(_this.imgContent.height());

                        items.each(function (i, item) {
                            if ($(item).data("index") % 2 === 0) {
                                $(item).css("clear", "none");
                            }
                        });
                        return false;
                    } else {
                        _this.txtContainer.attr("style", "");
                        _this.imgContent.attr("style", "");

                        items.each(function (i, item) {
                            if ($(item).data("index") % 2 === 0) {
                                $(item).css("clear", "left");
                            }
                        });
                        return true;
                    }
                }
            }

            //Indication tile model
            var IndicationTile = function (tileElement) {
                this.instance = tileElement;
                this.items = this.instance.find(".indications-item");
                this.itemPadding = parseInt($(this.items[0]).css("padding-right"));
                this.presenter = new Presenter(this.instance.find(".indication-details"));
                this.btnClose = this.presenter.instance.find(".btn-close");
                this.currentItem;
                this.previousItem = [42]; //Needs placeholder value
            };

            IndicationTile.prototype = {
                init: function () {
                    var _this = this;

                    _this.items.each(function (index, item) {
                        $(item).data("index", index);
                    });

                    _this.items.on("click", function () {
                        _this.currentItem = $(this);
                        var dataSource = _this.currentItem;
                        var target = _this.currentItem;

                        if (_this.currentItem[0] === _this.previousItem[0]) {
                            if (_this.presenter.instance.height() <= 1) {
                                _this.presenter.show(dataSource, target, true);
                            } else {
                                _this.presenter.hide(_this.instance);
                            }
                        } else {
                            if (window.innerWidth <= 768) {
                                if (_this.currentItem.data("index") % 2 === 0) {
                                    if (_this.items[_this.currentItem.data("index") + 1] !== undefined) {
                                        target = $(_this.items[_this.currentItem.data("index") + 1]);
                                    }
                                }
                            } else {
                                target = _this.currentItem.parents(".indications-row");
                            }

                            _this.presenter.show(dataSource, target, false);
                        }

                        _this.previousItem = _this.currentItem;
                        _this.presenter.adjustElements(_this.items);
                        _this.presenter.setPosition(body, _this.instance, _this.itemPadding);
                    });

                    _this.btnClose.on("click", function () {
                        _this.presenter.hide();
                        _this.previousItem = _this.currentItem;
                        _this.presenter.adjustElements(_this.items);
                        _this.presenter.setPosition(body, _this.instance, _this.itemPadding);
                    });
                }
            };

            return {
                Pointer: Pointer,
                Presenter: Presenter,
                IndicationTile: IndicationTile
            };
        })();

        //Start creating models
        indicationTileElements.each(function (index, tileElement) {
            indicationTiles.push(new indicationsTileController.IndicationTile($(tileElement)));
        });

        indicationTiles.forEach(function (indicationTile) {
            indicationTile.init();
            indicationTile.presenter.init();

            $(window).on("load", function () {
                indicationTile.presenter.adjustElements(indicationTile.items);
                indicationTile.presenter.setPosition(body, indicationTile.instance, indicationTile.itemPadding);
            });

            $(window).on("resize", function () {
                indicationTile.presenter.adjustElements(indicationTile.items);
                indicationTile.presenter.setPosition(body, indicationTile.instance, indicationTile.itemPadding);
            });
        });

    }
});