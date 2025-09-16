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


<div class="eventgallery-cart">
    <h1><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_ITEMS_IN_YOUR_CART') ?></h1>
    <?php echo JText::_('COM_EVENTGALLERY_CART_TEXT') ?>
    <form action="<?php echo JRoute::_("index.php?option=com_eventgallery&view=cart&task=updateCart") ?>" method="post"
          class="form-validate form-horizontal cart-form">
        <div class="cart-items">
            <table class="table table-hover">               
                <?php foreach ($this->cart->getLineItems() as $lineitem) :
                    /** @var EventgalleryLibraryImagelineitem $lineitem */ ?>
                    <tr id="row_<?php echo $lineitem->getId() ?>" class="cart-item">
                        <td class="">
                            <div class="image">
                                <?php echo $lineitem->getCartThumb(); ?>
                            </div>
                       
                            <span class="price eventgallery-hide-on-quantity-change">
                                <?php echo $lineitem->getPrice(); ?>
                            </span>
                        
                            <div class="information">
                                <input class="validate-numeric required input-mini eventgallery-quantity" type="number" title="<?php echo JText::_('COM_EVENTGALLERY_LINEITEM_QUANTITY')?>" min="0"
                                       <?php echo $lineitem->getImageType()->getMaxOrderQuantity()==0?"":'max="'.$lineitem->getImageType()->getMaxOrderQuantity().'""'; ?>
                                       name="quantity_<?php echo $lineitem->getId() ?>"
                                       value="<?php echo $lineitem->getQuantity() ?>"/>
                                <select title="<?php echo JText::_('COM_EVENTGALLERY_LINEITEM_IMAGETYPE')?>" class="required imagetype" name="type_<?php echo $lineitem->getId() ?>">
                                    <?php
                                    foreach ($lineitem->getFile()->getFolder()->getImageTypeSet()->getImageTypes(true) as $imageType) {
                                        /** @var EventgalleryLibraryImagetype $imageType */
                                        $selected = $lineitem->getImageType()->getId() == $imageType->getId()
                                            ? 'selected="selected"' : '';
                                        echo '<option ' . $selected . ' value="' . $imageType->getId() . '">'
                                            . JText::sprintf('COM_EVENTGALLERY_LINEITEM_PRICE_PER_ITEM_DROPDOWM', $imageType->getDisplayName(), $imageType->getPrice() ) 
                                            . '</option>';
                                    }
                                    ?>
                                </select>
                                <div class="imagetype-details eventgallery-hide-on-imagetype-change">
                                    <span class="description"><?php echo $lineitem->getImageType()->getDescription() ?></span>
                                    <?php IF( count($lineitem->getImageType()->getScalePrices()) == 0):?>
                                        <span class="singleprice">
                                            <?php echo JText::sprintf('COM_EVENTGALLERY_LINEITEM_PRICE_PER_ITEM_WITH_PLACEHOLDER', $lineitem->getImageType()->getPrice()) ?>
                                        </span>
                                    <?php ELSE: ?>
                                        <p><?php echo JText::sprintf('COM_EVENTGALLERY_LINEITEM_PRICE_SCALEPRICEINFORMATION_LABEL'); ?>
                                        <a href="#" class="scalepriceinformation"><?php echo JText::sprintf('COM_EVENTGALLERY_LINEITEM_PRICE_SCALEPRICEINFORMATION_LINK'); ?></a>
                                        </p>
                                        <div style="display: none;" class="scaleprices">
                                            <?php $this->showstar=false; $this->imagetype = $lineitem->getImageType(); echo $this->loadSnippet('imageset/scaleprice/default');?>
                                        </div>
                                    <?php ENDIF; ?>

                                    <?php IF($lineitem->getImageType()->getFlatPrice()->getAmount()>0): ?>
                                        <p>
                                            <?php echo JText::sprintf('COM_EVENTGALLERY_LINEITEM_FLATPRICE_WITH_PLACEHOLDER', $lineitem->getImageType()->getFlatPrice()) ?>
                                        </p>
                                    <?php ENDIF; ?>

                                </div>


                                <p class="lineitem-actions">
                                    <a class="open-event" href="<?php echo JRoute::_(EventgalleryHelpersRoute::createEventRoute($lineitem->getFile()->getFolder()->getFolderName(), $lineitem->getFile()->getFolder()->getTags(), $lineitem->getFile()->getFolder()->getCategoryId())) ?>"><small><i class="egfa egfa-list-ul"></i> <?php echo JText::_('COM_EVENTGALLERY_LINEITEM_OPEN_EVENT')?></small></a>
                                    <a class="clone" href="<?php echo JRoute::_(
                                        "index.php?option=com_eventgallery&view=cart&task=cloneLineItem&lineitemid="
                                        . $lineitem->getId()
                                    ); ?>"><small><i class="egfa egfa-copy"></i> <?php echo JText::_('COM_EVENTGALLERY_LINEITEM_CLONE') ?></small></a>
                                    <a class="delete delete-lineitem" data-lineitemid="<?php echo $lineitem->getId() ?>"
                                       href="#"><small><i class="egfa egfa-remove"></i> <?php echo JText::_('COM_EVENTGALLERY_LINEITEM_DELETE') ?></small></a>
                                    <a class="add-comment" href="#"><small><i class="egfa egfa-comment"></i> <?php echo JText::_('COM_EVENTGALLERY_LINEITEM_ADD_COMMENT')?></small></a>
                                </p>

                                <p class="lineitem-comment <?php if (strlen($lineitem->getBuyerNote()) == 0) echo "lineitem-comment-hidden" ?>">
                                    <textarea name="comment_<?php echo $lineitem->getId() ?>" rows="2"><?php echo $this->escape($lineitem->getBuyerNote()); ?></textarea>
                                </p>

                            </div>

                            <div style="clear:both;"></div>
                           
                        
                        </td>
                    </tr>
                <?php endforeach ?>
            </table>
        </div>

       
        <?php $this->set('edit',false); $this->set('lineitemcontainer', $this->cart); echo $this->loadSnippet('checkout/total') ?>

        <div class="needs-calculation" style="display: none;">
            <?php echo JText::_('COM_EVENTGALLERY_CART_RECALCULATE') ?>
        </div>

        <fieldset>

            <div class="form-actions">
                <a href="#" class="validate btn btn-warning eventgallery-removeAll pull-left"
                       ><?php echo JText::_('COM_EVENTGALLERY_CART_FORM_REMOVE_ALL') ?></a>
                <div class="btn-group pull-right">
                    <input name="updateCart" type="submit" class="validate btn eventgallery-update"
                           value="<?php echo JText::_('COM_EVENTGALLERY_CART_FORM_UPDATE') ?>"/>
                    <input name="continue" type="submit" class="validate btn btn-primary"
                           value="<?php echo JText::_('COM_EVENTGALLERY_CART_FORM_CONTINUE') ?>"/>
                </div>
                <div class="clearfix"></div>
            </div>
        </fieldset>
        <?php echo JHtml::_('form.token'); ?>
    </form>
