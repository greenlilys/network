/**
 * 电池预约详情
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#earnintegral-frm',
    data: {
        selectuserInfo: {},
        UILoadId: '',
        websiteInfo: ''
    },
    created: function() {
      console.log("999");
      setTimeout(function(){
        if (!vm.websiteInfo) {
            return
        } else {
          console.log("ddd");
            vm.makeCodeqrcode();
        }
      },600)
    },
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
                        }
                    }
                });
        },

        // 生成二维码程序
        makeCodeqrcode: function() {
            $('#qrcode').html('');
            $('#qrcode').qrcode({
               render: "canvas",
              // text  : "http://192.168.0.107:8088/users/userRegister?iPhone=" + vm.userPhone, // 二维码内容
               text: 'http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=' + vm.websiteInfo, // 二维码内容
               width : 80,               //二维码的宽度
               height : 80,              //二维码的高度
               background : "#fff",       //二维码的后景色
               foreground : "#000",        //二维码的前景色
            });

            $('#qrcodeBig').html('');
            // 生成大图二维码
            var qrcodeBig = new QRCode(document.getElementById("qrcodeBig"), {
                width: 300, //设置宽高
                height: 300
            });
            var identcode2 = "http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=" + vm.websiteInfo; // 二维码内容
            qrcodeBig.makeCode(identcode2);
        },
        qrcodebigImg: function() {
            // 二维码大图
            apps.openMapWinUrl('openqrcode_img', 'battery/appointinfo/openqrcode_img.html', {
                qrcodebigImg: $('#qrcodeBig').html()
            });
        },
    },
});

apiready = function() {

    api.parseTapmode();
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();

}
