export interface ICard {
  title: string
  key: number
  img: string
  desc?: string
  path: string
}

export interface IProps {
  card: ICard
  column?: number
  margin?: any[]
}
