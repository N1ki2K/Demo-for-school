<?php 
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;


class EventgalleryViewEmailtemplate extends EventgalleryLibraryCommonView
{
	protected $item;

    /**
     * Display the view
     * @param null $tpl
     * @return bool|mixed
     */
	public function display($tpl = null)
	{

		$this->item		= $this->get('Item');


        if ($this->getLayout()=="preview") {
            /**
             * @var EventgalleryLibraryManagerEmailtemplate $emailtemplateMgr
             */
            $emailtemplateMgr = EventgalleryLibraryManagerEmailtemplate::getInstance();

            $this->item->renderedSubject = $emailtemplateMgr->populate($this->item->subject, $this->item->demodata);
            $this->item->renderedBody = $emailtemplateMgr->populate($this->item->body, $this->item->demodata);
        }

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors));
		}

		return parent::display($tpl);
	}

}