var ReasanikBase = function () {
  "use strict";

  function Construct() {}

  Construct.prototype.windowResizeDelay = 0;
  Construct.prototype.windowWidth = window.innerWidth;
  Construct.prototype.screenHeightThird = 0;

  // Function "extend" was taken from Copyright (c) 2014 HubSpot, Inc.

  Construct.prototype.extend = function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];

      if (!obj) {
        continue;
      }

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          out[key] = obj[key];
        }
      }
    }

    return out;
  };

  Construct.prototype.isVisibleElem = function (containerID) {
    var _ = this;
    var scrollY = _.getScrollY();
    var topBorder = _.getElemCenterTop(containerID);
    // var bottomBorder = topBorder + parseInt(containerHeight);
    var bottomBorder = topBorder + parseInt(document.getElementById(containerID).offsetHeight);

    if (scrollY >= topBorder && scrollY <= bottomBorder) {
      return true;
    }

    return false;
  };

  Construct.prototype.resizeWindowWidth = function (callback) {
    var _ = this;

    if (window.innerWidth === _.windowWidth) {
      return;
    }

    if (_.windowResizeDelay) {
      clearTimeout(_.windowResizeDelay);
    }

    _.windowWidth = window.innerWidth;

    _.windowResizeDelay = setTimeout(function () {
      callback.apply(_);
    }, 50);
  };

  Construct.prototype.getScrollHeight = function () {
    return document.body.scrollHeight || document.documentElement.scrollHeight;
  };

  Construct.prototype.setScrollY = function (scrollY) {
    if (document.documentElement.scrollTop) {
      document.documentElement.scrollTop = scrollY;
    } else if (document.body.scrollTop) {
      document.body.scrollTop = scrollY;
    }
  };

  Construct.prototype.fillArray = function (arr, value) {
    if (arr.fill) {
      return arr.fill(value);
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i] = value;
    }

    return arr;
  };

  Construct.prototype.setErrorMessage = function (plugin, message) {
    message = message || "Not enough key parameters";

    console.log("------------------------------------------------");
    console.log("Plugin " + plugin + ": " + message + "!");
    console.log("------------------------------------------------");
  };

  Construct.prototype.getWidth = function (elem, withMargins) {
    var width = elem.offsetWidth;

    withMargins = withMargins || false;

    if (withMargins) {
      width += this.getStyle(elem, "marginLeft", "px");
      width += this.getStyle(elem, "marginRight", "px");
    }

    return width;
  };

  Construct.prototype.getStyle = function (elem, styleName, measure) {
    var style = getComputedStyle(elem)[styleName];

    if (measure) {
      style = parseInt(style.slice(0, style.length - measure.length));
    }

    return style;
  };

  Construct.prototype.getContainerWidth = function (elem) {
    var width = elem.parentNode.offsetWidth;

    width -= this.getStyle(elem.parentNode, "paddingLeft", "px");
    width -= this.getStyle(elem.parentNode, "paddingRight", "px");

    return width;
  };

  Construct.prototype.getDataAttr = function (elem, name) {
    if (elem.dataset) {
      return elem.dataset[name];
    }

    return elem.getAttribute("data-" + name);
  };

  Construct.prototype.getElemCenterTop = function (elemID) {
    this.screenHeightThird = parseInt(document.documentElement.clientHeight / 3);
    // var elem = document.querySelector('#' + elemID + ' .container');
    // var halfHeight = parseInt(document.documentElement.clientHeight/2);
    // var elemHalfHeight = parseInt(elem.offsetHeight/2);
    // console.log(height);
    return document.getElementById(elemID).offsetTop - this.screenHeightThird;
    // return document.getElementById(elemID).offsetTop - halfHeight + elemHalfHeight;
  };

  Construct.prototype.getScrollY = function () {
    return window.pageYOffset || document.documentElement.scrollTop;
  };

  Construct.prototype.getObjectLength = function (obj, returnPropertiesArray) {
    returnPropertiesArray = returnPropertiesArray || false;

    var propertiesArray = [];
    var count = 0;

    for (var prop in obj) {
      if (returnPropertiesArray) {
        propertiesArray[count] = prop;
      }

      count++;
    }

    if (returnPropertiesArray) {
      return { length: count, array: propertiesArray };
    }

    return count;
  };

  return Construct.prototype;
};
