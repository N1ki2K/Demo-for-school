<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');


$langs = JFactory::getLanguage()->getKnownLanguages();

$defaultLanguageTag = JComponentHelper::getParams('com_languages')->get('site');
$defaultLanguage = $langs[$defaultLanguageTag];
if ($defaultLanguage != null) {
    unset($langs[$defaultLanguageTag]);
    $langs = array_merge(array($defaultLanguageTag => $defaultLanguage), $langs);
}

$safeHtmlFilter = JFilterInput::getInstance(null, null, 1, 1);
$contentFound = false;
?>


<small <?php IF ($this->file->getFolder()->supportsImageDataEditing()):?>class="filecontent"<?php ENDIF; ?>>

    <?php if (strlen($this->row->title)>0): $contentFound = true;?>
        <div class="title-content span4">
            <h4><?php echo JText::_('COM_EVENTGALLERY_EVENT_FILE_TITLE')?></h4>
            <dl>
                <?php foreach($langs as $tag=>$lang) {

                    $var = $safeHtmlFilter->clean($this->file->getFileTitle($tag), 4);


                    echo "<dt>$tag</strong></dt>";
                    echo "<dd>$var</dd>";
                }?>
            </dl>
        </div>
    <?php ENDIF; ?>
    <?php if (strlen($this->row->caption)>0): $contentFound = true;?>
        <div class="caption-content span7">
            <h4><?php echo JText::_('COM_EVENTGALLERY_EVENT_FILE_CAPTION')?></h4>
            <dl>
                <?php foreach($langs as $tag=>$lang) {
                    $var = $safeHtmlFilter->clean($this->file->getFileCaption($tag), 4);
                    echo "<dt>$tag</strong></dt>";
                    echo "<dd>$var</dd>";
                }?>
            </dl>
        </div>
    <?php ENDIF; ?>

    <?php if (strlen($this->file->getUrl())>0): $contentFound = true;?>
    </div>
    <div class="row-fluid">
        <div class="url-content span11">
            <dl>
                <dt><h4><?php echo JText::_('COM_EVENTGALLERY_FILE_URL')?></h4></dt>
                <dd><?php echo $this->file->getUrl(); ?></dd>
            </dl>
        </div>
        <?php ENDIF; ?>
    <?php IF (!$contentFound):?>
        <?php echo JText::_('COM_EVENTGALLERY_FILE_CLICK_TO_EDIT_LABEL')?>
    <?php ENDIF; ?>
</small>
