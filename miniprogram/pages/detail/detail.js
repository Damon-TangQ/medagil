// detail.js
Page({
  data: {
    detailInfo: {
      title: 'Medagil AI平台功能介绍',
      time: '2023-09-15',
      content: '<p>Medagil AI平台是一款集成了多种AI功能的智能服务平台。</p><p>主要功能包括：</p><ul><li>智能问答</li><li>数据分析</li><li>报告生成</li><li>任务管理</li></ul>'
    }
  },

  onLoad(options) {
    // 根据传入的id获取详情数据
    const id = options.id
    this.loadDetailData(id)
  },

  loadDetailData(id) {
    // 这里应该从服务器获取数据，暂时使用模拟数据
    // 实际开发中应该调用API
  },

  handleShare() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  handleCollect() {
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.detailInfo.title,
      path: '/pages/detail/detail?id=' + this.data.detailInfo.id
    }
  }
})
