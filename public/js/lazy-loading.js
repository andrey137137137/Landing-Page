$(function () {
  "use strict";

  var isVisible = false;
  var lazyloadThrottleTimeout = 0;
  var srcsetName = "srcset";
  var $images = $(".lazy").children();

  function setSrc($image) {
    console.log($image);
    var srcAttr = $image.hasAttribute(srcsetName) ? srcsetName : "src";

    $image[srcAttr] = $image.dataset.src;
    $image.removeAttribute("data-src");
    isVisible = true;
  }

  function lazyload() {
    if (lazyloadThrottleTimeout) {
      clearTimeout(lazyloadThrottleTimeout);
    }

    lazyloadThrottleTimeout = setTimeout(function () {
      const scrollTop = window.pageYOffset;

      // if ($images.offsetTop < window.innerHeight + scrollTop) {
      $images.each(function () {
        setSrc(this);
      });
      // }

      if (isVisible) {
        document.removeEventListener("scroll", lazyload);
        window.removeEventListener("resize", lazyload);
        window.removeEventListener("orientationChange", lazyload);
      }
    }, 20);
  }

  if ("IntersectionObserver" in window) {
    var imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          var $image = entry.target;
          setSrc($image);
          imageObserver.unobserve($image);
        }
      });
    });
    $images.each(function () {
      imageObserver.observe(this);
    });
  } else {
    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }
});
