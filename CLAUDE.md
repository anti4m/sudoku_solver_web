# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
bun test              # Run all tests
bun test --watch      # Run tests in watch mode
bun run typecheck     # TypeScript type checking (strict mode)
bun run build         # Build for browser (outputs to dist/)
bun run dev           # Start dev server with hot reload
```

To run a single test file:
```bash
bun test tests/DancingLinks.test.ts
```

## Architecture

This is a browser-based Sudoku solver using Donald Knuth's Dancing Links (DLX) algorithm to solve the exact cover problem.

### Core Algorithm (src/)

**Dancing Links Data Structure:**
- `MatrixNode` - Base node with bidirectional links (up/down/left/right) that can detach and reattach from the matrix in O(1)
- `ColumnHeaderNode` - Extends MatrixNode, tracks column name and size for the MRV heuristic

**Exact Cover Matrix (`ExactCoverMatrix`):**
- Constructs a 729×324 sparse matrix representing Sudoku as an exact cover problem
- 729 rows: each possible (row, col, value) assignment
- 324 columns representing 4 constraint types:
  - Cell constraints (81): each cell has exactly one value
  - Row constraints (81): each row has each digit 1-9 exactly once
  - Column constraints (81): each column has each digit 1-9 exactly once
  - Box constraints (81): each 3×3 box has each digit 1-9 exactly once

**DLX Solver (`DancingLinks`):**
- `search()` - Recursive backtracking with covering/uncovering
- `chooseSmallestColumn()` - MRV (minimum remaining values) heuristic
- `setAssignment()` - Pre-fills known values by removing conflicting rows
- `clearAssignments()` - Restores matrix for reuse

### UI Layer (src/)

- `View` - DOM-based 9×9 grid with input validation
- `Controller` - Coordinates View and DancingLinks solver
- `InputFormatter` - Restricts input to digits 1-9
- `Main` - Entry point, initializes app

### Constraint Naming Convention

Column headers use string names:
- `R{row}C{col}` - Cell constraint (e.g., "R0C0")
- `R{row}#{value}` - Row-number constraint (e.g., "R0#1")
- `C{col}#{value}` - Column-number constraint (e.g., "C0#1")
- `B{box}#{value}` - Box-number constraint (e.g., "B0#1")

Box index: `Math.floor(row / 3) * 3 + Math.floor(col / 3)`
