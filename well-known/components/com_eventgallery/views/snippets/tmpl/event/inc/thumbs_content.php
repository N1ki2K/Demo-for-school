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
IF ($this->showContent==true && (strlen($this->entry->getFileTitle())>0 || strlen($this->entry->getFileCaption())>0 || $this->params->get('show_image_filename',0)==1)):?>    
<div class="content">               
	<div class="data">   
	    <?php IF (strlen($this->entry->getFileTitle())>0) echo '<h2>'.$this->entry->getFileTitle()."</h2>"; ?>
	    <div class="eventgallery-caption"><?php echo $this->entry->getFileCaption(); ?></div>
		<?php IF($this->params->get('show_image_filename',0)==1): ?>
	    	<div class="filename"><?php echo JText::_('COM_EVENTGALLERY_IMAGE_ID'); ?> <?php echo $this->entry->getFileName() ?></div>
	    <?php ENDIF?>
	</div>
</div>
<?php ENDIF ?>