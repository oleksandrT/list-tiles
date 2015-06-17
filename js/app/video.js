$(document).ready(function () {
    //a video link has to have class video and data-mp4 
    // and data-webm attibutes for this code to work
    $("#myModal").on("hidden.bs.modal", function () {
        $("video").trigger("pause");
        //$("#mp4").attr("src", "");
        //$("#webm").attr("src", "");
    });
    $(document).on("click", ".video", function (event) {
        var trigger = $(event.currentTarget);
        var mp4 = trigger.attr("data-mp4");
        var webm = trigger.attr("data-webm");

        $("#mp4").attr("src", mp4);
        $("#webm").attr("src", webm);
        $("#myModal video").load();

        $("#myModal").modal('show');
    });

    // Code below supposed to stop video, when modal window closed
    //$(".myModal").on("hide", function () {
    //    $('.video').get(0).stopVideo();
    //});
});