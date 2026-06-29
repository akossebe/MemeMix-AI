
https://github.com/akossebe/MemeMix-AI.git
Ce document vous explique comment récupérer le projet et
  lancer l'environnement de développement complet (Backend + Frontend).

  📋 Prérequis

  Avant de commencer, assurez-vous d'avoir installé :
   * Node.js (version >= 22)
   * npm ou yarn
   * React Native CLI & environnement mobile configuré (Android Studio ou Xcode)
   * Clés API (à configurer dans le backend) :
       * GEMINI_API_KEY (Google Generative AI)
       * ASSEMBLYAI_API_KEY (Pour la transcription audio)

  ---

  🛠 1. Récupérer le projet

  Le projet est organisé sur la branche dev. Utilisez la commande suivante pour
  récupérer la dernière version stable :

   1 git clone <URL_DU_REPOS>
   2 cd MemeMixAI
   3 git checkout dev
   4 git pull origin dev

  ---

  🧠 2. Lancer le Backend (Le Cerveau)

  Le backend est un serveur Node.js qui gère l'intelligence artificielle.

   1. Accéder au dossier :
   1    cd backend
   2. Installer les dépendances :
   1    npm install
   3. Configurer les variables d'environnement :
     Créez un fichier .env à la racine du dossier backend :

   1    touch .env
     Ajoutez vos clés à l'intérieur :

   1    PORT=5000
   2    GEMINI_API_KEY=votre_cle_ici
   3    ASSEMBLYAI_API_KEY=votre_cle_ici
   4. Démarrer le serveur :
   1    npm start
     Le serveur sera disponible sur http://localhost:5000.

  ---

  📱 3. Lancer le Frontend (L'Application Mobile)

  L'application est développée avec React Native.

   1. Accéder à la racine du projet :
   1    cd ..
   2. Installer les dépendances :
   1    npm install
   3. Lancer Metro (le bundler) :
     Ouvrez un nouveau terminal et lancez :

   1    npm start
   4. Lancer sur un simulateur/appareil :
     Dans un autre terminal :

   1    # Pour Android
   2    npm run android
   3
   4    # Pour iOS
   5    npm run ios

  ---

  🧪 4. Comment tester l'application ?

  Une fois l'application lancée, vous avez deux fonctionnalités principales à tester :

  A. Mode "Context Reader" (Texte → Mème)
   * Action : Saisissez un texte (ex: "Le café est indispensable pour coder").
   * Résultat attendu : L'IA analyse le texte et propose deux méthodes :
       1. Un mème classique (ex: Drake) avec des légendes humoristiques.
       2. Une image entièrement générée par IA correspondant au contexte.

  B. Mode "Voice to Meme" (Audio → Mème)
   * Action : Enregistrez un court message audio avec une idée drôle.
   * Résultat attendu : 
       1. L'audio est transcrit en texte (via AssemblyAI).
       2. Gemini génère une légende originale et percutante basée sur l'ambiance de
          votre voix.

  ---

  ⚠️ Notes importantes pour les développeurs

   * Mode Mock : Si vous n'avez pas de clés API, le backend est configuré pour passer
     en "Mode Mock". Il renverra des réponses pré-enregistrées pour vous permettre de

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
