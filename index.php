<?php

$cssFiles = file_get_contents('./dest/css/css-manifest.json');
$cssFiles = json_decode($cssFiles);

$jsFiles = file_get_contents('./dest/js-manifest.json');
$jsFiles = json_decode($jsFiles);

?>
<!DOCTYPE html>
<html>
	<head>
		<title>Kamery</title>
		<meta charset="utf-8">
<?php
	if (count($cssFiles)) {
		foreach ($cssFiles as $file => $name) {
			print '		<link href="/dest/css/'.$name.'" rel="stylesheet" type="text/css" media="all">'."\n";
		}
	}
	else {
		print '		<link href="/dest/css/layout.css" rel="stylesheet" type="text/css" media="all">'."\n";
	}
?>
		<link rel="icon" href="/images/favicon.ico">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<script type="text/javascript"></script>
	</head>
	<body>
		<select name="road" id="select-road">
			<option value="">Vyber</option>
		</select>
		<select name="roadFrom" id="select-road-from" style="display:none;">
			<option value="">Vyber</option>
		</select>
		<select name="roadTo" id="select-road-to" style="display:none;">
			<option value="">Vyber</option>
		</select>
		<select name="roadName" id="select-road-name" style="display:none;">
			<option value="">Vyber</option>
		</select>

		<p>Last reload: <span id="last-reload-time"></span></p>

		<ul id="cameras-items"></ul>
	</body>
	<?php include 'src/parseData.php'; ?>
<?php
	foreach ($jsFiles->assets as $file => $name) {
		print '	<script type="text/javascript" src="/dest/js/webpack/preload/'.$name.'"></script>'."\n";
	}
?>
	<script>load(["global"])</script>
</html>
