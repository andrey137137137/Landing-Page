var Gallery = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "Gallery";

  Construct.prototype.init = function (params) {
    var self = this;

    params = this.extend(
      {
        rootFolder: "img/",
        name: false,
        items: false,
        categories: false,
        showCategory: false,
        lightBoxID: false,
        showMenu: true,
        childClass: "photo_block-wrap",
      },
      params,
    );

    if (!params.name || !params.items) {
      this.setErrorMessage(this.pluginName);
      return false;
    }

    this.name = params.name;
    this.rootFolder = params.rootFolder + this.name;
    this.items = params.items;
    this.childClass = params.childClass;
    this.categories = ["all"].concat(params.categories);
    this.showCategory = params.showCategory;
    this.showMenu = params.showMenu;

    var lightBoxID = this.name + "-" + params.lightBoxID;

    params = null;

    this.lightBox = document.getElementById(lightBoxID);

    // countInRow = 0;
    this.iter = 0;
    this.itemsCount = this.items.length;
    this.intervalID = 0;
    this.startedAnimation = false;
    this.shownItems;
    this.dataSrcName = "data-src";
    this.$slider;

    // elemWidth;
    // marginLeft;
    // marginEvenRow;
    // oldColClass;
    // evenRowsExist;

    // this.RestructItems = new RestructRhombuses.Construct({
    // 	selector: '#' + this.name + '-blocks.display_rhombuses',
    // 	childElem: '.' + this.childClass,
    // 	wait: true,
    // 	maxCols: 3
    // });

    this.RestructItems = RestructRhombuses({
      selector: "#" + this.name + "-blocks.display_rhombuses",
      childElem: "." + this.childClass,
      wait: true,
      maxCols: 4,
    });

    if (this.showMenu) {
      this.createMenu();
    }

    if (this.lightBox) {
      var sliderID = self.name + "-slider-demonstration";
      var closeID = self.name + "-slider-close";
      var prevID = self.name + "-slider-prev";
      var nextID = self.name + "-slider-next";
      var sliderTempInnerHTML = "";

      self.items.map(function (item, index) {
        var tempImageName = index + 1 + ".jpg";

        sliderTempInnerHTML +=
          '<li><div class="img_wrap portfolio_lightbox-img_wrap">' +
          self.getPicture(tempImageName, "img_wrap-img blog-img", index) +
          '</div><div class="lightbox-desc_container portfolio_lightbox-desc_container"><p>' +
          item.category +
          "</p></div></li>";
      });
      document.getElementById(sliderID).innerHTML = sliderTempInnerHTML;

      self.$slider = $("#" + sliderID);
      self.$slider.slick({
        arrows: false,
        dots: false,
      });
      $("#" + prevID).on("click", function () {
        $(self.$slider).slick("slickPrev");
      });
      $("#" + nextID).on("click", function () {
        $(self.$slider).slick("slickNext");
      });

      self.lightBox.addEventListener("click", function (event) {
        var elem = event.target;
        var tagName = elem.tagName.toLowerCase();

        if (tagName !== "a" && elem.parentNode.tagName.toLowerCase() !== "a") {
          return;
        }

        if (tagName !== "a") {
          elem = elem.parentNode;
        }

        if (elem.id !== closeID && elem.id !== prevID && elem.id !== nextID) {
          return;
        }

        console.log(elem);
        event.preventDefault();

        if (elem.id === closeID) {
          self.lightBox.classList.add("lightbox--hidden");
        }
        // else if (elem.id === prevID) {
        //   self.changeSlide(-1);
        // } else if (elem.id === nextID) {
        //   self.changeSlide(1);
        // }
      });

      document.getElementById(this.name + "-blocks").addEventListener("click", function (event) {
        event.preventDefault();

        var elem = event.target;
        var tagName = elem.tagName.toLowerCase();
        var index;

        if (tagName !== "a" && elem.parentNode.tagName.toLowerCase() !== "a") {
          return;
        }

        // if (tagName === 'a' || elem.parentNode.tagName.toLowerCase() === 'a')
        // {
        if (tagName != "a") {
          elem = elem.parentNode;
        }

        index = +elem.getAttribute("data-index");
        // document.querySelector('#' + lightBoxID + ' img').src = 'images/' + self.name + '/' + (index + 1) + '.jpg';

        // self.lightBox.setAttribute("data-index", index);
        $(self.$slider).slick("slickGoTo", index, true);
        self.lightBox.classList.remove("lightbox--hidden");
        // self.changeSlide(0);
        // }
      });
    }

    this.eventFuncs = [
      {
        e: "resize",
        f: function () {
          self.showItems();
        },
      },
      {
        e: "scroll",
        f: function () {
          self.showItems();
        },
      },
      {
        e: "orientationChange",
        f: function () {
          self.showItems();
        },
      },
    ];

    for (var i = 0; i < this.eventFuncs.length; i++) {
      window.addEventListener(this.eventFuncs[i].e, this.eventFuncs[i].f);
    }

    this.showItems();
  };

  Construct.prototype.getPictureSources = function (imageName) {
    var self = this;
    var breakpoints = [
      { path: "d", value: 1170 },
      { path: "t", value: 768 },
    ];
    var result = "";

    breakpoints.forEach(function (breakpoint) {
      result +=
        '<source srcset="' +
        self.rootFolder +
        "/" +
        breakpoint.path +
        "/" +
        imageName +
        '" srcset="" media="(min-width: ' +
        breakpoint.value +
        'px)">';
    });

    return result;
  };

  Construct.prototype.getPicture = function (imageName, classes, index) {
    return (
      "<picture>" +
      this.getPictureSources(imageName) +
      '<img class="' +
      classes +
      '" src="' +
      this.rootFolder +
      "/m/" +
      imageName +
      '" alt="' +
      this.items[index].title +
      '"></picture>'
    );
  };

  Construct.prototype.changeSlide = function (direction) {
    var index = +this.lightBox.getAttribute("data-index");
    var imgContainer = this.lightBox.querySelector(".img_wrap");
    var tempInnerHTML;
    var tempImageName;

    if (direction > 0) {
      index++;
    } else if (direction < 0) {
      index--;
    }

    index = this.getSlideIndex(index);

    tempImageName = index + 1 + ".jpg";

    // console.log(index);

    this.lightBox.setAttribute("data-index", index);

    // imgContainer.src = this.rootFolder + (index + 1) + '.jpg';
    // imgContainer.alt = this.items[index].title + ' ' + (index + 1);

    imgContainer.innerHTML = this.getPicture(tempImageName, "img_wrap-img blog-img", index);

    if (this.items[index].description) {
      tempInnerHTML = this.items[index].description;
    } else {
      tempInnerHTML = "Нет описания к данной фотографии.";
    }

    this.lightBox.querySelector("p").innerHTML = tempInnerHTML;
  };

  Construct.prototype.getSlideIndex = function (index) {
    if (index >= 0) {
      return index % this.items.length;
    }

    return index + this.items.length;
  };

  Construct.prototype.showItems = function () {
    var self = this;

    // if (!this.startedAnimation && this.getScrollY() >= this.getElemCenterTop(this.name))
    if (!this.startedAnimation && self.isVisibleElem(self.name)) {
      this.restructItems();

      for (var i = 0, len = this.eventFuncs.length; i < len; i++) {
        window.removeEventListener(this.eventFuncs[i].e, this.eventFuncs[i].f);
      }
    }
  };

  Construct.prototype.restructItems = function (catIndex) {
    catIndex = catIndex || 0;

    var self = this;
    this.parentElem = document.getElementById(this.name + "-blocks");
    var menuItems = document.querySelectorAll("#" + this.name + "-menu a");
    // var catIndex = parseInt(elem.dataset.catIndex);
    // var catIndex = parseInt(catIndex);
    // var tempBlockWrap;
    // var tempImageContainer;
    var tempImageName;
    // var tempLink;
    var tempInnerHTML = "";
    var i, len;

    this.startedAnimation = true;
    this.iter = 0;
    this.itemsCount = 0;
    this.parentElem.innerHTML = "";

    for (i = 0, len = this.items.length; i < len; i++) {
      if (!!catIndex && this.items[i].category != catIndex) {
        continue;
      }

      // tempInnerHTML += '<div class="' + this.childClass + '"><div class="photo_block-frame"><div class="photo_block-rhombus"><img class="photo_block-img" src="' + this.rootFolder + (i + 1) + '.jpg" alt="' + this.items[i].title + '"><div class="photo_block-foreground"></div><h3 class="section-title photo_block-title">' + this.items[i].title + '</h3></div></div>';

      tempImageName = i + 1 + ".jpg";

      tempInnerHTML +=
        '<div class="' +
        this.childClass +
        '"><div class="photo_block-frame"><div class="photo_block-rhombus">' +
        this.getPicture(tempImageName, "photo_block-img", i) +
        '<div class="photo_block-foreground"></div><h3 class="section-title photo_block-title">' +
        this.items[i].title +
        "</h3></div></div>";

      if (this.showCategory) {
        tempInnerHTML +=
          '<div class="rhombus_wrap rhombus_wrap--btn rhombus_wrap--category photo_block-category"><div class="rhombus_wrap-rhombus"></div></div>';
      }

      tempInnerHTML +=
        '<a href="#" data-index="' +
        i +
        '" class="rhombus_wrap rhombus_wrap--btn rhombus_wrap--more photo_block-more"><div class="rhombus_wrap-rhombus"></div></a></div>';

      this.itemsCount++;
    }

    if (!tempInnerHTML) {
      tempInnerHTML = "К сожалению в данной категории нет фотографий!";
    }

    this.createHelpArray();
    this.parentElem.innerHTML = tempInnerHTML;

    len = menuItems.length;

    if (len) {
      for (i = 0; i < len; i++) {
        menuItems[i].classList.remove("active");
      }

      menuItems[catIndex].classList.add("active");
    }

    this.RestructItems.run(true);

    if (this.itemsCount) {
      if (this.intervalID) {
        clearInterval(this.intervalID);
        this.intervalID = 0;
      }

      this.intervalID = setInterval(function () {
        self.randomShowing();
      }, 170);
    }
  };

  Construct.prototype.createMenu = function () {
    var self = this;

    var container = document.createElement("div");
    var menu = document.createElement("ul");
    var tempInnerHTML = "";

    container.className = "menu-container section-flex_container";

    menu.id = this.name + "-menu";
    menu.className = "hor_menu " + this.name + "-menu";

    for (var i = 0, len = this.categories.length; i < len; i++) {
      tempInnerHTML += '<li class="list-item"><a class="list-link';

      if (!i) {
        tempInnerHTML += " active";
      }

      tempInnerHTML += '" href="#" data-index="' + i + '">' + this.categories[i] + "</a></li>";
    }

    // tempInnerHTML += '<li id="grid-switcher-squares"><a data-display="squares" href="#"></a></li>';
    // tempInnerHTML += '<li id="grid-switcher-rhombuses"><a class="active" data-display="rhombuses" href="#"></a></li>';

    menu.innerHTML = tempInnerHTML;

    menu.addEventListener("click", function (event) {
      var elem = event.target;
      // var index;
      // var display;

      if (elem.tagName != "A") {
        return;
      }

      event.preventDefault();

      if (elem.hasAttribute("data-index")) {
        self.restructItems(+elem.getAttribute("data-index"));
      }
      // else if (elem.hasAttribute('data-display'))
      // {
      // 	display = elem.getAttribute('data-display');
      // 	console.log(self.parentElem);

      // 	self.parentElem.classList.remove('display_rhombuses');
      // 	self.parentElem.classList.remove('display-squares');
      // 	self.parentElem.classList.add('display-' + display);
      // }
    });

    container.appendChild(menu);

    document
      .querySelector("#" + this.name + " .section-container")
      .insertBefore(container, document.getElementById(this.name + "-blocks"));
  };

  Construct.prototype.createHelpArray = function () {
    // this.shownItems = new Array(this.itemsCount);
    this.shownItems = this.fillArray(new Array(this.itemsCount), 0);
  };

  Construct.prototype.randomShowing = function () {
    var elem;
    var index;

    do {
      index = parseInt(Math.random() * this.itemsCount);
    } while (this.shownItems[index]);

    elem = document.querySelector(
      "#" + this.name + "-blocks ." + this.childClass + ":nth-child(" + (index + 1) + ")",
    );

    // this.items[index].style.opacity = 1;
    // this.items[index].style.backgroundColor = 'rgb(0, ' + (this.iter*10) + ', 0)';

    elem.style.opacity = 1;
    this.shownItems[index] = 1;
    this.iter++;

    if (this.iter >= this.itemsCount) {
      clearInterval(this.intervalID);
      this.intervalID = 0;
    }
  };

  return Construct(arguments);
};
