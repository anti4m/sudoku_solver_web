import { describe, expect, test } from 'bun:test';
import { DancingLinks } from '../src/DancingLinks';
import { ExactCoverMatrix } from '../src/ExactCoverMatrix';

// Helper to solve a puzzle
function solvePuzzle(puzzle: number[][]): number[][] | null {
    const matrix = new ExactCoverMatrix();
    const dlx = new DancingLinks(matrix);

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (puzzle[r][c] !== 0) {
                dlx.setAssignment(r, c, puzzle[r][c]);
            }
        }
    }

    return dlx.solve();
}

// Helper to verify a sudoku solution
function isValidSudoku(board: number[][]): boolean {
    // Check rows
    for (let r = 0; r < 9; r++) {
        const seen = new Set<number>();
        for (let c = 0; c < 9; c++) {
            if (board[r][c] < 1 || board[r][c] > 9) return false;
            if (seen.has(board[r][c])) return false;
            seen.add(board[r][c]);
        }
    }

    // Check columns
    for (let c = 0; c < 9; c++) {
        const seen = new Set<number>();
        for (let r = 0; r < 9; r++) {
            if (seen.has(board[r][c])) return false;
            seen.add(board[r][c]);
        }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            const seen = new Set<number>();
            for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
                for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
                    if (seen.has(board[r][c])) return false;
                    seen.add(board[r][c]);
                }
            }
        }
    }

    return true;
}

