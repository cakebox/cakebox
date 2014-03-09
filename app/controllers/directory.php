<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\Finder\Finder;


function get_Size($file) {

    $size = 0;

    if ($file->isFile()) {

        try {
            $size += $file->getSize();
        } catch (RuntimeException $e) {}
    }
    else {

        foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($file->getRealpath())) as $f) {
            try {
                $size += $f->getSize();
            } catch (RuntimeException $e) {}
        }
    }

    return $size;
}

$app->get("/api/directory/content/{dir}", function (Request $request, $dir) use ($app) {

    $dirContent = array();

    $finder = new Finder();
    $finder->followLinks()->depth('< 1')->in("{$app['cakebox.root']}{$dir}")->sortByType();

    foreach ($finder as $file) {

        if ($file->isLink()) {
            $linkTo = readlink("{$app['cakebox.root']}{$dir}{$file->getBasename()}");
            if (file_exists($linkTo) == false)
                continue;

            $file = new SplFileInfo($linkTo);
        }

        $pathInfo = array();
        $pathInfo["name"] = $file->getBasename();
        $pathInfo["type"] = $file->getType();
        $pathInfo["ctime"] = $file->getCTime();
        $pathInfo["size"] = get_Size($file);
        $pathInfo["access"] = "{$app['cakebox.access']}{$dir}{$file->getBasename()}";

        // for further support
        $pathInfo["extraType"] = false;
        if ( explode("/", mime_content_type($file->getRealpath()) )[0] == "video" || $file->getExtension() == "mkv" )
            $pathInfo["extraType"] = "video";
        elseif (
            $file->getExtension() == 'mp3' ||
            $file->getExtension() == 'flac' ||
            $file->getExtension() == 'ogg' ||
            $file->getExtension() == 'aac' ||
            $file->getExtension() == 'wma' ) {
            $pathInfo["extraType"] = 'music';
        } elseif (
            $file->getExtension() == 'png' ||
            $file->getExtension() == 'gif' ||
            $file->getExtension() == 'jpg' ||
            $file->getExtension() == 'jpeg') {
            $pathInfo["extraType"] = 'image';
        } elseif (
            $file->getExtension() == 'rar' ||
            $file->getExtension() == 'zip' ||
            $file->getExtension() == 'gz' ||
            $file->getExtension() == 'bz2') {
            $pathInfo["extraType"] = 'archive';
        } elseif ($file->getExtension() == 'srt') {
            $pathInfo["extraType"] = 'subtitle';
        }

        array_push($dirContent, $pathInfo);
    }

    return $app->json($dirContent);
})
->value("dir", "")
->assert("dir", ".*");

