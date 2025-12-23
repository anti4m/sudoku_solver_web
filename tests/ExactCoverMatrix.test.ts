import { describe, expect, test } from 'bun:test';
import { ExactCoverMatrix } from '../src/ExactCoverMatrix';
import { ColumnHeaderNode } from '../src/ColumnHeaderNode';
import { MatrixNode } from '../src/MatrixNode';

describe('ExactCoverMatrix', () => {
    test('has exactly 324 column headers', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        let count = 0;
        let node = root.right;
        while (node !== root) {
            count++;
            node = node.right;
        }

        expect(count).toBe(324);
    });

    test('column headers are in correct order', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        const names: string[] = [];
        let node = root.right;
        while (node !== root) {
            names.push((node as ColumnHeaderNode).name);
            node = node.right;
        }

        // Check first few cell constraints
        expect(names[0]).toBe('R0C0');
        expect(names[1]).toBe('R0C1');
        expect(names[8]).toBe('R0C8');
        expect(names[9]).toBe('R1C0');
        expect(names[80]).toBe('R8C8');

        // Check first few row-number constraints
        expect(names[81]).toBe('R0#1');
        expect(names[82]).toBe('R0#2');
        expect(names[89]).toBe('R0#9');
        expect(names[90]).toBe('R1#1');
        expect(names[161]).toBe('R8#9');

        // Check first few column-number constraints
        expect(names[162]).toBe('C0#1');
        expect(names[163]).toBe('C0#2');
        expect(names[170]).toBe('C0#9');
        expect(names[171]).toBe('C1#1');
        expect(names[242]).toBe('C8#9');

        // Check first few box-number constraints
        expect(names[243]).toBe('B0#1');
        expect(names[244]).toBe('B0#2');
        expect(names[251]).toBe('B0#9');
        expect(names[252]).toBe('B1#1');
        expect(names[323]).toBe('B8#9');
    });

    test('each column has exactly 9 rows (size = 9)', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        let node = root.right;
        while (node !== root) {
            const header = node as ColumnHeaderNode;
            expect(header.size).toBe(9);
            node = node.right;
        }
    });

    test('each row has exactly 4 nodes', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        // Check several rows by traversing down from the first column
        const firstCol = root.right as ColumnHeaderNode;
        let rowStart = firstCol.down;

        while (rowStart !== firstCol) {
            let count = 1;
            let current = rowStart.right;
            while (current !== rowStart) {
                count++;
                current = current.right;
            }
            expect(count).toBe(4);
            rowStart = rowStart.down;
        }
    });

    test('has exactly 729 rows (9 values x 81 cells)', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        // Count unique rows by counting nodes in the first column
        // Each cell constraint column has 9 rows (one for each value)
        // Total rows = 81 cells * 9 values = 729
        const firstCol = root.right as ColumnHeaderNode;
        expect(firstCol.size).toBe(9); // First cell has 9 possible values

        // Total rows should be sum of all cell column sizes
        let totalRows = 0;
        let node = root.right;
        while (node !== root && totalRows < 81 * 9 + 1) {
            const header = node as ColumnHeaderNode;
            if (header.name.match(/^R\dC\d$/)) {
                totalRows += header.size;
            }
            node = node.right;
        }
        expect(totalRows).toBe(729);
    });

    test('row for R0C0#1 connects correct columns', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        // Find R0C0 column
        let r0c0Col: ColumnHeaderNode | null = null;
        let node = root.right;
        while (node !== root) {
            if ((node as ColumnHeaderNode).name === 'R0C0') {
                r0c0Col = node as ColumnHeaderNode;
                break;
            }
            node = node.right;
        }
        expect(r0c0Col).not.toBeNull();

        // First row in R0C0 column should be for value 1
        // It should connect to R0C0, R0#1, C0#1, B0#1
        const firstRow = r0c0Col!.down;
        const columnNames: string[] = [];

        let rowNode: MatrixNode = firstRow;
        do {
            columnNames.push(rowNode.column!.name);
            rowNode = rowNode.right;
        } while (rowNode !== firstRow);

        columnNames.sort();
        expect(columnNames).toEqual(['B0#1', 'C0#1', 'R0#1', 'R0C0']);
    });

    test('row for R4C5#7 connects correct columns (middle of grid)', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        // Find R4C5 column
        let r4c5Col: ColumnHeaderNode | null = null;
        let node = root.right;
        while (node !== root) {
            if ((node as ColumnHeaderNode).name === 'R4C5') {
                r4c5Col = node as ColumnHeaderNode;
                break;
            }
            node = node.right;
        }
        expect(r4c5Col).not.toBeNull();

        // 7th row in R4C5 column should be for value 7
        // Box for (4,5) = floor(4/3)*3 + floor(5/3) = 1*3 + 1 = 4
        // Should connect to R4C5, R4#7, C5#7, B4#7
        let rowNode = r4c5Col!.down;
        for (let i = 1; i < 7; i++) {
            rowNode = rowNode.down;
        }

        const columnNames: string[] = [];
        let current: MatrixNode = rowNode;
        do {
            columnNames.push(current.column!.name);
            current = current.right;
        } while (current !== rowNode);

        columnNames.sort();
        expect(columnNames).toEqual(['B4#7', 'C5#7', 'R4#7', 'R4C5']);
    });

    test('circular linking is correct for all columns', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        let node = root.right;
        while (node !== root) {
            const header = node as ColumnHeaderNode;

            // Traverse down and count
            let count = 0;
            let current = header.down;
            while (current !== header) {
                count++;
                current = current.down;
            }
            expect(count).toBe(header.size);

            // Traverse up and count
            count = 0;
            current = header.up;
            while (current !== header) {
                count++;
                current = current.up;
            }
            expect(count).toBe(header.size);

            node = node.right;
        }
    });

    test('circular linking is correct for rows', () => {
        const matrix = new ExactCoverMatrix();
        const root = matrix.getRoot();

        // Check first few rows
        const firstCol = root.right as ColumnHeaderNode;
        let rowStart = firstCol.down;
        let rowsChecked = 0;

        while (rowStart !== firstCol && rowsChecked < 20) {
            // Traverse right
            let countRight = 1;
            let current = rowStart.right;
            while (current !== rowStart) {
                countRight++;
                current = current.right;
            }
            expect(countRight).toBe(4);

            // Traverse left
            let countLeft = 1;
            current = rowStart.left;
            while (current !== rowStart) {
                countLeft++;
                current = current.left;
            }
            expect(countLeft).toBe(4);

            rowStart = rowStart.down;
            rowsChecked++;
        }
    });
});
