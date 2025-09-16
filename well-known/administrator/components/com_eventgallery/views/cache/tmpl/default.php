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

<p>
    <?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_START_DESC'); ?>
</p>


<div class="btn-group">
	<button class="btn checkall"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_CHECK_ALL');?></button>
	<button class="btn uncheckall"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_CHECK_NONE');?></button>

	<button class="btn btn-danger start"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_START');?></button>
</div>

<p><progress style="display:none; width:100%; margin: 20px 0" id="syncprogress" value="0" max="100"></progress></p>

<form class="form-horizontal" name="items">

	<div class="control-group">
		<label class="control-label"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_FOLDER_PICASA'); ?></label>
	    <div class="controls">
			<label class="checkbox">
				<input class="folder" type="checkbox" name="picasa" value="picasa"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_FOLDER_PICASA'); ?>
				(<?php echo $this->folders['picasa']['count']  ?>, 
				<?php echo $this->folders['picasa']['size']  ?>)
			</label>
		</div>
	</div>

	<div class="control-group">
		<label class="control-label"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_FOLDER_FLICKR'); ?></label>
		<div class="controls">
			<label class="checkbox">
				<input class="folder" type="checkbox" name="flickr" value="flickr"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_FOLDER_FLICKR'); ?>
				(<?php echo $this->folders['flickr']['count']  ?>,
				<?php echo $this->folders['flickr']['size']  ?>)
			</label>
		</div>
	</div>

	<div class="control-group">
		<label class="control-label"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_FOLDER_GENERAL'); ?></label>
	    <div class="controls">
			<label class="checkbox">
				<input class="folder" type="checkbox" name="general" value="general"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_FOLDER_GENERAL'); ?>
				(<?php echo $this->folders['general']['count']  ?>, 
				<?php echo $this->folders['general']['size']  ?>)
			</label>
		</div>
	</div>
	
	<div class="control-group">
	    <label class="control-label"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_FOLDER_IMAGES'); ?></label>
	    <div class="controls">
			<?php FOREACH ($this->folders['images'] as $foldername=>$data):?> 
				<label class="checkbox">
					<input class="folder" type="checkbox" name="images" value="<?php echo htmlentities($foldername, ENT_QUOTES, "UTF-8");  ?>"> <?php echo $foldername;  ?> (<?php echo $data['count']; ?>, <?php echo $data['size']; ?>)
				</label>
			<?php ENDFOREACH; ?>
	    </div>
	</div>

	<div class="control-group">
	    <div class="controls">
			<button class="btn btn-danger start"><?php echo JText::_('COM_EVENTGALLERY_CLEAR_CACHE_START');?></button>
	    </div>
	</div>

</form>

<form action="<?php echo JRoute::_('index.php'); ?>" method="post" name="adminForm" id="adminForm">
<input type="hidden" name="option" value="com_eventgallery" />
<input type="hidden" name="task" value="cache.display" />
<?php echo JHtml::_('form.token'); ?>
</form>

<script type="text/javascript">

(function(jQuery) {

    var folderContainers  = [];
    var max = 0;

	function checkAll(formname, checktoggle)
	{
	    var checkboxes = [];
	    checkboxes = document.forms[formname].getElementsByTagName('input');

	    for (var i = 0; i < checkboxes.length; i++) {
	        if (checkboxes[i].type === 'checkbox') {
	            checkboxes[i].checked = checktoggle;
	        }
	    }
	}

    function syncFolder() {

        updateProcess();

        if (folderContainers.length==0) {
            done();
            return;
        }

        var myElement = jQuery(folderContainers.pop());

        var jqxhr = jQuery.ajax( '<?php echo JRoute::_('index.php?option=com_eventgallery&format=raw&task=cache.process&'.JSession::getFormToken().'=1', false);?>' ,
            {
                data : myElement.attr('name')+'='+myElement.val()
            })
            .done(function(data, textStatus, jqXHR) {
                myElement.parent().remove();
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                myElement.parent().set('html', 'Sorry, your request failed :('+jqXHR.status+')');
                console.log(jqXHR);
            })
            .always(function() {
                syncFolder();
            });

    }

    function start() {

    	var syncProgressElement = document.getElementById('syncprogress');

        jQuery(".folder").each(function(index, item){
        	if (this.checked) {
            	folderContainers.push(this);
        	}
        });

        max = folderContainers.length;

        syncProgressElement.setAttribute('max', max);
        syncProgressElement.setAttribute('value', 0);
        syncProgressElement.style.display = 'block';

        syncFolder();
    }

    function updateProcess() {
		var syncProgressElement = document.getElementById('syncprogress');	
        syncProgressElement.setAttribute('value', max-folderContainers.length);
    }

    function done() {
		alert('Done');
    	console.log('cache clearing done');
    }

    jQuery( document ).on( "click", "button.checkall", function(e) {
		e.preventDefault();
        checkAll('items', true);
    });

    jQuery( document ).on( "click", "button.uncheckall", function(e) {
		e.preventDefault();
		checkAll('items', false);
    });

    jQuery( document ).on( "click", "button.start", function(e) {
		e.preventDefault();
		start();
    });

})(eventgallery.jQuery);

</script>
