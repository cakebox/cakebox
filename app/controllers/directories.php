<?php

namespace App\Controllers\Directories;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Finder\Finder;
use App\Models\Utils;

/**
 * Route declaration
 *
 * @var Application $app Silex Application
 */
$app->get("/api/directories",          __NAMESPACE__ . "\\get_content");
$app->delete("/api/directories/delete",__NAMESPACE__ . "\\delete");
$app->get("/api/directories/archive",  __NAMESPACE__ . "\\archive");
$app->get("/api/directories/create",   __NAMESPACE__ . "\\create");
$app->get("/api/directories/rename",   __NAMESPACE__ . "\\rename");

/**
 * Retrieve directory content, directories and files
 *
 * @param Application $app Silex Application
 * @param Request $request Request parameters
 *
 * @return JsonResponse Array of objects
 */
function get_content(Application $app, Request $request) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    $dirpath = Utils\check_path($app['cakebox.root'], $request->get('path'));

    if (!isset($dirpath)) {
        $app->abort(400, "Missing parameters");
    }

    $finder = new Finder();
    $finder->followLinks()
            ->depth('< 1')
            ->in("{$app['cakebox.root']}/{$dirpath}")
            ->ignoreVCS(true)
            ->ignoreDotFiles($app['directory.ignoreDotFiles'])
            ->notName($app["directory.ignore"])
            ->sortByType();

    $dirContent = [];

    foreach ($finder as $file) {

        if ($file->isLink()) {
            $linkTo = readlink("{$app['cakebox.root']}/{$dirpath}/{$file->getBasename()}");
            if (file_exists($linkTo) == false)
                continue;

            $file = new \SplFileInfo($linkTo);
        }

        $pathInfo              = [];
        $pathInfo["name"]      = $file->getBasename();
        $pathInfo["type"]      = $file->getType();
        $pathInfo["mtime"]     = $file->getMTime();
        $pathInfo["size"]      = Utils\get_size($file);
        $pathInfo["access"]    = str_replace('%2F', '/', rawurlencode("{$app['cakebox.access']}/{$dirpath}/{$file->getBasename()}"));
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

/**
 * Create a directory
 *
 * @param Application $app Silex Application
 * @param Request $request Request parameters
 *
 * @return JsonResponse Array of objects
 */
function create(Application $app, Request $request) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    if ($app["rights.canDelete"] == false) {
        $app->abort(403, "This user doesn't have the rights to delete this directory");
    }

    $filepath = Utils\check_path($app['cakebox.root'], $request->get('path'));

    if (!isset($filepath)) {
        $app->abort(403, "Missing parameters");
    }

    $dir = "{$app['cakebox.root']}/{$request->get('path')}/{$request->get('folder')}";

    if (file_exists($dir) === true) {
        $app->abort(403, "Directory already exist");
    }

    mkdir("{$dir}", 0777, true);

    return $app->json("Folder created");
}

/**
 * Rename a directory or a file
 *
 * @param Application $app Silex Application
 * @param Request $request Request parameters
 *
 * @return JsonResponse Array of objects
 */
function rename(Application $app, Request $request) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    if ($app["rights.canRename"] == false) {
        $app->abort(403, "This user doesn't have the rights to rename this directory or file");
    }

    $dirpath = Utils\check_path($app['cakebox.root'], $request->get('path'));

    if (empty($dirpath)) {
        $app->abort(403, "Missing parameters");
    }

    $dir = "{$app['cakebox.root']}/{$request->get('path')}";
    $filename = "{$dir}/{$request->get('name')}";
    $oldfilename = "{$dir}/{$request->get('oldname')}";

    rename("{$oldfilename}", "{$filename}");

    return $app->json("File rename");
}

/**
 * Delete a directory
 *
 * @param Application $app Silex Application
 * @param Request $request Request parameters
 *
 * @return JsonResponse Array of objects, directory content after the delete process
 */
function delete(Application $app, Request $request) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    if ($app["rights.canDelete"] == false) {
        $app->abort(403, "This user doesn't have the rights to delete this directory");
    }

    $dirpath = Utils\check_path($app['cakebox.root'], $request->get('path'));

    if (empty($dirpath)) {
        $app->abort(403, "Missing parameters");
    }

    $dir = "{$app['cakebox.root']}/{$dirpath}";

    if (file_exists($dir) === false) {
        $app->abort(403, "Directory not found");
    }

    if (is_dir($dir) === false) {
        $app->abort(403, "This is not a directory");
    }

    $dirname = dirname($dir);

    if (is_writable($dirname) === false) {
        $app->abort(403, "Parent directory is not writable");
    }

    // Remove directory content
    $iterator = new \RecursiveDirectoryIterator($dir);
    foreach (new \RecursiveIteratorIterator($iterator, \RecursiveIteratorIterator::CHILD_FIRST) as $file) {
        if ($file->isDir())
            rmdir($file->getPathname());
        else
            unlink($file->getPathname());
    }

    // Remove directory itself
    rmdir("{$dir}");

    return $app->json("Folder deleted");
}

/**
 * Archive a directory
 *
 * @param Application $app Silex Application
 * @param Request $request Request parameters
 *
 * @return JsonResponse Array of objects, directory content after the archive process
 */
function archive(Application $app, Request $request) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    if ($app["rights.canArchiveDirectory"] == false) {
        $app->abort(403, "This user doesn't have the rights to archive a directory");
    }

    $dirpath = Utils\check_path($app['cakebox.root'], $request->get('path'));

    if (empty($dirpath)) {
        $app->abort(400, "Missing parameters");
    }

    $dir = "{$app['cakebox.root']}/{$dirpath}";

    if (file_exists($dir) === false) {
        $app->abort(404, "Directory not found");
    }

    if (is_dir($dir) === false) {
        $app->abort(403, "This is not a directory");
    }

    $dirpath_info = pathinfo($dir);
    $dirname      = $dirpath_info["dirname"];
    $basename     = $dirpath_info["basename"];

    if (is_writable($dir) === false) {
        $app->abort(403, "Parent directory is not writable");
    }

    $archive_path = "{$app['cakebox.root']}/{$dirpath}/../{$basename}.tar";

    if (file_exists("{$archive_path}.inc") || file_exists($archive_path)) {
        $app->abort(406, "This directory already have a tar file or is already under a tar process");
    }

    file_put_contents("{$archive_path}.inc", "Creation of {$basename}.tar.inc is in progress... If not, remove this file manualy.");

    $p = new \PharData($archive_path);
    $p->compress(\Phar::NONE);
    $p->buildFromDirectory($dir);

    unlink("{$archive_path}.inc");

    $subRequest = Request::create('/api/directories', 'GET', ['path' => dirname($dirpath)]);
    return $app->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
}
