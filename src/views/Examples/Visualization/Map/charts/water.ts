import * as echarts from 'echarts'
import 'echarts-liquidfill'

export default function (id: string) {
  const myChart = echarts.init(document.getElementById(id))

  // 指定图表的配置项和数据
  const option = {
    series: [
      {
        type: 'liquidFill',
        radius: '80%',
        backgroundStyle: {
          color: 'rgb(0,255,255,0.05)' // 球体背景色
        },
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#00eeee'
              },
              {
                offset: 1,
                color: '#88eeee'
              }
            ],
            globalCoord: false
          }
        ],

        data: [{ value: '40%' }, 0.4, 0.3],
        label: {
          formatter: '{c}',
          fontSize: '36px',
          color: '#ffffff'
        },
        //水球外面圆环
        outline: {
          itemStyle: {
            borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0.0,
                color: '#66eedd'
              },
              {
                offset: 1,
                color: '#0099aa'
              }
            ]),
            borderWidth: 4
          }
        }
      }
    ]
  }
  myChart.setOption(option)
}
