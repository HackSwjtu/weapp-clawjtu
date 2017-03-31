{
  let app = getApp();
  Page({
    data: null,
    onLoad: function(options) {
      this.setData({
        speech: app.getPost(options.id)
      });
    }
  });
}