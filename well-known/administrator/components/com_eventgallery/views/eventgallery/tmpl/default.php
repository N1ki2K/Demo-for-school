<?php 

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access'); 
?>

<style type="text/css">
	.eventgallery-row {
		margin-bottom: 20px;
	}
</style>
<?php if (!empty( $this->sidebar)) : ?>
	<div id="j-sidebar-container" class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div id="j-main-container" class="span10">
<?php else : ?>
	<div id="j-main-container">
<?php endif;?>
	<div class="container">

		<div class="row-fluid eventgallery-row">
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_EVENTS')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_EVENTS_DESC')?></p>
				<a class="btn btn-primary" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=events')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_EVENTS')?></a>			
			</div>
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_COMMENTS')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_COMMENTS_DESC')?></p>
				<a class="btn btn-primary" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=comments')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_COMMENTS')?></a>
			</div>
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_ORDERS')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_ORDERS_DESC')?></p>
				<a class="btn btn-primary" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=orders')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_ORDERS')?></a>
			</div>
		</div>

        <?php IF (!EVENTGALLERY_EXTENDED):?>
            <div class="row-fluid">
                <div class="span12">
                    <div class="alert alert-success">
                        <h2>Event Gallery Extended</h2>
                        <p>
                            The main component is not enough? You want to support the development of this component? If you're looking for <strong>additional modules, events/images in articles, search integration, Paypal payment methods</strong> and other goodies you might consider
                            upgrading to Event Gallery Extended-
                        </p>
                        <p>
                            <a class="btn btn-primary" href="https://www.svenbluege.de/joomla-event-gallery#compare">Compare</a>.
                        </p>
                    </div>
                </div>
            </div>
        <?php ENDIF ?>

        <hr>

		<div class="row-fluid eventgallery-row">

	        <div class="span4">
	            <h2><?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS')?></h2>

	            <dl class="dl-horizontal">
	                <dt><?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_EVENTS')?></dt><dd><?php echo $this->get('FolderCount')?></dd>
	                <dt><?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_FILES')?></dt><dd><?php echo $this->get('FileCount')?> (<?php echo $this->get('FileTotalCount')?>, <a title="<?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_FILES_CLEANUP_TITLE')?>" href="<?php echo JRoute::_('index.php?option=com_eventgallery&task=eventgallery.removeOldFiles')?>"><?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_FILES_CLEANUP')?></a>)</dd>
	                <dt><?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_COMMENTS')?></dt><dd><?php echo $this->get('CommentCount')?></dd>
	                <dt><?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_CARTS')?></dt><dd><?php echo $this->get('CartCount')?> (<a title="<?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_CARTS_CLEANUP_TITLE')?>" href="<?php echo JRoute::_('index.php?option=com_eventgallery&task=eventgallery.removeOldCarts')?>"><?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_CARTS_CLEANUP')?></a>) </dd>
	                <dt><?php echo JText::_('COM_EVENTGALLERY_OVERVIEW_STATISTICS_ORDERS')?></dt><dd><?php echo $this->get('OrderCount')?></dd>
	            </dl>
	        </div>
			<div class="span4">
				<h2>Support</h2>
				<p>
					For getting support or the latest version of this component just visit my site: <a href="https://www.svenbluege.de">www.svenbluege.de</a>.
				</p>
				<p>
					If you like to file a <strong>feature wish or a defect</strong> please jump over to the tracker: <a href="https://www.svenbluege.de/support">Event Gallery Tracker</a>
				</p>
                <h2>Newsletter</h2>
                <p>
                    <form action="https://tinyletter.com/svenbluege" method="post" onsubmit="window.open('https://tinyletter.com/svenbluege', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true" target="popupwindow">
                        <div class="input-append">
                            <input id="tlemail" name="email" class="" style="background-color: transparent;" type="text" placeholder="Sign up for the newsletter"/>
                            <input class="btn btn-primary" type="submit" value="Go!" />
                        </div>

                    </form>
                </p>
			</div>

			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_DOCUMENTATION')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_DOCUMENTATION_DESC')?></p>
				<a class="btn btn-primary" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=documentation')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_DOCUMENTATION')?></a>
			</div>
		</div>

		<div style="clear:both;"></div>
	    
	    <hr>
		
		<div class="row-fluid eventgallery-row">

			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_WATERMARKS')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_WATERMARKS_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=watermarks')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_WATERMARKS')?></a>
			</div>
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_CATEGORIES')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_CATEGORIES_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_categories&extension=com_eventgallery')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_CATEGORIES')?></a>
			</div>
			<div class="span4">
				
			</div>
		</div>

		<div style="clear:both;"></div>
	    <hr>

		<div class="row-fluid eventgallery-row">
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_ORDERSTATUSES')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_ORDERSTATUSES_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=orderstatuses')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_ORDERSTATUSES')?></a>
			</div>
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_IMAGETYPES')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_IMAGETYPES_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=imagetypes')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_IMAGETYPES')?></a>
			</div>
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_IMAGETYPESETS')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_IMAGETYPESETS_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=imagetypesets')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_IMAGETYPESETS')?></a>
			</div>	
		</div>

		<div class="row-fluid eventgallery-row">

			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_SURCHARGES')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_SURCHARGES_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=surcharges')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_SURCHARGES')?></a>
			</div>
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_SHIPPINGMETHODS')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_SHIPPINGMETHODS_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=shippingmethods')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_SHIPPINGMETHODS')?></a>
			</div>
			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_PAYMENTMETHODS')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_PAYMENTMETHODS_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=paymentmethods')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_PAYMENTMETHODS')?></a>
			</div>
		</div>
		
		<div class="row-fluid eventgallery-row">

			<div class="span4">
				<h2><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_EMAILTEMPLATES')?></h2>
				<p><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_EMAILTEMPLATES_DESC')?></p>
				<a class="btn btn-default" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=emailtemplates')?>"><?php echo JText::_('COM_EVENTGALLERY_SUBMENU_EMAILTEMPLATES')?></a>
			</div>
			<div class="span4">
			</div>
			<div class="span4">
			</div>
		</div>

	</div>

	<form action="<?php echo JRoute::_('index.php'); ?>" method="post" id="adminForm" name="adminForm">
		<input type="hidden" name="option" value="com_eventgallery" />
		<input type="hidden" name="task" value="" />
	    <?php echo JHtml::_('form.token'); ?>
	</form>
</div>