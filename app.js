{
    let posts, favorites = wx.getStorageSync('favorites');
    if(!(favorites instanceof Array))
        favorites = [];
    let ParsePost = post => {
        post.time = "讲座时间：" + post.time;
        ['speaker', 'time', 'place'].forEach(key => post[key] = post[key].replace(/ ?[：:] ?/, '：'));
        post.detail = post.detail
            .slice(0, post.detail.indexOf('>>我要'))
            .slice(post.detail.indexOf('讲座内容：') + 5);
        let result =  {
            title: post.title,
            id: post.id,
            descriptions: [
                post.speaker,
                post.time,
                post.place
            ],
            content: post.detail,
            loved: favorites.some(id => id == post.id) ? "loved" : "unloved"
        };
        return result;
    };
    let HandleUserInfo = (cb, userInfo) => {
        if(typeof cb == 'function')
            cb(userInfo);
    };
    App({
        globalData: {
            userInfo: null,
            posts: null
        },
        getPost(id) {
            return posts.filter(post => (post.id == id))[0];
        },
        getPosts(cb) {
            wx.request({
                url: 'https://api.hackswjtu.com/lecture/lastweek',
                header: {
                    'content-type': 'application/json'
                },
                success: res => cb(posts = res.data.lecture.map(ParsePost))
            });
        },
        getUserInfo(cb) {
            this.globalData.userInfo ?
                HandleUserInfo(cb, this.globalData.userInfo) :
                wx.login({
                  success: () => wx.getUserInfo({
                    success: res => HandleUserInfo(
                        cb,
                        this.globalData.userInfo = res.userInfo
                    )
                })
            });
        },
        fav(id) {
            let post = this.getPost(id);
            [post.loved, favorites] =
                post.loved[0] == 'u' ?
                    ['loved', favorites.concat([id])] :
                    ['unloved', favorites.filter(fav_id => fav_id != id)];
            wx.setStorageSync('favorites', favorites);
            wx.redirectTo({
              url: '../index/index'
            });
        }
    });
}