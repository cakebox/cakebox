<?php

namespace Sheaker\Service;

use Silex\Application;
use Symfony\Component\Finder\SplFileInfo;

/**
 * Provides a way to handle Sheaker Client
 */
class MainService
{
    /**
     * @var Application
     */
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Get the size of a directory or a file
     *
     * @param SplFileInfo $file SplFileInfo instance
     *
     * @return int The calculated size
     */
    public function getSize(SplFileInfo $file) {

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
    public function checkPath($basePath, $userPath)
    {
        $realBase = realpath($basePath);
        $realUser = realpath($basePath . "/" . $userPath);

        if ($realUser === false || strpos($realUser, $realBase) !== 0) {
            return "";
        }

        return $userPath;
    }
}
