<?php // no direct access

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');
$user = $this->lineitemcontainer->getUser();

?>

<div class="basic-information">

    <?php IF ($user != null && $user->email != null):?>
        <b><?php echo JText::_("COM_EVENTGALLERY_ORDERS_USER"); ?></b><br>
        <a href="<?php echo JRoute::_("index.php?option=com_users&task=user.edit&id=") . $user->id?>"><?php echo JText::_("COM_EVENTGALLERY_ORDERS_USER_MANAGE"); ?></a>
        <a href="mailto:<?php echo $this->escape($user->email) ?>"><?php echo $this->escape($user->username . ' (' . $user->email . ')') ?></a><br><br>
    <?php ENDIF ?>


    <p><strong><?php echo JText::_('COM_EVENTGALLERY_ORDER_USERDATA_EMAIL_LABEL') ?></strong><br />
    <a href="mailto:<?php echo $this->escape($this->lineitemcontainer->getEMail()) ?>"><?php echo $this->escape($this->lineitemcontainer->getEMail()) ?></a></p>

    <?php IF (strlen($this->lineitemcontainer->getPhone())>0):?>
        <p><strong><?php echo JText::_('COM_EVENTGALLERY_ORDER_USERDATA_PHONE_LABEL') ?></strong><br />
        <a href="tel:<?php echo $this->escape($this->lineitemcontainer->getPhone()) ?>"><?php echo $this->escape($this->lineitemcontainer->getPhone()) ?></a></p>
    <?php ENDIF; ?>

    <?php IF (strlen($this->lineitemcontainer->getMessage())>0):?>
        <p><strong><?php echo JText::_('COM_EVENTGALLERY_ORDER_USERDATA_MESSAGE_LABEL') ?></strong><br />
        <?php echo $this->escape($this->lineitemcontainer->getMessage()) ?></p>
    <?php ENDIF; ?>

    <?php IF (null != $this->lineitemcontainer->getBillingAddress() && strlen($this->lineitemcontainer->getBillingAddress()->getTaxId())>0 ):?>
        <p class="basic-message"><strong><?php echo JText::_('COM_EVENTGALLERY_ORDER_USERDATA_TAXID_LABEL') ?></strong><br />
        <?php echo $this->escape($this->lineitemcontainer->getBillingAddress()->getTaxId()); ?><br/>
    <?php ENDIF; ?>
</div>
