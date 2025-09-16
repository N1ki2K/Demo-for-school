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

?>

<?php echo $this->loadSnippet('social'); ?>

<script type="text/javascript">

(function(jQuery){


    <?php IF ($this->file->isCommentingAllowed() && $this->use_comments==1): ?>
    jQuery( document ).ready(function() {


        var initialVisible = <?php echo ($app->input->getString('success', 'true')=='false'?'true':'false'); ?>;
        var commentForm = jQuery('#commentform');
        commentForm.css('visibility','visible');
        if (initialVisible) {
            commentForm.show();
        } else {
            commentForm.hide();
        }

        jQuery('#toggle_comment').click( function (e) {
            e.preventDefault();
            commentForm.slideToggle();
        });
    });
    <?php ENDIF ?>

    jQuery(document).keyup(function (event) {

        if (event.keyCode == 37) {
            // left
            if (jQuery.eventgallery_colorbox.isOpen() === true) {
                if (jQuery.eventgallery_colorbox.element().data('eventgallery-lightbox').indexOf('cart')>-1) {
                    return;
                }
            }
            if (jQuery('#prev_image').first() != null) {
                document.location.href = jQuery('#prev_image').attr('href');
            }

        } else if (event.keyCode == 39) {
            // right
            if (jQuery.eventgallery_colorbox.isOpen() === true) {
                if (jQuery.eventgallery_colorbox.element().data('eventgallery-lightbox').indexOf('cart')>-1) {
                    return;
                }
            }
            if (jQuery('#next_image')) {
                document.location.href = jQuery('#next_image').attr('href');
            }
        }
    });

})(eventgallery.jQuery);

</script>

<?php  echo  $this->loadSnippet("cart"); ?>

