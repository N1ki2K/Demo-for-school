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



require_once JPATH_COMPONENT_SITE.'/config.php';

// Include the component versioning
include_once JPATH_COMPONENT_ADMINISTRATOR.'/version.php';

//load tables
JTable::addIncludePath(
    JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'tables'
);

require_once JPATH_ROOT . '/components/com_eventgallery/vendor/autoload.php';

JLoader::registerPrefix('Eventgallery', JPATH_COMPONENT_SITE);
JLoader::registerPrefix('Eventgallery', JPATH_COMPONENT);

JLoader::discover('EventgalleryPluginsShipping', JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_ship', true, true);
JLoader::discover('EventgalleryPluginsSurcharge', JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_sur', true, true);
JLoader::discover('EventgalleryPluginsPayment', JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_pay', true, true);

$view = JFactory::getApplication()->input->get('view');
$task = JFactory::getApplication()->input->get('task');

//avoid rendering those messages during the sync.
if ($task != 'sync.process') {
// check for the right Joomla Version
    if (version_compare(JVERSION, '3.5.0', 'lt')) {
        ?>
        <div class="alert alert-error">
        <?php echo JText::sprintf('COM_EVENTGALLERY_ERR_OLDJOOMLA', '3.5.0'); ?>
        </div><?php
    }

//Check foe the right PHP version
    if (version_compare(PHP_VERSION, '5.4.0') < 0) {
        ?>
        <div class="alert alert-error">
        <?php echo JText::sprintf('COM_EVENTGALLERY_ERR_OLDPHP', '5.4.0'); ?>
        </div><?php
    }

}

if (!JFactory::getUser()->authorise('core.manage', 'com_eventgallery'))
{
	throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
}

JLoader::register('JHtmlEventgalleryBatch', JPATH_ADMINISTRATOR . '/components/com_eventgallery/helpers/html/eventgallerybatch.php');

// Load necessary media files 
EventgalleryHelpersBackendmedialoader::load();

// Execute the task.
$controller	= JControllerLegacy::getInstance('Eventgallery');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();

