module.exports = {
  plugins: ["prettier-plugin-tailwindcss", "@trivago/prettier-plugin-sort-imports"],
  trailingComma: "es5",
  tabWidth: 2,
  printWidth: 120,
  semi: false,
  importOrder: ["^components/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
