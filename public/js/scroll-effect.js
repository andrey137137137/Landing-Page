var ScrollEffect = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "ScrollEffect";

  Construct.prototype.init = function (params) {
    var _ = this;

    params = _.extend(
      {
        buttonID: false,
        direction: 1,
        defaultScrollStep: 50,
        scrollFinalPos: 0,
        finalElemID: false,
      },
      params
    );

    _.scrollY = _.getScrollY();

    _.direction = params.direction;
    _.defaultScrollStep = params.defaultScrollStep;
    _.scrollFinalPos = params.scrollFinalPos;

    _.finalElemID = params.finalElemID;
    var buttonID = params.buttonID;

    params = null;

    _.intervalID = 0;

    _.scrollStep;
    _.counter = 1;

    if (_.finalElemID) {
      _.scrollFinalPos = document.getElementById(_.finalElemID).offsetTop;

      // window.addEventListener('resize', function(){
      // 	_.scrollFinalPos = document.getElementById(_.finalElemID).offsetTop;
      // });
    }

    document
      .getElementById(buttonID)
      .addEventListener("click", function (event) {
        event.preventDefault();
        _.start();
      });
  };

  Construct.prototype.start = function () {
    var _ = this;

    if (_.intervalID > 0) {
      _.stop();
    }

    _.scrollY = _.getScrollY();
    _.scrollStep = _.defaultScrollStep;

    if (_.finalElemID) {
      _.scrollFinalPos = document.getElementById(_.finalElemID).offsetTop;
    }

    console.log(_.scrollFinalPos);

    _.intervalID = setInterval(function () {
      _.run();
    }, 50);
  };

  Construct.prototype.run = function () {
    var _ = this;

    if (_.counter % 10 === 0) {
      _.scrollStep *= 5;
    }

    console.log(_.scrollY);

    if (_.direction > 0) {
      _.scrollY += _.scrollStep;

      if (_.scrollY >= _.scrollFinalPos) {
        _.scrollY = _.scrollFinalPos;
      }
    } else {
      _.scrollY -= _.scrollStep;

      if (_.scrollY <= _.scrollFinalPos) {
        _.scrollY = _.scrollFinalPos;
      }
    }

    _.changeScroll();
    _.counter++;

    if (_.scrollY === _.scrollFinalPos) {
      _.stop();
    }
  };

  Construct.prototype.stop = function () {
    var _ = this;

    clearInterval(_.intervalID);
    _.intervalID = 0;

    _.counter = 1;
    _.scrollStep = _.defaultScrollStep;
  };

  Construct.prototype.changeScroll = function () {
    var _ = this;

    // if (document.documentElement.scrollTop)
    // {
    // 	document.documentElement.scrollTop = _.scrollY;
    // }
    // else if (document.body.scrollTop)
    // {
    // 	document.body.scrollTop = _.scrollY;
    // }
    _.setScrollY(_.scrollY);
  };

  return Construct(arguments);
};
