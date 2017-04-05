let 
    parseLectureDetail = _detail_str => _detail_str,
    parseLecture = (_lecture, _favorited) => {
        return {
            id: 'LECTURE_' + _lecture.id,
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
        try{
           _favorites = JSON.parse(wx.getStorageSync('favorited_lecture_id'));
        } catch(e) {
            _favorites = [];
        }
        _favorites = new Map(_favorites);
        return new Map(
            _lecture_arr.map(_lecture => [
                'LECTURE_' + _lecture.id,
                parseLecture(
                    _lecture,
                    _favorites.get(
                        'LECTURE_' + _lecture.id
                    ) || false
                ),
            ])
        );
    },
    parseCompetitionDetail = _detail_str => _detail_str,
    parseCompetition = (_competition, _favorited) => {
        return {
            id: 'COMPETITION_' + _competition.id,
            title: _competition.title,
            descriptions: {
                time: _competition.publishdate
            },
            detail: parseCompetitionDetail(_competition.detail),
            favorited: _favorited
        }
    },
    parseCompetitions = _competition_arr => {
        let _favorites;
        try{
           _favorites = JSON.parse(wx.getStorageSync('favorited_competition_id'));
        } catch(e) {
            _favorites = [];
        }
        _favorites = new Map(_favorites);
        return new Map(
            _competition_arr.map(_competition => [
                'COMPETITION_' + _competition.id,
                parseCompetition(
                    _competition,
                    _favorites.get(
                        'COMPETITION_' + _competition.id
                    ) || false
                ),
            ])
        );
    };
let mapToArray = _map => {
  let _arr = [];
  _map.forEach(_element => _arr.push(_element));
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
              _options.success(mapToArray(this.globalData.lectures).sort(compareTime));
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
              _options.success(mapToArray(this.globalData.competitions).sort(compareTime));
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
            fail: () => _options.fail && _options.fail()
        });
    },
    getFavs(_options) {
        this.getPosts({
            success: _posts => {
                _options.success(_posts.filter(_post => _post.favorited));
            },
            fail: () => _options.fail && _options.fail()
        });
    },
    toggleFav(_options) {
        let _type = (_options.id.indexOf('COM') + 1) ? 'competition' : 'lecture';
        let _copy = this.globalData[_type + 's'].get(_options.id);
        _copy.favorited = !(_copy.favorited);
        this.globalData[_type + 's'].set(_options.id, _copy);
        wx.setStorage({
            key: 'favorited_' + _type + '_id',
            data: JSON.stringify(
                mapToArray(this.globalData[_type + 's']).map(_post => [_post.id, _post.favorited])
            ),
            success: _options.success
        });
    }
});