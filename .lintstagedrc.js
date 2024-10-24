/* eslint-disable  @typescript-eslint/no-var-requires */
const path = require("path");

const buildEslintCommand = (filenames) =>
  `yarn lint --fix --file ${filenames
    .map((file) => path.relative(process.cwd(), file))
    .join(" --file ")}`;

const buildEslintCommandTS = () => `tsc --skipLibCheck --noEmit`;

module.exports = {
  "*.{js,jsx}": [buildEslintCommand],
  "*.{ts,tsx}": [buildEslintCommand, buildEslintCommandTS],
};
