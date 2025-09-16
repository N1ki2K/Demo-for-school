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
    <table class="table table-hover">
        
        <?php foreach ($this->lineitemcontainer->getLineItems() as $lineitem) :
            /** @var EventgalleryLibraryImagelineitem $lineitem */
             ?>
            <tr class="cart-item">
                <td>
                    <div class="image">
                        <?php echo $lineitem->getCartThumb(); ?>
                    </div>
               
                    <span class="price">
                        <?php echo $lineitem->getPrice(); ?>
                    </span>
                
                    <div class="information">
                       <span class="quantity"><?php echo JText::_('COM_EVENTGALLERY_LINEITEM_QUANTITY') ?>: <?php echo $lineitem->getQuantity() ?></span>
                       <?php IF (strlen($lineitem->getBuyerNote())>0): ?>
                       <p class="buyernote"><blockquote><?php echo nl2br($this->escape($lineitem->getBuyerNote())); ?></blockquote></p>
                       <?php ENDIF; ?>
                        <p class="imagetype-details">
                            <?php IF($lineitem->getImageType() != null): ?>
                                <span class="displayname"><?php echo $lineitem->getImageType()->getDisplayName() ?></span>
                                <span class="description"><?php echo $lineitem->getImageType()->getDescription() ?></span>
                                <span class="singleprice"><?php echo JText::sprintf('COM_EVENTGALLERY_LINEITEM_PRICE_PER_ITEM_WITH_PLACEHOLDER', $lineitem->getSinglePrice()) ?></span>
                            <?php ENDIF; ?>
                        </p>
                    </div>

                    <div style="clear:both;"></div>
                           
                </td>
            </tr>
        <?php endforeach ?>
    </table>
</div>