$(function() {
    $(window).on("load", function() {
      $('.preloader').delay(2000).fadeOut('slow', function() {
        $(this).remove();
      });
    });
  });