function UKFoodAttitudes() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'UK Food Attitudes 2018';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'uk-food-attitudes';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        var self = this;
        this.data = loadTable(
            './data/food/UK-food-stats.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });
    };

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Create a select DOM element.
        // this.select = // ???
        this.select = createSelect();

        // Set select position.
        // ???
        this.select.position(400, 520);

        // Fill the options with all company names.
        // ???

        // columns method returns an array of the csv header section 
        var questions = this.data.columns;
        // console.log(questions);
        for (var i = 0; i < this.data.getColumnCount(); i++) {

            this.select.option(questions[i + 1]);
        }

    };


    this.destroy = function () {
        this.select.remove();
    };

    // Create a new pie chart object.
    this.pie = new PieChart(width / 2, height / 2, width * 0.4);

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Get the value of the company we're interested in from the
        // select item.
        // Use a temporary hard-code example for now.
        var questionType = this.select.value();

        // Get the column of raw data for questionType.
        var col = this.data.getColumn(questionType);

        // Convert all data strings to numbers.
        col = stringsToNumbers(col);

        // Copy the row labels from the table (the first item of each row).
        var labels = this.data.getColumn(0);

        // Colour to use for each category.
        var colours = ['#90EE90',
                       'green',
                       'yellow',
                       'orange',
                       'red'];

        // Make a title.
        var title = 'Question: ' + questionType;

        // Draw the pie chart!
        this.pie.draw(col, labels, colours, title);
    };
}