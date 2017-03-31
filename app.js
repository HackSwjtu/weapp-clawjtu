{
  let Hash = post => post.title.length;
  let posts = [
        {
            title: "Stability and Power Sharing in Microgrids",
            descriptions: [
                {
                    type: "主讲",
                    content: "Dr.-Ing. Johannes Schiffer"
                },
                {
                    type: "时间",
                    content: "2017年3月28日（周二）10:00-11:00"
                },
                {
                    type: "地点",
                    content: "西南交大（九里）4404A"
                },
                {
                    type: "邀请",
                    content: "张宏伟  副教授"
                },
                {
                    type: "承办与主办",
                    content: "研究生院 电气工程学院"
                }
            ],
            preview: "The microgrid represents a unique generation and distribution paradigm that can enable the vision of sustainable and resilient future power systems.",
            loved: "unloved",
            blocks: [
            {
                type: "讲座介绍",
                content: "The microgrid represents a unique generation and distribution paradigm that can enable the vision of sustainable and resilient future power systems. The present talk covers several aspects of the operation of microgrids and introduces relevant control problems in such networks. In particular, main operation modes of inverter-interfaced generation units are reviewed and a mathematical model of a microgrid is presented. Furthermore, three important performance criteria in such networks are introduced, namely frequency stability, voltage stability and power sharing. Control schemes to address these problems are discussed. The analysis is illustrated via experimental data and simulation examples of a microgrid based on the CIGRE benchmark medium voltage distribution network."
            },
            {
                type: "主讲人简介",
                content: "Johannes Schiffer received his Diploma degree in Engineering Cybernetics from the University of Stuttgart, Germany, in 2009 and a Ph.D. degree (Dr.-Ing.) in Electrical Engineering from TU Berlin, Germany, in 2015. Currently, he is a Lecturer (Assistant Professor) at the School of Electronic & Electrical Engineering, University of Leeds, UK. Prior to that, he has held appointments as research associate in the Control Systems Group (2011 - 2015) and at the Chair of Sustainable Electric Networks and Sources of Energy (2009 - 2011) both at TU Berlin. His current research interests include distributed control and analysis of complex networks with application to microgrids and power systems."
            }
        ]
        },
        {
            title: "西南交通大学 ACM 程序设计大赛 第一次网络赛",
            descriptions: [
                {
                    type: "级别",
                    content: "校级"
                },
                {
                    type: "地点",
                    content: "线上比赛 http://swjtuoj.com/"
                },
                {
                    type: "时间",
                    content: "2017年3月28日（周二）10:00-11:00"
                }
            ],
            preview: "尽管明天有考试，只要今天没AC。",
            loved: "loved",
            blocks: [
                {
                    type: "神他妈打油诗",
                    content: "尽管明天有考试，只要今天没AC。模拟只会猜题意，贪心只能过样例，数学上来先打表，DP一般看规律。 组合数学靠运气，计算几何瞎暴力，图论一顿套模板，数论只会GCD。"
                }
            ]
        }
    ];
  posts.forEach(post => post.id = Hash(post));
  let HandleUserInfo = (cb, userInfo) => {
      if(typeof cb == 'function')
          cb(userInfo);
  };
  App({
      getPost(id) {
          return posts.filter(post => (post.id == id))[0];
      },
      getPosts(cb) {
        cb(this.posts = posts);
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
      globalData: {
          userInfo: null,
          posts: null
      }
  });
}