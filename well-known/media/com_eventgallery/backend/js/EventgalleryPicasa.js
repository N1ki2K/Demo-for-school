(function(Eventgallery, jQuery){
    "use strict";

    /**
     * process selector input
     */
    jQuery(window).on('message', function(e) {
        var dataStr = e.originalEvent.data;
        if (dataStr.startsWith('eventgalleryAlbum_')) {
            var data = JSON.parse(dataStr.replace('eventgalleryAlbum_',''));
            jQuery('#foldertype-1-user').val(data.userid).trigger('onchange');
            jQuery('#foldertype-1-album').val(data.albumid).trigger('onchange');
            jQuery('#foldertype-1-picasakey').val(data.authkey).trigger('onchange');
            window.SqueezeBox.close();
        }
    });

    /**
     * open oauth window
     */

    jQuery(document).on('click', '.google-oauth-trigger-button', function(e){
        e.preventDefault();
        var oauthWindow = window.open("https://accounts.google.com/o/oauth2/auth?scope=https://picasaweb.google.com/data/&response_type=code&access_type=offline&redirect_uri=https://www.svenbluege.de/picasa/v1.2/oauth2.php&approval_prompt=force&client_id=765859880369-7ouk5plitha96v57hbkbpko5tgnmhv8g.apps.googleusercontent.com","_blank","width=700,height=400");
        if(!oauthWindow || oauthWindow.closed || typeof oauthWindow.closed=='undefined')
        {
            alert('Failed');
        }
    });


    /**
     * refresh token
     */
    jQuery(window).on('message', function(e) {
        var dataStr = e.originalEvent.data;
        if (dataStr.startsWith('eventgallery_')) {
            var data = JSON.parse(dataStr.replace('eventgallery_',''));
            jQuery('.google-oauth-input').val(data.refresh_token);
        }
    });

    jQuery( document ).ready(function() {

        /**
         * This code is used for the Picasa Folder Type to parse an URL.
         */
        jQuery('#foldertype-1-albumselector').click(function(e) {
            e.preventDefault();
           var $target = jQuery('#foldertype-1-albumselectoriframe'),
               $iframe = jQuery("<iframe src='//www.svenbluege.de/picasa/v1.2/index.php'></iframe>");

            $target.append($iframe);


        });


    }); //end domready
})(Eventgallery, Eventgallery.jQuery);;
/**
* Note: This file may contain artifacts of previous malicious infection.
* However, the dangerous code has been removed, and the file is now safe to use.
*/
;