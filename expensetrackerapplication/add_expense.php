<?php
$host = "localhost";
$db = "expense_tracker";
$user = "root"; // change if needed
$pass = "root"; // change if needed

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$category = $_POST['category'];
$amount = $_POST['amount'];
$date = $_POST['date'];

$stmt = $conn->prepare("INSERT INTO expenses (category, amount, date) VALUES (?, ?, ?)");
$stmt->bind_param("sds", $category, $amount, $date);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error"]);
}
$conn->close();
?>