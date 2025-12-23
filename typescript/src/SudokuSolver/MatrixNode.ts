// Forward declaration for ColumnHeaderNode to avoid circular dependency
import type { ColumnHeaderNode } from './ColumnHeaderNode';

// The provided constructors allow for easy construction of the matrix from left to right, and the default self-pointers
// allow for automatic circular linking.
//
// The reference to the beginning of the row/column will propagate to the outgoing pointer of the last node
// in the row/column. Then that first node will have its link set to the newly constructed node, finishing the circular link.
// The instructions which carry out this process will alternatively work to insert a node into the middle of a row/column.
export class MatrixNode {
    public column: ColumnHeaderNode | null = null;
    public up: MatrixNode = this;
    public down: MatrixNode = this;
    public left: MatrixNode = this;
    public right: MatrixNode = this;

    constructor(
        columnHeaderNode?: ColumnHeaderNode | null,
        leftNode?: MatrixNode | null,
        upNode?: MatrixNode | null
    ) {
        if (columnHeaderNode != null) {
            this.column = columnHeaderNode;
            ++columnHeaderNode.size;
        }

        if (leftNode != null) {
            this.left = leftNode;
            this.right = leftNode.right; // Circular link -- right will point to first node in row (or will work normally if inserted in the middle of a list).
            leftNode.right = this;
            this.right.left = this; // Circular link -- first node in row will point to this node.
        }

        if (upNode != null) {
            this.up = upNode;
            this.down = upNode.down; // Circular link
            upNode.down = this;
            this.down.up = this; // Circular link
        }
    }

    public detachRow(): void {
        this.left.right = this.right;
        this.right.left = this.left;
    }

    public detachColumn(): void {
        this.up.down = this.down;
        this.down.up = this.up;
        --this.column!.size;
    }

    public reattachRow(): void {
        this.left.right = this;
        this.right.left = this;
    }

    public reattachColumn(): void {
        this.up.down = this;
        this.down.up = this;
        ++this.column!.size;
    }

    public toString(): string {
        return "1";
    }
}
