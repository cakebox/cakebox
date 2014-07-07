<?php

namespace App\Controllers\File;

use Silex\Application;


$app->get("/api/file/info/{filepath}",  __NAMESPACE__ . "\\get_infos");


function get_infos(Application $app, $filepath) {

    $file     = new \SPLFileInfo($app["cakebox.root"].$filepath);

    $fileinfo             = [];
    $fileinfo["name"]     = $file->getBasename(".".$file->getExtension());
    $fileinfo["fullname"] = $file->getFilename();
    $fileinfo["mimetype"] = mime_content_type($file->getPathName());
    $fileinfo["access"]   = $app["cakebox.access"] . $filepath;
    $fileinfo["size"]     = $file->getSize();

    return $app->json($fileinfo);
}
