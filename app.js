let 
    parseLectureDetail = _detail_str => _detail_str,
    parseLecture = (_lecture, _favorited) => {
        return {
            id: _lecture.id,
            title: _lecture.title,
            descriptions: {
                content: _lecture.place,
                time: _lecture.time,
                speaker: _lecture.speaker
            },
            detail: parseLectureDetail(_lecture.detail),
            favorited: !!_favorited
        }
    },
    parseLectures = _lecture_arr => {
        let _favorites;
        try {
            _favorites = wx.getStorageSync('favorited_lecture_id').data;
        } catch(e) {
            _favorites = false;
        }
        return new Map(
            _lecture_arr.map(_lecture => [
                'LECTURE_' + _lecture.id,
                parseLecture(_lecture),
                _favorites && _favorites.get(_lecture_.id)
            ])
        );
    },
    parseCompetitionDetail = _detail_str => _detail_str,
    parseCompetition = (_competition, _favorited) => {
        return {
            id: _competition.id,
            title: _competition.title,
            descriptions: {
                time: _competition.publishdate
            },
            detail: parseCompetitionDetail(_competition.detail),
            favorited: !!_favorited
        }
    },
    parseCompetitions = _competition_arr => {
        let _favorites;
        try {
            _favorites = wx.getStorageSync('favorited_competition_id').data;
        } catch(e) {
            _favorites = false;
        }
        return new Map(
            _competition_arr.map(_competition => [
                'COMPETITION_' + _competition.id,
                parseCompetition(_competition),
                _favorites && _favorites.get(_competition.id)
            ])
        );
    };
let mapToArray = _map => {
  let _arr = [];
  _map.forEach(_object => _arr.push(_object));
  return _arr;
};
// 爬虫给的格式是标准的 yyyy-mm-dd hh:mm:ss
// 完全可以按字典序排序
let compareTime = (_p0, _p1) => _p0.descriptions.time > _p1.descriptions.time;
App({
    globalData: {
        userInfo: null,
        lectures: null,
        competitions: null
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
              _options.success(mapToArray(this.globalData.lectures));
          },
          fail: () => {
              this.globalData.lectures = null;
              _options.fail && _options.fail();
          }
        });
    },
    getLectures(_options) {
        if(this.globalData.lectures !== null)
            _options.success(mapToArray(this.globalData.lectures));
        else
            this.refreshLectures(_options);
    },
    refreshCompetitions(_options) {
        wx.request({
          url: 'https://api.hackswjtu.com/competition/recent',
          success: _res => {
              this.globalData.competitions = parseCompetitions(_res.data.competition);
              _options.success(mapToArray(this.globalData.competitions));
          },
          fail: () => {
              this.globalData.competitions = null;
              _options.fail && _options.fail();
          }
        });
    },
    getCompetitions(_options) {
        if(this.globalData.competitions !== null)
            _options.success(mapToArray(this.globalData.competitions));
        else
            this.refreshCompetitions(_options);
    },
    refreshPosts(_options) {
        let _result;
        this.refreshLectures({
            success: _lectures => {
                this.refreshCompetitions({
                    success: _competitions => _options.success(_lectures.concat(_competitions).sort(compareTime)),
                    fail: _options.fail
                });
            },
            fail: _options.fail
        });
    },
    getPosts(_options) {
        this.getLectures({
            success: _lectures => {
                this.getCompetitions({
                    success: _competitions => _options.success(_lectures.concat(_competitions).sort(compareTime)),
                    fail: _options.fail
                });
            },
            fail: _options.fail
        });
    }
});