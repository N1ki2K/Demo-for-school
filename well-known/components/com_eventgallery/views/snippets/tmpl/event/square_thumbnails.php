<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
// no direct access
defined('_JEXEC') or die('Restricted access'); ?>

<div class="eventgallery-square-list eventgallery-event-square-list">
    <div class="eventgallery-squares eventgallery-thumbnails thumbnails">
        <?php foreach ($this->entries as $entry) : /** @var EventgalleryLibraryFile $entry */ ?>
            
            <div class="eventgallery-square thumbnail-container">
                    <div class="event-thumbnails">
                        <?php $this->showContent=false; $this->entry=$entry; $this->cssClass=""; echo $this->loadSnippet('event/inc/thumb'); ?>
                        <div style="clear: both"></div>
                    </div>
            </div>
        <?php endforeach ?>
        <div style="clear: both"></div>
    </div>
</div>
