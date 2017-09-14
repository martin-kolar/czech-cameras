<?php

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $_GET['url']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_REFERER, $_GET['referer']);
$html = curl_exec($ch);

header('Content-type: image/jpeg');

echo $html;
