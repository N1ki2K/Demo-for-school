<?php // no direct access
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die('Restricted access'); ?>

<?php IF (!isset($GLOBALS['eventgallery_social_stuff_loaded']) && $this->params->get('use_social_sharing_button', 0)==1):?>
<?php $GLOBALS['eventgallery_social_stuff_loaded'] = true; ?>
  <?php IF ($this->params->get('use_social_sharing_facebook', 0)==1):?>         
    <div id="fb-root"></div>
    <script>
      if (window.fbAsyncInit == undefined) {
        window.fbAsyncInit = function() {
          // init the FB JS SDK
          FB.init({
            appId      : '<?php echo $this->params->get('social_sharing_facebook_appid', 'missingAppId') ?>',                        // App ID from the app dashboard
            //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel file for x-domain comms
            status     : true,                                 // Check Facebook Login status
            xfbml      : false,                                  // Look for social plugins on the page
            version    : 'v2.8'
            
          });

          // Additional initialization code such as adding Event Listeners goes here
        };

        // Load the SDK asynchronously
        (function(d, s, id){
           var js, fjs = d.getElementsByTagName(s)[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement(s); js.id = id;
           js.src = "//connect.facebook.net/en_US/sdk.js";
           fjs.parentNode.insertBefore(js, fjs);
         }(document, 'script', 'facebook-jssdk'));
      }
    </script>
  <?php ENDIF ?>

<?php ENDIF ?>
