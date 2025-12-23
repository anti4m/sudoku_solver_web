package SudokuSolver;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;

public class Controller {
    private View view;
    private DancingLinks dlx;

    public Controller(View view) {
        this.view = view;
        dlx = new DancingLinks(new ExactCoverMatrix("ExactCoverMatrix.txt"));
        view.getButton().setOnAction(new ButtonSolveAction());
    }

    class ButtonSolveAction implements EventHandler<ActionEvent> {
        @Override
        public void handle(ActionEvent actionEvent) {
            long startTime = System.nanoTime();

            TextField[][] cells = view.getCells();
            for (int i = 0; i < 9; ++i) {
                for (int j = 0; j < 9; ++j) {
                    String text = cells[i][j].getText();
                    if (text.length() > 0) {
                        dlx.setAssignment(i, j, Integer.parseInt(text)); // Assign the user-chosen cells
                    }
                }
            }

            int[][] solution = dlx.solve();
            long elapsedTime = System.nanoTime() - startTime; // Algorithm running time in nanoseconds

            view.setAllCells(solution); // Solve using dancing links and display
            if (solution != null) {
                view.displayMessage(String.format("Solved in %.9f seconds", (double) elapsedTime / 1_000_000_000));
            } else {
                view.displayMessage("No solution exists");
            }


            Button b = view.getButton();
            b.setText("R E S E T");
            b.setOnAction(new ButtonResetAction());
        }
    }

    class ButtonResetAction implements EventHandler<ActionEvent> {
        @Override
        public void handle(ActionEvent actionEvent) {
            view.resetCells();                      // Reset sudoku board
            Button b = view.getButton();
            b.setText("S O L V E");
            b.setOnAction(new ButtonSolveAction());
        }
    }
}

