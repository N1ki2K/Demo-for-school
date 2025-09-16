<?php 

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');
JHtml::_('behavior.tooltip');

?>

<form action="<?php echo JRoute::_('index.php?option=com_eventgallery&view=orderstatuses'); ?>"
      method="post" name="adminForm" id="adminForm">
<?php if (!empty( $this->sidebar)) : ?>
    <div id="j-sidebar-container" class="span2">
        <?php echo $this->sidebar; ?>
    </div>
    <div id="j-main-container" class="span10">
<?php else : ?>
    <div id="j-main-container">
<?php endif;?>
        <div id="filter-bar" class="btn-toolbar">
            <div class="btn-group pull-right hidden-phone">
                <label for="limit" class="element-invisible"><?php echo JText::_('JFIELD_PLG_SEARCH_SEARCHLIMIT_DESC');?></label>
                <?php echo $this->pagination->getLimitBox(); ?>
            </div>
        </div>
        <div class="clearfix"> </div>

        <table class="table">
            <thead>
                <tr>
                    <th width="20">
                        <input type="checkbox" name="checkall-toggle" value="" title="<?php echo JText::_('JGLOBAL_CHECK_ALL'); ?>" onclick="Joomla.checkAll(this)" />
                    </th>
                    <th class="nowrap" width="1%">
                        <?php echo JText::_( 'COM_EVENTGALLERY_ORDERSTATUS_TYPE' ); ?> 
                    </th>              
                    <th class="nowrap" width="1%">
                        
                    </th>     
                     <th width="1%">
                        <?php echo JText::_( 'COM_EVENTGALLERY_EVENTS_ORDER' ); ?> 
                        <?php echo JHtml::_('grid.order',  $this->items, 'filesave.png', 'orderstatuses.saveorder' ); ?>   
                    </th>            
                    <th>
                        <?php echo JText::_( 'COM_EVENTGALLERY_ORDERSTATUSES_DETAIS' ); ?>
                    </th>

                    
                </tr>           
            </thead>


            <tbody>
            <?php $n=count($this->items); foreach ($this->items as $i => $item) :
            /**
             * @var EventgalleryLibraryOrderstatus $item;
             */
            ?>

                <tr class="row<?php echo $i % 2; ?>">
                    <td class="center">
                        <?php echo JHtml::_('grid.id', $i, $item->getId()); ?>
                    </td>
                    <td>
                        <?php IF ($item->getType()==EventgalleryLibraryOrderstatus::TYPE_ORDER) echo JText::_('COM_EVENTGALLERY_ORDERSTATUS_TYPE_ORDER'); ?>
                        <?php IF ($item->getType()==EventgalleryLibraryOrderstatus::TYPE_SHIPPING) echo JText::_('COM_EVENTGALLERY_ORDERSTATUS_TYPE_SHIPPING'); ?>
                        <?php IF ($item->getType()==EventgalleryLibraryOrderstatus::TYPE_PAYMENT) echo JText::_('COM_EVENTGALLERY_ORDERSTATUS_TYPE_PAYMENT'); ?>

                    </td>              
                    <td>
                    	<div class="btn-group">                        
                            <?php IF ($item->isDefault()): ?>
                                <a title="<?php echo JText::_('COM_EVENTGALLERY_BUTTON_ISDEFAULT_DESC'); ?>" href="#" class="btn btn-micro active"><i class="icon-star"></i></a>
                            <?php ELSE:?>
                                <a title="<?php echo JText::_('COM_EVENTGALLERY_BUTTON_NOTDEFAULT_DESC'); ?>" href="#" onclick="return listItemTask('cb<?php echo $i; ?>','orderstatuses.default')" class="btn btn-micro"><i class="icon-star-empty"></i></a>
                            <?php ENDIF ?>
                            <a title="<?php echo JText::_('COM_EVENTGALLERY_BUTTON_EDIT_DESC'); ?>" class="btn btn-micro" href="<?php echo
                                JRoute::_('index.php?option=com_eventgallery&task=orderstatus.edit&id='.$item->getId()); ?>">
                            <i class="icon-edit"></i></a>
                        </div>
                    </td>         
                    <td class="order nowrap">
                        <div class="input-prepend">
                            <span class="add-on"><?php echo $this->pagination->orderUpIcon( $i, true, 'orderstatuses.orderup', 'JLIB_HTML_MOVE_UP', true); ?></span>
                            <span class="add-on"><?php echo $this->pagination->orderDownIcon( $i, $n, true, 'orderstatuses.orderdown', 'JLIB_HTML_MOVE_UP', true ); ?></span>
                            <input title="<?php echo JText::_('COM_EVENTGALLERY_COMMON_ORDERING')?>" class="width-40 text-area-order" type="text" name="order[]" size="3"  value="<?php echo $item->getOrdering(); ?>" />
                        </div>
                    </td>      
                    <td>                  
                        <?php echo $this->escape($item->getDisplayName()) ?>
                        <?php IF ($item->isSystemManaged()): ?>
                            <i title="<?php echo JText::_('COM_EVENTGALLERY_ORDERSTATUS_SYSTEMMANAGED') ?>" class="icon-locked"></i>
                        <?php ENDIF ?>
                        <br>
                        <small><?php echo $this->escape($item->getDescription()) ?></small><br>
                    </td>
                    
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <div class="pagination pagination-toolbar">
            <?php echo $this->pagination->getPagesLinks(); ?>
        </div>
    </div>
    <?php echo JHtml::_('form.token'); ?>
    <input type="hidden" name="task" value="" />
    <input type="hidden" name="boxchecked" value="0" />
    <input type="hidden" name="limitstart" value="<?php echo $this->pagination->limitstart; ?>" />


</form>