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
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.file');
require_once JPATH_ROOT.'/components/com_eventgallery/config.php';

class EventgalleryLibraryFolderLocal extends EventgalleryLibraryFolder
{
    const ID = 0;

    protected static $_maindir = NULL;

    /**
     * syncs a local folder
     *
     * @param string $foldername
     * @return array
     */
    public static function syncFolder($foldername, $use_htacces_to_protect_original_files) {

        $db = JFactory::getDbo();
        $user = self::helpToGetUser();

        // delete the folder if it does not exist.
        $folderpath = COM_EVENTGALLERY_IMAGE_FOLDER_PATH.$foldername;
        if (!file_exists($folderpath)) {
            self::deleteFolder($foldername);
            return ['status' => EventgalleryLibraryManagerFolder::$SYNC_STATUS_DELTED];
        }

        /**
         * the array holding the physical files
         */
        $files = Array();
        $quotedFileNames = Array();
        set_time_limit(120);

        // collect all the physical files.
        $dir=dir($folderpath);
        while ($elm = $dir->read())
        {
            if (is_file($folderpath.DIRECTORY_SEPARATOR.$elm))
                array_push($files, $elm);
            	array_push($quotedFileNames, $db->q($elm));
        }

        // remove deleted files fromes from the database
        $query = $db->getQuery(true);
        $query->delete('#__eventgallery_file')
            ->where('folder='.$db->quote($foldername))
            ->where('file not in ('.implode(',',$quotedFileNames).')');
        $db->setQuery($query);
        $db->execute();

        $query = $db->getQuery(true);
        $query->select('file')
            ->from($db->quoteName('#__eventgallery_file'))
            ->where('folder='.$db->quote($foldername));
        $db->setQuery($query);
        $currentfiles = $db->loadAssocList(null, 'file');

        $filesToUpdate = $currentfiles;

        # add all new files of a directory to the database
        foreach(array_diff($files, $currentfiles) as $file)
        {
            if (EventgalleryLibraryCommonSecurity::isProtectionFile($file)) {
                continue;
            }

            $filepath = $folderpath.DIRECTORY_SEPARATOR.$file;

            $created = date('Y-m-d H:i:s',filemtime($filepath));

            $query = $db->getQuery(true);
            $query->insert($db->quoteName('#__eventgallery_file'))
                ->columns(
                    'folder,file,published,'
                    .'userid,created,modified,ordering'
                    )
                ->values(implode(',',array(
                    $db->quote($foldername),
                    $db->quote($file),
                    '1',
                    $db->quote($user==null?'':$user->id),
                    $db->quote($created),
                    'now()',
                    0
                    )));
            $db->setQuery($query);
            $db->execute();

            array_push($filesToUpdate, $file);
        }

        EventgalleryLibraryCommonSecurity::writeIndexHtmlFile($folderpath);
        if ($use_htacces_to_protect_original_files) {
            EventgalleryLibraryCommonSecurity::protectFolder($folderpath);
        }

        return ["status" => EventgalleryLibraryManagerFolder::$SYNC_STATUS_SYNC, "files" => $filesToUpdate];
    }

    /**
     * Deletes a local folder
     *
     * @param $foldername string
     */
    protected static function deleteFolder($foldername) {
        $db = JFactory::getDbo();

        /**
         * @var EventgalleryLibraryManagerFolder $folderMgr
         * @var EventgalleryTableFolder $table
         */
        $folderMgr = EventgalleryLibraryManagerFolder::getInstance();

        $id = $folderMgr->getFolderId($foldername);

        $table = JTable::getInstance('Folder', 'EventgalleryTable');
        $table->delete($id);

        $query = $db->getQuery(true);
        $query->delete('#__eventgallery_file')
            ->where('folder='.$db->quote($foldername));
        $db->setQuery($query);

        $query = $db->getQuery(true);
        $query->delete('#__ucm_content')
            ->where('core_content_item_id='.$db->quote($foldername))
            ->where('core_type_alias='.$db->quote('com_eventgallery.event'));
        $db->setQuery($query);

    }