<div id="singleimage">

    <?php IF ($this->params->get('show_date', 1) == 1): ?>
        <h4 class="date">
            <?php echo JHtml::date($this->folder->getDate()) ?>
        </h4>
    <?php ENDIF ?>
    <h1 class="displayname">
        <?php echo $this->folder->getDisplayName() ?>
    </h1>

    <a name="image"></a>

    <div class="btn-group">
        <a class="btn singleimage-overview" href="<?php

        $link = "index.php?option=com_eventgallery&view=event&folder=" . $this->folder->getFolderName();
        if ($this->model->currentLimitStart > 0) {
            $link .= "&limitstart=" . $this->model->currentLimitStart;
        }
        if (isset($this->category) && $this->category->id != 'root') {
            $link .= "&catid=" . $this->category->id;
        } $link = JRoute::_($link);

        echo $link;  ?>" title="<?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NAV_OVERVIEW') ?>"><i class="egfa egfa-list"></i></a>

        <?php IF (  $this->model->firstFile && $this->model->firstFile != $this->file): ?>
            <a class="btn singleimage-first" href="<?php echo JRoute::_(
                "index.php?option=com_eventgallery&view=singleimage&folder=" . $this->model->firstFile->getFolderName()
                . "&file=" . $this->model->firstFile->getFileName()
            ) ?>#image" title="<?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NAV_START') ?>"><i
                    class="egfa egfa-fast-backward"></i></a>
        <?php ENDIF ?>

        <?php IF ($this->model->prevFile && $this->model->prevFile != $this->file): ?>
            <a class="btn singleimage-prev" id="prev_image" href="<?php echo JRoute::_(
                "index.php?option=com_eventgallery&view=singleimage&folder=" . $this->model->prevFile->getFolderName() . "&file="
                . $this->model->prevFile->getFileName()
            ) ?>#image" title="<?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NAV_PREV') ?>"><i
                    class="egfa egfa-backward"></i></a>
        <?php ENDIF ?>

        <?php IF ($this->model->nextFile && $this->model->nextFile != $this->file): ?>
            <a class="btn singleimage-next" id="next_image" href="<?php echo JRoute::_(
                "index.php?option=com_eventgallery&view=singleimage&folder=" . $this->model->nextFile->getFolderName() . "&file="
                . $this->model->nextFile->getFileName()
            ) ?>#image" title="<?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NAV_NEXT') ?>"><i
                    class="egfa egfa-forward"></i></a>
        <?php ENDIF ?>

        <?php IF ($this->model->lastFile && $this->model->lastFile != $this->file): ?>
            <a class="btn singleimage-last" href="<?php echo JRoute::_(
                "index.php?option=com_eventgallery&view=singleimage&folder=" . $this->model->lastFile->getFolderName() . "&file="
                . $this->model->lastFile->getFileName()
            ) ?>#image" title="<?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NAV_END') ?>"><i
                    class="egfa egfa-fast-forward"></i></a>
        <?php ENDIF ?>

        <?php IF ($this->file->isCommentingAllowed() && $this->use_comments == 1): ?>
            <a class="btn singleimage-comment" href="#" id="toggle_comment"
               title="<?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NAV_COMMENT') ?>"><i
                    class="egfa egfa-comment"></i></a>
        <?php ENDIF ?>

        <a class="btn singleimage-zoom" href="<?php echo $this->file->getImageUrl(NULL, NULL, true) ?>"><i class="egfa egfa-search-plus"></i></a>


        <?php IF ($this->folder->isCartable()  && $this->params->get('use_cart', '1')==1): ?>
            <a href="#" data-id="<?php echo "folder=" . urlencode($this->file->getFolderName()) . "&file=" . urlencode($this->file->getFileName()); ?>" title="<?php echo JText::_(
                'COM_EVENTGALLERY_CART_ITEM_ADD2CART'
            ) ?>" class="btn btn-primary eventgallery-openAdd2cart"><?php echo JText::_('COM_EVENTGALLERY_PRODUCT_BUY_IMAGE') ?></a>
        <?php ENDIF ?>

        <?php IF ($this->folder->isCartable() && $this->params->get('show_cart_connector', 0) == 1): ?>
            <a href="<?php echo EventgalleryHelpersCartconnector::getLink(
                $this->file->getFolderName(), $this->file->getFileName()
            ); ?>" class="btn button-cart-connector" title="<?php echo JText::_('COM_EVENTGALLERY_CART_CONNECTOR') ?>"
               data-folder="<?php echo $this->file->getFolderName() ?>"
               data-file="<?php echo $this->file->getFileName(); ?>"><i class="egfa egfa-cart-plus"></i></a>
        <?php ENDIF ?>

		<?php IF ($this->params->get('use_social_sharing_button', 0)==1 && $this->folder->getAttribs()->get('use_social_sharing', 1)==1):?>
			<a class="btn social-share-button social-share-button-open" rel="nofollow" href="#" data-link="<?php echo JRoute::_('index.php?option=com_eventgallery&view=singleimage&layout=share&folder='.$this->file->getFolderName().'&file='.$this->file->getFileName().'&format=raw'); ?>" class="social-share-button" title="<?php echo JText::_('COM_EVENTGALLERY_SOCIAL_SHARE')?>" ><i class="egfa egfa-share-alt"></i></a>
		<?php ENDIF ?>

        <?php IF ($this->file->getHitCount()>0 && $this->params->get('show_singlepage_imagehits', 1) == 1): ?>
            <div class="btn singleimage-hits"><?php echo JText::_(
                    'COM_EVENTGALLERY_SINGLEIMAGE_HITS'
                ) ?> <?php echo $this->file->getHitCount() ?></div>
        <?php ENDIF ?>
    </div>

    <br>
    <?php echo $this->loadTemplate('commentform'); ?>
    <br>

    <div class="singleimage eventgallery-imagelist" data-rowheight="100" data-rowheightjitter="0" data-firstimagerowheight="1" data-dofilllastrow="true">

        <?php    $seoMode = $app->input->getCmd('_escaped_fragment_', false);
        if ($seoMode !== false) {
            $seoMode = true;
        }
        if ($seoMode) {
        ?>
            <figure>
                <img src="<?php echo $this->file->getSharingImageUrl()?>" alt="<?php echo htmlspecialchars($this->file->getAltContent(), ENT_COMPAT, 'UTF-8') ?>">
                <figcaption><?php echo $this->file->getLightBoxTitle($this->params->get('show_image_filename',0)==1, $this->params->get('show_exif','1')=='1') ?></figcaption>
            </figure>

        <?php
        }?>

        <a class="thumbnail"
           id="bigimagelink"
           data-title="<?php echo rawurlencode($this->file->getLightBoxTitle($this->params->get('show_image_filename',0)==1, $this->params->get('show_exif','1')=='1')) ?>"
           data-eventgallery-lightbox="gallery"
           href="<?php echo $this->file->getImageUrl(NULL, NULL, true) ?>"
           >
            <?php echo $this->file->getLazyThumbImgTag(100, 100); ?>
        </a>
        <?php IF ($this->file->hasTitle()): ?>
            <div class="well displayname"><?php echo $this->file->getTitle($this->params->get('show_image_filename',0)==1, $this->params->get('show_exif','1')=='1'); ?></div>
        <?php ELSEIF ($this->params->get('show_image_filename',0)==1): ?>
        	<div class="well displayname"><div class="img-id"><?php echo JText::_('COM_EVENTGALLERY_IMAGE_ID'); ?> <?php echo $this->file->getFileName() ?></div></div>
        <?php ENDIF ?>
    </div>
    
    <a name="comments"></a>
    <?php echo $this->loadTemplate('comments'); ?>

</div>

<?php echo $this->loadSnippet('footer_disclaimer'); ?>