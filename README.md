```
git clone -b robinmichay https://github.com/arnaudmolo/data-cours
```

Installer les nouvelles librairies nécessaires
``npm install``

Demander une archive en .JSON sur Facebook
Placer le contenu de votre dossier extrait de l'archive envoyé par facebook dans le dossier public/facebook/

Lancer la commande ``node scrapper/fb``
Normalement vous devriez avoir deux nouveaux (public/facebook/messages.json et public/facebook/geolocs.json).

Lancer le serveur avec ``npm start``