<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
define('_JEXEC', 1);

// useless, just to satisfy the jedChecker
defined('_JEXEC') or die;


if (!defined('_JDEFINES')) {
    // remove the first 3 folders because
    // we're in a subfolder and have not
    // native Joomla help. Doing this will
    // enable this comonent to run in a subdirectory
    // like http://foo.bar/foobar
    $basefolders = explode(DIRECTORY_SEPARATOR, dirname(__FILE__));
    $basefolders = array_splice($basefolders, 0, count($basefolders) - 3);
    define('JPATH_BASE', implode(DIRECTORY_SEPARATOR, $basefolders));
    require_once JPATH_BASE . '/includes/defines.php';
}

require_once JPATH_BASE . '/includes/framework.php';
require_once JPATH_BASE . '/components/com_eventgallery/config.php';

function image404() {
    header("HTTP/1.0 404 Not Found");
    echo "This image is not available";
    die();
}


$ji	 = new JInput();

$file = $ji->getString('file');
$folder = $ji->getString('folder');
$width = $ji->getInt('width', -1);
$mode = $ji->getString('mode', 'nocrop');
$site = $ji->getInt('site', 0);


$file = str_replace("\.\.", "", $file);
$folder = str_replace("\.\.", "", $folder);
$width = str_replace("\.\.", "", $width);
$mode = str_replace("\.\.", "", $mode);

$file = str_replace("/", "", $file);
$folder = str_replace("/", "", $folder);
$width = str_replace("/", "", $width);
$mode = str_replace("/", "", $mode);


$file = str_replace("\\", "", $file);
$folder = str_replace("\\", "", $folder);
$width = str_replace("\\", "", $width);
$mode = str_replace("\\", "", $mode);


//full means max size.
if (strcmp('full', $mode) == 0) {
    $mode = 'nocrop';
    $width = 5000;
}

require_once JPATH_BASE . '/components/com_eventgallery/helpers/sizeset.php';

$sizeSet = new EventgalleryHelpersSizeset();
$saveAsSize = $sizeSet->getMatchingSize($width);


$basedir = COM_EVENTGALLERY_IMAGE_FOLDER_PATH;
$sourcedir = $basedir . $folder;
$cachebasedir = JPATH_CACHE . DIRECTORY_SEPARATOR . 'com_eventgallery_images' . DIRECTORY_SEPARATOR;
$cachedir = $cachebasedir . $folder;
$cachedir_thumbs = $cachebasedir . $folder;

$image_file = $sourcedir . DIRECTORY_SEPARATOR . $file;
$image_thumb_file = $cachedir_thumbs . DIRECTORY_SEPARATOR . $mode . $saveAsSize . $file;
//$last_modified = gmdate('D, d M Y H:i:s T', filemtime ($image_file));
$last_modified = gmdate('D, d M Y H:i:s T', mktime(0, 0, 0, 1, 1, 1998));

define('JPATH_COMPONENT', JPATH_SITE . DIRECTORY_SEPARATOR . 'components' .  DIRECTORY_SEPARATOR . 'com_eventgallery');
//load classes
JLoader::registerPrefix('Eventgallery', JPATH_COMPONENT);


if ($site == 1) {
	$app = JFactory::getApplication('administrator');   
} else {
    $app = JFactory::getApplication('site');
}
$app->loadSession();

$currentUser = JFactory::getUser();

/**
 * Fix the guest user group. This is normally set by the application. But since we're in a
 * simple script here we need to take care our own.
 */
if ($currentUser->guest)
{
    $guestUsergroup = JComponentHelper::getParams('com_users')->get('guest_usergroup', 1);
    $currentUser->groups = array($guestUsergroup);
}

/**
 * @var EventgalleryLibraryFactoryFile $fileFactory
 */
$fileFactory = EventgalleryLibraryFactoryFile::getInstance();
try {
    $fileObj = $fileFactory->getFile($folder, $file);
} catch (InvalidArgumentException $e) {
    image404();
}

if ($fileObj == null) {
    image404();
}

$folderObj = $fileObj->getFolder();
if ($site==0 || !$currentUser->authorise('core.manage', 'com_eventgallery')) {
    if (!$fileObj->isMainImage()) {
        if (!$folderObj->isVisible() || !$folderObj->isAccessible()) {
            $url = JUri::root().'../../../' . COM_EVENTGALLERY_IMAGE_NO_ACCESS;
            header("HTTP/1.1 302 Found");
            header("Location: $url");
            header('Content-Type: text/plain');
            header('Connection: close');
            flush();
            die();
        }
    }
}

if (!file_exists($image_thumb_file)) {
    function url_origin($s, $use_forwarded_host=false)
    {
        $ssl = (!empty($s['HTTPS']) && $s['HTTPS'] == 'on') ? true:false;
        $sp = strtolower($s['SERVER_PROTOCOL']);
        $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
        $port = $s['SERVER_PORT'];
        $port = ((!$ssl && $port=='80') || ($ssl && $port=='443')) ? '' : ':'.$port;
        $host = ($use_forwarded_host && isset($s['HTTP_X_FORWARDED_HOST'])) ? $s['HTTP_X_FORWARDED_HOST'] : (isset($s['HTTP_HOST']) ? $s['HTTP_HOST'] : null);
        $host = isset($host) ? $host : $s['SERVER_NAME'] . $port;
        return $protocol . '://' . $host;
    }

    $url = url_origin($_SERVER, false).$_SERVER['REQUEST_URI'];
    if ($site == 0) {
        $url = str_replace('components/com_eventgallery/helpers/image.php', 'index.php', $url);
        $url .= '&option=com_eventgallery&view=resizeimage';
    } else {
        $url = str_replace('components/com_eventgallery/helpers/image.php', 'administrator/index.php', $url);
        $url .= '&option=com_eventgallery&task=resizeimage.display';
    }
	header("HTTP/1.1 302 Found");
    header("Location: $url");
    header('Content-Type: text/plain');
    header('Connection: close');
    flush();
    die();
}

$mime = ($mime = getimagesize($image_thumb_file)) ? $mime['mime'] : $mime;
$size = filesize($image_thumb_file);
$fp   = fopen($image_thumb_file, "rb");
if (!($mime && $size && $fp)) {
    // Error.
    return;
}


header("Content-Type: " . $mime);
header("Content-Length: " . $size);
header("Last-Modified: $last_modified");


fpassthru($fp);
die();
