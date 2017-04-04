App({
    globalData: {
        userInfo: null,
        lectures: null
    },
    refreshUserInfo(_options) {
        let fail = function() {
            this.globalData.userInfo = null;
            _options.fail();
        }
        wx.login({
            success() {
                wx.getUserInfo({
                    success(_res){
                        this.globalData.userInfo = _res.userInfo;
                        _options.success(this.globalData.userInfo);
                    },
                    fail: fail
                });
            },
            fail: fail
        });
    },
    getUserInfo(_options) {
        wx.checkSession({
            success() {
                _options.success(this.globalData.userInfo);
            },
            fail() {
                this.refreshUserInfo(_options);
            }
        });
    },
    parseLectureDetail(_detail_str) {
        return _detail_str;
    },
    parseLecture(_lecture_obj) {
        return {
            title: _lecture_obj.title,
            place: _lecture_obj.place,
            time: _lecture_obj.time,
            speacker: _lecture_obj.speacker,
            speacker_brief: _lecture_obj.speacker_brif,
            detail: this.parseLectureDetail(_lecture_obj.detail)
        }
    },
    parseLectures(_lecture_arr) {
        this.globalData.lectures = new Map(
            _lecture_arr.map(_lecture_obj => [_lecture_obj.id, this.parseLecture(_lecture_obj)])
        );
    },
    refreshLectures(_options) {
        wx.request({
          url: 'https://api.hackswjtu.com/lecture/lastweek',
          success(_res) {
              this.globalData.lectures = parseLectures(_res.data.lecture);
              _options.success(this.globalData.lectures);
          },
          fail() {
              this.globalData.lectures = null;
              _options.fail();
          }
        })
    },
    getLectures(_options) {
        if(this.globalData.lectures !== null)
            _options.success(this.globalData.lectures);
        else
            refreshLectures(_options);
    }
});