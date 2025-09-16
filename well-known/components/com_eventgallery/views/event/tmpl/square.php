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

echo  $this->loadSnippet('cart');

echo $this->loadSnippet('event/backbutton');

echo  $this->loadSnippet('social');

echo $this->loadSnippet('event/square');

echo $this->loadSnippet('footer_disclaimer');