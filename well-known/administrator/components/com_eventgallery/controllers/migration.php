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

jimport( 'joomla.application.component.controllerform' );

class EventgalleryControllerMigration extends JControllerForm
{
    /**
     *
     * migrate the old foldertags into Joomla! tags
     * @deprecated
     * @param bool $die defines if we die() after the execution. Useful if we want to trigger the task manually.
     */
    public function migrateTags($die = true) {

        $db = JFactory::getDbo();

        /**
         * Migrate Tags
         */

        echo "<h1>Tag Migration</h1>";
        $tags = $this->getFolderTags();
        $newTags = array();

        echo "<h2>Creating new Joomla! Tags </h2>";
        echo "Event Gallery Tags: " . implode(', ', $tags) . '<br>';

        foreach($tags as $tag) {
            array_push($newTags, '#new#' . $tag);
        }

        $helperTags = new JHelperTags();

        $newTags = $helperTags->createTagsFromField($newTags);

        echo "Joomla! Tag IDs: " . implode(', ', $newTags) . '<br>';

        echo "<hr>";

        echo "<h2>Add new Joomla! tags to events</h2>";



        $query = $db->getQuery(true);
        $query->select('id, folder')
            ->from('#__eventgallery_folder');

        $db->setQuery($query);
        $results = $db->loadObjectList();

        $tags = $this->getTags();

        echo "<hr><pre>";
        print_r($tags);
        echo "</pre></hr>";


        foreach($results as $row) {

            $folderid = $row->id;

            /**
             * @var EventgalleryTableFolder $table
             */
            $table = JTable::getInstance('Folder', 'EventgalleryTable');
            $table->reset();

            $result = $table->load($folderid);
            if (!$result) {
                continue;
            }


            $oldTags = $this->splitTags($table->foldertags);

            if (count($oldTags) == null) {
                continue;
            }

            echo "<p>Migrating <strong>" . $table->folder . "</strong></p>";

            $newTags = array();
            foreach($oldTags as $oldtag) {
                echo "&nbsp;&nbsp;&nbsp;&nbsp;old Tag is $oldtag, new tag is " . $tags[strtolower($oldtag)] . "<br>";
                array_push($newTags, $tags[strtolower($oldtag)]);
            }

            echo "    transform " . $table->foldertags . ' to ' . implode(', ', $newTags) . '<br>';
            $table->newTags = $newTags;
            $table->store();
        }

        /**
         * Migrate Menu Item
         */

        echo "<h2>Migrating Menu Items</h2>";

        $query = $db->getQuery(true);
        $query->select('id, link, title, params')
            ->from('#__menu')
            ->where('link like '. $db->quote("%com_eventgallery%"));

        $db->setQuery($query);
        $menuitems = $db->loadObjectList();

        foreach($menuitems as $menuitem) {
            /**
             * @var Joomla\Registry\ $params
             */
            $params = new JRegistry();
            $params->loadString($menuitem->params);
            $oldTags = $params->get("tags");
            if (empty($oldTags)) {
                continue;
            }

            echo "<p>Migrating <strong>" . $menuitem->title . "</strong></p>";

            $newTags = array();
            if (is_string($oldTags)) {
                foreach ($this->splitTags($oldTags) as $oldtag) {
                    array_push($newTags, $tags[strtolower($oldtag)]);
                }

                echo "    transform " . $oldTags . ' to ' . implode(', ', $newTags) . '<br>';


                $params->set("tags", $newTags);

                $query = $db->getQuery(true);
                $query->update('#__menu')
                    ->set('params = ' . $db->quote($params->toString()))
                    ->where('id=' . $db->quote($menuitem->id));

                $db->setQuery($query);
                $db->execute();
            } else {
                echo "already done.<br>";
            }
        }

        /**
         * Migrate Module Configuration
         */

        echo "<h2>Migrating Modules</h2>";

        $query = $db->getQuery(true);
        $query->select('id, module, title, params')
            ->from('#__modules')
            ->where('module like '. $db->quote("%eventgallery%"));

        $db->setQuery($query);
        $modules = $db->loadObjectList();

        foreach($modules as $module) {
            /**
             * @var Joomla\Registry\ $params
             */
            $params = new JRegistry();
            $params->loadString($module->params);
            $oldTags = $params->get("tags");
            if (empty($oldTags)) {
                continue;
            }

            echo "<p>Migrating <strong>" . $module->title . "</strong></p>";

            $newTags = array();
            if (is_string($oldTags)) {
                foreach ($this->splitTags($oldTags) as $oldtag) {
                    array_push($newTags, $tags[strtolower($oldtag)]);
                }

                echo "    transform " . $oldTags . ' to ' . implode(', ', $newTags) . '<br>';

                $params->set("tags", $newTags);

                $query = $db->getQuery(true);
                $query->update('#__modules')
                    ->set('params = ' . $db->quote($params->toString()))
                    ->where('id=' . $db->quote($module->id));

                $db->setQuery($query);
                $db->execute();
            } else {
                echo "already done<br>";
            }

        }

        /**
         * Migrate Component Configuration
         */

        echo "<h2>Migrating Component Configuration</h2>";

        $query = $db->getQuery(true);
        $query->select('extension_id, element, type, params')
            ->from('#__extensions')
            ->where('element = ' . $db->quote('com_eventgallery'))
            ->where('type =' . $db->quote('component'));

        $db->setQuery($query);
        $extensions = $db->loadObjectList();

        foreach($extensions as $extension) {
            /**
             * @var Joomla\Registry\ $params
             */
            $params = new JRegistry();
            $params->loadString($extension->params);
            $oldTags = $params->get("tags");
            if (empty($oldTags)) {
                continue;
            }

            echo "<p>Migrating <strong>" . $extension->element . "</strong></p>";

            $newTags = array();
            if (is_string($oldTags)) {
                foreach ($this->splitTags($oldTags) as $oldtag) {
                    array_push($newTags, $tags[strtolower($oldtag)]);
                }

                echo "    transform " . $oldTags . ' to ' . implode(', ', $newTags) . '<br>';

                $params->set("tags", $newTags);

                $query = $db->getQuery(true);
                $query->update('#__extensions')
                    ->set('params = ' . $db->quote($params->toString()))
                    ->where('extension_id=' . $db->quote($extension->extension_id));

                $db->setQuery($query);
                $db->execute();
            } else {
                echo "already done<br>";
            }

        }

        if ($die) {
            die();
        }
    }

