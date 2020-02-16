import * as paper from 'paper';

export interface Theme {
  Red: paper.Color,
  Blue: paper.Color,
  Background: paper.Color,
  Main: paper.Color
}

export const DarkTheme = {
  Red: new paper.Color('salmon'),
  Blue: new paper.Color('dodgerblue'),
  Background: new paper.Color('#121212'),
  Main: new paper.Color('white')
};

export const LightTheme = {
  Red: new paper.Color('salmon'),
  Blue: new paper.Color('dodgerblue'),
  Background: new paper.Color('white'),
  Main: new paper.Color('black')
};
