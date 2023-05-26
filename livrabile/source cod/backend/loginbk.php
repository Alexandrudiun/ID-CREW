<?php 
session_start(); // Start the session
include "conn.php";
// test conexiune DB
// if($conn){echo "OK";}
//   else{die("not ok");}


 if(isset($_POST['submit'])){
    $email = $_POST['email'];
    $password = $_POST['password'];  
   $query="SELECT * FROM users WHERE email = '{$email}'";
    $select_user_query = mysqli_query($conn, $query);
    
    if(!$select_user_query)
    {
      die('Query Failed'. mysqli_error());
    }
    $email_found = false; // Flag variable to check if email was found
    while($row = mysqli_fetch_row($select_user_query)){
        if($row[1] !== $email) {
            continue; // Skip to next row if email doesn't match
        }
        $email_found = true;
       
        if($row[2] === $password) {
            $_SESSION['email'] = $email;
            $_SESSION['password'] = $password;
         
            if($row[7]==2 && $row[8]==2)
            {
                header("Location: /frontend/profiletype.php");
            }
            else {
            echo "<script>document.getElementById('message').innerHTML = 'Te-ai logat cu succes';</script>";
            header("Location: /frontend/profil.php");
            exit;//  Exit script after successful login
            }
        }
        else {
            echo "<script>document.getElementById('message').innerHTML = 'Parola incorecta';</script>";
            exit; // Exit script after unsuccessful login
        }
    }

    if(!$email_found) {
        echo "<script>document.getElementById('message').innerHTML = 'Email neînregistrat';</script>";
    }
 }


