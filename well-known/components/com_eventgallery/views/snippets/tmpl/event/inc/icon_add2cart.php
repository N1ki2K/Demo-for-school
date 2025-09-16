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
<?php IF ($this->folder->isCartable() && $this->params->get('use_cart',1)==1): ?><span data-id="<?php echo "folder=" . urlencode($this->entry->getFolderName()) . "&file=" . urlencode($this->entry->getFileName()); ?>" title="<?php echo JText::_(
                        'COM_EVENTGALLERY_CART_ITEM_ADD2CART'
                    ) ?>" class="eventgallery-add2cart eventgallery-openAdd2cart"><i class="egfa egfa-2x egfa-cart-plus"></i></span><?php ENDIF
                    ?><?php IF ($this->folder->isCartable() && $this->params->get('show_cart_connector', 0) == 1):?><span
                        data-href="<?php echo EventgalleryHelpersCartconnector::getLink(
                            $this->entry->getFolderName(), $this->entry->getFileName()
                        ); ?>" class="eventgallery-cart-connector button-cart-connector"
                        title="<?php echo JText::_('COM_EVENTGALLERY_CART_CONNECTOR') ?>"
                        data-folder="<?php echo $this->entry->getFolderName() ?>" data-file="<?php echo $this->entry->getFileName(); ?>"><i
                                class="egfa egfa-2x egfa-shopping-cart"></i></span><?php ENDIF
                        ?>