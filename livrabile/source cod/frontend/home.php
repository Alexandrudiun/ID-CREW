<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/css/navbar.css">
  <link rel="stylesheet" href="/css/home.css">
  <link rel="manifest" href="/manifest.json">
  <title>Home</title>
</head>
<body>
  <div class="search-bar">
    <form action="#">
      <div class="flex-search">
      <input type="text" name="text" id="search-item" placeholder="Search..." onkeyup="search()">
      <button type="submit" name="submit"><ion-icon name="search-outline"></ion-icon></button>
      </div>
    </form>
  </div>
  <section>
  <div class="flex-2-column">
  <div class="cards">
<?php

include "../backend/conn.php";
session_start();
if(isset($_SESSION['email']) && isset ($_SESSION['password']))
{
$sql = "SELECT * FROM `posts` ORDER BY `id` ASC;";
$result = mysqli_query($conn, $sql);

// Store the products in an array
$post = array();
if (mysqli_num_rows($result) > 0) {
    echo '<div class="flex-container" id="service-list">';
    while ($row = mysqli_fetch_assoc($result)) {
        $post[] = $row;
        $photo_names = explode(', ', $row['images']);
        $location="https://idcrew.shop/img/upload/" . $photo_names[0]; 
        
        echo '<div class="card">';
        echo '<a style="text-decoration:none;" href="/frontend/service.php?id=' . $row['id'] . '">';
        echo '<img src="' . $location . '" alt="' . $row['name'] . '" style="width: 100%;">';
        echo '<div class="info-area">';
        echo '<h3 class="service-title">' . $row['title'] . '</h3>';
        echo '<h2 class="service-price">' . $row['price'] . ' RON</h2>';
        echo '<span>' . $row['city'] . '</span>';
        echo '<span>' . $row['date'] . '</span>';
        echo '</div>';
        echo '</a>';
        echo '</div>';        
        
    }
    echo '</div>';
}
}
else
{
    header("Location: ../index.php");
}
?>
</div>
</section>
<!-- Navbar Down -->
<footer>  
    <section class="nav-bar">
        <div class="navigation">
            <ul>
                <li class="list active">
                    <a href="/frontend/home.php">
                        <span class="icon">
                        <ion-icon name="home-outline"></ion-icon>
                        </span>
                        <span class="text">Acasă</span>
                    </a>
                </li>
                <li class="list">
                    <a href="/frontend/profil.php">
                        <span class="icon">
                        <ion-icon name="person-circle-outline"></ion-icon>
                        </span>
                        <span class="text">Profil</span>
                    </a>
                </li>
                
                <?php
            $profiletype_temp = $_SESSION['profiletype_temp'];
            $worker = $_SESSION['worker'];
            $buyer = $_SESSION['buyer'];
            if($worker == 1 && $buyer == 1) 
            {
                if(!$profiletype_temp){
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
                    echo            '<ion-icon name="help-circle-outline"></ion-icon>';
                    echo       '</span>';
                    echo        '<span class="text">Alătură-te</span>';
                    echo   '</a>';
                    echo'</li>';

                echo '<li class="list">';
                echo   '<a href="/frontend/contact.php">';
                echo       '<span class="icon">';
                echo          '<ion-icon name="mail-outline"></ion-icon>';
                echo'</span>';
                echo    '<span class="text">Contact</span>';
                echo '</a>';
                echo '</li>';
                }
            
            }
            
            else{
                if($worker == 1 && $buyer == 0) {
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
                    echo          '<<ion-icon name="mail-outline"></ion-icon>';
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
                    echo            '<ion-icon name="help-circle-outline"></ion-icon>';
                    echo       '</span>';
                    echo        '<span class="text">Alătură-te</span>';
                    echo   '</a>';
                    echo'</li>';

                echo '<li class="list">';
                echo   '<a href="/frontend/contact.php">';
                echo       '<span class="icon">';
                echo          '<ion-icon name="mail-outline"></ion-icon>';
                echo'</span>';
                echo    '<span class="text">Contact</span>';
                echo '</a>';
                echo '</li>';
                }
                }
            ?>
                <div class="indicator"></div>
            </ul>
        </div>
    </section>
    </footer>
    <script src="/js/search.js"></script>
    <script src="/js/nav.js"></script>
    <script src="/js/sliderimg.js"></script>
  <!-- Ion icons -->
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html>