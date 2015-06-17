$(document).ready(function () {

    var $menuMobile = $('#top-menu'),
		$menuSeconday = $('.menu-secondary');

    $('.menu-secondary>li').clone().addClass('visible-xs-block').appendTo($('#top-menu .menu-primary'));

    // Works for all browsers except IE9 and lower !!!!!
    if ($(window).width() < 768) {

        var subNavTitle = "";

        $('.opensubpanel').on('click', function (e) {
            e.preventDefault();
            var $subpanel = $(this).find('.subpanel'),
				subNavHeight = $subpanel.outerHeight(true);
            subNavTitle = $(this).find('a.dropdown-toggle').text();
            $subpanel.find('.closesubpanel a').html('<span class="glyphicon glyphicon-menu-left pull-left visible-xs-inline-block"></span> ' + subNavTitle);
            $subpanel.show();
            $('#top-menu').find('.navbar-nav').addClass('pushed');
            $('#top-menu').height(subNavHeight);

        });

        $('.closesubpanel').click(function (e) {
            e.preventDefault();
            e = e || window.e;
            e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);

            $('#top-menu').find('.navbar-nav').removeClass('pushed');
            $('#top-menu').css('height', 'auto');
            $(this).parents('.subpanel').hide();
            subNavTitle = "";
        });
    };

    $('.navbar').on('show.bs.collapse', function () {
        var actives = $(this).find('.collapse.in'),
	        hasData;

        if (actives && actives.length) {
            hasData = actives.data('collapse')
            if (hasData && hasData.transitioning) return
            actives.collapse('hide')
            hasData || actives.data('collapse', null)
        }
    });

    $('.third-level-link').click(function(event) {
        event.stopPropagation();
    });

});