<?php
/**
 * @package		Profiles
 * @subpackage	filemanger
 * @copyright	Copyright (C) 2013 - 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 * @license		Libraries can be under a different license in other environments
 * @license		Media files owned and created by Mad4Media such as 
 * @license 	Javascript / CSS / Shockwave or Images are licensed under GFML (GPL Friendly Media License). See GFML.txt.
 * @license		3rd party scripts are under the license of the copyright holder. See source header or license text file which is included in the appropriate folders
 * @version		1.0
 * @link		http://www.mad4media.de
 * Creation date 2013/02
 */

//CUSTOMPLACEHOLDER
//CUSTOMPLACEHOLDER2

defined('_JEXEC') or die;

if(!defined('DS')) define('DS',DIRECTORY_SEPARATOR);


$thisFileInfo = pathinfo(__FILE__);
define('_FM_HOME_DIR', $thisFileInfo['dirname']);
define('_FM_LANGUAGE_DIR', _FM_HOME_DIR. DS.'languages');
define('_FM_TMP_DIR', _FM_HOME_DIR. DS.'tmp');
define('_FM_COOKIE_EXPIRE', time()+60*60*24*60);

$goBackUrl = _CLOSE_HREF;

if(! function_exists('includePeer')){
	function includePeer($path="general"){
		$_path = _FM_HOME_DIR . DS . 'symbiosis' . DS . _FM_PEER .  DS . str_replace('.', DS , $path) . '.php';
		if(file_exists($_path)){
			require_once($_path);	
		}
	}
}

// include the general peer
includePeer("general");


require_once 'includes'.DS.'functions.php';
require_once 'classes'.DS.'file.php';
require_once 'classes'.DS.'mdo.php';
require_once 'classes'.DS.'config.php';
// Init config
$cfg = MConfig::instance();

require_once 'classes'.DS.'rights.php';
require_once 'classes'.DS.'roots.php';

$roots = MRoots::getInstance();
if($roots->getCount() == 0){
	require_once 'includes'.DS.'nofolders.php';
}

MRights::loadAll();

// Defining the demo mode
define('_FM_IS_DEMO',   ((bool) $cfg->get("is_demo",false) && ! MRights::userIsRoot()) ? true : false   ); 

require_once 'classes'.DS.'object.php';
require_once 'classes'.DS.'container.php';
require_once 'classes'.DS.'view.php';
require_once 'classes'.DS.'task.php';
require_once 'includes'.DS.'version.php';
require_once 'includes'.DS.'saved.php';
require_once 'includes'.DS.'helpers.php';
require_once 'includes'.DS.'icons.php';
require_once 'includes'.DS.'filesystem.php';
require_once 'classes'.DS.'request.php';
require_once 'classes'.DS.'text.php';
require_once 'classes'.DS.'validate.php';
require_once 'classes'.DS.'url.php';
require_once 'classes'.DS.'forms.php';
require_once 'classes'.DS.'pclzip'.DS.'pclzip.lib.php';



// Accessing Folders which can be processed
$rootsInfo = $roots->getFolderAccess();
if(!$rootsInfo->count && ! MRights::userIsRoot() ){
	include_once 'templates' . DS . 'noaccess.php';
	die();
}

$GLOBALS['folderAccess'] = $rootsInfo->paths;
$GLOBALS['folderAccessNames'] = $rootsInfo->names;

// printPre($GLOBALS['folderAccess']);

// printPre($GLOBALS['folderAccessNames']);

// die();
$GLOBALS['currentMainFolder'] = MRequest::int("selectMyFolder",-1);

if($GLOBALS['currentMainFolder'] === -1){
	$GLOBALS['currentMainFolder'] = MPeer::getSessionInfo("currentFolder",0);
}else{
	MPeer::setSessionInfo("currentFolder", $GLOBALS['currentMainFolder'] );
}
if(! array_key_exists($GLOBALS['currentMainFolder'], $GLOBALS['folderAccess'])){
	$tmp = 0;
	foreach ($GLOBALS['folderAccess'] as $key=>$value){
		$tmp = (int) $key;
		break;
	}
	MPeer::setSessionInfo("currentFolder", $tmp );
	$GLOBALS['currentMainFolder'] = $tmp;	
}



