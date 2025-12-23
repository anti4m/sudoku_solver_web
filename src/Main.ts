import { View } from './View';
import { Controller } from './Controller';

function main(): void {
    const view = new View(90);
    new Controller(view);

    const app = document.getElementById('app');
    if (app) {
        app.appendChild(view.getContainer());
    }

    document.title = 'SUDOKU SOLVER';
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
