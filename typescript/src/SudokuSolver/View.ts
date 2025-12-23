import { InputFormatter } from './InputFormatter';

export class View {
    public static readonly BOARD_WIDTH = 9;

    private container: HTMLElement;
    private cells: HTMLInputElement[][];
    private unitBoxes: HTMLElement[][];
    private button: HTMLButtonElement;
    private message: HTMLElement;
    private cellWidth: number;

    constructor(cellWidth: number) {
        this.cellWidth = cellWidth;
        this.cells = [];
        this.unitBoxes = [];

        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'sudoku-container';

        // Create 3x3 unit boxes, each containing a 3x3 grid of cells
        const board = document.createElement('div');
        board.className = 'sudoku-board';

        for (let i = 0; i < 3; i++) {
            this.unitBoxes[i] = [];
            for (let j = 0; j < 3; j++) {
                const unitBox = document.createElement('div');
                unitBox.className = 'unit-box';
                this.unitBoxes[i][j] = unitBox;
                board.appendChild(unitBox);
            }
        }

        // Create cells and add to unit boxes
        const formatter = new InputFormatter();
        for (let i = 0; i < View.BOARD_WIDTH; i++) {
            this.cells[i] = [];
            for (let j = 0; j < View.BOARD_WIDTH; j++) {
                const cell = this.createCell(cellWidth, formatter);
                this.cells[i][j] = cell;

                // Add to appropriate unit box
                const boxRow = Math.floor(i / 3);
                const boxCol = Math.floor(j / 3);
                this.unitBoxes[boxRow][boxCol].appendChild(cell);
            }
        }

        this.container.appendChild(board);

        // Create solve/reset button
        this.button = document.createElement('button');
        this.button.className = 'solve-button';
        this.button.textContent = 'S O L V E';
        this.button.style.width = `${cellWidth * 3}px`;
        this.container.appendChild(this.button);

        // Create message display
        this.message = document.createElement('div');
        this.message.className = 'message';
        this.container.appendChild(this.message);
    }

    public getContainer(): HTMLElement {
        return this.container;
    }

    public getButton(): HTMLButtonElement {
        return this.button;
    }

    public getCells(): HTMLInputElement[][] {
        return this.cells;
    }

    public setAllCells(boardArray: number[][] | null): void {
        if (boardArray !== null) {
            for (let i = 0; i < this.cells.length; i++) {
                for (let j = 0; j < this.cells[0].length; j++) {
                    this.cells[i][j].value = boardArray[i][j].toString();
                }
            }
        }

        this.disableAllCells();
    }

    public disableAllCells(): void {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[0].length; j++) {
                this.cells[i][j].disabled = true;
            }
        }
    }

    public resetCells(): void {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[0].length; j++) {
                this.cells[i][j].value = '';
                this.cells[i][j].disabled = false;
            }
        }
        this.message.textContent = '';
    }

    public displayMessage(s: string): void {
        this.message.textContent = s;
    }

    private createCell(width: number, formatter: InputFormatter): HTMLInputElement {
        const cell = document.createElement('input');
        cell.type = 'text';
        cell.className = 'sudoku-cell';
        cell.style.width = `${width}px`;
        cell.style.height = `${width}px`;
        cell.maxLength = 1;
        formatter.setFormat(cell);
        return cell;
    }
}
