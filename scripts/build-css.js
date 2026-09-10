const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");

async function build() {
  const inputPath = path.join(__dirname, "../src/app/globals.css");
  const outputPath = path.join(__dirname, "../src/app/compiled.css");
  const css = fs.readFileSync(inputPath, "utf8");
  const result = await postcss([tailwind]).process(css, {
    from: inputPath,
    to: outputPath,
  });
  fs.writeFileSync(outputPath, result.css);
  console.log("Tailwind compiled successfully:", result.css.length, "bytes");
}

build().catch((err) => {
  console.error("Error compiling CSS:", err);
  process.exit(1);
});
