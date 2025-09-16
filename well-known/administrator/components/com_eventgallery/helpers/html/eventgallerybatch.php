<?php
/**
 * @package     Joomla.Libraries
 * @subpackage  HTML
 *
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_BASE') or die;

/**
 * Extended Utility class for batch processing widgets.
 *
 * @package     Joomla.Libraries
 * @subpackage  HTML
 * @since       1.7
 */
abstract class JHtmlEventgalleryBatch
{
	/**
	 * Display a batch widget for the access level selector.
	 *
	 * @return  string  The necessary HTML for the widget.
	 *
	 */
	public static function usergroup()
	{

        $db = JFactory::getDbo();
        $query = $db->getQuery(true)
            ->select('a.id AS value')
            ->select('a.title AS text')
            ->select('COUNT(DISTINCT b.id) AS level')
            ->from('#__usergroups as a')
            ->join('LEFT', '#__usergroups  AS b ON a.lft > b.lft AND a.rgt < b.rgt')
            ->group('a.id, a.title, a.lft, a.rgt')
            ->order('a.lft ASC');
        $db->setQuery($query);

        if ($options = $db->loadObjectList())
        {
            foreach ($options as &$option)
            {
                $option->text = str_repeat('- ', $option->level) . $option->text;
            }
        }


		// Create the batch selector to change an access level on a selection list.
		$return =
			'<label id="batch-usergroup-lbl" for="batch-usergroup" class="hasToolip"'
			. 'title="' . JHtml::tooltipText('COM_EVENTGALLERY_BATCH_USERGROUP_LABEL', 'COM_EVENTGALLERY_BATCH_USERGROUP_DESC') . '">'
			. JText::_('COM_EVENTGALLERY_BATCH_USERGROUP_LABEL')
			. '</label>';

        $return .= '<select multiple="multiple" name="batch[usergroup][]" id="batch-usergroup" class="inputbox">';
        $return .= '<option  value="">'.JText::_('COM_EVENTGALLERY_BATCH_USERGROUP_KEEP').'</option>';

        foreach($options as $option) {
            /**
             * @var EventgalleryLibraryWatermark $watermark
             */

            $return .= '<option value="'.$option->value.'">'.$option->text.'</option>';
        }
        $return .= "</select>";
        return $return;

	}

    /**
     * createa a input field for a password
     *
     * @return string
     */
    public static function password() {

		return '<label id="batch-password-lbl" for="batch-password" class="hasToolip"'
			. 'title="' . JHtml::tooltipText('COM_EVENTGALLERY_BATCH_PASSWORD_LABEL', 'COM_EVENTGALLERY_BATCH_PASSWORD_DESC') . '">'
			. JText::_('COM_EVENTGALLERY_BATCH_PASSWORD_LABEL')
			. '</label>'
			. '<input type="text" class="inputbox" id="batch-password" name="batch[password]" />'
		;

	}

    /**
     * Creates a select box for a watermark
     *
     * @return string
     */
    public static function watermark() {
        /**
         * @var EventgalleryLibraryFactoryWatermark $watermarkFactory
         */
        $watermarkFactory = EventgalleryLibraryFactoryWatermark::getInstance();

        $watermarks = $watermarkFactory->getWatermarks(false);

        $return = '<label id="batch-watermark-lbl" for="batch-watermark" class="hasToolip"'
        . 'title="' . JHtml::tooltipText('COM_EVENTGALLERY_BATCH_WATERMARK_LABEL', 'COM_EVENTGALLERY_BATCH_WATERMARK_DESC') . '">'
        . JText::_('COM_EVENTGALLERY_BATCH_WATERMARK_LABEL')
        . '</label>';

        $return .= '<select name="batch[watermark]" id="batch-watermark" class="inputbox">';
        $return .= '<option  value="">'.JText::_('COM_EVENTGALLERY_BATCH_WATERMARK_KEEP').'</option>';
        $return .= '<option  value="-1">'.JText::_('COM_EVENTGALLERY_WATERMARK_NONE').'</option>';

        foreach($watermarks as $watermark) {
            /**
             * @var EventgalleryLibraryWatermark $watermark
             */

            $return .= '<option value="'.$watermark->getId().'">'.$watermark->getName().'</option>';
        }
        $return .= "</select>";
		return $return;

	}

