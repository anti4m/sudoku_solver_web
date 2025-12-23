import { MatrixNode } from './MatrixNode';
import { ColumnHeaderNode } from './ColumnHeaderNode';
import { ExactCoverMatrix } from './ExactCoverMatrix';

export class DancingLinks {
    private matrix: ExactCoverMatrix;
    private solutionSet: string[][];
    private removedRows: MatrixNode[];
    private findAllSolutions: boolean;

    constructor(matrix: ExactCoverMatrix) {
        this.matrix = matrix;
        this.solutionSet = [];
        this.removedRows = [];
        this.findAllSolutions = false;
    }

    private search(k: number, partialSolution: MatrixNode[]): void {
        if (!this.findAllSolutions && this.solutionSet.length > 0) return;

        const root = this.matrix.getRoot();
        if (root.right === root) {
            // Exact cover solution found
            this.solutionSet.push(this.enumerateSolution(partialSolution));
            return;
        }

        // New solution array with one more slot
        const sol: MatrixNode[] = [...partialSolution, null as unknown as MatrixNode];

        const column = this.chooseSmallestColumn(root);
        if (column === null || column.size === 0) return; // No solution on this path

        this.coverColumn(column);

        let child = column.down;
        while (child !== column) {
            sol[k] = child;

            // Cover all columns with a 1 in any of the same rows as the chosen column
            let brother = child.right;
            while (brother !== child) {
                this.coverColumn(brother.column!);
                brother = brother.right;
            }

            this.search(k + 1, sol);

            // Backtrack: uncover in reverse order
            brother = child.left;
            while (brother !== child) {
                this.uncoverColumn(brother.column!);
                brother = brother.left;
            }

            child = child.down;
        }

        this.uncoverColumn(column);
    }

    private chooseSmallestColumn(root: ColumnHeaderNode): ColumnHeaderNode | null {
        let columnChoice: ColumnHeaderNode | null = null;
        let minSize = Number.MAX_SAFE_INTEGER;

        let temp = root.right as ColumnHeaderNode;
        while (temp !== root) {
            if (temp.size < minSize) {
                minSize = temp.size;
                columnChoice = temp;
            }
            temp = temp.right as ColumnHeaderNode;
        }

        return columnChoice;
    }

    private coverColumn(column: ColumnHeaderNode): void {
        column.detachRow();

        let child = column.down;
        while (child !== column) {
            let brother = child.right;
            while (brother !== child) {
                brother.detachColumn();
                brother = brother.right;
            }
            child = child.down;
        }
    }

    private uncoverColumn(column: ColumnHeaderNode): void {
        let child = column.up;
        while (child !== column) {
            let brother = child.left;
            while (brother !== child) {
                brother.reattachColumn();
                brother = brother.left;
            }
            child = child.up;
        }

        column.reattachRow();
    }

    public setFindAllSolutions(choice: boolean): void {
        this.findAllSolutions = choice;
    }

    // Assign a value to a cell by choosing its corresponding row in the matrix,
    // and removing the rows corresponding to other possible assignments of the same cell.
    public setAssignment(row: number, column: number, value: number): void {
        const root = this.matrix.getRoot();

        // Search for the cell's column header (row-column constraint)
        const search = `R${row}C${column}`;
        let colHeader = root.right as ColumnHeaderNode;
        let found = false;

        while (colHeader !== root) {
            if (colHeader.name === search) {
                found = true;
                break;
            }
            colHeader = colHeader.right as ColumnHeaderNode;
        }

        // Delete rows of all other possible assignments for the given cell
        if (found) {
            let child = colHeader.down;
            for (let i = 1; i <= 9; i++) {
                if (i !== value) {
                    let brother: MatrixNode = child;
                    do {
                        brother.detachColumn();
                        brother = brother.right;
                    } while (brother !== child);

                    this.removedRows.push(child);
                }
                child = child.down; // The child's column neighbor's pointers have been changed, but the child's own pointers are intact
            }
        }
    }

    // Restore all rows removed by any assignment
    public clearAssignments(): void {
        for (let i = this.removedRows.length - 1; i >= 0; i--) {
            let removedNode = this.removedRows[i].left;
            while (removedNode !== this.removedRows[i]) {
                removedNode.reattachColumn();
                removedNode = removedNode.left;
            }
            removedNode.reattachColumn(); // Reattach the node from the list last, as it was the first to be removed
        }
        this.removedRows = [];
    }

    private enumerateSolution(solution: MatrixNode[]): string[] {
        const enumeratedSolution: string[] = new Array(81);

        for (let i = 0; i < solution.length; i++) {
            let rowNode = solution[i];
            const rowArray: string[] = new Array(4);

            for (let j = 0; j < 4; j++) {
                rowArray[j] = rowNode.column!.name;
                rowNode = rowNode.right;
            }

            // Sort in reverse order (descending)
            rowArray.sort((a, b) => b.localeCompare(a));
            enumeratedSolution[i] = `${rowArray[0]} ${rowArray[1]} ${rowArray[2]} ${rowArray[3]}`;
        }

        enumeratedSolution.sort();
        return enumeratedSolution;
    }

    public solve(): number[][] | null {
        this.solutionSet = []; // Reset the solution set
        this.search(0, []);
        this.clearAssignments();

        if (this.solutionSet.length === 0) return null; // No solution found

        const solution = this.solutionSet[0];
        const retArray: number[][] = Array.from({ length: 9 }, () => new Array(9).fill(0));

        for (let i = 0; i < solution.length; i++) {
            // Parse from format like "R0C0 R0#1 C0#1 B0#1"
            // Row at charAt(1), col at charAt(3), value at charAt(8)
            const row = parseInt(solution[i].charAt(1));
            const column = parseInt(solution[i].charAt(3));
            const value = parseInt(solution[i].charAt(8));

            retArray[row][column] = value;
        }

        return retArray;
    }
}
