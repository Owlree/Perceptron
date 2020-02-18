import Variable from './variable';


export default interface PointGraphicOptions {
  color?: paper.Color | Variable<paper.Color>,
  radius?: number
}
