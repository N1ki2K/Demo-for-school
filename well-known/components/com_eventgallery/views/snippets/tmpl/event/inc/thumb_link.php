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
?><a class="event-thumbnail <?php if (isset($this->cssClass)) {echo $this->cssClass;}?>" href="<?php echo $this->link; ?>"
     title="<?php echo htmlspecialchars($this->entry->getPlainTextTitle(), ENT_COMPAT, 'UTF-8') ?>">
    <?php echo $this->entry->getLazyThumbImgTag(50, 50); ?>
    <?php echo $this->loadSnippet('event/inc/thumbs_content'); ?>
    <div class="eventgallery-icon-container">
        <?php echo $this->loadSnippet('event/inc/icon_add2cart'); ?>
        <?php echo $this->loadSnippet('event/inc/icon_socialsharing'); ?>
    </div>
</a>
