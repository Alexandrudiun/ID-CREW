<?php
include "../backend/conn.php";
session_start();
if(isset($_SESSION['email']) && isset($_SESSION['password'])) {
if (isset($_GET['id'])) {

  $id = $_GET['id'];
  



?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service</title>
    <link rel="icon" href="/img/logo192.jpg">
    <link rel="stylesheet" href="/css/service.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="manifest" href="/manifest.json">
</head>
<body>
  <?php

$sql = "SELECT * FROM `posts` WHERE id = '{$id}';";
$result = mysqli_query($conn, $sql);

// Store the products in an array
$post = array();
if (mysqli_num_rows($result) > 0) {
    echo '<div class="container" id="service-list">';
    while ($row = mysqli_fetch_assoc($result)) {
        $numphones = $row['phone'];
        $photo_names = explode(', ', $row['images']);
        echo '<div class="slide-wrapper">';
        echo '<div class="slider">';
        for ($i = 0; $i < 3; $i++) {
          $location = "https://idcrew.shop/img/upload/" . $photo_names[$i];
          if($photo_names[$i]) { 
            
            echo '<img src="' . $location . '" alt="' . $row['name'] . '" onclick="showImage(' . $i . ')" id="slide-' . $i . '">';
          }
          else{
            echo '<img src="' . $location = "https://idcrew.shop/img/upload/" . $photo_names[0] . '" alt="' . $row['name'] . '" onclick="showImage(' . $i . ')" id="slide-' . $i . '">';
          }
        }
        echo '</div>';
      echo '</div>';

       echo '<div class="slider-nav">';
       echo '<a href="#slide-1"></a>';
       echo '<a href="#slide-2"></a>';
       echo '<a href="#slide-3"></a>';
       echo '</div>';
    echo'</div>';
    echo '<div class="popup-image" id="popup-image">';
    echo '<div class="popup-image-content">';
    for ($i = 0; $i < 3; $i++) {
      $location = "https://idcrew.shop/img/upload/" . $photo_names[$i];
      echo '<img src="' . $location . '" alt="' . $row['name'] . '" id="popup-slide-' . ($i + 1) . '">';
    };
    echo '</div>';
    echo '<ion-icon name="close-circle-outline" onclick="hideImage()"></ion-icon>';
    echo '</div>';
  ?>

  <main>
  <?php
  echo '<div class="top-details">';
  echo '<div class="date">';
  echo '<span>'.$row['date'].'</span>';
  echo '</div>';
  echo '<div class="title">';
  echo '<h3>'.$row['title'].'</h3>';
  echo '</div>';
  echo '<div class="price">';
  echo '<h2>' . $row['price'] . ' RON</h2>';
  echo '</div>';
  echo '</div>';
  echo '<div class="description">';
  echo '<h3>Descrierea serviciului</h3>';
  echo '<p>'.$row['description'].'</p>';
  echo '</div>';
   ?>
  <?php
  $email = $row['email'];
   
   $query="SELECT * FROM users WHERE email = '{$email}'";
      $select_user_query = mysqli_query($conn, $query);
      
      if(!$select_user_query)
      {
        die('Query Failed');
      }
      $email_found = false; // Flag variable to check if email was found
     while($r = mysqli_fetch_row($select_user_query)) {
     if($r[1] == $email) {
        
       $email_found = true;
       $image = $r[3]; //image is stored in blob format
       $name = $r[4];
       $skills = $r[5];
     }}
     
     ?>

  
  </main>

  
  <div class="profile-details">
  <div class="image">
            <?php if($image==NULL): ?>
            <img src='/img/user.png' class='profile-img'>
            <?php else: ?>
            <img src="data:image/jpeg;base64,<?=base64_encode($image)?>" alt="profile picture of <?=$name?>" class="profile-img">
            <?php endif; ?>
        </div>
  <div class="profile-name">

  <h3><?php echo $name;?></h3>
 <span><?php echo $skills;?></span> 
  </div>
  </div>
  <footer>
    <div class="buy">
      <a href="#" class="buy-btn" onclick="goBack()">
      <ion-icon name="arrow-back-outline"></ion-icon> 
      <span>Înapoi</span>     
      </a>
      <a href="<?php echo "tel:".$numphones;?>" class="call">Sună / SMS</a>
    </div>
  </footer>
  <!-- Ion icons -->
  <script src="/js/service.js"></script>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
  <!-- ------------- -->
  <script>
    function goBack() {
      history.back();
    }
  </script>
</body>
</html>
<?php
}

}
} else {
 
  echo "ID not found in the URL.";
}}
else {
  header("Location: ../index.php");
}
?>