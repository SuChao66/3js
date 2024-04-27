interface ICunChuInfo {
  title: string
  counter: number
  status: number
}

export interface ICunChu {
  [key: string]: ICunChuInfo
}

export interface IKeyStates {
  [key: string]: boolean
}
