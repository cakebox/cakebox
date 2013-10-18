<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\Finder\Finder;

$app->get("/api/directories/{pathdir}", function (Request $request, $pathdir) use ($app) {

	$directory = array();

	$finder = new Finder();
	$finder->followLinks()->depth('< 1')->in($app["dir.path"].$pathdir)->sortByType();

	foreach ($finder as $file) {

		$pathName = $file->getRelativePathname();
		if ($file->isDir()) // make it pretty
			$pathName .= '/';

		array_push($directory, $pathName);
	}

    return $app->json($directory);
})->value('pathdir', '')->assert("pathdir", ".*");
