
// pages/methodsDetail/methodsDetail.js
import {formatTime} from "../../utils/util";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        id:"",
        content:"",
        adminId:"",
        date:"",
        title:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.id)
        let that = this
        this.setData({// 把从index页面获取到的属性值赋给详情页的my，供详情页使用
          id:options.id
        })
            //根据id查询具体文章
        wx.request({
            url: 'https://yice.qsmx.org.cn/admin/article/getOne', //接口地址
            method: 'get',
            data: {
                // 参数：值
                "id":wx.getStorageSync('openid').id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                // 返回值
                if (res) {
                    that.setData({
                        content:res.data.content,
                        date:formatTime(new Date(res.data.addtime)),
                        title:res.data.title
                    })
                } else {
                    console.log("请求错误")
                }
            }
        })
  },
})