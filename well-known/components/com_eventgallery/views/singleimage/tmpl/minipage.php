<!DOCTYPE html>
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

$title = "";
if (strlen($this->model->folder->getDisplayName())>0) {
	$title .= $this->model->folder->getDisplayName();
} else {
	$title .= $this->model->file->getFolderName();
}

$title .= ' - ';

if (strlen($this->model->file->getTitle())>0) {
	$title .= $this->model->file->getPlainTextTitle();
} else {
	$title .= $this->model->file->getFileName();
}

$imageurl = $this->model->file->getSharingImageUrl();



?><html>
	<head prefix="og: http://ogp.me/ns#">
		
		<meta property="og:image" content="<?php echo  $imageurl; ?>"/>
		<meta property="og:url" content="<?php echo JRoute::_('index.php?option=com_eventgallery&view=singleimage&format=raw&folder='.$this->model->file->getFolderName().'&file='.$this->model->file->getFileName(), null, -1)?>"/>
		<meta property="og:title" content="<?php echo htmlspecialchars($title, ENT_COMPAT, 'UTF-8') ?>"/>
		<link rel="image_src" type="image/jpeg" href="<?php echo $imageurl; ?>"/>
		<title><?php echo $title ?></title>

        <?php echo $this->loadTemplate('styles'); ?>
        <?php IF ($this->params->get('social_sharing_link_type', 'singleimage') == 'singleimage_to_event'): ?>
            <script type="text/javascript">

                    window.location = "<?php echo JRoute::_('index.php?option=com_eventgallery&view=event&folder='.$this->model->file->getFolderName())?>";

            </script>
        <?php ENDIF; ?>

	</head>
	<body>

    <div class="container">
        <div class="content">
            <?php IF ($this->model->file->hasTitle()): ?>
                <div class="well displayname"><?php echo $this->model->file->getTitle($this->params->get('show_image_filename',0)==1, $this->params->get('show_exif','1')=='1'); ?></div>
            <?php ELSEIF ($this->params->get('show_image_filename',0)==1): ?>
                <div class="well displayname"><div class="img-id"><?php echo JText::_('COM_EVENTGALLERY_IMAGE_ID'); ?> <?php echo $this->model->file->getFileName() ?></div></div>
            <?php ENDIF ?>

            <div class="image">
                <a href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=event&folder='.$this->model->file->getFolderName())?>">
                <img src="<?php echo  $this->model->file->getImageUrl(600, 600, false) ?>">
                </a>
            </div>

            <div class="navigation">
                <a href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=event&folder='.$this->model->file->getFolderName())?>"><?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_MINIPAGE_OPEN_EVENT');?></a>
            </div>
        </div>
    </div>
	</body>
</html>