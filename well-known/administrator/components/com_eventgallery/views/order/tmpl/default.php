<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
JHtml::_('formbehavior.chosen', 'select');

?>

<script type="text/javascript">
    Joomla.submitbutton = function(task)
    {
        if (task == 'order.cancel' || document.formvalidator.isValid(document.id('adminForm'))) {

            Joomla.submitform(task, document.getElementById('adminForm'));
        }
        else {
            alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED'));?>');
        }
    }
</script>

<form action="<?php echo JRoute::_('index.php?option=com_eventgallery&layout=edit&id='.$this->item->getId()); ?>" method="POST" name="adminForm" id="adminForm">
<?php if (!empty( $this->sidebar)) : ?>
    <div id="j-sidebar-container" class="span2">
        <?php echo $this->sidebar; ?>
    </div>
    <div id="j-main-container" class="span10">
<?php else : ?>
    <div id="j-main-container">
<?php endif;?>
    <h3><?php echo JText::_('COM_EVENTGALLERY_ORDER_STATUS')?></h3>
        <div class="span12">
            <?php echo JText::sprintf('COM_EVENTGALLERY_DATABASE_VERSION_LABEL' , $this->form->getField('version')->value, $this->item->getVersion())?>;
            <fieldset class="adminform form-horizontal">
            
                <?php foreach ($this->form->getFieldset() as $field): ?>
                    <div class="control-group">
                        <?php if (!$field->hidden): ?>
                            <div class="control-label"><?php echo $field->label; ?></div>
                        <?php endif; ?>
                        <div class="controls">
                            <?php echo $field->input; ?>
                        </div>
                    </div>
                <?php endforeach; ?>

            </fieldset>
            <hr>
        </div>
    <h3><?php echo JText::_('COM_EVENTGALLERY_ORDER_DATA')?></h3>
        <div class="span12">
            <div class="span4">
                <h3><?php echo JText::_('COM_EVENTGALLERY_ORDER_GENERAL_INFORMATION')?></h3>
                <?php $this->lineitemcontainer = $this->item; echo $this->loadTemplate('basicinformation');?>
                <p>
                    <strong><?php echo JText::_('COM_EVENTGALLERY_ORDER_CREATIONDATE'); ?></strong><br>
                    <?php echo $this->item->getCreationDate(); ?>
                </p>
                <p>
                    <strong><?php echo JText::_('COM_EVENTGALLERY_ORDER_MODIFICATIONDATE'); ?></strong><br>
                    <?php echo $this->item->getModificationDate(); ?>
                </p>
            </div>
            <?php IF($this->item->getBillingAddress() != null):?>
            <div class="span4">
                <h3><?php echo JText::_('COM_EVENTGALLERY_ORDER_ADDRESS_BILLING')?></h3>
                <div class="billingaddress">
                    <?php $this->address = $this->item->getBillingAddress(); echo $this->loadTemplate('address');?>
                </div>
            </div>
            <?php ENDIF ?>
            <?php IF($this->item->getShippingAddress() != null):?>
            <div class="span4">
                <h3><?php echo JText::_('COM_EVENTGALLERY_ORDER_ADDRESS_SHIPPING')?></h3>
                <div class="shippingaddress">
                    <?php $this->address = $this->item->getShippingAddress(); echo $this->loadTemplate('address');?>
                </div>
            </div>
            <?php ENDIF ?>

        </div>
        <div class="span12">
            <hr>
            <?php $this->lineitemcontainer = $this->item; echo $this->loadTemplate('summary');?>
            <hr>
            <?php $this->lineitemcontainer = $this->item; echo $this->loadTemplate('total');?>
            <hr>
        </div>


        <?php echo JHtml::_('form.token'); ?>
        <input type="hidden" name="option" value="com_eventgallery" />
        <input type="hidden" name="id" value="<?php echo $this->item->getId(); ?>" />
        <input type="hidden" name="task" value="" />

    </form>

    <h3><?php echo JText::_('COM_EVENTGALLERY_ORDER_RAW_DATA')?></h3>

    <pre class="span12">
    <?php
        echo "\n";
        foreach($this->item->getLineitems() as $item) {
            /**
             * @var EventgalleryLibraryImagelineitem $item
             */
            echo $this->item->getDocumentNumber();
            echo "\t";
            echo $item->getQuantity();
            echo "\t";
            if ($item->getImageType() ) echo  $item->getImageType()->getSize();
            echo "\t";
            echo $item->getFolderName();
            echo "|";
            echo $item->getFileName();
            echo "\n";
        }
    ?>
    </pre>

    <h3><?php echo JText::_('COM_EVENTGALLERY_ORDER_SERVICELINEITEM_RAW_DATA')?></h3>
    <div class="span12">
    <?php echo $this->loadTemplate('servicelineitemdata'); ?>
    </div>
</div>