package SudokuSolver;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class ExactCoverMatrix {
    private ColumnHeaderNode root;

    public ExactCoverMatrix(String filename) {
        root = new ColumnHeaderNode("Root");
        initMatrix(getMatrixReader(filename));
    }

    public ColumnHeaderNode getRoot() {
        return root;
    }

    // Read matrix from file.
    private void initMatrix(Scanner matrixReader) {
        initHeaders(matrixReader);

        while (matrixReader.hasNextLine()) {
            String row = matrixReader.nextLine();

            Scanner rowReader = new Scanner(row);

            rowReader.next(); // Discard row label

            MatrixNode currentColumnHeader = root.right;                // First column
            MatrixNode currentColumnNode = currentColumnHeader.up;      // Circle down to bottom-most node in column
            MatrixNode currentRowNode = null;

            while (rowReader.hasNextInt()) {
                if (rowReader.nextInt() == 1) {
                    currentRowNode = new MatrixNode(currentColumnHeader, currentRowNode, currentColumnNode);
                }
                currentColumnHeader = currentColumnHeader.right;        // Next column
                currentColumnNode = currentColumnHeader.up;
            }
        }
    }

    private void initHeaders(Scanner matrixReader) {
        MatrixNode currentNode = root;

        String header = matrixReader.nextLine();
        Scanner lineReader = new Scanner(header);
        while (lineReader.hasNext()) {
            currentNode = new ColumnHeaderNode(currentNode, lineReader.next());
        }
    }

    private Scanner getMatrixReader(String filename) {
        File f = new File(filename);
        Scanner sc = null;
        try { sc = new Scanner(f); }
        catch (FileNotFoundException ex) { System.err.println(ex); }

        return sc;
    }
}
