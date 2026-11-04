export const emailTemplates = {
  verification: (name: string, verificationUrl: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérifiez votre adresse email - DAR & ATELIER</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: #fff; padding: 30px; text-align: center; }
    .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
    .content { background: #f9f7f4; padding: 40px 30px; }
    .button { display: inline-block; background: #b8860b; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { background: #1a1a1a; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">DAR & ATELIER</div>
    </div>
    <div class="content">
      <h1>Bienvenue, ${name}</h1>
      <p>Merci de vous être inscrit sur DAR & ATELIER. Pour finaliser votre inscription et accéder à votre compte, veuillez vérifier votre adresse email.</p>
      <p>Cliquez sur le bouton ci-dessous pour confirmer votre adresse email :</p>
      <center>
        <a href="${verificationUrl}" class="button">Vérifier mon adresse email</a>
      </center>
      <p>Ou copiez et collez ce lien dans votre navigateur :</p>
      <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationUrl}</p>
      <p><strong>Ce lien expire dans 24 heures.</strong></p>
      <p>Si vous n'avez pas créé de compte sur DAR & ATELIER, vous pouvez ignorer cet email.</p>
    </div>
    <div class="footer">
      <p>© 2025 DAR & ATELIER. Tous droits réservés.</p>
      <p>Casablanca, Maroc</p>
    </div>
  </div>
</body>
</html>
  `,

  passwordReset: (name: string, resetUrl: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe - DAR & ATELIER</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: #fff; padding: 30px; text-align: center; }
    .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
    .content { background: #f9f7f4; padding: 40px 30px; }
    .button { display: inline-block; background: #b8860b; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { background: #1a1a1a; color: #999; padding: 20px; text-align: center; font-size: 12px; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">DAR & ATELIER</div>
    </div>
    <div class="content">
      <h1>Réinitialisation de mot de passe</h1>
      <p>Bonjour ${name},</p>
      <p>Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte DAR & ATELIER.</p>
      <div class="warning">
        <p><strong>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email en toute sécurité.</strong></p>
      </div>
      <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
      <center>
        <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
      </center>
      <p>Ou copiez et collez ce lien dans votre navigateur :</p>
      <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>
      <p><strong>Ce lien expire dans 1 heure.</strong></p>
    </div>
    <div class="footer">
      <p>© 2025 DAR & ATELIER. Tous droits réservés.</p>
      <p>Casablanca, Maroc</p>
    </div>
  </div>
</body>
</html>
  `,

  welcome: (name: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur DAR & ATELIER</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: #fff; padding: 30px; text-align: center; }
    .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
    .content { background: #f9f7f4; padding: 40px 30px; }
    .button { display: inline-block; background: #b8860b; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { background: #1a1a1a; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">DAR & ATELIER</div>
    </div>
    <div class="content">
      <h1>Bienvenue, ${name} !</h1>
      <p>Nous sommes ravis de vous accueillir parmi nous. Votre compte a été créé avec succès et votre adresse email a été vérifiée.</p>
      <p>Vous pouvez maintenant :</p>
      <ul>
        <li>Explorer notre catalogue de propriétés de prestige</li>
        <li>Sauvegarder vos favoris</li>
        <li>Demander des devis pour vos projets de construction</li>
        <li>Contacter nos équipes pour vos projets immobiliers</li>
      </ul>
      <center>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/properties" class="button">Découvrir nos propriétés</a>
      </center>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
    </div>
    <div class="footer">
      <p>© 2025 DAR & ATELIER. Tous droits réservés.</p>
      <p>Casablanca, Maroc</p>
    </div>
  </div>
</body>
</html>
  `,
};
