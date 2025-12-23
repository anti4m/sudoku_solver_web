import { describe, expect, test } from 'bun:test';
import { DancingLinks } from '../src/SudokuSolver/DancingLinks';
import { ExactCoverMatrix } from '../src/SudokuSolver/ExactCoverMatrix';

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
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

        const solution = dlx.solve();

        expect(solution).not.toBeNull();
        expect(solution!.length).toBe(9);
        expect(solution![0].length).toBe(9);
        expect(isValidSudoku(solution!)).toBe(true);
    });

    test('solves easy puzzle with verification', () => {
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

        // Easy puzzle
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

        // Set assignments for non-zero cells
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (puzzle[r][c] !== 0) {
                    dlx.setAssignment(r, c, puzzle[r][c]);
                }
            }
        }

        const solution = dlx.solve();

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
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

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

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (puzzle[r][c] !== 0) {
                    dlx.setAssignment(r, c, puzzle[r][c]);
                }
            }
        }

        const solution = dlx.solve();

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
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

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

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (puzzle[r][c] !== 0) {
                    dlx.setAssignment(r, c, puzzle[r][c]);
                }
            }
        }

        const solution = dlx.solve();

        expect(solution).not.toBeNull();
        expect(isValidSudoku(solution!)).toBe(true);
        expect(solution![8][3]).toBe(2); // The only valid value
        expect(solution![8][8]).toBe(9); // The only valid value
    });

    test('solves another known puzzle', () => {
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

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

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (puzzle[r][c] !== 0) {
                    dlx.setAssignment(r, c, puzzle[r][c]);
                }
            }
        }

        const solution = dlx.solve();

        expect(solution).not.toBeNull();
        expect(isValidSudoku(solution!)).toBe(true);
    });
});
