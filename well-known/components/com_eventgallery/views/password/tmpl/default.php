<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// no direct access
defined('_JEXEC') or die('Restricted access');
?>

<div class="event-password">

    <form action="<?php echo $this->formaction; ?>" method="POST" class="form-horizontal">
        <fieldset>
            <div class="control-group">
                <span class="password-label"><?php echo JText::sprintf('COM_EVENTGALLERY_PASSWORD_ENTER_PASSWORD', $this->folder->getDisplayName()) ?></span>
                <?php IF (strlen($this->folder->getPasswordHint())>0): ?>
                    <div class="password-hint">
                        <strong><?php echo JText::sprintf('COM_EVENTGALLERY_PASSWORD_PASSWORDHINT') ?></strong> <span class="password-hint-text"><?php echo $this->folder->getPasswordHint(); ?></span>
                    </div>
                <?php ENDIF; ?>
            </div>
            <div class="control-group">
                <label class="control-label" for="password"><?php echo JText::_(
                        'COM_EVENTGALLERY_PASSWORD_FORM_PASSWORD_LABEL'
                    ) ?></label>

                <div class="controls">
                    <input type="password" id="password" name="password"
                           placeholder="<?php echo JText::_('COM_EVENTGALLERY_PASSWORD_FORM_PASSWORD_LABEL') ?>">
                </div>
            </div>

            <div class="form-actions">

                <input class="btn btn-primary" type="submit" name="submit"
                       value="<?php echo JText::_('COM_EVENTGALLERY_PASSWORD_FORM_SUBMIT') ?>">

            </div>
        </fieldset>
    </form>
</div>