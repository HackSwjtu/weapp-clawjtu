let 
    parseLectureDetail = _detail_str => _detail_str,
    parseLecture = (_lecture, _favorited) => {
        return {
            id: _lecture.id,
            title: _lecture.title,
            descriptions: [
                _lecture.place,
                _lecture.time,
                _lecture.speaker,
                // _lecture.speakerbrif
            ],
            detail: parseLectureDetail(_lecture.detail),
            favorited: !!_favorited
        }
    },
    parseLectures = _lecture_arr => {
        let _favorites;
        try {
            _favorites = wx.getStorageSync('lecture_favorited').data;
        } catch(e) {
            _favorites = false;
        }
        return new Map(
            _lecture_arr.map(_lecture_obj => [
                'LECTURE_' + _lecture_obj.id,
                parseLecture(_lecture_obj),
                _favorites && _favorites[_lecture_obj.id]
            ])
        );
    };
App({
    globalData: {
        userInfo: null,
        lectures: null
    },
    refreshUserInfo(_options) {
        let fail = () => {
            this.globalData.userInfo = null;
            _options.fail && _options.fail();
        };
        wx.login({
            success: () => {
                wx.getUserInfo({
                    success: _res => {
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
        let fail = () => this.refreshUserInfo(_options);
        if(this.globalData.userInfo !== null)
            wx.checkSession({
                success: () => _options.success(this.globalData.userInfo),
                fail: fail
            });
        else
            fail();
    },
    refreshLectures(_options) {
        wx.request({
          url: 'https://api.hackswjtu.com/lecture/lastweek',
          success: _res => {
              this.globalData.lectures = parseLectures(_res.data.lecture);
              _options.success(this.globalData.lectures);
          },
          fail: () => {
              this.globalData.lectures = null;
              _options.fail && _options.fail();
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