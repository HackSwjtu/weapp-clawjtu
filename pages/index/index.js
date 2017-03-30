{
  let app = getApp();
  Page({
    data: {
      userInfo: {},
      posts: [
        {
          title: "挖掘机技术哪家强",
          descriptions: [
            {
              type: "答案",
              content: "蓝翔"
            }
          ],
          preview: "挖掘机技术哪家强？山东技校找蓝翔！"
        },
        {
          title: "震惊！99% 的人都不知道……",
          descriptions: [
            {
              type: "招聘",
              content: "UC 震惊部"
            }
          ],
          preview: "经实验检测，酸雨的主要成分是脱碳甲醛……"
        }
      ]
    },
    onLoad() {
      app.getUserInfo(userInfo => this.setData({
        userInfo:userInfo
      }));
    }
  });
}