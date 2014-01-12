<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;

$app->get("/api/files/info/{filepath}", function (Request $request, $filepath) use ($app) {

    $fileinfo = array();

    $file = new SPLFileInfo($app["cakebox.root"].$filepath);
    $fileinfo["name"] = $file->getBasename(".".$file->getExtension());
    $fileinfo["fullname"] = $file->getFilename();
    $fileinfo["mimetype"] = ($app["player.type"] != "DIVX") ? mime_content_type($file->getPathName()) : "video/divx";
    $fileinfo["access"] = $app["cakebox.access"] . $filepath;
    $fileinfo["size"] = $file->getSize();

    return $app->json($fileinfo);
})
->assert("filepath", ".*");