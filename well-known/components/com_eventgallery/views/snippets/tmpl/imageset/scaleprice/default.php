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
 * @var EventgalleryLibraryImagetype $imagetype
 */

$imagetype = $this->imagetype;
$scaleprices = $imagetype->getScalePrices();
if (count($scaleprices) == 0) {
    return;
}

if ($imagetype->getScalePriceType() == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_PACKAGE
    && $imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_IMAGETYPE) {
    echo $this->loadSnippet('imageset/scaleprice/package_imagetype');
}

if ($imagetype->getScalePriceType() == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_PACKAGE
    && $imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_LINEITEM) {
    echo $this->loadSnippet('imageset/scaleprice/package_lineitem');
}

if ($imagetype->getScalePriceType() == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_SINGLEPACKAGE
    && $imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_IMAGETYPE) {
    echo $this->loadSnippet('imageset/scaleprice/singlepackage_imagetype');
}

if ($imagetype->getScalePriceType() == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_SINGLEPACKAGE
    && $imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_LINEITEM) {
    echo $this->loadSnippet('imageset/scaleprice/singlepackage_lineitem');
}

if ($imagetype->getScalePriceType() == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_DISCOUNT
    && $imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_IMAGETYPE) {
    echo $this->loadSnippet('imageset/scaleprice/discount_imagetype');
}

if ($imagetype->getScalePriceType() == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_DISCOUNT
    && $imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_LINEITEM) {
    echo $this->loadSnippet('imageset/scaleprice/discount_lineitem');
}
