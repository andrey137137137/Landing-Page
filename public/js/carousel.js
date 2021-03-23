var Carousel = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "Carousel";

  Construct.prototype.init = function (params) {
    var _ = this;

    params = _.extend(
      {
        sliderID: false,
        responsible: false,
        navButtons: false,
        countSlides: 0,
      },
      params
    );

    if (!params.sliderID || !params.countSlides || !params.navButtons) {
      _.setErrorMessage(_.pluginName);
      return false;
    }

    _.sliderID = params.sliderID;
    _.countSlides = params.countSlides;
    _.slideWidth = params.slideWidth;

    _.responsible = params.responsible;

    _.thumbsList = params.navButtons.thumbs || false;
    _.directionButtons = params.navButtons.direction || false;

    params = null;

    var createDirectionButtons = true;

    _.container = document.querySelector(
      "#" + _.sliderID + " .carousel-container"
    );
    _.demonstration = document.querySelector(
      "#" + _.sliderID + " .carousel-demonstration"
    );
    _.row = document.querySelector("#" + _.sliderID + " .carousel-row");
    var navigation = document.querySelector(
      "#" + _.sliderID + " .carousel-navigation"
    );
    // var thumbs;

    _.rowLeft = 0;
    _.countInFocus;
    _.rightBorder;

    var tempInnerHTML;
    // var i;
    var tempNavBtnSettings;

    if (_.directionButtons && _.directionButtons.notCreate) {
      createDirectionButtons = false;
      // delete params.navButtons.direction.notCreate;
    }

    if (!_.row.children.length) {
      return;
    }

    if (_.responsible) {
      _.countInFocus = 1;
    } else {
      _.demonstration.style.height =
        _.row.firstElementChild.offsetHeight + "px";
    }

    if (_.responsible) {
      // _.slideWidth = _.container.offsetWidth;

      _.setEachSlideWidth(_.container.offsetWidth);

      // console.log(_.row.firstElementChild.offsetHeight);
    } else {
      // _.slideWidth = _.row.firstElementChild.offsetWidth;
      _.slideWidth = _.getWidth(_.row.firstElementChild, true);
    }

    _.row.style.width = _.slideWidth * _.row.children.length + "px";

    if (_.thumbsList) {
      _.thumbsList = document.createElement("ul");

      _.thumbsList.id = _.sliderID + "-carousel-thumbs";
      _.thumbsList.classList.add("thumbs");
      _.thumbsList.classList.add("hor-menu");

      // for (i = 0, tempInnerHTML = ''; i < _.countSlides; i++)
      // {
      //   tempInnerHTML += '<li><a data-index="' + i + '" href="#"';

      //   if (!i)
      //   {
      //     tempInnerHTML += ' class="active"';
      //   }

      //   tempInnerHTML += '></a></li>';
      // }

      // _.thumbsList.innerHTML = tempInnerHTML;

      navigation.appendChild(_.thumbsList);
      // thumbs = document.querySelectorAll('#' + _.sliderID + '-carousel-thumbs a');

      _.thumbsList.addEventListener("click", function (event) {
        var elem = event.target;

        if (elem.tagName == "LI") {
          elem = elem.firstElementChild;
        }

        if (elem.tagName != "A") {
          return;
        }

        event.preventDefault();

        for (var i = 0, len = _.thumbsList.children.length; i < len; i++) {
          _.thumbsList.children[i].firstElementChild.classList.remove("active");
        }

        elem.classList.add("active");

        _.changeSlide(0, +elem.getAttribute("data-index"));
      });
    }

    if (_.directionButtons) {
      for (var prop in _.directionButtons) {
        if (createDirectionButtons) {
          tempNavBtnSettings = _.directionButtons[prop];

          _.directionButtons[prop] = document.createElement("div");
          _.directionButtons[prop].id = _.sliderID + "-carousel-" + prop;
          _.directionButtons[prop].classList.add("button");
        } else {
          _.directionButtons[prop] = document.getElementById(
            _.sliderID + "-carousel-" + prop
          );
        }

        if (prop == "prev") {
          _.directionButtons[prop].classList.add("disable");
        }

        if (createDirectionButtons) {
          _.directionButtons[prop].innerHTML = tempNavBtnSettings;
          navigation.appendChild(_.directionButtons[prop]);
        }
      }

      _.directionButtons.prev.addEventListener("click", function () {
        _.changeSlide(-1);
      });

      _.directionButtons.next.addEventListener("click", function () {
        _.changeSlide(1);
      });
    }

    window.addEventListener("resize", function () {
      // _.setSliderWidth();
      _.resizeWindowWidth(_.setSliderWidth);
    });

    _.setSliderWidth();
  };

  Construct.prototype.setSliderWidth = function () {
    var _ = this;
    var newWidth;

    if (_.responsible) {
      newWidth = _.getTotalWidth();

      _.setEachSlideWidth(newWidth);

      _.row.style.width = newWidth * _.countSlides + "px";
    } else {
      _.setRowWidth();
      _.countInFocus = parseInt(_.getTotalWidth() / _.slideWidth);
      console.log(_.sliderID + ": " + _.slideWidth);
      if (_.countSlides < _.countInFocus) {
        _.countInFocus = _.countSlides;
      }

      newWidth = _.slideWidth * _.countInFocus;
      _.container.style.width = newWidth + _.getBorderWidth() + "px";
    }

    _.rightBorder = -(_.row.offsetWidth - newWidth);

    if (_.row.offsetLeft < _.rightBorder) {
      _.row.style.left = _.rightBorder + "px";
    }

    _.setThumbs();
    _.showHideDirButtons();
  };

  Construct.prototype.setEachSlideWidth = function (width) {
    var _ = this;

    _.slideWidth = width;

    for (var i = 0; i < _.countSlides; i++) {
      _.row.children[i].style.width = width + "px";
    }
  };

  Construct.prototype.setRowWidth = function () {
    var _ = this;
    _.slideWidth = _.getWidth(_.row.firstElementChild, true);
    _.row.style.width = _.slideWidth * _.countSlides + "px";
  };

  Construct.prototype.setThumbs = function () {
    var _ = this;

    if (!_.thumbsList) {
      return false;
    }

    var countThumbs = Math.ceil(_.countSlides / _.countInFocus);
    var tempInnerHTML = "";

    if (countThumbs > 1) {
      for (var i = 0; i < countThumbs; i++) {
        tempInnerHTML += '<li><a data-index="' + i + '" href="#"></a></li>';
      }
    }

    _.thumbsList.innerHTML = tempInnerHTML;
  };

  Construct.prototype.getTotalWidth = function () {
    var _ = this;
    // var totalContainer = _.container.parentNode;
    // var width = totalContainer.offsetWidth;

    // width -= _.getStyle(totalContainer, 'marginLeft', 'px');
    // width -= _.getStyle(totalContainer, 'marginRight', 'px');

    // width -= _.getStyle(totalContainer, 'paddingLeft', 'px');
    // width -= _.getStyle(totalContainer, 'paddingRight', 'px');

    // return width;
    return _.container.parentNode.clientWidth;
  };

  Construct.prototype.getBorderWidth = function () {
    var _ = this;
    var width = _.getStyle(_.demonstration, "borderLeftWidth", "px");

    width += _.getStyle(_.demonstration, "borderRightWidth", "px");

    return width;
  };

  // {
  //   var style = getComputedStyle(elem)[styleName];

  //   if (measure)
  //   {
  //     style = parseInt(style.slice(0, style.length - measure.length));
  //   }

  //   return style;
  // },

  Construct.prototype.showHideDirButtons = function () {
    var _ = this;

    // getStyle = function(elem, styleName, measure)
    if (_.directionButtons) {
      _.directionButtons.prev.classList.remove("disable");
      _.directionButtons.next.classList.remove("disable");
    }

    if (_.rowLeft > 0) {
      _.rowLeft = 0;

      if (_.directionButtons) {
        _.directionButtons.prev.classList.add("disable");
      }
    }

    if (_.rowLeft < _.rightBorder) {
      _.rowLeft = _.rightBorder;

      if (_.directionButtons) {
        _.directionButtons.next.classList.add("disable");
      }
    }
  };

  Construct.prototype.changeSlide = function (direction, index) {
    var _ = this;
    var shift = _.slideWidth * _.countInFocus;

    direction = direction || 0;

    if (direction < 0) {
      _.rowLeft = _.row.offsetLeft + shift;
    } else if (direction > 0) {
      _.rowLeft = _.row.offsetLeft - shift;
    } else {
      index = index || 0;
      _.rowLeft = -shift * index;
    }

    _.showHideDirButtons();

    _.row.style.left = _.rowLeft + "px";
  };

  return Construct(arguments);
};
