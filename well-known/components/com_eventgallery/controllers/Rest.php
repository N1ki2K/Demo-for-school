<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

class EventgalleryControllerRest extends JControllerLegacy
{
    /**
     * @param bool  $cachable
     * @param array $urlparams
     *
     * @return JControllerLegacy|void
     */
    public function display($cachable = false, $urlparams = array())
    {
        parent::display(false, $urlparams);
    }

    /**
     * adds an item to the cart
     */
    public function add2cart()
    {

        $file = $this->input->getString('file', NULL);
        $folder = $this->input->getString('folder', NULL);
        $quantity = $this->input->getString('quantity', 1);
        $imagetypeid = $this->input->getString('imagetypeid', NULL);

        /* @var EventgalleryLibraryManagerCart $cartMgr */
        $cartMgr = EventgalleryLibraryManagerCart::getInstance();

        $cart = $cartMgr->getCart();
        $cart->addItem($folder, $file, $quantity, $imagetypeid, true, false);
        $cartMgr->calculateCart();
        $this->printCartJSON($cart);

    }

    /* returns the cart */

    /**
     * @param $cart - the cart object
     */
    protected function printCartJSON(EventgalleryLibraryCart $cart)
    {

        $jsonCart = array();
        foreach ($cart->getLineItems() as $lineitem) {
            /* @var $lineitem EventgalleryLibraryImagelineitem */
            $item = array(
                'file' => $lineitem->getFileName(),
                'folder' => $lineitem->getFolderName(),
                'count' => $lineitem->getQuantity(),
                'singleprice' => $lineitem->getSinglePrice(),
                'price' => $lineitem->getPrice()->getAmount(),
                'lineitemid' => $lineitem->getId(),
                'typeid' => $lineitem->getImageType()->getId(),
                'imagetag' => $lineitem->getMiniCartThumb()
            );

            array_push($jsonCart, $item);
        }


        echo json_encode($jsonCart);
    }

    public function getCart()
    {
        /* @var EventgalleryLibraryManagerCart $cartMgr */
        $cartMgr = EventgalleryLibraryManagerCart::getInstance();
        $cart = $cartMgr->getCart();
        $this->printCartJSON($cart);
    }

    /**
     * removes an item from the cart
     */
    public function removeFromCart()
    {


        $lineitemid = $this->input->getString('lineitemid', NULL);
        /* @var EventgalleryLibraryManagerCart $cartMgr */
        $cartMgr = EventgalleryLibraryManagerCart::getInstance();

        $cart = $cartMgr->getCart();
        $cart->deleteLineItem($lineitemid);
        $cartMgr->calculateCart();

        $this->printCartJSON($cart);
    }

}
