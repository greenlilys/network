/**
 * 签约合同
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#rescue_win',
    data: {
        //救援订单数据
        rescueOrder_data: {
          rescueOrderList: []
        },
        agreeTxtSta: 1,
        daystatistics: {},
        selOneNotice: {},
        selectRescueArr: [],  //  救援
        //订单状态   订单状态 0：待维修 1：已维修  2：已撤销
        orderstate: 1,
        //订单生效 0：网点撤销订单   1：网点接受订单 2：等待网点操作
        istakestate: 2,
        moredatatxt:'',
        pageSize: 5,
        pageNo: 1,
        totalPage: 0 ,// 总页数
        lon:"",
        lat:""
    },
    methods: {
        //初始化
        init: function() {
            var timer;
            var timerArr = [];
            // var storeSetdata = $api.getStorage("storeSetdata");
            vm.getdaystatistics();
            vm.getAddress();
            // alert("救援订单");
            // timer = setInterval(function() {
            //   apps.axget(
            //       "rescue/selectRescue", {
            //         pageNo: vm.pageNo,
            //         pageSize: vm.pageSize,
            //       },
            //       function(data) {
            //           vm.rescueOrder_data.rescueOrderList.splice(0,vm.rescueOrder_data.rescueOrderList.length);
            //           vm.rescueOrder_data.rescueOrderList = data;
            //           if (vm.rescueOrder_data.rescueOrderList.length) {
            //             if (vm.rescueOrder_data.rescueOrderList[0].paystate == 1 && vm.rescueOrder_data.rescueOrderList[0].istakestate == 1) {
            //                 // 时间转换时间戳
            //                 var now = Date.parse(new Date());
            //                 var rescueTime = Date.parse(vm.rescueOrder_data.rescueOrderList[0].addtime);
            //                 var nowDay = now / 86400000;
            //                 var rescueDay = rescueTime / 86400000;
            //                 if (nowDay - rescueDay < 1) {
            //                   for (var i = 0; i < timerArr.length; i++) {
            //                       clearInterval(timerArr[i]);
            //                   }
            //                   alert("用户支付了救援订单。");
            //                 }else {
            //                     for (var i = 0; i < timerArr.length; i++) {
            //                         clearInterval(timerArr[i]);
            //                     }
            //                 }
            //             }
            //             for (var i = 0; i < vm.rescueOrder_data.rescueOrderList.length; i++) {
            //                 if (vm.rescueOrder_data.rescueOrderList[i].paystate == 0 && vm.rescueOrder_data.rescueOrderList[i].istakestate == 2) {
            //                     for (var i = 0; i < timerArr.length; i++) {
            //                         clearInterval(timerArr[i]);
            //                     }
            //                     alert("你有一个新的订单，请在“我的”-“救援订单”选择“接单”或者“撤销订单”。");
            //                 }
            //             }
            //           }
            //       });
            // },20000);
            // timerArr.push(timer);
        },

        // 获取  救援订单 列表
        getdaystatistics: function(status) {
            apps.axget(
                "rescue/selectRescue", {
                  pageNo: vm.pageNo,
                  pageSize: vm.pageSize,
                },
                function(data) {
                    vm.rescueOrder_data.rescueOrderList = data;
                    console.log(JSON.stringify(data));
                    // alert(JSON.stringify(vm.rescueOrder_data.rescueOrderList));
                    // if (data.totalPage <= 1 || vm.pageNo == data.totalPage) {
                    //     vm.moredatatxt = "暂无更多记录";
                    // } else {
                    //     vm.moredatatxt = "上滑获取更多记录";
                    // }
                    // if (vm.pageNo == 1) {
                    //     vm.rescueOrder_data.rescueOrderList = [];
                    //     data.datas.forEach(function(item) {
                    //         if (item) {
                    //             // 预约中的时候-倒计时
                    //             if (item.state == 0) {
                    //
                    //             }
                    //             vm.rescueOrder_data.rescueOrderList.push(item);
                    //         }
                    //     });
                    //     vm.totalPage = data.totalPage; //总页数
                    // } else {
                    //     //第二页
                    //     //如果存在数据并且当前的页面小于等于总页码时push
                    //     if (data.datas.length && vm.pageNo <= data.totalPage) {
                    //         data.datas.forEach(function(item) {
                    //             // 预约中的时候-倒计时
                    //             if (item.state == 0) {
                    //
                    //             }
                    //             vm.rescueOrder_data.rescueOrderList.push(item);
                    //         });
                    //     }
                    // }
                    //     vm.pageNo++;
                });
        },
        // 电话
        settelsBtn: function(item) {
            // 拨打电话
                    api.call({
                        type: 'tel_prompt',
                        number: item.cellphone
                    });
        },
        //接受订单
        takeOrder: function(item) {
          // alert(JSON.stringify(item));
          api.confirm({
              title: '接单提醒',
              msg: '接受订单成功，请尽快联系救援用户完成订单任务。',
              buttons: ['确定接单', '暂不接单']
          },function(ret, err) {
              if (ret.buttonIndex == 1) {
                apps.axpost(
                  "/rescue/takeRescue", {
                      rescueid: item.rescueid,
                      customerid: item.customerid
                  },
                  function(data){
                      if (data) {
                        vm.init();
                        // setTimeout(function(){
                        //   api.closeToWin({
                        //       name: 'root'
                        //   });
                        // },300);
                      }
                  });
              }else {
                return false;
              }
          });
        },
        //撤销订单
        refuseOrder: function(item){
          api.confirm({
              title: '撤销提醒',
              msg: '撤销订单成功，请联系用户救援订单撤销原因。',
              buttons: ['确定撤销', '暂不撤销']
          },function(ret, err) {
              if (ret.buttonIndex == 1) {
                apps.axpost(
                  "/rescue/revokeRescue", {
                    rescueid: item.rescueid,
                    customerid: item.customerid
                  },
                  function(data){
                      if (data) {
                        vm.init();
                      }
                  });
              }else {
                return false;
              }
          });
        },
        // 未完成订单
        backlog: function(item) {

          api.confirm({
              title: '订单提醒',
              msg: '没有完成用户的救援服务，只能收取部分救援费用。',
              buttons: ['确定', '取消']
          },function(ret, err) {
              if (ret.buttonIndex == 1) {
                apps.axpost(
                  "rescue/unfinishedOrder", {
                      rescueid: item.rescueid,
                      mileage: item.mileage
                  },
                    function(data) {
                        if (data) {
                            setTimeout(function(){
                                api.closeToWin({
                                    name: 'root'
                                });
                            },300);
                        }
                    });
              }else {
                setTimeout(function(){
                  api.closeToWin({
                      name: 'root'
                  });
                },300);
              }
          });


        },
        getAddress:function(){
          vm.bMap.getLocationServices(function(ret,err){
            if(ret.enable){
              vm.bMap.getLocation({
                  accuracy: '10m',
                  autoStop: true,
                  filter: 1,
              }, function(ret, err) {
                  if (ret.status) {
                      console.log(JSON.stringify(ret));
                      vm.lon = ret.lon;
                      vm.lat = ret.lat;
                      // 保存如本地缓存
                  } else {
                      // alert('定位异常码：' + err.code);
                       toast('GPS信号弱');
                  }
              });
            }else{
                alert("请开启CPG定位")
            }
          })


        },
        navToAddress:function(lon,lat){
          console.log(lon + "-----" + lat);
          console.log(vm.lon + "-----" + vm.lat);
          var baiduNavigation = api.require('baiduNavigation');
          baiduNavigation.start({
              start: { // 起点信息.
                  position: { // 经纬度，与address配合可为空
                      lon: vm.lon, // 经度.
                      lat: vm.lat // 纬度.
                  },
                  //title: vm.selectShopInfo.name, // 描述信息
                  //address: vm.selectShopInfo.shopsAddress // 地址信息，与position配合为空
              },
              end: { // 终点信息.
                  position: { // 经纬度，与address配合可为空
                      lon: lon, // 经度.
                      lat: lat  // 纬度.
                  },
                  // title: "", // 描述信息
                  // address: "" // 地址信息，与position配合为空
              }
          }, function(ret, err) {
              if (ret.status) {
                  // api.alert({
                  //     title: "提示",
                  //     msg: '导航成功'
                  // });
              } else {
                  var msg = "未知错误";
                  if (1 == err.code) {
                      msg = "获取地理位置失败";
                  }
                  if (2 == err.code) {
                      msg = "定位服务未开启";
                  }
                  if (3 == err.code) {
                      msg = "线路取消";
                  }
                  if (4 == err.code) {
                      msg = "退出导航";
                  }
                  if (5 == err.code) {
                      msg = "退出导航声明页面";
                  }
                  api.alert({
                      title: "导航提示",
                      msg: msg
                  });
              }
          });

        }
    }
});
apiready = function() {
    // 实现沉浸式效果
    $api.fixStatusBar($api.dom("header"));
    vm.bMap = api.require('bMap');
    vm.init();
    api.parseTapmode();
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    // //上拉加载
    // api.addEventListener({
    //     name: 'scrolltobottom',
    //     extra: {
    //         threshold: 0     //设置距离底部多少距离时触发，默认值为0，数字类型
    //     }
    // }, function(ret, err) {
    //     // if (vm.pageNo < vm.totalPage) {
    //         vm.getdaystatistics();
    //     // }
    // });
}
