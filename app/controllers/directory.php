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

$app->get("/api/directories/content/{dir}", function (Request $request, $dir) use ($app) {

	$dirContent = array();

	$finder = new Finder();
	$finder->followLinks()->depth('< 1')->in("{$app['cakebox.root']}{$dir}")->sortByType();

	foreach ($finder as $file) {

		if ($file->isLink()) {
			$linkTo = readlink("{$app['cakebox.root']}{$dir}{$file->getBasename()}");
			if (file_exists($linkTo) == false)
				continue;

			$file = new SplFileInfo($linkTo);
		}

		$pathInfo = array();
		$pathInfo["name"] = $file->getBasename();
		$pathInfo["type"] = $file->getType();
		$pathInfo["size"] = ($file->isFile()) ? $file->getSize() : getDirSize($file->getRealpath());
		$pathInfo["isVideo"] = ( explode("/", mime_content_type($file->getRealpath()) )[0] == "video" || $file->getExtension() == "mkv") ? true : false;
		$pathInfo["access"] = "{$app['cakebox.access']}{$dir}{$file->getBasename()}";

		array_push($dirContent, $pathInfo);
	}

    return $app->json($dirContent);
})
->value("dir", "")
->assert("dir", ".*");

