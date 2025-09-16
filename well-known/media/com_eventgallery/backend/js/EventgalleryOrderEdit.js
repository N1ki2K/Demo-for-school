(function(jQuery){
    "use strict";
    jQuery( document ).ready(function() {
        /***********
         * Order Ajax edit feature
         *
         * BEGIN
         */
        jQuery(document).off('click', '.ordercontent').on('click', '.ordercontent', function(e) {
            var currentContainer = jQuery(e.target).closest('div[data-id]');

            e.preventDefault();

            currentContainer.html('Loading.. ');

            jQuery.ajax({
                url: currentContainer.data('editlink')
            }).done(function(data ) {
                currentContainer.html(data);
                console.log('loaded');
            });
        });

        jQuery(document).off('click', '.saveOrderContent').on('click', '.saveOrderContent', function(e) {
            var id = jQuery(e.target).data('id'),
                $form = jQuery(e.target).closest('form'),
                currentContainer = jQuery('div[data-id="' + id + '"]'),
                url = $form.attr('action'),
                task = jQuery(e.target).data('task');

            e.preventDefault();
            e.stopPropagation();
            $form.find('input[name="task"]').attr('value', task);

            jQuery.post( url, $form.serialize() ).done(function(data ) {
                currentContainer.html(data);
            });
            console.log('saved');
        });

        jQuery(document).off('click', '.closeOrderContent').on('click', '.closeOrderContent', function(e) {

            var id = jQuery(e.target).data('id'),
                currentContainer = jQuery('div[data-id="' + id + '"]'),
                url = jQuery(e.target).data('href');

            e.preventDefault();
            e.stopPropagation();

            console.log('try to close now');
            currentContainer.html('Loading.. ');

            jQuery.ajax({
                url: url
            }).done(function(data ) {
                currentContainer.html(data);
                console.log('closed');
            });
        });

        /***********
         * Order Ajax edit feature
         *
         * END
         */

    }); //end domready
})(Eventgallery.jQuery);;