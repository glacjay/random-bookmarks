const base = require('./base/v2');

module.exports = {
  ...base,
  browser_specific_settings: {
    gecko: {
      strict_min_version: '48.0',
    },
  },
};
