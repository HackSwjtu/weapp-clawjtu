{
  let app = getApp();
  let posts = [
    {
      title: "挖掘机技术哪家强",
      descriptions: [
        {
          type: "来源",
          content: "蓝翔"
        }
      ],
      preview: "挖掘机技术哪家强？山东技校找蓝翔！",
      loved: "loved"
    },
    {
      title: "震惊！99% 的人都不知道……",
      descriptions: [
        {
          type: "招聘",
          content: "UC 震惊部"
        }
      ],
      preview: "经实验检测，酸雨的主要成分是脱碳甲醛……",
      loved: "unloved"
    }
  ];
  Page({
    data: {
      userInfo: {},
      posts: posts
    },
    onLoad() {
      app.getUserInfo(userInfo => this.setData({
        userInfo:userInfo
      }));
    }
  });
}