    public static function findNewFolders()
    {
        $db = JFactory::getDbo();

        $newAddResults = Array();
        $folders = Array();

        if (file_exists(COM_EVENTGALLERY_IMAGE_FOLDER_PATH)) {
            $verzeichnis = dir(COM_EVENTGALLERY_IMAGE_FOLDER_PATH);
        } else {
            return $newAddResults;
        }

        # Hole die verfügbaren Verzeichnisse
        while ($elm = $verzeichnis->read())
        { //sucht alle Verzeichnisse mit Bilder
            if (is_dir(COM_EVENTGALLERY_IMAGE_FOLDER_PATH.$elm) && $elm!='.' && $elm!='..' && !preg_match("/.cache/",$elm))
            {
                if (is_dir(COM_EVENTGALLERY_IMAGE_FOLDER_PATH.$elm.DIRECTORY_SEPARATOR ))
                {
                    array_push($folders, $elm);
                }
            }
        }

        $query = $db->getQuery(true);
        $query->select('folder')
            ->from($db->quoteName('#__eventgallery_folder'));
        $db->setQuery($query);
        $currentfolders = $db->loadAssocList(null, 'folder');

        # Füge Verzeichnisse in die DB ein
        foreach(array_diff($folders, $currentfolders) as $foldername)
        {
            $addResult = new EventgalleryLibraryFolderAddresult();
            $addResult->setFolderName($foldername);
            $addResult->setFolderType(self::ID);

            array_push($newAddResults, $addResult);

            #Versuchen wir, ein paar Infos zu erraten
            if (strcmp($foldername,JFolder::makeSafe($foldername))!=0) {
                $addResult->setError(JText::sprintf('COM_EVENTGALLERY_SYNC_DATABASE_SYNC_ERROR_FOLDERNAME', $foldername, JFolder::makeSafe($foldername)));
                continue;
            }

            $break = false;
            foreach($currentfolders as $currentfolder) {
                if(strcasecmp($foldername, $currentfolder) == 0 ) {
                    $addResult->setError(JText::sprintf('COM_EVENTGALLERY_SYNC_DATABASE_SYNC_ERROR_DUPLICATE_FOLDERNAME', $foldername, $currentfolder));
                    $break = true;
                }
            }

            if ($break) {
                continue;
            }

        }

        return $newAddResults;
    }

    /**
     * adds new folder to the database and return an array of EventgalleryLibraryFolderAddresult
     */
    public static function addNewFolder($foldername) {

        $db = JFactory::getDbo();
        $user = self::helpToGetUser();

        $date = "";
        $temp = array();
        $created = date('Y-m-d H:i:s',filemtime(COM_EVENTGALLERY_IMAGE_FOLDER_PATH.$foldername));

        if (preg_match("/[0-9]{4}-[0-9]{2}-[0-9]{2}/",$foldername, $temp))
        {
            $date = $temp[0];
            $description = str_replace($temp[0],'',$foldername);
        }
        else {
            $description = $foldername;
        }

        $db = JFactory::getDbo();
        $db->setQuery('SELECT MAX(ordering) FROM #__eventgallery_folder');
        $max = $db->loadResult();

        $description = trim(str_replace("_", " ", $description));

        /**
         * @var EventgalleryTableFolder $table
         */
        $table = JTable::getInstance('Folder', 'EventgalleryTable');

        $table->folder = $foldername;
        $table->published = 0;
        $table->date = $date;
        $table->description = $description;
        $table->userid = $user==null?null:$user->id;
        $table->created = $created;
        $table->modified = date('Y-m-d H:i:s');
        $table->ordering = $max + 1;
        $table->foldertypeid = 0;

        $table->store();
    }

    public static function getFileFactory() {
        return EventgalleryLibraryFactoryFileLocal::getInstance();
    }

    public function isSortable() {
        return true;
    }

    public function supportsFileUpload() {
        return true;
    }

    public function supportsFileDeletion() {
        return true;
    }

    public function supportsImageDataEditing() {
        return true;
    }
}
