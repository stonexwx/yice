import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

    /**
     * 页面的初始数据
     */
    data: {

        wxid: '',
        transformIdx: 0,
        position: 'center',
        duration: 300,
        show: false,
        overlay: false,
        //弹出
        showDia: false,
        //弹出计时
        showTime: false,
        // 显示计时器
        showTimer: true,
        h: '00',
        m: '00',
        s: '00',
        //存储计时器
        setInter: '',
        setgo: '',
        num: 1,

        //开始时间+结束时间
        toiletForm: {
            startTime: "",
            endTime: "",
            state: "无",

        },
        //用户选择的提醒时间
        selectTime: "",
        actions: [
            {
                name: '健康'
            },
            {
                name: '便秘'
            },
            {
                name: '窜稀'
            },
            {
                name: '上火'
            },
        ],
        Timeactions: [
            {
                name: '10min',
            },
            {
                name: '15min',
            },
            {
                name: '20min',
            },
            {
                name: '30min',
            },
        ],

    },

    //显示弹窗
    showAction: function (params) {
        this.setData({showDia: true});
    },
    //关闭弹窗
    onClose() {
        this.setData({showDia: false});
    },
    timeClose() {
        this.setData({showTime: false});
    },
    //选择
    onSelect(event) {
        this.setData({
            ['toiletForm.state']: event.detail.name
        })
        this.endWc();
    },
    timeSelect(event) {
        // console.log(event.detail.name.substr(0,2))
        let subTime = event.detail.name.substr(0, 2)
        this.setData({selectTime: subTime});
    },
    showNext(e) {
        const idx = e.currentTarget.dataset.idx
        this.setData({
            show: true,
            transformIdx: idx
        })
    },
    showTime() {
        this.setData({
            showTime: true
        })
    },
    showPrev() {
        this.setData({
            show: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
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
            wx.navigateTo({
                url: '/pages/integral/integral',
            })
        } else if (val == 5) {
            wx.navigateTo({
                url: '/pages/methodsDetail/methodsDetail?id=2',
            })
        } else if (val == 6) {
            wx.navigateTo({
                url: '/pages/index/index',
            })
        }
    },
    //计时器
    queryTime() {
        const that = this;
        let util = require('../../utils/util.js')
        let date = util.formatTime(new Date());
        that.setData({
            ['toiletForm.startTime']: date
        })
        if (that.data.setInter) {
            //清除计时器  即清除setInter
            this.clear();
        }
        that.setData({
            showTimer: false,

        });
        var hou = that.data.h
        var min = that.data.m
        var sec = that.data.s

        that.data.setInter = setInterval(function () {
            sec++
            if (sec >= 60) {
                sec = 0
                min++
                if (min >= 60) {
                    min = 0
                    hou++
                    that.setData({
                        h: (hou < 10 ? '0' + min : min)
                    })
                } else {
                    that.setData({
                        m: (min < 10 ? '0' + min : min)
                    })
                }
            } else {
                that.setData({
                    s: (sec < 10 ? '0' + sec : sec)
                })
            }
            if (min == that.data.selectTime) {
                Notify({type: 'danger', message: '您设置的时间已经到啦！快快请起！'});
            } else if (min == "5") {
                Notify({type: 'danger', message: '健康五分钟已经到了！快快请起！'});
            }
            var numVal = that.data.num + 1;
            that.setData({num: numVal});

        }, 1000)

    },
    //点击结束计时
    clear() {
        console.log(this.data.toiletForm.startTime)
        if (this.data.toiletForm.startTime == "") {
            console.log("1")
            wx.showModal({
                title: '提示',
                content: '您还没有开始计时哦~',
                success: function (res) {
                    if (res.confirm) {//这里是点击了确定以后
                        console.log('用户点击确定')
                    } else {//这里是点击了取消以后
                        console.log('用户点击取消')
                    }
                }
            })
        } else {
            clearInterval(this.data.setInter)
            let util = require('../../utils/util.js')
            let date = util.formatTime(new Date());
            this.setData({
                ['toiletForm.endTime']: date
            })
            this.showAction();
        }
    },
    //上传数据
    endWc() {
        console.log(this.data.toiletForm.wcNum)
        // Notify({ type: 'warning', message: '成功记录！' });
        // clearInterval(this.data.setInter)
        // this.data.setgo = setInterval(function () {
        //     wx.navigateTo({
        //         url: '/pages/index/index',
        //     })
        // }, 3000)
        //使用时注释以上
        let that = this
        wx.request({
            url: 'https://yice.qsmx.org.cn/time/insert', //接口地址
            method: 'post',
            data: {
                // 参数：值
                uid: wx.getStorageSync('openid').id,
                time: that.data.toiletForm.startTime.split(" ")[1]+"-"+that.data.toiletForm.startTime.split(" ")[1],
                state: that.data.toiletForm.state,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
                // 返回值
                if (res) {
                    // 成功通知
                    Notify({ type: 'danger', message: '成功记录！' });
                    let wcNum = wx.getStorageSync("number")
                    wcNum++
                    clearInterval(that.data.setInter);
                    wx.setStorage({
                        key: "number",
                        data: wcNum,
                    })
                    // that.data.setgo = setInterval(function () {
                    //     wx.switchTab({
                    //         url: '/pages/index/index',
                    //         success:function(e){
                    //             let page = getCurrentPages().pop();
                    //             if(page == undefined || page == null)return;
                    //             page.onLoad();
                    //         }
                    //     })
                    // },3000)
                    wx.redirectTo({
                        url: '/pages/index/index',
                    })

                } else {
                    Notify({ type: 'danger', message: '上传失败' });
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        clearInterval(this.data.setgo);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})