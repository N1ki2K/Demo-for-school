<?php
namespace Joomla\CMS\Log\Logger;

defined('JPATH_PLATFORM') or die;

\JLoader::registerAlias('JLogLoggerEventgalleryformattedtext',                         '\\Joomla\\CMS\\Log\\Logger\\EventgalleryformattedtextLogger', '5.0');
\JLoader::import('joomla.filesystem.file');
\JLoader::import('joomla.filesystem.folder');

/**
 * Joomla! Formatted Text File Log class
 *
 * This class is designed to use as a base for building formatted text files for output. By
 * default it emulates the Syslog style format output. This is a disk based output format.
 *
 * @package     Joomla.Platform
 * @subpackage  Log
 * @since       11.1
 */



class EventgalleryformattedtextLogger extends \JLogLoggerFormattedtext
{
    protected function initFile()
    {

        $logFilenameBase = str_replace('.php', '', $this->path);

        $logFile = $logFilenameBase.'.php';

        if(\JFile::exists($logFile)) {
            if(@filesize($logFile) > 1048756) {
                $altLog = $logFilenameBase.'-'.time().'.php';
                \JFile::copy($logFile, $altLog);
                \JFile::delete($logFile);
            }
        }


        // If the file doesn't already exist we need to create it and generate the file header.
        if (!is_file($this->path))
        {

            // Make sure the folder exists in which to create the log file.
            \JFolder::create(dirname($this->path));

            // Build the log file header.
            $head = $this->generateFileHeader();
        }
        else
        {
            $head = false;

        }

        // Open the file for writing (append mode).
        if (!$this->file = fopen($this->path, 'a'))
        {
            throw new \RuntimeException('Cannot open file for writing log');
        }
        if ($head)
        {
            if (!fwrite($this->file, $head))
            {
                throw new \RuntimeException('Cannot fput file for log');
            }
        }
    }
}