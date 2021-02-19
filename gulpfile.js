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
  const { src, dest } = pathes.html;
  const locals = {};

  return gulp
    .src(src + "/index.pug")
    .pipe($gp.plumber())
    .pipe(
      $gp.pug({
        locals,
        pretty: true,
      })
    )
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
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
      .pipe(browserSync.stream())
  );
}

function serve() {
  const { dest } = pathes;

  browserSync.init({
    server: dest,
    // notify: false
  });
  browserSync.watch(dest + "/**/*.*", browserSync.reload);
}

function watch() {
  const htmlSrc = pathes.html.src;
  const cssSrc = pathes.css.src;
  const pugTemplate = "*.pug";

  gulp.watch(
    [`${htmlSrc}/${pugTemplate}`, `${htmlSrc}/includes/${pugTemplate}`],
    gulp.series(html)
  );
  // .on("change", browserSync.reload);
  gulp.watch(`${cssSrc}/*.scss`, gulp.series(css));
  // .on("change", browserSync.reload);
}

exports.html = html;
exports.css = css;
exports.watch = watch;
exports.serve = serve;

gulp.task(
  "default",
  gulp.series(gulp.parallel(html, css), gulp.parallel(watch, serve))
);
