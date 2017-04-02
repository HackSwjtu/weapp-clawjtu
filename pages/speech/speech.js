{
  let app = getApp();
  Page({
    data: null,
    onLoad: function(options) {
      this.setData({
        speech: app.getPost(options.id)
      });
      let title = this.data.speech.title;
      if(title.length > 8)
        title = title.slice(0, 8) + '…';
      wx.setNavigationBarTitle({
        title: title
      });
    }
  });
}