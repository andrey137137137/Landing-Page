var ToTop = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "ToTop";

  Construct.prototype.init = function (params) {
    var _ = this;

    params = _.extend(
      {
        buttonID: false,
        border: 300,
        defaultScrollStep: 70,
      },
      params
    );

    if (!params.buttonID) {
      _.setErrorMessage(_.pluginName);
      return false;
    }

    _.border = params.border;

    _.$elem = $("#" + params.buttonID);
    _.$socialsContainer = $("#footer-socials-container");

    _.ToTopButton = ScrollEffect({
      buttonID: params.buttonID,
      defaultScrollStep: params.defaultScrollStep,
      direction: -1,
    });

    params = null;

    $(window).on("scroll", function () {
      _.showHideToTop();
    });

    _.showHideToTop();
  };

  Construct.prototype.showHideToTop = function () {
    var _ = this;
    // var endPage = document.documentElement.scrollHeight - window.innerHeight;
    var endPage = _.getScrollHeight() - window.innerHeight;

    _.ToTopButton.scrollY = _.getScrollY();

    if (_.ToTopButton.scrollY > _.border) {
      _.$elem.addClass("section-btn_to--top_active");
    } else {
      _.$elem.removeClass("section-btn_to--top_active");
    }

    if (parseInt(_.ToTopButton.scrollY) === endPage) {
      setTimeout(function () {
        _.$elem.addClass("section-btn_to--top_finally");
      }, 200);

      _.$socialsContainer.addClass("footer-socials_container--visible");
    } else {
      _.$elem.removeClass("section-btn_to--top_finally");
      _.$socialsContainer.removeClass("footer-socials_container--visible");
    }
  };

  return Construct(arguments);
};
