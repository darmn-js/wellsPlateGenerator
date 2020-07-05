/* eslint-disable radix */
'use strict';

/**
 * Wells plate generator
 * @param {Object} [configuration] - Configuration file
 * @param {Object} [configuration.parameters] - Object with the parameters (objects, strings or numbers) to build samples.
 * @param {Object} [configuration.controls] - Array of samples to add.
 * @param {Object} [options]
 * @param {number-string} [options.rows=H] - The last index of rows.
 * @param {number-string} [options.columns=10] - The last index of columns .
 * @param {number} [options.replicates=1] - The number of replicates by sample.
 * @param {number} [options.plates=2] - The number of plates.
 * @param {Array} [options.color=undefined] - Array of colors with length equal to the number of samples (default: rgba(0,255,0,1))
 * @param {boolean} [options.random=false] - Distribution of wells in the plates.
 * @param {string} [options.direction=vertical] - Orientation of filling the wells in the plates.
 * */

class wellsPlateGenerator {
  constructor(configuration, options = {}) {
    let {
      rows = 'h',
      columns = 10,
      replicates = 1,
      plates = 2,
      initPlate = 0,
      accountPreviousWells = true,
      color = undefined,
      random = false,
      direction = 'vertical',
    } = options;

    let currentList = [];
    let samplesList = [];
    let parameters = configuration.parameters;
    let controls =
      typeof configuration.controls[0] === 'object'
        ? configuration.controls
        : [];
    parameters = Object.entries(parameters);
    // Builds samples list
    for (let i = 0; i < parameters.length; i++) {
      let calculatedVariable = [];
      let obj = {};
      if (!Array.isArray(parameters[i][1])) {
        throw new RangeError(`Variable ${parameters[i][0]} is not an array`);
      }
      let currentVariable =
        samplesList.length !== 0 ? samplesList : currentList[i - 1];
      samplesList = [];
      for (let j = 0; j < parameters[i][1].length; j++) {
        obj[parameters[i][0]] = parameters[i][1][j];
        calculatedVariable.push(Object.assign({}, obj));
        if (i === 0) continue;
        for (let k = 0; k < currentVariable.length; k++) {
          currentVariable[k][parameters[i][0]] = parameters[i][1][j];
        }
        samplesList.push(...JSON.parse(JSON.stringify(currentVariable)));
      }
      currentList.push(calculatedVariable);
    }
    let nbSamples = samplesList ? samplesList.length : 0;
    let nbControls = controls ? controls.length : 0;
    // Add controls to samples list
    for (let i = 0; i < controls.length; i++) {
      let newItem = {};
      let item = Object.entries(controls[i]);
      for (let j = 0; j < item.length; j++) {
        newItem[item[j][0]] = item[j][1];
      }
      newItem.wells = 1;
      samplesList.unshift(newItem);
    }

    // Create list of labels
    let wellsLabels = createWellLabels(
      {
        rows: String(rows),
        columns: String(columns),
        plates: plates,
        initPlate: initPlate,
        accountPreviousWells: accountPreviousWells,
      },
      { direction: direction },
    );
    const labelsList = wellsLabels.labelsList;
    this.labelsList = labelsList;
    const axis = wellsLabels.axis;
    const nbRows = axis.filter((x) => x[0] === 'rows')[0][1].length;
    const nbColumns = axis.filter((x) => x[0] === 'columns')[0][1].length;
    // Add replicates of samples list
    const order =
      random === false
        ? new Array(nbSamples * replicates + nbControls)
            .fill()
            .map((item, index) => index)
        : sortArray(nbSamples * replicates + nbControls);
    if (!color) {
      color = new Array(samplesList.length).fill('rgba(0, 255, 0, 1)');
    }
    let wells = [];
    let counter = 0;
    for (let i = 0; i < samplesList.length; i++) {
      if (Array.isArray(samplesList[i].wells)) continue;
      let nbReplicates =
        samplesList[i].wells !== undefined ? samplesList[i].wells : replicates;
      for (let j = 0; j < nbReplicates; j++) {
        wells.push(labelsList[order[counter]]);
        counter++;
      }
      samplesList[i] = Object.assign({}, samplesList[i], {
        wells: wells,
        color: color[i],
        _highlight: Math.random(),
      });
      wells = [];
    }
    let wellsList = builtPlate(samplesList, labelsList, nbRows, nbColumns);

    this.samplesList = samplesList;
    this.wellsList = wellsList;
  }
  /**
   * Returns array with information about each wells
   * @returns {[Array]}
   */

