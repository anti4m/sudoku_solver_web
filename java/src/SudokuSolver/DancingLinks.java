package SudokuSolver;

import java.util.*;

public class DancingLinks {
    private ExactCoverMatrix matrix;
    private List<String[]> solutionSet;
    private List<MatrixNode> removedRows; // Contains single node from each row removed by manual assignments (not removed by DLX algorithm)
    private boolean findAllSolutions;     // If this is false, search will return after finding a single solution.

    public DancingLinks(ExactCoverMatrix matrix) {
        this.matrix = matrix;
        solutionSet = new ArrayList<>();
        removedRows = new ArrayList<>();
        findAllSolutions = false;
    }

    private void search(int k, MatrixNode[] partialSolution) {
        if (!findAllSolutions && !solutionSet.isEmpty()) return;

        ColumnHeaderNode root = matrix.getRoot();
        if (root.right == root) {                               // Exact cover solution found.
            solutionSet.add(enumerateSolution(partialSolution));
            return;
        }

        MatrixNode[] sol = new MatrixNode[k+1];                 // New solution array with one more slot.
        System.arraycopy(partialSolution, 0, sol, 0, partialSolution.length);

        ColumnHeaderNode column = chooseSmallestColumn(root);  // Pick smallest column to minimize branching factor.
        coverColumn(column);

        MatrixNode child = column.down;
        while (child != column) {               // Non-deterministically choose a row with a 1.
            sol[k] = child;

            MatrixNode brother = child.right;
            while (brother != child) {          // Cover all columns with a 1 in any of the same rows as the chosen column.
                coverColumn(brother.column);
                brother = brother.right;
            }

            search(k + 1, sol);              // Form a depth-first search tree branching by non-deterministic row choice.

            brother = child.left;
            while (brother != child) {          // Backtrack in search by undoing operations.
                uncoverColumn(brother.column);
                brother = brother.left;
            }

            child = child.down;
        }

        uncoverColumn(column);
    }

    private ColumnHeaderNode chooseSmallestColumn(ColumnHeaderNode root) {
        ColumnHeaderNode columnChoice = null;
        int minSize = Integer.MAX_VALUE;

        ColumnHeaderNode temp = (ColumnHeaderNode) root.right;
        while (temp != root) {
            if (temp.size < minSize) {
                minSize = temp.size;
                columnChoice = temp;
            }
            temp = (ColumnHeaderNode) temp.right;
        }

        return columnChoice;
    }

    // As long as a reference to the given column is maintained, the covered nodes will remain accessible in memory.
    private void coverColumn(ColumnHeaderNode column) {
        column.detachRow();

        MatrixNode child = column.down;
        while (child != column) {
            MatrixNode brother = child.right;
            while (brother != child) {
                brother.detachColumn();
                brother = brother.right;
            }
            child = child.down;
        }
    }

    private void uncoverColumn(ColumnHeaderNode column) {
        MatrixNode child = column.up;
        while (child != column) {
            MatrixNode brother = child.left;
            while (brother != child) {
                brother.reattachColumn();
                brother = brother.left;
            }
            child = child.up;
        }

        column.reattachRow();
    }

    /*
                                                            NOTE
    ----------------------------------------------------------------------------------------------------------------------
    The above methods compose the general Dancing Links algorithm, the below are useful helper methods specific to sudoku.
    ----------------------------------------------------------------------------------------------------------------------
     */

    public void setFindAllSolutions(boolean choice) {
        findAllSolutions = choice;
    }

    // Assign a value to a cell by choosing its corresponding row in the matrix, and removing
    // the rows corresponding to other possible assignments of the same cell.
    public void setAssignment(int row, int column, int value) {

        // Search for the cell's set of column headers (row-column constraints)
        String search = "R" + row + "C" + column;
        ColumnHeaderNode colHeader = matrix.getRoot();
        boolean found = false;
        do {
            colHeader = (ColumnHeaderNode) colHeader.right;
            found = colHeader.name.equals(search);
        } while (!found && colHeader != matrix.getRoot());

        // Delete rows of all other possible assignments for the given cell
        if (found) {
            MatrixNode child = colHeader.down;
            for (int i = 1; i <= 9; ++i) {
                if (i != value) {
                    MatrixNode brother = child;
                    do {
                        brother.detachColumn();
                        brother = brother.right;
                    } while (brother != child);

                    removedRows.add(child);
                }
                child = child.down; // The child's column neighbor's pointers have been changed, but the child's own pointers are intact
            }
        }
    }

    // Restore all rows removed by any assignment
    public void clearAssignments() {
        for (int i = removedRows.size() - 1; i >= 0; --i) {
            MatrixNode removedNode = removedRows.get(i).left;
            while (removedNode != removedRows.get(i)) {
                removedNode.reattachColumn();
                removedNode = removedNode.left;
            }
            removedNode.reattachColumn(); // Reattach the node from the list last, as it was the first to be removed
            removedRows.remove(i);
        }
    }

    private String[] enumerateSolution(MatrixNode[] solution) {
        String[] enumeratedSolution = new String[81]; // Sudoku solution will have 81 assignments, one for each cell.

        for (int i = 0; i < solution.length; ++i) {
            MatrixNode rowNode = solution[i];
            String[] rowArray = new String[4]; // 4 constraints per row of the sudoku matrix.
            for (int j = 0; j < rowArray.length; ++j) {
                rowArray[j] = rowNode.column.name;
                rowNode = rowNode.right;
            }
            Arrays.sort(rowArray, Comparator.reverseOrder());
            enumeratedSolution[i] = String.format("%s %s %s %s", rowArray[0], rowArray[1], rowArray[2], rowArray[3]);
        }

        Arrays.sort(enumeratedSolution);
        return enumeratedSolution;
    }

    public int[][] solve() {
        solutionSet = new ArrayList<>(); // Reset the solution set
        search(0, new MatrixNode[1]);
        clearAssignments();

        if (solutionSet.isEmpty()) return null; // No solution found

        String[] solution = solutionSet.get(0);
        int[][] retArray = new int[9][9];

        for (int i = 0; i < solution.length; ++i) {
            int row = Character.getNumericValue(solution[i].charAt(1));         // Locations given by enumerateSolution
            int column = Character.getNumericValue(solution[i].charAt(3));
            int value = Character.getNumericValue(solution[i].charAt(8));

            retArray[row][column] = value;
        }

        return retArray;
    }
}
