<?php

namespace Cakebox\Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;


class MainController
{
    /**
     * Get app informations about cakebox
     *
     * @param Application $app Silex Application
     *
     * @return JsonResponse Object containing application informations
     */
    public function getAppInfos(Application $app) {

        $local  = json_decode(file_get_contents(__DIR__ . '/../../../../front/bower.json'));
        $remote = json_decode(file_get_contents('https://raw.github.com/Cakebox/Cakebox-light/master/bower.json'));

        $appInfos = [];
        $appInfos['language'] = $app['cakebox.language'];
        $appInfos['version'] = [
            'local'  => $local->version,
            'remote' => $remote->version
        ];
        $appInfos['rights'] = [
            'canPlayMedia'        => $app['rights.canPlayMedia'],
            'canDownloadFile'     => $app['rights.canDownloadFile'],
            'canArchiveDirectory' => $app['rights.canArchiveDirectory'],
            'canDelete'           => $app['rights.canDelete']
        ];
        $appInfos['player'] = [
            'default_type'    => strtolower($app['player.default_type']),
            'available_types' => [
                'html5'=> ['name' => 'HTML 5 Web Player', 'type' => 'html5'],
                'vlc'  => ['name' => 'VLC Web Player',    'type' => 'vlc'],
                'divx' => ['name' => 'DivX Web Player',   'type' => 'divx']
            ],
            'auto_play' => $app['player.auto_play']
        ];

        return $app->json($appInfos);
    }
}
