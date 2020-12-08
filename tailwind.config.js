const namedGroup = name => (name ? `group-${name}` : "group");
const generateGroupHover = ({ e, sep, className }) => name =>
  `.${e(namedGroup(name))}:hover .${e(
    `${namedGroup(name)}-hover${sep}${className}`,
  )}`;
const namedGroupHover = ({ addVariant, e, theme }) =>
  addVariant("named-group-hover", ({ modifySelectors, separator: sep }) =>
    modifySelectors(({ className }) =>
      ["", ...theme("namedGroupHover.groups", [])]
        .map(generateGroupHover({ e, sep, className }))
        .join(", "),
    ),
  );

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    "./src/**/*.tsx",
    "./src/**/*.vue",
    "./src/**/*.ts",
    "./examples/**/*.tsx",
    "./examples/**/*.vue",
  ],
  theme: {
    extend: {},
    namedGroupHover: {
      groups: ["l", "s"],
    },
  },
  variants: {
    display: ["responsive", "group-hover", "named-group-hover"],
  },
  plugins: [namedGroupHover],
};
