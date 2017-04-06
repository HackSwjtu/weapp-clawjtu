let description_keywords = {
    competition: {
        time: 'publishdate'
    },
    lecture: {
        content: 'place',
        time: 'time',
        speaker: 'speaker'
    }
};
let parseDescriptions = (_post, _type) => {
    let _result = {};
    Object.keys(description_keywords[_type]).forEach(_key => _result[_key] = _post[description_keywords[_type][_key]]);
    return _result;
};
let parsePost = (_post, _favorited, _type) => ({
    id: _type + '_' + _post.id,
    title: _post.title,
    descriptions: parseDescriptions(_post, _type),
    detail: _post.detail,
    favorited: _favorited
});
let getFavsFromStorage = _type => {
    let _favorites;
    try{
        _favorites = JSON.parse(wx.getStorageSync('favorited_' + _type + '_id'));
    } catch(e) { _favorites = []; }
    return new Map(_favorites);
};
let parsePosts = (_posts, _type) => {
        let _favorites = getFavsFromStorage(_type);
        return new Map(
            _posts.map(_post => [
                _type + '_' + _post.id,
                parsePost(_post, !!_favorites.get(_type + '_' + _post.id), _type),
            ])
        );
};
let mapToArray = _map => {
    let _arr = [];
    _map.forEach(_element => _arr.push(_element));
    return _arr;
};
let compareTime = (_p0, _p1) => _p0.descriptions.time > _p1.descriptions.time;
App({
    globalData: {
        userInfo: null,
        lectures: null,
        competitions: null,
        spider_apis: {
            lecture: 'https://api.hackswjtu.com/lecture/lastweek',
            competition: 'https://api.hackswjtu.com/competition/recent'
        }
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
    refreshPostsByType(_options) {
        wx.request({
          url: this.globalData.spider_apis[_options.type],
          success: _res => {
              this.globalData[_options.type + 's'] = parsePosts(_res.data[_options.type], _options.type);
              _options.success(mapToArray(this.globalData[_options.type + 's']).sort(compareTime));
          },
          fail: () => {
              this.globalData[_options.type + 's'] = null;
              _options.fail && _options.fail();
          }
        });
    },
    getPostsByType(_options) {
        switch(_options.type) {
            case 'fav':
                return this.getPosts({
                    success: _posts => _options.success(_posts.filter(_post => _post.favorited)),
                    fail: () => _options.fail && _options.fail()
                });
            case 'all':
                return this.getPosts(_options);
            default:
                if(this.globalData[_options.type + 's'] !== null)
                    _options.success(mapToArray(this.globalData[_options.type + 's']));
                else
                    this.refreshPostsByType(_options);
        }
    },
    refreshPosts(_options) {
        let _result;
        this.refreshPostsByType({
            type: 'lecture',
            success: _lectures => {
                this.refreshPostsByType({
                    type: 'competition',
                    success: _competitions => _options.success(_lectures.concat(_competitions).sort(compareTime)),
                    fail: _options.fail
                });
            },
            fail: _options.fail
        });
    },
    getPosts(_options) {
        this.getPostsByType({
            type: 'lecture',
            success: _lectures => {
                this.getPostsByType({
                    type: 'competition',
                    success: _competitions => _options.success(_lectures.concat(_competitions).sort(compareTime)),
                    fail: _options.fail
                });
            },
            fail: () => _options.fail && _options.fail()
        });
    },
    toggleFav(_options) {
        let _type = _options.id.slice(0, _options.id.indexOf('_'));
        let _map = this.globalData[_type + 's'];
        let _copy = _map.get(_options.id);
        _copy.favorited = !(_copy.favorited);
        _map.set(_options.id, _copy);
        wx.setStorage({
            key: 'favorited_' + _type + '_id',
            data: JSON.stringify(
                mapToArray(_map).map(_post => [_post.id, _post.favorited])
            ),
            success: _options.success
        });
    }
});