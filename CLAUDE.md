# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Sudoku solver using Donald Knuth's Dancing Links (DLX) algorithm to solve the exact cover problem. Requires JavaFX for the graphical interface.

## Build and Run

This is a JavaFX application. Compile and run with:

```bash
# Compile (ensure JavaFX is in classpath)
javac --module-path $PATH_TO_JAVAFX/lib --add-modules javafx.controls src/SudokuSolver/*.java

# Run
java --module-path $PATH_TO_JAVAFX/lib --add-modules javafx.controls -cp src SudokuSolver.Main
```

The application expects `ExactCoverMatrix.txt` to be in the working directory.

## Architecture

### Algorithm Flow

1. **ExactCoverMatrix** loads a pre-computed sparse matrix from `ExactCoverMatrix.txt` representing all 324 constraints (81 cell, 81 row-number, 81 column-number, 81 box-number constraints) and 729 possible assignments (9 values × 81 cells)

2. **DancingLinks** implements Algorithm X using the dancing links technique:
   - `search()` - recursive backtracking that covers/uncovers columns
   - `coverColumn()`/`uncoverColumn()` - temporarily remove/restore matrix sections
   - `chooseSmallestColumn()` - S-heuristic to minimize branching factor
   - `setAssignment()` - pre-fills known values by removing conflicting rows

3. **MatrixNode**/**ColumnHeaderNode** - doubly-linked list nodes forming the sparse matrix structure with `detachColumn()`/`reattachColumn()` for O(1) removal/restoration

### MVC Structure

- **Main** - JavaFX Application entry point
- **View** - 9×9 grid of TextFields grouped into 3×3 unit boxes
- **Controller** - wires solve/reset button actions, reads cell values, invokes DLX solver
- **InputFormatter** - restricts input to single digits 1-9
