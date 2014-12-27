<?php

namespace App\Models\Utils;

use Symfony\Component\HttpFoundation\File\File;

/**
 * @param File $file
 *
 * @return int
 */
function get_size($file) {

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
 * Secure a path
 *
 * @param string $path
 *
 * @return string
 */
function sanitize_path($path)
{
    $path = basename($path);
    if($path == '..'){
        $path = '';
    }

    return $path;
}