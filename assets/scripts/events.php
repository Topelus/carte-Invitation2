<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$servername = getenv("DB_HOST");
$username   = getenv("DB_USER");
$password   = getenv("DB_PASS");
$dbname     = getenv("DB_NAME");

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Erreur connexion BDD : " . $conn->connect_error]));
}

$eventId = isset($_GET['id']) ? $conn->real_escape_string($_GET['id']) : '';

if ($eventId !== '') {
    $sql = "SELECT id, name, date, time, location FROM Event WHERE id = '$eventId'";
} else {
    $sql = "SELECT id, name, date, time, location FROM Event ORDER BY date ASC, time ASC";
}

$result = $conn->query($sql);
if (!$result) {
    echo json_encode(["error" => "Erreur requête : " . $conn->error]);
    exit;
}

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

if ($eventId !== '' && count($events) === 0) {
    echo json_encode(["error" => "Événement introuvable"]);
    exit;
}

echo json_encode($eventId !== '' ? $events[0] : $events);
$conn->close();
?>
