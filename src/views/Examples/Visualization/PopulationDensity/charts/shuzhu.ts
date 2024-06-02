import * as echarts from 'echarts'

export default function (id: string) {
  const myChart = echarts.init(document.getElementById(id))

  // 指定图表的配置项和数据
  const option = {
    // x轴数据和样式设置
    xAxis: {
      data: ['印度', '中国', '美国', '日本', '越南', '印尼'],
      axisTick: {
        show: false //不显示坐标轴刻度线
      },
      axisLine: {
        lineStyle: {
          //坐标轴样式
          color: '#ffffff',
          width: 0.2 //调整坐标轴粗细
        }
      },
      axisLabel: {
        color: '#ffffff', //x轴文字颜色
        fontWeight: 100 //x轴文字粗细
      }
    },
    // y轴样式设置
    yAxis: {
      axisTick: {
        show: false //不显示坐标轴刻度线
      },
      splitLine: {
        show: false //坐标轴水平分割线不显示
      },
      show: false //y轴数字不显示
    },

    // 柱子数据和样式设置
    series: [
      {
        type: 'bar',
        data: [400, 500, 300, 300, 200, 500], //柱子对应数据
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0.4,
              color: '#33ffff'
            },
            {
              offset: 1,
              color: '#0099aa'
            }
          ])
        },
        barWidth: 12, //柱子粗细
        label: {
          //柱子标注内容设置
          show: true, //显示柱子数值
          position: 'top', //柱子对应数字显示在柱子上方
          distance: 5, //标注相对柱子顶部偏移的距离
          color: '#00cccc', //柱子标注内容的颜色
          fontSize: 12, //柱子标注的字体大小
          fontWeight: 100 //柱子标注的字体粗细
        }
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
