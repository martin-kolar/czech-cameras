<?php

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTrN7_nmLLjN8qZOC0hQMkBNF3hUo-HQhCBaIeeZ0cfOmSOKioZXI10u4wE_6soRwRZc8AnNvkusn8j/pub?output=tsv');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$tempData = curl_exec($ch);

$tempData = explode("\n", $tempData);
$data = [];

foreach ($tempData as $k => $v) {
	$rowData = explode('	', $v);

	if ($k != '0' && $rowData[0] != '' && $rowData[3] == 1) {
		if (is_numeric(strtr($rowData[1], ',', '.'))) {
			$number = round(floatval(strtr($rowData[1], ',', '.')), 2);
		}
		else {
			$number = $rowData[1];
		}

		$data[] = array(
			$rowData[0],
			$number,
			$rowData[2],
			isset($rowData[4]) ? $rowData[4] : ''
		);
	}
}

echo '<script>var cameraData = '.json_encode($data).';</script>';
