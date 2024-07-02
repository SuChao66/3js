import * as echarts from 'echarts'

export default function (id: string) {
  const myChart = echarts.init(document.getElementById(id), 'dark')
  const xdata = []
  const ydata = []
  const ydata2 = []
  const ydata3 = []
  for (let i = 0; i < 24; i++) {
    xdata.push(i + '')
    ydata.push(30 * (Math.random().toFixed(1) as unknown as number) + 10)
    ydata2.push(30 * (Math.random().toFixed(1) as unknown as number) + 40)
    ydata3.push(30 * (Math.random().toFixed(1) as unknown as number) + 70)
  }
  const option = {
    backgroundColor: 'rgba(255,255,255,0.0)',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: 'rgba(220,220,220,1.0)',
      fontSize: '16',
      borderWidth: '0'
    },
    legend: {
      top: '0%',
      data: ['美国', '欧洲', '中国'],
      color: 'rgba(220,220,220,1.0)',
      fontSize: '16'
    },

    grid: {
      left: '10',
      top: '30',
      right: '10',
      bottom: '10',
      containLabel: true
    },
    // x轴样式
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        // x轴更换数据
        data: xdata,
        axisLabel: {
          color: 'rgba(220,220,220,1.0)',
          fontSize: 12
        },
        axisTick: {
          show: false
        },
        axisLine: {
          color: 'rgba(0,150,150,0.5)'
        }
      }
    ],
    // y轴样式
    yAxis: [
      {
        type: 'value',
        axisTick: { show: false },
        axisLine: {
          color: 'rgba(0,150,150,0.5)'
        },
        axisLabel: {
          color: 'rgba(220,220,220,1.0)',
          fontSize: 12
        },
        splitLine: {
          show: false //坐标轴水平分割线不显示
        }
      }
    ],
    series: [
      {
        name: '美国',
        type: 'line',
        smooth: true, //折线光滑
        lineStyle: {
          color: 'rgba( 240, 80,0, 1.0)', //折线颜色
          width: 2
        },
        // 用于大屏可视化，设置一个渐变效果
        areaStyle: {
          // 折线颜色渐变效果
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba( 240, 80,0, 0.7)'
              },
              {
                offset: 0.7,
                color: 'rgba(240, 80, 0, 0.0)'
              }
            ],
            false
          )
        },
        // 设置拐点 小圆点
        symbol: 'circle',
        // 拐点大小
        symbolSize: 5,
        // 设置拐点颜色以及边框
        itemStyle: {
          color: 'rgba( 240, 80,0, 1.0)',
          borderColor: 'rgba( 240, 80,0, 1.0)',
          borderWidth: 12
        },
        // 数据点是否显示， 鼠标经过显示
        showSymbol: false,
        data: ydata
      },
      {
        name: '欧洲',
        type: 'line',
        smooth: true, //折线光滑
        lineStyle: {
          color: 'rgba( 200, 200,0, 1.0)', //折线颜色
          width: 2
        },
        // 用于大屏可视化，设置一个渐变效果
        areaStyle: {
          // 折线颜色渐变效果
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba( 200, 200,0, 0.7)'
              },
              {
                offset: 0.7,
                color: 'rgba(200, 200, 0, 0.0)'
              }
            ],
            false
          )
        },
        // 设置拐点 小圆点
        symbol: 'circle',
        // 拐点大小
        symbolSize: 5,
        // 设置拐点颜色以及边框
        itemStyle: {
          color: '#00d887',
          borderColor: 'rgba(221, 220, 0, 0.1)',
          borderWidth: 12
        },
        // 数据点是否显示， 鼠标经过显示
        showSymbol: false,
        data: ydata2
      },
      {
        name: '中国',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'rgba(0, 240, 180, 1.0)',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(0, 240, 180, 0.7)'
              },
              {
                offset: 0.7, //1.0相互叠加影响比较大，都是整体自身高度的0.5~0.9可能效果会好一些
                color: 'rgba(0, 240, 180, 0.0)'
              }
            ],
            false
          ),
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        },
        // 设置拐点 小圆点
        symbol: 'circle',
        // 拐点大小
        symbolSize: 5,
        // 设置拐点颜色以及边框
        itemStyle: {
          color: '#00cccc',
          borderColor: '#00cccc',
          borderWidth: 12
        },
        // 开始不显示拐点， 鼠标经过显示
        showSymbol: false,
        data: ydata3
      }
    ]
  }
  myChart.setOption(option)
  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}
