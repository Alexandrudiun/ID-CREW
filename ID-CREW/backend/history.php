<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/css/navbar.css">
  <link rel="stylesheet" href="/css/history.css">
  <link rel="manifest" href="/manifest.json">
  <title>History</title>
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
        <div class="flex-container" id="service-list">
        <?php
include "conn.php";
session_start();

if (isset($_SESSION['email']) && isset($_SESSION['password'])) {
    $email = $_SESSION['email'];
    $query = "SELECT * FROM posts WHERE email = '{$email}'";
    $result = mysqli_query($conn, $query);

    $post = array();
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $post[] = $row;
            $photo_names = explode(', ', $row['images']);
            $location = "https://idcrew.shop/img/upload/" . $photo_names[0]; 

            $display = ''; 
            if (isset($_GET['text']) && !empty($_GET['text'])) {
                $search = $_GET['text'];
                $search = mysqli_real_escape_string($conn, $search);
                $search = htmlentities($search);

                if (
                    strpos(strtoupper($row['title']), strtoupper($search)) !== false ||
                    strpos(strtoupper($row['price']), strtoupper($search)) !== false ||
                    strpos(strtoupper($row['date']), strtoupper($search)) !== false ||
                    strpos(strtoupper($row['city']), strtoupper($search)) !== false
                ) {
                    $display = 'display: flex;'; 
                } else {
                    $display = 'display: none;'; 
                }
            } else {
                $display = 'display: block;'; 
            }

            echo '<div class="margin-bottom" style="' . $display . '">';
            echo '<div class="card">';
            echo '<img src="' . $location . '" alt="' . $row['name'] . '">';
            echo '<div class="info-area">';
            echo '<h3 class="service-title">' . $row['title'] . '</h3>';
            echo '<h2 class="service-price">' . $row['price'] . ' RON</h2>';
            echo '<div class="date">';
            echo '<span>' . $row['date'] . '</span>';
            echo '<span>' . $row['city'] . '</span>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
            echo '<a style="text-decoration:none;" href="/backend/serviceedit.php?id=' . $row['id'] . '">';
            echo '<div class="delete-btn" style="display:flex;">';
            echo '<ion-icon name="create-outline"></ion-icon>';
            echo '<span>Editează sau şterge postarea</span>';
            echo '</div>';
            echo '</a>';
            echo '</div>';
        }
    }
}
?>

        
        </div>
      </div>
    </div>
  </section>
  <!-- Navbar Down --> 
<footer>  
  <section class="nav-bar">
      <div class="navigation">
          <ul>
              <li class="list ">
                  <a href="/frontend/home.php">
                      <span class="icon">
                      <ion-icon name="home-outline"></ion-icon>
                      </span>
                      <span class="text">Explorează</span>
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
              <li class="list">
                  <a href="/backend/post.php">
                      <span class="icon">
                          <ion-icon name="add-circle-outline"></ion-icon>
                      </span>
                      <span class="text">Postează</span>
                  </a>
              </li>
              <li class="list active">
                  <a href="/backend/history.php">
                      <span class="icon">
                          <ion-icon name="albums-outline"></ion-icon>
                      </span>
                      <span class="text">Istoric</span>
                  </a>
              </li>
              <div class="indicator"></div>
          </ul>
      </div>
  </section>
  </footer>
  <script src="/js/searchhistory.js"></script>
  <script src="/js/nav.js"></script>
  <script src="/js/sliderimg.js"></script>
<!-- Ion icons -->
<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html>