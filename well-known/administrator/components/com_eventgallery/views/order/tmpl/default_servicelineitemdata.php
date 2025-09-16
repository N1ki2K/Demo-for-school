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
<?php IF ($this->lineitemcontainer->getSurchargeServiceLineItem() != NULL): ?>
    <span class="data">
        <?php echo $this->lineitemcontainer->getSurchargeServiceLineItem()->getDisplayName(); ?>
        <pre>
        <?php print_r($this->lineitemcontainer->getSurchargeServiceLineItem()->getData()); ?>
        </pre>
    </span>

<?php ENDIF ?>
<?php IF ($this->lineitemcontainer->getShippingMethodServiceLineItem() != NULL): ?>

    <span class="data">
        <?php echo $this->lineitemcontainer->getShippingMethodServiceLineItem()->getDisplayName(); ?>
        <pre>
        <?php print_r($this->lineitemcontainer->getShippingMethodServiceLineItem()->getData()); ?>
        </pre>
    </span>

<?php ENDIF ?>
<?php IF ($this->lineitemcontainer->getPaymentMethodServiceLineItem() != NULL): ?>
    <span class="data">
        <?php echo $this->lineitemcontainer->getPaymentMethodServiceLineItem()->getDisplayName(); ?>
        <pre>
        <?php print_r($this->lineitemcontainer->getPaymentMethodServiceLineItem()->getData()); ?>
        </pre>
    </span>
<?php ENDIF ?>
