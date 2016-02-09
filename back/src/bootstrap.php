<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Silex\Application;
use Monolog\Logger;
use Symfony\Component\HttpFoundation\JsonResponse;
use Silex\Provider\MonologServiceProvider;
use JDesrosiers\Silex\Provider\CorsServiceProvider;


define('APPLICATION_ENV', getenv('APPLICATION_ENV') ?: 'dev');

$app = new Application();
if (APPLICATION_ENV != 'production') {
    $app['debug'] = true;
}

$app['extension.video']    = ['mp4', 'mov', 'mpg', 'flv', 'avi', 'mkv', 'wmv'];
$app['extension.audio']    = ['mp3', 'flac', 'ogg', 'aac', 'wma'];
$app['extension.image']    = ['png', 'gif', 'jpg', 'jpeg'];
$app['extension.archive']  = ['zip', 'rar', 'gz', 'bz2', '7z'];
$app['extension.subtitle'] = ['srt'];

// Include specific user conf
$user = @$_SERVER['PHP_AUTH_USER'];
if (isset($user) && file_exists(__DIR__ . "/../config/{$user}.php"))
    require_once __DIR__ . "/../config/{$user}.php";
else
    require_once __DIR__ . '/../config/default.php';

// Remove ending slash if needed
if (substr($app['cakebox.root'], -1) == '/')
    $app['cakebox.root'] = rtrim($app['cakebox.root'], '/');
if (substr($app['cakebox.access'], -1) == '/')
    $app['cakebox.access'] = rtrim($app['cakebox.access'], '/');

/**
 * Register service providers
 */
$app->register(new CorsServiceProvider, [
    'cors.allowOrigin'  => '*',
    'cors.allowMethods' => 'GET, POST, PUT, DELETE, OPTIONS'
]);

$app->after($app['cors']);

$app->register(new MonologServiceProvider(), [
    'monolog.logfile' => __DIR__ . '/../logs/application.log',
    'monolog.level'   => Logger::WARNING,
    'monolog.name'    => 'api'
]);

/**
 * Register our custom services
 */
$app['service.main'] = $app->share(function ($app) {
    return new Cakebox\Service\MainService($app);
});

/**
 * Register error handler
 */
$app->error(function (\Exception $e, $code) use ($app) {
    return new JsonResponse(['status_code' => $code, 'message' => $e->getMessage()]);
});

require_once __DIR__ . '/routing.php';

return $app;
