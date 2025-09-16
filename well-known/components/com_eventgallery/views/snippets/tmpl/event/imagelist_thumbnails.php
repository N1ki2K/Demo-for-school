<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
// no direct access
defined('_JEXEC') or die('Restricted access'); ?>

<div class="eventgallery-thumbnails eventgallery-imagelist thumbnails" 
						data-rowheight="<?php echo $this->params->get('event_image_list_thumbnail_height',150); ?>"
	                    data-rowheightjitter="<?php echo $this->params->get('event_image_list_thumbnail_jitter',50); ?>"
	                    data-firstimagerowheight="<?php echo $this->params->get('event_image_list_thumbnail_first_item_height',2); ?>"
	                    data-dofilllastrow="<?php echo (isset($this->dofilllastrow) && $this->dofilllastrow==true)?"true":"false"; ?>">
    <?php foreach ($this->entries as $entry) : /** @var EventgalleryLibraryFile $entry */ ?>        
     
	        <div class="thumbnail-container">

	            <?php $this->showContent=true; $this->entry=$entry; $this->cssClass="thumbnail"; echo $this->loadSnippet('event/inc/thumb'); ?>	            
	        </div>
        
    <?php endforeach ?>
    <div style="clear: both"></div>
</div>