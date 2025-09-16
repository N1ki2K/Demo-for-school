<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

$app = JFactory::getApplication();

JHtml::_('behavior.tooltip');

$this->form = $this->get('ImageContentPluginButtonForm');

$script  = '

    function insertImageContentTag() {
    
        var tag = jQuery(\'#imagetagfield\').html();
    
        window.parent.jInsertEditorText(tag, \''.$this->escape($app->input->getString('e_name')).'\')
        window.parent.SqueezeBox.close()
        return false;
    }

';

JFactory::getDocument()->addScriptDeclaration($script);
?>

<section id="imageselector">
</section>

<section id="imagetag">
    <?php echo $this->loadSnippet('formfields'); ?>

    <pre><span id="imagetagfield"></span></pre>

    <p>
        <button class="btn btn-primary" onclick="insertImageContentTag();"><?php echo JText::_('COM_EVENTGALLERY_CONTENTPLUGINBUTTON_BUTTON_INSERT'); ?></button>
    </p>

</section>


    <style>
        legend {
            display: none;
        }

        #imageselector {
            display: flex;
            flex-flow: row wrap;
            width: 98%;
        }

        #main {
            width: 250px;
            margin-right: 20px;
        }

        .files {
            flex: 1;
        }

        #files {
            width: 100%;
            display: flex;
            flex-flow: row wrap;
            list-style: none;
            padding: 0;
        }
        #files li {
            display: block;
            box-sizing: border-box;
            width: 25%;
            flex-grow: 1;
            padding: 10px;
            border: 1px solid silver;
        }

        #files li img {
            width: 100%;
        }


    </style>



<!-- ========= -->
<!-- Libraries -->
<!-- ========= -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js" type="text/javascript"></script>

<script type="text/template" id="folder-template">
    <div class="folder">
        <label><%- name %></label>
    </div>
</script>

<script type="text/template" id="file-template">
    <label><%- file %></label><br>
    <a href="#"><img src="<%- thumb  %>"></a>
</script>

<script type="text/template" id="selectimage-template">
    <section id="main">
        <ul id="folders"></ul>
    </section>
    <section class="files">
        <ul id="files"></ul>
    </section>
</script>

