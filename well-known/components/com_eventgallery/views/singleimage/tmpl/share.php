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

$this->displayname = $this->model->folder->getDisplayName();
$this->subject = $this->model->folder->getDisplayName()." "; 
if ($this->params->get('social_sharing_link_type', 'singleimage') == 'event') {
	$this->link =  JRoute::_('index.php?option=com_eventgallery&view=event&folder='.$this->model->file->getFolderName(), false, -1);
} else {
	$this->link =  JRoute::_('index.php?option=com_eventgallery&view=singleimage&format=raw&folder='.$this->model->file->getFolderName().'&file='.$this->model->file->getFileName(), false, -1);
}
$this->image = $this->model->file->getImageUrl(500,500, false);
$this->twitter = $this->displayname;


// handle picasa images
$this->imageurl = $this->model->file->getSharingImageUrl();
$this->downloadimageurl = $this->model->file->getOriginalImageUrl();
$this->imagename = $this->model->file->getFileName();



?>
<?php IF ($this->params->get('use_social_sharing_button', 0)==1 && $this->model->folder->getAttribs()->get('use_social_sharing',1)==1):?>			    		
<a href="#" class="social-share-button-close"><i class="egfa egfa-2x egfa-share-alt-square"></i></a>

	<?php IF ($this->params->get('use_social_sharing_facebook', 0)==1 && $this->model->folder->getAttribs()->get('use_social_sharing_facebook',1)==1):?>	

		<?php IF ($this->params->get('use_social_sharing_facebook_type', 'share_dialog') == 'photo_share'): ?>
			<?php echo $this->loadTemplate('facebook_photoshare'); ?>
		<?php ENDIF ?>

		<?php IF ($this->params->get('use_social_sharing_facebook_type', 'share_dialog') == 'feed_dialog'): ?>
			<?php echo $this->loadTemplate('facebook_feeddialog'); ?>
		<?php ENDIF ?>

		<?php IF ($this->params->get('use_social_sharing_facebook_type', 'share_dialog') == 'share_dialog'): ?>
			<?php echo $this->loadTemplate('facebook_sharedialog'); ?>
		<?php ENDIF ?>

	<?php ENDIF ?>

	<?php IF ($this->params->get('use_social_sharing_google', 0)==1 && $this->model->folder->getAttribs()->get('use_social_sharing_google',1)==1):?>			    
		<a href="https://plus.google.com/share?url=<?php echo urlencode($this->link)?>" onclick="window.open(this.href,
		  '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes');return false;"><i alt="Google+" title="Google+" class="egfa egfa-2x egfa-google-plus-square"></i></a>
	<?php ENDIF ?>

	<?php IF ($this->params->get('use_social_sharing_twitter', 0)==1 && $this->model->folder->getAttribs()->get('use_social_sharing_twitter',1)==1):?>			    
		<a href="https://twitter.com/intent/tweet?source=webclient&text=<?php echo $this->twitter?>"
		   onclick="window.open('http://twitter.com/share?url=<?php echo urlencode($this->link)?>&text=<?php echo urlencode($this->twitter)?>', 'twitterwindow', 'height=450, width=550, toolbar=0, location=1, menubar=0, directories=0, scrollbars=auto'); return false;"
		   ><i class="egfa egfa-2x egfa-twitter-square" alt="Twitter" title="Twitter"></i></a>
	<?php ENDIF ?>

	<?php IF ($this->params->get('use_social_sharing_pinterest', 0)==1 && $this->model->folder->getAttribs()->get('use_social_sharing_pinterest', 1)==1):?>			    
		<a href="http://pinterest.com/pin/create/button/?url=<?php echo urlencode($this->link)?>&media=<?php echo urlencode($this->image)?>&description=<?php echo htmlspecialchars($this->displayname, ENT_COMPAT, 'UTF-8')?>"
			onclick="window.open(this.href,
		  '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes');return false;"><i class="egfa egfa-2x egfa-pinterest-square" alt="Pinterest" title="Pinterest"></i></a>
	<?php ENDIF ?>

	<?php IF ($this->params->get('use_social_sharing_email', 0)==1 && $this->model->folder->getAttribs()->get('use_social_sharing_email', 1)==1):?>			    
		<a href="mailto:?subject=<?php echo htmlspecialchars($this->subject, ENT_COMPAT, 'UTF-8') ?>&body=<?php echo urlencode($this->link)?>" onclick=""> <i class="egfa egfa-2x egfa-envelope-square" alt="Mail" title="Mail"></i></a>
	<?php ENDIF ?>

	<?php IF ($this->params->get('use_social_sharing_download', 0)==1 && $this->model->folder->getAttribs()->get('use_social_sharing_download', 1)==1):?>			    
		<a download="<?php echo $this->imagename;?>" href="<?php echo $this->downloadimageurl; ?>" target="_blank" lt="Download" title="Download"><i class="egfa egfa-2x egfa-cloud-download" alt="Download" title="Download"></i></a>
	<?php ENDIF ?>


<?php ENDIF ?>