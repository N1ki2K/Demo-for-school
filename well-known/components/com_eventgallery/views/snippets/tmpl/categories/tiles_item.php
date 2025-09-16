<?php

$link =  JRoute::_('index.php?option=com_eventgallery&view=categories&catid='.$this->subCategory->id);
$event = $this->subCategory->event;

$categoryTitle = $this->escape(EventgalleryHelpersCategories::getCategoryTitle($this->subCategory));
if($this->params->get('show_items_per_category_count_recursive', 0)==1) {
    $numItems = $this->subCategory->getNumItems(true);
}
else {
    $numItems = $this->subCategory->getNumItems(false);
}

if ($event == null) {
    return;
}

?>

<div class="item-container">
    <div class="wrapper">
        <a href="<?php echo $link ?>">
            <div class="content">
                <div class="event-thumbnails">
                    <?php
                    $files = $event->getFiles(0, 1, 1);
                    ?>

                    <?php
                    /**
                     * @var EventgalleryLibraryFile $file
                     */?>

                    <div class="event-thumbnail">
                        <?php IF (($this->params->get('hide_mainimage_for_password_protected_event', 0) == '1' && !$event->isAccessible()) ||
                            ($this->params->get('hide_mainimage_for_usergroup_protected_event', 0) == '1' && !$event->isVisible()) ): ?>
                            <img class="locked-event" data-width="1000" data-height="1000" src="<?php echo JUri::root(true)?>/media/com_eventgallery/frontend/images/locked.png">
                        <?php ELSE: ?>
                            <?php if (isset($files[0])) echo $files[0]->getLazyThumbImgTag(50,50, "", false); ?>
                        <?php ENDIF; ?>
                    </div>
                </div>

                <div class="data">
                    <div class="title"><h2><?php echo $categoryTitle;?></h2></div>
                    <?php if($this->params->get('show_items_per_category_count', 0)==1): ?><div class="imagecount">(<?php echo $numItems;?>)</div><?php ENDIF ?>
                    <div style="clear:both"></div>
                </div>

            </div>
        </a>
    </div>
</div>
