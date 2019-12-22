var baseMixin = {
  data: function() {
    return {
      windowResizeDelay: 0,
      windowWidth: window.innerWidth,
      screenHeightThird: 0
    };
  },
  methods: {
    isVisibleElem: function(containerID) {
      var self = this;

      var scrollY = self.getScrollY();
      var topBorder = self.getElemCenterTop(containerID);
      // var bottomBorder = topBorder + parseInt(containerHeight);
      var bottomBorder =
        topBorder + parseInt(document.getElementById(containerID).offsetHeight);

      if (scrollY >= topBorder && scrollY <= bottomBorder) {
        return true;
      }

      return false;
    },

    resizeWindowWidth: function(callback) {
      var self = this;

      if (window.innerWidth === self.windowWidth) {
        return;
      }

      if (self.windowResizeDelay) {
        clearTimeout(self.windowResizeDelay);
      }

      self.windowWidth = window.innerWidth;

      self.windowResizeDelay = setTimeout(function() {
        callback.apply(self);
      }, 50);
    },

    getScrollHeight: function() {
      return (
        document.body.scrollHeight || document.documentElement.scrollHeight
      );
    },

    setScrollY: function(scrollY) {
      if (document.documentElement.scrollTop) {
        document.documentElement.scrollTop = scrollY;
      } else if (document.body.scrollTop) {
        document.body.scrollTop = scrollY;
      }
    },

    fillArray: function(arr, value) {
      if (arr.fill) {
        return arr.fill(value);
      }

      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i] = value;
      }

      return arr;
    },

    setErrorMessage: function(plugin, message) {
      message = message || "Not enough key parameters";

      console.log("------------------------------------------------");
      console.log("Plugin " + plugin + ": " + message + "!");
      console.log("------------------------------------------------");
    },

    getWidth: function(elem, withMargins) {
      var width = elem.offsetWidth;

      withMargins = withMargins || false;

      if (withMargins) {
        width += this.getStyle(elem, "marginLeft", "px");
        width += this.getStyle(elem, "marginRight", "px");
      }

      return width;
    },

    getStyle: function(elem, styleName, measure) {
      var style = getComputedStyle(elem)[styleName];

      if (measure) {
        style = parseInt(style.slice(0, style.length - measure.length));
      }

      return style;
    },

    getContainerWidth: function(elem) {
      var width = elem.parentNode.offsetWidth;

      width -= this.getStyle(elem.parentNode, "paddingLeft", "px");
      width -= this.getStyle(elem.parentNode, "paddingRight", "px");

      return width;
    },

    getDataAttr: function(elem, name) {
      if (elem.dataset) {
        return elem.dataset[name];
      }

      return elem.getAttribute("data-" + name);
    },

    getElemCenterTop: function(elemID) {
      this.screenHeightThird = parseInt(
        document.documentElement.clientHeight / 3
      );
      // var elem = document.querySelector('#' + elemID + ' .container');
      // var halfHeight = parseInt(document.documentElement.clientHeight/2);
      // var elemHalfHeight = parseInt(elem.offsetHeight/2);
      // console.log(height);
      return document.getElementById(elemID).offsetTop - this.screenHeightThird;
      // return document.getElementById(elemID).offsetTop - halfHeight + elemHalfHeight;
    },

    getScrollY: function() {
      return window.pageYOffset || document.documentElement.scrollTop;
    },

    getObjectLength: function(obj, returnPropertiesArray) {
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
    }
  }
};

