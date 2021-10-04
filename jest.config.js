module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/client/$1",
    "^~/(.*)$": "<rootDir>/client/$1",
    "^vue$": "vue/dist/vue.common.js",
  },
  testPathIgnorePatterns: ["./node_modules/"],
  moduleFileExtensions: ["js", "vue", "json"],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "vue-jest",
  },
  collectCoverage: true,
  coverageDirectory: "<rootDir>/client/coverage",
  collectCoverageFrom: [
    "<rootDir>/client/components/**/*.vue",
    "<rootDir>/client/pages/**/*.vue",
  ],
};
