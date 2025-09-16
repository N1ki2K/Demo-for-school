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

use \Joomla\Component\Eventgallery\Site\Library\Connector\GooglePhotos;

class EventgalleryLibraryFolderPicasa extends EventgalleryLibraryFolder
{

    const PICASA_FOLDERID_DELIMITER = '@';
    const ID = 1;

    private $_album_updated = false;

    /**
     * @param int $limitstart
     * @param int $limit
     * @param int $imagesForEvents if true load the main images at the first position
     * @return array
     */
    public function getFiles($limitstart = 0, $limit = 0, $imagesForEvents = 0, $sortAttribute='', $sortDirection='ASC') {

        $this->updateAlbum();

        return parent::getFiles($limitstart, $limit, $imagesForEvents, $sortAttribute, $sortDirection);
    }

    /**
     * returns the picasa key
     *
     * @return string
     */
    public function getPicasaKey() {
        if ($this->_folder == null) {
            return "";
        }
        return $this->_folder->picasakey;
    }

    /**
     * returns the picasa user
     *
     * @return string
     */
    public function getUserId() {
        $values = explode(self::PICASA_FOLDERID_DELIMITER, $this->_foldername);
        $userId = implode(self::PICASA_FOLDERID_DELIMITER, array_slice($values, 0, count($values)-1) );
        return $userId;
    }

    /**
     * returns the picasa album id
     *
     * @return string
     */
    public function getAlbumId() {
        $values = explode(self::PICASA_FOLDERID_DELIMITER, $this->_foldername);
        if (count($values) > 1) {
            $albumId = implode(self::PICASA_FOLDERID_DELIMITER, array_slice($values, count($values)-1, 1) );
            return $albumId;
        }
        return $this->_foldername;
    }

    /**
     * Updates the album
     */
    public function updateAlbum() {
        if ($this->_album_updated == NULL) {
            $this->_album_updated = true;

            $cachelifetime = $this->componentParams->get('cache_picasa_lifetime', GooglePhotos::$cache_life);
            $refresh_token = $this->componentParams->get('google_photos_refresh_token');

            $joomlaConfigParameters = \JFactory::getConfig();

            GooglePhotos::picasaweb_ListAlbum($cachelifetime, $refresh_token, $joomlaConfigParameters, JFactory::getDbo(), $this->getUserId(), $this->getAlbumId(), $this->getPicasaKey());
        }
    }

    public static function syncFolder($foldername, $use_htacces_to_protect_original_files) {
        return ['status' => EventgalleryLibraryManagerFolder::$SYNC_STATUS_NOSYNC];
    }

    public static function findNewFolders() {
        return Array();
    }

    public static function getFileFactory() {
        return EventgalleryLibraryFactoryFilePicasa::getInstance();
    }

    public function isSortable() {
        return false;
    }

    public function supportsFileUpload() {
        return false;
    }

    public function supportsFileDeletion() {
        return false;
    }

    public function supportsImageDataEditing() {
        return false;
    }
}
