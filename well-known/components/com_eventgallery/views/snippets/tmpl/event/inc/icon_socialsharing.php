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
IF ($this->params->get('use_social_sharing_button', 0)==1 && $this->folder->getAttribs()->get('use_social_sharing', 1)==1):
// we do not use JRoute for this link to optimize performance
?><span data-link="<?php echo JRoute::_('index.php?option=com_eventgallery&view=singleimage&layout=share&folder='.$this->entry->getFolderName().'&file='.$this->entry->getFileName()."&Itemid=".$this->currentItemid.'&format=raw'); ?>" class="social-share-button social-share-button-open" title="<?php echo JText::_('COM_EVENTGALLERY_SOCIAL_SHARE')?>" ><i class="egfa egfa-2x egfa-share-alt"></i></span><?php
ENDIF;