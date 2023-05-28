<?php 
    include "conn.php";
    
    if(isset($_POST['submit'])){
      $email = $_POST['email'];
      $password = $_POST['password'];
      //$confirm_password = $_POST['confirm-password'];

      // Check if email is already registered
      $query = "SELECT * FROM users WHERE email = '{$email}'";
      $select_user_query = mysqli_query($conn, $query);
      if(!$select_user_query) {
        die('Query Failed'. mysqli_error($conn));
      }
      if(mysqli_num_rows($select_user_query) > 0) {
        echo "<script>document.getElementById('message').innerHTML = 'Email înregistrat click aici: login';</script>";
        exit;
      }

      // Check if password matches confirm password
      // if($password !== $confirm_password) {
      //   echo "<p class='error'>Passwords do not match</p>";
      //   exit;
      // }

      // Add new user to database
      $query = "INSERT INTO users (email, password) VALUES ('{$email}', '{$password}')";
      $add_user_query = mysqli_query($conn, $query);
      if(!$add_user_query) {
        die('Query Failed'. mysqli_error($conn));
      }
      
      echo "<script>document.getElementById('message').innerHTML = 'Ați fost inregistrat click: login';</script>";
    }

  ?>