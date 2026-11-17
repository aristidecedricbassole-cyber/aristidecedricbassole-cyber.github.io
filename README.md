# Portfolio — Aristide Cédric Bassolé

Site statique (HTML / CSS / JavaScript pur) au style **éditorial & branding**,
pensé pour un professionnel de la communication et du marketing.

**En ligne :** https://aristidecedricbassole-cyber.github.io/  
**Raccourci :** https://bit.ly/AristideCedricBassole

## 📁 Structure

```
portfolio-aristide/
├── index.html      <- contenus et structure
├── styles.css      <- design responsive
├── script.js       <- menu mobile, révélations, formulaire
├── .nojekyll       <- Empêche le traitement Jekyll par GitHub Pages
└── assets/
    └── photo.jpg   <- à ajouter : votre portrait
```

## 🎯 Positionnement

Photographe · Vidéaste (Studio TOPCART226) · Facilitateur de jeunes (AIESEC).
Le contenu met en avant la communication, le marketing digital et le storytelling
de marque. Aucune prétention en UX design.

Expériences présentées :
1. **Studio TOPCART226** (2024 → aujourd'hui) — stagiaire → assistant vidéaste → vidéaste.
2. **AIESEC in Burkina Faso** (depuis avril 2023) — leader d'équipes et facilitateur de jeunes.
3. **Certification Marketing numérique** — DCLIC / OIF.
4. **Université Norbert Zongo de Koudougou** — études en SVT.

Tikerama a été retiré.

**Motion design :** texte découpé mot par mot à l'apparition, parallaxe du hero
et des images, barre de progression de lecture, compteurs animés, révélations en
cascade, ligne de parcours qui se dessine au scroll et boutons magnétiques.
Tout est désactivé automatiquement si l'utilisateur préfère réduire les animations
(`prefers-reduced-motion`).

**Visuels :** les photos présentes sont des images libres de droits (Unsplash)
utilisées comme **visuels de démonstration**, clairement signalés sur le site.
Remplacez les URLs `images.unsplash.com/...` dans `index.html` par vos propres
photos (ex. `assets/votre-photo.jpg`) avant une utilisation professionnelle.

## ✏️ À personnaliser

1. **Photo** : déposez votre portrait dans `assets/photo.jpg` (le placeholder
   disparaîtra automatiquement).
2. **E-mail** : remplacez `votre.email@exemple.com` dans `index.html` (2 occurrences)
   et dans `script.js` (`CONTACT_EMAIL`).
3. **Réalisations** : ajoutez vos projets réels avec leurs URLs dans la section
   « Réalisations » de `index.html`.

## 🔁 Mettre à jour le site

Via l'interface GitHub (Add file → Upload files), ou en local :

```powershell
cd "C:\Users\HP\Documents\Projet par défaut\portfolio-aristide"
git add .
git commit -m "Mise à jour du portfolio"
git push
```

GitHub Pages se met à jour automatiquement en 1 à 2 minutes.

## 🔗 À propos du lien Bitly

Le lien historique `bit.ly/Portfolio_ARISTIDECEDRICBASSOLE` pointe encore vers
le catalogue WhatsApp : Bitly fait payer le changement de destination d'un lien
existant (plan Core+). Un nouveau raccourci a donc été créé :
**https://bit.ly/AristideCedricBassole** → vers le portfolio.
