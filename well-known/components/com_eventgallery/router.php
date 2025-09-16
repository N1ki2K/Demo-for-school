<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

jimport('joomla.application.categories');


/**
 * Routing class from com_content
 *
 * @since  3.3
 */
class EventgalleryRouter extends JComponentRouterBase
{
    /**
     * Build the route for the com_content component
     *
     * @param   array  &$query  An array of URL arguments
     *
     * @return  array  The URL arguments to use to assemble the subsequent URL.
     *
     * @since   3.3
     */
    public function build(&$query)
    {
        /**
         * @var \Joomla\Registry\Registry $config
         */
        $config 	= JFactory::getConfig();
        $segments = array();

        if(isset($query['view']))
        {
            $segments[] = $query['view'];
            unset( $query['view'] );
        }

        if(isset($query['catid']))
        {
            $catid = $query['catid'];
            $catAlias = $this->getCategoryAlias($catid);
            if ($catAlias !== false) {
                $segments[] = $catAlias;
            }
            unset( $query['catid'] );
        };

        if(isset($query['folder']))
        {
            $segments[] = $query['folder'];
            unset( $query['folder'] );
        };
        if(isset($query['file']))
        {
            /*take care of the appended html. This will not work with file names*/
            if ($config->get('sef_suffix')==1) {
                $segments[] = $query['file']."/file";

            } else {
                $result = preg_replace("/\.(.{3,4}$)/i", "-\\1", $query['file']);

                if (isset($query['format'])) {
                    $segments[] = $result;
                } else {
                    $segments[] = $result."/";
                }

            }
            unset( $query['file'] );

        };

        if (isset($query['id']) && $segments[0] == 'event') {
            $temp = explode(':', $query['id'] );
            $id  = $temp[0];

            $db    = JFactory::getDbo();
            $sqlquery = $db->getQuery(true)
                ->select('folder')
                ->from('#__eventgallery_folder')
                ->where('id=' . $db->quote($id));

            $db->setQuery($sqlquery);
            $row = $db->loadObject();

            $segments[] = $row->folder;
            unset( $query['id'] );
        }


        return $segments;
    }

    /**
     * Parse the segments of a URL.
     *
     * @param   array &$segments The segments of the URL to parse.
     * @return array The URL attributes to be used by the application.
     *
     * @throws Exception
     * @since   3.3
     */
    public function parse(&$segments)
    {
        $config 	= JFactory::getConfig();
        $vars = array();

        $vars['view']	= $segments[0];

        if ($vars['view'] == 'categories' && isset($segments[1])) {
            $vars['catid']	= $this->parseCatIdParameter($segments[1]);
        }

        if ($vars['view'] == 'event' || $vars['view']=='password') {

            // event/folder
            // event/catid/folder
            if (count($segments) == 3) {
                $vars['catid'] = $this->parseCatIdParameter($segments[1]);
            }

            $vars['folder'] = $this->parseFolderParameter($segments[count($segments)-1]);
        }

        if ($vars['view'] == 'singleimage') {

            // singleimage/file/folder
            // singleimage/catid/file/folder

            $segmentCount = 3;

            // sef_suffix == 1 => .../file.html
            if ($config->get('sef_suffix')==1) {
                $segmentCount++;
            }

            if (count($segments) == $segmentCount + 1) {
                $vars['catid'] = $this->parseCatIdParameter($segments[1]);
                $vars['folder']	= $this->parseFolderParameter($segments[2]);
                $vars['file']	= $this->parseFileParameter($segments[3]);
            } elseif (count($segments) >= 2) {
                $vars['folder']	= $this->parseFolderParameter($segments[1]);
                $vars['file']	= $this->parseFileParameter($segments[2]);
            }
        }

        if ($vars['view'] == 'download' || $vars['view'] == 'resizeimage') {

            if (count($segments) >= 3) {
                $vars['folder']	= $this->parseFolderParameter($segments[1]);
                $vars['file']	= $this->parseFileParameter($segments[2]);
            }
        }


        if ($segments[count($segments)-1]=='raw') {
            $vars['format'] = 'raw';
        }

        $viewExceptions = Array('download','resizeimage');


        if (!in_array($vars['view'], $viewExceptions) &&
            !file_exists(__DIR__.'/views/'.$vars['view'])) {
            throw new Exception(JText::sprintf('JLIB_APPLICATION_ERROR_VIEW_NOT_FOUND', $vars['view'], "", ""), 404);
        }

        return $vars;
    }

    protected function parseFolderParameter($value) {
        return str_replace(":","-",str_replace("/","",$value));
    }

    protected function parseFileParameter($value) {
        $result = str_replace(":","-",str_replace("/", "", $value));
        $result = preg_replace("/-(.{3,4}$)/i", ".\\1", $result);
        return $result;
    }

    protected function parseCatIdParameter($value) {
        $catId = $this->getCategoryIdByAlias($value);

        if ($catId !== false) {
            return $catId;
        }

        return $value;
    }

    private function getCategoryAlias($catid)
    {
        $category = JCategories::getInstance('Eventgallery')->get($catid);
        if ($category) {
            return $category->alias;
        }
        return false;

    }

    /**
     * determines a category id for a given category alias
     *
     * @param $alias
     * @return bool
     */
    private function getCategoryIdByAlias($alias)
    {
        $category = JCategories::getInstance('Eventgallery')->get();

        return $this->getCategoryId($category, $alias);

    }

    /**
     * get the category id for a given category and alias. Will run though all subcategories to find the alias.
     *
     * @param $category JCategoryNode
     * @param $alias
     * @return bool
     */
    private function getCategoryId($category, $alias) {

        if ($category->alias == $alias) {
            return $category->id;
        }

        foreach ($category->getChildren() as $child)
        {
            $catid = $this->getCategoryId($child, $alias);
            if ($catid !== false) {
                return $catid;
            }
        }

        return false;
    }
}

/**
 * Content router functions
 *
 * These functions are proxys for the new router interface
 * for old SEF extensions.
 *
 * @param   array  &$query  An array of URL arguments
 *
 * @return  array  The URL arguments to use to assemble the subsequent URL.
 *
 * @deprecated  4.0  Use Class based routers instead
 */
function eventgalleryBuildRoute(&$query)
{
    $router = new EventgalleryRouter;

    return $router->build($query);
}

/**
 * Parse the segments of a URL.
 *
 * This function is a proxy for the new router interface
 * for old SEF extensions.
 *
 * @param   array  $segments  The segments of the URL to parse.
 *
 * @return  array  The URL attributes to be used by the application.
 *
 * @since   3.3
 * @deprecated  4.0  Use Class based routers instead
 */
function eventgalleryParseRoute($segments)
{
    $router = new EventgalleryRouter;

    return $router->parse($segments);
}