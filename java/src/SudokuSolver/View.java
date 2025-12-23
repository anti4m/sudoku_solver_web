package SudokuSolver;

import javafx.geometry.HPos;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;

import javafx.scene.control.TextField;
import javafx.scene.text.Font;

public class View extends GridPane {
    public static final int BOARD_WIDTH = 9;
    private static final String STYLE = "-fx-background-color: #32a871; -fx-font-size: 36; -fx-text-fill: #FFFFFF;";
    private TextField[][] cells;
    private GridPane[][] unitBoxes;
    private Button button;
    private Label message;

    public View(int cellWidth) {
        setAlignment(Pos.CENTER);
        setHgap(15);
        setVgap(15);
        setPadding(new Insets(25, 25, 25, 25));

        // Add 3x3 unit boxes each composed of 3x3 cells
        unitBoxes = new GridPane[3][3];
        for (int i = 0; i < 3; ++i) {
            for (int j = 0; j < 3; ++j) {
                unitBoxes[i][j] = new GridPane();
                unitBoxes[i][j].setHgap(5);
                unitBoxes[i][j].setVgap(5);
                unitBoxes[i][j].setAlignment(Pos.CENTER);
                add(unitBoxes[i][j], j, i); // Array is row, column but GridPane is column, row.
            }
        }

        // Add cells to unit boxes
        cells = new TextField[BOARD_WIDTH][BOARD_WIDTH];
        InputFormatter formatter = new InputFormatter();
        for (int i = 0; i < 9; ++i) {
            for (int j = 0; j < 9; ++j) {
                cells[i][j] = createTextField(cellWidth, formatter);
                unitBoxes[i/3][j/3].add(cells[i][j], j % 3, i % 3);
            }
        }

        // Solve / Reset button
        button = createButton(cellWidth * 3, 60,"S O L V E");
        add(button, 1, 3);
        setHalignment(button, HPos.CENTER);

        // Message displayed after button press
        message = new Label();
        message.setFont(new Font("Arial", 17));
        add(message, 1, 4, 1, 1);
        setHalignment(message, HPos.CENTER);

    }

    public Button getButton() {
        return button;
    }

    public TextField[][] getCells() {
        return cells;
    }

    public void setAllCells(int[][] boardArray) {
        if (boardArray != null) {
            for (int i = 0; i < cells.length; ++i) {
                for (int j = 0; j < cells[0].length; ++j) {
                    cells[i][j].setText(Integer.toString(boardArray[i][j]));
                }
            }
        }

        disableAllCells();
    }

    public void disableAllCells() {
        for (int i = 0; i < cells.length; ++i) {
            for (int j = 0; j < cells[0].length; ++j) {
                cells[i][j].setDisable(true);
                cells[i][j].setOpacity(1);
            }
        }
    }

    // Clear and re-enable all cells
    public void resetCells() {
        for (int i = 0; i < cells.length; ++i) {
            for (int j = 0; j < cells[0].length; ++j) {
                cells[i][j].setText("");
                cells[i][j].setDisable(false);
            }
        }
        message.setText("");
    }

    public void displayMessage(String s) {
        message.setText(s);
    }

    private TextField createTextField(int width, InputFormatter formatter) {
        TextField textField = new TextField();
        textField.setPrefHeight(width);
        textField.setPrefWidth(width);
        textField.setAlignment(Pos.CENTER);
        textField.setStyle(STYLE + "-fx-font-weight: bold;");
        formatter.setFormat(textField);

        return textField;
    }

    private Button createButton(int width, int height, String name) {
        Button button = new Button(name);
        button.setPrefWidth(width);
        button.setPrefHeight(height);
        button.setStyle(STYLE);

        return button;
    }
}
