  let app = getApp();
  Page({
    data: {
      post: null
    },
    onLoad: function(_options) {
        let _type = _options.id.slice(0, _options.id.indexOf('_'));
      this.setData({
        post: app.globalData[_type + 's'].get(_options.id)
      });
    }
  });