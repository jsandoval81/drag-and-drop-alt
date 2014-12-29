drag-and-drop-alt
=============

This is a simple web app that asks the user to reconstruct a logo image via the web browser. Unlike the original `drag-and-drop` this app is written in pure JS with no external dependencies.

### To use the app:
1. Clone the repo (https://github.com/jsandoval81/drag-and-drop-alt.git)
2. Navigate to the `drag-and-drop-alt/client/` directory
3. Open `index.html` with Chrome

### To continue development (in Windows):

#### Dependencies
* Git Bash
* NPM

#### Steps
1. Clone the repo (https://github.com/jsandoval81/drag-and-drop-alt.git)
2. In Git Bash, navigate to the `drag-and-drop-alt` directory
3. From Git bash, run `npm cache clean && npm install`
5. From Git bash, run `git checkout -b your-branch-name`
6. In a Command Window, navigate to the `drag-and-drop-alt` directory
9. Run `grunt dev`

You are now able to develop freely against the app. As you edit the JavaScript, LESS, and HTML all of the preprocessing, linting, concatenation, ans minification is taken care of automatically.

You can modify the JavaScript linter settings in the `.jshintrc` file. You can modify the CSS linter settings in the `.csslintrc` file. You can modify any of the automation in the `Gruntfile.js` file.