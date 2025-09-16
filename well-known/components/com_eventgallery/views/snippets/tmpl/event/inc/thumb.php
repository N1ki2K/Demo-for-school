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
	// disable the content section of this option if turned off.
	if (!isset($this->showContent) || $this->params->get('show_image_caption_overlay', 1)==0 ) {
		$this->showContent = false;
	}
	echo $this->loadSnippet('event/inc/thumb_'.$this->params->get('event_thumb_link_mode','lightbox'));




