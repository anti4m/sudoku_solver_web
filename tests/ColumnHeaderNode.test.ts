import { describe, expect, test } from 'bun:test';
import { MatrixNode } from '../src/MatrixNode';
import { ColumnHeaderNode } from '../src/ColumnHeaderNode';

describe('ColumnHeaderNode', () => {
    test('initializes with name using single-arg constructor', () => {
        const header = new ColumnHeaderNode('R0C0');
        expect(header.name).toBe('R0C0');
        expect(header.size).toBe(0);
    });

    test('initializes with name and links horizontally using two-arg constructor', () => {
        const root = new ColumnHeaderNode('Root');
        const col1 = new ColumnHeaderNode(root, 'Col1');
        const col2 = new ColumnHeaderNode(col1, 'Col2');

        expect(col1.name).toBe('Col1');
        expect(col2.name).toBe('Col2');
        expect(col1.size).toBe(0);
        expect(col2.size).toBe(0);

        // Check horizontal linking
        expect(root.right).toBe(col1);
        expect(col1.right).toBe(col2);
        expect(col2.right).toBe(root);
        expect(root.left).toBe(col2);
        expect(col2.left).toBe(col1);
        expect(col1.left).toBe(root);
    });

    test('extends MatrixNode correctly', () => {
        const header = new ColumnHeaderNode('test');
        expect(header instanceof MatrixNode).toBe(true);
        expect(header.up).toBe(header);
        expect(header.down).toBe(header);
        expect(header.left).toBe(header);
        expect(header.right).toBe(header);
    });

    test('toString returns name', () => {
        const header = new ColumnHeaderNode('R0#5');
        expect(header.toString()).toBe('R0#5');
    });

    test('size tracks nodes in column', () => {
        const header = new ColumnHeaderNode('test');
        expect(header.size).toBe(0);

        const node1 = new MatrixNode(header, null, header);
        expect(header.size).toBe(1);

        new MatrixNode(header, null, node1);
        expect(header.size).toBe(2);

        node1.detachColumn();
        expect(header.size).toBe(1);

        node1.reattachColumn();
        expect(header.size).toBe(2);
    });

    test('creates chain of column headers', () => {
        const root = new ColumnHeaderNode('Root');
        let current: MatrixNode = root;

        // Create 324 column headers like in sudoku
        const names: string[] = [];
        for (let i = 0; i < 324; i++) {
            names.push(`C${i}`);
            current = new ColumnHeaderNode(current, `C${i}`);
        }

        // Count headers by traversing from root
        let count = 0;
        let node = root.right;
        while (node !== root) {
            count++;
            node = node.right;
        }
        expect(count).toBe(324);

        // Check circular linking
        expect(root.left instanceof ColumnHeaderNode).toBe(true);
        expect((root.left as ColumnHeaderNode).name).toBe('C323');
    });
});
