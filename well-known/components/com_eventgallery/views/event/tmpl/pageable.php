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

echo $this->loadSnippet('cart');

echo $this->loadSnippet('event/backbutton');

echo $this->loadSnippet('social');

$this->params->set('event_thumb_link_mode','singleimagepage');

$this->params->set('event_image_list_thumbnail_height', $this->params->get('event_default_list_thumbnail_height',150));
$this->params->set('event_image_list_thumbnail_jitter', $this->params->get('event_default_list_thumbnail_jitter',50));
$this->params->set('event_image_list_thumbnail_first_item_height', $this->params->get('event_default_list_thumbnail_first_item_height',2));



echo $this->loadSnippet('event/imagelist');

echo $this->loadSnippet('footer_disclaimer');