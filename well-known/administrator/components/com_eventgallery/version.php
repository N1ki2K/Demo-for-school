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

if (!defined('EVENTGALLERY_VERSION')) {

	$db = JFactory::getDbo();

	$sql = $db->getQuery(true)
		->select($db->quoteName('name'))
		->from($db->quoteName('#__extensions'))
		->where($db->quoteName('type').' = '.$db->quote('package'))
		->where($db->quoteName('element').' = '.$db->quote('pkg_eventgallery_full'));
	$db->setQuery($sql);
	$result = $db->loadResult();

	$isFull = $result!=null?true:false;


	define('EVENTGALLERY_EXTENDED', $isFull);
	define('EVENTGALLERY_VERSION', '3.8.2');
	define('EVENTGALLERY_VERSION_SHORTSHA', 'eeea0e4');
	define('EVENTGALLERY_DATABASE_VERSION', '3.7.12_2017-12-21');
	define('EVENTGALLERY_DATE', '18/02/2018');
}