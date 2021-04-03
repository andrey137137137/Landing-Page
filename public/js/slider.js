var Slider = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "Slider";

  Construct.prototype.init = function (params) {
    var _ = this;

    params = _.extend(
      {
        sliderID: false,
        countSlides: false,
        navButtons: false,
        slidePrefix: false,
        animationSpeed: 75,
        animationDelay: 5000,
        autoplayTimeout: 1500,
      },
      params,
    );

    if (!params.sliderID || !params.navButtons || !params.countSlides) {
      _.setErrorMessage(_.pluginName);
      return false;
    }

    _.sliderID = params.sliderID;
    _.navButtons = params.navButtons;
    _.slidePrefix = params.slidePrefix || _.sliderID + "-slide-";
    _.countSlides = params.countSlides;
    _.animationSpeed = params.animationSpeed || 17;
    _.animationDelay = params.animationDelay || 4000;
    _.autoplayTimeout = params.autoplayTimeout || 1500;

    params = null;

    _.sliderVisible = false;

    _.autoplayID = 0;
    _.animationID = 0;
    _.delayAutoplayID = 0;

    _.prevIndex = 0;
    _.curIndex = 0;

    _.prevSlide;
    _.activeSlide;

    var activeBackground;
    var activeContent;

    _.definedChangingStyles;
    _.changingStyles;

    var animationByBlocks;
    var blocks = [];
    var countBlockResetIntervals = 0;

    _.countTransitionMethods = 0;
    _.transitionMethodNames = [];
    _.selectedTransitionMethod;

    _.timingStyle;
    _.timingDirection;
    _.selectedTimingMethod;
    _.countTimingMethods = 0;
    _.timingMethodNames = [];

    _.containerID = _.sliderID + "-slider";
    var containerHeight = document.getElementById(_.containerID).offsetHeight;

    _.objectParams;

    _.transitionMethods = {
      opacity: function () {
        if (!_.definedChangingStyles) {
          _.changeClasses();

          _.setChangingStyles({
            opacity: { value: 0, step: 0.1 },
          });
        }

        if (_.definedChangingStyles) {
          // _.changingStyles.opacity.value += 0.1;
          _.timingMethod("opacity");
          _.changeStyles(parseInt(_.changingStyles.opacity.value) >= 1);
        }
      },

      fromTop: function () {
        if (!_.definedChangingStyles) {
          _.changeClasses();

          _.setChangingStyles({
            bottom: { value: 100, step: 7, measure: "%" },
          });
        }

        if (_.definedChangingStyles) {
          _.timingMethod("bottom", -1);
          _.changeStyles(_.changingStyles.bottom.value < 0);
        }
      },

      fromLeft: function () {
        if (!_.definedChangingStyles) {
          _.changeClasses();

          _.setChangingStyles({
            left: { value: -100, step: 7, measure: "%" },
          });
        }

        if (_.definedChangingStyles) {
          _.timingMethod("left");
          _.changeStyles(_.changingStyles.left.value > 0);
        }
      },

      fromRight: function () {
        if (!_.definedChangingStyles) {
          _.changeClasses();

          _.setChangingStyles({
            left: { value: 100, step: 7, measure: "%" },
          });
        }

        if (_.definedChangingStyles) {
          _.timingMethod("left", -1);
          _.changeStyles(_.changingStyles.left.value < 0);
        }
      },

      fromBottom: function () {
        if (!_.definedChangingStyles) {
          _.changeClasses();

          _.setChangingStyles({
            top: { value: 100, step: 7, measure: "%" },
          });
        }

        if (_.definedChangingStyles) {
          _.timingMethod("top", -1);
          _.changeStyles(_.changingStyles.top.value < 0);
        }
      },

      fromBottomLeft: function () {
        if (!_.definedChangingStyles) {
          _.changeClasses();

          _.setChangingStyles({
            left: { value: -100, step: 7, measure: "%" },
            bottom: { value: -100, step: 7, measure: "%" },
          });
        }

        if (_.definedChangingStyles) {
          _.timingMethod("left");
          _.timingMethod("bottom");

          _.changeStyles(_.changingStyles.left.value >= 0 && _.changingStyles.bottom.value >= 0);
        }
      },

      fromBottomRight: function () {
        if (!_.definedChangingStyles) {
          _.changeClasses();

          _.setChangingStyles({
            right: { value: -100, step: 7, measure: "%" },
            bottom: { value: -100, step: 7, measure: "%" },
          });
        }

        if (_.definedChangingStyles) {
          _.timingMethod("right");
          _.timingMethod("bottom");

          _.changeStyles(_.changingStyles.right.value >= 0 && _.changingStyles.bottom.value >= 0);
        }
      },
    };

    _.timingMethods = {
      linear: function () {
        _.changeStyleValue();
      },

      ease: function () {
        if (
          (_.changingStyles[_.timingStyle].value > 30 && _.timingDirection < 0) ||
          (_.changingStyles[_.timingStyle].value < -30 && _.timingDirection > 0)
        ) {
          _.changingStyles[_.timingStyle].step = 5;
        } else if (
          (_.changingStyles[_.timingStyle].value > 20 && _.timingDirection < 0) ||
          (_.changingStyles[_.timingStyle].value < -20 && _.timingDirection > 0)
        ) {
          _.changingStyles[_.timingStyle].step = 2;
        } else if (
          (_.changingStyles[_.timingStyle].value > 10 && _.timingDirection < 0) ||
          (_.changingStyles[_.timingStyle].value < -10 && _.timingDirection > 0)
        ) {
          _.changingStyles[_.timingStyle].step = 1;
        }

        _.changeStyleValue();
      },

      quad: function () {
        _.changingStyles[_.timingStyle].step =
          Math.pow(_.changingStyles[_.timingStyle].step, 2) + _.changingStyles[_.timingStyle].step;
        _.changeStyleValue();
      },
    };

    for (var prop in _.navButtons) {
      if (_.navButtons[prop] === true) {
        _.navButtons[prop] = _.sliderID + "-slider-" + prop;
      }
    }

    _.objectParams = _.getObjectLength(_.transitionMethods, true);

    _.transitionMethodNames = _.objectParams.array;
    _.countTransitionMethods = _.objectParams.length;

    _.objectParams = _.getObjectLength(_.timingMethods, true);

    _.timingMethodNames = _.objectParams.array;
    _.countTimingMethods = _.objectParams.length;

    _.objectParams = null;

    document.body.addEventListener("keydown", function (event) {
      switch (event.keyCode) {
        case 37:
          event.preventDefault();
          _.changeSlide(-1);
          break;
        // case 38:
        // 	event.preventDefault();
        // 	_.autoplay(true);
        // 	break;
        case 39:
          event.preventDefault();
          _.changeSlide();
          break;
        // case 40:
        // 	event.preventDefault();
        // 	_.autoplay();
        // 	break;
      }
    });

    if (_.navButtons.prev) {
      document.getElementById(_.navButtons.prev).addEventListener("click", function (event) {
        event.preventDefault();
        _.changeSlide(-1);
      });
    }

    if (_.navButtons.next) {
      document.getElementById(_.navButtons.next).addEventListener("click", function (event) {
        event.preventDefault();
        _.changeSlide();
      });
    }

    if (_.navButtons.play) {
      document.getElementById(_.navButtons.play).addEventListener("click", function (event) {
        event.preventDefault();
        _.autoplay(true);
      });
    }

    if (_.navButtons.stop) {
      document.getElementById(_.navButtons.stop).addEventListener("click", function (event) {
        event.preventDefault();
        _.autoplay();
      });
    }

    document.getElementById(_.getSlideID(_.curIndex)).classList.add("slider-item--active");

    window.addEventListener("resize", function () {
      _.isVisibleSlider();
    });
    window.addEventListener("scroll", function () {
      _.isVisibleSlider();
    });

    _.isVisibleSlider();
  };

  Construct.prototype.isVisibleSlider = function () {
    var _ = this;
    // var scrollY = _.getScrollY();
    // var topBorder = _.getElemCenterTop(_.containerID);
    // var bottomBorder = topBorder + parseInt(containerHeight);

    // if (scrollY >= topBorder && scrollY <= bottomBorder)
    // {
    // 	_.sliderVisible = true;
    // 	_.autoplay(true);
    // }
    // else
    // {
    // 	_.sliderVisible = false;
    // 	_.autoplay(false);
    // }

    if (_.isVisibleElem(_.containerID)) {
      _.sliderVisible = true;
      _.autoplay(true);
    } else {
      _.sliderVisible = false;
      _.autoplay(false);
    }
  };

  Construct.prototype.autoplay = function (play) {
    play = play || false;

    var _ = this;

    if (!_.autoplayID && play) {
      _.resetDelayAutoplay();
      // _.autoplayID = setInterval(changeSlide, _.animationDelay, 1, true);
      // _.autoplayID = 1;
      // _.changeSlide(1, true);

      _.autoplayID = setTimeout(function () {
        requestAnimationFrame(function () {
          _.changeSlide(1, true);
        });
      }, _.animationDelay);

      console.log("played");

      if (_.navButtons.play) {
        document.getElementById(_.navButtons.play).style.opacity = 0.5;
      }

      if (_.navButtons.stop) {
        document.getElementById(_.navButtons.stop).style.opacity = "";
      }
    } else if (!play) {
      _.stopAutoplay();
    }
  };

  Construct.prototype.stopAutoplay = function () {
    var _ = this;

    if (_.autoplayID) {
      // clearInterval(_.autoplayID);
      clearTimeout(_.autoplayID);
      _.autoplayID = 0;

      console.log("stopped");

      if (_.navButtons.play) {
        document.getElementById(_.navButtons.play).style.opacity = "";
      }

      if (_.navButtons.stop) {
        document.getElementById(_.navButtons.stop).style.opacity = 0.5;
      }
    }

    _.resetDelayAutoplay();
  };

  Construct.prototype.resetDelayAutoplay = function () {
    var _ = this;

    if (!_.delayAutoplayID) {
      return;
    }

    clearTimeout(_.delayAutoplayID);
    _.delayAutoplayID = 0;
  };

  Construct.prototype.changeSlide = function (direction, continuePlaying, effect) {
    var _ = this;

    if (!_.animationID) {
      continuePlaying = continuePlaying || false;

      if (!continuePlaying) {
        _.stopAutoplay();
      }

      direction = direction || 1;

      _.beforeAnimation(direction);

      effect = effect || -1;
      _.animation(effect);
    }
  };

  Construct.prototype.getSlideIndex = function (index) {
    var _ = this;

    if (index >= 0) {
      return index % _.countSlides;
    }

    return index + _.countSlides;
  };

  Construct.prototype.getSlideID = function (index) {
    var _ = this;

    console.log(_.slidePrefix + (index + 1));
    return _.slidePrefix + (index + 1);
  };

  Construct.prototype.beforeAnimation = function (direction) {
    var _ = this;

    if (_.navButtons.prev) {
      document.getElementById(_.navButtons.prev).style.opacity = "0.5";
    }

    if (_.navButtons.next) {
      document.getElementById(_.navButtons.next).style.opacity = "0.5";
    }

    _.prevIndex = _.curIndex;

    if (direction > 0) {
      _.curIndex++;
    } else {
      _.curIndex--;
    }

    _.curIndex = _.getSlideIndex(_.curIndex);

    _.prevSlide = document.getElementById(_.getSlideID(_.prevIndex));
    _.activeSlide = document.getElementById(_.getSlideID(_.curIndex));
  };

  Construct.prototype.animation = function (effect) {
    var _ = this;
    var timingMethodIndex = parseInt(Math.random() * _.countTimingMethods);

    // timingMethodIndex = 0;

    _.selectedTimingMethod = _.timingMethodNames[timingMethodIndex];

    if (effect < 0) {
      effect = parseInt(Math.random() * _.countTransitionMethods);
    }

    // effect = 0;

    _.selectedTransitionMethod = _.transitionMethodNames[effect];

    // _.animationID = setInterval(_.transitionMethods[_.selectedTransitionMethod], _.animationSpeed);

    _.animationID = 1;
    _.transitionMethods[_.selectedTransitionMethod]();
  };

  Construct.prototype.afterAnimation = function () {
    var _ = this;

    if (_.animationID) {
      _.activeSlide.removeAttribute("style");
      _.prevSlide.classList.remove("slider-item--prev");
      _.definedChangingStyles = false;

      // clearInterval(_.animationID);
      _.animationID = 0;

      if (_.sliderVisible) {
        if (_.autoplayID) {
          _.autoplayID = setTimeout(function () {
            requestAnimationFrame(function () {
              _.changeSlide(1, true);
            });
          }, _.animationDelay);
        }
        // if (!_.autoplayID && _.sliderVisible)
        else {
          _.delayAutoplayID = setTimeout(function () {
            _.autoplay(true);
          }, _.autoplayTimeout);
          // _.delayAutoplayID = setTimeout(function () {_.autoplay(true)}, 1000);
        }
      }
    }

    if (_.navButtons.prev) {
      document.getElementById(_.navButtons.prev).style.opacity = "";
    }

    if (_.navButtons.next) {
      document.getElementById(_.navButtons.next).style.opacity = "";
    }
  };

  Construct.prototype.timingMethod = function (style, direction) {
    var _ = this;

    _.timingStyle = style;
    _.timingDirection = direction || 1;

    _.timingMethods[_.selectedTimingMethod]();
  };

  Construct.prototype.setChangingStyles = function (params) {
    var _ = this;

    _.changingStyles = params;

    for (var prop in _.changingStyles) {
      _.changingStyles[prop].measure = _.changingStyles[prop].measure || "";
      _.activeSlide.style[prop] = _.changingStyles[prop].value + _.changingStyles[prop].measure;
    }

    _.definedChangingStyles = true;
  };

  Construct.prototype.changeStyleValue = function () {
    var _ = this;

    if (_.timingDirection < 0) {
      _.changingStyles[_.timingStyle].value -= _.changingStyles[_.timingStyle].step;
    } else {
      _.changingStyles[_.timingStyle].value += _.changingStyles[_.timingStyle].step;
    }
  };

  Construct.prototype.changeClasses = function () {
    var _ = this;

    _.prevSlide.classList.add("slider-item--prev");
    _.prevSlide.classList.remove("slider-item--active");
    _.activeSlide.classList.add("slider-item--active");
  };

  Construct.prototype.changeStyles = function (exitCondition) {
    var _ = this;

    if (exitCondition) {
      _.afterAnimation();
    } else {
      for (var prop in _.changingStyles) {
        _.changingStyles[prop].measure = _.changingStyles[prop].measure || "";
        _.activeSlide.style[prop] = _.changingStyles[prop].value + _.changingStyles[prop].measure;
      }

      // setTimeout(_.transitionMethods[_.selectedTransitionMethod], _.animationSpeed);
      setTimeout(function () {
        requestAnimationFrame(_.transitionMethods[_.selectedTransitionMethod]);
      }, _.animationSpeed);
    }
  };

  Construct.prototype.setThumb = function (elem) {
    var _ = this;

    if (!_.animationID) {
      // var thumbs = document.querySelectorAll('#testimonials-thumbs a');
      var thumbs = document.querySelectorAll("#" + _.navButtons.thumbs + " a");

      _.prevIndex = document.querySelector(
        "#" + _.navButtons.thumbs + " .slider-item--active",
      ).dataset.number;

      for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].classList.remove("slider-item--active");
      }

      // thumbs[elem.dataset.number].classList.add('slider-item--active');

      _.curIndex = elem.dataset.number;

      _.prevSlide = document.getElementById(_.getSlideID(_.prevIndex));
      _.activeSlide = document.getElementById(_.getSlideID(_.curIndex));
      // direction = direction;
      // effect = effect;
      _.animation(1);
      elem.classList.add("slider-item--active");
    }
  };

  return Construct(arguments);
};
