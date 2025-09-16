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

$this->link = "index.php?option=com_eventgallery&view=singleimage&folder=" . $this->entry->getFolderName() . "&file=" . $this->entry->getFileName()."&Itemid=".$this->currentItemid;

if (isset($this->category) && $this->category->id != 'root') {
    $this->link .= "&catid=" . $this->category->id;
}

$this->link = JRoute::_($this->link);

echo $this->loadSnippet('event/inc/thumb_link');