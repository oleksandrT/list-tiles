$(document).ready( function() {
	/*
	var inPageNav = $('#in-page-nav');

	var sticky_navigation_offset_top = $('#in-page-nav').offset().top;
	
	var sticky_navigation = function(){
		var scroll_top = $(window).scrollTop();
		
		if (scroll_top > sticky_navigation_offset_top) { 
			$('#in-page-nav').css({ 'position': 'fixed', 'top':0, 'left':0, 'right':0 });
		} else {
			$('#in-page-nav').css({ 'position': 'relative' }); 
		}   
	};
	*/


	$("#navbar > ul > li").click(function(e){
		if ( $(this).find('ul').length > 0 ) {
			e.preventDefault();

			var subMenuHeight = 0;
			var submenuTitleHeight = $(this).height();
			var subMenuListHeight = $(this).find('ul.sub-nav').height();
			var paddingTopHeight = parseInt($(this).find('ul.sub-nav').css('padding-top').replace('px', ''));
			var paddingBottomHeight = parseInt($(this).find('ul.sub-nav').css('padding-bottom').replace('px', ''));
			subMenuHeight = submenuTitleHeight + subMenuListHeight + paddingTopHeight + paddingBottomHeight; // +1 for border-bottom of submenu

			$(this).toggleClass("active");
			$(this).find('span.glyphicon').toggleClass('glyphicon-menu-right').toggleClass('pull-right').toggleClass('glyphicon-menu-left').toggleClass('pull-left');
			// Hide main drop-down menu by updatein height. Height is set to same as sub-navigation height
			if ( $(this).hasClass("active") ) {
				console.log(submenuTitleHeight, subMenuListHeight, paddingTopHeight, paddingBottomHeight);
				console.log('subMenuHeight: ', subMenuHeight);
				$("#navbar").css({
					"height": subMenuHeight
				});
			} else {
				$("#navbar").css({
					"height": "auto"
				});
			};

		};
	});

	$(".navbar-toggle").click(function(){
		$(this).toggleClass("pressed");
		// $(this).find('li.active').find('span.glyphicon').addClass('glyphicon-menu-right').addClass('pull-right').removeClass('glyphicon-menu-left').removeClass('pull-left');
		// $(this).find('li.active').removeClass("active");
	});



/*

	sticky_navigation();

	$(window).scroll(function() {
		 sticky_navigation();
	});

*/
	
});