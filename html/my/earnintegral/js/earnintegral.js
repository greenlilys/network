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
        websiteInfo: ''

    },
    // created: function() {
    //   setTimeout(function(){
    //     if (!vm.websiteInfo) {
    //         return
    //     } else {
    //       console.log("ddd");
    //         vm.makeCodeqrcode();
    //     }
    //   },600)
    // },
    methods: {
        //初始化
        init: function() {
            // vm.getuserInfo();
            // 获取网点账户
            vm.getwebsiteInfo();
        },

        // // 获取店铺信息详情
        // getuserInfo: function() {
        //     // 加载框
        //     var UILoading = api.require('UILoading');
        //     UILoading.flower({
        //         center: {
        //             x: (api.winWidth / 2),
        //             y: (api.winHeight / 2)
        //         },
        //         size: 30,
        //         fixed: true
        //     }, function(ret) {
        //         vm.UILoadId = ret.id;
        //     });
        //     apps.axget(
        //         "customer/selectInfo", {},
        //         function(data) {
        //             if (data) {
        //                 // 关闭打开的加载提示框
        //                 UILoading.closeFlower({
        //                     id: vm.UILoadId
        //                 });
        //                 alert(JSON.stringify(data));
        //                 vm.selectuserInfo = {};
        //                 vm.selectuserInfo = data;
        //
        //             }
        //         });
        // },
        getwebsiteInfo: function() {
            apps.axget(
                "sysSet/selectShopUsername", {},
                function(data) {
                    // alert(JSON.stringify(data));
                    if (data) {
                        vm.websiteInfo = '';
                        vm.websiteInfo = data.username;
                        if (vm.websiteInfo) {
                            // 预约中再生成二维码
                            vm.makeCodeqrcode();
                        }else{
                          var oImg = $("<img src='./images/ewm_09.png' style='width: 100%;height:100%;'>");
                          $("#qrcode").append(oImg);
                        }
                    }
                });
        },

        // 生成二维码程序
        makeCodeqrcode: function() {
            $('#qrcode').html('');
            $('#qrcodeBig').html('');

            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 100,
                height: 100
            });
            var content = 'http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=' + vm.websiteInfo;
            qrcode.makeCode(content);

            // 二维码大图(隐藏的)
            var qrcodeBig = $("#qrcodeBig").qrcode({
            			render:'canvas',
            			width: 100,
            			height:100,
            			text: 'http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=' + vm.websiteInfo
            		}).hide();
            var canvas=$("#qrcodeBig").find('canvas').get(0);
          //如果有循环,此句必不可少 qrcode.find('canvas').remove();
          var urls = canvas.toDataURL('image/jpg');
          if(urls){
            apps.axget('battery/selects',{image:urls},function(data){
              console.log(JSON.stringify(data) );
            });
          }

        },
        qrcodebigImg: function() {
            // 二维码大图
            apps.openMapWinUrl('openqrcode_img', 'battery/appointinfo/openqrcode_img.html', {
                qrcodebigImg:'http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=' + vm.websiteInfo
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
        }
    },
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
