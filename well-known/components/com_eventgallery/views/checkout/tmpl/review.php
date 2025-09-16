<?php // no direct access

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

?>



<div class="eventgallery-checkout eventgallery-review-page">
    <h1><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_HEADLINE') ?></h1>
    <?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_TEXT') ?>&nbsp;

    <form action="<?php echo JRoute::_("index.php?option=com_eventgallery&view=checkout&task=createOrder") ?>"
          method="post" class="form-validate form-horizontal checkout-form">

        <?php $this->set('edit',true); $this->set('lineitemcontainer',$this->cart); echo $this->loadSnippet('checkout/summary') ?>

        <div class="clearfix"></div>

        <?php IF ($this->params->get('use_terms_conditions_checkbox', 1)==1):?>
        <fieldset>
            <div class="control-group">
                <div class="controls">
                    <label class="checkbox">                  
                        <input type="checkbox" name="tac" class="validate required">    
                        <?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_TERMCONDITIONS_CHECKBOX_LABEL') ?>                        
                    </label>
                </div>
            </div>
        </fieldset>
        <?php ENDIF; ?>
        <fieldset>
            <div class="control-group">
                <div class="controls">
                    <label>                                          
                        <?php
                            $disclaimerObject = new EventgalleryLibraryDatabaseLocalizablestring($this->params->get('checkout_disclaimer',''));
                            $disclaimer = strlen($disclaimerObject->get())>0?$disclaimerObject->get():JText::_('COM_EVENTGALLERY_CART_CHECKOUT_ORDER_MAIL_CONFIRMATION_DISCLAIMER');
                        ?>
                        
                        <ul class="nav nav-pills">
                            <li><a class="disclaimer" data-eventgallery-lightbox="content" href="#mb_disclaimer"><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_DISCLAIMER')?></a></li>
                            <?php IF(strlen($this->params->get('pp_article_link'))>0):?>
                                <li><a class="pp"       target="_blank" rel="nofollow" href="<?php echo $this->params->get('pp_article_link');?>"><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_PRIVACYPOLICY');?></a></li>
                            <?php ENDIF?>
                            <?php IF(strlen($this->params->get('tac_article_link'))>0):?>
                                <li><a class="tac"      target="_blank" rel="nofollow" href="<?php echo $this->params->get('tac_article_link');?>"><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_TAC');?></a></li>
                            <?php ENDIF?>
                            <?php IF(strlen($this->params->get('impress_article_link'))>0):?>
                                <li><a class="impress"  target="_blank" rel="nofollow" href="<?php echo $this->params->get('impress_article_link');?>"><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_IMPRESS');?></a></li>
                            <?php ENDIF?>
                        </ul>
                    </label>
                     <div style="display:none">
                        <div id="mb_disclaimer" class="inline-content">                            
                            <?php echo $disclaimer; ?>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
        <fieldset>
            <div class="form-actions">
                  <a class="btn" href="<?php echo JRoute::_(
                        "index.php?option=com_eventgallery&view=checkout&task=change"
                    ) ?>"><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_FORM_CHANGE') ?></a>
                
                <input name="continue" type="submit" class="btn btn-primary"
                       value="<?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_FORM_CONTINUE') ?>"/>
            </div>
        </fieldset>
        <?php echo JHtml::_('form.token'); ?>
    </form>    
</div>



<?php echo $this->loadSnippet('footer_disclaimer'); ?>