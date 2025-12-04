import gulp from "gulp";
import nunjucksRender from "gulp-nunjucks-render";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import ts from "gulp-typescript";

const sass = gulpSass(dartSass);
const tsProject = ts.createProject("tsconfig.json");

const paths = {
  src: "src",
  dist: "dist",
  html: {
    src: "src/**/*.html",
    common: "src/common", // Thư mục chứa các component nguồn
    // Chỉ build các trang chính, không build lại các file component trong common
    pages: ["src/*.html", "src/about/**/*.html"],
  },
  styles: {
    src: ["src/**/*.scss", "!src/common/_*/**/*.scss"],
    dest: "dist",
  },
  scripts: {
    src: ["src/**/*.ts", "!src/common/_*/**/*.ts"],
    dest: "dist",
  },
  common: {
    src: ["src/common/**/*.html", "!src/common/_*/**/*.html"],
    dest: "dist/common",
  },
  assets: {
    src: ["src/assets/**/*", "src/images/**/*", "src/**/*.js"],
    dest: "dist",
  },
};

// 1. Tác vụ xử lý HTML và Component Reuse (Nunjucks)
function html() {
  // Bắt đầu định nghĩa dữ liệu toàn cục để truyền vào mọi template
  const globalData = {
    siteTitle: "Dự Án Tĩnh Quy Mô Lớn (Component hóa)",
    currentYear: new Date().getFullYear(),
    isProduction: process.env.NODE_ENV === "production",
    menuItems: [
      { name: "Trang Chủ", url: "index.html" },
      { name: "Về Chúng Tôi", url: "about/index.html" },
      { name: "Liên Hệ", url: "contact.html" },
    ],
  };

  return gulp
    .src(paths.html.pages, { base: paths.src })
    .pipe(
      nunjucksRender({
        path: [paths.html.common],
        // THAY ĐỔI QUAN TRỌNG: Truyền đối tượng data vào đây
        data: globalData,
      })
    )
    .pipe(gulp.dest(paths.dist));
}

// **TÁC VỤ SAO CHÉP COMPONENT (Giữ nguyên từ yêu cầu trước)**
function copyCommon() {
  return gulp.src(paths.common.src).pipe(gulp.dest(paths.common.dest));
}

// 2. Tác vụ biên dịch SCSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.styles.dest));
}

// 3. Tác vụ biên dịch TypeScript
function scripts() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(paths.scripts.dest));
}

// 4. Tác vụ sao chép tài sản (Assets)
function assets() {
  return gulp
    .src(paths.assets.src, { base: paths.src })
    .pipe(gulp.dest(paths.dist));
}

// Tác vụ Watch cho chế độ phát triển (Development)
function watchFiles() {
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.common.src, copyCommon);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.assets.src, assets);
}

// Tác vụ Build
export const build = gulp.series(
  gulp.parallel(html, copyCommon, styles, scripts, assets)
);

// Tác vụ Dev
export const dev = gulp.series(build, watchFiles);
