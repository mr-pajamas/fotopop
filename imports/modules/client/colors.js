import random from 'lodash/random';

const colors = {
  red: 'rgba(255, 99, 132, 0.5)',
  blue: 'rgba(54, 162, 235, 0.5)',
  purple: 'rgba(153, 102, 255, 0.5)',
  yellow: 'rgba(255, 205, 86, 0.5)',
  green: 'rgba(75, 192, 192, 0.5)',
  orange: 'rgba(255, 159, 64, 0.5)',
  grey: 'rgba(201, 203, 207, 0.5)',
};

const cs = Object.values(colors);

export default colors;

export function randomColor() {
  return cs[random(cs.length - 1)];
}
