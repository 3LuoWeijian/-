// pages/second-level/BackRequest/BackRequest.js
var myDate = new Date();
const db = wx.cloud.database();
var that = this;
const app = getApp().appData;
var util = require('util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setDate: myDate.toLocaleDateString(),
    arriveDate: myDate.toLocaleDateString(),
    subDate:myDate.toLocaleDateString(),
    fdy_name: '肖章益',
    array: ['肖章益', '中国', '巴西', '日本'],
    objectArray: [{
        id: 0,
        name: '肖章益'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    stu_name: null,
    stu_id: null,
    sno: null,
    class: null,
    academy: null,
    phone: null,
    region: null,
    customItem: '全部',
    stu_type: '本科生',
    campus: '大学城',
    conveyance: '高铁',
    timeofconveyance: null,
    inresidence: true,
    show: true, //显示选择图片的按钮
    imgList: [],
    newImgList: [],
    maxPhoto: 10, //最大上传10张图片
    pass_fdy: false,
    pass_xsc: false,
    pass_xy: false,
    rejectedState: false, //是否被驳回
    riskRegion: "false", //是否为中高风险地区
    submitTime: null,
    submitState: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date())
    this.setData({
      submitTime: time,
      stu_name: app.stu_name,
      class: app.class,
      sno: app.sno,
      academy: app.academy,
      phone: app.phone,
      //stu_id:_id,
    })



  },
  //辅导员名字
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,

    })
    this.setData({
      fdy_name: this.data.objectArray[this.data.index].name
    })
    console.log(this.data.fdy_name)
  },

  //改变学生类型
  bindTypechange(e) {
    console.log(e.detail)
    this.setData({
      stu_type: e.detail.value
    })
  },

  //改变校区
  bindCampuschange(e) {
    console.log(e.detail.value)
    this.setData({
      campus: e.detail.value
    })
    console.log(this.data.campus)
  },

  //改变交通工具
  bindConveyancechange(e) {
    console.log(e.detail.value)
    this.setData({
      conveyance: e.detail.value
    })
    console.log(this.data.conveyance)
  },

  //是否住校
  bindInresidencechange(e) {
    console.log(e.detail.value)
    this.setData({
      inresidence: e.detail.value
    })
    console.log(this.data.inresidence)
  },


  //修改出发日期
  bindsetDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      setDate: e.detail.value
    })
  },
  //修改到校时间
  bindarriveDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      arriveDate: e.detail.value
    })
  },

  //改变返校地点
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  //是否为中高风险地区
  bindRiskRegionchange(e) {
    this.setData({
      riskRegion: e.detail.value
    })
    console.log(this.data.riskRegion)
  },

  chooseImg(e) {
    if (this.NextTap) {
      return;
    }
    this.NextTap = true;
    setTimeout(() => {
      this.NextTap = false;
    }, 1500) //1.5秒之后可以再次点击，防止用户重复点击
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success: (res) => {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            this.chooseWxImage('album') //相册
          } else if (res.tapIndex == 1) {
            this.chooseWxImage('camera') //拍照
          }
        }
      }
    })
  },
  /**
   * 上传照片
   * @param {*} type
   */
  chooseWxImage: function (type) {
    let {
      imgList,
      maxPhoto
    } = this.data
    if (imgList.length > 10) {
      wx.showToast({
        title: '最多上传10张',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this
    wx.chooseImage({

      count: maxPhoto - imgList.length, // 最多可以选择多少张图片
      sizeType: ['compressed'], //所选的图片的尺寸
      sourceType: [type], //图片来源
      success: (res) => {
        console.log(res)
        let tempFilePaths = res.tempFilePaths //成功后返回的的路径
        console.log(tempFilePaths)
        //把图片对应的路径都追加到数组中
        tempFilePaths.forEach(item => {
          imgList.push(item)
        })
        //上传到云存储
        var newImgList = []
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.cloud.uploadFile({
            cloudPath: 'stuPhoto/' + this.data.academy + '/' + this.data.sno + new Date().getTime() + Math.floor(Math.random() * 1000) + '.jpg',
            filePath: tempFilePaths[i],
            success: res => {
              console.log('上传成功', res.fileID)
              newImgList.push(res.fileID)
            }
          })
        }
        console.log('云存储序列', newImgList)
        that.setData({
          newImgList: newImgList,
          imgList: imgList,
          show: imgList.length >= 10 ? false : true
        })
      }
    })
  },
  /*
   * 图片预览
   * @param e
   */
  previewImg(e) {
    console.log(e)
    let currentUrl = e.currentTarget.dataset.src;
    console.log('wu', e.currentTarget.dataset.src)
    let urls = this.data.imgList
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 删除上传的图片
   * @param e
   */
  deleteUpload(e) {
    console.log(e)
    let {
      index
    } = e.currentTarget.dataset;
    let {
      newImgList
    } = this.data;
    let {
      imgList
    } = this.data;
    imgList.splice(index, 1)
    newImgList.splice(index, 1)
    this.setData({
      imgList: imgList,
      newImgList: newImgList,
      show: imgList.length >= 10 ? false : true
    })
  },

  submit: function (e) {
    var that = this
    //提交成功的情况
    db.collection('BackRequest')
      .orderBy('submitTime', 'desc')
      .where({
        sno: app.sno
      }).get({
        success: function (res) {
          console.log('进来了')
          if (res.data.length == 0) {
            console.log('在这里')
            if (that.data.imgList.length == 0) {
              console.log(that.data.imgList.length)
              wx.showToast({
                title: '请上传照片证明',
                mask: true,
                duration: 500,
              })
            } else {
              if (that.data.imgList.length == that.data.newImgList.length) {
                wx.showLoading({
                  title: '申请提交中...',
                  mask: true,
                })
                var data = {
                  stu_name: that.data.stu_name,
                  sno: that.data.sno,
                  class: that.data.class,
                  academy: that.data.academy,
                  phone: that.data.phone,
                  region: that.data.region,
                  riskRegion: that.data.riskRegion,
                  stu_type: that.data.stu_type,
                  setDate: that.data.setDate,
                  arriveDate: that.data.arriveDate,
                  campus: that.data.campus,
                  conveyance: that.data.conveyance,
                  timeofconveyance: that.data.timeofconveyance,
                  inresidence: that.data.inresidence,
                  pass_fdy: that.data.pass_fdy,
                  pass_xy: that.data.pass_xy,
                  pass_xsc: that.data.pass_xsc,
                  fdy_name: that.data.fdy_name,
                  newImgList: that.data.newImgList,
                  rejectedState: that.data.rejectedState,
                  stu_id: that.data.stu_id,
                  submitTime: that.data.submitTime,
                  submitState: 1
                }
                console.log('data = ', data)
  
                wx.cloud.callFunction({
                    name: "backrequest",
                    data: data,
                  })
                  .then(res => {
                    console.log(res)
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
                        }, 500);
  
  
  
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
                    console.log("失败", err)
                  })
                wx.vibrateShort()
              } else {
                wx.showToast({
                  title: '请稍等...',
                  icon: 'loading',
                  duration: 1000,
                  mask: true
                })
              }
  
            }
          }
          if (res.data[0].pass_fdy == false && res.data[0].rejectedState == false) {
            console.log(that.data.imgList.length)
            wx.showToast({
              title: '请勿重复提交',
              icon:'none',
            })
            console.log('123')
            return
          }

          if (that.data.imgList.length == 0) {
            console.log(that.data.imgList.length)
            wx.showToast({
              title: '请上传照片证明',
              mask: true,
              duration: 500,
            })
          } else {
            if (that.data.imgList.length == that.data.newImgList.length) {
              wx.showLoading({
                title: '申请提交中...',
                mask: true,
              })
              var data = {
                stu_name: that.data.stu_name,
                sno: that.data.sno,
                class: that.data.class,
                academy: that.data.academy,
                phone: that.data.phone,
                region: that.data.region,
                riskRegion: that.data.riskRegion,
                stu_type: that.data.stu_type,
                setDate: that.data.setDate,
                arriveDate: that.data.arriveDate,
                campus: that.data.campus,
                conveyance: that.data.conveyance,
                timeofconveyance: that.data.timeofconveyance,
                inresidence: that.data.inresidence,
                pass_fdy: that.data.pass_fdy,
                pass_xy: that.data.pass_xy,
                pass_xsc: that.data.pass_xsc,
                fdy_name: that.data.fdy_name,
                newImgList: that.data.newImgList,
                rejectedState: that.data.rejectedState,
                stu_id: that.data.stu_id,
                submitTime: that.data.submitTime,
                submitState: 1
              }
              console.log('data = ', data)

              wx.cloud.callFunction({
                  name: "backrequest",
                  data: data,
                })
                .then(res => {
                  console.log(res)
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
                      }, 500);



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
                  console.log("失败", err)
                })
              wx.vibrateShort()
            } else {
              wx.showToast({
                title: '请稍等...',
                icon: 'loading',
                duration: 1000,
                mask: true
              })
            }

          }

        },

      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})