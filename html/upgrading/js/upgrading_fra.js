/**
 * 升级最低配置
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#main',
    data: {
      wallet:"",//钱包余额
      batteryCun:{},//当前网点配置电池信息，需要缴纳的升级金额
        paymode: 0,//支付方式
        usealipay: true, //使用支付宝
        usewxpay: false, //使用微信支付
        requestalipay: '' //支付宝返回请求数据
    },
    methods: {
      //获取余额
      getbatterySelect: function() {
          apps.axget(
              "battery/select", {},
              function(data) {
                console.log(JSON.stringify(data.wallet));
                  vm.wallet = data.wallet;
              });
      },
      //达到最低配置的网点提交信息
      putShopInfo:function(){
        apps.axpost("shopBattery/shopOverpay",{
          msg:vm.batteryCun.msg,
          amount:vm.batteryCun.amount,
          costdistribute:vm.batteryCun.costdistribute
        },function(data){
            toast("提交成功")
        })
      },
        // 支付模式选择
        paymodeBtn: function(paymodeNum) {
            if (paymodeNum == '0') {
                vm.paymode = 0;
                vm.usealipay = true;
                vm.usewxpay = false;
            }
            if (paymodeNum == '1') {
                vm.paymode = 1;
                vm.usewxpay = true;
                vm.usealipay = false;
            }
            if (paymodeNum == '2') {
                vm.paymode = 2;
                vm.usewxpay = false;
                vm.usealipay = false;
            }
        },
        //调用支付宝客户端支付
        aliPayfun: function() {
            var aliPayPlus = api.require('aliPayPlus');
            aliPayPlus.payOrder({
                orderInfo: vm.requestalipay
            }, function(ret, err) {
                if (ret) {
                    switch (ret.code) {
                        // code为 1 说明返回成功
                        case '9000':
                            // api.sendEvent({
                            //     name: 'updatedataops',
                            // });
                            //支付成功跳转到 提示页面
                            api.alert({
                                title: '操作提醒',
                                msg: '电池增加配货成功',
                            }, function(ret, err) {
                                api.closeWin();
                            });
                            break;
                        case '4000':
                            api.toast({
                                msg: '系统异常',
                                location: 'middle'
                            });
                            break;
                        case '4006':
                            api.toast({
                                msg: '订单支付失败',
                                location: 'middle'
                            });
                            break;
                        case '6000':
                            api.toast({
                                msg: '支付服务正在进行升级操作',
                                location: 'middle'
                            });
                            break;
                        case '6001':
                            api.toast({
                                msg: '用户中途取消支付操作',
                                location: 'middle'
                            });
                            break;
                        case '0001':
                            api.toast({
                                msg: '缺少商户配置信息（商户id，支付公钥，支付密钥）',
                                location: 'middle'
                            });
                            break;
                        case '0002':
                            api.toast({
                                msg: '缺少参数（subject、body、amount、tradeNO）',
                                location: 'middle'
                            });
                            break;
                        case '0003':
                            api.toast({
                                msg: '签名错误（公钥私钥错误）',
                                location: 'middle'
                            });
                            break;
                        default:
                            alert(ret.code);
                            api.toast({
                                msg: '收款方支付宝账户状态异常',
                                location: 'middle'
                            });
                            break;
                    }
                } else {
                    alert('收款方账户状态异常');
                }
            });
        },
        //调用微信客户端支付
        wxpayfun: function() {
            var wxPay = api.require('wxPay');
            wxPay.payOrder({
                apiKey: vm.requestalipay.appid,
                orderId: vm.requestalipay.prepayid,
                mchId: vm.requestalipay.partnerid,
                nonceStr: vm.requestalipay.noncestr,
                timeStamp: vm.requestalipay.timestamp,
                package: vm.requestalipay.package,
                sign: vm.requestalipay.sign
            }, function(ret, err) {
                //支付成功
                if (ret.status) {
                    //支付成功
                    // api.sendEvent({
                    //     name: 'updatedataops',
                    // });
                    //支付成功跳转到 提示页面
                    api.alert({
                        title: '操作提醒',
                        msg: '增配订单提交成功，请等待平台配货',
                    }, function(ret, err) {
                        api.closeWin();
                    });
                } else {
                    // code: 1
                    //错误码：
                    //-2（用户取消，发生场景：用户不支付了，点击取消，返回APP）
                    //-1（未知错误，可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等）
                    //1 (apiKey值非法)
                    // alert(err.code);
                    switch (err.code) {
                        case -1:
                            api.toast({
                                msg: '系统异常或者未知错误，请联系管理员',
                                location: 'middle'
                            });
                            break;
                        case -2:
                            api.toast({
                                msg: '用户中途取消支付操作',
                                location: 'middle'
                            });
                            break;
                        default:
                            api.toast({
                                msg: '收款方账户状态异常',
                                location: 'middle'
                            });
                            break;
                    }
                }
            });
        },

    }
});



apiready = function() {
  // console.log(JSON.stringify(api.pageParam));
  vm.batteryCun = api.pageParam.data;
  vm.getbatterySelect();
}


function payBtn() {
  console.log("paymode:" + vm.paymode + "msg:" + vm.batteryCun.msg + "amount:" + vm.batteryCun.amount + "costdistribute" + vm.batteryCun.costdistribute);

    apps.axpost(
        "shopBattery/shopOverpay", {
            msg:vm.batteryCun.msg,
            amount:vm.batteryCun.amount,
            costdistribute:vm.batteryCun.costdistribute,
            paymode: vm.paymode
        },
        function(data) {
          vm.requestalipay = data;
          console.log(data);
          if(vm.paymode == 2 && vm.wallet > vm.batteryCun.amount){
            // 钱包支付
            if (data == "") {
                //支付成功跳转到 提示页面
                // api.sendEvent({
                //     name: 'updatedataops',
                // });
                //支付成功跳转到 提示页面
                api.alert({
                    title: '操作提醒',
                    msg: '订单提交成功，请等待平台配货',
                }, function(ret, err) {
                    api.closeWin();
                });
            }
          }else if(vm.paymode == 0 || vm.paymode == 1){

            // 如果 支付宝支付
            if (vm.paymode==0) {
                api.toast({
                    msg: '请用支付宝付款',
                    location: 'middle'
                });
                if (vm.requestalipay) {
                    vm.aliPayfun();
                }
            }
            // 如果 微信支付
            if (vm.paymode==1) {
                api.toast({
                    msg: '请用微信付款',
                    location: 'middle'
                });
                if (vm.requestalipay) {
                    vm.wxpayfun();
                }
            }
          }



        });
}
