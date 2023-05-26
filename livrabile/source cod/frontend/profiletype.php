<?php
include "../backend/profiletypebk.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selectează tipul de profil</title>
  <link rel="icon" href="/logos/logo192.jpg">
  <!-- Bootstrap -->
  <!-- <link rel="stylesheet" href="css/bootstrap.min.css"> -->
  <link rel="stylesheet" href="/css/afterlogin.css">
  <link rel="manifest" href="/manifest.json">
</head>

<body>
<section>
    <div class="form-box">
      <div class="form-value">
      <form method="post" id="profile-form">
          <h1>Selectează tipul de profil</h1>
          <div class="input-box">
            <div>
            <label>
              <input type="checkbox" id="worker" name="worker">
              <span>Vânzător (worker)</span>
            </label>
            </div>
            <div>
              <label>
                <input type="checkbox" id="worker" name="buyer">
                <span>Cumpărator (buyer)</span>
              </label>
            </div>
          </div>
          <div class="button">
            <input type="submit" name="submit" value="Salvează" class="btn-login">
          </div>
        </form>
        <div class="note">
          <p>*pot fi selectate ambele opţiuni*</p>
        </div>
      </div>
    </div>
  </section>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html>
