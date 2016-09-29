// Import main Scss file for webpack bundle
import '../styles/main.scss';

import 'babel-polyfill';
import Hello from './hello';

const app = new Hello();

app.hi('RaduM');
app.domUpdate();
