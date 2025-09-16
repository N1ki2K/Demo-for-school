<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;


//the name of the class must be the name of your component + InstallerScript
//for example: com_contentInstallerScript for com_content.
class com_eventgalleryInstallerScript
{

	protected $initialDbVersion = null;

    private $eventgalleryCliScripts = array(
        'eventgallery-sync.php',
        'eventgallery-s3-thumbnails.php'
    );

    /*
    * $parent is the class calling this method.
    * $type is the type of change (install, update or discover_install, not uninstall).
    * preflight runs before anything else and while the extracted files are in the uploaded temp folder.
    * If preflight returns false, Joomla will abort the update and undo everything already done.
    */
    function preflight( /** @noinspection PhpUnusedParameterInspection */$type, $parent ) {


        $dbVersion = $this->getDatabaseVersion();
        $this->initialDbVersion = $dbVersion;

        /*if ($type == 'update') {
            if ($dbVersion == null || strlen($dbVersion) == 0) {
                $msg = "Current database version is not set (" . $dbVersion . '). I can\'t update! I tried to update to database version 3.7.12_2017-12-21. Please contact the developer for help.';
                $msg .= 'If you want to try a fix yourself, please have a look at this page: https://www.svenbluege.de/joomla-event-gallery/event-gallery-manual/faq-sql-error-during-install.';
                throw new Exception($msg, 100);
            }
        }*/


        if ($dbVersion!= null && version_compare($dbVersion, '3.7.12_2017-12-21', 'gt')) {
            $msg = "Downgrades are not supported. Please install the same or a newer version. Current version: " . $dbVersion . '. I tried to install database version 3.7.12_2017-12-21';
            throw new Exception($msg, 100);
        }




        $folders = array(  
            JPATH_ROOT . '/administrator/components/com_eventgallery/controllers',
            JPATH_ROOT . '/administrator/components/com_eventgallery/media',
            JPATH_ROOT . '/administrator/components/com_eventgallery/models',
            JPATH_ROOT . '/administrator/components/com_eventgallery/views',
            //JPATH_ROOT . '/administrator/components/com_eventgallery/sql',
            JPATH_ROOT . '/components/com_eventgallery/controllers',
            JPATH_ROOT . '/components/com_eventgallery/helpers',
            JPATH_ROOT . '/components/com_eventgallery/language',
            JPATH_ROOT . '/components/com_eventgallery/library',
            JPATH_ROOT . '/components/com_eventgallery/media',
            JPATH_ROOT . '/components/com_eventgallery/models',
            JPATH_ROOT . '/components/com_eventgallery/tests',
            JPATH_ROOT . '/components/com_eventgallery/views',
            JPATH_ROOT . '/components/com_eventgallery/vendor',
            JPATH_ROOT . '/cache/com_eventgallery_flickr',
            JPATH_ROOT . '/cache/com_eventgallery_picasa',
            JPATH_ROOT . '/cache/com_eventgallery_template_compile',
            JPATH_ROOT . '/media/com_eventgallery'
        );

        $files = array(
            JPATH_ROOT . '/language/en-GB/en-GB.com_eventgallery.ini',
            JPATH_ROOT . '/language/de-DE/de-DE.com_eventgallery.ini',
            JPATH_ROOT . '/administrator/language/en-GB/en-GB.com_eventgallery.ini',
            JPATH_ROOT . '/administrator/language/en-GB/en-GB.com_eventgallery.sys.ini'
        );

        foreach($folders as $folder) {
            if (JFolder::exists($folder)) {
                JFolder::delete($folder);
            }
        }

        foreach($files as $file) {
            if (JFolder::exists($file)) {
                JFolder::delete($file);
            }
        }

        $this->_copyCliFiles($parent);
    }   

    /**
     * Copies the CLI scripts into Joomla!'s cli directory
     *
     * @param JInstaller $parent
     */
    private function _copyCliFiles($parent)
    {
        $src = $parent->getParent()->getPath('source');

        if(empty($this->eventgalleryCliScripts)) {
            return;
        }

        foreach($this->eventgalleryCliScripts as $script) {
            if(JFile::exists(JPATH_ROOT.'/cli/'.$script)) {
                JFile::delete(JPATH_ROOT.'/cli/'.$script);
            }
            if(JFile::exists($src.'/cli/'.$script)) {
                JFile::move($src.'/cli/'.$script, JPATH_ROOT.'/cli/'.$script);
            }
        }
    }


    function uninstall( /** @noinspection PhpUnusedParameterInspection */$parent ) {
        // remove CLI
		foreach($this->eventgalleryCliScripts as $script) {
            if(JFile::exists(JPATH_ROOT.'/cli/'.$script)) {
                JFile::delete(JPATH_ROOT.'/cli/'.$script);
            }
        }
	}
    
