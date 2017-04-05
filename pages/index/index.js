let app = getApp();
Page({
  data: {
    userInfo: null,
    posts: null,
    status: 'all',
    scroll_top: 0
  },
  backToTop() {
    this.setData({scroll_top: 0});
  },
  toggleFav(_event) {
    let _id = _event.currentTarget.id.slice(4);
    app.toggleFav({
      id: _id,
      success: () => this.getCurrent()
    });
  },
  setPosts(_posts) {
    this.setData({posts: _posts});
  },
  getLectures() {
    if(this.data.status !== 'lectures')
      this.backToTop();
    this.setData({status: 'lectures'});
    app.getLectures({success: this.setPosts});
  },
  getCompetitions() {
    if(this.data.status !== 'competitions')
      this.backToTop();
    this.setData({status: 'competitions'});
    app.getCompetitions({success: this.setPosts});
  },
  getPosts() {
    if(this.data.status !== 'all')
      this.backToTop();
    this.setData({status: 'all'});
    app.getPosts({success: this.setPosts});
  },
  getFavs() {
    if(this.data.status !== 'favs')
      this.backToTop();
    this.setData({status: 'favs'});
    app.getFavs({success: this.setPosts});
  },
  refreshPosts() {
    app.refreshPosts({success: this.setPosts});
  },
  getCurrent() {
    switch(this.data.status) {
      case 'competitions':
        this.getCompetitions();
        break;
      case 'lectures':
        this.getLectures();
        break;
      case 'favs':
        this.getFavs();
        break;
      default:
        this.getPosts();
    }
  },
  onLoad(_option) {
    wx.setNavigationBarTitle({title: 'Clawjtu'});
    app.getUserInfo({
      success: _userInfo => this.setData({userInfo: _userInfo})
    });
    this.refreshPosts(_option);
  }
});