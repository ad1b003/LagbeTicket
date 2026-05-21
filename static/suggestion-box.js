class SuggestionBox {
    constructor(options) {
        this.options = options;

        this.inputField = options.inputField;
        this.data = options.data || [];
        this.maxResults = options.maxResults || 5;
        this.delay = options.delay || 200;
        this.suggestionBoxClass = options.suggestionBoxClass || 'suggestion-box';
        this.suggestionsClass = this.options.suggestionsClass || 'chip round';
        this.matchFn = options.matchFn || this.defaultMatch;

        this.suggestionBox = null;
        this.timeout = null;

        this.inputFieldContainer =
            (options.inputFieldContainer && this.inputField.closest(options.inputFieldContainer)) ||
            this.inputField.closest('.field') ||
            this.inputField.parentElement;

        this.init();
    }

    defaultMatch(item, value) {
        return item.toLowerCase().startsWith(value.toLowerCase());
    }

    init() {
        this.inputHandler = () => {
            clearTimeout(this.timeout);

            const value = this.inputField.value;

            if (!value) {
                this.destroyBox();
                return;
            }

            this.timeout = setTimeout(() => {
                this.renderSuggestions(value);
            }, this.delay);
        };

        this.blurHandler = () => {
            setTimeout(() => this.destroyBox(), 250);
        };

        this.inputField.addEventListener('input', this.inputHandler);
        this.inputField.addEventListener('blur', this.blurHandler);
    }

    createBox() {
        if (this.suggestionBox) return;

        this.suggestionBox = document.createElement('div');
        this.suggestionBox.className = this.suggestionBoxClass;

        this.inputFieldContainer.appendChild(this.suggestionBox);
    }

    destroyBox() {
        if (this.suggestionBox) {
            this.suggestionBox.remove();
            this.suggestionBox = null;
        }
    }

    renderSuggestions(value) {
        const matches = this.data
            .filter(item => this.matchFn(item, value))
            .slice(0, this.maxResults);

        if (!matches.length) {
            this.destroyBox();
            return;
        }

        this.createBox();
        this.suggestionBox.innerHTML = '';

        matches.forEach(match => {
            const btn = document.createElement('button');
            btn.className = this.suggestionsClass;

            btn.textContent = match;

            // Use mousedown instead of click (fix blur issue)
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                this.inputField.value = match;
                this.destroyBox();
            });

            this.suggestionBox.appendChild(btn);
        });
    }

    // destroy() {
    //     this.destroyBox();
    //     this.inputField.removeEventListener('input', this.inputHandler);
    //     this.inputField.removeEventListener('blur', this.blurHandler);
    // }
}
