package SudokuSolver;

// The provided constructors allow for easy construction of the matrix from left to right, and the default self-pointers
// allow for automatic circular linking.

// The reference to the beginning of the row/column will propagate to the outgoing pointer of the last node
// in the row/column. Then that first node will have its link set to the newly constructed node, finishing the circular link.
// The instructions which carry out this process will alternatively work to insert a node into the middle of a row/column.
public class MatrixNode {
    public ColumnHeaderNode column = null;
    public MatrixNode up = this;
    public MatrixNode down = this;
    public MatrixNode left = this;
    public MatrixNode right = this;


    public MatrixNode() { }

    public MatrixNode(ColumnHeaderNode columnHeaderNode, MatrixNode leftNode, MatrixNode upNode) {
        if (columnHeaderNode != null) {
            column = columnHeaderNode;
            ++column.size;
        }

        if (leftNode != null) {
            left = leftNode;
            this.right = left.right; // Circular link -- right will point to first node in row (or will work normally if inserted in the middle of a list).
            left.right = this;

            right.left = this;      // Circular link -- first node in row will point to this node.
        }

        if (upNode != null) {
            up = upNode;
            this.down = up.down;  // Circular link
            up.down = this;

            down.up = this;       // Circular link
        }
    }

    public MatrixNode(MatrixNode headerNode, MatrixNode leftNode, MatrixNode upNode) {
        this(headerNode instanceof ColumnHeaderNode ? (ColumnHeaderNode) headerNode : null,
                leftNode, upNode);
    }

    public void detachRow() {
        left.right = right;
        right.left = left;
    }

    public void detachColumn() {
        up.down = down;
        down.up = up;
        --column.size;
    }

    public void reattachRow() {
        left.right = this;
        right.left = this;
    }

    public void reattachColumn() {
        up.down = this;
        down.up = this;
        ++column.size;
    }

    @Override
    public String toString() { return "1"; }
}
