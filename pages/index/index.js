// index.js

Page({
    data: {
        wcNum: 0,//拉拉次数
        dateString:''
    },
    //导航
    goNavigation(e) {
        let val = e.currentTarget.dataset.index;
        if (val == 1) {
            wx.navigateTo({
                url: '/pages/navigation/navigation',
            })
        } else if (val == 2) {
            wx.navigateTo({
                url: '/pages/tips/tips',
            })
        } else if (val == 3) {
            wx.navigateTo({
                url: '/pages/calendar/calendar',
            })
        } else if (val == 4) {
            wx.redirectTo({
                url: '/pages/integral/integral',
            })
        } else if (val == 5) {
            wx.navigateTo({
                url: '/pages/methodsDetail/methodsDetail?id=2',
            })
        } else if (val == 6) {
            wx.navigateTo({
                url: '/pages/recommend/recommend',
            })
        }
    },
    toggleTimer() {
        wx.redirectTo({
            url: '/pages/record/record',
        })
    },
    /**
     * 时间戳转化为年 月 日 时 分 秒
     * time: 需要被格式化的时间，可以被new Date()解析即可
     * format：格式化之后返回的格式，年月日时分秒分别为Y, M, D, h, m, s，这个参数不填的话则显示多久前
     */
    formatTime(time, format) {
        function formatNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        }

        function getDate(time, format) {
            const formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
            const returnArr = []
            const date = new Date(time)
            returnArr.push(date.getFullYear())
            returnArr.push(formatNumber(date.getMonth() + 1))
            returnArr.push(formatNumber(date.getDate()))
            returnArr.push(formatNumber(date.getHours()))
            returnArr.push(formatNumber(date.getMinutes()))
            returnArr.push(formatNumber(date.getSeconds()))
            for (const i in returnArr) {
                format = format.replace(formateArr[i], returnArr[i])
            }
            return format
        }

        function getDateDiff(time) {
            let r = ''
            const ft = new Date(time)
            const nt = new Date()
            const nd = new Date(nt)
            nd.setHours(23)
            nd.setMinutes(59)
            nd.setSeconds(59)
            nd.setMilliseconds(999)
            const d = parseInt((nd - ft) / 86400000)
            switch (true) {
                case d === 0:
                    const t = parseInt(nt / 1000) - parseInt(ft / 1000)
                    switch (true) {
                        case t < 60:
                            r = '刚刚'
                            break
                        case t < 3600:
                            r = parseInt(t / 60) + '分钟前'
                            break
                        default:
                            r = parseInt(t / 3600) + '小时前'
                    }
                    break
                case d === 1:
                    r = '昨天'
                    break
                case d === 2:
                    r = '前天'
                    break
                case d > 2 && d < 30:
                    r = d + '天前'
                    break
                default:
                    r = getDate(time, 'Y-M-D')
            }
            return r
        }

        if (!format) {
            return getDateDiff(time)
        } else {
            return getDate(time, format)
        }
    },
    requestData:function (data) {
        let currDate = new Date();
        // console.log(currDate.toLocaleDateString())
        this.setData({
            dateString: this.formatTime(currDate.toLocaleDateString(),"Y-M-D")
        })
        let that = this
        //发送请求
        wx.cloud.callContainer({
            "config": {
              "env": "prod-5grvjyaf94d8f0ad"
            },
            "path": "/time/select",
            "header": {
              "X-WX-SERVICE": "springboot-05r6"
            },
            "method": "GET",
            "data": {
                uid: data.id,
                "date": that.data.dateString
            },
            success: function (res) {
                        if (res.data) {
                            //拉拉条表赋值
                            that.setData({
                                wcNum: res.data.count
                            })
                            wx.setStorage({
                                key:"number",
                                data:that.data.wcNum
                            })
                        }
            },
          })
        // wx.request({
        //     url: 'https://yice.qsmx.org.cn/time/select',//接口地址
        //     //传输数据
        //     data: {
        //         uid: data.id,
        //         "date": that.data.dateString
        //     },
        //     method: "GET",//请求方法
        //     //请求成功
        //     success: function (res) {
        //         if (res.data) {
        //             //拉拉条表赋值
        //             that.setData({
        //                 wcNum: res.data.count
        //             })
        //             wx.setStorage({
        //                 key:"number",
        //                 data:that.data.wcNum
        //             })
        //         }
        //     },
        // })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    //获取当日拉拉次数
    onReady: function () {
        wx.getStorage(
            {
                key: 'number',
                success: (res) => {
                    //  console.log(res);
                    this.setData({
                        wcNum: res.data
                    })
                },
                fail: function (res) {
                    console.log(res)
                },
                complete: function (res) {
                    console.log(res)
                }
            })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let that = this
        wx.removeStorageSync("number")
       wx.login({
            success: function (res) {
                // wx.cloud.callContainer({
                //     "config": {
                //       "env": "prod-5grvjyaf94d8f0ad"
                //     },
                //     "path": "/admin/user/login",
                //     "header": {
                //       "X-WX-SERVICE": "springboot-05r6"
                //     },
                //     "method": "POST",
                //     "data": {
                //         "wxId": res.code
                //     },
                //     "success":function(d){
                //         if (d.data != null || d.data != "") {
                //             console.log(d.data.data)
                //             wx.setStorage({
                //                 key: 'openid',
                //                 data: d.data.data
                //             })
                //             that.requestData(d.data.data)
                //         }
                //     }
                //   })
                wx.request({
                    url: 'https://yice.qsmx.org.cn/admin/user/login', //接口地址
                    data: {wxId: res.code},//res.code就是当前调用wx.login生成的，有效时间5分钟
                    success: function (d) {
                        if (d.data != null || d.data != "") {
                            wx.setStorage({
                                key: 'openid',
                                data: d.data.data
                            })
                            that.requestData(d.data.data)
                        }
                    }
                });
            }
        });
        //页面刷新
    },
})
