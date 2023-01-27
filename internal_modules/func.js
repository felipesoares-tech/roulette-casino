var rouletteNumbers = [
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
]

module.exports = {
  findNumber(number) {
    for (let i = 0; i < rouletteNumbers.length; i++) {
      for (let j = 0; j < rouletteNumbers[i].length; j++) {
        if (rouletteNumbers[i][j] === number) 
          return i+1
      }
    }
    return null
  }
}