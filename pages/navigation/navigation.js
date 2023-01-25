import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
var amapFile = require('../../libs/amap-wx.130.js');

// 获取应用实例
var markersData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    distance: '',
    cost: '',
    polyline: [],
    choose:"",
    number: {},
    name:'',
    address:'',
    color:""
  },
  makertap: function(e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData,id);

  },
  distance:function(long1,lat1,long2,lat2) {
    let a,b,R;
    R=6378137
    lat1=lat1*Math.PI /180.0
    lat2 = lat2*Math.PI /180.0
    a=lat1-lat2
    b = (long1-long2) *Math.PI /180.0
    let d
    let sa2,sb2
    sa2=Math.sin(a/2.0)
    sb2=Math.sin(b/2.0)
    d = 2 * R * Math.asin(Math.sqrt(sa2 * sa2 + Math.cos(lat1) * Math.cos(lat2) * sb2 * sb2))
    return d
  },
  chooseConfirm:function (){
    let that =this
    wx.request({
      url: 'https://yice.qsmx.org.cn/user/search/choose', //接口地址
      method: 'post',
      data: {
        // 参数：值
        choose:this.data.choose
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        // 返回值
        if (res.data) {
          // 成功通知
          Notify({ type: 'danger', message: '开始导航' });

          wx.openLocation({
            latitude:Number.parseFloat(that.data.choose.split(",")[1]),	//维度
            longitude:Number.parseFloat(that.data.choose.split(",")[0]), //经度
            name: that.data.name,	//目的地定位名称
            scale: 15,	//缩放比例
            address: that.data.address	//导航详细地址
          })
        } else {
          Notify({ type: 'danger', message: '出错啦！请联系管理员' });
        }
      }
    })
  },
  //navigation
  daohang: function(destination){

    let that = this;

    let item = destination.currentTarget.dataset.destination
    var myAmapFun = new amapFile.AMapWX({key:'4fc27865eaa68c970181148e0c904809'});
    let origin= that.data.longitude+","+that.data.latitude
    let destination1=item.longitude+","+item.latitude
    this.setData({
      choose:destination1,
      name:item.name,
      address:item.address
    })

    myAmapFun.getWalkingRoute({
      origin,
      destination:destination1,
      success:function (data) {
        var points = [];
        if(data.paths && data.paths[0] && data.paths[0].steps){
          var steps = data.paths[0].steps;
          for(var i = 0; i < steps.length; i++){
            var poLen = steps[i].polyline.split(';');
            for(var j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if(data.paths[0] && data.paths[0].distance){
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if(data.paths[0] && data.paths[0].duration){
          that.setData({
            cost: parseInt(data.paths[0].duration/60) + '分钟'
          });
        }
        wx.showModal({
          title: '提示',
          content: '本厕的路程约为:'+that.data.distance+'\n花费约为:'+that.data.cost+'\n点击确认导航前往',
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              that.chooseConfirm()
            } else {//这里是点击了取消以后
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: function(info){
        wx.showModal({title:info.errMsg})
      }
    })
  },
  getTopHeight() {
    const { statusBarHeight } = wx.getSystemInfoSync(); //拿到的状态栏高度单位是px
    this.setData({
      topHeight:"top:"+statusBarHeight+"px;position:sticky;"
    })
  },
  onLoad: function() {
    var that = this;
    that.getTopHeight()
    var myAmapFun = new amapFile.AMapWX({key:'4fc27865eaa68c970181148e0c904809'});
    myAmapFun.getRegeo({
      success: function(data){
        markersData = data;

        that.setData({
          latitude: markersData[0].latitude
        });
        that.setData({
          longitude: markersData[0].longitude
        });
        that.showMarkerInfo(markersData,0);
      },
      fail: function(info){
        wx.showModal({title:info.errMsg})
      }
    })
    myAmapFun.getPoiAround({
      querykeywords:'厕所',
      success:function(data){
        that.updatezuobuai(data.markers)
      },
      fail:function (info) {
        wx.showModal({title:info.errMsg})
      }
    })




  },
  updatezuobuai:function (data) {
    let that = this
    wx.request({
      url: 'https://yice.qsmx.org.cn/user/search/host', //接口地址
      method: 'post',
      data: {markers:JSON.stringify(data)},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // 返回值
        if (res.data.flag) {

          let hot=[];
          let color=[]
          // 成功通知
          for(let i of res.data.data){
            if(i.choose==null||i.choose==undefined){
              hot.push(i.number*0.02/10*100)
              if(hot>70){
                color.push("red")
              }else {
                color.push("green")
              }
            }else {
              hot.push((i.choose*0.8+i.number*0.02)/10*100)
              if(hot>70){
                color.push("red")
              }else {
                color.push("green")
              }
            }
          }
          markersData=data
          for(let m = 0;m<markersData.length;m++){
            let d = that.distance(that.data.longitude,that.data.latitude,markersData[m].longitude,markersData[m].latitude)
            markersData[m]["d"]=Math.round(d)
            markersData[m]["host"]=Math.round(hot[m])
            markersData[m]["color"] = color[m]
          }
          that.setData({
            markers:markersData
          })

        } else {
          Notify({ type: 'danger', message: '出错啦！请联系管理员' });
        }
      }
    })
  },
  showMarkerInfo: function(data,i){
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].desc
      }
    });
  },
})