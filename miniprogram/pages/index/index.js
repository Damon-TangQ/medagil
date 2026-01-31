// index.js
const app = getApp()

Page({
  data: {
    features: [
      {
        id: 1,
        icon: '/images/icon_ai.png',
        title: 'AI助手',
        desc: '智能问答，快速解决问题'
      },
      {
        id: 2,
        icon: '/images/icon_data.png',
        title: '数据分析',
        desc: '数据可视化，洞察业务'
      },
      {
        id: 3,
        icon: '/images/icon_report.png',
        title: '报告生成',
        desc: '自动生成专业报告'
      },
      {
        id: 4,
        icon: '/images/icon_task.png',
        title: '任务管理',
        desc: '高效管理日常工作'
      }
    ]
  },

  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  startUse() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
})
