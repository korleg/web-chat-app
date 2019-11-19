const express = require('express');
const router = express.Router();
const passportGoogle = require('../auth/google');

router.get('/google', passportGoogle.authenticate( //sunucumuz üzerindeki google sayfasına gönlendiriyoruz,
    'google',   //çalıştırdığımız passportGoogle.js dosyası ile google a bağlanıp hangi bilgileri isteyeceğimizi belirtiriz
    {
        scope: ['profile'] //burada sadece profil bilgilerini istedik, email falan da isteyebiliriz.
    }
));

router.get('/google/callback', passportGoogle.authenticate(
   'google',
   {
       failureRedirect: '/' //başarısız olması durumunda yönlendirilecek sayfayı seçeriz
   }),
   (req,res) => {
       res.redirect('/chat') //başarılı olması durumunda yönlendirilecek sayfa
   });
module.exports = router;