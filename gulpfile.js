const gulp = require("gulp"),
  $gp = require("gulp-load-plugins")(),
  cssnext = require("postcss-cssnext"),
  short = require("postcss-short"),
  shortText = require("postcss-short-text"),
  shortBorder = require("postcss-short-border"),
  browserSync = require("browser-sync").create(),
  pathes = {
    src: "src",
    dest: "public",
    html: {
      src: "/pug",
      views: "../server/views",
      dest: "",
    },
    fonts: {
      src: "/fonts",
      dest: "/fonts",
    },
    images: {
      src: "/images",
      dest: "/img",
    },
    svg: {
      src: "/svg",
      dest: "/svg",
    },
    css: {
      src: "/scss",
      dest: "/css",
    },
    js: {
      src: "/js",
      dest: "/js",
    },
  };

for (path in pathes) {
  if (!pathes[path].src) continue;

  pathes[path].src = pathes.src + pathes[path].src;
  pathes[path].dest = pathes.dest + pathes[path].dest;
}

function html() {
  const locals = {};

  return gulp
    .src(pathes.html.src + "/index.pug")
    .pipe($gp.plumber())
    .pipe(
      $gp.pug({
        locals,
        pretty: true,
      })
    )
    .pipe(gulp.dest(pathes.html.dest));
}

function css() {
  var plugins = [
    // precss(),
    cssnext(),
    // colorAlpha(),
    short(),
    // shortFont(),
    shortText(),
    shortBorder(),
    // minmax(),
    // autoprefixer({browsers: ['last 2 version']}),
    // cssnano()
  ];

  return (
    gulp
      .src(pathes.css.src + "/main.scss")
      .pipe($gp.plumber())
      // .pipe(cssGlobbing())
      .pipe($gp.sass().on("error", $gp.sass.logError))
      .pipe($gp.postcss(plugins))
      .pipe($gp.concatCss("bundle.css"))
      // .pipe(minifyCSS())
      .pipe($gp.rename("style.min.css"))
      .pipe(gulp.dest(pathes.css.dest))
  );
}

function browser_sync() {
  browserSync.init({
    server: pathes.dest,
    // notify: false
  });
  browserSync.watch(pathes.dest + "/**/*.*", browserSync.reload);
}

function watch() {
  gulp.watch(`${pathes.html.src}/*.pug`, gulp.series(html));
  gulp.watch(`${pathes.css.src}/*.scss`, gulp.series(css));
}

exports.html = html;
exports.css = css;
exports.watch = watch;
exports.browser_sync = browser_sync;

gulp.task(
  "default",
  gulp.series(gulp.parallel(html, css), gulp.parallel(watch, browser_sync))
);
