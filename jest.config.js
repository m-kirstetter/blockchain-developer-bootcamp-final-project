module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/client/$1",
    "^~/(.*)$": "<rootDir>/client/$1",
    "^vue$": "vue/dist/vue.common.js"
  },
  moduleFileExtensions: ["ts", "js", "vue", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/client/components/**/*.vue",
    "<rootDir>/client/pages/**/*.vue"
  ]
};