if(isset($GLOBALS['folderAccess'][$GLOBALS['currentMainFolder']])){
	define('_START_FOLDER',$GLOBALS['folderAccess'][$GLOBALS['currentMainFolder']]);
}else{
	die("No such folder found!");
}

define('_ROOTFOLDERID', (int) $GLOBALS['currentMainFolder']);

// Prepaired for further versions of Profiles
define("_FM_USE_FTP",false);

$mimeTypes = MFile::parseData(_FM_HOME_DIR.DS."data".DS."suffix.ini", true, false);
$GLOBALS['mimeTypes'] = $mimeTypes;

//Task
$task = trim( MRequest::cmd('task') );
$GLOBALS['task'] = $task;

//View
$view = trim( MRequest::cmd('view','default') );
$GLOBALS['view'] = $view;

//Check if this is a first time call
if(! MFile::is(_FM_HOME_DIR . DS."data" . DS . "diagnostic_log.php")){
	$view = 'diagnostics';
	$GLOBALS['view'] = $view;
}

//Check root only views
$rootOnlyViews = array("rootsandrights","config","diagnostics");
if(in_array($view, $rootOnlyViews) && ! MRights::userIsRoot() && ! _FM_IS_DEMO ){
	ob_start();
	include ("templates".DS."noaccess.php");
	$dieOut = ob_get_clean();
	ob_get_clean();
	die($dieOut);	
}

//File
$file = MRequest::clean('file');
$file = urldecode(myStripSlashes($file));
$file = MRequest::filter($file,MREQUEST_CLEANPATH);
$GLOBALS['file'] = $file;

//Destination
$destination = urldecode(MRequest::clean('destination'));
$destination = MRequest::filter($destination,MREQUEST_CLEANPATH);
$destination = _START_FOLDER . myStripSlashes($destination);
$GLOBALS['destination'] = $destination;

//New 
$new = MRequest::clean('new');
$new = MRequest::filter($new,MREQUEST_CLEANPATH);
$GLOBALS['new'] = $new;

//Dir
$dir = _START_FOLDER . myStripSlashes(urldecode(strip_tags(MRequest::raw('dir'))));
$dir = MRequest::filter($dir,MREQUEST_CLEANPATH);
$GLOBALS['dir'] = $dir;

// Image View State
$imageViewState = MRequest::int("imageviewstate",-1);
if($imageViewState == -1){
	if(isset($_COOKIE["mtoggleimageview"])){
		$imageViewState =  (int) $_COOKIE["mtoggleimageview"];
	}else{
		$imageViewState = 0;
		setcookie("mtoggleimageview", $imageViewState, _FM_COOKIE_EXPIRE);
	}
}else{
	setcookie("mtoggleimageview", $imageViewState, _FM_COOKIE_EXPIRE);
}
define('_M_IMAGE_VIEW_STATE', $imageViewState);



//Security processing
require_once 'includes'.DS.'secure.php';



//Files View
$filesView = MRequest::int('filesview',null);
if($filesView !== null){
	MRequest::setCookie('filesView', $filesView);
	$GLOBALS['filesView'] = $filesView;
}else{
	$GLOBALS['filesView'] = MRequest::getCookie('filesView',1, MREQUEST_INT);
}

// Processing the view
$viewName = $view."view";
if(file_exists(_FM_HOME_DIR.DS.'view'.DS.$viewName.'.php')){
	require_once 'view'.DS.$viewName.'.php';
}else $viewName = null;

// Processing controller
$controllerName = ($view=='default')?'defaulttask':$view;
if(file_exists(_FM_HOME_DIR.DS.'controller'.DS.$controllerName.'.php')){
	require_once 'controller'.DS.$controllerName.'.php';
	if(class_exists($controllerName)){
		if (version_compare(PHP_VERSION, '5.0.3', '>=')) {
			if(is_subclass_of($controllerName, 'MTask')){
				new $controllerName($viewName);	
			}
		}else{
			new $controllerName($viewName);
		}
	}
}else{
	define('_FM_NO_CONTROLLER',1);
}


?>