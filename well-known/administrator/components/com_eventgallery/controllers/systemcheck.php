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

class EventgalleryControllerSystemcheck extends JControllerForm
{

    protected $default_view = 'systemcheck';

    public function __construct($config = array())
    {

        parent::__construct($config);
    }

    public function fixdbversion()
    {

        JSession::checkToken();
        $db = \Joomla\CMS\Factory::getDbo();

        $query = "insert into #__schemas (extension_id, version_id) ";
        $query .= "select extension_id, " . $db->quote(EVENTGALLERY_DATABASE_VERSION). " ";
        $query .= "from #__extensions ";
        $query .= "where element = 'com_eventgallery'";

        $db->setQuery($query);
        $db->execute();

        $this->setRedirect( 'index.php?option=com_eventgallery&view='.$this->default_view);


    }


}