<!-- =============== -->
<!-- Javascript code -->
<!-- =============== -->
<script type="text/javascript">


    var PubSub = function () {
        this.events = _.extend({}, Backbone.Events);
    };
    var pubSub = new PubSub();

    var app = {
        initialize : function() {

            app.views = {
                imageTagView : new app.ImageTagView(),
                imageSelectorView : new app.ImageSelectorView()
            };

            _.each(app.views, function(view) {
                view.$el.hide();
            })
        },

        showView : function(view){
            if(app.views.current !== undefined){
                $(app.views.current.el).hide();
            }
            app.views.current = view;
            $(app.views.current.el).show();
        }
    }; // create namespace for our app

    app.ImageTag = Backbone.Model.extend({
        defaults: {
            mode: 'raw',
            folder: '',
            file: '',
            cssclass: '',
            attr: 'image',
            crop: true,
            thumb_width: 100
        }
    });

    app.imageTagModel = new app.ImageTag();

    app.ImageTagView = Backbone.View.extend({
        el: '#imagetag',
        model: app.imageTagModel,

        $input_folder : jQuery('#jform_folder'),
        $input_file: jQuery('#jform_file'),
        $input_mode: jQuery('#jform_image_mode'),
        $input_attr: jQuery('#jform_attr'),
        $input_crop: jQuery('#jform_image_crop'),
        $input_cssclass: jQuery('#jform_cssclass'),
        $input_width: jQuery('#jform_image_width'),
        $input_imagetag: jQuery('#imagetagfield'),

        initialize: function() {
            this.model.on("change", this.render, this);

            this.$input_mode.on("change", $.proxy( this.render, this ));
            this.$input_attr.on("change", $.proxy( this.render, this ));
            this.$input_crop.on("change", $.proxy( this.render, this ));
            this.$input_cssclass.on("change", $.proxy( this.render, this ));
            this.$input_width.on("change", $.proxy( this.render, this ));

            this.render();
        },
        events: {

        },
        render: function () {
            this.$input_folder.val(this.model.get('folder'));
            this.$input_file.val(this.model.get('file'));

            var event = this.$input_folder.val(),
                file = this.$input_file.val(),
                mode = this.$input_mode.val(),
                attr = this.$input_attr.val(),
                crop = this.$input_crop.val(),
                cssclass = this.$input_cssclass.val(),
                width = this.$input_width.val(),
                tag = "";

            tag = "{eventgallery-image ";
            tag = tag + "event='" + event +"' ";
            tag = tag + "file='" + file +"' ";
            tag = tag + "attr='"+ attr +"' ";

            if (attr === "image") {
                tag = tag + "mode='"+ mode +"' ";
                tag = tag + "crop='"+ crop +"' ";
                tag = tag + "thumb_width='"+ width + "' ";
                tag = tag + "cssclass='"+ cssclass + "' ";
            }

            tag = tag + "}";

            this.$input_imagetag.html(tag);

            return this; // enable chained calls
        }
    });

    app.Folder = Backbone.Model.extend({
        defaults: {
            id: '',
            folder: '',
            published: false
        }
    });

    app.File = Backbone.Model.extend({
        defaults: {
            id: '',
            folder: '',
            file:'',
            thumb:'',
            published: false
        }
    });


    app.Folders = Backbone.Collection.extend({
        model: app.Folder,
        url: ''
    });

    app.Files = Backbone.Collection.extend({
        model: app.File,
        url: ''
    });

    app.FolderView = Backbone.View.extend({
        tagName: 'li',
        model: app.Folder,
        template: _.template($('#folder-template').html()),
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this; // enable chained calls
        },
        events: {
            'click label': 'selectFolder'
        },
        initialize: function () {
        },
        selectFolder: function() {
            app.files.fetch({
                url: "<?php echo JRoute::_('index.php?option=com_eventgallery&task=rest.files&format=raw', false);?>&folder=" + this.model.get('folder'),
            });
        }
    });

    app.FileView = Backbone.View.extend({
        tagName: 'li',
        model: app.File,
        template: _.template($('#file-template').html()),
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this; // enable chained calls
        },
        events: {
            'click': 'selectImage'
        },
        initialize: function () {
        },
        selectImage: function() {
            app.imageTagModel.set({'file': this.model.get("file"), 'folder': this.model.get("folder")});
            pubSub.events.trigger('file:selected', this.model);
        }
    });

    app.ImageSelectorView = Backbone.View.extend({
        el: '#imageselector',

        template: _.template($('#selectimage-template').html()),

        initialize: function () {
            app.folders = new app.Folders();
            app.files = new app.Files();
            // when new elements are added to the collection render then with addOne

            app.folders.on('add', this.addOne, this);
            app.folders.on('reset', this.addAll, this);

            app.files.on('add', this.addFile, this);
            app.files.on('reset', this.resetFiles, this);

            app.folders.fetch({
                url: "<?php echo JRoute::_('index.php?option=com_eventgallery&task=rest.folders&format=raw', false);?>",
                reset: true
            });

            this.render();
        },

        events: {

        },

        render: function () {
            this.$el.html(this.template());
            return this; // enable chained calls
        },

        addOne: function(folder){
            var view = new app.FolderView({model: folder});
            $('#folders').append(view.render().el);
        },
        addAll: function(){
            this.$('#folder').html(''); // clean the todo list
            app.folders.each(this.addOne, this);
        },
        addFile: function(file) {
            var view = new app.FileView({model: file});
            $('#files').append(view.render().el);
        },
        resetFiles: function() {
            this.$('#files').html(''); // clean the todo list
            app.files.each(this.addFile, this);
        }

    });

    app.initialize();

    jQuery('#jform_myspacer-lbl').parent().on('click', function() {app.showView(app.views.imageSelectorView);});
    pubSub.events.on('file:selected', function(model) {app.showView(app.views.imageTagView);});

    app.showView(app.views.imageTagView);

</script>
