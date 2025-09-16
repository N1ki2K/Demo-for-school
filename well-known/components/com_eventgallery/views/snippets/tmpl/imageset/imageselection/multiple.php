<?php // no direct access
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die('Restricted access');

$cartMgr = EventgalleryLibraryManagerCart::getInstance();
$cart = $cartMgr->getCart();
?>

            <?php
            if ($this->imageset != null) {
                ?>

                <div class="imageset">
                    <p>
                        <?PHP IF (strlen($this->imageset->getDescription())>0):?>
                            <span class="imageset-description"><?php echo $this->imageset->getDescription(); ?></span>
                        <?PHP ELSE: ?>
                            <span class="imageset-description"><?php echo JText::_('COM_EVENTGALLERY_IMAGESET_PRICES') ?></span>
                        <?PHP ENDIF; ?>
                    </p>
                    <hr>
                    <?php FOREACH($this->imageset->getImageTypes(true) as $imageType): ?>

                        <div class="row-fluid">
                            <div class="displayname span3">
                                <?php echo $imageType->getDisplayName(); ?>
                            </div>
                            <div class="pricedisplay span3">
                                <?php IF( count($imageType->getScalePrices()) == 0):?>
                                    <span class="price"><?php echo $imageType->getPrice(); ?> <strong>*</strong></span>
                                <?php ELSE: ?>
                                    <?php $this->showstar=true; $this->imagetype = $imageType; echo $this->loadSnippet('imageset/scaleprice/default'); ?>
                                <?php ENDIF; ?>
                            </div>
                            <div class="description span3"><?php echo $imageType->getDescription(); ?></div>
                            <div class="span3">
                                <div class="input-append pull-right">
                                    <button class='btn eventgallery-qtyminus' id="quantityminus_<?php echo $imageType->getId(); ?>" field='quantity_<?php echo $imageType->getId(); ?>'>-</button>
                                    <?php
                                    $lineitem = $cart->getLineItemByFileAndType($this->file->getFolderName(), $this->file->getFileName(), $imageType->getId());
                                    if ($lineitem == null) {
                                        $currentQuantity = 0;
                                    } else {
                                        $currentQuantity = $lineitem->getQuantity();
                                    }
                                    ?>
                                    <input   type='text'
                                             data-id="<?php echo "folder=" . urlencode($this->file->getFolderName()) . "&file=" . urlencode($this->file->getFileName()) . "&imagetypeid=" . $imageType->getId() ?>"
                                             data-maxorderquantity="<?php echo $imageType->getMaxOrderQuantity(); ?>"
                                             name='quantity_<?php echo $imageType->getId(); ?>'
                                             value='<?php echo $currentQuantity?>'
                                             class='qty eventgallery-cartquantity' />
                                    <button class='btn eventgallery-qtyplus' id="quantityplus_<?php echo $imageType->getId(); ?>" field='quantity_<?php echo $imageType->getId(); ?>'>+</button>
                                </div>
                            </div>
                        </div>
                        <hr>
                    <?php ENDFOREACH ?>
                    <?php IF ($this->params->get('show_vat', 1) == 1):?>
                        <small><strong>*</strong> <?php echo JText::_('COM_EVENTGALLERY_PRODUCT_VAT_HINT') ?></small>
                    <?php ENDIF; ?>
                </div>
                <?php
                // end if ($this->imageset != null)
            }?>
