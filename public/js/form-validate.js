var FormValidate = function () {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "FormValidate";

  Construct.prototype.init = function (params) {
    var _ = this;

    params = _.extend(
      {
        formID: false,
        onlySubmitChecking: false,
      },
      params
    );

    if (!params.formID) {
      _.setErrorMessage(_.pluginName);
      return false;
    }

    _.formID = params.formID;

    var onlySubmitChecking = params.onlySubmitChecking;

    params = null;

    _.errorMessage = false;
    _.errorMessageID = "contacts-form-error";
    _.errorMessageElem = document.getElementById(_.errorMessageID);

    var elems = document.querySelectorAll(
      "#" + _.formID + " .form-elem--required"
    );

    if (!onlySubmitChecking) {
      for (var i = 0, len = elems.length; i < len; i++) {
        elems[i].addEventListener("blur", function () {
          _.validate(this);
        });
      }
    }

    document
      .getElementById(_.formID)
      .addEventListener("submit", function (event) {
        event.preventDefault();

        for (var i = 0, len = elems.length; i < len; i++) {
          if (!_.validate(elems[i])) {
            return;
          }
        }

        _.submit();
      });
  };

  Construct.prototype.validate = function (elem) {
    var _ = this;
    var tag = elem.tagName.toLowerCase();
    var type;

    _.errorMessage = false;

    switch (tag) {
      case "select":
        type = tag;
        break;
      default:
        type = elem.getAttribute("type") || "text";
    }

    switch (type) {
      case "select":
        validateSelect(elem);
        break;
      case "text":
        if (elem.name == _.formID + "_website") {
          _.validateWebAdress(elem);
        } else {
          _.validateText(elem);
        }
        break;
      case "email":
        _.validateEmail(elem);
        break;
      case "password":
        validatePassword(elem);
        break;
    }
    console.log(_.errorMessage);
    document.querySelector("#" + _.errorMessageID + " div").innerHTML =
      _.errorMessage;

    if (_.errorMessage) {
      _.errorMessageElem.style.top = elem.offsetTop + 100 + "px";
      _.errorMessageElem.classList.add("active");
      return false;
    }

    _.errorMessageElem.style.top = "";
    _.errorMessageElem.classList.remove("active");

    return true;
  };

  Construct.prototype.trim = function (str) {
    var _ = this;
    var trimmingChar = " ";
    var firstRestIndex;
    var i;
    var len = str.length;

    for (i = 0; i < len; i++) {
      if (str[i] != trimmingChar) {
        break;
      }
    }

    str = str.slice(i, len);
    len = str.length;

    if (str.lastIndexOf(trimmingChar) == len - 1);
    {
      for (i = len - 1; i >= 0; i--) {
        if (str[i] != trimmingChar) {
          break;
        }
      }
    }

    str = str.slice(0, i + 1);

    return str;
  };

  Construct.prototype.validateText = function (elem) {
    var _ = this;
    var str = elem.value;
    var reg = /^[a-z0-9 ]+$/;

    str = _.trim(str);

    elem.value = str;
    console.log(!str);
    if (!str) {
      _.errorMessage = "Пустое поле!";
      return false;
    }

    if (!_.checkByRegExp(str, reg)) {
      _.errorMessage = "В поле введён недопустимый символ!";
      return false;
    }

    elem.value = str;
  };

  Construct.prototype.validateEmail = function (elem) {
    var _ = this;
    var parts = elem.value.split("@");
    var len = parts.length;
    var address;
    var domain;
    var domainParts;
    var regAdr = /^[a-z0-9_-]{3,}$/i;

    if (len < 2) {
      _.errorMessage = "Нет символа @!";
      return false;
    }

    if (len > 3) {
      _.errorMessage = "Символ @ должен быть только один!";
      return false;
    }

    address = _.trim(parts[0]);
    domain = parts[1];

    elem.value = address + "@" + domain;

    if (!address) {
      _.errorMessage = "Не заполнен адрес почты!";
      return false;
    }

    if (!_.checkByRegExp(address, regAdr)) {
      _.errorMessage = "В адресе почты есть недопустимые символы!";
      return false;
    }

    domain = _.domainCheck(domain);

    if (!domain) {
      return false;
    }

    elem.value = address + "@" + domain;
  };

  Construct.prototype.validateWebAdress = function (elem) {
    var _ = this;
    var parts = elem.value.split(".", 2);
    var len = parts.length;
    var address;
    var domain;
    var domainParts;
    var regAdr = /^[a-z0-9_-]{3,}$/i;

    if (len < 2) {
      _.errorMessage = "Нет точки!";
      return false;
    }

    address = _.trim(parts[0]);
    domain = parts[1];

    elem.value = address + "." + domain;

    if (!address) {
      _.errorMessage = "Не заполнен адрес сайта!";
      return false;
    }

    if (!_.checkByRegExp(address, regAdr)) {
      _.errorMessage = "В адресе сайта есть недопустимые символы!";
      return false;
    }

    domain = _.domainCheck(domain, true);

    if (!domain) {
      return false;
    }

    elem.value = address + "." + domain;
  };

  Construct.prototype.domainCheck = function (str, notForEmail) {
    var _ = this;
    var domainParts = str.split(".");
    var len = domainParts.length;
    var minParts = 2;
    var regDom = /^[a-z]{2,}$/;

    notForEmail = notForEmail || false;

    if (notForEmail) {
      minParts = 1;
    }

    if (len < minParts) {
      _.errorMessage = "В домене должна быть как минимум одна точка!";
      return false;
    }

    for (var i = 0; i < len; i++) {
      domainParts[i] = _.trim(domainParts[i]);

      if (!domainParts[i]) {
        _.errorMessage = "Не заполнена одна из частей домена!";
        return false;
      }

      if (!_.checkByRegExp(domainParts[i], regDom, true)) {
        _.errorMessage = "В домене есть недопустимые символы!";
        return false;
      }
    }

    return domainParts.join(".");
  };

  Construct.prototype.checkByRegExp = function (str, regExp, caseSensetive) {
    caseSensetive = caseSensetive || false;

    if (!caseSensetive) {
      str = str.toLowerCase();
    }

    if (str.search(regExp) === -1) {
      return false;
    }

    return true;
  };

  Construct.prototype.hideErrorMessage = function () {
    var _ = this;
    _.errorMessageElem.style.top = "";
    _.errorMessageElem.classList.remove("active");
  };

  return Construct(arguments);
};
