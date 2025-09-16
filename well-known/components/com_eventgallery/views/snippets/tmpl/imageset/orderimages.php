<?php // no direct access
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die('Restricted access'); ?>
<?php IF ($this->folder->isCartable()  && $this->params->get('use_cart', '1')==1): ?>
    <style type="text/css">
        .orderimages-container {
            margin-top: 20px;
            margin-bottom: 20px;
        }
    </style>

    <div class="orderimages-container">
        <button style="display:none" title="<?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGES_SHOW_BUTTONS_DESCRIPTION') ?>" class="btn btn-primary orderimages-show"><?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGES_SHOW_BUTTONS') ?></button>

        <div class="well orderimages-help" style="display:none">
            <p><?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGES_HELP') ?></p>
            <button style="display:none" title="<?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGES_HIDE_BUTTONS_DESCRIPTION') ?>" class="btn btn-default orderimages-hide"><?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGES_HIDE_BUTTONS') ?></button>
        </div>
    </div>


    <script type="text/javascript">
        (function(jQuery){
            jQuery( document ).ready(function() {

                var orderimagesHideButton = jQuery('.orderimages-hide'),
                    orderimagesShowButton = jQuery('.orderimages-show'),
                    orderimagesHelp = jQuery('.orderimages-help');

                function closeImageTypeSelection(e) {
                    if (e) {
                        e.preventDefault();
                    }
                    orderimagesHideButton.hide();
                    orderimagesHelp.hide();
                    orderimagesShowButton.show();
                    jQuery('.eventgallery-add2cart').hide();
                }

                function openImageTypeSelection(e) {
                    if (e) {
                        e.preventDefault();
                    }
                    orderimagesHideButton.show();
                    orderimagesHelp.show();
                    orderimagesShowButton.hide();

                    jQuery('.eventgallery-add2cart').show();
                }

                orderimagesShowButton.click(openImageTypeSelection);
                orderimagesHideButton.click(closeImageTypeSelection);

                <?php if ($this->params->get('use_sticy_imagetype_selection', 0) == 0):?>
                    orderimagesShowButton.show();
                    orderimagesHideButton.hide();
                    orderimagesHelp.hide();
                    jQuery('.eventgallery-add2cart').hide();
                <?php ELSE: ?>
                    orderimagesShowButton.hide();
                    orderimagesHideButton.hide();
                    jQuery('.eventgallery-add2cart').show();
                <?PHP ENDIF ?>



            });

        })(eventgallery.jQuery);
    </script>
<?php ENDIF ?>