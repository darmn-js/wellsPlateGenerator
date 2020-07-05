# wellsPlateGenerator

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

Samples generator

## Installation

`$ npm i wellsPlateGenerator`

## [API Documentation](https://cheminfo.github.io/wellsPlateGenerator/)

**Arguments**

 * `configuration`:(Object) Configuration file
 * `configuration.parameters`:(Object) Object with the parameters (Objects or strings) to build samples.
 * `configuration.controls`:(Object) Array of samples to add.

**Options**

 * `rows`: (number-string) The last index of rows.
 * `columns`: (number-string) The last index of columns .
 * `replicates`: (number) The number of replicates by sample.
 * `plates`: (number) The number of plates.
 * `color`: (Array) Array of colors with length equal to the number of samples (default: rgba(0,255,0,1))
 * `random`: (boolean) Distribution of wells in the plates.
 * `direction`: (string) Orientation of filling the wells in the plates.

## Example

```js
const wellsPlateGenerator = require('wellsPlateGenerator');

let configuration = {
  parameters: {
    extracts: [
      { value: 'extract1', id: 1 },
      { value: 'extract2', id: 2 },
    ],
    concentration: [1, 0.1],
    strain: [{ value: 'strain1', id: 1 }],
  },
  controls: [
    {
      strain: { value: 'strain1', id: 1 },
      concentration: 0.333,
      id: 11,
    },
    { extract: { value: 'extract2', id: 2 }, concentration: 0.333, id: 22 },
  ],
};

let options = {
  rows: 'h',
  columns: 10,
  replicates: 3,
  plates: 2,
  color: undefined,
  random: true,
  direction: 'horizontal',
};

let data = new wellsPlateGenerator(configuration, options);
console.log(data.getSamples());
/*
[
  {
    extract: { value: 'extract2', id: 2 },
    concentration: 0.333,
    id: 22,
    wells: [ '1-A1' ],
    color: 'rgba(0, 255, 0, 1)',
    _highlight: 0.1804826825566015
  },
  {
    strain: { value: 'strain1', id: 1 },
    concentration: 0.333,
    id: 11,
    wells: [ '1-G1' ],
    color: 'rgba(0, 255, 0, 1)',
    _highlight: 0.5501422476861029
  },
  {
    extracts: { value: 'extract1', id: 1 },
    concentration: 1,
    strain: { value: 'strain1', id: 1 },
    wells: [ '1-C2', '1-B2', '1-B1' ],
    color: 'rgba(0, 255, 0, 1)',
    _highlight: 0.2832859653994939
  },
  {
    extracts: { value: 'extract2', id: 2 },
    concentration: 1,
    strain: { value: 'strain1', id: 1 },
    wells: [ '1-E1', '1-E2', '1-H1' ],
    color: 'rgba(0, 255, 0, 1)',
    _highlight: 0.4608643882241228
  },
  {
    extracts: { value: 'extract1', id: 1 },
    concentration: 0.1,
    strain: { value: 'strain1', id: 1 },
    wells: [ '1-C1', '1-D2', '1-D1' ],
    color: 'rgba(0, 255, 0, 1)',
    _highlight: 0.6452598088980688
  },
  {
    extracts: { value: 'extract2', id: 2 },
    concentration: 0.1,
    strain: { value: 'strain1', id: 1 },
    wells: [ '1-F2', '1-F1', '1-A2' ],
    color: 'rgba(0, 255, 0, 1)',
    _highlight: 0.3076294204587324
  }
]
*/
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/wellsPlateGenerator.svg
[npm-url]: https://www.npmjs.com/package/wellsPlateGenerator
[ci-image]: https://github.com/cheminfo/wellsPlateGenerator/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/wellsPlateGenerator/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/wellsPlateGenerator.svg
[download-url]: https://www.npmjs.com/package/wellsPlateGenerator
