/**
 * 电池预约详情
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */
var wx;
// 声明vue加载
var vm = new Vue({
    el: '#earnintegral-frm',
    data: {
        selectuserInfo: {},
        UILoadId: '',
        websiteInfo: '',
        imgUrl:'',
        defaultImg:'./images/ewm_09.png'

    },
    methods: {
        //初始化
        init: function() {
            // 获取用户登陆手机号推广二维码
            vm.getwebsiteInfo();
        },

        getwebsiteInfo: function() {
            apps.axget(
                "sysSet/selectShopUsername", {},
                function(data) {
                    console.log(JSON.stringify(data));
                    if (data) {
                        vm.imgUrl = data.qrcode;
                        vm.websiteInfo = data.username;
                    }
                });
        },


        qrcodebigImg: function() {
            // 二维码大图
            apps.openMapWinUrl('openqrcode_img', 'battery/appointinfo/openqrcode_img.html', {
              imgUrl:vm.imgUrl,
              userPhone:vm.websiteInfo
            });
        },
        //分享注册链接到朋友圈
        shareWx: function() {
            wx.isInstalled(function(ret, err) {
              //检测是否安装了微信客户端
                if (ret.installed) {
                    wx.shareWebpage({
                        apiKey: '',
                        scene: 'timeline',
                        title: '天牛网注册链接',
                        description: '推广注册链接',
                        thumb: 'widget://image/logo.jpg',
                        contentUrl: "http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=" + vm.websiteInfo
                    }, function(ret, err) {
                        if (ret.status) {
                            toast('分享成功');
                        } else {
                            toast('分享失败');
                        }
                    });
                } else {
                    toast("当前设备未安装微信客户端");
                }
            });
        },
        //分享有推广二维码的图片到朋友圈
        shareWxFriends: function() {

          var makeSharePic = api.require('makeSharePic');
          console.log(makeSharePic)
          makeSharePic.makePicture({
              imgUrl: 'http://pic.jj20.com/up/allimg/911/021616153629/160216153629-1.jpg',
              qrCode: 'http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=' + vm.websiteInfo,
              savePath:'cache://image',
              fileName:'myErWeiMa.png',
              // expressType: '活动',
              goodTitle: ' 带点吃的算法酸辣粉机啊龙卷风了啦司法所发',
              nowPriceStatus: '现价 ：￥200',
              discountType: '券券',
              discountPrice: '30元',
              finalPriceType: '券后价',
              finalPrice: '100.0',
              //    savePath:'cache://image',
              //    fileName:'share.png',
              // insertImage: true,
              //    isHtmlText:true,
          }, function(ret, err) {
              if (ret.status) {
                  wx.shareImage({
                      apiKey: '',
                      scene: 'timeline',
                      contentUrl: ret.filePath
                  }, function(ret, err) {
                      if (ret.status) {
                          alert('分享成功');
                      } else {
                          alert('分享失败');
                      }
                  });
              } else {
                console.log("失败")
                  alert(err.message);
              }
          });
      }
    }
});

apiready = function() {
    wx = api.require('wx');
    api.parseTapmode();
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();

}
