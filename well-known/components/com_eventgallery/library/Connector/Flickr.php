<?php

namespace Joomla\Component\Eventgallery\Site\Library\Connector;

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
jimport('joomla.error.log');
require_once JPATH_ROOT.'/components/com_eventgallery/config.php';
require_once JPATH_ROOT.'/components/com_eventgallery/library/common/logger.php';

class Flickr
{

    public static $cachebasedir;
    public static $cache_life = '86400'; //caching time, in seconds


    const DEFAULT_FLICKR_API_KEY = '0c6b59cdbf855c6ff1d63fa3f2cbd28e';

    public static  function initCacheDirs() {

        if (!is_dir(JPATH_CACHE)) {
            mkdir(JPATH_CACHE);
        }

        self::$cachebasedir = COM_EVENTGALLERY_FLICKR_CACHE_PATH;

        if (!is_dir(self::$cachebasedir)) {
            mkdir(self::$cachebasedir);
        }
    }

    /**
     * returns the name of the file for this url.
     * @param $cachelifetime
     * @param $url
     * @return WebResult
     */
    public static function getWebResult($cachelifetime, $url)
    {
        \JLog::addLogger(
            array(
                'text_file' => 'com_eventgallery.log.php',
                'logger' => 'Eventgalleryformattedtext'
            ),
            \JLog::ALL,
            'com_eventgallery'
        );
        //\JLog::add('processing url '.$url, \JLog::INFO, 'com_eventgallery');


        self::initCacheDirs();

        $cachefilename = self::$cachebasedir . md5($url) . '.xml';

        $dataUpdated = false;

        if (file_exists($cachefilename) && (time() - filemtime($cachefilename) <= $cachelifetime)) {
            // no need to do anything since the cache is still valid

        } else {

            //\JLog::add('have writen new cache file for '.$url, \JLog::INFO, 'com_eventgallery');

            $result = WebResult::url_get_contents($url);
            if ($result===false) {
                \JLog::add('unable to connect to remote host. Make sure allow_url_fopen=On and the server has access to the internet. url: '.$url, \JLog::INFO, 'com_eventgallery');
            }

            #echo "reloading content from $url <br>";
            if (strlen($result) > 0) {
                $fh = fopen($cachefilename, 'w') or die("can't open file $cachefilename");
                fwrite($fh, $result);
                fclose($fh);
            }

            $dataUpdated = true;

        }

        $result = NULL;

        return new WebResult($dataUpdated, $cachefilename);

    }


    /**
     * Updates the photoset with the database
     *
     * @param $api_key
     * @param $cachelifetime
     * @param $db \JDatabaseDriver
     * @param $photoSetId
     */
    public static function updatePhotoSet($api_key, $cachelifetime, $db, $photoSetId)
    {
        self::initCacheDirs();

        set_time_limit(30);

        $url = self::createFlickrPhotosetGetPhotosURL($api_key, $photoSetId, 1);

        $webResult = self::getWebResult($cachelifetime, $url);


        if (!$webResult->isDataUpdated()) {
            return;
        }

        $json = $webResult->getFileContentAsJson();

        if ($json['stat'] !== 'ok') {
            \JLog::add('Flickr answer contains error status: '.$json['stat'], \JLog::INFO, 'com_eventgallery');
            return;
        }

        $photoset = $json['photoset'];

        $pages = $photoset['pages'];
        $totalCount = $photoset['total'];
        $counter = $totalCount;
        $perpage = $photoset['perpage'];
        $photos = $photoset['photo'];

        $query = $db->getQuery(true);
        $query->delete('#__eventgallery_file')
            ->where('folder='.$db->quote($photoSetId));
        $db->setQuery($query);
        $db->execute();

        self::updatePhotoSetInDatabase($db, $photos, $photoSetId, $counter);

        if ($pages>1) {
            for ($i = 2; $i<=$pages; $i++) {
                $counter = $counter - $perpage;
                $url = self::createFlickrPhotosetGetPhotosURL($api_key, $photoSetId, $i);
                $webResult = self::getWebResult($cachelifetime, $url);
                $content = file_get_contents($webResult->getCacheFileName());
                $json = json_decode($content, true);
                $photoset = $json['photoset'];
                $photos = $photoset['photo'];
                self::updatePhotoSetInDatabase($db, $photos, $photoSetId, $counter);
            }
        }


    }

    /**
     * creates a flickr url for a photoset
     *
     * @param $api_key
     * @param $photoSetId
     * @param $pageNumber
     * @return string
     */
    public static function createFlickrPhotosetGetPhotosURL($api_key, $photoSetId, $pageNumber) {
        $perPage = 500;
        $url = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos';
        $url.= '&api_key='.$api_key;
        $url.= '&photoset_id='.$photoSetId;
        $url.= '&per_page='.$perPage;
        $url.= '&page='.$pageNumber;
        $url.= '&format=json';
        $url.= '&nojsoncallback=1';
        $url.= '&extras=o_dims,url_o,url_h,url_k,original_format,media,views,date_taken,description,sizes';

        return $url;
    }

    /**
     * @param $db
     * @param $photos
     * @param $foldername
     * @param $position
     */
    public static function updatePhotoSetInDatabase($db, $photos, $foldername, $position) {

        if (count($photos)>0) {
            $query = $db->getQuery(true);

            $query->insert($db->quoteName('#__eventgallery_file'))
                ->columns(
                    'folder,
                    file,
                    width,
                    height,
                    title,
                    caption,
                    flickr_secret,
                    flickr_secret_h,
                    flickr_secret_k,
                    flickr_secret_o,
                    flickr_server,
                    flickr_farm,
                    url,
                    exif,
                    ordering,
                    ismainimage,
                    ismainimageonly,
                    hits,
                    published,
                    allowcomments,
                    userid,
                    modified,
                    created,
                    creation_date'
                );


            $photoCount = $position;


            foreach ($photos as $photo) {

                $secret_h = "";
                if (isset($photo['url_h'])) {
                    preg_match("/.*_([^_]+)_h.jpg/", $photo['url_h'], $matches_h);
                    if (isset($matches_h[1])) {
                        $secret_h = $matches_h[1];
                    }
                }

                $secret_k = "";

                if (isset($photo['url_k'])) {
                    preg_match("/.*_([^_]+)_k.jpg/", $photo['url_k'], $matches_k);
                    if (isset($matches_k[1])) {
                        $secret_k = $matches_k[1];
                    }
                }

                $query->values(implode(',', array(
                    $db->quote($foldername),
                    $db->quote($photo['id']),
                    $db->quote($photo['width_o']),
                    $db->quote($photo['height_o']),
                    $db->quote($photo['title']),
                    $db->quote($photo['description']['_content']),
                    $db->quote($photo['secret']),
                    $db->quote($secret_h),
                    $db->quote($secret_k),
                    $db->quote($photo['originalsecret']),
                    $db->quote($photo['server']),
                    $db->quote($photo['farm']),
                    $db->quote(''),
                    $db->quote(''),
                    $db->quote($photoCount--),
                    $db->quote($photo['isprimary']),
                    0,
                    $db->quote($photo['views']),
                    1,
                    1,
                    0,
                    'now()',
                    $db->quote($photo['datetaken']),
                    $db->quote(date('YmdHis', strtotime($photo['datetaken'])))
                )));
            }
            $db->setQuery($query);
            $db->execute();

        }

    }

}