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

$database = [];

$tablesResult = $conn->query("SHOW TABLES");
if (!$tablesResult) {
    echo json_encode(["error" => "Erreur requête : " . $conn->error]);
    exit;
}

while ($tableRow = $tablesResult->fetch_array()) {
    $tableName = $tableRow[0];
    $rows = [];

    $result = $conn->query("SELECT * FROM `$tableName`");
    if (!$result) {
        echo json_encode(["error" => "Erreur sur la table $tableName : " . $conn->error]);
        exit;
    }

    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $database[$tableName] = $rows;
}

echo json_encode($database);
$conn->close();
?>
