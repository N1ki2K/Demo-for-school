<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');

/**
 * @var EventgalleryLibraryOrder $order
 */
$order = $this->item;


?>

<style>
    #modalordereditform legend {
        display: none;
    }

    #modalordereditform fieldset>div:nth-of-type(1) {
        display: none;
    }

    #modalordereditform fieldset>hr:nth-of-type(1) {
        display: none;
    }

</style>

<?php

echo $this->renderMessages();

?>
<form action="<?php echo JRoute::_('index.php?format=raw&option=com_eventgallery&layout=edit&id='. $order->getId()); ?>" method="POST" name="modalordereditform" id="modalordereditform">

    <div class="btn-group">
        <input type="submit"
               class="saveOrderContent btn btn-success"
               data-task="order.apply"
               data-id="<?php echo $order->getId(); ?>"
               value="<?php echo JText::_('JTOOLBAR_APPLY'); ?>">
        <input type="submit"
               class="saveOrderContent btn"
               data-task="order.save"
               data-id="<?php echo $order->getId(); ?>"
               value="<?php echo JText::_('JTOOLBAR_SAVE'); ?>">
        <input type="submit"
               class="closeOrderContent btn"
               data-id="<?php echo $order->getId(); ?>"
               data-href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=order&layout=content&tmpl=component&format=raw&id='. $order->getId()); ?>"
               value="<?php echo JText::_('JTOOLBAR_CLOSE'); ?>">
    </div>
    <input type="hidden" name="tmpl" value="component">


    <div id="j-main-container">
        <?php echo $this->loadSnippet('formfields'); ?>
    </div>

    <?php echo JHtml::_('form.token'); ?>
    <input type="hidden" name="option" value="com_eventgallery" />
    <input type="hidden" name="id" value="<?php echo $this->item->getId(); ?>" />
    <input type="hidden" name="task" value="order.apply" />
</form>
