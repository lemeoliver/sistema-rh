const express = require('express');
const fs = require('fs'); // Módulo para lidar com ficheiros
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('.'));

const DATA_FILE = './funcionarios.json';

// Função auxiliar para ler o ficheiro
function lerFicheiro() {
    try {
        if (!fs.existsSync(DATA_FILE)) return []; // Se não existir, retorna lista vazia
        const dados = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(dados);
    } catch (err) {
        console.error("Erro ao ler:", err);
        return [];
    }
}

// Função auxiliar para gravar no ficheiro
function gravarFicheiro(dados) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));
}

// 1. Rota para listar (Lê do ficheiro)
app.get('/funcionarios', (req, res) => {
    const funcionarios = lerFicheiro();
    res.json(funcionarios);
});

// 2. Rota para adicionar (Grava no ficheiro)
app.post('/funcionarios', (req, res) => {
    const funcionarios = lerFicheiro();
    const novo = req.body;
    funcionarios.push(novo);
    gravarFicheiro(funcionarios);
    res.json({ mensagem: 'Gravado com sucesso!' });
});

// 3. Rota para remover (Atualiza o ficheiro)
app.delete('/funcionarios/:nome', (req, res) => {
    let funcionarios = lerFicheiro();
    const nome = req.params.nome;
    funcionarios = funcionarios.filter(f => f.nome.toLowerCase() !== nome.toLowerCase());
    gravarFicheiro(funcionarios);
    res.json({ mensagem: 'Removido com sucesso!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Servidor rodando na porta ${PORT}));