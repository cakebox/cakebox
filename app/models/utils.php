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
 * Sanitize a path to avoid directory traversing
 *
 * @param string $path
 *
 * @return string
 */
function sanitize_path($path)
{
    return preg_replace("/([\.]{2,})/", '', $path);
}
