'use strict';

const wellsPlateGenerator = require('./index');

let configuration = {
  parameters: {
    extracts: [
      { value: 'extract1', id: 1 },
      { value: 'extract2', id: 2 },
      { value: 'extract3', id: 3 },
      { value: 'extract4', id: 4 },
      { value: 'extract5', id: 5 },
    ],
    concentration: [0.666, 0.333, 0.165],
    strain: [
      { value: 'strain1', id: 1 },
      { value: 'strain2', id: 2 },
    ],
  },
  controls: [
    {
      strain: { value: 'strain1', id: 1 },
      concentration: 0.333,
      id: 11,
    },
    {
      strain: { value: 'strain2', id: 1 },
      concentration: 0.333,
      id: 22,
    },
    { extract: { value: 'extract1', id: 1 }, concentration: 0.333, id: 12 },
    { extract: { value: 'extract2', id: 2 }, concentration: 0.333, id: 22 },
  ],
};

let data = new wellsPlateGenerator(configuration);

// eslint-disable-next-line no-console
console.log(data.getSamples());
// eslint-disable-next-line no-console
console.log(data.getWellsList());
