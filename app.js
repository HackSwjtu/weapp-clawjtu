{
    let _MAX_PREVIEW_LENGTH = 25;
    let posts;
    let GetDetail = str => {
        str = str.slice(0, str.indexOf('>>我要'));
        str = str.slice(str.indexOf('讲座内容：') + 5);
        return str;
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
                success: function(res) {
                    let _posts = res.data.lecture;
                    _posts = _posts.map(post => {
                        let detail = GetDetail(post.detail);
                        return {
                            title: post.title,
                            id: post.id,
                            descriptions: [
                                post.speaker,
                                post.time,
                                post.place
                            ],
                            preview: detail.slice(0, _MAX_PREVIEW_LENGTH),
                            content: detail
                        };
                    });
                    
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