    /**
     * gets all Joomla tags in the system in an array format path=>id
     * @deprecated
     * @return array
     */
    private function getTags() {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);


        // Select the required fields from the table.
        $query->select('id, path');
        $query->from('#__tags');
        $db->setQuery($query);
        $result = $db->loadObjectList();

        $tags = array();

        foreach($result as $row) {
            $tags[$row->path] = $row->id;
            // seems that sometimes the _ is converted to a - so we add both foo_bar and foo-bar to the lookup array.
            $tags[str_replace("-", "_", $row->path)] = $row->id;

        }

        return $tags;
    }

    /**
     * Get all Folder Tags
     * @deprecated
     * @return array
     */

    private function getFolderTags()
    {

        $db = JFactory::getDbo();
        $query = $db->getQuery(true);

        $query->select('foldertags');
        $query->from('#__eventgallery_folder');

        $db->setQuery($query);
        $rawtags = $db->loadObjectList();

        $tags = array();

        foreach ($rawtags as $rawtag) {
            $tags = array_merge($tags, $this->splitTags($rawtag->foldertags));
        }

        $tags = array_unique($tags);

        $result = array();
        foreach ($tags as $tag) {
            $result[$tag] = $tag;
        }

        unset($result['']);

        asort($result);

        return $result;
    }

    /**
     * Splits a tag string into an array of tags. Tags can be separated by space or comma.
     * Does not return empty tags
     * @deprecated
     * @param string $tagString
     * @return array
     */
    public function splitTags($tagString) {
        $tags =  explode(',', str_replace(" ", ",", $tagString));
        array_walk($tags, 'trim');
        $tags = array_unique($tags);
        foreach($tags as $key=>$tag) {
            $content = trim($tag);
            if (empty($content)) {
                unset($tags[$key]);
            }
        }
        return $tags;
    }
}