<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\Finder\Finder;

function getDirSize($directory) {

	$size = 0;
	foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file) {
		$size += $file->getSize();
    }

    return $size;
}

$app->get("/api/directories/{path}", function (Request $request, $path) use ($app) {

	$dirContent = array();

	$finder = new Finder();
	$finder->followLinks()->depth('< 1')->in($app["dir.path"].$path)->sortByType();

	foreach ($finder as $file) {

		$pathInfo = array();
		$pathInfo["name"] = $file->getRelativePathname();
		$pathInfo["type"] = $file->getType();
		$pathInfo["size"] = ($file->isFile()) ? $file->getSize() : getDirSize($file->getRealpath());
		$pathInfo["perms"] = substr(sprintf('%o', $file->getPerms()), -4);
		$pathInfo["isVideo"] = ( explode("/", mime_content_type($file->getRealpath()) )[0] == "video" || $file->getExtension() == "mkv") ? true : false;

		array_push($dirContent, $pathInfo);
	}

    return $app->json($dirContent);
})->value('path', '')->assert("path", ".*");

$app->get("/api/file/{path}", function (Request $request, $path) use ($app) {

	return $app->json();
})->assert("path", ".*");