var Menu = function() {
  "use strict";

  function Construct(params) {
    if (!(this instanceof Construct)) {
      return new Construct(params);
    }

    this.init.apply(this, params);
  }

  Construct.prototype = Object.create(ReasanikBase());

  // Construct.prototype = {

  Construct.prototype.constructor = Construct;

  Construct.prototype.pluginName = "Menu";

  Construct.prototype.init = function(params) {
    var self = this;

    params = this.extend(
      {
        menuID: false,
        buttonCheckerID: false,
        headerHeight: 0,
        items: false
      },
      params
    );

    if (
      !params.menuID ||
      !params.buttonCheckerID ||
      !params.headerHeight ||
      !params.items
    ) {
      this.setErrorMessage(this.pluginName);
      return false;
    }

    this.menuID = params.menuID;
    this.buttonCheckerID = params.buttonCheckerID;
    this.headerHeight = params.headerHeight;
    this.items = params.items;

    // console.log(params);
    params = null;

    this.buttonChecker = document.getElementById(this.buttonCheckerID);

    this.bigScreenWidth = false;
    this.checked = false;
    this.scrollY = 0;

    this.menu = document.createElement("ul");

    var listItems = [];
    var tempLink;

    this.menu.id = this.menuID;
    // this.menu.classList.add('hor_menu');
    this.menu.classList.add("list");
    this.menu.classList.add("header-menu");

    for (var i = 0, len = this.items.length; i < len; i++) {
      listItems[i] = document.createElement("li");
      listItems[i].classList.add("list-item");
      tempLink = document.createElement("a");

      if (!i) {
        tempLink.classList.add("active");
      }

      tempLink.innerHTML = this.items[i].name;
      tempLink.classList.add("list-link");
      tempLink.setAttribute("href", "#" + this.items[i].href);
      tempLink.setAttribute("data-index", i);

      tempLink.addEventListener("click", function(event) {
        // event.preventDefault();

        if (!self.bigScreenWidth) {
          self.checkMenu();
        }
      });

      listItems[i].appendChild(tempLink);
      this.menu.appendChild(listItems[i]);
    }

    document.querySelector("nav").appendChild(this.menu);

    // this.buttonChecker.addEventListener('click', function(){
    // 	this.checkMenu();
    // });

    document.body.addEventListener("click", function(event) {
      self.checkMenu(event.target);
    });

    // window.addEventListener('resize', function(){
    // 	this.changeLayoutAndActiveLink();
    // });

    // window.addEventListener('scroll', function(){
    // 	this.changeLayoutAndActiveLink();
    // });

    window.addEventListener("resize", function() {
      // self.changeLayoutAndActiveLink();
      self.resizeWindowWidth(self.changeLayoutAndActiveLink);
    });

    window.addEventListener("scroll", function() {
      self.changeLayoutAndActiveLink();
    });

    this.changeLayoutAndActiveLink();
  };

  Construct.prototype.changeLayoutAndActiveLink = function() {
    this.scrollY = this.getScrollY();

    if (this.scrollY > this.headerHeight) {
      document.querySelector("header").classList.add("min");
    } else {
      document.querySelector("header").classList.remove("min");
    }

    if (this.getStyle(this.buttonChecker, "display") === "none") {
      this.bigScreenWidth = true;
      this.checked = false;

      if (this.menu.classList.contains("visible")) {
        this.menu.classList.remove("visible");
      }

      if (this.buttonChecker.classList.contains("rhombus_wrap--close")) {
        this.buttonChecker.classList.remove("rhombus_wrap--close");
        this.buttonChecker.classList.add("rhombus_wrap--bars");
      }
    } else {
      this.bigScreenWidth = false;
    }

    this.activateSectionLink();
  };

  Construct.prototype.isButtonChecked = function(elem) {
    if (elem.id === this.buttonCheckerID) {
      return true;
    }

    if (elem.parentNode.id === this.buttonCheckerID) {
      return true;
    }

    return false;
  };

  Construct.prototype.checkMenu = function(clickedElem) {
    if (!this.checked && this.isButtonChecked(clickedElem)) {
      this.checked = true;
      console.log(this.checked);

      this.buttonChecker.classList.remove("rhombus_wrap--bars");
      this.buttonChecker.classList.add("rhombus_wrap--close");

      this.menu.classList.add("visible");
    } else if (this.checked) {
      this.checked = false;
      console.log(this.checked);

      this.buttonChecker.classList.remove("rhombus_wrap--close");
      this.buttonChecker.classList.add("rhombus_wrap--bars");

      this.menu.classList.remove("visible");
    }
  };

  Construct.prototype.activateSectionLink = function() {
    var activeSectionIndex = 0;

    for (var i = 1; i < this.items.length; i++) {
      if (this.scrollY >= this.getElemCenterTop(this.items[i].href)) {
        // if (this.scrollY >= document.getElementById('about').offsetTop - this.headerHeight)
        // document.querySelectorAll('#main-menu a')[i].classList.add('active');
        // console.log(this.scrollY);
        activeSectionIndex = i;
        // break;
      } else {
        break;
        // document.querySelectorAll('#main-menu a')[i].classList.remove('active');
      }
    }

    for (var i = 0; i < this.items.length; i++) {
      document
        .querySelectorAll("#" + this.menuID + " a")
        [i].classList.remove("active");
    }
    // console.log(this.items[activeSectionIndex]);
    document
      .querySelectorAll("#" + this.menuID + " a")
      [activeSectionIndex].classList.add("active");
    // console.log(document.getElementById(this.items[i].href));
  };
  // };

  return Construct(arguments);
};
