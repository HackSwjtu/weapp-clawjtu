{
    let _MAX_PREVIEW_LENGTH = 100;
    let posts;
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
                success: function(res) {
                    let _posts = res.data.lecture;
                    _posts = _posts.map(post => ({
                        title: post.title,
                        id: post.id,
                        descriptions: [
                            post.speaker,
                            post.time,
                            post.place
                        ],
                        preview: post.detail.slice(0, _MAX_PREVIEW_LENGTH),
                        content: post.detail
                    }));
                    posts = _posts;
                    cb(posts);
                }
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
        }
    });
}