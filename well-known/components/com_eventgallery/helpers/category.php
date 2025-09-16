<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

/**
 * Eventgallery Component Category Tree
 *
 */
class EventgalleryCategories extends JCategories
{
	public function __construct($options = array())
	{
		$options['table'] = '#__eventgallery_folder';
		$options['extension'] = 'com_eventgallery';
		$options['statefield'] ='published';

		parent::__construct($options);
	}
}
