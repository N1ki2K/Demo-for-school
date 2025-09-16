<?php 

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>

<?php echo $this->file->folder?>/<?php echo $this->file->file?>
<br>
<?php echo JHtml::image(JUri::base().JRoute::_("../index.php?view=thumbnail&folder=".$this->file->folder."&file=".$this->file->file."&option=com_eventgallery"),'image');?>
<br>
Kommentarabgabe für dieses Bild: <?php echo $this->file->allowcomments?"freigegeben":"gesperrt"?>
	

<script LANGUAGE="JavaScript">
<!--
    var count = 1;
    ID=window.setTimeout("update();",1000);
    function update()
    {
        if (count==0) {
        window.close();
        }
        document.form1.count.value = count--;
        ID=window.setTimeout("update();",1000);
    }
// -->
</script>

    <form name="form1">
    Fenster schliesst in
        <input title="counter" style="text-align:right ;background-color:#FFFF99; width:10px; font-size=16px; border:0 solid #333333;" type="text" name="count" value="4" size="4">
    Sekunden
    </form>

		