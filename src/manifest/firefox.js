const base = require("./base/v2");

module.exports = {
  ...base,
  // 支持隐私模式
  incognito: "spanning",
  browser_specific_settings: {
    gecko: {
      strict_min_version: "58.0",
    },
  },
};
