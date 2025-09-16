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

<div class="cart-items">

        <?php foreach ($this->lineitemcontainer->getLineItems() as $lineitem) :
            /** @var EventgalleryLibraryImagelineitem $lineitem */
             ?>

                <div class="row-fluid">
                    <div class="span2 image">
                        <?php echo $lineitem->getCartThumb(); ?>
                    </div>
               
                    <span class="span1 price">
                        <?php echo $lineitem->getPrice(); ?>
                    </span>
                
                    <div class="span9 information">
                        <span class="folder"><?php echo $this->escape($lineitem->getFolderName()); ?></span>
                        <span class="file"><?php echo $this->escape($lineitem->getFileName()); ?></span>
                        <span class="quantity"><?php echo JText::_('COM_EVENTGALLERY_ORDER_QUANTITY') ?>: <?php echo $lineitem->getQuantity() ?></span>
                        <?php IF (strlen($lineitem->getBuyerNote())>0): ?>
                        <p class="buyernote"><blockquote><?php echo nl2br($this->escape($lineitem->getBuyerNote())); ?></blockquote></p>
                        <?php ENDIF; ?>
                        <p class="imagetype-details"> 
                            <?php IF ($lineitem->getImageType()): ?>
                                <span class="displayname"><?php echo $lineitem->getImageType()->getDisplayName() ?></span>
                                <span class="description"><?php echo $lineitem->getImageType()->getDescription() ?></span>
                                <span class="singleprice"><?php echo JText::sprintf('COM_EVENTGALLERY_ORDER_PRICE_PER_ITEM_WITH_PLACEHOLDER', $lineitem->getImageType()->getPrice()) ?></span>
                            <?php ENDIF ?>
                        </p>
                    </div>
                </div>

        <?php endforeach ?>
</div>
