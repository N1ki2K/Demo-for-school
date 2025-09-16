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

<div class="eventgallery-emptycart">
    <h2><?php echo JText::_('COM_EVENTGALLERY_CART') ?></h2>
    <?php echo JText::_('COM_EVENTGALLERY_CART_EMPTY') ?>
</div>

<?php echo $this->loadSnippet('footer_disclaimer'); ?>
