const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
    console.log('==============================');
    console.log('BookCeep iniciado com sucesso!');
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log('==============================');
});
