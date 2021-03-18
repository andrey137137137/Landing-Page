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
    _.childClass = params.childClass;
    _.categories = [{ title: "all", items: [] }].concat(params.categories);
    _.showCategory = params.showCategory;
    _.showMenu = params.showMenu;

    var lightBoxID = _.name + "-" + params.lightBoxID;

    params = null;

    _.$lightBox = $("#" + lightBoxID);
    _.$parentElem = $("#" + _.name + "-blocks");

    _.iter = 0;
    _.itemsCount;
    _.intervalID = 0;
    _.startedAnimation = false;
    _.shownItems;
    _.dataSrcName = "data-src";
    _.slideCategoryPrefix = "gallery_category_";
    _.curCategory = 0;
    _.sliderID = _.name + "-slider-demonstration";
    _.prevID = _.name + "-slider-prev";
    _.nextID = _.name + "-slider-next";
    _.$slider;
    _.$prev;
    _.$next;
    _.enableArrows = true;
    _.existEmptySlide = false;

    // countInRow = 0;
    // elemWidth;
    // marginLeft;
    // marginEvenRow;
    // oldColClass;
    // evenRowsExist;

    _.RestructItems = RestructRhombuses({
      selector: "#" + _.name + "-blocks.display_rhombuses",
      childElem: "." + _.childClass,
      wait: true,
      maxCols: 4,
    });

    if (_.showMenu) {
      _.createMenu();
    }

    if (_.$lightBox) {
      var closeID = _.name + "-slider-close";
      var sliderTempHTML = "";

      _.categories.forEach(function (category, catIndex) {
        category.items.forEach(function (item, itemIndex) {
          sliderTempHTML += _.slideTemplate(catIndex, item, itemIndex);
        });
      });

      $("#" + _.sliderID).html(sliderTempHTML);

      _.$slider = $("#" + _.sliderID);
      _.$prev = $("#" + _.prevID);
      _.$next = $("#" + _.nextID);

      _.$slider.slick({
        accessibility: false,
        arrows: false,
        dots: false,
        draggable: false,
      });

      _.$prev.on("click", function () {
        _.arrowOn(false);
      });
      _.$next.on("click", function () {
        _.arrowOn(true);
      });

      $("#" + closeID).on("click", function (e) {
        e.preventDefault();
        _.$lightBox.addClass("lightbox--hidden");
      });

      $("#" + _.name + "-blocks").on("click", function (e) {
        e.preventDefault();

        var $elem = _.isLink(e.target, true);

        if (!$elem) {
          return;
        }

        $(_.$slider).slick("slickGoTo", +$elem.getAttribute("data-index"));
        _.$lightBox.removeClass("lightbox--hidden");
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

  Construct.prototype.arrowOn = function (isNext) {
    var _ = this;
    if (_.enableArrows) {
      $(_.$slider).slick(isNext ? "slickNext" : "slickPrev");
    }
  };

  Construct.prototype.isLink = function ($elem, intoLink) {
    var intoLink = intoLink || false;
    var linkTag = "A";
    var falseCondition = $elem.tagName !== linkTag;
    var intoLinkCondition = intoLink && falseCondition;

    if (!intoLink && falseCondition) {
      return false;
    }

    if (intoLinkCondition && $elem.parentNode.tagName !== linkTag) {
      return false;
    }

    if (intoLinkCondition) {
      return $elem.parentNode;
    }

    return $elem;
  };

  Construct.prototype.slideTemplate = function (catIndex, item, itemIndex) {
    var _ = this;
    var isEmpty = catIndex < 0;
    var emptyTitle = "EMPTY SLIDE";

    return (
      '<div class="' +
      _.slideCategoryPrefix +
      (isEmpty ? 0 : catIndex) +
      '"><div class="img_wrap ' +
      _.name +
      '_lightbox-img_wrap">' +
      (isEmpty
        ? '<img class="img_wrap-img blog-img" src="" alt="' + emptyTitle + '" />'
        : _.getPicture("img_wrap-img blog-img", catIndex, itemIndex)) +
      '</div><div class="lightbox-desc_container ' +
      _.name +
      '_lightbox-desc_container"><p>' +
      (isEmpty ? emptyTitle : item.description) +
      "</p></div></div>"
    );
  };

  Construct.prototype.getImagePath = function (catIndex, breakpoint, itemIndex) {
    var _ = this;
    var category = !catIndex
      ? _.categories[catIndex].items[itemIndex].category
      : _.categories[catIndex].title;
    var imageIndex = !catIndex ? _.categories[catIndex].items[itemIndex].image : itemIndex;
    return _.rootFolder + "/" + category + "/" + breakpoint + "/" + (imageIndex + 1) + ".jpg";
  };

  Construct.prototype.getPictureSources = function (catIndex, itemIndex) {
    var _ = this;
    var breakpoints = [
      { path: "d", value: 1170 },
      { path: "t", value: 768 },
    ];
    var result = "";

    breakpoints.forEach(function (breakpoint) {
      result +=
        '<source srcset="' +
        _.getImagePath(catIndex, breakpoint.path, itemIndex) +
        '" srcset="" media="(min-width: ' +
        breakpoint.value +
        'px)">';
    });

    return result;
  };

  Construct.prototype.getPicture = function (classes, catIndex, itemIndex) {
    var _ = this;
    return (
      "<picture>" +
      _.getPictureSources(catIndex, itemIndex) +
      '<img class="' +
      classes +
      '" src="' +
      _.getImagePath(catIndex, "m", itemIndex) +
      '" alt="' +
      _.categories[catIndex].items[itemIndex].title +
      '"></picture>'
    );
  };

  Construct.prototype.showItems = function () {
    var _ = this;

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
      _.categories.forEach(function (category, catIndex) {
        if (catIndex > 0) {
          category.items.forEach(function (item, itemIndex) {
            var itemClone = {
              title: item.title,
              description: item.description,
              category: category.title,
              image: itemIndex,
            };
            _.categories[0].items.push(itemClone);
          });
        }
      });
    }

    return _.categories[_.curCategory].items;
  };

  Construct.prototype.setRhombusesByCategory = function () {
    var _ = this;
    var $menuItems = $("#" + _.name + "-menu a");
    var tempHTML = "";

    _.startedAnimation = true;
    _.iter = 0;
    _.itemsCount = 0;
    _.$parentElem.html("");

    _.getItemsByCategory().forEach(function (item, itemIndex) {
      tempHTML +=
        '<div class="' +
        _.childClass +
        '"><div class="photo_block-frame"><div class="photo_block-rhombus">' +
        _.getPicture("photo_block-img", _.curCategory, itemIndex) +
        '<div class="photo_block-foreground"></div><h3 class="section-title photo_block-title">' +
        item.title +
        "</h3></div></div>";

      if (_.showCategory) {
        tempHTML +=
          '<div class="rhombus_wrap rhombus_wrap--btn rhombus_wrap--category photo_block-category"><div class="rhombus_wrap-rhombus"></div></div>';
      }

      tempHTML +=
        '<a href="#" data-index="' +
        itemIndex +
        '" class="rhombus_wrap rhombus_wrap--btn rhombus_wrap--more photo_block-more"><div class="rhombus_wrap-rhombus"></div></a></div>';

      _.itemsCount++;
    });

    if (!tempHTML) {
      tempHTML = "К сожалению в данной категории нет фотографий!";
    }

    _.createHelpArray();
    _.$parentElem.html(tempHTML);

    $menuItems.each(function (index) {
      var $elem = $(this);
      var toggleClass = "active";

      if (index != _.curCategory) {
        $elem.removeClass(toggleClass);
      } else if (!$elem.hasClass(toggleClass)) {
        $elem.addClass(toggleClass);
      }
    });

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

  Construct.prototype.switchArrows = function (enable) {
    var _ = this;
    var styleProperty = "opacity";
    var enableStyleValue = 1;
    var disableStyleValue = 0.5;

    _.enableArrows = enable;

    if (_.enableArrows) {
      _.$prev.css(styleProperty, enableStyleValue);
      _.$next.css(styleProperty, enableStyleValue);
    } else {
      _.$prev.css(styleProperty, disableStyleValue);
      _.$next.css(styleProperty, disableStyleValue);
    }
  };

  Construct.prototype.changeCategory = function ($elem) {
    var _ = this;
    // var display;

    if ($elem.hasAttribute("data-index")) {
      var selector;

      _.curCategory = +$elem.getAttribute("data-index");
      _.setRhombusesByCategory();

      $(_.$slider).slick("slickUnfilter");
      _.switchArrows(true);

      if (_.curCategory > 0) {
        selector = "." + _.slideCategoryPrefix + _.curCategory;

        if (_.categories[_.curCategory].items.length == 1) {
          if (!_.existEmptySlide) {
            $(_.$slider).slick("slickAdd", _.slideTemplate(-1));
            _.existEmptySlide = true;
          }

          selector += ", ." + _.slideCategoryPrefix + "0";
          _.switchArrows(false);
        }
      } else {
        selector = ":not(." + _.slideCategoryPrefix + "0)";
      }

      $(_.$slider).slick("slickFilter", selector).slick("refresh");
    }
    // else if ($elem.hasAttribute('data-display'))
    // {
    // 	display = $elem.getAttribute('data-display');
    // 	console.log(_.$parentElem);

    // 	_.$parentElem.removeClass('display_rhombuses');
    // 	_.$parentElem.removeClass('display-squares');
    // 	_.$parentElem.addClass('display-' + display);
    // }
  };

  Construct.prototype.createMenu = function () {
    var _ = this;
    var $container = $("<div>");
    var $menu = $("<ul>");
    var tempHTML = "";

    $container.addClass("menu-container section-flex_container");

    $menu.attr("id", _.name + "-menu");
    $menu.addClass("hor_menu " + _.name + "-menu");

    _.categories.forEach(function (category, index) {
      tempHTML += '<li class="list-item"><a class="list-link';

      if (!index) {
        tempHTML += " active";
      }

      tempHTML += '" href="#" data-index="' + index + '">' + category.title + "</a></li>";
    });

    // tempHTML += '<li id="grid-switcher-squares"><a data-display="squares" href="#"></a></li>';
    // tempHTML += '<li id="grid-switcher-rhombuses"><a class="active" data-display="rhombuses" href="#"></a></li>';

    $menu.html(tempHTML);

    $menu.on("click", function (e) {
      e.preventDefault();
      var $elem = _.isLink(e.target);
      if (!$elem) {
        return;
      }
      _.changeCategory($elem);
    });

    $container.append($menu);
    $($container).insertBefore("#" + _.name + "-blocks");
  };

  Construct.prototype.createHelpArray = function () {
    var _ = this;
    _.shownItems = _.fillArray(new Array(_.itemsCount), 0);
  };

  Construct.prototype.randomShowing = function () {
    var _ = this;
    var $elem;
    var index;

    do {
      index = parseInt(Math.random() * _.itemsCount);
    } while (_.shownItems[index]);

    $elem = $("#" + _.name + "-blocks ." + _.childClass + ":nth-child(" + (index + 1) + ")");

    $elem.css("opacity", 1);
    _.shownItems[index] = 1;
    _.iter++;

    if (_.iter >= _.itemsCount) {
      clearInterval(_.intervalID);
      _.intervalID = 0;
    }
  };

  return Construct(arguments);
};
