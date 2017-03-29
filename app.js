{
	App({
		onLaunch: function() {
			// 调用API从本地缓存中获取数据
			let logs = wx.getStorageSync('logs') || [];
			// unshift() 有副作用，也不语义化
			wx.setStorageSync('logs', [Date.now()].concat(logs));
		},
		getUserInfo: function(cb) {
			if(this.globalData.userInfo) {
				if(typeof cb == "function") {
					cb(this.globalData.userInfo);
				}
			} else {
				// 调用登录接口
				wx.login({
					success: () => wx.getUserInfo({
						success: res => {
							this.globalData.userInfo = res.userInfo;
							if(typeof cb == "function") {
								// 无需闭包，箭头函数 this 指向运行时上下文
								cb(this.globalData.userInfo);
							}
						}
					})
				});
			}
		},
		globalData: {
			userInfo: null
		}
	});
}