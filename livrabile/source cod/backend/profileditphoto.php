<?php  
include "conn.php";
session_start(); // Start the session
if(isset($_SESSION['email']) && isset($_SESSION['password'])) {   
   
    $email = $_SESSION['email'];
    if(isset($_POST['submit'])) {
        
        $image = addslashes(file_get_contents($_FILES['image']['tmp_name']));
        $image_name = addslashes($_FILES['image']['name']);
        $image_size = getimagesize($_FILES['image']['tmp_name']);
        // if($image_size == false) {
        //     die("Invalid image.");
        // }

        $query = "UPDATE users SET photo = '$image' WHERE email = '$email'";
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
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profilul meu</title>
    <link rel="icon" href="/logos/logo192.jpg">
    <link rel="stylesheet" href="/css/profiledit.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="manifest" href="/manifest.json">
</head>

<body>
<div class="center">
    <div class="profile-card">
      <form action="#" method="post" enctype="multipart/form-data">
        
        <div class="input-box">
          <ion-icon name="camera-outline" class="camera-icon"></ion-icon>
          <input type="file" accept="image/*" name="image" id="image">
          <label class="change-profile">Schimbă poza de profil</label>
        </div>

        <div class="button">
          <input type="submit" name="submit" value="Save" class="btn-login">
          </div>
      </form>
    </div>
  </div> 
<!-- Navbar Down -->
<footer>  
    <section class="nav-bar">
        <div class="navigation">
            <ul>
                <li class="list">
                    <a href="/frontend/home.php">
                        <span class="icon">
                        <ion-icon name="home-outline"></ion-icon>
                        </span>
                        <span class="text">Acasă</span>
                    </a>
                </li>
                <li class="list active">
                    <a href="/frontend/profil.php">
                        <span class="icon">
                        <ion-icon name="person-circle-outline"></ion-icon>
                        </span>
                        <span class="text">Profil</span>
                    </a>
                </li>
                
                <?php
                if(!$_SESSION['profiletype_temp']){
                    // for worker
                echo '<li class="list">';
                echo   '<a href="/backend/post.php">';
                echo       '<span class="icon">';
                echo            '<ion-icon name="add-circle-outline"></ion-icon>';
                echo       '</span>';
                echo        '<span class="text">Postează</span>';
                echo   '</a>';
                echo'</li>';

                echo '<li class="list">';
                echo   '<a href="/backend/history.php">';
                echo       '<span class="icon">';
                echo          '<ion-icon name="albums-outline"></ion-icon>';
                echo'</span>';
                echo    '<span class="text">Istoric</span>';
                echo '</a>';
                echo '</li>';
            }
                else{
                    // for buyer
                    echo '<li class="list">';
                    echo   '<a href="/frontend/join.php">';
                    echo       '<span class="icon">';
                    echo            '<ion-icon name="add-circle-outline"></ion-icon>';
                    echo       '</span>';
                    echo        '<span class="text">Alătură-te echipei</span>';
                    echo   '</a>';
                    echo'</li>';

                echo '<li class="list">';
                echo   '<a href="/frontend/contact.php">';
                echo       '<span class="icon">';
                echo          '<ion-icon name="albums-outline"></ion-icon>';
                echo'</span>';
                echo    '<span class="text">Contact</span>';
                echo '</a>';
                echo '</li>';
                }
                ?>
                <div class="indicator"></div>
            </ul>
        </div>
    </section>
    </footer>
    <script src="/js/nav.js"></script>
  <!-- Ion icons -->
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html>