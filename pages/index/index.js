{
  let app = getApp();
  Page({
    data: {
      userInfo: {},
      posts: null
    },
    onLoad() {
      app.getUserInfo(userInfo => this.setData({
        userInfo: userInfo
      }));
      app.getPosts(posts => this.setData({
        posts: posts
      }));
    },
    tapCompetition: event => wx.showModal({
      content: '学科竞赛列表正在建设中',
      showCancel: false,
      confirmText: '知道了'
    })
  });
}