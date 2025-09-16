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
<?php if (count($this->model->comments) > 0 && $this->use_comments == 1) {
    FOREACH ($this->model->comments as $comment): ?>
        <div class="comment">
            <div class="content">
                <div class="from"><?php echo $comment->name ?> <?php echo JText::_(
                        'COM_EVENTGALLERY_SINGLEIMAGE_COMMENTS_WROTE'
                    ) ?> <?php echo JHtml::date($comment->date) ?>:
                </div>
                <div class="text"><?php echo $comment->text ?></div>
            </div>
        </div>
    <?php ENDFOREACH;
} ?>
<div style="clear:both;"></div>