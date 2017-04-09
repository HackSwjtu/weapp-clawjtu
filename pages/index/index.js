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
  getPosts(_type) {
    if(this.data.status !== _type)
      this.backToTop();
    this.setData({status: _type});
    if(_type == 'fav')
      return app.getPosts({
        success: _posts => this.setPosts(_posts.filter(_post => _post.favorited))
      });
    if(_type == 'all')
      return app.getPosts({
        success: this.setPosts
      });
    app.getPostsByType({
      type: _type,
      success: this.setPosts
    });
  },
  getPostsByEvent(_event) {
    this.getPosts(_event.currentTarget.id);
  },
  refreshPosts() {
    app.refreshPosts({success: this.setPosts});
  },
  getCurrent() {
    this.getPosts(this.data.status);
  },
  onLoad() {
    this.getPosts('all');
    app.getUserInfo({success: _userInfo => this.setData({userInfo: _userInfo})});
  }
});