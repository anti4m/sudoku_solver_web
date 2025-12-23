import { MatrixNode } from './MatrixNode';
import { ColumnHeaderNode } from './ColumnHeaderNode';

export class ExactCoverMatrix {
    private root: ColumnHeaderNode;
    private columnMap: Map<string, ColumnHeaderNode>;

    constructor() {
        this.root = new ColumnHeaderNode('Root');
        this.columnMap = new Map();
        this.generateMatrix();
    }

    public getRoot(): ColumnHeaderNode {
        return this.root;
    }

    private generateMatrix(): void {
        this.initHeaders();
        this.addAllRows();
    }

    private initHeaders(): void {
        let currentNode: MatrixNode = this.root;

        // 1. Cell constraints (81): R0C0..R8C8
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const name = `R${r}C${c}`;
                const header = new ColumnHeaderNode(currentNode, name);
                this.columnMap.set(name, header);
                currentNode = header;
            }
        }

        // 2. Row-number constraints (81): R0#1..R8#9
        for (let r = 0; r < 9; r++) {
            for (let v = 1; v <= 9; v++) {
                const name = `R${r}#${v}`;
                const header = new ColumnHeaderNode(currentNode, name);
                this.columnMap.set(name, header);
                currentNode = header;
            }
        }

        // 3. Column-number constraints (81): C0#1..C8#9
        for (let c = 0; c < 9; c++) {
            for (let v = 1; v <= 9; v++) {
                const name = `C${c}#${v}`;
                const header = new ColumnHeaderNode(currentNode, name);
                this.columnMap.set(name, header);
                currentNode = header;
            }
        }

        // 4. Box-number constraints (81): B0#1..B8#9
        for (let b = 0; b < 9; b++) {
            for (let v = 1; v <= 9; v++) {
                const name = `B${b}#${v}`;
                const header = new ColumnHeaderNode(currentNode, name);
                this.columnMap.set(name, header);
                currentNode = header;
            }
        }
    }

    private addAllRows(): void {
        // For each cell (r,c) and each possible value (1-9), add a row
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                for (let v = 1; v <= 9; v++) {
                    this.addRow(r, c, v);
                }
            }
        }
    }

    private addRow(row: number, col: number, value: number): void {
        const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);

        // Get the 4 column headers for this row
        const cellCol = this.findColumn(`R${row}C${col}`);
        const rowNumCol = this.findColumn(`R${row}#${value}`);
        const colNumCol = this.findColumn(`C${col}#${value}`);
        const boxNumCol = this.findColumn(`B${box}#${value}`);

        // Create 4 nodes for this row, linked horizontally
        // Each node is also linked vertically to its column
        const node1 = new MatrixNode(cellCol, null, cellCol.up);
        const node2 = new MatrixNode(rowNumCol, node1, rowNumCol.up);
        const node3 = new MatrixNode(colNumCol, node2, colNumCol.up);
        new MatrixNode(boxNumCol, node3, boxNumCol.up);
    }

    private findColumn(name: string): ColumnHeaderNode {
        const col = this.columnMap.get(name);
        if (!col) {
            throw new Error(`Column ${name} not found`);
        }
        return col;
    }
}
