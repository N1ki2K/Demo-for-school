<?php 

if (isset($this->rendermode) && $this->rendermode == 'module') {
	$link = JRoute::_(EventgalleryHelpersRoute::createEventRoute($this->entry->getFolderName(), $this->entry->getTags(), $this->entry->getCategoryId(), $this->params->get('menuitemid', null)));
} else {
    $link = "index.php?option=com_eventgallery&view=event&folder=" . $this->entry->getFolderName() . "&Itemid=" . $this->currentItemid;
    if (isset($this->category) && $this->category->id != 'root') {
        $link .= "&catid=" . $this->category->id;
    }
    $link = JRoute::_($link);
}
?>

<div class="item-container item-container-big">
	<div class="item item_first">
		<a href="<?php echo $link ?>">
			<div class="content">				
				<div class="data">
					<?php IF($this->params->get('show_date',1)==1):?><div class="date"><?php echo JHtml::date($this->entry->getDate());?></div><?php ENDIF ?>
					<div class="title"><?php echo $this->entry->getDisplayName();?></div>
					<?php IF($this->params->get('show_text',1)==1):?><div class="text"><?php echo JHtml::_('content.prepare', $this->entry->getIntroText(), '', 'com_eventgallery.event'); ?></div><?php ENDIF ?>
					<?php IF($this->params->get('show_imagecount',1)==1):?><div class="imagecount"><?php echo JText::_('COM_EVENTGALLERY_EVENTS_LABEL_IMAGECOUNT') ?> <?php echo $this->entry->getFileCount();?></div><?php ENDIF ?>				
					<?php IF($this->params->get('show_eventhits',0)==1):?><div class="eventhits"><?php echo JText::_('COM_EVENTGALLERY_EVENTS_LABEL_HITS') ?> <?php echo $this->entry->getHits();?></div><?php ENDIF ?>
					<?php IF ($this->entry->isCommentingAllowed() && $this->params->get('use_comments')==1 && $this->params->get('show_commentcount',1)==1):?><div class="comment"><?php echo JText::_('COM_EVENTGALLERY_EVENTS_LABEL_COMMENTCOUNT') ?> <?php echo $this->entry->getCommentCount();?></div><?php ENDIF ?>
				</div>
				
				<div class="images event-thumbnails">
					<?php IF ($this->params->get('show_thumbnails',true)):?>
						<?php
	                        $files = $this->entry->getFiles(0, 1, 1);
						?>
						
						<?php foreach($files as $file):
	                        /**
	                        * @var EventgalleryLibraryFile $file
	                        */?>

							<div class="event-thumbnail">
								<?php IF (($this->params->get('hide_mainimage_for_password_protected_event', 0) == '1' && !$this->entry->isAccessible()) ||
                                          ($this->params->get('hide_mainimage_for_usergroup_protected_event', 0) == '1' && !$this->entry->isVisible()) ): ?>
									<img class="locked-event" data-width="1000" data-height="1000" src="<?php echo JUri::root(true)?>/media/com_eventgallery/frontend/images/locked.png">
								<?php ELSE: ?>
									<?php echo $file->getLazyThumbImgTag(50,50, "", true); ?>	
								<?php ENDIF; ?>
							</div>
						<?php ENDFOREACH?>
					<?php ENDIF ?>
					<div style="clear:both"></div>
				</div>
			</div>	
		</a>					
	</div>
</div>