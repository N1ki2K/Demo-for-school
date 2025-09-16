(function(Eventgallery, jQuery){


    /**
     * The Scale Price Editor Class
     *
     * @param inputElement a HTML input box
     * @constructor
     */
    Eventgallery.ScalePriceEditor = function(inputElement) {

        var initData;

        try {
            initData = JSON.parse(inputElement.value);
        } catch(ex) {

        }

        this.$inputElement = jQuery(inputElement);

        if (this.$inputElement.data('hasScalePriceEditor') !== undefined) {
            return;
        } else {
            this.$inputElement.data('hasScalePriceEditor', this);
        }

        this.$containerElement = null;
        this.lines = [];
        this.initialize();

        if (Array.isArray(initData)) {
            for (var i=0; i<initData.length; i++) {
                var line = initData[i];
                this.addLine(line.quantity, line.price );
            }
        }

        if (this.lines.length === 0) {
        //    this.addLine(2, 0);
        }

    };

    Eventgallery.ScalePriceEditor.prototype.initialize = function() {

        this.$inputElement.attr('type', 'hidden');
        this.$containerElement = jQuery('<div class="scale-price-editor-container"></div>');
        this.$controllsElement = jQuery('<div class="scale-price-editor-controlls"></div>');
        this.$linesElement = jQuery('<div class="scale-price-editor-lines"></div>');
        this.$buttonAddLine = jQuery('<button class="btn btn-success">+</button>');

        this.$buttonAddLine.on('click', jQuery.proxy(function(e){
            e.preventDefault();
            this.addLine(2,0);
        }, this));

        this.$controllsElement.append(this.$buttonAddLine);
        this.$containerElement.append(this.$linesElement).append(this.$controllsElement);

        this.$containerElement.insertAfter(this.$inputElement);
    };

    /**
     * add a new line
     */
    Eventgallery.ScalePriceEditor.prototype.addLine = function(quantity, price) {
        var line;
        line = new Eventgallery.ScalePriceEditorLine(this, quantity, price);
        this.lines.push(line);
        this.$linesElement.append(line.$lineElement);
        this.update();
    };

    /**
     * remove a line
     * @param line Eventgallery.ScalePriceEditorLine
     */
    Eventgallery.ScalePriceEditor.prototype.removeLine = function(line) {
        var index = this.lines.indexOf(line);
        this.lines.splice(index, 1);
        this.update();
    };

    /**
     * contains the update logic including ther serialization
     */
    Eventgallery.ScalePriceEditor.prototype.update = function() {
        var serializedOutput = [];
        this.sortLines();

        for(var i=0; i<this.lines.length; i++) {
            var line = this.lines[i],
                lineData = {'quantity': line.quantity, 'price': line.price};
            serializedOutput.push(lineData);
        }

        this.$inputElement.attr('value', JSON.stringify(serializedOutput));
    };

    /**
     * sort the lines by quantity
     */
    Eventgallery.ScalePriceEditor.prototype.sortLines = function() {

        this.$linesElement.find('.' + Eventgallery.ScalePriceEditorLine.lineCssClass).sort(function (a, b) {
            return jQuery(a).data('line').quantity - jQuery(b).data('line').quantity;
        }).appendTo(this.$linesElement);
    };

    /**
     * A line object. Responsible for managing a single line in a scale price editor.
     *
     * @param scalePriceEditor Eventgallery.ScalePriceEditor
     * @param quantity int
     * @param price float
     * @constructor
     */
    Eventgallery.ScalePriceEditorLine = function(scalePriceEditor, quantity, price) {
        this.scalePriceEditor = scalePriceEditor;

        this.quantity = quantity;
        this.price = price;

        if (this.quantity === undefined) {
            this.quantity = 1;
        }

        if (this.price === undefined) {
            this.price = 0;
        }

        this.$lineElement = null;

        this.initialze();

    };

    Eventgallery.ScalePriceEditorLine.lineCssClass = 'scale-price-editor-line';
    /**
     * create the UI for a line
     */
    Eventgallery.ScalePriceEditorLine.prototype.initialze = function()  {
        this.$lineElement = jQuery('<div class="row-fluid input-append ' + Eventgallery.ScalePriceEditorLine.lineCssClass + '"></div>');

        this.$lineElement.data('line', this);

        this.$quantityInputElement = jQuery('<span class="add-on">Quanity</span><input class="span1" type="number" min="2" value="' + this.quantity + '">');
        this.$quantityInputElement.on('blur', jQuery.proxy(function(e){
            this.quantity = e.target.value;
            this.update();
        }, this));

        this.$priceInputElement = jQuery('<span class="add-on">Price</span><input class="span1" type="text" value="' + this.price + '">');
        this.$priceInputElement.on('blur', jQuery.proxy(function(e){
            this.price =  e.target.value;
            this.update();
        }, this));

        this.$buttonRemoveLine = jQuery('<button class="btn btn-danger">-</button>');
        this.$buttonRemoveLine.on('click', jQuery.proxy(function(e) {
            e.preventDefault();
            this.remove();
        }, this));

        this.$lineElement.append(this.$quantityInputElement).append(this.$priceInputElement).append(this.$buttonRemoveLine);
    };

    /**
     * remove this line
     */
    Eventgallery.ScalePriceEditorLine.prototype.remove = function()  {
        if (this.scalePriceEditor.lines.length>0) {
            this.$lineElement.remove();
            this.scalePriceEditor.removeLine(this);
        }
    };

    /**
     * update this line.
     */
    Eventgallery.ScalePriceEditorLine.prototype.update = function()  {
        this.scalePriceEditor.update();
    };

})(Eventgallery, Eventgallery.jQuery);;