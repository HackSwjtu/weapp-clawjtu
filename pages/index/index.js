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
    }
  });
}