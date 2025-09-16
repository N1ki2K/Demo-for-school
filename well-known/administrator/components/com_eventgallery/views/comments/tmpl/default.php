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

/**
 * @var EventgalleryLibraryFactoryFile $fileFactory
 */
$fileFactory = EventgalleryLibraryFactoryFile::getInstance();

?>

<form action="<?php echo JRoute::_('index.php'); ?>" method="post" id="adminForm" name="adminForm">
<?php if (!empty( $this->sidebar)) : ?>
	<div id="j-sidebar-container" class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div id="j-main-container" class="span10">
<?php else : ?>
	<div id="j-main-container">
<?php endif;?>
		<div id="filter-bar" class="">
			<div class="pull-left">
				Filter: <?php
				$filters = preg_split('/;/',$this->filter);
				$total = count($filters);
				$count = 0;

				foreach($filters as $filterItem)
				{
				    $temp = preg_split('/;/',$this->filter);
				    $filterArray = Array();
				    foreach($temp as $item)
				    {
				        if (strcmp($item,$filterItem)!=0)
				        {
				            array_push($filterArray,$item);
				        }
				    }
				    $filterString = implode(';',$filterArray);
				    if (strlen($filterItem)>0)
				    {
				        echo "<a href=\"";
				        echo JRoute::_( 'index.php?option=com_eventgallery&view=comments&filter='.$filterString );
				        echo "\">$filterItem</a>";
				        if ($count<$total-2)
				        {
				            echo " &gt;&gt; ";
				        }
				    }
				    $count++;
				}

				?>
			</div>



			<div class="btn-group pull-right hidden-phone">
				<label for="limit" class="element-invisible"><?php echo JText::_('JFIELD_PLG_SEARCH_SEARCHLIMIT_DESC');?></label>
				<?php echo $this->pagination->getLimitBox(); ?>
			</div>
		</div>
		<div class="clearfix"> </div>
		<table class="adminForminlist table table-striped">
			<thead>
				<tr>
					<th width="5"><?php echo JText::_( 'ID' ); ?></th>
					<th width="20">
						<!--<input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count( $this->items ); ?>);" /></th>-->
						<input type="checkbox" name="checkall-toggle" value="" title="<?php echo JText::_('JGLOBAL_CHECK_ALL'); ?>" onclick="Joomla.checkAll(this)" />
					<th width="110">Image</th>
					<th><?php echo JText::_( 'Name' ); ?></th>
					<th></th>
					<th><?php echo JText::_( 'Text' ); ?></th>
					<th><?php echo JText::_( 'Date' ); ?></th>
					<th><?php echo JText::_( 'IP' ); ?></th>
					<th><?php echo JText::_( 'UserID' ); ?></th>
					<th width="50"><?php echo JText::_( 'Filter' ); ?></th>
				</tr>
			</thead>
			<?php
			$k = 0;
			for ($i=0, $n=count( $this->items ); $i < $n; $i++)
			{
			    $row = $this->items[$i];
			    $checked 	= JHtml::_('grid.id',   $i, $row->id );
			    $published =  JHtml::_('jgrid.published', $row->published, $i,'comments.' );			   
			    $link 	= JRoute::_( 'index.php?option=com_eventgallery&task=comment.edit&id='. $row->id );

			    ?>
			<tr class="<?php echo "row$k"; ?>">
				<td><a href="<?php echo $link; ?>"><?php echo $row->id; ?></a></td>
				<td><?php echo $checked; ?></td>
				<td><a
					href="<?php echo $link?>">	
					<?php

                        $file = $fileFactory->getFile($row->folder, $row->file);

                    ?>
					<img class="thumbnail" src="<?php echo $file!=null?$file->getImageUrl(100,100, false, false):''; ?>" />
				</a></td>

				<td><a
					href="<?php echo $link; ?>"><?php echo $this->escape($row->name); ?></a>
				</td>
				<td><?php echo $published; ?></td>
				<td><a href="<?php echo $link; ?>"><?php echo $this->escape($row->text); ?></a></td>
				<td><a href="<?php echo $link; ?>"><?php echo JHtml::date($row->date)?></a>
				</td>
				<td><a
					href="<?php echo $link; ?>"><?php echo $row->ip; ?></a>
				</td>
				<td><a
					href="<?php echo $link; ?>"><?php echo $this->escape($row->user_id); ?></a>
				</td>
				<td>
					<a 
					href="<?php echo JRoute::_( 'index.php?option=com_eventgallery&view=comments&filter=folder='.$row->folder.';'.$this->filter) ?>">+ Folder</a>
					<br>
					<a 
					href="<?php echo JRoute::_( 'index.php?option=com_eventgallery&view=comments&filter=file='.$row->file.';folder='.$row->folder.';'.$this->filter) ?>">+ Image</a>
					<br>
					<a
					href="<?php echo JRoute::_( 'index.php?option=com_eventgallery&view=comments&filter=name='.$this->escape($row->name).';'.$this->filter) ?>">+ Name</a>
					<br>
					<a
					href="<?php echo JRoute::_( 'index.php?option=com_eventgallery&view=comments&filter=ip='.$row->ip.';'.$this->filter) ?>">+ IP</a>
					<br>
					<a
					href="<?php echo JRoute::_( 'index.php?option=com_eventgallery&view=comments&filter=user_id='.$this->escape($row->user_id).';'.$this->filter) ?>">+ User</a>
				</td>		
			</tr>
			<?php
			$k = 1 - $k;
		}
		?>
		</table>
		<?php echo $this->pagination->getListFooter(); ?>
</div>

	<?php echo JHtml::_('form.token'); ?>
    <input type="hidden" name="task" value="" />
	<input type="hidden" name="view" value="comments" />
    <input type="hidden" name="boxchecked" value="0" />
    <input type="hidden" name="limitstart" value="<?php echo $this->pagination->limitstart; ?>" />
	<input type="hidden" name="option" value="com_eventgallery" />	

</form>
