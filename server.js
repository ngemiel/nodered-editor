const express = require('express');
const app = express();
app.use(express.static('public'));
app.get('/', (req, res) => res.send('<h2>Editor jalan!</h2><a href="/editor.html">Buka Editor</a>'));
app.listen(3000, () => console.log('Server siap!'));
