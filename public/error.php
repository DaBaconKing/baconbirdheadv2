<?php
$errorCode = $_GET['errorcode'] ?? 'Unknown';

// Basic lookup table for common HTTP error codes
$errorMeanings = [
    '400' => ['Bad Request', 'The server couldn’t understand your request.'],
    '401' => ['Unauthorized', 'You need to log in to access this resource.'],
    '403' => ['Forbidden', 'Access denied. You don’t have permission.'],
    '404' => ['Not Found', 'The file you’re looking for doesn’t exist.'],
    '500' => ['Internal Server Error', 'Something went wrong on the server.'],
    '502' => ['Bad Gateway', 'The server received an invalid response.'],
    '503' => ['Service Unavailable', 'The server is temporarily offline.'],
    '504' => ['Gateway Timeout', 'The server took too long to respond.']
];

$meaning = $errorMeanings[$errorCode][0] ?? 'Unknown Error';
$explanation = $errorMeanings[$errorCode][1] ?? 'An unexpected error occurred. Please try again later.';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="https://raw.githack.com/DaBaconKing/codetemplates/refs/heads/main/standardstyle.css">
    <link rel="stylesheet" href="{i will add path myself}">
    <link rel="shortcut icon" href="{i will add myself}">
    <link rel="canonical" href="https://baconbirdhead.codehs.me">
    <title><?php echo htmlspecialchars($errorCode . ' ' . $meaning); ?>.</title>
</head>

<body>
    <div class="centered-div">
        <img src="https://filepuller3000v2.onrender.com/?target=https://http.cat/<?php echo urlencode($errorCode); ?>" draggable="false" alt="<?php echo htmlspecialchars($errorCode . ', ' . $meaning); ?>" style="border-radius: 0.5em;">
        <h1><strong><?php echo htmlspecialchars($errorCode); ?></strong> - File not found. :(</h1>
        <h3>oh no! the file you are looking for, is missing!</h3>
        <p><?php echo htmlspecialchars($explanation); ?></p>
        <a class="cta" href="mailto:hartj@student.acpsd.net">Email me if this happens again.</a>
        <button onclick="location.href = '/index.html';" class="cta">Go to homepage.</button>
    </div>
</body>
</html>
