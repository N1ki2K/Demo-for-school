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

class EventgalleryLibraryCommonView extends JViewLegacy
{

    // a static field to avoid multiple lookups for templates.
    // it should be enough if we found them once
    private static $templateCache = null;

    /**
     * The constructor of this class
     *
     * @param array $config
     */
    public function __construct($config = array())
    {
        // initialize the cache if this did not happen before
        if (self::$templateCache == null) {
            self::$templateCache = Array();
        }

        if (array_key_exists('site_template', $config))
        {
            $this->_site_template = $config['site_template'];
        }
        else
        {
            $this->_site_template = null;
        }

        parent::__construct($config);
    }

    /**
     * Loads a snippet from the snippets folder. Name can contain a slash:
     *  foo/bar will load component/views/snippets/tmpl/foo/bar.php
     *
     * @param string $tpl
     *
     * @return string the output of the template
     * @throws Exception
     */
    public function loadSnippet($tpl)
    {
        // Clear prior output
        $this->_output = null;

        // create a hash of the template to avoid conflicts with the array key in the cache
        $cacheKey = md5($tpl);

        // Clean the file name
        $file = preg_replace('/[^A-Z0-9_\.-\/]/i', '', $tpl);

        // if the cache is not filled for the current template try to get it.
        if ( !isset(self::$templateCache[$cacheKey]) ) {

            $baseDir = $this->_basePath . '/views/snippets/tmpl';
            $component = JApplicationHelper::getComponentName();
            $app = JFactory::getApplication();
            $component = preg_replace('/[^A-Z0-9_\.-]/i', '', $component);

            if ($this->_site_template != null) {
                $fallback = JPATH_SITE . '/templates/' . $this->_site_template . '/html/' . $component . '/' . 'snippets';
            } else {
                $fallback = JPATH_THEMES . '/' . $app->getTemplate() . '/html/' . $component . '/' . 'snippets';
            }


            $path = array($fallback, $baseDir);

            // Load the template script
            jimport('joomla.filesystem.path');
            $filetofind = $this->_createFileName('template', array('name' => $file));
            self::$templateCache[$cacheKey] = JPath::find($path, $filetofind);
        }

        // get the template from the cache
        $template = self::$templateCache[$cacheKey];


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

    public function renderMessages()
    {
        // Get the message queue
        $messages = JFactory::getApplication()->getMessageQueue();

        $lists = array();

        // Build the sorted message list
        if (is_array($messages) && !empty($messages)) {
            foreach ($messages as $msg) {
                if (isset($msg['type']) && isset($msg['message'])) {
                    $lists[$msg['type']][] = $msg['message'];
                }
            }
        }

        $displayData = array(
            'msgList' => $lists,
            'name' => '',
            'params' => '',
            'content' => ''
        );

        return JLayoutHelper::render('joomla.system.message', $displayData);
    }


}
