<?php

/*
  NOTE
  if you don't want to use default, use this template
  for security reason, we strongly recommand to set upload, create folder
  can rename a file, delete a file, archive directory and the rss feed to false
/*
  General configuration of Cakebox
*/
$app["cakebox.root"] = "/app/data"; // Root directory Cakebox have to scan
$app["cakebox.access"] = "/access/"; // Alias used in web server for direct access
$app["cakebox.language"] = "fr"; //Language of Cakebox. Could be : fr, en
$app["cakebox.host"] = ""; //domain where cakebox is hosted

/*
  Directory settings
*/
$app["directory.ignoreDotFiles"] = true;
$app["directory.ignore"] = "//"; // Regex for files exclusion. For exemple : "/(\.nfo|\.test)$/"

/*
  Web player settings
*/
$app["player.default_type"] = "html5"; // html5 or divx or vlc
$app["player.auto_play"] = "false";

/*
  User rights
*/
$app["rights.canPlayMedia"] = true;
$app["rights.canDownloadFile"] = true;
$app["rights.canArchiveDirectory"] = false;
$app["rights.canDelete"] = false;
$app["rights.canCreate"] = false;
$app["rights.canRename"] = false;
$app["rights.canUpload"] = false;

/*
User credentials
*/
$app["user.name"] = "";
$app["user.password"] = "";

/*
  Betaseries account
  NB: Ask API key here http://www.betaseries.com/api/
*/
$app["bs.login"] = "";
$app["bs.passwd"] = "";
$app["bs.apikey"] = "";
