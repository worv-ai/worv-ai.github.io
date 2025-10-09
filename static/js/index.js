window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");

  });

  // carousel initialization
  const options = {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    dots: true,
    draggable: false,
    touchMove: true,
    lazyLoad: 'progressive',
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }

  $('.carousel').slick(options);

  // LIBERO task selector
  $('#libero-task-selector').change(function() {
    const selectedTask = $(this).val();
    $('.task-videos').hide();
    $('#' + selectedTask).show();
  });

  // CANVAS environment selector
  $('#canvas-env-selector').change(function() {
    const selectedEnv = $(this).val();
    $('.env-videos').hide();
    $('#' + selectedEnv).show();
  });

  // G-IDM game selector
  $('#gidm-game-selector').change(function() {
    const selectedGame = $(this).val();
    $('.game-videos').hide();
    $('#' + selectedGame).show();
  });

  // OOD game selector
  $('#ood-game-selector').change(function() {
    const selectedOod = $(this).val();
    $('.ood-videos').hide();
    $('#' + selectedOod).show();
  });
})
