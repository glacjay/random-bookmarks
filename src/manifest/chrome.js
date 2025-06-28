const base = require("./base/v3");

module.exports = {
  ...base,
  // 在 Chrome 中，用户需要手动在扩展管理页面启用"在隐私模式下允许"
  // 但我们可以声明扩展希望在隐私模式下工作
  incognito: "spanning",
  key: "ZIIBIjANBgkqhkiG9w0BAQEFEAOCAQ8AMIIBCgKCAQEAqAT2UeAxySjC+kt5uXMdqKIwuCA6QPkZmgAQ1OtpUSiNun0cfCv7lmDkIt9t5QPZtUVcIUGTR0EUabRNa2LtyZXqB6KXHPUBtp/6DQ6F8MyF73tjuE4DQuqSUkYzjS8Pu1rOlZptzjlCJ+Bbt0N0QX3uRm5eO+XSy7eDtCz6U+EE2lXgm/IO3ZySX/BO39pu5HglXbbALhp9Jftlatn532jhVeOX2ioMcMZfvzUsiqtkF5lt4MoOQFz0GACiwb7nzdwe5lFv7VCq+Ua6CWZfs0v0Ihr1hyTVVXPgyh+2vhaIVxeVOANOOflZ1cGWZD59Zy3exQM+HRl9wwAcmBfhZQIDAQAB",
};
