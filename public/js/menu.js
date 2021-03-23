var Menu = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "Menu";

  Construct.prototype.init = function (params) {
    var _ = this;

    params = _.extend(
      {
        menuID: false,
        buttonCheckerID: false,
        headerHeight: 0,
        items: false,
      },
      params
    );

    if (
      !params.menuID ||
      !params.buttonCheckerID ||
      !params.headerHeight ||
      !params.items
    ) {
      _.setErrorMessage(_.pluginName);
      return false;
    }

    _.menuID = params.menuID;
    _.buttonCheckerID = params.buttonCheckerID;
    _.headerHeight = params.headerHeight;
    _.items = params.items;

    // console.log(params);
    params = null;

    _.$buttonChecker = $("#" + _.buttonCheckerID);

    _.bigScreenWidth = false;
    _.checked = false;
    _.scrollY = 0;

    _.$menu = $("<ul>");

    var $tempListItem;
    var $tempLink;

    _.$menu.attr("id", _.menuID);
    // _.$menu.addClass('hor_menu');
    _.$menu.addClass("list");
    _.$menu.addClass("header-menu");

    for (var i = 0, len = _.items.length; i < len; i++) {
      $tempListItem = $("<li>");
      $tempListItem.addClass("list-item");
      $tempLink = $("<a>");

      if (!i) {
        $tempLink.addClass("active");
      }

      $tempLink.html(_.items[i].name);
      $tempLink.addClass("list-link");
      $tempLink.attr("href", "#" + _.items[i].href);
      $tempLink.attr("data-index", i);

      $tempLink.on("click", function (event) {
        // event.preventDefault();

        if (!_.bigScreenWidth) {
          _.checkMenu();
        }
      });

      $tempListItem.append($tempLink);
      _.$menu.append($tempListItem);
    }

    $("nav").append(_.$menu);

    // _.$buttonChecker.on('click', function(){
    // 	_.checkMenu();
    // });

    document.body.addEventListener("click", function (event) {
      _.checkMenu(event.target);
    });

    // $(window).on('resize', function(){
    // 	_.changeLayoutAndActiveLink();
    // });

    // $(window).on('scroll', function(){
    // 	_.changeLayoutAndActiveLink();
    // });

    $(window).on("resize", function () {
      _.resizeLayoutAndChangeLink();
    });

    $(window).on("orientationChange", function () {
      _.resizeLayoutAndChangeLink();
    });

    $(window).on("scroll", function () {
      _.changeLayoutAndActiveLink();
    });

    _.changeLayoutAndActiveLink();
  };

  Construct.prototype.resizeLayoutAndChangeLink = function () {
    var _ = this;
    _.resizeWindowWidth(_.changeLayoutAndActiveLink);
  };

  Construct.prototype.changeLayoutAndActiveLink = function () {
    var _ = this;

    _.scrollY = _.getScrollY();

    if (_.scrollY > _.headerHeight) {
      $("header").addClass("header--min");
    } else {
      $("header").removeClass("header--min");
    }

    if (_.getStyle(_.$buttonChecker, "display") === "none") {
      _.bigScreenWidth = true;
      _.checked = false;

      if (_.$menu.hasClass("visible")) {
        _.$menu.removeClass("visible");
      }

      if (_.$buttonChecker.hasClass("rhombus_wrap--close")) {
        _.$buttonChecker.removeClass("rhombus_wrap--close");
        _.$buttonChecker.addClass("rhombus_wrap--bars");
      }
    } else {
      _.bigScreenWidth = false;
    }

    _.activateSectionLink();
  };

  Construct.prototype.isButtonChecked = function ($elem) {
    var _ = this;

    if ($elem.id === _.buttonCheckerID) {
      return true;
    }

    if ($elem.parentNode.id === _.buttonCheckerID) {
      return true;
    }

    return false;
  };

  Construct.prototype.checkMenu = function ($clickedElem) {
    var _ = this;

    if (!_.checked && _.isButtonChecked($clickedElem)) {
      _.checked = true;
      console.log(_.checked);

      _.$buttonChecker.removeClass("rhombus_wrap--bars");
      _.$buttonChecker.addClass("rhombus_wrap--close");

      _.$menu.addClass("visible");
    } else if (_.checked) {
      _.checked = false;
      console.log(_.checked);

      _.$buttonChecker.removeClass("rhombus_wrap--close");
      _.$buttonChecker.addClass("rhombus_wrap--bars");

      _.$menu.removeClass("visible");
    }
  };

  Construct.prototype.activateSectionLink = function () {
    var _ = this;
    var activeSectionIndex = 0;

    for (var i = 1; i < _.items.length; i++) {
      if (_.scrollY >= _.getElemCenterTop(_.items[i].href)) {
        // if (_.scrollY >= $("#" + 'about').offsetTop - _.headerHeight)
        // $('#main-menu a')[i].addClass('active');
        // console.log(_.scrollY);
        activeSectionIndex = i;
        // break;
      } else {
        break;
        // $('#main-menu a')[i].removeClass('active');
      }
    }

    // for (var i = 0; i < _.items.length; i++) {
    $("#" + _.menuID + " a").each(function (index) {
      var $elem = $(this);

      $elem.removeClass("active");

      if (index == activeSectionIndex) {
        $elem.addClass("active");
      }
    });
    // }
    // console.log(_.items[activeSectionIndex]);
    // $("#" + _.menuID + " a")[activeSectionIndex].addClass("active");
    // console.log($("#" + _.items[i].href));
  };

  return Construct(arguments);
};
