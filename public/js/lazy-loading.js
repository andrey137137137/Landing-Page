$(function () {
  "use strict";

  var lazyloadThrottleTimeout = 0;
  var srcsetName = "srcset";
  var $images = $(".lazy").children();
  var hiddenCount = $images.length;
  var shownCount = 0;
  var srcAttr;

  function lazyload() {
    if (lazyloadThrottleTimeout) {
      clearTimeout(lazyloadThrottleTimeout);
    }

    lazyloadThrottleTimeout = setTimeout(function () {
      $images.each(function (index, $image) {
        if ($image.offsetTop < window.innerHeight + window.pageYOffset) {
          srcAttr = $image.hasAttribute(srcsetName) ? srcsetName : "src";

          $image[srcAttr] = $image.dataset.src;
          $image.removeAttribute("data-src");
          shownCount++;
        }
      });

      console.log(hiddenCount);
      console.log(shownCount);

      if (shownCount >= hiddenCount) {
        document.removeEventListener("scroll", lazyload);
        window.removeEventListener("resize", lazyload);
        window.removeEventListener("orientationChange", lazyload);
      }
    }, 20);
  }

  document.addEventListener("scroll", lazyload);
  window.addEventListener("resize", lazyload);
  window.addEventListener("orientationChange", lazyload);
  lazyload();
});
