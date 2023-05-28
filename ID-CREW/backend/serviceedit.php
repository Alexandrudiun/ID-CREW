
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Service</title>
    <link rel="icon" href="/img/logo192.jpg">
    <link rel="stylesheet" href="/css/servicedit.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="manifest" href="/manifest.json">
</head>
<body>
<?php 
session_start();
if(isset($_SESSION['email']) && isset($_SESSION['password']))
{ 
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    echo '<section>';
    echo '<div class="form-box">';
    echo '<div class="form-value">';
    echo '<form method="Post">';
    echo '<h1>Selectează opţiunea de editare</h1>';
    echo '<div class="input-box">';
    echo '<div>';
    echo '<label>';
    echo '<input type="checkbox" id="worker" name="worker">';
    echo '<a href="/backend/serviceeditext.php?id=' . $id . '">Editeaza detaliile postării </a>';
    echo '</label>';
    echo '</div>';
    echo '<div>';
    echo '<label>';
    echo '<input type="checkbox" id="worker" name="buyer">';
    echo '<a href="/backend/ServiceedittextAndPhotos.php?id=' . $id. '"> Editează postarea întregă </a>';
    echo '</label>';
    echo '</div>';
    echo '<a href="/backend/del.php?id=' . $id . '" class="flex-a">';
    echo '<div class="delete-btn">';
    echo '<ion-icon name="close-outline"></ion-icon>';
    echo '<span>Șterge postarea</span>';
    echo '</div>';
    echo '</a>';
    echo '</div>';
    echo '</form>';
    echo '</div>';
    echo '</div>';
    echo '</section>';
    }
else {
    header("Location: ../backend/history.php");
} 
}
    else {
        header("Location: ../index.php");
    } ?>

</body>
</html>