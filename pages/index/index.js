let app = getApp();
Page({
  data: {
    userInfo: null,
    posts: null
  },
  setPosts(_posts) {
    this.setData({posts: _posts});
  },
  getLectures() {
    app.refreshLectures({success: this.setPosts});
  },
  getCompetitions() {
    app.refreshCompetitions({success: this.setPosts});
  },
  getPosts(_option) {
    app.refreshPosts({success: this.setPosts});
  },
  onLoad(_option) {
    wx.setNavigationBarTitle({title: 'Clawjtu'});
    app.getUserInfo({
      success: _userInfo => this.setData({userInfo: _userInfo})
    });
    this.getPosts(_option);
  }
});