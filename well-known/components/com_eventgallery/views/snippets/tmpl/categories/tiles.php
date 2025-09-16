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
<?php IF (isset($this->category)): ?>
    <?php IF ($this->category->id != 0):?><h1 class="eventgallery-category-headline"><?php echo $this->escape(EventgalleryHelpersCategories::getCategoryTitle($this->category)); ?></h1><?php ENDIF ?>

    <p class="eventgallery-category-content"><?php echo JHtml::_('content.prepare', EventgalleryHelpersCategories::getCategoryDescription($this->category), '', 'com_eventgallery.category'); ?></p>
 
    <?php IF (count($this->subCategories)>0): ?>
        <div class="eventgallery-subcategories">
        <h2><?php echo JText::_('COM_EVENTGALLERY_EVENTS_SUBCATEGORIES');?></h2>


            <div class="eventgallery-events-gridlist">
                <?php foreach($this->subCategories as $subCategory): ?>

                    <?php $this->subCategory = $subCategory; echo $this->loadSnippet('categories/tiles_item'); ?>

                <?php ENDFOREACH ?>
                <div style="clear:both"></div>
            </div>

        </div>
    <?php ENDIF; ?>
<?php ENDIF; ?>
