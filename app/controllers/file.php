<?php

namespace App\Controllers\File;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

$app->get("/api/file/info",  __NAMESPACE__ . "\\get_infos");
$app->get("/api/file/deleteFile",  __NAMESPACE__ . "\\rm_file");


function get_infos(Application $app, Request $request) {

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to retrieve file informations.");
    }

    $filepath = $request->get('path');

    if (!isset($filepath)) {
        $app->abort(400, "Missing parameters.");
    }

    $file     = new \SPLFileInfo($app["cakebox.root"].$filepath);

    $fileinfo             = [];
    $fileinfo["name"]     = $file->getBasename(".".$file->getExtension());
    $fileinfo["fullname"] = $file->getFilename();
    $fileinfo["mimetype"] = mime_content_type($file->getPathName());
    $fileinfo["access"]   = $app["cakebox.access"] . $filepath;
    $fileinfo["size"]     = $file->getSize();

    return $app->json($fileinfo);
}

function rm_file(Application $app, Request $request) {

    if ($app["rights.canDelete"] == false) {
        $app->abort(403, "This user doesn't have the rights to delete this file.");
    }
    
    $filepath = $request->get('path');

    if (!isset($filepath)) {
        $app->abort(400, "Missing parameters.");
    }

    unlink("{$app['cakebox.root']}{$filepath}");

    return $app->json("Ok file deleted");

}