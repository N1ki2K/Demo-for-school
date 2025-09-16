<?php // no direct access
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die('Restricted access'); ?>

<?php IF ($this->params->get('show_date', 1) == 1): ?>
    <h4 class="date">
        <?php echo JHtml::date($this->folder->getDate()); ?>
    </h4>
<?php ENDIF ?>
<h1 itemprop="name" class="displayname">
    <?php echo $this->folder->getDisplayName(); ?>
</h1>
<div itemprop="description" class="text">
	<?php echo JHtml::_('content.prepare', $this->folder->getText(), '', 'com_eventgallery.event'); ?>
</div>

<div style="display:none">
	<?php 
	if (isset($this->titleEntries[0])) {
	    echo '<meta itemprop="image" content="'. $this->titleEntries[0]->getSharingImageUrl() .'" />';
        echo '<link rel="image_src" tpe="image/jpeg" href="'. $this->titleEntries[0]->getSharingImageUrl() .'" />';
	}
	?>
	<span itemprop="startDate" content="<?php echo $this->folder->getDate(); ?>">
		<?php echo JHtml::date($this->folder->getDate()); ?>
	</span>
</div>
