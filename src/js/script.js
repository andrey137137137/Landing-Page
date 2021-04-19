"use strict";

// import $ from "jquery";

$(document).ready(function() {
  // MAIN MENU
  $("#header").addClass("narrow");

  // MAIN SLIDER
  $("#mainSlider").on("init", function(e, slick) {
    const $items = slick.$dots.find("li");
    $items.addClass("slider_nav__thumb main_slider__thumb");
    $items
      .first()
      .find(".main_slider__thumb_link")
      .addClass("active");
  });

  $("#mainSlider").on("beforeChange", function(
    e,
    slick,
    currentSlide,
    nextSlide
  ) {
    console.log(`Slide ${nextSlide}`);
    slick.$dots
      .find(`li:eq(${currentSlide})`)
      .find(".main_slider__thumb_link")
      .removeClass("active");
    slick.$dots
      .find(`li:eq(${nextSlide})`)
      .find(".main_slider__thumb_link")
      .addClass("active");
  });

  $("#mainSlider").slick({
    infinite: true,
    prevArrow: $(".slider_nav__prev"),
    nextArrow: $(".slider_nav__next"),
    dots: true,
    appendDots: $(".main_slider__nav"),
    dotsClass: "slider_nav__thumbs main_slider__thumbs",
    customPaging(slick, i) {
      return `<a class="thumb__link main_slider__thumb_link">
        <span class="thumb__dot"></span>
      </a>`;
    },
    speed: 500,
    fade: true,
    cssEase: "linear"
  });

  $("#blogSlider").slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: $(".blog__nav_prev"),
    nextArrow: $(".blog__nav_next"),
    speed: 500
  });
});
