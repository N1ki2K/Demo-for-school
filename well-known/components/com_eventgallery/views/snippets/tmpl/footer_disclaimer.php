<?php // no direct access
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die('Restricted access'); ?>

<?php
/**
 * @var JRegistry $params
 */
$params = JComponentHelper::getParams('com_eventgallery');
$use_cart = $params->get('use_cart', '1') == 1;

$disclaimerObject = new EventgalleryLibraryDatabaseLocalizablestring($params->get('footer_disclaimer',''));
$disclaimer = strlen($disclaimerObject->get())>0?$disclaimerObject->get():'';

?>

<?php IF ($use_cart && $disclaimer!=''): ?>

<div class="eventgallery-footer-disclaimer">
    <small><?php echo $disclaimer; ?></small>
</div>

<?php ENDIF; ?>