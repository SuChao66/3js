// 导入常量
import { licenseNum, driverNames } from '../constants'

// 全局变量定义车辆所在的车道
let num = 1
export const useCar = (carGltfArr: any[]) => {
  // 1.随机选择一辆车，并设置车的类型
  const carIndex = Math.floor(Math.random() * 6)
  const car = carGltfArr[carIndex].clone()
  // 2.设置车辆的类型
  car.carType = car.name
  // 3.车辆所在的车道
  num += 1
  if (num == 8) num = 2
  car.order = num
  // 4.车牌号
  car.num = licenseNum[Math.floor(Math.random() * 6)]
  // 5.驾驶员姓名
  car.driverName = driverNames[Math.floor(Math.random() * 6)]
  // 6.车辆状态
  car.state = Math.random() > 0.5 ? '正常' : '异常'

  return car
}
