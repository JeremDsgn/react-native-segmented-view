import React from 'react-native';

let Dimensions = React.Dimensions;
let { width, height }  = Dimensions.get('window');

let units = {
  vw: width / 100,
  vh: height / 100
};

units.vmin = Math.min(units.vw, units.vh);
units.vmax = Math.max(units.vw, units.vh);

module.exports = units;
