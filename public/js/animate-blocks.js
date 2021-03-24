var AnimateBlocks = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;
  Construct.prototype.pluginName = "AnimateBlocks";

  Construct.prototype.init = function (params) {
    var _ = this;

    params = _.extend(
      {
        parentID: false,
        childElem: ".section-block",
        interval: 250,
        transform: "scale(0)",
        outPosition: -500,
        timingPosition: "1s",
        timingTransform: "1s",
      },
      params
    );

    if (!params.parentID) {
      // _.setErrorMessage(_.pluginName);
      _.setErrorMessage(_.pluginName);
      return false;
    }

    for (var prop in params) {
      _[prop] = params[prop];
    }

    // _.parentID = params.parentID;

    // _.childElem = params.childElem;
    // _.interval = params.interval;

    // _.transform = params.transform;
    // _.outPosition = params.outPosition;

    // _.timingPosition = params.timingPosition;
    // _.timingTransform = params.timingTransform;

    params = null;

    _.selector = "#" + _.parentID + " " + _.childElem;
    _.$elems = $(_.selector);
    _.countElems = _.$elems.length;
    _.started = false;

    if (!_.countElems) {
      _.setErrorMessage(_.pluginName, "Not children");
      return false;
    }

    _.intervalID = 0;
    _.shiftFromCenter = 0;
    _.direction = 1;
    _.rowNumber = 0;
    _.evenRowElems = true;
    _.evenLastRowElems = true;

    _.changedStyles = new Array(_.countElems);
    _.forLeftPos;
    _.forRightPos;

    _.index;
    _.countRows;
    _.countInRow;
    _.centerRowIndex;
    _.centerLastRowIndex;
    _.rest;
    _.rightBorder;
    _.firstRestIndex;

    _.eventFuncs = [
      {
        e: "resize",
        f: function () {
          // _.setPositions();
          _.resizeWindowWidth(_.setPositions);
        },
      },
      {
        e: "resize",
        f: function () {
          _.show();
        },
      },
      {
        e: "scroll",
        f: function () {
          _.show();
        },
      },
    ];

    for (var i = 0; i < _.eventFuncs.length; i++) {
      $(window).on(_.eventFuncs[i].e, _.eventFuncs[i].f);
    }

    _.setPositions();
    _.show();
  };

  Construct.prototype.setPositions = function () {
    var _ = this;

    if (_.started) {
      $(window).off("resize", _.eventFuncs[0].f);
      return;
    }

    var tempArray;
    var parentWidth = _.getContainerWidth(_.selector);
    var elemWidth = _.getWidth(_.selector, true);

    _.countInRow = parseInt(parentWidth / elemWidth);

    if (_.countElems < _.countInRow) {
      _.countInRow = _.countElems;
    } else if (!_.countInRow) {
      _.countInRow = 1;
    }

    _.countRows = Math.ceil(_.countElems / _.countInRow);
    _.centerRowIndex = parseInt(_.countInRow / 2);
    _.rightBorder = _.countInRow;
    _.rest = _.countElems % _.countInRow;
    _.firstRestIndex = _.countElems - _.rest;

    tempArray = _.correctCenterIndex(_.countInRow, _.centerRowIndex);
    _.centerRowIndex = tempArray[0];
    _.evenRowElems = tempArray[1];

    if (_.rest > 0) {
      _.centerLastRowIndex =
        parseInt(_.rest / 2) + (_.countRows - 1) * _.countInRow;
      tempArray = _.correctCenterIndex(_.rest, _.centerLastRowIndex);
      _.centerLastRowIndex = tempArray[0];
      _.evenLastRowElems = tempArray[1];
    }

    _.forLeftPos = [];
    _.forRightPos = [];

    for (var i = 0, j = 0; i < _.countInRow; i++) {
      if (i <= _.centerRowIndex) {
        if (i == _.centerRowIndex && !_.evenRowElems) {
          continue;
        }

        _.forLeftPos[i] = i;
      } else {
        _.forRightPos[j] = i;
        j++;
      }
    }

    _.$elems.each(function (index) {
      var $elem = $(this);
      var transitionStr = _.changedStyles[index] + " " + _.timingPosition;

      _.changedStyles[index] = _.getPosition(index);

      $elem.removeAttribute("style");
      $elem.css("position", "relative");

      $elem.css([_.changedStyles[index]], _.outPosition + "px");

      if (_.transform) {
        // console.log(_.getStyle($elem, 'transform'));
        $elem.css("transform", "scale(0)");
        transitionStr += ", transform " + _.timingTransform;
      }
    });

    $elem.css("transition", transitionStr);

    _.index = _.centerRowIndex;
  };

  Construct.prototype.show = function () {
    var _ = this;

    // var scrollY = _.getScrollY();
    // var elemParentTop = _.getElemCenterTop(_.parentID);

    // if (!_.started && scrollY >= elemParentTop)
    if (!_.started && _.isVisibleElem(_.parentID)) {
      _.showBlock();
      _.started = true;

      for (var i = 0, len = _.eventFuncs.length; i < len; i++) {
        $(window).off(_.eventFuncs[i].e, _.eventFuncs[i].f);
      }
    }
  };

  Construct.prototype.correctCenterIndex = function (rowLen, centerIndex) {
    var checkEvenRowElems = true;

    if (rowLen % 2 == 0) {
      centerIndex--;
    } else {
      checkEvenRowElems = false;
    }

    return [centerIndex, checkEvenRowElems];
  };

  Construct.prototype.getPosition = function (index) {
    var _ = this;
    var len = _.forLeftPos.length;
    var i;

    if (
      index >= _.firstRestIndex &&
      index == _.centerLastRowIndex &&
      !_.evenLastRowElems
    ) {
      return "bottom";
    }

    if (index >= _.firstRestIndex && index <= _.centerLastRowIndex) {
      return "left";
    }

    if (index > _.centerLastRowIndex && index < _.countElems) {
      return "right";
    }

    if (index % _.countInRow == _.centerRowIndex && !_.evenRowElems) {
      return "bottom";
    }

    for (i = 0; i < len; i++) {
      if (index % _.countInRow == _.forLeftPos[i]) {
        break;
      }
    }

    if (i < len) {
      return "left";
    }

    len = _.forRightPos.length;

    for (i = 0; i < len; i++) {
      if (index % _.countInRow == _.forRightPos[i]) {
        break;
      }
    }

    if (i < len) {
      return "right";
    }
  };

  Construct.prototype.showBlock = function () {
    var _ = this;
    var $elem = _.$elems.eq(_.index);

    if (_.transform) {
      $elem.css("transform", "scale(1)");
    }

    $elem.css([_.changedStyles[_.index]], 0);

    if (_.direction > 0) {
      _.shiftFromCenter++;
      _.index = _.centerRowIndex + _.shiftFromCenter;
      _.direction = -1;
    } else {
      _.index = _.centerRowIndex - _.shiftFromCenter;
      _.direction = 1;
    }

    if (_.index < _.rowNumber * _.countInRow || _.index >= _.rightBorder) {
      _.rowNumber++;
      _.shiftFromCenter = 0;
      _.direction = 1;

      if (_.rowNumber == _.countRows - 1 && _.rest > 0) {
        _.centerRowIndex = _.centerLastRowIndex;
        _.rightBorder = _.countElems;
      } else {
        _.centerRowIndex += _.countInRow;
        _.rightBorder = (_.rowNumber + 1) * _.countInRow;
      }

      _.index = _.centerRowIndex;
    }

    if (_.rowNumber < _.countRows) {
      setTimeout(function () {
        requestAnimationFrame(function () {
          _.showBlock();
        });
      }, _.interval);
    }
  };

  return Construct(arguments);
};
