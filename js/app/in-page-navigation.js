$(document).ready(function () {
    InPageNavi.init();
});

$(document).scroll(function () {
    var inPageNav = $(".in-page-navi");
    if (inPageNav) {
        if (!InPageNavi.isVisibleWithinViewPort(inPageNav)) {
            $(".in-page-navi").addClass("in-page-fixed");
        }
        if (InPageNavi.docViewTop() <= InPageNavi.topOffset) {
            $(".in-page-navi").removeClass("in-page-fixed");
        }
    }
});

var InPageNavi = {
    topOffset: 0,
    container: "undefined",
    docViewTop: function() {
        return $(window).scrollTop();
    },
    init: function () {
        var navigation = this;
        navigation.container = $(".in-page-navi");
        var inPageNav = $("#in-page-nav");
        //set top offset of menu on page
        if (navigation.container.offset())
            navigation.topOffset = navigation.container.offset().top;
        if (inPageNav) {
            //menu building
            var sections = $("section[data-pagenavi='1']");
            $.each(sections, function () {
                var hrefAttribute = "#" + $(this).attr("id");
                var linkText = $(this).find("input[data-text='in-page-navi']").val();
                var navigationItem = document.createElement("li");
                navigationItem.setAttribute("class", "text-center link-inpage");
                var linkItem = document.createElement("a");
                linkItem.setAttribute("href", hrefAttribute);
                linkItem.innerHTML = linkText + '<span class="glyphicon glyphicon-chevron-down"></span>';
                navigationItem.appendChild(linkItem);
                inPageNav.append(navigationItem);
            });
        }
        //smooth scroll to anchor on page
        $(".link-inpage a[href*=#]:not([href=#])").click(function (e) {
            var target = $(this.hash);
            if (target.length && navigation.container.hasClass("in-page-fixed")) {
                $('html,body').animate({
                    scrollTop: target.offset().top - navigation.container.height()
            }, 1000);
            } else {
                $('html,body').animate({
                    scrollTop: target.offset().top - (navigation.container.height() * 2)
                }, 1000);
            }
            e.preventDefault();
        });

    },
    isVisibleWithinViewPort: function () {
        var navigation = this;        
        var docViewBottom = navigation.docViewTop + $(window).height();
        if (navigation.container.offset()) {
            var elemTop = navigation.container.offset().top;
            var elemBottom = elemTop + navigation.container.height();

            return ((elemBottom <= docViewBottom) && (elemBottom >= navigation.docViewTop));
        } else {
            return false;
        }
    }
};