    /**
     * Creates a select box for an imagetypeset.
     *
     * @return string
     */
    public static function imagetypeset() {
        /**
         * @var EventgalleryLibraryFactoryImagetypeset $imagetypesetFactory
         */
        $imagetypesetFactory = EventgalleryLibraryFactoryImagetypeset::getInstance();

        $imagetypesets = $imagetypesetFactory->getImageTypeSets(true);

        $return = '<label id="batch-imagetypeset-lbl" for="batch-imagetypeset" class="hasToolip"'
            . 'title="' . JHtml::tooltipText('COM_EVENTGALLERY_BATCH_IMAGETYPESET_LABEL', 'COM_EVENTGALLERY_BATCH_IMAGETYPESET_DESC') . '">'
            . JText::_('COM_EVENTGALLERY_BATCH_IMAGETYPESET_LABEL')
            . '</label>';

        $return .= '<select name="batch[imagetypeset]" id="batch-imagetypeset" class="inputbox">';

        $return .= '<option  value="">'.JText::_('COM_EVENTGALLERY_BATCH_IMAGETYPESET_KEEP').'</option>';

        foreach($imagetypesets as $imagetypeset) {
            /**
             * @var EventgalleryLibraryImagetypeset $imagetypeset
             */

            $return .= '<option  value="'.$imagetypeset->getId().'">'.$imagetypeset->getName().'</option>';
        }
        $return .= "</select>";

        return $return;

	}

    /**
     * create category select box
     *
     * @return string
     */
    public static function categories(){
        $extension = 'com_eventgallery';

        $options = array(
            //JHtml::_('select.option', 'c', JText::_('JLIB_HTML_BATCH_COPY')),
            JHtml::_('select.option', 'm', JText::_('JLIB_HTML_BATCH_MOVE'))
        );



        return
            '<label id="batch-choose-action-lbl" for="batch-choose-action">' . JText::_('JLIB_HTML_BATCH_MENU_LABEL') . '</label>'
            . '<div id="batch-choose-action" class="control-group">'
            . '<select name="batch[category_id]" class="inputbox" id="batch-category-id">'
            . '<option value="">' . JText::_('JSELECT') . '</option>'
            . JHtml::_('select.options', JHtml::_('category.options', $extension))
            . '</select>'
            . '</div>'
            . '<div id="batch-move-copy" class="control-group radio">'
            . JHtml::_('select.radiolist', $options, 'batch[move_copy]', '', 'value', 'text', 'm')
            . '</div>';
    }

    /**
     * Provides a text field for entering tags and radio buttons to select the behavior.
     *
     * @return string
     */
    public static function tags() {

        JHtml::_('bootstrap.tooltip', '.modalTooltip', array('container' => '.modal-body'));

        $return = '<label id="batch-tags-lbl" for="batch-tags" class="hasToolip"'
            . 'title="' . JHtml::tooltipText('COM_EVENTGALLERY_BATCH_TAGS_LABEL', 'COM_EVENTGALLERY_BATCH_TAGS_DESC') . '">'
            . JText::_('COM_EVENTGALLERY_BATCH_TAGS_LABEL')
            . '</label>';




        $return .= '
            <div class="control-group">';

        // Create the batch selector to tag items on a selection list.
        $return .=
             '<select name="batch[tags]" class="inputbox" id="batch-tag-id">'
            . '<option value="">' . JText::_('JLIB_HTML_BATCH_TAG_NOCHANGE') . '</option>'
            . JHtml::_('select.options', JHtml::_('tag.tags', array('filter.published' => array(1))), 'value', 'text')
            . '</select>';
        $return .='
            </div>
            <div class="control-group radio">

                <label for="batch[tags_action]a" id="batch[tags_action]a-lbl" class="radio">
                    <input type="radio" name="batch[tags_action]" id="batch[tags_action]a" value="add" checked="checked">'.JText::_('COM_EVENTGALLERY_BATCH_TAGS_ACTION_ADD_LABEL').'
                </label>
                <label for="batch[tags_action]r" id="batch[tags_action]r-lbl" class="radio">
                    <input type="radio" name="batch[tags_action]" id="batch[tags_action]r" value="remove">'.JText::_('COM_EVENTGALLERY_BATCH_TAGS_ACTION_REMOVE_LABEL').'
                </label>
            </div>';

        return $return;
    }





}
