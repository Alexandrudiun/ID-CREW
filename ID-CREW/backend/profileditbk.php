<?php  
include "conn.php";
session_start(); // Start the session
if(isset($_SESSION['email']) && isset($_SESSION['password'])) {
    $query="SELECT * FROM users WHERE email = '{$_SESSION['email']}'";
    $result = mysqli_query($conn, $query);
    $row = mysqli_fetch_assoc($result);
    
    if(!$result)
    {
      die('Query Failed'). mysqli_error($conn);
    }
    $email = $_SESSION['email'];
    $password = $_SESSION['password'];
    if(isset($_POST['submit'])) {
        $name = $_POST['name'];
        $skills = $_POST['skills'];
       
        $query = "UPDATE users SET name = '$name', skills = '$skills' WHERE email = '$email'";
        $update_user_query = mysqli_query($conn, $query);

        if(!$update_user_query) {
            die("Query Failed" . mysqli_error($conn));
        }

        header("Location: ../frontend/profil.php");
    }
}
else {
    header("Location: ../index.php");
}
?>