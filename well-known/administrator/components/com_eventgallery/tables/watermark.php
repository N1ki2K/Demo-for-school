<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
// no direct access
defined('_JEXEC') or die('Restricted access');


class EventgalleryTableWatermark extends JTable
{
	public $id = null;
	public $name = null;
	public $image = null;
	public $description = null;
	public $image_position = null;
	public $image_margin_horizontal = null;
	public $image_margin_vertical = null;
	public $image_mode = null;
	public $image_mode_prop = null;
	public $image_opacity = null;
	public $image_thumbthresholdsize = null;
	public $ordering = null;
	public $published = null;
	public $default = null;
	public $modified = null;
	public $created = null;
  

    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

	function __construct($db) {
		parent::__construct('#__eventgallery_watermark', 'id', $db);
	}

    public function store($updateNulls = false) {
        $this->modified = date("Y-m-d H:i:s");
        return parent::store($updateNulls);
    }
}
