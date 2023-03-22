const linesPositions = [
  [
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
  ],
  [
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
  [
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
  ],
];

const symbolsMultipliers = {
  1: [
    {
      count: 3,
      multiplier: 0.1,
    },
    {
      count: 4,
      multiplier: 0.5,
    },
    {
      count: 5,
      multiplier: 2,
    },
  ],
  2: [
    {
      count: 3,
      multiplier: 0.1,
    },
    {
      count: 4,
      multiplier: 0.5,
    },
    {
      count: 5,
      multiplier: 2,
    },
  ],
  3: [
    {
      count: 3,
      multiplier: 0.2,
    },
    {
      count: 4,
      multiplier: 0.5,
    },
    {
      count: 5,
      multiplier: 2,
    },
  ],
  4: [
    {
      count: 3,
      multiplier: 0.2,
    },
    {
      count: 4,
      multiplier: 0.5,
    },
    {
      count: 5,
      multiplier: 2,
    },
  ],
  5: [
    {
      count: 3,
      multiplier: 0.3,
    },
    {
      count: 4,
      multiplier: 1,
    },
    {
      count: 5,
      multiplier: 2.5,
    },
  ],
  6: [
    {
      count: 3,
      multiplier: 0.5,
    },
    {
      count: 4,
      multiplier: 2.5,
    },
    {
      count: 5,
      multiplier: 5,
    },
  ],
  7: [
    {
      count: 3,
      multiplier: 1,
    },
    {
      count: 4,
      multiplier: 3,
    },
    {
      count: 5,
      multiplier: 5.5,
    },
  ],
  8: [
    {
      count: 3,
      multiplier: 1,
    },
    {
      count: 4,
      multiplier: 3.5,
    },
    {
      count: 5,
      multiplier: 6,
    },
  ],
};

module.exports = {
  reelsCount: 5,
  reelPositions: 3,
  symbolsCount: 8,
  linesPositions,
  symbolsMultipliers,
};