  getWellsList() {
    return this.wellsList;
  }
  /**
   * Returns array with information about each sample
   * @returns {[Array]}
   */
  getSamples() {
    return this.samplesList;
  }
}
module.exports = wellsPlateGenerator;

function builtPlate(samplesList, labelsList) {
  let result = [];
  let iterations = samplesList.length;
  for (let i = 0; i < iterations; i++) {
    let block = [];
    let obj = {};
    let replicates = samplesList[i].wells.length;
    for (let j = 0; j < replicates; j++) {
      let label =
        samplesList[i] && typeof samplesList[i].wells[j] === 'string'
          ? samplesList[i].wells[j]
          : samplesList[i].wells[j];
      obj = Object.assign(
        {},
        {
          well: samplesList[i] ? `${label}` : labelsList[i],
          plate: samplesList[i].wells[j].split('-')[0],
          replicate: j,
        },
        samplesList[i] ? samplesList[i] : {},
      );
      block.push(obj);
    }
    result.push(...block);
  }
  result = result.map(function (item, index, array) {
    return array[
      array.findIndex(function (x) {
        let element =
          typeof x.well === 'string' ? `${String(labelsList[index])}` : index;
        return element === x.well;
      })
    ];
  });
  return result;
}

function createWellLabels(config, options = {}) {
  let { direction = 'vertical' } = options;
  const plates = config.plates;
  const initPlate = config.initPlate;
  const accountPreviousWells = config.accountPreviousWells;
  delete config.accountPreviousWells;
  delete config.initPlate;
  let entries = Object.entries(config);
  for (let i = 0; i < entries.length; i++) {
    if (Number.isNaN(parseInt(entries[i][1]))) {
      let label = entries[i][1].toUpperCase().charCodeAt(0);
      let axis = new Array(label - 64)
        .fill()
        .map((item, index) => String.fromCharCode(index + 65));
      entries[i][1] = axis;
    } else {
      let axis = new Array(parseInt(entries[i][1]))
        .fill()
        .map((item, index) => index + 1);
      entries[i][1] = axis;
    }
  }
  let labelsList = [];
  let [rows, columns] = [entries[0][1], entries[1][1]];
  if (Number.isInteger(rows[0]) && Number.isInteger(columns[0])) {
    let rod = direction === 'vertical' ? rows : columns;
    for (let u = initPlate; u < initPlate + plates; u++) {
      for (let i = 0; i < rows.length; i++) {
        let row = [];
        for (let j = 0; j < columns.length; j++) {
          let [rowIndex, columnIndex] =
            direction === 'vertical' ? [i, j] : [j, i];
          let factor = accountPreviousWells
            ? u * rows.length * columns.length
            : 0;
          row[j] = `${u + 1}-${
            factor + (columnIndex * rod.length + rod[rowIndex])
          }`;
        }
        labelsList.push(...row);
      }
    }
  } else {
    [rows, columns] =
      direction === 'vertical' ? [rows, columns] : [columns, rows];
    for (let u = initPlate; u < initPlate + plates; u++) {
      for (let i = 0; i < rows.length; i++) {
        let row = [];
        for (let j = 0; j < columns.length; j++) {
          let element =
            typeof rows[i] === 'string'
              ? rows[i] + columns[j]
              : columns[j] + rows[i];
          row[j] = `${u + 1}-${element}`;
        }
        labelsList.push(...row);
      }
    }
  }
  return {
    labelsList: labelsList,
    axis: entries,
  };
}

function sortArray(length) {
  let array = new Array(length).fill().map((item, index) => index);
  let currentIndex;
  let currentElement;
  let top = array.length;
  while (top--) {
    currentIndex = Math.ceil(Math.random() * top);
    currentElement = array[currentIndex];
    array[currentIndex] = array[top];
    array[top] = currentElement;
  }
  return array;
}
