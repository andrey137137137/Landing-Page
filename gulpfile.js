const // general
  gulp = require("gulp"),
  // плагины галпа, объявлять не нужно, используем как $gp.имяПлагина (без приставки gulp-)
  $gp = require("gulp-load-plugins")(),
  $ = $gp.jquery,
  del = require("del"),
  cssnext = require("postcss-cssnext"),
  short = require("postcss-short"),
  shortText = require("postcss-short-text"),
  shortBorder = require("postcss-short-border"),
  assets = require("postcss-assets"),
  webpack = require("webpack"),
  webpackConfig = require("./webpack.config.js"),
  browserSync = require("browser-sync").create(),
  pathes = {
    src: "src",
    dest: "public",
    html: {
      src: "/pug",
      views: "../server/views",
      dest: ""
    },
    fonts: {
      src: "/fonts",
      dest: "/fonts"
    },
    images: {
      src: "/images",
      dest: "/img"
    },
    svg: {
      src: "/svg",
      dest: "/svg"
    },
    css: {
      src: "/scss",
      dest: "/css"
    },
    js: {
      src: "/js",
      dest: "/js"
    }
  };

for (path in pathes) {
  if (!pathes[path].src) continue;

  pathes[path].src = pathes.src + pathes[path].src;
  pathes[path].dest = pathes.dest + pathes[path].dest;
}

function clean() {
  return del([
    pathes.dest + "/*",
    // pathes.dest + "/*.html",
    "!" + pathes.fonts.dest,
    "!" + pathes.images.dest,
    "!" + pathes.dest + "/userfiles"
  ]);
}

function svg() {
  return (
    gulp
      .src(pathes.svg.src + "/*.svg")
      // minify svg
      .pipe(
        $gp.svgmin({
          js2svg: {
            pretty: true
          }
        })
      )
      // remove all fill, style and stroke declarations in out shapes
      .pipe(
        $gp.cheerio({
          run: function($) {
            $("[fill], [stroke], [style], [width], [height]")
              // .removeAttr("fill")
              // .removeAttr("stroke")
              // .removeAttr("style")
              .removeAttr("width")
              .removeAttr("height");
          },
          parserOptions: { xmlMode: true }
        })
      )
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe($gp.replace("&gt;", ">"))
      // build svg sprite
      .pipe(
        $gp.svgSprite({
          mode: {
            symbol: {
              //   render:
              //   {
              //     scss:
              //     {
              //       svgId: "svg-%f",
              // 			dest: '../../../' + pathes.css.src + '/_sprite.scss',
              // 			// template: '../../../' + pathes.css.src + "/templates/_sprite_template.scss"
              // 		}
              // 	}
            }
          }
        })
      )
      .pipe(gulp.dest(pathes.svg.dest))
  );
}

function html() {
  var YOUR_LOCALS = {};

  return gulp
    .src(pathes.html.src + "/index.pug")
    .pipe($gp.plumber())
    .pipe(
      $gp.pug({
        locals: YOUR_LOCALS,
        pretty: true
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
    shortBorder()
    // assets({
    //   loadPaths: [pathes.images.dest]
    // }),
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
      // .pipe(autoprefixer({
      //   browsers: ['last 15 versions'],
      //   cascade: false
      // }))
      .pipe($gp.concatCss("bundle.css"))
      // .pipe(minifyCSS())
      .pipe($gp.rename("style.min.css"))
      .pipe(gulp.dest(pathes.css.dest))
  );
}

function js() {
  return (
    gulp
      .src(pathes.js.src + "/*.js")
      // .pipe($gp.sourcemaps.init())
      .pipe($gp.webpack(webpackConfig, webpack))
      // .pipe(concat('script.min.js'))
      .pipe($gp.sourcemaps.write())
      .pipe(gulp.dest(pathes.js.dest))
  );
}

// // сервер node.js
// gulp.task("nodemon", done => {
//   let started = false;
//   $gp
//     .nodemon({
//       script: "server.js",
//       env: { NODE_ENV: "development" },
//       watch: [
//         "controllers/*",
//         "routes/*",
//         "views/**/**/*",
//         "config.json",
//         "server.js"
//       ]
//     })
//     .on("start", () => {
//       if (started) return;
//       done();
//       started = true;
//     });
// });

// // dev сервер + livereload (встроенный)
// gulp.task(
//   "server",
//   gulp.series("nodemon", done => {
//     browserSync.init({
//       proxy: "http://localhost:3000",
//       port: 8080,
//       open: false
//     });
//   })
// );

function browser_sync() {
  browserSync.init({
    server: pathes.dest
    // notify: false
  });
  browserSync.watch(pathes.dest + "/**/*.*", browserSync.reload);
}

function watch() {
  gulp.watch(`${pathes.html.src}/*.pug`, gulp.series(html));
  // gulp.watch(
  //   [pathes.css.src + "/**/*.scss", pathes.css.src + "/pages/**/*.scss"],
  //   gulp.series(css)
  // );
  // gulp.watch(
  //   ["./webpack.config.js", pathes.js.src + "/**/*.js"],
  //   gulp.series(js)
  // );
}

exports.clean = clean;
exports.svg = svg;
exports.html = html;
exports.css = css;
exports.js = js;
exports.watch = watch;
exports.browser_sync = browser_sync;

gulp.task(
  "default",
  gulp.series(
    // clean,
    // svg,
    html,
    // gulp.parallel(html, css, js),
    // gulp.parallel(svg, css, js)
    gulp.parallel(watch, browser_sync)
  )
);