    function postflight( /** @noinspection PhpUnusedParameterInspection */$type, $parent )
    {
        $db = JFactory::getDbo();

        if ($type == 'update') {
            $this->updateDatabase(false);
        } else {
            $this->updateDatabase(true);
        }

        $plugins = Array(
                Array('system', 'picasaupdater'),
                Array('installer', 'eventgallery')
        );


        foreach($plugins as $pluginData) {
            
            // Let's get the information of the update plugin
            $query = $db->getQuery(true)
                ->select('*')
                ->from($db->qn('#__extensions'))
                ->where($db->qn('folder').' = '.$db->quote($pluginData[0]))
                ->where($db->qn('element').' = '.$db->quote($pluginData[1]))
                ->where($db->qn('type').' = '.$db->quote('plugin'));               
            $db->setQuery($query);
            $plugin = $db->loadObject();
            
            // If it's missing or enabledthere's nothing else to do
            if (!is_object($plugin) || $plugin->enabled)
            {
                continue;
            }


            // Otherwise, try to enable it
            $pluginObject = (object)array(
                'extension_id'  => $plugin->extension_id,
                'enabled'       => 1
            );

            try
            {
                $db->updateObject('#__extensions', $pluginObject, 'extension_id');
            }
            catch (Exception $e)
            {
            }
        }

        $this->migrateTags();
        $this->createDefaultCategory();
    }

    /**
     * Loads the ID of the extension from the database
     *
     * @return mixed
     */
    private function getExtensionId() {
        $db = JFactory::getDbo();

        $query = $db->getQuery(true);
        $query->select('extension_id')
            ->from('#__extensions')
            ->where($db->qn('element').' = '.$db->q('com_eventgallery'). ' AND type='. $db->q('component'));
        $db->setQuery($query);
        $eid = $db->loadResult();

        return $eid;
    }

    private function getDatabaseVersion() {
        // Get the extension ID
        $db = JFactory::getDbo();


        $eid = $this->getExtensionId();

        if ($eid != null) {
            // Get the schema version
            $query = $db->getQuery(true);
            $query->select('version_id')
                ->from('#__schemas')
                ->where('extension_id = ' . $db->quote($eid));
            $db->setQuery($query);
            $version = $db->loadResult();

            return $version;
        }

        return null;
    }

    /**
     * Migrate folder tag to Joomla! tags if we're in a version below Event Gallery 3.5.0
     */
    private function migrateTags() {
        $dbVersion = $this->initialDbVersion;
        echo "<h1>" . $dbVersion . "</h1>";
        
        if ($dbVersion == null || version_compare($dbVersion, '3.5.0_2015-05-06', 'lt') == false) {
            return;
        }
        JLoader::registerPrefix('Eventgallery', JPATH_ADMINISTRATOR . '/components/com_eventgallery');
        JLoader::registerPrefix('Eventgallery', JPATH_SITE . '/components/com_eventgallery');
        JTable::addIncludePath(JPATH_ADMINISTRATOR . '/components/com_eventgallery/tables');
        include_once(JPATH_ADMINISTRATOR.'/components/com_eventgallery/controllers/migration.php');
        $controller = new EventgalleryControllerMigration();
        $controller->migrateTags(false);
    }

    /**
     * create the default category
     */
    private function createDefaultCategory()
    {
        // Initialize a new category
        /** @type  JTableCategory $category */
        $category = JTable::getInstance('Category');

        // Check if the Uncategorised category exists before adding it
        if (!$category->load(array('extension' => 'com_eventgallery', 'title' => 'Uncategorised')))
        {
            $category->extension        = 'com_eventgallery';
            $category->title            = 'Uncategorised';
            $category->description      = '';
            $category->published        = 1;
            $category->access           = 1;
            $category->params           = '{"category_layout":"","image":""}';
            $category->metadata         = '{"author":"","robots":""}';
            $category->metadesc         = '';
            $category->metakey          = '';
            $category->language         = '*';
            $category->checked_out_time = JFactory::getDbo()->getNullDate();
            $category->version          = 1;
            $category->hits             = 0;
            $category->modified_user_id = 0;
            $category->checked_out      = 0;

            // Set the location in the tree
            $category->setLocation(1, 'last-child');

            // Check to make sure our data is valid
            if (!$category->check())
            {
                JFactory::getApplication()->enqueueMessage(JText::sprintf('COM_EVENTGALLERY_ERROR_INSTALL_CATEGORY', $category->getError()));

                return;
            }

            // Now store the category
            if (!$category->store(true))
            {
                JFactory::getApplication()->enqueueMessage(JText::sprintf('COM_EVENTGALLERY_ERROR_INSTALL_CATEGORY', $category->getError()));

                return;
            }

            // Build the path for our category
            $category->rebuildPath($category->id);
        }
    }

