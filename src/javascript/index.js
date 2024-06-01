import 'babel-polyfill/dist/polyfill';
import '../scss/index.scss';
import initApp from './app/initApp';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
