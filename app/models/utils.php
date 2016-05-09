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
 *
 * @return boolean
 */
function check_cookie(Application $app, $cookie)
{
    if(password_verify("{$cookie}{$app["user.salt"]}", $app["user.password"]))
        return true;
    return false;
}

/**
 * Load variable of the user
 *
 * @param string $username
 */
function get_infos(Application &$app, $username) {

    if ($app['user.auth']) {
        foreach ($app['users'] as $user) {
            if (isset($user['user.name']) && $user['user.name'] === $username) {
                foreach ($user as $key => $value) {
                    $app[$key] = $value;
                }
                return 1;
            }
        }
        return 0;
    }
    return 1;
}