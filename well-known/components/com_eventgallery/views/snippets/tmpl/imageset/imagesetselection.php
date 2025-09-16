<?php // no direct access
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die('Restricted access');

?>

<?php IF ($this->folder->isCartable()  && $this->params->get('use_cart', '1')==1): ?>

    <div class="imagetypeselection-container">
        <div class="imagetypeselection">
            <p>
                <img style="height: 100px;" src="<?php echo $this->file->getThumbUrl(100, 100);?>">
            </p>

            <?php
            if (count($this->imageset->getImageTypes(true)) == 1) {
                echo $this->loadSnippet('imageset/imageselection/single');
            } else {
                echo $this->loadSnippet('imageset/imageselection/multiple');
            }
            ?>


            <div class="btn-group pull-right">
                <button class="btn btn-primary eventgallery-closeAdd2cart" title="<?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGES_CLOSE_DESCRIPTION') ?>"><?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGES_CLOSE') ?></button>
                <button class="btn btn-default eventgallery-opencart" title=""  data-href="<?php echo JRoute::_("index.php?option=com_eventgallery&view=cart")?>"><i class="egfa egfa-shopping-cart"></i> <?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGES_OPEN_CART') ?></button>
            </div>

            <div class="clearfix"></div>
        </div>
    </div>

<?php ENDIF ?>