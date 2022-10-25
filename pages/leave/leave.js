// leave.js
// 获取应用实例

var app = getApp()
var util = require('util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sno:'',
    nowDate: '',
    leaveDate: '',
    returnDate: '',
    studentClassItems: [
      { name: 'benkesheng', value: '本科生', checked: 'true' },
      { name: 'yanjiusheng', value: '研究生' },
    ],
    studentClass:'本科生',
    campusClassItems:[
      { name: 'daxuecheng', value: '大学城', checked: 'true' },
      { name: 'guihuagang', value: '桂花岗' },
      { name: 'huangpu', value: '黄埔' },
    ],
    campusClass:'大学城',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    leaveClassItems: [
      { name: 'shijia', value: '事假', checked: 'true' },
      { name: 'bingjia', value: '病假' },
      { name: 'shixi', value: '实习' },
      { name: 'xiuxue', value: '休学' },
      { name: 'liuxue', value: '留学' },
    ],
    leaveClass:'事假',

    reasonLength: 0,
    errmsg: "",
  },
//学号sno

bindSnoInput: function (e) {
  this.setData({
    sno: e.detail.value
  })
}, 
//学生类别
radioStudentClassChange: function (e) {
  var str = null;
  for (var value of this.data.studentClassItems) {
    if (value.name === e.detail.value) {
      str = value.value;
      break;
    }
  }
  this.setData({ studentClass: str});
},

//校区类别
radioCampusClassChange: function (e) {
  var str = null;
  for (var value of this.data.campusClassItems) {
    if (value.name === e.detail.value) {
      str = value.value;
      break;
    }
  }
  this.setData({ campusClass: str});
},


  //请假类别
  radioClassChange: function (e) {
    var str = null;
    for (var value of this.data.leaveClassItems) {
      if (value.name === e.detail.value) {
        str = value.value;
        break;
      }
    }
    this.setData({ leaveClass: str});
  },

  
//外出地点
     bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
     },
    

  // 离开日期变化时返回日期最小为离开日期
  bindLeaveDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      leaveDate: e.detail.value,
      returnDate: e.detail.value
    })
  },
  bindReturnDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      returnDate: e.detail.value
    })
  },
  textCount: function (e) {
    var len = e.detail.value.length
    if (len <= 150) {
      this.setData({
        reasonLength: len,
      })
    }
  },
  textBlur: function (e) {
    var len = e.detail.value.length
    if (len == 0) {
      this.setData({
        errmsg: "字数为0"
      })
    } else if (len < 10) {
      this.setData({
        errmsg: "字数太少了，写多点吧"
      })
    }
  },


  shangchuan: function(e){
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        var filename = res.tempFiles[0].name
        console.info(filename);
        that.setData({filename:filename});
 
 
        wx.uploadFile({
          url: 'https://myfirstgatsbysitemaster61932.gatsbyjs.io/',
          filePath: res.tempFiles[0].path,
          name: 'uploadFile',
          success(res) {
            //json字符串 需用JSON.parse 转
          }
        })
 
 
 
      }
    });


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // leaveDate和returnDate的初始化
    var today = util.formatDay(new Date())
    this.setData({
      nowDate: today,
      leaveDate: today,
      returnDate: today
    })
    console.log(today)
  },
  submit: function (e) {
    var reasonLen = e.detail.value.leaveReason.length
    if (reasonLen > 10) {
      // console.log('form submit 事件',e.detail.value)
      wx.showLoading({
        title: '申请提交中...',
        mask: true
      })
      var data = {
        //sno: app.globalData.regInfo.sno,
        
        region:this.data.region,
        leaveDate: this.data.leaveDate,
        returnDate: this.data.returnDate,
        leaveReason: e.detail.value.leaveReason,
        subDate: this.data.nowDate,
        leaveClass:this.data.leaveClass,
        studentClass:this.data.studentClass,
        campusClass:this.data.campusClass,
        sno:this.data.sno,
      }
      console.log('data = ', data)
      wx.cloud.callFunction({
          name: "upleave",
          data: data
        })
        .then(res => {
          // console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            mask: true,
            success: (res) => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              }, 2000);
            }
          })
        })
        .catch(err => {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          console.log(err)
        })
    } else {
      if (reasonLen == 0) {
        this.setData({
          errmsg: "*啥都不写，感觉辅导员不会批准哦"
        })
      } else if (reasonLen < 10) {
        this.setData({
          errmsg: "*这么一丢丢，你再多写一点嘛"
        })
      } else {
        this.setData({
          errmsg: ""
        })
      }
    }
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