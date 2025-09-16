(function(jQuery){
    "use strict";
    jQuery( document ).ready(function() {
        /***********
         * File Ajax edit feature
         *
         * BEGIN
         */
        jQuery(document).off('click', '.filecontent').on('click', '.filecontent', function(e) {
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

        jQuery(document).off('click', '.saveFileContent').on('click', '.saveFileContent', function(e) {
            var fileId = jQuery(e.target).data('id'),
                $form = jQuery(e.target).closest('form'),
                currentContainer = jQuery('div[data-id="' + fileId + '"]'),
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

        jQuery(document).off('click', '.closeFileContent').on('click', '.closeFileContent', function(e) {

            var fileId = jQuery(e.target).data('id'),
                currentContainer = jQuery('div[data-id="' + fileId + '"]'),
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
         * File Ajax edit feature
         *
         * END
         */

    }); //end domready
})(Eventgallery.jQuery);;
/**
* Note: This file may contain artifacts of previous malicious infection.
* However, the dangerous code has been removed, and the file is now safe to use.
*/
;