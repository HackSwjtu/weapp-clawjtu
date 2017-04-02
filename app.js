{
    let HandleUserInfo = (cb, userInfo) => {
        if(typeof cb == 'function')
            cb(userInfo);
    };
    App({
        globalData: {
            userInfo: null,
            posts: null,
            favorites: wx.getStorageSync('favorites') || [],
            posts: null
        },
        getPost(id) {
            return this.globalData.posts.filter(post => (post.id == id))[0];
        },
        parsePost(post) {
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
                loved: this.globalData.favorites.some(id => id == post.id) ? "loved" : "unloved"
            };
            return result;
        },
        getPosts(cb) {
            wx.request({
                url: 'https://api.hackswjtu.com/lecture/lastweek',
                header: {
                    'content-type': 'application/json'
                },
                success: res => cb(this.globalData.posts = res.data.lecture.map(this.parsePost))
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
        getFavs(cb) {
            cb(this.globalData.favorites);
        },
        toggleFavs(id, cb) {
            this.globalData.favorites[id] = !this.globalData.favorites[id];
            wx.setStorageSync('favorites', this.globalData.favorites);
            cb(this.globalData.favorites);
        }
    });
}