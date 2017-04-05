  let app = getApp();
  Page({
    data: {
      post: null
    },
    onLoad: function(_options) {
        let _type = (_options.id.indexOf('COM') + 1) ? 'competition' : 'lecture';
      this.setData({
        post: app.globalData[_type + 's'].get(_options.id)
      });
    }
  });