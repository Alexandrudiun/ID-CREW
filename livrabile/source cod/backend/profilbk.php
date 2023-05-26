<?php  
include "conn.php";

session_start(); 



if(isset($_SESSION['email']) && isset($_SESSION['password'])) {
    $email = $_SESSION['email'];
    $password = $_SESSION['password'];
    $profiletype_temp=0; // 0 for buyer, 1 for worker;
    
    $query="SELECT * FROM users WHERE email = '{$email}'";
    $select_user_query = mysqli_query($conn, $query);
    
    if(!$select_user_query)
    {
      die('Query Failed');
    }
    while($row = mysqli_fetch_row($select_user_query)) {
    if($row[1] == $email && $row[2] == $password) {
      
     
      $image = $row[3]; //image is stored in blob format
      $name = $row[4];
      $skills = $row[5];
      $credit = $row[6];
      $worker = $row[7];
      $buyer = $row[8];
      
    }
    

     
      
    }
    }
    else {
      header("Location: ../index.php");
  }
?>