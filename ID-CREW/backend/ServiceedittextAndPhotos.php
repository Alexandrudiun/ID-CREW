<?php 

include "conn.php";
session_start();

if(isset($_SESSION['email']) && isset($_SESSION['password']))
{ 
    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        $sql = "SELECT * FROM `posts` WHERE id = '{$id}';";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);

        $email = $_SESSION['email'];
        $query="SELECT * FROM users WHERE email = '{$email}'";
        $result= mysqli_query($conn, $query);
        $row1 = mysqli_fetch_assoc($result);
               
        if($row1['credit']<5)
        {
            header("Location: ../frontend/CrediteInsuficientePentruAEditaAnuntul.html");
        }

        $photo_names = explode(', ', $row['images']);

        if($row['email']==$_SESSION['email'])
        {
        
       ?>

<?php

 
if(isset($_POST['submit'])){
    $credit = $row1['credit'] - 5;
    $query="UPDATE users SET credit = '$credit' WHERE email = '$email'";
    $select_user_query = mysqli_query($conn, $query);
    if(!$select_user_query) {
        die('Query Failed'. mysqli_error($conn));
     }
    include "del.php";  

    

    $email = $_SESSION['email'];
    $query="SELECT * FROM users WHERE email = '{$email}'";
    $select_user_query = mysqli_query($conn, $query);
    $name = $_POST['name'];
    $title = $_POST['titlu'];
    $price = $_POST['pret'];
    $description = $_POST['descriere'];
    $phone = $_POST['phone'];
    $date = date('Y-m-d H:i:s');
    $city = $_POST['localitate'].', '.$_POST['judet'];

    $query = "INSERT INTO posts (email, city, title, price, description, phone, date) VALUES ('{$email}', '{$city}', '{$title}', '{$price}', '{$description}', '{$phone}', '{$date}')";
    $add_post_query = mysqli_query($conn, $query);
    if(!$add_post_query) {
       die('Query Failed'. mysqli_error($conn));
    }
    $photoNames = ''; 
    $files = $_FILES['file'];
    $allowed = array('jpg', 'jpeg', 'png', 'pdf');
    $uploadCount = 0;

    foreach($files['name'] as $key => $fileName){
        $fileTmpName = $files['tmp_name'][$key]; 
        $fileSize = $files['size'][$key]; 
        $fileError = $files['error'][$key]; 
        $fileType = $files['type'][$key]; 

        $fileExt = explode('.', $fileName);
        $fileActualExt = strtolower(end($fileExt));

        if(in_array($fileActualExt, $allowed)){
            if($fileError === 0){
                if($fileSize < 5242880){
                    $fileNameNew = uniqid('', true).".".$fileActualExt;
                    $fileDestination = '../img/upload/'.$fileNameNew;
                    move_uploaded_file($fileTmpName, $fileDestination);
                    $uploadCount++;
                $photoNames .= $fileNameNew . ', ';
                } else {
                    echo "File $fileName is too big!<br>";
                }
            } else {
                echo "<script>document.getElementById('mesaj').innerHTML = 'There was an error uploading file $fileName!<br>';</script>";
            }
        } else {
            echo "<script>document.getElementById('mesaj').innerHTML = 'You cannot upload files of type $fileActualExt!<br>';</script>";
        }
    }
    $photoNames = rtrim($photoNames, ', ');
    if($uploadCount > 0){
        
        $query = "UPDATE posts SET images = '$photoNames' WHERE email = '$email'AND date ='$date' AND city = '$city' AND title = '$title' AND price = '$price' AND description = '$description' AND phone = '$phone'";
        $result = mysqli_query($conn, $query);
        
        if($result){
            
            
            //header("Location: del.php?id=$id");
        } else {
            echo "Error: " . mysqli_error($conn);
        }
}

    
header("Location: ../backend/history.php");
}

}}}
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
    <title>Edit Service Images & Text</title>
    <link rel="icon" href="/img/logo192.jpg">
    <link rel="stylesheet" href="/css/post.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="manifest" href="/manifest.json">
</head>
<body>

<main>
        <div class="center">
            <div class="profile-card">
              <form action="ServiceedittextAndPhotos.php?id=<?php echo $id; ?>" method="post" enctype="multipart/form-data">
                <h1>Publică un anunţ nou</h1>
                <p class="info">Completează cu atenție formularul deoarece editarea ulterioara costa 5 credite</p>
                <h3>Detalii anunţ</h3>
                <section>
                <div class="file-box file-input">
                    <input type="file" id="fileInput" accept="image/png, image/png, image/jpeg" name="file[]" multiple="multiple" onchange="preview()" required>
                    <label for="fileInput" class="inputFile">
                        <ion-icon name="albums-outline"></ion-icon> Adaugă imagini
                    </label>
                    <p id="num-of-files">Nicio imagine adăugată</p>
                    <div id="images"></div>
                </div>
                <div id="mesaj" style="color:red; text-align:center;"></div>
                </section>
                <div class="input-box">
                  <label for="">Titlul anunţului</label>
                  <input type="text" id="titlu" name="titlu" value="<?php echo $row['title']; ?>" required>
                </div>
                <div class="input-box">
                  <label for="">Descriere</label>
                  <textarea type="text" id="descriere" name="descriere" rows="5" maxlength="300" required><?php echo $row['description']; ?></textarea>
                </div>
                <div class="input-box">
                  <label for="">Preţ (RON)</label>
                  <input type="number" id="pret" name="pret" value="<?php echo $row['price']; ?>" required>
                </div>
                    <h3>Date de contact</h3>
                    <div class="input-box">
                    <label for="">Telefon</label>
                <input type="tel" id="phone" name="phone" pattern="^(\+40|0)[0-9]{9}$" value="<?php echo $row['phone']; ?>" required>
                    </div>
                <div class="input-box">
                <?php
                     $parts = explode(', ', $row['city']);
                     $localitate = $parts[0];
                     $judet = $parts[1];
                ?>  


                <label for="">Localitate</label>
                <input type="text" id="localitate" name="localitate" value="<?php echo $localitate; ?>" required>
                </div>
                <div class="input-box">
                <label for="">Judeţ</label>
                <input type="text" id="judet" name="judet" value="<?php echo $judet; ?>" required>
                </div>
                <div class="button">
                  <input type="submit" name="submit" value="editeaza" class="btn-login">
                  </div>
                  
              </form>
   
              
            </div>
          </div> 
    </main>
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
                <li class="list">
                    <a href="/frontend/profil.php">
                        <span class="icon">
                        <ion-icon name="person-circle-outline"></ion-icon>
                        </span>
                        <span class="text">Profil</span>
                    </a>
                </li>
                <li class="list active">
                    <a href="/backned/post.php">
                        <span class="icon">
                            <ion-icon name="add-circle-outline"></ion-icon>
                        </span>
                        <span class="text">Postează</span>
                    </a>
                </li>
                <li class="list">
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
    <script src="/js/nav.js"></script>
    <script src="/js/sliderimg.js"></script>
  <!-- Ion icons -->
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html>
