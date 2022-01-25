require("dotenv/config");

const path = require("path");
const url = require("url");
const fs = require("fs");
const pug = require("pug");
const sass = require("sass");

const [indexFilePath, staticDir, outputDir] = process.argv.slice(2);

function compileScss(scss, options) {
  const { filename, outputStyle } = options;

  const result = sass.compileString(scss, {
    style: outputStyle,
    importer: {
      findFileUrl(fileUrl) {
        return url.pathToFileURL(path.resolve(path.dirname(filename), fileUrl));
      },
    },
  });

  return result.css;
}

const compileMarkup = pug.compileFile(indexFilePath, {
  filters: { scss: compileScss },
});

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFileSync(
  path.resolve(
    outputDir,
    path.basename(indexFilePath, path.extname(indexFilePath)) + ".html"
  ),
  compileMarkup({ env: { ...process.env } })
);

function copyDir(source, dest) {
  const items = fs.readdirSync(source);
  for (const item of items) {
    const sourcePath = path.resolve(source, item);
    const destPath = path.resolve(dest, item);
    if (fs.statSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyDir(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

copyDir(staticDir, outputDir);
