<?php

namespace App\Controllers\Files;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;


$app->get("/api/files",    __NAMESPACE__ . "\\get_infos");
$app->delete("/api/files", __NAMESPACE__ . "\\delete");


function get_infos(Application $app, Request $request) {

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to retrieve file informations");
    }

    $filepath = $request->get('path');

    if (!isset($filepath)) {
        $app->abort(400, "Missing parameters");
    }

    $file     = new \SPLFileInfo("{$app['cakebox.root']}/{$filepath}");

    $fileinfo             = [];
    $fileinfo["name"]     = $file->getBasename(".".$file->getExtension());
    $fileinfo["fullname"] = $file->getFilename();
    $fileinfo["mimetype"] = mime_content_type($file->getPathName());
    $fileinfo["access"]   = str_replace('%2F', '/', rawurlencode("{$app['cakebox.access']}/{$filepath}"));
    $fileinfo["size"]     = $file->getSize();

    return $app->json($fileinfo);
}

function delete(Application $app, Request $request) {

    if ($app["rights.canDelete"] == false) {
        $app->abort(403, "This user doesn't have the rights to delete this file");
    }

    $filepath = $request->get('path');

    if (!isset($filepath)) {
        $app->abort(400, "Missing parameters");
    }

    $file = "{$app['cakebox.root']}/{$filepath}";

    if (file_exists($file) === false) {
        $app->abort(404, "File not found");
    }

    if (is_file($file) === false) {
        $app->abort(403, "This is not a file");
    }

    if (is_writable($file) === false) {
        $app->abort(403, "This file is not writable");
    }

    unlink($file);

    $subRequest = Request::create('/api/directories', 'GET', ['path' => dirname($filepath)]);
    return $app->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
}
