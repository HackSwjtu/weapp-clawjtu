{
  let app = getApp();
  Page({
    data: {
      userInfo: {},
      posts: null
    },
    onLoad() {
      app.getUserInfo(userInfo => this.setData(
        {userInfo: userInfo}
      ));
      app.getPosts(posts => this.setData(
        {posts: posts}
      ));
    },
    tapCompetition: function(event) {
      // 竞赛模块暂不显示
      wx.showModal({
        title: '',
        content: '学科竞赛列表正在建设中',
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  });
}