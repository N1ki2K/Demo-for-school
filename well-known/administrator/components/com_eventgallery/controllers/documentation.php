<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

jimport( 'joomla.application.component.controllerform' );

require_once(__DIR__.'/../controller.php');

class EventgalleryControllerDocumentation extends JControllerForm
{

    protected $default_view = 'default';

	
	public function cancel($key = null) {
		$this->setRedirect( 'index.php?option=com_eventgallery');
	}
}
