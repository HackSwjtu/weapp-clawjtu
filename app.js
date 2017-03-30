{
    let HandleUserInfo = (cb, userInfo) => {
        if(typeof cb == 'function')
            cb(userInfo);
    };
    App({
        getUserInfo(cb) {
            this.globalData.userInfo ?
                HandleUserInfo(cb, this.globalData.userInfo) :
                wx.login({
                    success: () => wx.getUserInfo({
                        success: res => HandleUserInfo(cb, this.globalData.userInfo = res.userInfo)
                    })
                });
        },
        globalData: {
            userInfo:null
        }
    })
}