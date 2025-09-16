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

abstract class EventgalleryLibraryCommonModule
{

    /**
     * @var string defines the cachegroup for the modules
     */
    protected $cachegroup = 'eventgallery_fixme';

    /**
     * @var JCacheControllerCallback
     */
    protected $cache;

    /**
     * contains the last cache result object
     *
     * @var mixed
     */
    protected $currentResult;

    /**
     * EventgalleryLibraryCommonModule constructor.
     */
    public function __construct()
    {
        /**
         * @var $cache JCacheControllerCallback
         */
        $this->cache = JFactory::getCache($this->cachegroup);
        $language = JFactory::getLanguage();
        $language->load('com_eventgallery');
        $language->load('com_eventgallery' , JPATH_BASE.DIRECTORY_SEPARATOR.'language'.DIRECTORY_SEPARATOR.'overrides');
        $language->load('com_eventgallery' , JPATH_BASE.DIRECTORY_SEPARATOR.'components'.DIRECTORY_SEPARATOR.'com_eventgallery');
    }

    /**
     * Execute this method to render a module within a class context without using the cache
     *
     * @param $params
     * @return mixed
     */
    public function renderModule($params, $module) {
        $user = JFactory::getUser();
        $usergroups = JUserHelper::getUserGroups($user->id);
        $wrkaroundoptions = array('nopathway' => 1, 'nohead' => 0, 'nomodules' => 1, 'modulemode' => 1, 'mergehead' => 1);
        $wrkarounds = true;
        $id = false;

        $this->cache->setCaching($params->get('cache', 1) == 1);
        $this->cache->setLifeTime((int)$params->get('cache_time', 900));
        $this->currentResult = $this->cache->get(array($this,'uncachedRenderModule'), array($params, $module, $usergroups, EventgalleryHelpersFolderprotection::getUnlockedFoldersJSON()), $id, $wrkarounds, $wrkaroundoptions);

    }

    /**
     * Execute this method to render a module within a class context without using the cache
     *
     * @param $params
     * @param $module
     * @param $usergroups
     * @param $unlockedFoldersJSONString a String which prevents caching issues. We always need to take the usergroups and the unlocked folders into accoutn
     * @return mixed
     */
    public abstract function uncachedRenderModule($params, $module, $usergroups, $unlockedFoldersJSONString);

    /**
     * @param $tpl
     * @return string
     * @throws Exception
     */
    public function loadSnippet($tpl)
    {
        // Clear prior output
        $this->_output = null;


        $baseDir = JPATH_BASE . '/components/com_eventgallery/views/snippets/tmpl';
        $app = JFactory::getApplication();
        $component = 'com_eventgallery';
        $fallback = JPATH_THEMES . '/' . $app->getTemplate() . '/html/' . $component . '/' . 'snippets';

        $path = array($fallback, $baseDir);

        // Clean the file name
        $file = preg_replace('/[^A-Z0-9_\.-\/]/i', '', $tpl);
        $tpl = isset($tpl) ? preg_replace('/[^A-Z0-9_\.-]/i', '', $tpl) : $tpl;


        // Load the template script
        jimport('joomla.filesystem.path');
        $filetofind = $this->_createFileName('file', array('name' => $file));
        $template = JPath::find($path, $filetofind);

        // If alternate layout can't be found, fall back to default layout
        if ($template == false)
        {
            throw new Exception(JText::sprintf('JLIB_APPLICATION_ERROR_LAYOUTFILE_NOT_FOUND', $file), 500);
        }


        // Unset so as not to introduce into template scope
        unset($tpl);
        unset($file);

        // Never allow a 'this' property
        if (isset($this->this))
        {
            unset($this->this);
        }

        // Start capturing output into a buffer
        ob_start();

        // Include the requested template filename in the local scope
        // (this will execute the view logic).
        include $template;

        // Done with the requested template; get the buffer and
        // clear it.
        $this->_output = ob_get_contents();
        ob_end_clean();

        return $this->_output;


    }

    /**
     * Create the filename for a resource
     *
     * @param   string  $type   The resource type to create the filename for
     * @param   array   $parts  An associative array of filename information
     *
     * @return  string  The filename
     */
    protected function _createFileName($type, $parts = array())
    {
        switch ($type)
        {
            case 'template':
                $filename = strtolower($parts['name']) . '.' . $this->_layoutExt;
                break;

            default:
                $filename = strtolower($parts['name']) . '.php';
                break;
        }

        return $filename;
    }

    /**
     * Method to escape output. Code-Copy from JLayoutBase
     *
     * @param   string  $output  The output to escape.
     *
     * @return  string  The escaped output.
     *
     * @since   3.0
     */

    public function escape($output)
    {
        return htmlspecialchars($output, ENT_COMPAT, 'UTF-8');
    }


}
