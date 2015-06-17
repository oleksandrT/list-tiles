$(document).ready(function () {
    //show more accordion

    $('#collapseIndications').on('hide.bs.collapse', null, { link: ".showMore" }, function (event) {
        var link = $('a' + event.data.link);

        link.html('More indications <span class="glyphicon glyphicon-chevron-down"></span>');
        
    });

    $('#collapseIndications').on('show.bs.collapse', null, { link: ".showMore" }, function (event) {
        var link = $('a' + event.data.link);

        link.html('Less indications <span class="glyphicon glyphicon-chevron-up"></span>');
    });   
});