<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_content
 *
 * @copyright   Copyright (C) 2005 - 2014 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$app = JFactory::getApplication();

if ($app->isSite())
{
	JSession::checkToken('get') or die(JText::_('JINVALID_TOKEN'));
}

$version =  new JVersion();

JHtml::_('bootstrap.tooltip');
JHtml::_('behavior.multiselect');
JHtml::_('formbehavior.chosen', 'select');


$function  =  $app->input->getString('function', 'jSelectEvent');
$listOrder	= $this->escape($this->state->get('list.ordering'));
$listDirn	= $this->escape($this->state->get('list.direction'));
$sortFields = $this->getSortFields();


$saveOrder	= $listOrder == 'ordering';
if ($saveOrder)
{
    $saveOrderingUrl = 'index.php?option=com_eventgallery&task=events.saveOrderAjax&tmpl=component';
    JHtml::_('sortablelist.sortable', 'eventsList', 'adminForm', strtolower($listDirn), $saveOrderingUrl);
}

?>

<script type="text/javascript">
    Joomla.orderTable = function()
    {
        table = document.getElementById("sortTable");
        direction = document.getElementById("directionTable");
        order = table.options[table.selectedIndex].value;
        if (order != '<?php echo $listOrder; ?>')
        {
            dirn = 'desc';
        }
        else
        {
            dirn = direction.options[direction.selectedIndex].value;
        }
        Joomla.tableOrdering(order, dirn, '');
    }