</div>

<?php echo $this->loadSnippet('footer_disclaimer'); ?>

<script type="text/javascript">
(function(jQuery){

	jQuery( document ).ready(function() {

        jQuery('.scalepriceinformation').click(function(e) {
            var $target = jQuery(e.target);
            e.preventDefault();
            $target.closest('div').find('div.scaleprices').slideToggle();
        });

        // hide the recalc message
        jQuery('.needs-calculation').slideUp();

        // update the carts description once something changed
        var setImageTypeNeedsCalculationMode = function(e) {
            jQuery(e.target).parents('tr').find(".eventgallery-hide-on-imagetype-change").slideUp();            
            setQuantityNeedsCalculationMode(e);
        };

        var setQuantityNeedsCalculationMode = function (e) {
            jQuery(e.target).parents('tr').find(".eventgallery-hide-on-quantity-change").slideUp();
            setNeedsCalculationMode();
        };

        var setNeedsCalculationMode = function() {
            var cartSummary = jQuery(".cart-summary").slideUp(500,
            	function () {
                   	jQuery(".needs-calculation").slideDown(250);
                }
            );
        };

        var removeItem = function (e) {
            e.preventDefault();
            var lineitemid = jQuery(e.target).parents('a').data('lineitemid');
            var parent = jQuery('#row_' + lineitemid);

            jQuery.post( 
                "<?php echo JRoute::_("index.php?option=com_eventgallery&view=rest&task=removefromcart&format=raw", true); ?>".replace(/&amp;/g, '&'), 
                { lineitemid : lineitemid } )
            .done(function( data ) {
                        if (data  !== undefined) {
                            parent.find('td, th').each(function () {

                                // Create a dummy div wrap on cell content!
                                // The magic is here!
                                var content = jQuery(this).html();
                                var wrap = jQuery('<div></div>');
                                wrap.append(content);

                                wrap.css('margin', 0);
                                wrap.css('padding', 0);
                                wrap.css('overflow', 'hidden');

                                jQuery(this).empty().append(wrap);

                                wrap.slideUp(500, function () {
                                    parent.remove();
                                });
                            });

                            setNeedsCalculationMode();
                        }

            });

            jQuery(e.target).fadeOut();
            
        };
      

        /**
        * sets the quantity to 0 and submits the form.
        */
        function removeAllItems(e) {

            e.preventDefault();      
            var response = confirm("<?php echo JText::_('COM_EVENTGALLERY_CART_FORM_REMOVE_ALL_CONFIRM'); ?>");
            if (response == false) {
                return; 
            }
            jQuery("input.eventgallery-quantity").attr('value',0);
            jQuery(e.target).parents('form').submit();
        }

      
        jQuery(".cart-item input").change(setQuantityNeedsCalculationMode);
        jQuery(".cart-item select").change(setImageTypeNeedsCalculationMode);
        jQuery(".cart-item .delete-lineitem").click(removeItem);
        jQuery(".eventgallery-removeAll").click(removeAllItems);

        jQuery(".cart-item .add-comment").click(function(e) {
            e.preventDefault();
            var $target = jQuery(e.target),
                textareaContainer = $target.closest('.information').find('.lineitem-comment');

            textareaContainer.toggleClass("lineitem-comment-hidden");
        });
    });

})(eventgallery.jQuery);
</script>
