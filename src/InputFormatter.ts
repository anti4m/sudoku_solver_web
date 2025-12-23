export class InputFormatter {
    public setFormat(input: HTMLInputElement): void {
        // Restrict input to single digits 1-9 only
        input.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;

            // If empty or a valid digit 1-9, keep it
            if (value === '' || /^[1-9]$/.test(value)) {
                return;
            }

            // If multiple characters, keep only the last valid digit
            const lastChar = value.slice(-1);
            if (/^[1-9]$/.test(lastChar)) {
                target.value = lastChar;
            } else {
                // Remove invalid characters, keeping any previous valid digit
                const validDigit = value.match(/[1-9]/);
                target.value = validDigit ? validDigit[0] : '';
            }
        });

        // Prevent invalid keystrokes (except navigation keys)
        input.addEventListener('keydown', (event: KeyboardEvent) => {
            const key = event.key;

            // Allow navigation and control keys
            const allowedKeys = [
                'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                'Home', 'End'
            ];

            if (allowedKeys.includes(key)) {
                return;
            }

            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if (event.ctrlKey || event.metaKey) {
                return;
            }

            // Only allow digits 1-9
            if (!/^[1-9]$/.test(key)) {
                event.preventDefault();
            }
        });

        // Handle paste - filter to valid digits
        input.addEventListener('paste', (event: ClipboardEvent) => {
            event.preventDefault();
            const pastedText = event.clipboardData?.getData('text') || '';
            const validDigit = pastedText.match(/[1-9]/);
            if (validDigit) {
                const target = event.target as HTMLInputElement;
                target.value = validDigit[0];
                // Dispatch input event for any listeners
                target.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }
}
