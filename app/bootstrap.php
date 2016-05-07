<?php

namespace Cakebox;

require_once __DIR__ . "/../tmp/composer/autoload.php";

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;

define("APPLICATION_ENV", getenv("APPLICATION_ENV") ?: "production");

session_start();

$app = new Application();
if (APPLICATION_ENV != "production") {
    $app["debug"] = true;
}

$app['name'] = "";
$app["extension.video"]    = ["mp4", "mov", "mpg", "flv", "avi", "mkv", "wmv"];
$app["extension.audio"]    = ["mp3", "flac", "ogg", "aac", "wma"];
$app["extension.image"]    = ["png", "gif", "jpg", "jpeg"];
$app["extension.archive"]  = ["zip", "rar", "gz", "bz2", "7z"];
$app["extension.subtitle"] = ["srt"];

if(!file_exists(__DIR__ . "/../config/auth.php")) {

    $user = @$_SERVER["PHP_AUTH_USER"];
    if (isset($user) && file_exists(__DIR__ . "/../config/{$user}.php"))
     require_once __DIR__ . "/../config/{$user}.php";
    else
     require_once __DIR__ . "/../config/default.php";
    // Remove ending slash if needed
    if (substr($app["cakebox.root"], -1) == '/')
        $app["cakebox.root"] = rtrim($app["cakebox.root"], "/");
    if (substr($app["cakebox.access"], -1) == '/')
        $app["cakebox.access"] = rtrim($app["cakebox.access"], "/");

    $app["user.auth"] = 0;

    $app["rights.canCreate"] = false;
    $app["rights.canRename"] = false;
    $app["rights.canUpload"] = false;

} else {

    require_once __DIR__ . "/../config/auth.php";
    if (!$app['user.auth']) {
        $app["user.name"] = "default";
        require_once __DIR__ . "/../config/default.php";
    }
}

// Include controllers and models
foreach (glob(__DIR__ . "/{models,controllers}/*.php", GLOB_BRACE) as $file) {
    require_once $file;
}

$app->error(function (\Exception $e, $code) use ($app) {
    return new JsonResponse(["status_code" => $code, "message" => $e->getMessage()]);
});

return $app;
