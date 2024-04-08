import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  // 动画方式
  easing: 'ease',
  // 递增进度条的速度
  speed: 500,
  // 是否显示加载icon
  showSpinner: true,
  // 自动递增间隔
  trickleSpeed: 100,
  // 初始化时最小百分比
  minimum: 0.3,
  // 加载条的父元素
  parent: '#app'
})

export { NProgress }
