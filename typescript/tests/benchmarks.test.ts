import { describe, expect, test } from 'bun:test';
import { DancingLinks } from '../src/SudokuSolver/DancingLinks';
import { ExactCoverMatrix } from '../src/SudokuSolver/ExactCoverMatrix';

describe('Performance Benchmarks', () => {
    test('matrix construction < 100ms', () => {
        const start = performance.now();
        new ExactCoverMatrix();
        const elapsed = performance.now() - start;

        console.log(`Matrix construction: ${elapsed.toFixed(2)}ms`);
        expect(elapsed).toBeLessThan(100);
    });

    test('empty puzzle solve < 50ms', () => {
        const matrix = new ExactCoverMatrix();
        const dlx = new DancingLinks(matrix);

        const start = performance.now();
        const solution = dlx.solve();
        const elapsed = performance.now() - start;

        console.log(`Empty puzzle solve: ${elapsed.toFixed(2)}ms`);
        expect(solution).not.toBeNull();
        expect(elapsed).toBeLessThan(50);
    });

    test('hard puzzle solve < 100ms', () => {
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

        const start = performance.now();
        const solution = dlx.solve();
        const elapsed = performance.now() - start;

        console.log(`Hard puzzle solve: ${elapsed.toFixed(2)}ms`);
        expect(solution).not.toBeNull();
        expect(elapsed).toBeLessThan(100);
    });

    test('100 random puzzles < 5 seconds total', () => {
        // Collection of puzzles with varying difficulty
        const puzzles = [
            // Easy puzzles
            [[5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0], [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6], [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]],
            // Medium puzzles
            [[0, 0, 0, 2, 6, 0, 7, 0, 1], [6, 8, 0, 0, 7, 0, 0, 9, 0], [1, 9, 0, 0, 0, 4, 5, 0, 0], [8, 2, 0, 1, 0, 0, 0, 4, 0], [0, 0, 4, 6, 0, 2, 9, 0, 0], [0, 5, 0, 0, 0, 3, 0, 2, 8], [0, 0, 9, 3, 0, 0, 0, 7, 4], [0, 4, 0, 0, 5, 0, 0, 3, 6], [7, 0, 3, 0, 1, 8, 0, 0, 0]],
            // Hard puzzle
            [[8, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 6, 0, 0, 0, 0, 0], [0, 7, 0, 0, 9, 0, 2, 0, 0], [0, 5, 0, 0, 0, 7, 0, 0, 0], [0, 0, 0, 0, 4, 5, 7, 0, 0], [0, 0, 0, 1, 0, 0, 0, 3, 0], [0, 0, 1, 0, 0, 0, 0, 6, 8], [0, 0, 8, 5, 0, 0, 0, 1, 0], [0, 9, 0, 0, 0, 0, 4, 0, 0]],
            // More easy puzzles to reach 100
            [[0, 2, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 6, 0, 0, 0, 0, 3], [0, 7, 4, 0, 8, 0, 0, 0, 0], [0, 0, 0, 0, 0, 3, 0, 0, 2], [0, 8, 0, 0, 4, 0, 0, 1, 0], [6, 0, 0, 5, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 7, 8, 0], [5, 0, 0, 0, 0, 9, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 4, 0]],
            [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 3, 0, 8, 5], [0, 0, 1, 0, 2, 0, 0, 0, 0], [0, 0, 0, 5, 0, 7, 0, 0, 0], [0, 0, 4, 0, 0, 0, 1, 0, 0], [0, 9, 0, 0, 0, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0, 0, 7, 3], [0, 0, 2, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 9]],
        ];

        const start = performance.now();
        let solved = 0;

        // Run 20 iterations of our 5 puzzles = 100 solves
        for (let iteration = 0; iteration < 20; iteration++) {
            for (const puzzle of puzzles) {
                const matrix = new ExactCoverMatrix();
                const dlx = new DancingLinks(matrix);

                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        if (puzzle[r][c] !== 0) {
                            dlx.setAssignment(r, c, puzzle[r][c]);
                        }
                    }
                }

                const solution = dlx.solve();
                if (solution !== null) solved++;
            }
        }

        const elapsed = performance.now() - start;

        console.log(`100 puzzles solved in ${elapsed.toFixed(2)}ms (${solved} successful)`);
        expect(solved).toBe(100);
        expect(elapsed).toBeLessThan(5000);
    });

    test('matrix can be reused for multiple solves', () => {
        const matrix = new ExactCoverMatrix();

        const puzzles = [
            [[5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0], [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6], [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]],
            [[8, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 6, 0, 0, 0, 0, 0], [0, 7, 0, 0, 9, 0, 2, 0, 0], [0, 5, 0, 0, 0, 7, 0, 0, 0], [0, 0, 0, 0, 4, 5, 7, 0, 0], [0, 0, 0, 1, 0, 0, 0, 3, 0], [0, 0, 1, 0, 0, 0, 0, 6, 8], [0, 0, 8, 5, 0, 0, 0, 1, 0], [0, 9, 0, 0, 0, 0, 4, 0, 0]],
        ];

        const start = performance.now();

        for (const puzzle of puzzles) {
            const dlx = new DancingLinks(matrix);

            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (puzzle[r][c] !== 0) {
                        dlx.setAssignment(r, c, puzzle[r][c]);
                    }
                }
            }

            const solution = dlx.solve();
            expect(solution).not.toBeNull();
        }

        const elapsed = performance.now() - start;
        console.log(`2 puzzles with matrix reuse: ${elapsed.toFixed(2)}ms`);
    });
});
