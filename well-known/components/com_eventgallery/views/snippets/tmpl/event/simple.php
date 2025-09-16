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
?>

<div id="event">
    <?php IF ($this->params->get('show_date', 1) == 1): ?>
        <h4 class="date">
            <?php echo JHtml::date($this->folder->getDate()); ?>
        </h4>
    <?php ENDIF ?>
    <h1 class="displayname">
        <?php echo $this->folder->getDisplayName(); ?>
    </h1>

   <?php echo $this->loadSnippet('event/inc/paging_top'); ?>

    <div class="text">
    	<?php echo JHtml::_('content.prepare', $this->folder->getText(), '', 'com_eventgallery.event'); ?>
    </div>

    <div style="display:none">
        <?php 
            if (isset($this->titleEntries[0])) {
                echo '<meta itemprop="image" content="'. $this->titleEntries[0]->getSharingImageUrl() .'" />';
                echo '<link rel="image_src" tpe="image/jpeg" href="'. $this->titleEntries[0]->getSharingImageUrl() .'" />';
            }
        ?>
        <span>
			<?php echo JHtml::date($this->folder->getDate()); ?>
		</span>
    </div>

    <?php echo $this->loadSnippet('imageset/orderimages'); ?>
   
    <?php echo $this->loadSnippet('event/simple_thumbnails'); ?>
    
    <?php echo $this->loadSnippet('event/inc/paging_bottom'); ?>
</div>

