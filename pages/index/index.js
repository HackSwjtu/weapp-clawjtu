{
  let app = getApp();
  Page({
    data: {
      userInfo: {},
      favs: [],
      posts: null
    },
    onLoad() {
      app.getUserInfo(userInfo => this.setData({
        userInfo: userInfo
      }));
      app.getPosts(posts => this.setData({
        posts: posts
      }));
      app.getFavs(favs => this.setData({
        favs: favs
      }));
    },
    tapCompetition: event => wx.showModal({
      content: '学科竞赛列表正在建设中',
      showCancel: false,
      confirmText: '知道了'
    }),
    tapFavIcon(event) {
      let id = event.target.id;
      id = id.slice(id.indexOf('-') + 1);
      app.toggleFavs(id, _favs => this.setData({
        favs: _favs
      }));
    }
  });
}