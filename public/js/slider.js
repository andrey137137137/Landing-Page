var Slider = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    // console.log(params[0]);

    var pluginName = "Slider";
    var self = this;

    params = self.extend(
      {
        sliderID: false,
        countSlides: false,
        navButtons: false,
        slidePrefix: false,
        animationSpeed: 75,
        animationDelay: 5000,
        autoplayTimeout: 1500,
      },
      params[0],
    );

    if (!params.sliderID || !params.navButtons || !params.countSlides) {
      self.setErrorMessage(pluginName);
      return false;
    }

    var sliderID = params.sliderID;
    var navButtons = params.navButtons;
    var slidePrefix = params.slidePrefix || sliderID + "-slide-";
    var countSlides = params.countSlides;
    var animationSpeed = params.animationSpeed || 17;
    var animationDelay = params.animationDelay || 4000;
    var autoplayTimeout = params.autoplayTimeout || 1500;

    params = null;

    var sliderVisible = false;

    var autoplayID = 0;
    var animationID = 0;
    var delayAutoplayID = 0;

    var prevIndex = 0;
    var curIndex = 0;

    var prevSlide;
    var activeSlide;

    var activeBackground;
    var activeContent;

    var definedChangingStyles;
    var changingStyles;

    var animationByBlocks;
    var blocks = [];
    var countBlockResetIntervals = 0;

    var countTransitionMethods = 0;
    var transitionMethodNames = [];
    var selectedTransitionMethod;

    var timingStyle;
    var timingDirection;
    var selectedTimingMethod;
    var countTimingMethods = 0;
    var timingMethodNames = [];

    var containerID = sliderID + "-slider";
    var containerHeight = document.getElementById(containerID).offsetHeight;

    var objectParams;

    var transitionMethods = {
      opacity: function () {
        if (!definedChangingStyles) {
          changeClasses();

          setChangingStyles({
            opacity: { value: 0, step: 0.1 },
          });
        }

        if (definedChangingStyles) {
          // changingStyles.opacity.value += 0.1;
          timingMethod("opacity");
          changeStyles(parseInt(changingStyles.opacity.value) >= 1);
        }
      },

      fromTop: function () {
        if (!definedChangingStyles) {
          changeClasses();

          setChangingStyles({
            bottom: { value: 100, step: 7, measure: "%" },
          });
        }

        if (definedChangingStyles) {
          timingMethod("bottom", -1);
          changeStyles(changingStyles.bottom.value < 0);
        }
      },

      fromLeft: function () {
        if (!definedChangingStyles) {
          changeClasses();

          setChangingStyles({
            left: { value: -100, step: 7, measure: "%" },
          });
        }

        if (definedChangingStyles) {
          timingMethod("left");
          changeStyles(changingStyles.left.value > 0);
        }
      },

      fromRight: function () {
        if (!definedChangingStyles) {
          changeClasses();

          setChangingStyles({
            left: { value: 100, step: 7, measure: "%" },
          });
        }

        if (definedChangingStyles) {
          timingMethod("left", -1);
          changeStyles(changingStyles.left.value < 0);
        }
      },

      fromBottom: function () {
        if (!definedChangingStyles) {
          changeClasses();

          setChangingStyles({
            top: { value: 100, step: 7, measure: "%" },
          });
        }

        if (definedChangingStyles) {
          timingMethod("top", -1);
          changeStyles(changingStyles.top.value < 0);
        }
      },

      fromBottomLeft: function () {
        if (!definedChangingStyles) {
          changeClasses();

          setChangingStyles({
            left: { value: -100, step: 7, measure: "%" },
            bottom: { value: -100, step: 7, measure: "%" },
          });
        }

        if (definedChangingStyles) {
          timingMethod("left");
          timingMethod("bottom");

          changeStyles(changingStyles.left.value >= 0 && changingStyles.bottom.value >= 0);
        }
      },

      fromBottomRight: function () {
        if (!definedChangingStyles) {
          changeClasses();

          setChangingStyles({
            right: { value: -100, step: 7, measure: "%" },
            bottom: { value: -100, step: 7, measure: "%" },
          });
        }

        if (definedChangingStyles) {
          timingMethod("right");
          timingMethod("bottom");

          changeStyles(changingStyles.right.value >= 0 && changingStyles.bottom.value >= 0);
        }
      },
    };

    var timingMethods = {
      linear: function () {
        changeStyleValue();
      },

      ease: function () {
        if (
          (changingStyles[timingStyle].value > 30 && timingDirection < 0) ||
          (changingStyles[timingStyle].value < -30 && timingDirection > 0)
        ) {
          changingStyles[timingStyle].step = 5;
        } else if (
          (changingStyles[timingStyle].value > 20 && timingDirection < 0) ||
          (changingStyles[timingStyle].value < -20 && timingDirection > 0)
        ) {
          changingStyles[timingStyle].step = 2;
        } else if (
          (changingStyles[timingStyle].value > 10 && timingDirection < 0) ||
          (changingStyles[timingStyle].value < -10 && timingDirection > 0)
        ) {
          changingStyles[timingStyle].step = 1;
        }

        changeStyleValue();
      },

      quad: function () {
        changingStyles[timingStyle].step =
          Math.pow(changingStyles[timingStyle].step, 2) + changingStyles[timingStyle].step;
        changeStyleValue();
      },
    };

    for (var prop in navButtons) {
      if (navButtons[prop] === true) {
        navButtons[prop] = sliderID + "-slider-" + prop;
      }
    }

    objectParams = self.getObjectLength(transitionMethods, true);

    transitionMethodNames = objectParams.array;
    countTransitionMethods = objectParams.length;

    objectParams = self.getObjectLength(timingMethods, true);

    timingMethodNames = objectParams.array;
    countTimingMethods = objectParams.length;

    objectParams = null;

    document.body.addEventListener("keydown", function (event) {
      switch (event.keyCode) {
        case 37:
          event.preventDefault();
          changeSlide(-1);
          break;
        // case 38:
        // 	event.preventDefault();
        // 	autoplay(true);
        // 	break;
        case 39:
          event.preventDefault();
          changeSlide();
          break;
        // case 40:
        // 	event.preventDefault();
        // 	autoplay();
        // 	break;
      }
    });

    if (navButtons.prev) {
      document.getElementById(navButtons.prev).addEventListener("click", function (event) {
        event.preventDefault();
        changeSlide(-1);
      });
    }

    if (navButtons.next) {
      document.getElementById(navButtons.next).addEventListener("click", function (event) {
        event.preventDefault();
        changeSlide();
      });
    }

    if (navButtons.play) {
      document.getElementById(navButtons.play).addEventListener("click", function (event) {
        event.preventDefault();
        autoplay(true);
      });
    }

    if (navButtons.stop) {
      document.getElementById(navButtons.stop).addEventListener("click", function (event) {
        event.preventDefault();
        autoplay();
      });
    }

    document.getElementById(getSlideID(curIndex)).classList.add("slider-item--active");

    window.addEventListener("resize", isVisibleSlider);
    window.addEventListener("scroll", isVisibleSlider);

    isVisibleSlider();

    function isVisibleSlider() {
      // var scrollY = self.getScrollY();
      // var topBorder = self.getElemCenterTop(containerID);
      // var bottomBorder = topBorder + parseInt(containerHeight);

      // if (scrollY >= topBorder && scrollY <= bottomBorder)
      // {
      // 	sliderVisible = true;
      // 	autoplay(true);
      // }
      // else
      // {
      // 	sliderVisible = false;
      // 	autoplay(false);
      // }

      if (self.isVisibleElem(containerID)) {
        sliderVisible = true;
        autoplay(true);
      } else {
        sliderVisible = false;
        autoplay(false);
      }
    }

    function autoplay(play) {
      play = play || false;

      if (!autoplayID && play) {
        resetDelayAutoplay();
        // autoplayID = setInterval(changeSlide, animationDelay, 1, true);
        // autoplayID = 1;
        // changeSlide(1, true);

        autoplayID = setTimeout(function () {
          requestAnimationFrame(function () {
            changeSlide(1, true);
          });
        }, animationDelay);

        console.log("played");

        if (navButtons.play) {
          document.getElementById(navButtons.play).style.opacity = 0.5;
        }

        if (navButtons.stop) {
          document.getElementById(navButtons.stop).style.opacity = "";
        }
      } else if (!play) {
        stopAutoplay();
      }
    }

    function stopAutoplay() {
      if (autoplayID) {
        // clearInterval(autoplayID);
        clearTimeout(autoplayID);
        autoplayID = 0;

        console.log("stopped");

        if (navButtons.play) {
          document.getElementById(navButtons.play).style.opacity = "";
        }

        if (navButtons.stop) {
          document.getElementById(navButtons.stop).style.opacity = 0.5;
        }
      }

      resetDelayAutoplay();
    }

    function resetDelayAutoplay() {
      if (!delayAutoplayID) {
        return;
      }

      clearTimeout(delayAutoplayID);
      delayAutoplayID = 0;
    }

    function changeSlide(direction, continuePlaying, effect) {
      if (!animationID) {
        continuePlaying = continuePlaying || false;

        if (!continuePlaying) {
          stopAutoplay();
        }

        direction = direction || 1;

        beforeAnimation(direction);

        effect = effect || -1;
        animation(effect);
      }
    }

    function getSlideIndex(index) {
      if (index >= 0) {
        return index % countSlides;
      }

      return index + countSlides;
    }

    function getSlideID(index) {
      console.log(slidePrefix + (index + 1));
      return slidePrefix + (index + 1);
    }

    function beforeAnimation(direction) {
      if (navButtons.prev) {
        document.getElementById(navButtons.prev).style.opacity = "0.5";
      }

      if (navButtons.next) {
        document.getElementById(navButtons.next).style.opacity = "0.5";
      }

      prevIndex = curIndex;

      if (direction > 0) {
        curIndex++;
      } else {
        curIndex--;
      }

      curIndex = getSlideIndex(curIndex);

      prevSlide = document.getElementById(getSlideID(prevIndex));
      activeSlide = document.getElementById(getSlideID(curIndex));
    }

    function animation(effect) {
      var timingMethodIndex = parseInt(Math.random() * countTimingMethods);

      // timingMethodIndex = 0;

      selectedTimingMethod = timingMethodNames[timingMethodIndex];

      if (effect < 0) {
        effect = parseInt(Math.random() * countTransitionMethods);
      }

      // effect = 0;

      selectedTransitionMethod = transitionMethodNames[effect];

      // animationID = setInterval(transitionMethods[selectedTransitionMethod], animationSpeed);

      animationID = 1;
      transitionMethods[selectedTransitionMethod]();
    }

    function afterAnimation() {
      if (animationID) {
        activeSlide.removeAttribute("style");
        prevSlide.classList.remove("slider-item--prev");
        definedChangingStyles = false;

        // clearInterval(animationID);
        animationID = 0;

        if (sliderVisible) {
          if (autoplayID) {
            autoplayID = setTimeout(function () {
              requestAnimationFrame(function () {
                changeSlide(1, true);
              });
            }, animationDelay);
          }
          // if (!autoplayID && sliderVisible)
          else {
            delayAutoplayID = setTimeout(autoplay, autoplayTimeout, true);
            // delayAutoplayID = setTimeout(autoplay, 1000, true);
          }
        }
      }

      if (navButtons.prev) {
        document.getElementById(navButtons.prev).style.opacity = "";
      }

      if (navButtons.next) {
        document.getElementById(navButtons.next).style.opacity = "";
      }
    }

    function timingMethod(style, direction) {
      timingStyle = style;
      timingDirection = direction || 1;

      timingMethods[selectedTimingMethod]();
    }

    function setChangingStyles(params) {
      changingStyles = params;

      for (var prop in changingStyles) {
        changingStyles[prop].measure = changingStyles[prop].measure || "";
        activeSlide.style[prop] = changingStyles[prop].value + changingStyles[prop].measure;
      }

      definedChangingStyles = true;
    }

    function changeStyleValue() {
      if (timingDirection < 0) {
        changingStyles[timingStyle].value -= changingStyles[timingStyle].step;
      } else {
        changingStyles[timingStyle].value += changingStyles[timingStyle].step;
      }
    }

    function changeClasses() {
      prevSlide.classList.add("slider-item--prev");
      prevSlide.classList.remove("slider-item--active");
      activeSlide.classList.add("slider-item--active");
    }

    function changeStyles(exitCondition) {
      if (exitCondition) {
        afterAnimation();
      } else {
        for (var prop in changingStyles) {
          changingStyles[prop].measure = changingStyles[prop].measure || "";
          activeSlide.style[prop] = changingStyles[prop].value + changingStyles[prop].measure;
        }

        // setTimeout(transitionMethods[selectedTransitionMethod], animationSpeed);
        setTimeout(function () {
          requestAnimationFrame(transitionMethods[selectedTransitionMethod]);
        }, animationSpeed);
      }
    }

    function setThumb(elem) {
      if (!animationID) {
        // var thumbs = document.querySelectorAll('#testimonials-thumbs a');
        var thumbs = document.querySelectorAll("#" + navButtons.thumbs + " a");

        prevIndex = document.querySelector("#" + navButtons.thumbs + " .slider-item--active")
          .dataset.number;

        for (var i = 0; i < thumbs.length; i++) {
          thumbs[i].classList.remove("slider-item--active");
        }

        // thumbs[elem.dataset.number].classList.add('slider-item--active');

        curIndex = elem.dataset.number;

        prevSlide = document.getElementById(getSlideID(prevIndex));
        activeSlide = document.getElementById(getSlideID(curIndex));
        // direction = direction;
        // effect = effect;
        animation(1);
        elem.classList.add("slider-item--active");
      }
    }
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  return Construct(arguments);
};
