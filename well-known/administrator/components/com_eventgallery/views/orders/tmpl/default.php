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

$listOrder	= $this->escape($this->state->get('list.ordering'));
$listDirn	= $this->escape($this->state->get('list.direction'));
$sortFields = $this->getSortFields();
?>

<script type="text/javascript">
    Joomla.orderTable = function()
    {
        table = document.getElementById("sortTable");
        direction = document.getElementById("directionTable");
        order = table.options[table.selectedIndex].value;
        if (order != '<?php echo $listOrder; ?>')
        {
            dirn = 'asc';
        }
        else
        {
            dirn = direction.options[direction.selectedIndex].value;
        }
        Joomla.tableOrdering(order, dirn, '');
    }
</script>

<form action="<?php echo JRoute::_('index.php?option=com_eventgallery&view=orders'); ?>"
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
            <div class="filter-search btn-group pull-left">
                <label for="filter_search" class="element-invisible"><?php echo JText::_('COM_EVENTGALLERY_ORDERS_SEARCH_LABEL');?></label>
                <input type="text" name="filter_search" id="filter_search" placeholder="<?php echo JText::_('COM_EVENTGALLERY_ORDERS_SEARCH_PLACEHOLDER'); ?>" value="<?php echo $this->escape($this->state->get('filter.search')); ?>" title="<?php echo JText::_('COM_EVENTGALLERY_ORDERS_SEARCH_DESC'); ?>" />
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
        <table class="table">
            <thead>
            <tr>
                <th width="20">
                    <input type="checkbox" name="checkall-toggle" value="" title="<?php echo JText::_('JGLOBAL_CHECK_ALL'); ?>" onclick="Joomla.checkAll(this)" />
                </th>
                <th class="nowrap" width="1%">

                </th>
                <th class="nowrap" width="1%">

                </th>
                <th>
                    <?php echo JText::_( 'COM_EVENTGALLERY_ORDERS_STATUS' ); ?>
                </th>
                <th>
                    <?php echo JText::_( 'COM_EVENTGALLERY_ORDERS_DETAILS' ); ?>
                </th>

                <th>
                    <?php echo JText::_( 'COM_EVENTGALLERY_ORDERS_PRICING' ); ?>
                </th>
            </tr>
            </thead>
            <tbody>
            <?php foreach ($this->items as $i => $item) :
            /**
             * @var EventgalleryLibraryOrder $item;
             */

                $editLink = JRoute::_('index.php?option=com_eventgallery&view=order&layout=edit&id='.$item->getId());
                $editLinkAjax = $editLink . '&tmpl=component&format=raw';
                $this->item = $item;
                $user = $this->item->getUser();
                ?>

                <tr class="row<?php echo $i % 2; ?>">
                    <td class="center">
                        <?php echo JHtml::_('grid.id', $i, $item->getId()); ?>
                    </td>
                    <td>
                        <div class="btn-group">

                            <a title="<?php echo JText::_('COM_EVENTGALLERY_BUTTON_EDIT_DESC'); ?>" class="btn btn-micro" href="<?php echo
                            JRoute::_('index.php?option=com_eventgallery&task=order.edit&id='.$item->getId()); ?>">
                                <i class="icon-edit"></i></a>

                        </div>
                    </td>
                    <td>
                        <?php echo $this->escape($item->getDocumentNumber()); ?>
                    </td>
                    <td>
                        <div data-id="<?php echo $this->item->getId(); ?>" data-editlink="<?php echo $editLinkAjax; ?>">
                            <?php echo $this->loadTemplate('orderstatus'); ?>
                        </div>
                    </td>
                    <td>

                        <?php echo JText::sprintf('COM_EVENTGALLERY_ORDERS_COUNT_SUMMARY', $item->getLineItemsCount(), $item->getLineItemsTotalCount()); ?>

                        <p class="smallsub">
                            <small>
                                <?php IF ($user != null && $user->email != null):?>
                                    <b><?php echo JText::_("COM_EVENTGALLERY_ORDERS_USER"); ?></b><br>
                                    <a href="<?php echo JRoute::_("index.php?option=com_users&task=user.edit&id=") . $user->id?>"><?php echo JText::_("COM_EVENTGALLERY_ORDERS_USER_MANAGE"); ?></a>
                                    <a href="mailto:<?php echo $this->escape($user->email) ?>"><?php echo $this->escape($user->username . ' (' . $user->email . ')') ?></a><br><br>
                                <?php ENDIF ?>
                                <?php IF (strlen($item->getEMail())>0):?>
                                    <a href="mailto:<?php echo $this->escape($item->getEMail()) ?>"><?php echo $this->escape($item->getEMail()) ?></a><br>
                                <?php ENDIF ?>

                                <?php IF (strlen($item->getPhone())>0):?>
                                    <a href="tel:<?php echo $this->escape($item->getPhone()) ?>"><?php echo $this->escape($item->getPhone()) ?></a><br>
                                <?php ENDIF ?>
                                <?php IF ($item->getBillingAddress()): ?>
                                    <?php echo $this->escape($item->getBillingAddress()->getFirstName()) ?>
                                    <?php echo $this->escape($item->getBillingAddress()->getLastName()) ?><br>
                                <?php ENDIF ?>
                            </small>    
                        </p>
                    </td>
                    <td>
                        
                        <small>       
                        <dl class="dl-horizontal" style="margin:0">
                            <dt><?php echo JText::_( 'COM_EVENTGALLERY_ORDERS_TOTAL' ); ?></dt>
                            <dd>
                               <strong> <?php echo $item->getTotal() ?></strong>
                            <dd>
                            <dt><?php echo JText::_( 'COM_EVENTGALLERY_ORDERS_SUBTOTAL' ); ?></dt>
                            <dd>
                                <?php echo $item->getSubTotal() ?>
                            </dd>
                            
                            <dt><?php echo JText::_( 'COM_EVENTGALLERY_ORDERS_SURCHARGE' ); ?> </dt>
                            <dd>
                                <?php IF ($item->getSurchargeServiceLineItem()): ?>
                                    <?php echo $item->getSurchargeServiceLineItem()->getPrice() ?>
                                <?php ELSE: ?>
                                    -
                                <?php ENDIF ?>
                            </dd>

                            <dt><?php echo JText::_( 'COM_EVENTGALLERY_ORDERS_PAYMENT' ); ?> </dt>
                            <dd>
                                <?php IF ($item->getPaymentMethodServiceLineItem()): ?>
                                  <?php echo $item->getPaymentMethodServiceLineItem()->getPrice() ?>
                                <?php ELSE: ?>
                                    -
                                <?php ENDIF ?>
                            </dd>

                            <dt><?php echo JText::_( 'COM_EVENTGALLERY_ORDERS_SHIPPING' ); ?>  </dt>
                            <dd>
                                <?php IF ($item->getShippingMethodServiceLineItem()): ?>
                                    <?php echo $item->getShippingMethodServiceLineItem()->getPrice() ?>
                                <?php ELSE: ?>
                                    -                            
                                <?php ENDIF ?>
                            </dd>
                        </dl>
                        </small>
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
    <input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>" />
    <input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>" />

    </form>