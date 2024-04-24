export interface IWindowTag {
  order: string
  shoufeizhan: string
  CarNum: number
  shouName: string
  shouNameId: string
}

export interface IWindowTagInfo {
  [key: string]: IWindowTag
}

export interface IProps {
  name: string
}
