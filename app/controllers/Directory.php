<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\Finder\Finder;

$app->get("/api/directories/{pathdir}", function (Request $request, $pathdir) use ($app) {

	$dirContent = array();

	$finder = new Finder();
	$finder->followLinks()->depth('< 1')->in($app["dir.path"].$pathdir)->sortByType();

	foreach ($finder as $file) {

		$pathInfo = array();
		$pathInfo["name"] = ($file->isDir()) ? $file->getRelativePathname() . "/" : $file->getRelativePathname(); // make it pretty
		$pathInfo["path"] = $file->getRelativePathname();
		$pathInfo["type"] = $file->getType();
		$pathInfo["mimetype"] = "";
		$pathInfo["size"] = $file->getSize();

		array_push($dirContent, $pathInfo);
	}

    return $app->json($dirContent);
})->value('pathdir', '')->assert("pathdir", ".*");
