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

$subCategories = $this->category->getChildren();

?>

<?php IF (isset($this->category)): ?>
    <?php IF ($this->category->id != 0):?><h1 class="eventgallery-category-headline"><?php echo $this->escape(EventgalleryHelpersCategories::getCategoryTitle($this->category)); ?></h1><?php ENDIF ?>

    <p class="eventgallery-category-content"><?php echo JHtml::_('content.prepare', EventgalleryHelpersCategories::getCategoryDescription($this->category), '', 'com_eventgallery.category'); ?></p>

    <?php IF (count($subCategories)>0): ?>
        <h2 class="eventgallery-subcategories"><?php echo JText::_('COM_EVENTGALLERY_EVENTS_SUBCATEGORIES');?></h2>
        <ul class="nav eventgallery-subcategories-list">
            <?php foreach($subCategories as $subCategory): ?>
                <li>
                    <a href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=categories&catid='.$subCategory->id) ?>" >
                        <?php echo $this->escape(EventgalleryHelpersCategories::getCategoryTitle($subCategory)); ?><?php if($this->params->get('show_items_per_category_count', 0)==1): ?>
                            (<?php if($this->params->get('show_items_per_category_count_recursive', 0)==1): ?><?php echo $subCategory->getNumItems(true); ?><?php ELSE: ?><?php echo $subCategory->getNumItems(false); ?><?php ENDIF; ?>)
                        <?php endif; ?>
                    </a>
                </li>
            <?php ENDFOREACH ?>
        </ul>
    <?php ENDIF; ?>
<?php ENDIF; ?>