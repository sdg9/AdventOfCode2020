import readInput from '../../utils/readInput';
import assert from 'assert';
import * as _ from 'lodash';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

enum Status {
  EMPTY = 'L',
  FLOOR = '.',
  OCCUPIED = '#',
}

function isOccupied(layout: Status[][], row: number, col: number) {
  if (row < 0 || col < 0 || row >= layout[0].length || col >= layout.length) {
    return 0;
  }
  return layout[col][row] === Status.OCCUPIED ? 1 : 0;
}

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const adjacentCount = (layout: Status[][], x: number, y: number) => {
  return directions.reduce((acc, [yMod, xMod]) => acc + isOccupied(layout, x + xMod, y + yMod), 0);
  //   return directions.reduce((acc, [colMod, rowMod]) => acc + isOccupied(layout, row + rowMod, col + colMod), 0);
};

function getNewSeatStatus(layout: Status[][], row: number, col: number) {
  const currentSeat = layout[row][col];
  const neighbors = adjacentCount(layout, row, col);
  if (currentSeat === Status.EMPTY && neighbors === 0) {
    return Status.OCCUPIED;
  } else if (currentSeat === Status.OCCUPIED && neighbors >= 4) {
    return Status.EMPTY;
  } else {
    return currentSeat;
  }
}

function parse(values: string[]) {
  return values.map((row) => row.split('').map((i) => i as Status));
}

// function parseAsFull(values: string[]) {
//   return values.map((row) =>
//     row.split('').map((i) => {
//       const status = i as Status;
//       if (status === Status.EMPTY) {
//         return Status.OCCUPIED;
//       }
//       return i as Status;
//     }),
//   );
// }

function changeSeats(oldLayout: Status[][], didLayoutChange: boolean): Status[][] {
  if (didLayoutChange === false) {
    return oldLayout;
  }

  const newList = oldLayout.map((r) => r.map((c) => c));

  let isChanged = false;
  oldLayout.forEach((rowValue, row) => {
    rowValue.forEach((colValue, col) => {
      const newStatus = getNewSeatStatus(oldLayout, row, col);
      if (newStatus !== colValue) {
        isChanged = true;
        newList[row][col] = newStatus;
      }
    });
  });

  return changeSeats(newList, isChanged);
}

function part1(values: string[]): number {
  const initialLayout = parse(values);

  const layout = changeSeats(initialLayout, true);
  //   //   const layout = changeSeats(initialLayout, true);
  //   let isChanged = true;

  //   const layout = _.cloneDeep(initialLayout);
  //   while (isChanged) {
  //     isChanged = false;
  //     layout.forEach((rowValue, row) => {
  //       rowValue.forEach((colValue, col) => {
  //         const newStatus = getNewSeatStatus(layout, row, col);
  //         if (newStatus !== colValue) {
  //           isChanged = true;
  //           layout[row][col] = newStatus;
  //           //   rowValue[col] = newStatus;
  //         }
  //       });
  //     });
  //   }

  let count = 0;
  layout.forEach((row) => {
    row.forEach((col) => {
      if (col === Status.OCCUPIED) {
        count += 1;
      }
    });
  });
  return count;
}

function part2(values: string[]): number {
  return 0;
}

const testEmpty = [
  [Status.FLOOR, Status.EMPTY, Status.EMPTY, Status.EMPTY],
  [Status.FLOOR, Status.EMPTY, Status.EMPTY, Status.EMPTY],
  [Status.FLOOR, Status.EMPTY, Status.EMPTY, Status.EMPTY],
  [Status.FLOOR, Status.EMPTY, Status.EMPTY, Status.EMPTY],
];
const testFilled = [
  [Status.OCCUPIED, Status.OCCUPIED, Status.OCCUPIED, Status.OCCUPIED],
  [Status.OCCUPIED, Status.OCCUPIED, Status.OCCUPIED, Status.OCCUPIED],
  [Status.OCCUPIED, Status.OCCUPIED, Status.OCCUPIED, Status.OCCUPIED],
  [Status.OCCUPIED, Status.OCCUPIED, Status.OCCUPIED, Status.OCCUPIED],
];

assert.strictEqual(getNewSeatStatus(testEmpty, 0, 0), Status.FLOOR);
assert.strictEqual(getNewSeatStatus(testEmpty, 0, 1), Status.OCCUPIED);
assert.strictEqual(getNewSeatStatus(testEmpty, 0, 2), Status.OCCUPIED);

assert.strictEqual(getNewSeatStatus(testFilled, 0, 0), Status.OCCUPIED);
assert.strictEqual(getNewSeatStatus(testFilled, 1, 2), Status.EMPTY);

const resultPart1 = part1(input); // NOT 2723, 2693, 2954, 3809
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);