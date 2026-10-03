-- backend/src/database/schema.sql

CREATE DATABASE IF NOT EXISTS book_ceep;
USE book_ceep;

CREATE TABLE IF NOT EXISTS turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  matricula VARCHAR(50) UNIQUE NOT NULL,
  id_turma INT,
  FOREIGN KEY (id_turma) REFERENCES turmas(id)
);

CREATE TABLE IF NOT EXISTS funcionarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cargo VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS autores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS editoras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS generos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS livros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  isbn VARCHAR(20),
  ano_publicacao INT,
  id_autor INT,
  id_editora INT,
  id_genero INT,
  FOREIGN KEY (id_autor) REFERENCES autores(id),
  FOREIGN KEY (id_editora) REFERENCES editoras(id),
  FOREIGN KEY (id_genero) REFERENCES generos(id)
);

CREATE TABLE IF NOT EXISTS exemplares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_livro INT NOT NULL,
  tombo VARCHAR(50) UNIQUE NOT NULL,
  localizacao VARCHAR(100),
  status ENUM('disponivel', 'emprestado', 'manutencao') DEFAULT 'disponivel',
  FOREIGN KEY (id_livro) REFERENCES livros(id)
);

CREATE TABLE IF NOT EXISTS emprestimos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_aluno INT NOT NULL,
  id_exemplar INT NOT NULL,
  id_funcionario INT NOT NULL,
  data_emprestimo DATETIME NOT NULL,
  data_devolucao_prevista DATETIME NOT NULL,
  data_devolucao_real DATETIME,
  status ENUM('ativo', 'concluido') DEFAULT 'ativo',
  FOREIGN KEY (id_aluno) REFERENCES alunos(id),
  FOREIGN KEY (id_exemplar) REFERENCES exemplares(id),
  FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id)
);
