<?php // no direct access
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die('Restricted access');

/**
 * @var EventgalleryLibraryImagetype $imagetype
 */
/**
@var $scaleprice EventgalleryLibraryScaleprice
 */
$imagetype = $this->imagetype;
$scaleprices = $imagetype->getScalePrices();

?>
<div class="imagetype-scaleprices">
    <span class="price"><?php echo $imagetype->getPrice(); ?> <strong>*</strong></span>
    <table class="table scaleprices">
        <tr>
            <th><?php echo JText::_('COM_EVENTGALLERY_IMAGETYPE_SCALEPRICE_QUANTITY_PACKAGE')?></th>
            <th><?php echo JText::_('COM_EVENTGALLERY_IMAGETYPE_SCALEPRICE_PACKAGEPRICE')?></th>
        </tr>
        <?php FOREACH($scaleprices as $scaleprice): ?>
            <tr>
                <td><?php echo $scaleprice->getQuantity(); ?></td>
                <td><span class="price"><?php echo $scaleprice->getPackagePrice(); ?> <?php IF ($this->showstar == true):?> <strong>*</strong><?php ENDIF;?></span></td>
            </tr>
        <?php ENDFOREACH; ?>
        <tr>
            <td colspan="2"><?php echo JText::_('COM_EVENTGALLERY_IMAGETYPE_SCALEPRICE_SINGLEPACKAGE_LINEITEM')?></td>
        </tr>
    </table>
</div>