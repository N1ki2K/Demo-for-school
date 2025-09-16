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

include_once JPATH_COMPONENT_ADMINISTRATOR.'/version.php';

//load tables
JTable::addIncludePath(
    JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR . 'com_eventgallery'
    . DIRECTORY_SEPARATOR . 'tables'
);


require_once JPATH_ROOT . '/components/com_eventgallery/vendor/autoload.php';

// load forms
JForm::addFormPath(JPATH_COMPONENT . '/models/forms');

//load fields
JForm::addFieldPath(JPATH_COMPONENT . '/models/fields');

//load classes
JLoader::registerPrefix('Eventgallery', JPATH_COMPONENT);

// load plugins

JLoader::discover('EventgalleryPluginsShipping', JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_ship', true, true);
JLoader::discover('EventgalleryPluginsSurcharge', JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_sur', true, true);
JLoader::discover('EventgalleryPluginsPayment', JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_pay', true, true);


// Load necessary media files 
EventgalleryHelpersMedialoader::load();

$language = JFactory::getLanguage();
$language->load('com_eventgallery' , JPATH_BASE.DIRECTORY_SEPARATOR.'language'.DIRECTORY_SEPARATOR.'overrides', $language->getTag(), true);


$controller	= JControllerLegacy::getInstance('Eventgallery');

$view = JFactory::getApplication()->input->get('view', 'null');

$controllerFile = JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'controllers' . DIRECTORY_SEPARATOR . ucfirst($view) . '.php';

if ($view!=null && file_exists($controllerFile)) {
	require_once($controllerFile);
	$controllerClass = 'EventgalleryController' . ucfirst($view);
	$controller = new $controllerClass(); 
}

/**
 * @var JControllerLegacy $controller
 */
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();


