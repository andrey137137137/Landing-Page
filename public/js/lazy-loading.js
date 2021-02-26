$(function () {
  "use strict";

  var isVisible = false;
  var imgRef = "img";
  var lazyloadThrottleTimeout = 0;
  var img = this.$refs[imgRef];

  function srcAttr() {
    return this.breakpoint ? "srcset" : "src";
  }

  function srcAttrs() {
    return this.isLazyLoading
      ? { "data-src": this.path, [this.srcAttr]: "" }
      : { [this.srcAttr]: this.path };
  }

  function setSrc() {
    img[this.srcAttr] = img.dataset.src;
    img.removeAttribute("data-src");
    isVisible = true;
  }

  function lazyload() {
    if (lazyloadThrottleTimeout) {
      clearTimeout(lazyloadThrottleTimeout);
    }

    lazyloadThrottleTimeout = setTimeout(function () {
      const scrollTop = window.pageYOffset;

      if (img.offsetTop < window.innerHeight + scrollTop) {
        $vm.setSrc();
      }

      if ($vm.isVisible) {
        document.removeEventListener("scroll", $vm.lazyload);
        window.removeEventListener("resize", $vm.lazyload);
        window.removeEventListener("orientationChange", $vm.lazyload);
      }
    }, 20);
  }

  if ("IntersectionObserver" in window) {
    var imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          var image = entry.target;
          $vm.setSrc();
          imageObserver.unobserve(image);
        }
      });
    });

    imageObserver.observe(img);
  } else {
    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }
});
