<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

jimport( 'joomla.application.component.modellist' );

class eventgalleryModelEventgallery  extends JModelList
{

    public function getFolderCount() {

        return $this->countEntries('#__eventgallery_folder');

    }


    public function getOrderCount() {

        return $this->countEntries('#__eventgallery_order');

    }


    public function getCartCount() {

        return $this->countEntries('#__eventgallery_cart');

    }


    public function getCommentCount() {

        return $this->countEntries('#__eventgallery_comment');

    }


    public function getFileCount() {

        return $this->countEntries('#__eventgallery_file file, #__eventgallery_folder folder', 'file.folder=folder.folder');

    }

    public function getFileTotalCount() {
        return $this->countEntries('#__eventgallery_file');
    }

    protected function countEntries($table, $where = null) {
        $db = $this->getDbo();
        $query = $db->getQuery(true);

        $query->select('count(1)');
        $query->from($table);
        if (isset($where)) {
            $query->where($where);
        }
        $db->setQuery($query);

        return $db->loadResult();
    }

}
