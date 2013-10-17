<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\Finder\Finder;

$app->get("/api/directory/list", function (Request $request) use ($app) {

	$directory = array();

	$finder = new Finder();
	$finder->followLinks()->in($app["dir.path"]);

	foreach ($finder as $file) {
		if (!isset($directory[$file->getRelativePath()])) {
			$keyPath = ($file->getRelativePath() == "") ? "." : $file->getRelativePath();
			$directory[$keyPath] = array($file->getRelativePathname());
		}
    	else
    		array_push($directory[$file->getRelativePath()], $file->getRelativePathname());
	}

    return$app->json($directory);
});