<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;


jimport('joomla.application.component.controller');
jimport('joomla.mail.mail');


/** @noinspection PhpUndefinedClassInspection */
class EventgalleryController extends JControllerLegacy
{

	public function __construct($config = array())
    {
        $this->input = JFactory::getApplication()->input;

        // Article frontpage Editor contentpluginbutton proxying:
        if ($this->input->get('view') === 'events' && $this->input->get('layout') === 'contentpluginbutton')
        {
        	$language = JFactory::getLanguage();
			$language->load('com_eventgallery' , JPATH_COMPONENT_ADMINISTRATOR, $language->getTag(), true);
	
            $config['base_path'] = JPATH_COMPONENT_ADMINISTRATOR;
        }

        parent::__construct($config);
    }

    public function display($cachable = false, $urlparams = array())
    {
        $safeurlparams = array(
            'catid' => 'STRING',
            'folder' => 'STRING',
            'file' => 'STRING',
            'Itemid' => 'INT',
            'limitstart' => 'INT',
            'limit' => 'INT');

        if ($this->input->getMethod() == 'POST')
        {
            $cachable = false;
        }



        parent::display($cachable, $safeurlparams);
    }

    function save_comment(/** @noinspection PhpUnusedParameterInspection */$cachable = false, $urlparams = array())
    {
        JSession::checkToken();

        $app = JFactory::getApplication();

        $view = $this->getView('singleimage', 'html');
        /**
         * @var EventgalleryModelSingleimage $model
         */
        $model = $this->getModel('singleimage');
        $view->setModel($model);
        $modelComment  = $this->getModel('Comment', 'EventgalleryModel');

        $data  = $this->input->post->get('jform', array(), 'array');
        $form = $modelComment->getForm();
        $validate = $modelComment->validate($form, $data);

        if ($validate === false) {

            // Get the validation messages.
            $errors	= $modelComment->getErrors();
            // Push up to three validation messages out to the user.
            for ($i = 0, $n = count($errors); $i < $n && $i < 3; $i++)
            {
                if ($errors[$i] instanceof Exception)
                {
                    $app->enqueueMessage($errors[$i]->getMessage(), 'warning');
                } else {
                    $app->enqueueMessage($errors[$i], 'warning');
                }
            }

            // Save the data in the session.
            $app->setUserState('com_eventgallery.comment.data', $data);

            // Redirect back to the contact form.
            $msg = JText::_('COM_EVENTGALLERY_SINGLEIMAGE_COMMENT_SAVE_FAILED');
            $this->setRedirect(
                JRoute::_(
                    "index.php?view=singleimage&success=false&folder=" . $this->input->getString('folder') . "&file="
                    . $this->input->getString('file'), false
                ), $msg, 'error'
            );

            return false;
        }

        $validate['file'] = $this->input->getString('file');
        $validate['folder'] = $this->input->getString('folder');
        $row = $model->store_comment($validate, true);

        // reset the user state
        $app->setUserState('com_eventgallery.comment.data', null);

        $msg = JText::_('COM_EVENTGALLERY_SINGLEIMAGE_COMMENT_SAVE_SUCCESS');
        $this->setRedirect(
            JRoute::_(
                "index.php?view=singleimage&success=true&folder=" . $this->input->getString('folder') . "&file="
                . $this->input->getString('file'), false
            ), $msg, 'success'
        );



        $mailer = JFactory::getMailer();
        $params = JComponentHelper::getParams('com_eventgallery');

        $userids = JAccess::getUsersByGroup($params->get('admin_usergroup'));

        if (count($userids) == 0) {
            return false;
        }

        foreach ($userids as $userid) {
            $user = JUser::getInstance($userid);
            if ($user->sendEmail==1) {

                $mailadress = JMailHelper::cleanAddress($user->email);
                $mailer->addRecipient($mailadress);
            }
        }

        $config = JFactory::getConfig();
        $sender = array(
            $config->get( 'mailfrom' ),
            $config->get( 'fromname' ) );

        $mailer->setSender($sender);

        $this->input->set('newCommentId', $row->id);


        $mailview = $this->getView('commentmail', 'html');
        /**
         *
         * @var EventgalleryModelComment $commentModel
         */
        $commentModel = $this->getModel('comment');
        $mailview->setModel($commentModel, true);


        $bodytext = $mailview->loadTemplate();
        #$mailer->LE = "\r\n";
        $mailer->LE = "\n";
        $bodytext = JMailHelper::cleanBody($bodytext);


        $mailer->setSubject(
            JMailHelper::cleanSubject(
                $row->folder . "|" . $row->file . ' - ' .JText::_('COM_EVENTGALLERY_COMMENT_ADD_MAIL_SUBJECT')
                . ' - ' .$app->get('sitename')
            )
        );
        $mailer->setBody($bodytext);

        $mailer->isHtml(true);
        return $mailer->Send();

    }

    /**
     * resets the view cache so we can run multiple test to the same view but different layouts.
     */
    public function resetViewCache() {
        parent::$views = null;
    }
}

