<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

abstract class EventgalleryHelperAssociation
{
	/**
	 * Method to get the associations for a given item
	 *
	 * @param   integer  $id    Id of the item
	 * @param   string   $view  Name of the view
	 *
	 * @return  array   Array of associations for the item
	 *
	 * @since  3.0
	 */
	public static function getAssociations($id = 0, $view = null)
	{
		$jinput = JFactory::getApplication()->input;
		$view   = is_null($view) ? $jinput->get('view') : $view;

        $result = array();

        if ($view == "event") {
            $folder = $jinput->getString('folder', null);
            $catid = $jinput->getString('catid', null);
            $languages = JLanguageHelper::getLanguages();


            foreach ($languages as $language) {
                $link = EventgalleryHelpersRoute::createEventRoute($folder, array(), $catid, null,  $language->lang_code );
                $result[$language->lang_code] = $link;
            }
        }

		return $result;
	}


}
