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
    var _ = this;

    params = _.extend(
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

    if (!params.name || !params.categories) {
      _.setErrorMessage(_.pluginName);
      return false;
    }

    _.name = params.name;
    _.rootFolder = params.rootFolder + _.name;
    // _.items = params.items;
    _.childClass = params.childClass;
    _.categories = [{ title: "all", items: [] }].concat(params.categories);
    _.showCategory = params.showCategory;
    _.showMenu = params.showMenu;

    var lightBoxID = _.name + "-" + params.lightBoxID;

    params = null;

    _.lightBox = document.getElementById(lightBoxID);

    // countInRow = 0;
    _.iter = 0;
    _.itemsCount;
    _.intervalID = 0;
    _.startedAnimation = false;
    _.shownItems;
    _.dataSrcName = "data-src";
    _.slideCategoryPrefix = "gallery_category_";
    _.curCategory = 0;
    _.$slider;
    _.sliderID = _.name + "-slider-demonstration";
    _.prevID = _.name + "-slider-prev";
    _.nextID = _.name + "-slider-next";

    // elemWidth;
    // marginLeft;
    // marginEvenRow;
    // oldColClass;
    // evenRowsExist;

    // _.RestructItems = new RestructRhombuses.Construct({
    // 	selector: '#' + _.name + '-blocks.display_rhombuses',
    // 	childElem: '.' + _.childClass,
    // 	wait: true,
    // 	maxCols: 3
    // });

    _.RestructItems = RestructRhombuses({
      selector: "#" + _.name + "-blocks.display_rhombuses",
      childElem: "." + _.childClass,
      wait: true,
      maxCols: 4,
    });

    if (_.showMenu) {
      _.createMenu();
    }

    if (_.lightBox) {
      var closeID = _.name + "-slider-close";
      var sliderTempInnerHTML = "";

      console.log(_.categories);

      _.categories.forEach(function (category, catIndex) {
        category.items.forEach(function (item, itemIndex) {
          sliderTempInnerHTML += _.slideTemplate(catIndex, item, itemIndex);
        });
      });
      document.getElementById(_.sliderID).innerHTML = sliderTempInnerHTML;

      _.$slider = $("#" + _.sliderID);
      _.$slider.slick({
        arrows: false,
        dots: false,
      });
      _.$slider.on("reInit", function (event, slick) {
        console.log("reInit");
      });
      $("#" + _.prevID).on("click", function () {
        $(_.$slider).slick("slickPrev");
      });
      $("#" + _.nextID).on("click", function () {
        $(_.$slider).slick("slickNext");
      });

      _.lightBox.addEventListener("click", function (event) {
        var elem = event.target;
        var tagName = elem.tagName.toLowerCase();

        if (tagName !== "a" && elem.parentNode.tagName.toLowerCase() !== "a") {
          return;
        }

        if (tagName !== "a") {
          elem = elem.parentNode;
        }

        if (elem.id !== closeID && elem.id !== _.prevID && elem.id !== _.nextID) {
          return;
        }

        // console.log(elem);
        event.preventDefault();

        if (elem.id === closeID) {
          _.lightBox.classList.add("lightbox--hidden");
        }
        // else if (elem.id === _.prevID) {
        //   _.changeSlide(-1);
        // } else if (elem.id === _.nextID) {
        //   _.changeSlide(1);
        // }
      });

      document.getElementById(_.name + "-blocks").addEventListener("click", function (event) {
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
        // document.querySelector('#' + lightBoxID + ' img').src = 'images/' + _.name + '/' + (index + 1) + '.jpg';

        // _.lightBox.setAttribute("data-index", index);
        _.changeSlide(0);
        _.lightBox.classList.remove("lightbox--hidden");
        // }
      });
    }

    _.eventFuncs = [
      {
        e: "resize",
        f: function () {
          _.showItems();
        },
      },
      {
        e: "scroll",
        f: function () {
          _.showItems();
        },
      },
      {
        e: "orientationChange",
        f: function () {
          _.showItems();
        },
      },
    ];

    for (var i = 0; i < _.eventFuncs.length; i++) {
      window.addEventListener(_.eventFuncs[i].e, _.eventFuncs[i].f);
    }

    _.showItems();
  };

  Construct.prototype.changeSlide = function (index) {
    var _ = this;

    // if (_.curCategory == 0 || _.categories[_.curCategory].items.length > 1) {
    $(_.$slider).slick("slickGoTo", index);
    // } else {
    //   var $slide = document.createElement("div");
    //   $slide.innerHTML = _.slideTemplate(_.curCategory, _.categories[_.curCategory].items[0], 0);
    //   _.$slider.after($slide);
    // }
  };

  Construct.prototype.slideTemplate = function (catIndex, item, itemIndex) {
    var _ = this;
    return (
      '<div class="' +
      _.slideCategoryPrefix +
      catIndex +
      '"><div class="img_wrap ' +
      _.name +
      '_lightbox-img_wrap">' +
      _.getPicture("img_wrap-img blog-img", catIndex, itemIndex) +
      '</div><div class="lightbox-desc_container ' +
      _.name +
      '_lightbox-desc_container"><p>' +
      item.description +
      "</p></div></div>"
    );
  };

  Construct.prototype.getCategoryPath = function (catIndex, itemIndex) {
    var _ = this;
    // var imageName = itemIndex + 1 + ".jpg";
    return _.categories[catIndex].title + "/" + (itemIndex + 1) + ".jpg";
  };

  Construct.prototype.getPictureSources = function (imageName) {
    var _ = this;
    var breakpoints = [
      { path: "d", value: 1170 },
      { path: "t", value: 768 },
    ];
    var result = "";

    breakpoints.forEach(function (breakpoint) {
      result +=
        '<source srcset="' +
        _.rootFolder +
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

  Construct.prototype.getPicture = function (classes, catIndex, itemIndex) {
    var _ = this;
    var categoryPath = _.getCategoryPath(catIndex, itemIndex);
    return (
      "<picture>" +
      _.getPictureSources(categoryPath) +
      '<img class="' +
      classes +
      '" src="' +
      _.rootFolder +
      "/m/" +
      categoryPath +
      '" alt="' +
      _.categories[catIndex].items[itemIndex].title +
      '"></picture>'
    );
  };

  Construct.prototype.showItems = function () {
    var _ = this;

    // if (!_.startedAnimation && _.getScrollY() >= _.getElemCenterTop(_.name))
    if (!_.startedAnimation && _.isVisibleElem(_.name)) {
      _.setRhombusesByCategory();

      for (var i = 0, len = _.eventFuncs.length; i < len; i++) {
        window.removeEventListener(_.eventFuncs[i].e, _.eventFuncs[i].f);
      }
    }
  };

  Construct.prototype.getItemsByCategory = function () {
    var _ = this;

    if (!_.curCategory && !_.categories[0].items.length) {
      _.categories.forEach(function (category, index) {
        if (index > 0) {
          category.items.forEach(function (item) {
            _.categories[0].items.push(item);
          });
        }
      });
    }

    return _.categories[_.curCategory].items;
  };

  Construct.prototype.setRhombusesByCategory = function () {
    var _ = this;

    _.parentElem = document.getElementById(_.name + "-blocks");

    var menuItems = document.querySelectorAll("#" + _.name + "-menu a");
    // var tempBlockWrap;
    // var tempImageContainer;
    var tempImageName;
    // var tempLink;
    var tempInnerHTML = "";
    var i, len;

    _.startedAnimation = true;
    _.iter = 0;
    _.itemsCount = 0;
    _.parentElem.innerHTML = "";

    _.getItemsByCategory().forEach(function (item, itemIndex) {
      tempInnerHTML +=
        '<div class="' +
        _.childClass +
        '"><div class="photo_block-frame"><div class="photo_block-rhombus">' +
        _.getPicture("photo_block-img", _.curCategory, itemIndex) +
        '<div class="photo_block-foreground"></div><h3 class="section-title photo_block-title">' +
        item.title +
        "</h3></div></div>";

      if (_.showCategory) {
        tempInnerHTML +=
          '<div class="rhombus_wrap rhombus_wrap--btn rhombus_wrap--category photo_block-category"><div class="rhombus_wrap-rhombus"></div></div>';
      }

      tempInnerHTML +=
        '<a href="#" data-index="' +
        itemIndex +
        '" class="rhombus_wrap rhombus_wrap--btn rhombus_wrap--more photo_block-more"><div class="rhombus_wrap-rhombus"></div></a></div>';

      _.itemsCount++;
    });

    if (!tempInnerHTML) {
      tempInnerHTML = "К сожалению в данной категории нет фотографий!";
    }

    _.createHelpArray();
    _.parentElem.innerHTML = tempInnerHTML;

    len = menuItems.length;

    if (len) {
      for (i = 0; i < len; i++) {
        menuItems[i].classList.remove("active");
      }

      menuItems[_.curCategory].classList.add("active");
    }

    _.RestructItems.run(true);

    if (_.itemsCount) {
      if (_.intervalID) {
        clearInterval(_.intervalID);
        _.intervalID = 0;
      }

      _.intervalID = setInterval(function () {
        _.randomShowing();
      }, 170);
    }
  };

  Construct.prototype.createMenu = function () {
    var _ = this;

    var container = document.createElement("div");
    var menu = document.createElement("ul");
    var tempInnerHTML = "";

    container.className = "menu-container section-flex_container";

    menu.id = _.name + "-menu";
    menu.className = "hor_menu " + _.name + "-menu";

    _.categories.forEach(function (category, index) {
      tempInnerHTML += '<li class="list-item"><a class="list-link';

      if (!index) {
        tempInnerHTML += " active";
      }

      tempInnerHTML += '" href="#" data-index="' + index + '">' + category.title + "</a></li>";
    });

    // tempInnerHTML += '<li id="grid-switcher-squares"><a data-display="squares" href="#"></a></li>';
    // tempInnerHTML += '<li id="grid-switcher-rhombuses"><a class="active" data-display="rhombuses" href="#"></a></li>';

    menu.innerHTML = tempInnerHTML;

    menu.addEventListener("click", function (event) {
      var elem = event.target;
      var index;
      // var display;

      if (elem.tagName != "A") {
        return;
      }

      event.preventDefault();

      if (elem.hasAttribute("data-index")) {
        _.curCategory = +elem.getAttribute("data-index");
        _.setRhombusesByCategory();

        $(_.$slider).slick("slickUnfilter");

        if (_.curCategory > 0) {
          $(_.$slider)
            .slick("slickFilter", "." + _.slideCategoryPrefix + _.curCategory)
            .slick("refresh");
        }
      }
      // else if (elem.hasAttribute('data-display'))
      // {
      // 	display = elem.getAttribute('data-display');
      // 	console.log(_.parentElem);

      // 	_.parentElem.classList.remove('display_rhombuses');
      // 	_.parentElem.classList.remove('display-squares');
      // 	_.parentElem.classList.add('display-' + display);
      // }
    });

    container.appendChild(menu);

    document
      .querySelector("#" + _.name + " .section-container")
      .insertBefore(container, document.getElementById(_.name + "-blocks"));
  };

  Construct.prototype.createHelpArray = function () {
    var _ = this;
    // _.shownItems = new Array(_.itemsCount);
    _.shownItems = _.fillArray(new Array(_.itemsCount), 0);
  };

  Construct.prototype.randomShowing = function () {
    var _ = this;
    var elem;
    var index;

    do {
      index = parseInt(Math.random() * _.itemsCount);
    } while (_.shownItems[index]);

    elem = document.querySelector(
      "#" + _.name + "-blocks ." + _.childClass + ":nth-child(" + (index + 1) + ")",
    );

    // _.items[index].style.opacity = 1;
    // _.items[index].style.backgroundColor = 'rgb(0, ' + (_.iter*10) + ', 0)';

    elem.style.opacity = 1;
    _.shownItems[index] = 1;
    _.iter++;

    if (_.iter >= _.itemsCount) {
      clearInterval(_.intervalID);
      _.intervalID = 0;
    }
  };

  return Construct(arguments);
};
