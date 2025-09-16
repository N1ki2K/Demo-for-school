<?php // no direct access

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

/**
* PARAMS: 
* - address
*/
?>

<?php IF (strlen($this->address->getCompanyName())>0):?>
    <?php echo $this->escape($this->address->getCompanyName()); ?><br/>
<?php ENDIF; ?>
<?php echo $this->escape($this->address->getFirstName()); ?> <?php echo $this->escape($this->address->getLastName()); ?> <br/>
<?php echo $this->escape($this->address->getAddress1()); ?><br/>
<?php IF (strlen($this->address->getAddress2())>0):?>
    <?php echo $this->escape($this->address->getAddress2()); ?><br/>
<?php ENDIF; ?>
<?php IF (strlen($this->address->getAddress3())>0):?>
    <?php echo $this->escape($this->address->getAddress3()); ?><br/>
<?php ENDIF; ?>
<?php echo $this->escape($this->address->getZip()); ?> <?php echo $this->escape($this->address->getCity()); ?>
<?php IF (strlen($this->address->getState())>0):?>
    <br/><?php echo $this->escape(EventgalleryLibraryCommonGeoobjects::getStateName($this->address->getState())); ?>
<?php ENDIF; ?>
<?php IF (strlen($this->address->getCountry())>0):?>
    <br/><?php echo $this->escape(EventgalleryLibraryCommonGeoobjects::getCountryName($this->address->getCountry())); ?>
<?php ENDIF; ?>
