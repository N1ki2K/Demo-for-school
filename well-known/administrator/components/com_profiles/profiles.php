<?PHP
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


$plattform = "STANDALONE";
if(defined('_JEXEC')) $plattform = "JOOMLA";
else define('_JEXEC',1);


switch ($plattform){
	
	default:
	case 'STANDALONE':
		break;
		//EOF STANDALONE
		
	case 'JOOMLA':
		
		define('_FM_COM', 'com_profiles');
		
		$format = JRequest::getCmd("format",null);
		if($format != "raw") {
		
			$uri = JURI::getInstance();
			$app = JFactory::getApplication();
		
			$app->redirect(JRoute::_( $uri ."&format=raw"));
		}
		
		$lang = JFactory::getLanguage();
		define('_MY_LANGUAGE',$lang->getTag());
		define('_CLOSE_HREF','index.php');
			
		$ABSOLUTE_URI = (getenv('HTTPS') == 'on') ? substr_replace( str_replace("http://", "https://", JURI::base() ), '', -1, 1) : substr_replace(JURI::base(), '', -1, 1) . "/";
		define('_FM_ABSOLUTE_URI',$ABSOLUTE_URI);
		define('_FM_HOME_URL', "index.php?option="._FM_COM."&format=raw");
		define('_FM_HOME_FOLDER','components/'._FM_COM.'/filemanager');
	
		define('_FM_NO_FOLDER_FALLBACK_NAME',"Joomla");
		define('_FM_NO_FOLDER_FALLBACK_PATH',str_replace( '\\', "/", JPATH_ROOT) );
	
		// Define Sandbox Path
		define('_FM_SANDBOX', JPATH_ROOT ."/administrator/components/"._FM_COM."/sandbox");
		
		// Define Peer
		define('_FM_PEER','joomla');
		
		
		
		break;	
		//EOF JOOMLA
		
}//EOF plattform switch

// Start Bootstrap	
require('filemanager/bootstrap.php');