    /**
     * Performs the database update operations.
     *
     * @param $fixSchemaOnly
     * @return bool
     */
    private function updateDatabase($fixSchemaOnly) {
        $db = JFactory::getDbo();

        // Get the folder from the database name
        $sqlFolder = $db->name;

        if ($sqlFolder == 'mysqli' || $sqlFolder == 'pdomysql')
        {
            $sqlFolder = 'mysql';
        }
        elseif ($sqlFolder == 'sqlsrv')
        {
            $sqlFolder = 'sqlazure';
        }

        $folder = JPATH_ADMINISTRATOR . '/components/com_eventgallery/sql/updates/';

        $files = JFolder::files(
            $folder . '/' . $sqlFolder, '\.sql$', 1, true, array('.svn', 'CVS', '.DS_Store', '__MACOSX'), array('^\..*', '.*~'), true
        );

        $currentVersion = $this->getSchemaVersion();



        if (!$changeSet = $this->getItems())
        {
            return false;
        }

        if (!$fixSchemaOnly) {
            $targetVersion = $changeSet->getSchema();

            $updateQueries = $this->getUpdateQueries($files);

            JFactory::getApplication()->enqueueMessage("Updated Event Gallery Database from $currentVersion to $targetVersion");

            foreach ($updateQueries as $obj) {
                $changeItem = JSchemaChangeitem::getInstance($db, $obj->file, $obj->updateQuery);


                $version = basename($obj->file, '.sql');
                if (version_compare($currentVersion, $version) == -1) {
                    echo "<pre>";
                    echo $obj->file;
                    echo "\n\n";
                    echo $changeItem->updateQuery;
                    $query = $changeItem->db->convertUtf8mb4QueryToUtf8($changeItem->updateQuery);

                    $changeItem->db->setQuery($query);
                    try {
                        $changeItem->db->execute();
                    } catch (Exception $e) {
                        JFactory::getApplication()->enqueueMessage($e->getMessage(), 'warning');
                    }

                    echo "</pre>";
                }
            }
        }

        $this->fixSchemaVersion($changeSet);

        return true;
    }

    /**
     * Gets the changeset object.
     *
     * @return  JSchemaChangeset
     */
    public function getItems()
    {

        $db = JFactory::getDbo();

        $folder = JPATH_ADMINISTRATOR . '/components/com_eventgallery/sql/updates/';

        try
        {
            $changeSet = JSchemaChangeset::getInstance($db, $folder);
        }
        catch (RuntimeException $e)
        {
            JFactory::getApplication()->enqueueMessage($e->getMessage(), 'warning');

            return false;
        }
        return $changeSet;
    }

    /**
     * Get version from #__schemas table.
     *
     * @return  mixed  the return value from the query, or null if the query fails.
     *
     * @throws Exception
     */
    public function getSchemaVersion()
    {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true)
            ->select('version_id')
            ->from($db->quoteName('#__schemas'))
            ->where('extension_id = ' . $db->quote($this->getExtensionId()));
        $db->setQuery($query);
        $result = $db->loadResult();

        return $result;
    }

    /**
     * Fix schema version if wrong.
     *
     * @param   JSchemaChangeSet  $changeSet  Schema change set.
     *
     * @return   mixed  string schema version if success, false if fail.
     */
    public function fixSchemaVersion($changeSet)
    {
        // Get correct schema version -- last file in array.
        $schema = $changeSet->getSchema();
        $extensionid = $this->getExtensionId();

        // Check value. If ok, don't do update.
        if ($schema == $this->getSchemaVersion())
        {
            return $schema;
        }

        // Delete old row.
        $db = JFactory::getDbo();
        $query = $db->getQuery(true)
            ->delete($db->quoteName('#__schemas'))
            ->where($db->quoteName('extension_id') . ' = ' . $db->quote($extensionid));
        $db->setQuery($query);
        $db->execute();

        // Add new row.
        $query->clear()
            ->insert($db->quoteName('#__schemas'))
            ->columns($db->quoteName('extension_id') . ',' . $db->quoteName('version_id'))
            ->values($db->quote($extensionid) . ', ' . $db->quote($schema));
        $db->setQuery($query);

        try
        {
            $db->execute();
        }
        catch (JDatabaseExceptionExecuting $e)
        {
            return false;
        }

        return $schema;
    }

    /**
     * Get array of SQL queries
     *
     * @param   array  $sqlfiles  Array of .sql update filenames.
     *
     * @return  array  Array of stdClass objects where:
     *                    file=filename,
     *                    update_query = text of SQL update query
     *
     * @since   2.5
     */
    private function getUpdateQueries(array $sqlfiles)
    {
        // Hold results as array of objects
        $result = array();

        foreach ($sqlfiles as $file)
        {
            $buffer = file_get_contents($file);

            // Create an array of queries from the sql file
            $queries = JDatabaseDriver::splitSql($buffer);

            foreach ($queries as $query)
            {
                $fileQueries = new stdClass;
                $fileQueries->file = $file;
                $fileQueries->updateQuery = $query;
                $result[] = $fileQueries;
            }
        }

        return $result;
    }

}