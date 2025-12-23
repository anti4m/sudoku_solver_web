package SudokuSolver;

import javafx.scene.control.TextField;
import javafx.scene.control.TextFormatter;
import javafx.util.StringConverter;

import java.util.function.UnaryOperator;

public class InputFormatter {
    private final StringConverter<Integer> stringConverter;

    public InputFormatter() {
        stringConverter = new StringConverter<>() {
            @Override
            public String toString(Integer integer) {
                if (integer == null || integer.intValue() <= 0 || integer.intValue() > 9) return "";
                else return integer.toString();
            }

            @Override
            public Integer fromString(String string) {
                if (string == null || string.isEmpty()) return 0;
                else return Integer.parseInt(string);
            }
        };
    }

    // If input is a single digit or empty, replace current text.
    public void setFormat(TextField textField) {
        UnaryOperator<TextFormatter.Change> textFilter = input -> {
            if (input.getText().matches("[1-9]")) {
                input.setRange(0, textField.getText().length());
                return input;
            } else if (input.getText().isEmpty()) return input;
            else return null;
        };

        textField.setTextFormatter(new TextFormatter<>(stringConverter, 0, textFilter));
    }
}