describe('DancingLinks', () => {
    test('solves empty puzzle (any valid sudoku)', () => {
        const emptyPuzzle = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];

        const solution = solvePuzzle(emptyPuzzle);

        expect(solution).not.toBeNull();
        expect(solution!.length).toBe(9);
        expect(solution![0].length).toBe(9);
        expect(isValidSudoku(solution!)).toBe(true);
    });

    test('solves easy puzzle with verification', () => {
        const puzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9],
        ];

        const solution = solvePuzzle(puzzle);

        expect(solution).not.toBeNull();
        expect(isValidSudoku(solution!)).toBe(true);

        // Verify given cells are preserved
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (puzzle[r][c] !== 0) {
                    expect(solution![r][c]).toBe(puzzle[r][c]);
                }
            }
        }
    });

    test('solves hard puzzle (World\'s Hardest Sudoku)', () => {
        // Arto Inkala's "World's Hardest Sudoku"
        const puzzle = [
            [8, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 6, 0, 0, 0, 0, 0],
            [0, 7, 0, 0, 9, 0, 2, 0, 0],
            [0, 5, 0, 0, 0, 7, 0, 0, 0],
            [0, 0, 0, 0, 4, 5, 7, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 3, 0],
            [0, 0, 1, 0, 0, 0, 0, 6, 8],
            [0, 0, 8, 5, 0, 0, 0, 1, 0],
            [0, 9, 0, 0, 0, 0, 4, 0, 0],
        ];

        const solution = solvePuzzle(puzzle);

        expect(solution).not.toBeNull();
        expect(isValidSudoku(solution!)).toBe(true);

        // Verify given cells are preserved
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (puzzle[r][c] !== 0) {
                    expect(solution![r][c]).toBe(puzzle[r][c]);
                }
            }
        }
    });

    test('returns null for impossible puzzle (duplicate in same row)', () => {
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

        // Invalid: two 5s in first row
        dlx.setAssignment(0, 0, 5);
        dlx.setAssignment(0, 1, 5);

        const solution = dlx.solve();

        expect(solution).toBeNull();
    });

    test('returns null for impossible puzzle (duplicate in same column)', () => {
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

        // Invalid: two 3s in first column
        dlx.setAssignment(0, 0, 3);
        dlx.setAssignment(1, 0, 3);

        const solution = dlx.solve();

        expect(solution).toBeNull();
    });

    test('returns null for impossible puzzle (duplicate in same box)', () => {
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

        // Invalid: two 7s in top-left box
        dlx.setAssignment(0, 0, 7);
        dlx.setAssignment(2, 2, 7);

        const solution = dlx.solve();

        expect(solution).toBeNull();
    });

    test('clearAssignments restores matrix for reuse', () => {
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

        // First solve with some assignments
        dlx.setAssignment(0, 0, 1);
        dlx.setAssignment(0, 1, 2);
        const solution1 = dlx.solve();
        expect(solution1).not.toBeNull();

        // Solve again with different assignments (clearAssignments is called in solve())
        dlx.setAssignment(0, 0, 5);
        dlx.setAssignment(0, 1, 3);
        const solution2 = dlx.solve();
        expect(solution2).not.toBeNull();

        // Verify both solutions are valid and different
        expect(isValidSudoku(solution1!)).toBe(true);
        expect(isValidSudoku(solution2!)).toBe(true);
        expect(solution1![0][0]).toBe(1);
        expect(solution2![0][0]).toBe(5);
    });

    test('solves puzzle with many givens', () => {
        // Puzzle with many given cells (only a few empty)
        const puzzle = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 0, 8, 6, 1, 7, 0], // Only 2 empty cells
        ];

        const solution = solvePuzzle(puzzle);

        expect(solution).not.toBeNull();
        expect(isValidSudoku(solution!)).toBe(true);
        expect(solution![8][3]).toBe(2); // The only valid value
        expect(solution![8][8]).toBe(9); // The only valid value
    });

    test('solves another known puzzle', () => {
        // Standard medium difficulty puzzle
        const puzzle = [
            [0, 0, 0, 2, 6, 0, 7, 0, 1],
            [6, 8, 0, 0, 7, 0, 0, 9, 0],
            [1, 9, 0, 0, 0, 4, 5, 0, 0],
            [8, 2, 0, 1, 0, 0, 0, 4, 0],
            [0, 0, 4, 6, 0, 2, 9, 0, 0],
            [0, 5, 0, 0, 0, 3, 0, 2, 8],
            [0, 0, 9, 3, 0, 0, 0, 7, 4],
            [0, 4, 0, 0, 5, 0, 0, 3, 6],
            [7, 0, 3, 0, 1, 8, 0, 0, 0],
        ];

        const solution = solvePuzzle(puzzle);

        expect(solution).not.toBeNull();
        expect(isValidSudoku(solution!)).toBe(true);
    });

    test('Hard Puzzle 1', () => {
        const puzzle = [
            [0, 0, 0, 0, 0, 0, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 9, 4, 0],
            [0, 0, 3, 0, 0, 0, 0, 0, 5],
            [0, 9, 2, 3, 0, 5, 0, 7, 4],
            [8, 4, 0, 0, 0, 0, 0, 0, 0],
            [0, 6, 7, 0, 9, 8, 0, 0, 0],
            [0, 0, 0, 7, 0, 6, 0, 0, 0],
            [0, 0, 0, 9, 0, 0, 0, 2, 0],
            [4, 0, 8, 5, 0, 0, 3, 6, 0],
        ];

        const expected = [
            [6, 8, 4, 1, 5, 9, 7, 3, 2],
            [7, 5, 1, 8, 3, 2, 9, 4, 6],
            [9, 2, 3, 6, 7, 4, 1, 8, 5],
            [1, 9, 2, 3, 6, 5, 8, 7, 4],
            [8, 4, 5, 2, 1, 7, 6, 9, 3],
            [3, 6, 7, 4, 9, 8, 2, 5, 1],
            [2, 3, 9, 7, 4, 6, 5, 1, 8],
            [5, 1, 6, 9, 8, 3, 4, 2, 7],
            [4, 7, 8, 5, 2, 1, 3, 6, 9],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 2', () => {
        const puzzle = [
            [4, 0, 6, 0, 0, 0, 0, 5, 9],
            [0, 0, 0, 0, 4, 0, 2, 0, 0],
            [0, 7, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 5, 9, 1, 0, 0, 6, 0],
            [0, 1, 3, 0, 0, 0, 8, 9, 4],
            [0, 0, 0, 2, 0, 0, 0, 0, 1],
            [5, 0, 8, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 3, 0, 0, 0, 8],
            [0, 4, 0, 0, 6, 0, 1, 0, 0],
        ];

        const expected = [
            [4, 3, 6, 1, 2, 8, 7, 5, 9],
            [9, 5, 1, 7, 4, 6, 2, 8, 3],
            [8, 7, 2, 3, 5, 9, 4, 1, 6],
            [7, 8, 5, 9, 1, 4, 3, 6, 2],
            [2, 1, 3, 6, 7, 5, 8, 9, 4],
            [6, 9, 4, 2, 8, 3, 5, 7, 1],
            [5, 2, 8, 4, 9, 1, 6, 3, 7],
            [1, 6, 7, 5, 3, 2, 9, 4, 8],
            [3, 4, 9, 8, 6, 7, 1, 2, 5],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 3', () => {
        const puzzle = [
            [0, 0, 0, 0, 0, 8, 0, 9, 0],
            [0, 0, 3, 0, 0, 1, 0, 0, 0],
            [2, 0, 0, 0, 0, 7, 6, 0, 0],
            [0, 0, 0, 0, 2, 0, 0, 0, 0],
            [0, 9, 4, 0, 8, 0, 2, 0, 0],
            [7, 1, 0, 0, 4, 0, 9, 0, 5],
            [1, 0, 9, 0, 0, 0, 5, 3, 0],
            [5, 7, 0, 0, 0, 0, 8, 4, 0],
            [0, 0, 0, 0, 0, 6, 0, 2, 1],
        ];

        const expected = [
            [6, 4, 7, 5, 3, 8, 1, 9, 2],
            [9, 5, 3, 2, 6, 1, 4, 7, 8],
            [2, 8, 1, 4, 9, 7, 6, 5, 3],
            [8, 6, 5, 7, 2, 9, 3, 1, 4],
            [3, 9, 4, 1, 8, 5, 2, 6, 7],
            [7, 1, 2, 6, 4, 3, 9, 8, 5],
            [1, 2, 9, 8, 7, 4, 5, 3, 6],
            [5, 7, 6, 3, 1, 2, 8, 4, 9],
            [4, 3, 8, 9, 5, 6, 7, 2, 1],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 4', () => {
        const puzzle = [
            [0, 7, 0, 0, 1, 0, 0, 2, 0],
            [5, 0, 0, 0, 2, 7, 0, 0, 1],
            [0, 0, 2, 5, 0, 8, 0, 0, 4],
            [0, 0, 0, 9, 0, 0, 0, 0, 0],
            [8, 6, 0, 1, 0, 0, 9, 5, 3],
            [0, 0, 0, 3, 0, 0, 1, 0, 0],
            [3, 0, 0, 0, 0, 0, 0, 0, 9],
            [0, 2, 0, 7, 5, 0, 0, 0, 0],
            [0, 0, 0, 2, 3, 0, 4, 8, 0],
        ];

        const expected = [
            [9, 7, 4, 6, 1, 3, 5, 2, 8],
            [5, 8, 3, 4, 2, 7, 6, 9, 1],
            [6, 1, 2, 5, 9, 8, 7, 3, 4],
            [1, 3, 5, 9, 7, 6, 8, 4, 2],
            [8, 6, 7, 1, 4, 2, 9, 5, 3],
            [2, 4, 9, 3, 8, 5, 1, 6, 7],
            [3, 5, 1, 8, 6, 4, 2, 7, 9],
            [4, 2, 8, 7, 5, 9, 3, 1, 6],
            [7, 9, 6, 2, 3, 1, 4, 8, 5],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 5', () => {
        const puzzle = [
            [2, 7, 0, 0, 0, 0, 0, 9, 3],
            [0, 0, 6, 0, 3, 9, 0, 0, 0],
            [3, 0, 0, 0, 0, 0, 1, 5, 0],
            [0, 3, 0, 2, 0, 4, 0, 0, 7],
            [9, 2, 5, 0, 0, 0, 4, 0, 8],
            [4, 0, 0, 6, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 7, 5],
            [5, 0, 0, 0, 0, 8, 0, 0, 1],
            [0, 0, 4, 0, 0, 3, 9, 0, 0],
        ];

        const expected = [
            [2, 7, 1, 4, 5, 6, 8, 9, 3],
            [8, 5, 6, 1, 3, 9, 7, 2, 4],
            [3, 4, 9, 8, 2, 7, 1, 5, 6],
            [6, 3, 8, 2, 9, 4, 5, 1, 7],
            [9, 2, 5, 3, 7, 1, 4, 6, 8],
            [4, 1, 7, 6, 8, 5, 2, 3, 9],
            [1, 8, 3, 9, 4, 2, 6, 7, 5],
            [5, 9, 2, 7, 6, 8, 3, 4, 1],
            [7, 6, 4, 5, 1, 3, 9, 8, 2],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 6', () => {
        const puzzle = [
            [8, 4, 0, 0, 0, 0, 7, 0, 1],
            [0, 0, 0, 0, 8, 0, 0, 5, 0],
            [0, 0, 6, 0, 0, 0, 0, 0, 4],
            [0, 7, 0, 1, 3, 0, 4, 0, 0],
            [0, 2, 3, 0, 0, 0, 1, 9, 8],
            [0, 0, 0, 5, 0, 0, 0, 0, 3],
            [7, 9, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 0, 0, 0, 9],
            [0, 0, 8, 0, 4, 0, 0, 3, 0],
        ];

        const expected = [
            [8, 4, 2, 3, 5, 9, 7, 6, 1],
            [1, 3, 7, 6, 8, 4, 9, 5, 2],
            [9, 5, 6, 2, 7, 1, 3, 8, 4],
            [6, 7, 9, 1, 3, 8, 4, 2, 5],
            [5, 2, 3, 4, 6, 7, 1, 9, 8],
            [4, 8, 1, 5, 9, 2, 6, 7, 3],
            [7, 9, 5, 8, 1, 3, 2, 4, 6],
            [3, 6, 4, 7, 2, 5, 8, 1, 9],
            [2, 1, 8, 9, 4, 6, 5, 3, 7],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 7', () => {
        const puzzle = [
            [0, 0, 5, 0, 0, 3, 0, 0, 0],
            [1, 0, 4, 0, 0, 0, 0, 0, 0],
            [8, 3, 0, 0, 1, 0, 0, 0, 7],
            [0, 5, 7, 0, 3, 0, 9, 4, 6],
            [9, 1, 0, 4, 0, 0, 0, 3, 8],
            [0, 4, 0, 0, 7, 9, 0, 2, 0],
            [6, 0, 0, 0, 0, 7, 5, 0, 0],
            [4, 9, 0, 8, 0, 0, 6, 0, 0],
            [0, 0, 0, 0, 6, 0, 0, 1, 0],
        ];

        const expected = [
            [7, 6, 5, 2, 9, 3, 4, 8, 1],
            [1, 2, 4, 7, 8, 6, 3, 5, 9],
            [8, 3, 9, 5, 1, 4, 2, 6, 7],
            [2, 5, 7, 1, 3, 8, 9, 4, 6],
            [9, 1, 6, 4, 2, 5, 7, 3, 8],
            [3, 4, 8, 6, 7, 9, 1, 2, 5],
            [6, 8, 1, 3, 4, 7, 5, 9, 2],
            [4, 9, 2, 8, 5, 1, 6, 7, 3],
            [5, 7, 3, 9, 6, 2, 8, 1, 4],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 8', () => {
        const puzzle = [
            [0, 0, 0, 5, 3, 4, 0, 8, 0],
            [0, 8, 0, 0, 1, 0, 4, 0, 0],
            [0, 2, 0, 8, 0, 0, 0, 7, 1],
            [8, 0, 0, 0, 6, 0, 0, 5, 0],
            [4, 0, 0, 0, 0, 5, 8, 3, 0],
            [6, 3, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 3, 9, 0],
            [0, 0, 0, 0, 7, 0, 0, 0, 0],
            [0, 1, 6, 2, 0, 0, 0, 0, 0],
        ];

        const expected = [
            [1, 6, 7, 5, 3, 4, 2, 8, 9],
            [5, 8, 9, 7, 1, 2, 4, 6, 3],
            [3, 2, 4, 8, 9, 6, 5, 7, 1],
            [8, 9, 2, 3, 6, 7, 1, 5, 4],
            [4, 7, 1, 9, 2, 5, 8, 3, 6],
            [6, 3, 5, 1, 4, 8, 9, 2, 7],
            [7, 4, 8, 6, 5, 1, 3, 9, 2],
            [2, 5, 3, 4, 7, 9, 6, 1, 8],
            [9, 1, 6, 2, 8, 3, 7, 4, 5],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 9', () => {
        const puzzle = [
            [7, 0, 0, 0, 0, 5, 0, 9, 0],
            [0, 4, 0, 0, 8, 0, 0, 0, 0],
            [0, 2, 0, 4, 0, 1, 5, 3, 6],
            [4, 0, 7, 0, 0, 0, 0, 5, 0],
            [0, 0, 0, 8, 5, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 4, 0, 3],
            [0, 0, 0, 0, 9, 0, 0, 8, 0],
            [9, 0, 0, 0, 0, 6, 0, 0, 7],
            [0, 0, 0, 0, 0, 0, 0, 2, 5],
        ];

        const expected = [
            [7, 3, 1, 2, 6, 5, 8, 9, 4],
            [6, 4, 5, 9, 8, 3, 1, 7, 2],
            [8, 2, 9, 4, 7, 1, 5, 3, 6],
            [4, 1, 7, 6, 3, 9, 2, 5, 8],
            [2, 6, 3, 8, 5, 4, 7, 1, 9],
            [5, 9, 8, 1, 2, 7, 4, 6, 3],
            [3, 5, 4, 7, 9, 2, 6, 8, 1],
            [9, 8, 2, 5, 1, 6, 3, 4, 7],
            [1, 7, 6, 3, 4, 8, 9, 2, 5],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });

    test('Hard Puzzle 10', () => {
        const puzzle = [
            [0, 0, 3, 0, 0, 7, 0, 6, 0],
            [0, 0, 7, 8, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3, 0],
            [0, 0, 0, 0, 5, 0, 0, 0, 1],
            [0, 0, 5, 4, 0, 8, 3, 7, 9],
            [0, 3, 0, 2, 7, 9, 6, 4, 0],
            [5, 0, 0, 0, 0, 0, 0, 0, 3],
            [0, 7, 6, 3, 9, 4, 0, 0, 0],
            [0, 0, 4, 0, 0, 5, 0, 8, 0],
        ];

        const expected = [
            [2, 5, 3, 9, 4, 7, 1, 6, 8],
            [9, 6, 7, 8, 3, 1, 2, 5, 4],
            [4, 8, 1, 5, 6, 2, 9, 3, 7],
            [7, 4, 9, 6, 5, 3, 8, 2, 1],
            [6, 2, 5, 4, 1, 8, 3, 7, 9],
            [1, 3, 8, 2, 7, 9, 6, 4, 5],
            [5, 1, 2, 7, 8, 6, 4, 9, 3],
            [8, 7, 6, 3, 9, 4, 5, 1, 2],
            [3, 9, 4, 1, 2, 5, 7, 8, 6],
        ];

        const solution = solvePuzzle(puzzle);
        expect(solution).toEqual(expected);
    });
});
