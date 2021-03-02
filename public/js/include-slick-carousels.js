$(function () {
  "use strict";

  function setNavItems(e, $slick) {
    $slick.$dots.find("li").addClass("list-item thumbs-item");
  }

  function getDotsClass(blockClass) {
    return "list thumbs " + blockClass + "-thumbs";
  }

  function customPaging($slick, i) {
    return `<a class="list-link thumbs-link">
              <div class="rhombus_wrap thumbs-rhombus"></div>
            </a>`;
  }

  function getBaseConfig(id, areDots) {
    return {
      arrows: false,
      dots: areDots,
      dotsClass: getDotsClass(id),
      appendDots: $("#" + id),
      customPaging,
    };
  }

  function getDefaultValue(value, isBoolean) {
    var defaultValue = isBoolean ? false : {};
    return value || defaultValue;
  }

  function createSlider(id, toSetNavItems, areDots, addConfig) {
    var addConfig = getDefaultValue(addConfig, false);
    var data = getBaseConfig(id, areDots);
    var containerSelector = "#" + id + " .carousel-container";

    for (var key in addConfig) {
      if (Object.hasOwnProperty.call(addConfig, key)) {
        data[key] = addConfig[key];
      }
    }

    if (toSetNavItems) {
      $(containerSelector).on("init", setNavItems);
    }

    $(containerSelector).slick(data);
  }

  createSlider("testimonials", true, true);
  createSlider("social_feedback", true, true);
  createSlider(
    "clients",
    false,
    // true,
    false,
    {
      infinite: false,
      variableWidth: true,
      slidesToShow: 4,

      responsive: [
        // {
        //   breakpoint: 1170,
        //   settings: {
        //     variableWidth: true,
        //     slidesToShow: 4,
        //   },
        // },
        {
          // breakpoint: 910,
          breakpoint: 1170,
          settings: {
            dots: true,
            variableWidth: false,
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            dots: true,
            variableWidth: false,
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 460,
          settings: {
            dots: true,
            centerMode: true,
            variableWidth: false,
          },
        },
      ],
    },
  );

  function setNavArrow(slider, id, isNext) {
    $("#" + id).on("click", function () {
      $(slider).slick("slick" + (isNext ? "Next" : "Prev"));
    });
  }

  var $teamSlider = $("#team .carousel-demo");

  $teamSlider.slick({
    arrows: false,
    slidesToShow: 3,
    // variableWidth: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 1170,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          // centerMode: true,
        },
      },
    ],
  });

  setNavArrow($teamSlider, "team-carousel-prev", false);
  setNavArrow($teamSlider, "team-carousel-next", true);
});
