import Variable from './variable';

export default interface VariablesDictionary {
  [key: string]: number | Variable<number>
}
