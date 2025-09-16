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

<div class="eventgallery-checkout eventgallery-change-page">
    <h1><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_CHANGE_HEADLINE') ?></h1>
    <p>
        <?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_CHANGE_TEXT') ?>&nbsp;

        <?php IF (JFactory::getUser()->guest): ?>

        <?php ELSE: ?>
            <?php echo JText::sprintf('COM_EVENTGALLERY_CHECKOUT_LOGGEDIN_LABEL', JFactory::getUser()->name, JFactory::getUser()->username);?>
            <a href="<?php echo JRoute::_('index.php?option=com_users&view=login')?>"><?php echo JText::_('COM_EVENTGALLERY_CHECKOUT_LOGMEOUT'); ?></a>
        <?php ENDIF ?>
    </p>

    <?php echo $this->loadTemplate('login'); ?>

    <form action="<?php echo JRoute::_("index.php?option=com_eventgallery&view=checkout&task=saveChanges") ?>"
          method="post" class="form-validate form-horizontal checkout-form"
          id="checkout-form"
    >
        <fieldset>
            <?php echo $this->loadTemplate('payment'); ?>
            <?php echo $this->loadTemplate('shipping'); ?>
        </fieldset>
        <?php echo $this->loadTemplate('address'); ?>
        <fieldset>
            <div class="form-actions">
                <input name="continue" value="continue" type="hidden">
                <input type="submit" class="validate btn btn-primary"
                       value="<?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_CHANGE_FORM_CONTINUE') ?>"/>
            </div>
        </fieldset>
        <?php echo JHtml::_('form.token'); ?>
    </form>

</div>

<?php echo $this->loadSnippet('footer_disclaimer'); ?>
