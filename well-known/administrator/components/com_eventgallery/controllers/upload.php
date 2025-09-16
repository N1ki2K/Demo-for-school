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
require_once JPATH_ROOT.'/components/com_eventgallery/config.php';
require_once(__DIR__.'/../controller.php');

class EventgalleryControllerUpload extends JControllerForm
{

    protected $default_view = 'upload';

	public function getModel($name = 'Event', $prefix ='EventgalleryModel', $config = array('ignore_request' => true))
    {
        $model = parent::getModel($name, $prefix, $config);
        return $model;
    }

	/**
	 * function to provide the upload-View 
	 */
	function upload()
	{
        $this->display();
	}


	function uploadFileByAjax() {

		$user = JFactory::getUser();
		$params = JComponentHelper::getParams('com_eventgallery');
		$use_htacces_to_protect_original_files = $params->get('use_htacces_to_protect_original_files', 1) == 1;

		@mkdir(COM_EVENTGALLERY_IMAGE_FOLDER_PATH);
        EventgalleryLibraryCommonSecurity::protectFolder(COM_EVENTGALLERY_IMAGE_FOLDER_PATH);
        EventgalleryLibraryCommonSecurity::writeIndexHtmlFile(COM_EVENTGALLERY_IMAGE_FOLDER_PATH);

		$folder = $this->input->getString('folder');
		$folder=JFile::makeSafe($folder);
		

		$path=COM_EVENTGALLERY_IMAGE_FOLDER_PATH.$folder.DIRECTORY_SEPARATOR ;
		@mkdir($path);

		EventgalleryLibraryCommonSecurity::writeIndexHtmlFile($path);

		if ($use_htacces_to_protect_original_files) {
		    EventgalleryLibraryCommonSecurity::protectFolder($path);
		}

		$fn = $this->input->getString('file', false);
		$fn=JFile::makeSafe($fn);

		$allowedExtensions = Array('jpg', 'gif', 'png', 'jpeg');

		if (!in_array(strtolower( pathinfo ( $fn , PATHINFO_EXTENSION) ), $allowedExtensions) ) {
            echo "Unsupported file extension in $fn";
            die();
		}

		$uploadedFiles = Array();

		$ajaxMode = $this->input->getString('ajax',false);
		echo $fn." done";

		if ($fn) {

			// AJAX call
			file_put_contents(
				$path. $fn,
				file_get_contents('php://input')
			);
			#echo "$fn uploaded in folder $folder";
			echo '<img alt="Done '.$fn.'" class="thumbnail" src="'.JUri::base().("../components/com_eventgallery/helpers/image.php?folder=".$folder."&file=".$fn."&width=100&height=50&site=1").'" />';
			array_push($uploadedFiles, $fn);

		}
		else {

			// form submit
			$files = $_FILES['fileselect'];

			foreach ($files['error'] as $id => $err) {
				if ($err == UPLOAD_ERR_OK) {
					$fn = $files['name'][$id];
					$fn = str_replace('..','',$fn);
					move_uploaded_file(
						$files['tmp_name'][$id],
						$path. $fn
					);
					array_push($uploadedFiles, $fn);
				}
			}

		}

		$db = JFactory::getDbo();
		foreach($uploadedFiles as $uploadedFile) {
			if (file_exists($path.$uploadedFile)) {


                /** @noinspection PhpUnusedLocalVariableInspection */
                @list($width, $height, $type, $attr) = getimagesize($path.$uploadedFile);
                $query = $db->getQuery(True)
                    ->select('count(1)')
                    ->from($db->quoteName('#__eventgallery_file'))
                    ->where('folder=' . $db->quote($folder))
                    ->where('file=' . $db->quote($uploadedFile));
                $db->setQuery($query);
                if ($db->loadResult() == 0) {
                    $query = $db->getQuery(true)
                        ->insert($db->quoteName('#__eventgallery_file'))
                        ->columns('folder,file,userid,created,modified,ordering')
                        ->values(
                            $db->quote($folder).','.
                            $db->quote($uploadedFile).','.
                            $db->quote($user->id).','.
                            'now(),now(),0');
                }else{
                    $query = $db->getQuery(true)
                        ->update($db->quoteName('#__eventgallery_file'))
                        ->set('userid='.$db->quote($user->id))
                        ->set('created=now()')
                        ->set('modified=now()')

                        ->where('folder='.$db->quote($folder))
                        ->where('file='.$db->quote($uploadedFile));
                }


				$db->setQuery($query);
				$db->execute();
				EventgalleryLibraryFileLocal::updateMetadata($path.$uploadedFile, $folder, $uploadedFile);
			} 
		}

		 
		if (!$ajaxMode) {
			$msg = JText::_( 'COM_EVENTGALLERY_EVENT_UPLOAD_COMPLETE' );
			$this->setRedirect( 'index.php?option=com_eventgallery&task=upload', $msg );
		}

		die();

	}
	
	public function cancel($key = NULL) {
		$this->setRedirect( 'index.php?option=com_eventgallery&view=events');
	}
}
