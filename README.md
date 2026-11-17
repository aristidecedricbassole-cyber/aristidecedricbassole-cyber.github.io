# Portfolio — Aristide Cédric Bassolé

Site portfolio statique (HTML / CSS / JavaScript pur), inspiré du modèle Netlify,
prêt à être publié sur **GitHub Pages**.

## 📁 Structure

```
portfolio-aristide/
├── index.html      <- contenu et structure du site
├── styles.css      <- design responsive
├── script.js       <- menu mobile, animations, formulaire
├── .nojekyll       <- évite le traitement Jekyll par GitHub Pages
└── assets/
    └── photo.jpg   <- à ajouter : votre portrait
```

## ✏️ À personnaliser avant publication

1. **Votre photo** : placez votre portrait dans `assets/photo.jpg`.
   Le placeholder disparaîtra automatiquement dès que le fichier sera présent.
2. **Votre e-mail** : remplacez `votre.email@exemple.com` :
   - dans `index.html` (bloc Contact, 2 occurrences : le `href` et le texte affiché) ;
   - dans `script.js` (constante `CONTACT_EMAIL` en haut du fichier).
3. **Les chiffres** (`5+`, `20+`, `10+`, `100%`) : ce sont des valeurs d'exemple.
   Ajustez `data-target` dans `index.html` (section Héro) avec vos vrais chiffres.
4. **Les expériences, formations et réalisations** : textes issus d'informations
   publiques (LinkedIn / Facebook). Vérifiez-les et ajustez dates, intitulés et
   descriptions dans `index.html`.
5. **Les liens** : LinkedIn, Instagram, Facebook et WhatsApp sont déjà renseignés.
   Ajoutez vos vrais projets (avec leurs URLs) dans la section « Réalisations ».

## 🚀 Déployer sur GitHub Pages

Le GitHub CLI n'est pas installé sur cette machine, mais vous pouvez le faire
depuis le site web de GitHub ou depuis VS Code.

### Option A — Depuis le site web (le plus simple)

1. Connectez-vous sur <https://github.com> avec **votre** compte.
2. Cliquez sur **New repository**.
3. Nom du dépôt :
   - `votre-pseudo.github.io` → le site sera à `https://votre-pseudo.github.io/`
   - ou un autre nom, ex. `portfolio-aristide` → `https://votre-pseudo.github.io/portfolio-aristide/`
4. Laissez-le **Public**, ne cochez pas « Add a README file ».
5. Cliquez sur **Create repository**.
6. Sur la page du dépôt, cliquez sur **uploading an existing file**, puis
   glissez-déposez tous les fichiers du dossier `portfolio-aristide`
   (`index.html`, `styles.css`, `script.js`, `.nojekyll` et le dossier `assets`).
7. Cliquez sur **Commit changes**.
8. Allez dans **Settings → Pages** :
   - *Build and deployment* → **Source** : `Deploy from a branch`
   - **Branch** : `main` (ou `master`) / `/(root)` → **Save**
9. Attendez 1 à 2 minutes. Votre site est en ligne à l'URL indiquée.

### Option B — Depuis VS Code / terminal

```powershell
cd "C:\Users\HP\Documents\Projet par défaut\portfolio-aristide"
git init
git add .
git commit -m "Première version du portfolio"
git branch -M main
git remote add origin https://github.com/VOTRE-PSEUDO/VOTRE-DEPOT.git
git push -u origin main
```

> ⚠️ **Identité git** : cette machine est configurée au nom de *Ibrahim Ougda*
> (`o.ibrahimdayende@gmail.com`). Avant de committer avec **votre** compte,
> définissez votre identité :
> ```powershell
> git config user.name "Aristide Cédric Bassolé"
> git config user.email "votre.email@exemple.com"
> ```
> Ou connectez votre compte GitHub depuis VS Code (icône GitHub / « Sign in to GitHub »).

Puis activez GitHub Pages comme à l'étape 8 ci-dessus.

## 🔗 Mettre à jour le lien bit.ly

Votre lien `bit.ly/Portfolio_ARISTIDECEDRICBASSOLE` pointe actuellement vers un
**catalogue WhatsApp Business** (`web.whatsapp.com/catalog/22656162255`).

Pour qu'il mène vers votre nouveau portfolio :

1. Allez sur <https://bitly.com> et connectez-vous.
2. Ouvrez **Links** → trouvez `Portfolio_ARISTIDECEDRICBASSOLE`.
3. Cliquez sur **Edit** / modifier la destination.
4. Remplacez l'URL WhatsApp par l'URL de votre site GitHub Pages.
5. Enregistrez. Le raccourci gardera le même nom, mais mènera au portfolio.

Vous pouvez ensuite désactiver le catalogue WhatsApp Business si vous ne
l'utilisez plus (WhatsApp Business → Outils → Catalogue).

## 🔁 Mises à jour futures

Après chaque modification de fichier :

```powershell
git add .
git commit -m "Mise à jour du portfolio"
git push
```

GitHub Pages se met à jour automatiquement en quelques secondes.
