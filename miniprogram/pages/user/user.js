// user.js
const app = getApp()

Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },

  handleMenuTap(e) {
    const type = e.currentTarget.dataset.type
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.userInfo = null
          this.setData({
            userInfo: {}
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})
