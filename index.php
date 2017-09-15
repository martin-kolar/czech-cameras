<?php

require 'src/setup.php';

$cssFiles = file_get_contents('./css/css-manifest.json');
$cssFiles = json_decode($cssFiles);

$jsFiles = file_get_contents('./js/js-manifest.json');
$jsFiles = (array) json_decode($jsFiles);

?>
<!DOCTYPE html>
<html>
	<head>
		<title>Kamery</title>
		<meta charset="utf-8">
<?php
	if (count($cssFiles)) {
		foreach ($cssFiles as $file => $name) {
			print '		<link href="/css/'.$name.'" rel="stylesheet" type="text/css" media="all">'."\n";
		}
	}
	else {
		print '		<link href="/css/layout.css" rel="stylesheet" type="text/css" media="all">'."\n";
	}
?>
		<link rel="icon" href="/images/favicon.ico">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<script type="text/javascript"></script>
	</head>
	<body>
		<header>
			Silnice/město:
			<select name="road" id="select-road">
				<option value="">Vyber</option>
			</select>

			Upřesnění zadání:
			<select name="roadFrom" id="select-road-from" class="hide small-select">
				<option value="">Vyber</option>
			</select>
			<select name="roadTo" id="select-road-to" class="hide small-select">
				<option value="">Vyber</option>
			</select>
			<select name="roadName" id="select-road-name" class="hide">
				<option value="">Vyber</option>
			</select>

			<p>Last reload: <span id="last-reload-time"></span></p>
			Reload:
			<select name="reloadTime" id="select-reload-time" class="small-select">
				<option value="10">10</option>
				<option value="30">30</option>
				<option value="60" selected="selected">60</option>
				<option value="120">120</option>
			</select>
		</header>

		<ul id="cameras-items"></ul>
	</body>
	<?php include 'src/parseData.php'; ?>
<?php
	print '	<script type="text/javascript" src="/js/webpack/preload/'.reset($jsFiles['assets']).'"></script>'."\n";
?>
	<script>load(["global"])</script>
</html>
