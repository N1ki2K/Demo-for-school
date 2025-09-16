<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

class EventgalleryHelpersFolderprotection
{
    const SESSION_KEY_UNLOCKED_FOLDERS = "eventgallery_unlockedFolders";
    const SESSION_KEY_PASSWORD_FAIL_COUNTER = "eventgallery_passwordFailCounter";

    /**
     * returns a JSON string containing the unlocked folders
     * @return string
     */
    public static function getUnlockedFoldersJSON() {
        $session = JFactory::getSession();
        return $session->get(self::SESSION_KEY_UNLOCKED_FOLDERS, '');
    }
    /**
     * returns true if the folder is unlocked. If a password is given we try to unlock
     * the folder. If the password is wrong or the folder is locked false is returned.
     *
     * @param EventgalleryLibraryFolder $folder  a folder object
     * @param string $password a password
     * @return boolean
     */
    public static function isAccessAllowed($folder, $password = "")
    {

        $session = JFactory::getSession();

        // if the folder does not exist.
        if (!is_object($folder)) {
            return true;
        }

        // if the folder has an empty password
        if (strlen($folder->getPassword()) == 0) {
            return true;
        }


        // if the event need a password
        if (is_object($folder) && strlen($folder->getPassword()) > 0) {

            $unlockedFoldersJson = self::getUnlockedFoldersJSON();

            $unlockedFolders = array();
            if (strlen($unlockedFoldersJson) > 0) {
                $unlockedFolders = json_decode($unlockedFoldersJson, true);
            }

            // return true because the folder is already unlocked.
            if (in_array($folder->getFolderName(), $unlockedFolders)) {
                return true;
            }

            // does the entered password matches?
            if (strcmp($folder->getPassword(), $password) == 0) {

                // remember that we unlocked this folder
                if (!in_array($folder->getFolderName(), $unlockedFolders)) {
                    array_push($unlockedFolders, $folder->getFolderName());
                }

                $session->set(self::SESSION_KEY_UNLOCKED_FOLDERS, json_encode($unlockedFolders));

                return true;

            } else {
                // the entered password does not match and can be empty
                if (strlen($password) > 0) {

                    // slow down the process if somebody tries to guess a password. After 10 tries we 
                    // sleep 5s for every other try even if he entered the password correctly. 
                    // this is no protection agains session less robots, but will help agains
                    // the normal snoopy people.
                    $passwordFailCounter = $session->get(self::SESSION_KEY_PASSWORD_FAIL_COUNTER, 0);
                    $passwordFailCounter++;
                    if ($passwordFailCounter > 10) {
                        sleep(5);
                    }
                    $session->set(self::SESSION_KEY_PASSWORD_FAIL_COUNTER, $passwordFailCounter);
                }
                return false;
            }
        }

        // just in case we missed something.    
        return false;
    }

}
