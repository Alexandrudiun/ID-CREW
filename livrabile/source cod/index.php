<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login | I&D CREW</title>
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
        <form action="index.php" method="Post">
          <h1>Loghează-te</h1>
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
          <div class="forget">
             <a href="/frontend/contactsuportlogin.html">CONTACT SUPORT</a></label>
          </div>
          <div class="message" id="message" ></div>
          <div class="button">
          <input type="submit" name="submit" value="Login" class="btn-login">
          </div>
          <div class="register">
            <p>Nu ai un cont? <a href="/frontend/register.php">Inregistrează-te! </a></p>
          </div>
        </form>
      </div>
    </div>
  </section>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html> 
<?php
include "backend/loginbk.php";