</script>
<form method="post" id="adminForm" name="adminForm">
		<div id="filter-bar" class="btn-toolbar">
            <div class="filter-search btn-group pull-left">
                <label for="filter_search" class="element-invisible"><?php echo JText::_('COM_EVENTGALLERY_EVENT_SEARCH_LABEL');?></label>
                <input type="text" name="filter_search" id="filter_search" placeholder="<?php echo JText::_('COM_EVENTGALLERY_EVENT_SEARCH_PLACEHOLDER'); ?>" value="<?php echo $this->escape($this->state->get('filter.search')); ?>" title="<?php echo JText::_('COM_EVENTGALLERY_ORDERS_SEARCH_DESC'); ?>" />
            </div>
            <div class="btn-group pull-left">
                <button class="btn hasTooltip" type="submit" title="<?php echo JText::_('JSEARCH_FILTER_SUBMIT'); ?>"><i class="icon-search"></i></button>
                <button class="btn hasTooltip" type="button" title="<?php echo JText::_('JSEARCH_FILTER_CLEAR'); ?>" onclick="document.id('filter_search').value='';this.form.submit();"><i class="icon-remove"></i></button>
            </div>
            <div class="btn-group pull-right hidden-phone">
                <label for="limit" class="element-invisible"><?php echo JText::_('JFIELD_PLG_SEARCH_SEARCHLIMIT_DESC');?></label>
                <?php echo $this->pagination->getLimitBox(); ?>
            </div>
            <div class="btn-group pull-right hidden-phone">
                <label for="directionTable" class="element-invisible"><?php echo JText::_('JFIELD_ORDERING_DESC');?></label>
                <select name="directionTable" id="directionTable" class="input-medium" onchange="Joomla.orderTable()">
                    <option value=""><?php echo JText::_('JFIELD_ORDERING_DESC');?></option>
                    <option value="asc" <?php if ($listDirn == 'asc') echo 'selected="selected"'; ?>><?php echo JText::_('COM_EVENTGALLERY_ORDER_ASCENDING');?></option>
                    <option value="desc" <?php if ($listDirn == 'desc') echo 'selected="selected"'; ?>><?php echo JText::_('COM_EVENTGALLERY_ORDER_DESCENDING');?></option>
                </select>
            </div>
            <div class="btn-group pull-right">
                <label for="sortTable" class="element-invisible"><?php echo JText::_('COM_EVENTGALLERY_SORT_BY');?></label>
                <select name="sortTable" id="sortTable" class="input-medium" onchange="Joomla.orderTable()">
                    <option value=""><?php echo JText::_('COM_EVENTGALLERY_SORT_BY');?></option>
                    <?php echo JHtml::_('select.options', $sortFields, 'value', 'text', $listOrder);?>
                </select>
            </div>
        </div>
		<div class="clearfix"> </div>

	<table class="adminlist table table-striped" id="eventsList">
		<thead>
			<tr>
                <th class="nowrap" width="1%">
					
				</th>
				<th>
					<?php echo JText::_( 'COM_EVENTGALLERY_EVENTS_FOLDERNAME' ); ?>
				</th>
				
				<th>
					<?php echo JText::_( 'COM_EVENTGALLERY_EVENTS_DISPLAYNAME' ); ?>
				</th>
                <th class="nowrap">
                    <?php echo JText::_( 'COM_EVENTGALLERY_EVENTS_EVENT_DATE' ); ?>
                </th>
				
			</tr>			
		</thead>
		<?php
		
		for ($i=0, $n=count( $this->items ); $i < $n; $i++)
		{
			$row = $this->items[$i];		

            /**
             * @var EventgalleryLibraryFactoryFolder $folderMgr
             */
            $folderMgr = EventgalleryLibraryFactoryFolder::getInstance();
            $folder = $folderMgr->getFolder($row->folder);

			?>
			<tr class="">
				<td>
					<div class="btn-group">

                        
                        <?php IF ($row->published==1): ?>
                            <a title="<?php echo JText::_('COM_EVENTGALLERY_BUTTON_PUBLISHED_DESC'); ?>" style="color: green" class="btn btn-micro active jgrid" href="javascript:void(0);" >
                                <span class="state"><i class="icon-publish"></i></span>
                            </a>
                        <?php ELSE:?>
                            <a title="<?php echo JText::_('COM_EVENTGALLERY_BUTTON_UNPUBLISHED_DESC'); ?>" style="color: red" class="btn btn-micro jgrid" href="javascript:void(0);">
                                <span class="state"><i class="icon-unpublish"></i></span>
                            </a>
                        <?php ENDIF ?>


                        <?php IF ($row->cartable==1): ?>
                            <a title="<?php echo JText::_('COM_EVENTGALLERY_BUTTON_CARTABLE_DESC'); ?>" style="color: green" class="btn btn-micro active jgrid" href="javascript:void(0);">
                                <span class="state"><i class="icon-cart"></i></span>
                            </a>
                        <?php ELSE:?>
                            <a title="<?php echo JText::_('COM_EVENTGALLERY_BUTTON_UNCARTABLE_DESC'); ?>" style="color: red" class="btn btn-micro jgrid" href="javascript:void(0);" >
                                <span class="state"><i class="icon-cart"></i></span>
                            </a>
                        <?php ENDIF ?>                        
					</div>				
				</td>
				<td>
					<a href="javascript:void(0)" onclick="if (window.parent) window.parent.<?php echo $this->escape($function);?>(<?php echo htmlspecialchars(json_encode($folder->getFolderName()), ENT_QUOTES, 'UTF-8'); ?>, <?php echo htmlspecialchars(json_encode($folder->getDisplayName()), ENT_QUOTES, 'UTF-8'); ?>);">
						<?php echo $row->folder;
               		     
                    ?></a><br/>
                    <small><?php echo $folder->getFileCount();?> <?php echo JText::_('COM_EVENTGALLERY_EVENTS_FILECOUNT_FILES'); ?></small><br/>

				</td>

                <td>
					<?php echo $folder->getDisplayName();?>
				</td>
                <td class="nowrap">
                    <?php echo JHtml::date($row->date, JText::_('DATE_FORMAT_LC3')); ?><br>
                </td>
                
			</tr>
			<?php
			
		}
		?>
		</table>
		<div class="pagination pagination-toolbar">
			<?php echo $this->pagination->getPagesLinks(); ?>
		</div>
	</div>

    <?php //Load the batch processing form. ?>
    <?php echo $this->loadTemplate('batch'); ?>

	<?php echo JHtml::_('form.token'); ?>
    <input type="hidden" name="task" value="" />
    <input type="hidden" name="boxchecked" value="0" />
    <input type="hidden" name="limitstart" value="<?php echo $this->pagination->limitstart; ?>" />
    <input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>" />
    <input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>" />
	<input type="hidden" name="option" value="com_eventgallery" />	
	<input type="hidden" name="layout" value="modal" />	
	<input type="hidden" name="tmpl" value="component" />	
	<input type="hidden" name="function" value="<?php echo $function; ?>" />	
</form>
