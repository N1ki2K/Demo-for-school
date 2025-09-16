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

$app = JFactory::getApplication();

$seoModeInput = $app->input->getCmd('_escaped_fragment_', '');
$seoMode = strlen($seoModeInput)>0?true:false;

if ($seoMode) {
?>
    <figure>
        <img src="<?php echo $this->entry->getSharingImageUrl()?>" alt="<?php echo htmlspecialchars($this->entry->getAltContent(), ENT_COMPAT, 'UTF-8') ?>">
        <figcaption><?php echo $this->entry->getLightBoxTitle($this->params->get('show_image_filename',0)==1, $this->params->get('show_exif','1')=='1') ?></figcaption>
    </figure>

<?php
}
?><?php IF (!$this->entry->hasUrl()):?><a class="event-thumbnail <?php if (isset($this->cssClass)) {echo $this->cssClass;}?>" href="<?php echo $this->entry->getImageUrl(null, null, true); ?>"
   title="<?php echo htmlspecialchars($this->entry->getPlainTextTitle($this->params->get('show_image_filename',0)==1, $this->params->get('show_exif','1')=='1'), ENT_COMPAT, 'UTF-8') ?>"
   data-title="<?php echo rawurlencode($this->entry->getLightBoxTitle($this->params->get('show_image_filename',0)==1, $this->params->get('show_exif','1')=='1')) ?>"
   rel="gallery<?php if (isset($this->rel)) {echo $this->rel;} echo md5($this->entry->getFolderName()); ?>" data-eventgallery-lightbox="gallery"><?php echo $this->entry->getLazyThumbImgTag(50, 50, false, false); ?>
   <?php echo $this->loadSnippet('event/inc/thumbs_content'); ?>
   <div class="eventgallery-icon-container"><?php echo $this->loadSnippet('event/inc/icon_add2cart'); ?><?php echo $this->loadSnippet('event/inc/icon_socialsharing'); ?></div>
</a>
<?php ELSE: ?>
<a class="event-thumbnail <?php if (isset($this->cssClass)) {echo $this->cssClass;}?>" href="<?php echo $this->entry->getUrl();?>"
   title="<?php echo htmlspecialchars($this->entry->getPlainTextTitle($this->params->get('show_image_filename',0)==1, $this->params->get('show_exif','1')=='1'), ENT_COMPAT, 'UTF-8') ?>">   
   <?php echo $this->entry->getLazyThumbImgTag(50, 50, false, false); ?>
   <?php echo $this->loadSnippet('event/inc/thumbs_content'); ?>
</a>
<?php ENDIF;
