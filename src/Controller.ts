import { View } from './View';
import { DancingLinks } from './DancingLinks';
import { ExactCoverMatrix } from './ExactCoverMatrix';

export class Controller {
    private view: View;
    private dlx: DancingLinks;
    private isSolved: boolean = false;

    constructor(view: View) {
        this.view = view;
        this.dlx = new DancingLinks(new ExactCoverMatrix());
        this.view.getButton().addEventListener('click', () => this.handleButtonClick());
    }

    private handleButtonClick(): void {
        if (this.isSolved) {
            this.handleReset();
        } else {
            this.handleSolve();
        }
    }

    private handleSolve(): void {
        const startTime = performance.now();

        const cells = this.view.getCells();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const text = cells[i][j].value;
                if (text.length > 0) {
                    this.dlx.setAssignment(i, j, parseInt(text, 10));
                }
            }
        }

        const solution = this.dlx.solve();
        const elapsedTime = performance.now() - startTime;

        this.view.setAllCells(solution);

        if (solution !== null) {
            this.view.displayMessage(`Solved in ${(elapsedTime / 1000).toFixed(9)} seconds`);
        } else {
            this.view.displayMessage('No solution exists');
        }

        const button = this.view.getButton();
        button.textContent = 'R E S E T';
        this.isSolved = true;
    }

    private handleReset(): void {
        // Create new DLX instance for fresh solve
        this.dlx = new DancingLinks(new ExactCoverMatrix());

        this.view.resetCells();
        const button = this.view.getButton();
        button.textContent = 'S O L V E';
        this.isSolved = false;
    }
}
