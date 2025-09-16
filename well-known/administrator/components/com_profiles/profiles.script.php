<?php 
/**
* @name MOOJ Proforms 
* @version 1.2
* @package proforms
* @copyright Copyright (C) 2008-2012 Mad4Media. All rights reserved.
* @author Dipl. Inf.(FH) Fahrettin Kutyol
* @license http://www.gnu.org/copyleft/gpl.html GNU/GPL
* Please note that some Javascript files are not under GNU/GPL License.
* These files are under the mad4media license
* They may edited and used infinitely but may not repuplished or redistributed.  
* For more information read the header notice of the js files.
**/

defined('_JEXEC') or die('Direct Access to this location is not allowed.');

class MRights{
		public static function userIsRoot(){return true;}
	}	
	
class com_profilesInstallerScript{	
	
	public function postflight(){	
		define('_FM_COM', 'com_profiles');
		if(!defined('DS')) define('DS',DIRECTORY_SEPARATOR);	
		
		$lang = JFactory::getLanguage();
		define('_MY_LANGUAGE',$lang->getTag());
		define('_CLOSE_HREF','index.php');
			
		$ABSOLUTE_URI = (getenv('HTTPS') == 'on') ? substr_replace( str_replace("http://", "https://", JURI::base() ), '', -1, 1) : substr_replace(JURI::base(), '', -1, 1) . "/";
		define('_FM_ABSOLUTE_URI',$ABSOLUTE_URI);
		define('_FM_HOME_URL', "index.php?option="._FM_COM."&format=raw");
		define('_FM_HOME_FOLDER','components/'._FM_COM.'/filemanager');
		define('_FM_HOME_DIR', JPATH_ROOT . '/administrator/components/'._FM_COM.'/filemanager');
		define('_FM_LANGUAGE_DIR', _FM_HOME_DIR. DS.'languages');
		define('_FM_COOKIE_EXPIRE', time()+60*60*24*60);
		// Define Peer
		define('_FM_PEER','joomla');
			
		require_once _FM_HOME_DIR . DS . 'classes'.DS.'file.php';
		require_once _FM_HOME_DIR . DS . 'classes'.DS.'text.php';
		require_once _FM_HOME_DIR . DS .'includes'.DS.'version.php';
		
		$infoTemplates = _FM_HOME_DIR . DS ."languages" . DS . "info";
		
		$infoPath = $infoTemplates . DS . _MY_LANGUAGE . ".php" ;
		if(!MFile::is($infoPath)){
			$infoPath = $infoTemplates . DS . "en-GB.php";
		}
		
		$isWelcome = 1;
		$jed = null;
		$version=null;
		require_once $infoPath;
		
	}  //EOF install
	
	function uninstall(){		
		echo '<h1>You have successfully uninstalled ProFiles</h1><br/>';
	}//EOF uninstall
	


}//EOF class
