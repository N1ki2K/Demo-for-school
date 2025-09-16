<?php 

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

$app = JFactory::getApplication();

JHtml::_('behavior.tooltip');
JHtml::_('formbehavior.chosen', 'select');

$this->form = $this->get('ContentPluginButtonForm');

$script  = '

function updateContentTag() {
    var $tag = jQuery("#contenttagfield"),
        eventElement = document.getElementById("jform_folder_id"),
        event = eventElement.value,
        attrElement = document.getElementById("jform_attr"),
        attr = attrElement.options[attrElement.selectedIndex].value,
        modeElement = document.getElementById("jform_image_mode"),
        mode = modeElement.options[modeElement.selectedIndex].value,
        max_images = document.getElementById("jform_max_images").value,
        offset = document.getElementById("jform_offset").value,
        thumb_width = document.getElementById("jform_image_width").value,
        tag = "",
        type = "";
        
	if (attr == "text_intro") {
		attr = "text";
		type = "intro";
	}

	if (attr == "text_full") {
		attr = "text";
		type = "full";
	}
	
	tag   = "{eventgallery ";
	tag = tag + "event=\'" + event +"\' ";
	tag = tag + "attr="+ attr +" ";
	
	if (attr == "text") {
		tag = tag + "type="+ type +" ";
	} 
	
	if (attr == "images") {
		tag = tag + "mode="+ mode +" "; 
		tag = tag + "max_images="+ max_images +" ";
		tag = tag + "thumb_width="+ thumb_width + " ";
		tag = tag + "offset="+ offset + " ";
	}

	tag = tag + "}";
	
	$tag.html(tag);
}

function insertContentTag() {
    updateContentTag();
	var tag = document.getElementById("contenttagfield").innerHTML;
	window.parent.jInsertEditorText(tag, \''.$this->escape($app->input->getString('e_name')).'\')
	window.parent.SqueezeBox.close()
	return false;
}

jQuery(function() {
    jQuery("input, select").on("change", updateContentTag); 
    updateContentTag();
});
';

JFactory::getDocument()->addScriptDeclaration($script);
?>

<?php echo $this->loadSnippet('formfields'); ?>
<p>
    <button class="btn btn-primary" onclick="insertContentTag();"><?php echo JText::_('COM_EVENTGALLERY_CONTENTPLUGINBUTTON_BUTTON_INSERT'); ?></button>
</p>
<pre><span id="contenttagfield"></span></pre>