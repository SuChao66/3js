interface ICunChuInfo {
  title: string
  counter: number
  status: number
}

export interface ICunChu {
  [key: string]: ICunChuInfo
}