var vm = new Vue({
  el: '#portfolio-blocks',
  props: {
    selector: { type: String, required: true },
    childElem: { type: String, required: true },
    wait: { type: Boolean, default: false },
    maxCols: { type: Number, default: 0 },
    spaceBetweenBlocks: { type: Number, default: 20 },
    colClassPrefix: { type: String, default: "col" },
    firstInOddRowClass: { type: String, default: "col--first_in_odd_row" },
    firstInEvenRowClass: { type: String, default: "col--first_in_even_row" },
    lastInEvenRowClass: { type: String, default: "col--last_in_even_row" }
  },
  mixin: [baseMixin],
  data: function() {
    return {
      countInRow: 0,
      oldElemWidth: 0,
      oldCountInRow: 0,
      oldElemsCount: 0,
      elemWidth: 0,
      oldColClass: ""
    };
  },
  methods: {
    run = function(restruct) {
      restruct = restruct || false;
  
      var elems = document.querySelectorAll(this.selector + " " + this.childElem);
      var parent = document.querySelector(this.selector);
  
      if (!elems.length) {
        parent.classList.remove(this.oldColClass);
        return;
      }
  
      var parentWidth = parent.parentNode.offsetWidth;
      // var parentWidthWithMargins;
      var countElems = elems.length;
      // var tempCountInRow;
      var firstOddElemIndex;
      var firstEvenElemIndex;
      // var lastEvenElemIndex;
      var step;
      var newColClass = this.colClassPrefix;
  
      // this.elemWidth = this.getWidth(elems[0], true);
      this.elemWidth = this.getWidth(elems[0]);
      var rightMargin = this.getStyle(elems[0], "marginRight", "px");
      this.elemWidth = this.elemWidth + rightMargin * 2;
      console.log(parentWidth);
      console.log(this.elemWidth);
      this.countInRow = parseInt(parentWidth / this.elemWidth);
      // tempCountInRow = parseInt(parentWidth/this.elemWidth);
  
      // parentWidthWithMargins = parentWidth + this.spaceBetweenBlocks*(tempCountInRow - 1);
  
      // this.countInRow = parseInt(parentWidthWithMargins/this.elemWidth);
  
      if (countElems <= this.countInRow) {
        this.countInRow = countElems;
      }
  
      console.log("---------------");
      console.log(this.oldElemWidth);
      console.log(this.oldCountInRow);
      console.log(this.oldElemsCount);
      console.log(restruct);
  
      if (
        this.oldElemWidth === this.elemWidth &&
        this.oldCountInRow === this.countInRow &&
        this.oldElemsCount === countElems &&
        !restruct
      ) {
        return;
      }
  
      console.log(this.elemWidth);
      console.log(this.countInRow);
      console.log(countElems);
  
      if (this.maxCols > 0 && this.countInRow > this.maxCols) {
        this.countInRow = this.maxCols;
      }
  
      this.oldElemWidth = this.elemWidth;
      this.oldCountInRow = this.countInRow;
      this.oldElemsCount = countElems;
  
      firstOddElemIndex = 0;
      firstEvenElemIndex = this.countInRow;
  
      if (this.countInRow > 1) {
        step = this.countInRow * 2 - 1;
      } else {
        step = 2;
      }
  
      for (var i = 0; i < countElems; i++) {
        elems[i].classList.remove(this.firstInOddRowClass);
        elems[i].classList.remove(this.firstInEvenRowClass);
        // elems[i].classList.remove(this.lastInEvenRowClass);
  
        if (firstOddElemIndex == i) {
          elems[i].classList.add(this.firstInOddRowClass);
        }
  
        if (firstEvenElemIndex == i) {
          elems[i].classList.add(this.firstInEvenRowClass);
  
          // lastEvenElemIndex = firstEvenElemIndex + this.countInRow - 2;
          // firstOddElemIndex = lastEvenElemIndex + 1;
          if (this.countInRow > 1) {
            firstOddElemIndex = firstEvenElemIndex + this.countInRow - 1;
          } else {
            firstOddElemIndex += step;
          }
  
          firstEvenElemIndex += step;
        }
  
        // if (lastEvenElemIndex == i)
        // {
        // 	elems[i].classList.add(this.lastInEvenRowClass);
        // }
      }
  
      if (this.countInRow > 1) {
        newColClass += "_" + this.countInRow;
      }
  
      if (this.oldColClass) {
        parent.classList.remove(this.oldColClass);
      }
  
      parent.classList.add(newColClass);
      this.oldColClass = newColClass;
    }
  },
  mounted: function() {
    var self = this;

    if (!self.wait) {
      self.run();
    }

    window.addEventListener("resize", function() {
      // self.run();
      self.resizeWindowWidth(self.run);
    });
  }
});
