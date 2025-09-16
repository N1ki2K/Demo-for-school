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


<?php IF (JFactory::getUser()->guest): ?>
    <div class="login">

        <legend><?php echo JText::_('COM_EVENTGALLERY_TRACKORDER_FORM_REGISTERED_LABEL');?></legend>
        <form action="<?php echo JRoute::_('index.php?option=com_users&task=user.login'); ?>" method="post" class="form-vertical">

            <fieldset class="well">
                <div class="desc">
                    <small><?php echo JText::_('COM_EVENTGALLERY_TRACKORDER_FORM_REGISTERED_DESC');?></small>
                </div>
                <?php foreach ($this->loginform->getFieldset('credentials') as $field) : ?>
                    <?php if (!$field->hidden) : ?>
                        <div class="control-group">
                            <div class="control-label">
                                <?php echo $field->label; ?>
                            </div>
                            <div class="controls">
                                <?php echo $field->input; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
                <div class="control-group">
                    <div class="controls">
                        <button type="submit" class="btn btn-primary"><?php echo JText::_('JLOGIN'); ?></button>
                    </div>
                </div>
                <input type="hidden" name="return" value="<?php echo base64_encode($this->params->get('login_redirect_url', JRoute::_(JUri::base().'index.php?option=com_eventgallery&view=orders'))); ?>" />
                <?php echo JHtml::_('form.token'); ?>
            </fieldset>
        </form>
    </div>
    <div>
        <ul class="nav">
            <li>
                <a href="<?php echo JRoute::_('index.php?option=com_users&view=reset'); ?>">
                    <?php echo JText::_('COM_USERS_LOGIN_RESET'); ?></a>
            </li>
            <li>
                <a href="<?php echo JRoute::_('index.php?option=com_users&view=remind'); ?>">
                    <?php echo JText::_('COM_USERS_LOGIN_REMIND'); ?></a>
            </li>
            <?php
            $usersConfig = JComponentHelper::getParams('com_users');
            if ($usersConfig->get('allowUserRegistration')) : ?>
                <li>
                    <a href="<?php echo JRoute::_('index.php?option=com_users&view=registration'); ?>">
                        <?php echo JText::_('COM_USERS_LOGIN_REGISTER'); ?></a>
                </li>
            <?php endif; ?>
        </ul>
    </div>


<?php ELSE: ?>
    <div>
        <legend><?php echo JText::_('COM_EVENTGALLERY_TRACKORDER_VIEWORDER_LABEL');?></legend>
        <div class="well">
            <div class="desc">
                <small><?php echo JText::_('COM_EVENTGALLERY_TRACKORDER_VIEWORDER_DESC');?></small>
            </div>
            <a href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=orders')?>" class="btn btn-primary"><?php echo JText::_('COM_EVENTGALLERY_TRACKORDER_VIEWORDER_LABEL');?></a>
        </div>
    </div>
<?php ENDIF ?>