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
IF ($this->params->get('use_event_paging', 0 )==1): ?>
<form method="post" name="adminForm">
    <div class="pagination-limitbox">
        <div class="pull-right limitbox"><?php echo $this->pageNav->getLimitBox(); ?></div>
        <div class="clear"></div>
    </div>
</form>
<?php ENDIF ?>
