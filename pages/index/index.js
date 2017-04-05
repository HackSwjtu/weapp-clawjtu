let app = getApp();
let mapToArray = _map => {
  let _arr = [];
  _map.forEach(_object => _arr.push(_object));
  return _arr;
};
Page({
  data: {
    userInfo: null,
    posts: null
  },
  onLoad() {
    wx.setNavigationBarTitle({title: 'Clawjtu'});
    app.getUserInfo({
      success: _userInfo => this.setData({userInfo: _userInfo})
    });
    app.refreshLectures({
      success: _lectures => {
        this.setData({
          posts: mapToArray(_lectures)
        });
      }
    });
  }
});