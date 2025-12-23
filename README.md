# Sudoku Solver

A browser-based Sudoku solver using Donald Knuth's Dancing Links (DLX) algorithm to solve any valid puzzle in a fraction of a second.

This is a browser port of the [sudoku_solver](https://github.com/anti4m/sudoku_solver) Java project.

## How It Works

The solver models Sudoku as an [exact cover problem](https://en.wikipedia.org/wiki/Exact_cover) and solves it using the Dancing Links algorithm. This approach reduces Sudoku to selecting rows from a sparse matrix such that each column is covered exactly once.

**The 729×324 constraint matrix encodes:**
- 729 rows: every possible placement (row, column, digit)
- 324 columns: the four Sudoku constraints
  - Each cell contains exactly one digit
  - Each row contains digits 1-9 exactly once
  - Each column contains digits 1-9 exactly once
  - Each 3×3 box contains digits 1-9 exactly once

The DLX algorithm efficiently searches this matrix using backtracking with the minimum remaining values (MRV) heuristic, covering and uncovering columns in O(1) time.

## Prerequisites

- [Bun](https://bun.sh/) runtime

## Installation

```bash
git clone <repository-url>
cd sudoku_solver
bun install
```

## Usage

**Start the development server:**
```bash
bun run dev
```
**Build for production:**
```bash
bun run build
```
Output is written to `dist/`.

**Run tests:**
```bash
bun test
```
## Project Structure

```
src/
├── MatrixNode.ts        # Doubly-linked node with O(1) detach/reattach
├── ColumnHeaderNode.ts  # Column header tracking size for MRV heuristic
├── ExactCoverMatrix.ts  # Builds the 729×324 Sudoku constraint matrix
├── DancingLinks.ts      # DLX solver with cover/uncover operations
├── View.ts              # DOM-based 9×9 grid UI
├── Controller.ts        # Coordinates solver and view
├── InputFormatter.ts    # Restricts input to digits 1-9
└── Main.ts              # Entry point
```

## License

GPL-3.0
