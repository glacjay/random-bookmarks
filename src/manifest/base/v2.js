const { version } = require("../version.json");
const permissions = require("../permissions");
const { name, short_name, description } = require("../app_info");

module.exports = {
  version,
  manifest_version: 2,
  name,
  short_name,
  description,
  permissions: [...permissions],
  browser_action: {
    default_title: short_name,
    default_popup: "assets/html/popup.html",
  },
  content_scripts: [
    {
      matches: ["*://*.douban.com/*"],
      js: ["content.js"],
    },
  ],
  icons: {
    48: "assets/images/logo_48.png",
  },
  background: {
    scripts: ["background.js"],
    persistent: false,
  },
  web_accessible_resources: ["assets/**"],
  // ...(process.env.NODE_ENV === 'development' ? {
  //   content_security_policy: "script-src 'self' 'unsafe-eval'; font-src 'self' data: https://fonts.gstatic.com/s/dmsans; object-src 'self';"
  // } : {})
};
