<?php

namespace App\Controllers\Directory;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Finder\Finder;


$app->get("/api/directory/content",  __NAMESPACE__ . "\\get_content");
$app->get("/api/directory/archive",  __NAMESPACE__ . "\\archive_directory");


function get_Size($file) {

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

function get_content(Application $app, Request $request) {

    $dirpath = $request->get('path');

    if (!isset($dirpath)) {
        $app->abort(400, "Missing parameters.");
    }

    $dirContent = [];

    $finder = new Finder();
    $finder->followLinks()
            ->depth('< 1')
            ->in("{$app['cakebox.root']}{$dirpath}")
            ->ignoreVCS(true)
            ->ignoreDotFiles($app['directory.ignoreDotFiles'])
            ->notName($app["directory.ignore"])
            ->sortByType();

    foreach ($finder as $file) {

        if ($file->isLink()) {
            $linkTo = readlink("{$app['cakebox.root']}{$dirpath}{$file->getBasename()}");
            if (file_exists($linkTo) == false)
                continue;

            $file = new \SplFileInfo($linkTo);
        }

        $pathInfo              = [];
        $pathInfo["name"]      = $file->getBasename();
        $pathInfo["type"]      = $file->getType();
        $pathInfo["ctime"]     = $file->getCTime();
        $pathInfo["size"]      = get_Size($file);
        $pathInfo["access"]    = "{$app['cakebox.access']}{$dirpath}{$file->getBasename()}";
        $pathInfo["extraType"] = "";

        $ext = strtolower($file->getExtension());
        if (in_array($ext, $app["extension.video"]))
            $pathInfo["extraType"] = "video";
        else if (in_array($ext, $app["extension.audio"]))
            $pathInfo["extraType"] = "audio";
        else if (in_array($ext, $app["extension.image"]))
            $pathInfo["extraType"] = "image";
        else if (in_array($ext, $app["extension.archive"]))
            $pathInfo["extraType"] = "archive";
        else if (in_array($ext, $app["extension.subtitle"]))
            $pathInfo["extraType"] = "subtitle";

        array_push($dirContent, $pathInfo);
    }

    return $app->json($dirContent);
}

function archive_directory(Application $app, Request $request) {

    if ($app["rights.canArchiveDirectory"] == false) {
        $app->abort(403, "This user doesn't have the rights to archive a directory.");
    }

    $dirpath = $request->get('path');

    if (!isset($dirpath)) {
        $app->abort(400, "Missing parameters.");
    }

    if (file_exists("{$app['cakebox.root']}{$dirpath}") && is_writable("{$app['cakebox.root']}{$dirpath}/../")) {

        $dirpath_info = pathinfo($dirpath);
        $dirname = $dirpath_info["basename"];

        if (!file_exists("{$app['cakebox.root']}{$dirpath}/../{$dirname}.tar.inc") && !file_exists("{$app['cakebox.root']}{$dirpath}/../{$dirname}.tar")) {
            file_put_contents("{$app['cakebox.root']}{$dirpath}/../{$dirname}.tar.inc", "Creation of {$dirname}.tar.inc is in progress... If not, remove this file manualy.");

            $p = new \PharData("{$app['cakebox.root']}{$dirpath}/../{$dirname}.tar");
            $p->compress(\Phar::NONE);
            $p->buildFromDirectory("{$app['cakebox.root']}{$dirpath}");

            unlink("{$app['cakebox.root']}{$dirpath}/../{$dirname}.tar.inc");
        }
        else
            return $app->json("Error: This directory already have a tar file or is already under a tar process.");
    }
    else
        return $app->json("Error: Directory doesn't exists or parent directory isn't writable.");

    return $app->json("OK: File {$dirname}.tar created.");
}
