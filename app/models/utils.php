<?php

namespace App\Models\Utils;

use Symfony\Component\Finder\SplFileInfo;


/**
 * Get the size of a directory or a file
 *
 * @param SplFileInfo $file SplFileInfo instance
 *
 * @return int The calculated size
 */
function get_size(SplFileInfo $file) {

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
 * @param string $path
 *
 * @return string
 */
function check_path($path)
{
    return (basename($path) != "..") ? $path : "";
}
