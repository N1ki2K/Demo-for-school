<?php // no direct access

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');


?>

<div class="eventgallery-track-my-order">
    <div class="form">
      <?php echo $this->loadTemplate('trackingform')?>
    </div>

    <div class="signin">
        <?php echo $this->loadTemplate('signinform')?>
    </div>
</div>
<div style="clear: both"></div>