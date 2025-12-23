package SudokuSolver;

public class ColumnHeaderNode extends MatrixNode {
    public String name;
    public int size;

    public ColumnHeaderNode(String name) {
        super();
        this.name = name;
        size = 0;
    }

    public ColumnHeaderNode(MatrixNode leftNode, String name) {
        super(null, leftNode, null);
        this.name = name;
        size = 0;
    }

    @Override public String toString() {
        return name;
    }
}
