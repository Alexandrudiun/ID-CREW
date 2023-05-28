<?php
include "conn.php";
session_start();
if(isset($_SESSION['email']) && isset($_SESSION['password'])) {
if(isset($_GET['id'])) {
    $id = $_GET['id'];
$sql = "DELETE FROM `posts` WHERE `posts`.`id` = '{$id}';";
$delete_query = mysqli_query($conn, $sql);
if(!$delete_query) {
   die('Query Failed'. mysqli_error($conn));
}
else{
    echo "Deleted";
}
header("Location: ../backend/history.php");
}}
else {
    header("Location: ../index.php");
}
?>