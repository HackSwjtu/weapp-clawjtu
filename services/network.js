var rootURL = 'http://luluqiao.jonathan-li.cn';
var requestBase = function() {
  this.url = '';
  this.data = {};
  this.success = res => typeof cb == "function" && cb(res.data);
  this.fail = res => typeof cb == "function" && cb(false);
  this.complete = () => {};
}
requestBase.prototype = {
  Copy() {
    var copy = {}, v;
    Object.keys(requestBase).forEach((k, v) => {
      if(requestBase.prototype[k] === undefined && (v = requestBase[k]) !== undefined)
        copy[k] = v;
    });
    return copy;
  },
  Set(obj) {
    Object.keys(obj).forEach((k, v) => {
      if(obj.prototype[k] === undefined && (v = obj[k]) !== undefined)
        this[k] = v;
    });
    return this;
  }
}
var getLastweekLecture = cb => wx.request(
  new requestBase()
  .Set("url", rootURL + "/lecture/lastweek")
  .Set("complete", res => console.log("Get lastweek lecture data! "))
);
var getLectureByKey = cb => wx.request(
  new requestBase()
  .Set("url", rootURL + '/lecture/search?keyword=' + keyword)
  .Set("complete", res => console.log("Get the lecture by keyword! "))
);
module.exports = {
    getLastweekLecture: getLastweekLecture,
    getLectureByKey: getLectureByKey,
}