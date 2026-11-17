const DIR_ORDER = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

const DELTA = {
  UP: { dRow: -1, dCol: 0 },
  RIGHT: { dRow: 0, dCol: 1 },
  DOWN: { dRow: 1, dCol: 0 },
  LEFT: { dRow: 0, dCol: -1 },
};

export function runBlockProgram(blocks, levelData) {
  if (!blocks || blocks.length === 0) {
    return { status: 'EMPTY', message: 'Susun minimal 1 blok perintah dulu!', steps: [] };
  }

  let { row, col, dir } = levelData.startPos;
  const grid = levelData.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  // Catat langkah awal (Langkah 0)
  const steps = [{ stepIndex: 0, blockIndex: -1, row, col, dir }];

  for (let i = 0; i < blocks.length; i++) {
    const cmd = blocks[i];

    if (cmd === 'BELOK_KIRI') {
      const idx = DIR_ORDER.indexOf(dir);
      dir = DIR_ORDER[(idx + 3) % 4];
      steps.push({ stepIndex: i + 1, blockIndex: i, row, col, dir });
    } else if (cmd === 'BELOK_KANAN') {
      const idx = DIR_ORDER.indexOf(dir);
      dir = DIR_ORDER[(idx + 1) % 4];
      steps.push({ stepIndex: i + 1, blockIndex: i, row, col, dir });
    } else if (cmd === 'MAJU') {
      const nextRow = row + DELTA[dir].dRow;
      const nextCol = col + DELTA[dir].dCol;

      // Cek batas papan & apakah ada tali
      if (
        nextRow < 0 ||
        nextRow >= rows ||
        nextCol < 0 ||
        nextCol >= cols ||
        grid[nextRow][nextCol] === 0
      ) {
        return {
          status: 'NO_ROPE',
          failedBlockIndex: i,
          message: `Blok ${i + 1} gagal. Tidak ada tali di depan.`,
          steps,
        };
      }

      row = nextRow;
      col = nextCol;
      steps.push({ stepIndex: i + 1, blockIndex: i, row, col, dir });

      // Cek kena sarang lebah
      if (grid[row][col] === 2) {
        return {
          status: 'BEEHIVE',
          failedBlockIndex: i,
          message: 'Monyet kena sarang lebah! Cari tali yang lain.',
          steps,
        };
      }

      // Cek sampai ke pisang
      if (grid[row][col] === 3) {
        const stars =
          blocks.length <= levelData.targetBlocks
            ? 3
            : blocks.length <= levelData.targetBlocks + 2
            ? 2
            : 1;

        return {
          status: 'SUCCESS',
          stars,
          blocksUsed: blocks.length,
          steps,
        };
      }
    }
  }

  // Semua blok selesai dijalankan tapi belum sampai pisang
  return {
    status: 'INCOMPLETE',
    failedBlockIndex: blocks.length - 1,
    message: 'Program selesai, tapi monyet belum sampai ke pisang.',
    steps,
  };
}