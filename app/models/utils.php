<?php

namespace App\Models\Utils;

use Silex\Application;
use Symfony\Component\Finder\SplFileInfo;


/**
 * Get the size of a directory or a file
 *
 * @param SplFileInfo $file SplFileInfo instance
 *
 * @return int The calculated size
 */
function get_size(\SplFileInfo $file) {

    $size = 0;

    try {
        if ($file->isFile()) {
            $size += $file->getSize();
        }
        else {
            foreach(new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($file->getRealpath())) as $f) {
                $size += $f->getSize();
            }
        }
    } catch (\RuntimeException $e) {}

    return $size;
}

/**
 * Check if the path contains .. to avoid directory traversing
 *
 * @param string $basePath
 * @param string $userPath
 *
 * @return string
 */
function check_path($basePath, $userPath)
{
    $realBase = realpath($basePath);
    $realUser = realpath($basePath . "/" . $userPath);

    if ($realUser === false || strpos($realUser, $realBase) !== 0) {
        return "";
    }

    return $userPath;
}

/**
 * Check if the cookie is good
 *
 * @param string $cookie
 * @param string $username
 * @param string $password
 *
 * @return string
 */
function check_cookie($cookie, $username, $password)
{
    // need to be improved, this is just for testing case on dev branch
    if ((hash('sha256', $username+$password)) === $cookie)
        return true;
    return false;
}

/**
 * Load variable of the user
 *
 * @param string $username
 */
function get_infos(Application $app, $username) {

    $inc = require_once __DIR__ . "/../../config/{$username}.php";
    if ($inc) {
        $vararr = get_defined_vars();
        foreach($vararr as $varName => $varValue) 
              $GLOBALS[$varName] = $varValue;
        global $app;
        $app = $GLOBALS['app'];
        return 1;
    } else {
        return 0;
    }

}