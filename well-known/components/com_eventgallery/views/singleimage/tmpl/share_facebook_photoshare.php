<?php 

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// no direct access
defined('_JEXEC') or die('Restricted access'); 

$data = array(
   'picture' => $this->imageurl,
   'message' => ''
   //due to facebook policy this is invalid 'message' => $this->displayname."\n\n".$this->link
);

?>

<a href="#" id="facebook-post-image"><i class="egfa egfa-2x egfa-facebook-square" alt="Facebook" title="Facebook"></i></a>
<script type="text/javascript">
(function(jQuery){
	
	var shareFunction = function(e) {
		e.preventDefault();

		//change the facebook icon
		jQuery('#facebook-post-image img').attr('src','<?php echo JUri::base().'media/com_eventgallery/frontend/images/loading.gif' ?>');

		var wallPost = <?php echo json_encode($data) ?>;

		FB.login(function(response) {
	        if (response.authResponse) {
	            var access_token =   FB.getAuthResponse()['accessToken'];
	            FB.api('/me/photos?access_token='+access_token, 'post', { url: wallPost.picture, message: wallPost.message, access_token: access_token }, function(response) {
	                if (!response || response.error) {
	                    //alert('Error occured: ' + JSON.stringify(response.error));
	                    console.log('Error occured: ' + JSON.stringify(response.error));
	                    console.log('tryed to share ','<?php echo $this->imageurl ?>');
	                  } else {
	                    alert('<?php echo addslashes(JTEXT::_('COM_EVENTGALLERY_SOCIAL_SHARE_IMAGE_SHARED')) ?>');
	                  }
	                jQuery('#facebook-post-image img').attr('src',"<?php echo JUri::base().'media/com_eventgallery/frontend/images/social/32/facebook.png' ?>");
	            });
	        } else {
	            console.log('User cancelled login or did not fully authorize.');
	            console.log(response);
	            jQuery('#facebook-post-image img').attr('src',"<?php echo JUri::base().'media/com_eventgallery/frontend/images/social/32/facebook.png' ?>");
	        }
	    }, {scope: 'publish_actions'});

	};

	jQuery('#facebook-post-image').click(shareFunction);

})(eventgallery.jQuery);
</script>