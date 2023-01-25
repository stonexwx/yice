// index.js
// 获取应用实例
var app = getApp();
var searchValue =''
// pages/search/search.js
Page({
  data: {
   textForm:[
     {
       id:"12",
       title:"如何成为千万富翁",
       adminId:"你大爷还是你大爷",
       url:"https://www.baidu.com",
       addtime:"2020-10-23",
       content:""
     },
     {
      id:"11",
      title:"如何成为千万富翁",
      adminId:"你大爷还是你大爷",
      url:"",
      addtime:"2020-10-23",
      content:"跟着周总赚大钱!你迟早是千万富翁！"
    }
   ]
  },
  goText(e){
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/methodsDetail/methodsDetail?id='+id,
    })
    
  },
  onLoad: function () {
  },
});
