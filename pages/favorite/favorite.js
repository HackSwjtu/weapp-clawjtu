let app = getApp();
Page({
  data: {
    favs: null,
    posts: null
  },
  onShow() {
    wx.setNavigationBarTitle({
      title: "收藏夹"
    });
    app.getPosts(posts => this.setData({
      posts: posts.filter(post => this.data.favs[post.id])
    }));
    app.getFavs(favs => this.setData({
      favs: favs
    }));
  },
  tapFavIcon(event) {
    let id = event.target.id;
    id = id.slice(id.indexOf('-') + 1);
    app.toggleFavs(id, _favs => {
      this.setData({
        favs: _favs,
        posts: this.data.posts.filter(post => _favs[post.id])
      });
    });
    
  }
})