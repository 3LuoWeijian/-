// pages/my/my.js
const db = wx.cloud.database();
var that = this;
const app= getApp().appData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    isLogin:'',

  },

  onLoad(){
    let user=wx.getStorageSync('user')
    console.log('用户',user)
    if(app.name!=null)
    {
      user.nickName = app.name
    }
    console.log('用户',user)
    this.setData({
    userInfo:user,
    })

    if (wx.getUserProfile) {
      this.setData({
        isLogin:true
      })
    }
  },
  //授权登录
   getUserProfile(e){
    wx.getUserProfile({
      desc: '完善用户信息',
      success:res=>{
        console.log('ok',res.userInfo)
        let user = res.userInfo
        //缓存用户信息到本地
        wx.setStorageSync('user', user)
        this.setData({
          userInfo:user,
        })
      },
      fail:res=>{
        console.log('fail',res)
      }
    })

  },
  //跳转到我的信息
  getmyinfo:function(){
    wx.navigateTo({
      url: '/pages/my-info/my-info',
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