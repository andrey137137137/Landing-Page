var RestructRhombuses = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "RestructRhombuses";

  Construct.prototype.init = function (params) {
    var _ = this;

    params = _.extend(
      {
        selector: false,
        childElem: false,
        wait: false,
        maxCols: 0,
        spaceBetweenBlocks: 20,
        colClassPrefix: "col",
        firstInOddRowClass: "col--first_in_odd_row",
        firstInEvenRowClass: "col--first_in_even_row",
        lastInEvenRowClass: "col--last_in_even_row",
      },
      params
    );

    if (!params.selector || !params.childElem) {
      _.setErrorMessage(_.pluginName);
      return false;
    }

    _.selector = params.selector;
    _.childElem = params.childElem;

    _.colClassPrefix = params.colClassPrefix;
    _.firstInOddRowClass = params.firstInOddRowClass;
    _.firstInEvenRowClass = params.firstInEvenRowClass;
    _.lastInEvenRowClass = params.lastInEvenRowClass;
    _.maxCols = params.maxCols;
    _.spaceBetweenBlocks = params.spaceBetweenBlocks;

    var wait = params.wait;

    params = null;

    _.countInRow = 0;

    _.elemWidth;
    // _.marginLeft;
    // _.marginEvenRow;
    _.oldColClass;
    // _.evenRowsExist;

    _.oldElemWidth = 0;
    _.oldCountInRow = 0;
    _.oldElemsCount = 0;

    if (!wait) {
      _.run();
    }

    $(window).on("resize", function () {
      // _.run();
      _.resizeWindowWidth(_.run);
    });
    $(window).on("orientationChange", function () {
      _.resizeWindowWidth(_.run);
    });
  };

  Construct.prototype.run = function (restruct) {
    var _ = this;
    var $parent = $(_.selector);
    var $elems = $parent.find(_.childElem);
    var firstElemSelector = _.selector + " " + _.childElem;

    restruct = restruct || false;

    if (!$elems.length) {
      $parent.removeClass(_.oldColClass);
      return;
    }

    var parentWidth = $parent.parent().width();
    // var parentWidthWithMargins;
    var countElems = $elems.length;
    // var tempCountInRow;
    var firstOddElemIndex;
    var firstEvenElemIndex;
    // var lastEvenElemIndex;
    var step;
    var newColClass = _.colClassPrefix;

    _.elemWidth = _.getWidth(firstElemSelector);

    var rightMargin = _.getStyle($(firstElemSelector), "marginRight", "px");
    _.elemWidth = _.elemWidth + rightMargin * 2;

    _.countInRow = parseInt(parentWidth / _.elemWidth);
    // tempCountInRow = parseInt(parentWidth/_.elemWidth);

    // parentWidthWithMargins = parentWidth + _.spaceBetweenBlocks*(tempCountInRow - 1);

    // _.countInRow = parseInt(parentWidthWithMargins/_.elemWidth);

    if (countElems <= _.countInRow) {
      _.countInRow = countElems;
    }

    console.log("---------------");
    console.log(_.oldElemWidth);
    console.log(_.oldCountInRow);
    console.log(_.oldElemsCount);
    console.log(restruct);

    if (
      _.oldElemWidth === _.elemWidth &&
      _.oldCountInRow === _.countInRow &&
      _.oldElemsCount === countElems &&
      !restruct
    ) {
      return;
    }

    console.log(_.elemWidth);
    console.log(_.countInRow);
    console.log(countElems);

    if (_.maxCols > 0 && _.countInRow > _.maxCols) {
      _.countInRow = _.maxCols;
    }

    _.oldElemWidth = _.elemWidth;
    _.oldCountInRow = _.countInRow;
    _.oldElemsCount = countElems;

    firstOddElemIndex = 0;
    firstEvenElemIndex = _.countInRow;

    if (_.countInRow > 1) {
      step = _.countInRow * 2 - 1;
    } else {
      step = 2;
    }

    $elems.each(function (index) {
      var $elem = $(this);

      $elem.removeClass(_.firstInOddRowClass);
      $elem.removeClass(_.firstInEvenRowClass);
      // $(this).removeClass(_.lastInEvenRowClass);

      if (firstOddElemIndex == index) {
        $elem.addClass(_.firstInOddRowClass);
      }

      if (firstEvenElemIndex == index) {
        $elem.addClass(_.firstInEvenRowClass);

        // lastEvenElemIndex = firstEvenElemIndex + _.countInRow - 2;
        // firstOddElemIndex = lastEvenElemIndex + 1;
        if (_.countInRow > 1) {
          firstOddElemIndex = firstEvenElemIndex + _.countInRow - 1;
        } else {
          firstOddElemIndex += step;
        }

        firstEvenElemIndex += step;
      }

      // if (lastEvenElemIndex == index)
      // {
      // 	$(this).addClass(_.lastInEvenRowClass);
      // }
    });

    if (_.countInRow > 1) {
      newColClass += "_" + _.countInRow;
    }

    if (_.oldColClass) {
      $parent.removeClass(_.oldColClass);
    }

    $parent.addClass(newColClass);
    _.oldColClass = newColClass;
  };

  return Construct(arguments);
};
