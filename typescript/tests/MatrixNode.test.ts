import { describe, expect, test } from 'bun:test';
import { MatrixNode } from '../src/SudokuSolver/MatrixNode';
import { ColumnHeaderNode } from '../src/SudokuSolver/ColumnHeaderNode';

describe('MatrixNode', () => {
    test('initializes with self-pointers', () => {
        const node = new MatrixNode();
        expect(node.up).toBe(node);
        expect(node.down).toBe(node);
        expect(node.left).toBe(node);
        expect(node.right).toBe(node);
        expect(node.column).toBeNull();
    });

    test('links horizontally when leftNode is provided', () => {
        const first = new MatrixNode();
        const second = new MatrixNode(null, first, null);

        // Circular horizontal linking
        expect(second.left).toBe(first);
        expect(second.right).toBe(first);
        expect(first.right).toBe(second);
        expect(first.left).toBe(second);
    });

    test('links vertically when upNode is provided', () => {
        const header = new ColumnHeaderNode('test');
        const first = new MatrixNode(header, null, header);
        const second = new MatrixNode(header, null, first);

        // Circular vertical linking
        expect(second.up).toBe(first);
        expect(second.down).toBe(header);
        expect(first.down).toBe(second);
        expect(header.up).toBe(second);
        expect(header.down).toBe(first);
    });

    test('increments column size when header is provided', () => {
        const header = new ColumnHeaderNode('test');
        expect(header.size).toBe(0);

        new MatrixNode(header, null, header);
        expect(header.size).toBe(1);

        new MatrixNode(header, null, header);
        expect(header.size).toBe(2);
    });

    test('detachRow removes node from horizontal chain', () => {
        const first = new MatrixNode();
        const second = new MatrixNode(null, first, null);
        const third = new MatrixNode(null, second, null);

        second.detachRow();

        expect(first.right).toBe(third);
        expect(third.left).toBe(first);
        // second's pointers are still intact
        expect(second.left).toBe(first);
        expect(second.right).toBe(third);
    });

    test('detachColumn removes node from vertical chain', () => {
        const header = new ColumnHeaderNode('test');
        const first = new MatrixNode(header, null, header);
        const second = new MatrixNode(header, null, first);
        const third = new MatrixNode(header, null, second);

        expect(header.size).toBe(3);

        second.detachColumn();

        expect(first.down).toBe(third);
        expect(third.up).toBe(first);
        expect(header.size).toBe(2);
        // second's pointers are still intact
        expect(second.up).toBe(first);
        expect(second.down).toBe(third);
    });

    test('reattachRow restores node to horizontal chain', () => {
        const first = new MatrixNode();
        const second = new MatrixNode(null, first, null);
        const third = new MatrixNode(null, second, null);

        second.detachRow();
        second.reattachRow();

        expect(first.right).toBe(second);
        expect(second.right).toBe(third);
        expect(third.left).toBe(second);
        expect(second.left).toBe(first);
    });

    test('reattachColumn restores node to vertical chain', () => {
        const header = new ColumnHeaderNode('test');
        const first = new MatrixNode(header, null, header);
        const second = new MatrixNode(header, null, first);
        const third = new MatrixNode(header, null, second);

        second.detachColumn();
        expect(header.size).toBe(2);

        second.reattachColumn();

        expect(first.down).toBe(second);
        expect(second.down).toBe(third);
        expect(third.up).toBe(second);
        expect(second.up).toBe(first);
        expect(header.size).toBe(3);
    });

    test('toString returns "1"', () => {
        const node = new MatrixNode();
        expect(node.toString()).toBe('1');
    });

    test('creates 3-node circular horizontal chain', () => {
        const a = new MatrixNode();
        const b = new MatrixNode(null, a, null);
        const c = new MatrixNode(null, b, null);

        // Check full circular chain
        expect(a.right).toBe(b);
        expect(b.right).toBe(c);
        expect(c.right).toBe(a);
        expect(a.left).toBe(c);
        expect(c.left).toBe(b);
        expect(b.left).toBe(a);
    });

    test('creates 3-node circular vertical chain', () => {
        const header = new ColumnHeaderNode('test');
        const a = new MatrixNode(header, null, header);
        const b = new MatrixNode(header, null, a);
        const c = new MatrixNode(header, null, b);

        // Check full circular chain
        expect(header.down).toBe(a);
        expect(a.down).toBe(b);
        expect(b.down).toBe(c);
        expect(c.down).toBe(header);
        expect(header.up).toBe(c);
        expect(c.up).toBe(b);
        expect(b.up).toBe(a);
        expect(a.up).toBe(header);
    });
});
