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

/** @noinspection PhpUndefinedClassInspection */
class EventgalleryControllerEventgallery extends JControllerForm
{
	public function removeOldFiles() {

		$db = JFactory::getDbo();

        // remove the old servicelineitems
        $query = $db->getQuery(true);
        $query->delete('#__eventgallery_file');
        $query->where('folder not in (select folder from #__eventgallery_folder)');
        $db->setQuery($query);
        $db->execute();
        $removedFilesCount = $db->getAffectedRows();

        // do the redirect
        $msg = JText::sprintf('COM_EVENTGALLERY_FILES_CLEANUP_DONE', $removedFilesCount );
        $this->setRedirect( 'index.php?option=com_eventgallery', $msg );

	}

	    /**
     * removes carts which are older than XX days.
     */
    function removeOldCarts() {

        $db = JFactory::getDbo();

        // remove the old carts
        $query = $db->getQuery(true);
        $query->delete('#__eventgallery_cart');
        $query->where($db->quoteName("modified").' < DATE_SUB(NOW(), INTERVAL 30 DAY)');
        $db->setQuery($query);
        $db->execute();
        $removedCartsCount = $db->getAffectedRows();


        // remove the old imagelineitems
        $query = $db->getQuery(true);
        $query->delete('#__eventgallery_imagelineitem');
        $query->where('lineitemcontainerid not in (select id from #__eventgallery_cart)');
        $query->where('lineitemcontainerid not in (select id from #__eventgallery_order)');
        $db->setQuery($query);
        $db->execute();

        // remove the old servicelineitems
        $query = $db->getQuery(true);
        $query->delete('#__eventgallery_servicelineitem');
        $query->where('lineitemcontainerid not in (select id from #__eventgallery_cart)');
        $query->where('lineitemcontainerid not in (select id from #__eventgallery_order)');
        $db->setQuery($query);
        $db->execute();

        // do the redirect
        $msg = JText::sprintf('COM_EVENTGALLERY_CART_CLEANUP_DONE', $removedCartsCount );
        $this->setRedirect( 'index.php?option=com_eventgallery', $msg );

    }
	


}
