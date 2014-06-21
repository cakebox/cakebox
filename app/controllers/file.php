<?php

use Symfony\Component\HttpFoundation\Request;

$app->get("/api/file/info", function (Request $request) use ($app) {

    $filepath = $request->get('path');
    $file     = new SPLFileInfo($app["cakebox.root"].$filepath);

    $fileinfo             = [];
    $fileinfo["name"]     = $file->getBasename(".".$file->getExtension());
    $fileinfo["fullname"] = $file->getFilename();
    $fileinfo["mimetype"] = ($app["player.type"] != "DIVX") ? mime_content_type($file->getPathName()) : "video/divx";
    $fileinfo["access"]   = $app["cakebox.access"] . $filepath;
    $fileinfo["size"]     = $file->getSize();

    return $app->json($fileinfo);
});
