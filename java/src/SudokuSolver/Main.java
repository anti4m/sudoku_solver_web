package SudokuSolver;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage primaryStage) {
        View view = new View(90);
        Controller controller = new Controller(view);

        Scene scene = new Scene(view, 1000, 1000);

        primaryStage.setScene(scene);
        primaryStage.setTitle("SUDOKU SOLVER");
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
