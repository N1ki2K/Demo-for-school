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

require_once(__DIR__.'/../controller.php');

class EventgalleryControllerImpex extends JControllerForm
{

    protected $default_view = 'impex';


	
	public function cancel($key = null) {
		$this->setRedirect( 'index.php?option=com_eventgallery');
	}

    /**
     * Imports data into the database based on an uploaded zip file.
     */
    public function import() {
        JSession::checkToken();
        $app = JFactory::getApplication();
        // form submit
        $file = $_FILES['importfile'];
        $dryrun = $app->input->getBool('dryrun', false);

        // check if the file does exist
        if ($file['error']!=0) {
            $msg = JText::_('COM_EVENTGALLERY_IMPEX_IMPORT_ERROR_INVALID_FILE');
            $app->enqueueMessage($msg, 'error');
            return $this->display();
        }


        // try to open the zip archive
        $zip = new ZipArchive();
        if ($zip->open($file['tmp_name']) !== true) {
            $msg = JText::_('COM_EVENTGALLERY_IMPEX_IMPORT_ERROR_INVALID_ZIP');
            $app->enqueueMessage($msg, 'error');
            return $this->display();
        }

        $db = JFactory::getDbo();
        $tableList = $this->getTables();
        $msg = "";


        foreach ($tableList as $tableName) {
            $content = $zip->getFromName($tableName.'.txt');

            if ($content === false) {
                continue;
            }

            $data = json_decode($content);

            if (json_last_error() != 0) {
                $msg .= JText::sprintf('COM_EVENTGALLERY_IMPEX_IMPORT_ERROR_JSON', $tableName, json_last_error()) . "<br>";
                continue;
            }

            if ($data == null || count($data)==0 ) {
                $msg .= JText::sprintf('COM_EVENTGALLERY_IMPEX_IMPORT_ERROR_EMPTY', $tableName) . "<br>";
                continue;
            }

            if ($dryrun) {
                $msg .= JText::sprintf('COM_EVENTGALLERY_IMPEX_IMPORT_DRYRUN_INFO', count($data), $tableName) . "<br>";
                continue;
            }

            foreach($data as $row) {
                $query = "replace into ". $db->quoteName($tableName) . " SET ";
                $values = Array();
                foreach($row as $key=>$value) {
                    array_push($values, $db->quoteName($key) . '=' . $db->quote($value));
                }
                $query .= implode(',', $values);
                $db->setQuery($query);
                $db->execute();
                set_time_limit(10);
            }

            $msg .= JText::sprintf('COM_EVENTGALLERY_IMPEX_IMPORT_SUCCESS_INFO', count($data), $tableName) . "<br>";

        }
        $app->enqueueMessage($msg);
        return $this->display();
    }

    /**
     * Exports the event gallery database content
     */
    public function export() {

        JSession::checkToken();

        $componentId = JComponentHelper::getComponent('com_eventgallery')->id;
        $extension = JTable::getInstance('extension');
        $extension->load($componentId);
        $data = json_decode($extension->manifest_cache, true);
        $version = str_replace('.', '_', $data['version']);


    	$date = new DateTime();
    	$filename = 'eventgallery-'.$version.'-export-' . date_format($date, 'Y-m-d_H-i-s') . '.zip';
        $tmpfname = tempnam(sys_get_temp_dir(), 'EG');

        // initialize the zip archive
        $zip = new ZipArchive;
        if ($zip->open($tmpfname) !== TRUE) {
            echo 'create zip archive failed';
            die();
        }
		
        $db = JFactory::getDbo();
        $tableList = $this->getTables();


        foreach ($tableList as $tableName) {

            $query = $db->getQuery(true);


            $query->select('*')->from($db->quoteName($tableName));

            // cart table
            if ($tableName=='#__eventgallery_cart') {
                continue;
            }

            // line items
            if ($tableName=='#__eventgallery_imagelineitem' ||
                $tableName=='#__eventgallery_servicelineitem' ) {


                $query = $db->getQuery(true);
                $query->select('li.*')
                    ->from($db->quoteName($tableName). ' as li')
                    ->from($db->quoteName('#__eventgallery_order'). ' as o')
                    ->where('o.id=li.lineitemcontainerid');
            }

            //sequence
            // we just need the highest number here. The LIMIT actually just a hack
            // to keep the rest of the logic generic
            if ($tableName == '#__eventgallery_sequence') {
                $query = $db->getQuery(true);
                $query->select('*')
                    ->from($db->quoteName($tableName))
                    ->order('id desc LIMIT 1');
            }

            $db->setQuery($query);
            $rows = $db->loadObjectList();
            $zip->addFromString($tableName.'.txt', json_encode($rows, JSON_PRETTY_PRINT ));
        }

        $zip->close();

		$size = filesize($tmpfname);
		$fp   = fopen($tmpfname, "rb");
		if (!($size && $fp)) {
		    // Error.
		    die('encountered export error.');
		}

        header('Content-type: application/zip');
		header("Content-Length: " . $size);
        header('Content-Transfer-Encoding: Binary');
        header('Content-disposition: attachment; filename="' . $filename . '"');
		fpassthru($fp);

        die();
    }


    /**
     * determines all Event Gallery tables and returns their names in the format #__eventgallery_[name}
     *
     * @return array
     */
    private function getTables() {
        $tables = Array();

        $db = JFactory::getDbo();
        $prefix = $db->getPrefix();
        $tableList = $db->getTableList();


        foreach ($tableList as $tableName) {
            if (preg_match("/^" . $prefix . "eventgallery_.*/", $tableName)) {
                $abstractTableName = preg_replace("/^[^_]+_/","#__",$tableName);
                array_push($tables, $abstractTableName);
            }
        }

        return $tables;
    }
}
