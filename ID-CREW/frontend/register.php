
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register | I&D CREW</title>
  <link rel="icon" href="/logos/logo192.jpg">
  <!-- Bootstrap -->
  <!-- <link rel="stylesheet" href="css/bootstrap.min.css"> -->
  <link rel="stylesheet" href="/css/style.css">
  <link rel="manifest" href="/manifest.json">
</head>
<body>
  <section>
    <div class="form-box">
      <div class="form-value">
        <form action="/frontend/register.php" method="Post">
          <h1>Întregistrează-te</h1>
          <div class="input-box">
          <ion-icon name="mail-outline"></ion-icon>
          <input type="email" id="email" name="email" required>
          <label for="">Email</label>
          </div>
          <div class="input-box">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input type="password" id="password" name="password" required>
          <label for="">Parolă</label>
          </div>
          <div class="input-box">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input type="password" id="confirm-password" name="confirmPassword" required>
          <label for="">Confirmare Parolă</label>
          </div>
          <div class="forget">
             <a href="/frontend/contactsuportregister.html">CONTACT SUPORT</a></label>
          </div>
          <p class="error-message">Parolele nu se potrivesc</p>
          <div class="button">
          <input type="submit" name="submit" value="Register" class="btn-login">
          </div>
          <a href="/index.php" style="text-decoration:none"><div id="message"></div></a>
          <div class="register">
            <p>Ai deja un cont? <a href="/index.php">Intră în cont! </a></p>
          </div>
        </form>
      </div>
    </div>
  </section>
  <script src="/js/index.js"></script>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html>
<?php
include "../backend/registerbk.php";