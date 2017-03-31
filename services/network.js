var rootDocument = 'http://luluqiao.jonathan-li.cn';

function getLastweekLecture(cb) {
    wx.request({
      url: rootDocument + "/lecture/lastweek",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        // success
        return typeof cb == "function" && cb(res.data);
      },
      fail: function(res) {
        // fail
        return typeof cb == "function" && cb(false);
      },
      complete: function(res) {
        // complete
        console.log("Get lastweek lecture data! ")
      }
    })
}

function getLectureByKey(keyword, cb) {
    wx.request({
      url: root + '/lecture/search?keyword=' + keyword,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        return typeof cb == "function" && cb(res.data);
      },
      fail: function(res) {
        // fail
        return typeof cb == "function" && cb(false);
      },
      complete: function(res) {
        // complete
        console.log("Get the lecture by keyword! ")
      }
    })
}

module.exports = {
    getLastweekLecture: getLastweekLecture,
    getLectureByKey: getLectureByKey,
}
