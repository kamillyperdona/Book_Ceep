DROP DATABASE IF EXISTS book_ceep;
CREATE DATABASE book_ceep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE book_ceep;

-- 1. Turma
CREATE TABLE turma (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR(80) NOT NULL,
    serie VARCHAR(30) NOT NULL,
    ano_letivo INT NOT NULL,
    turno VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

-- 2. Aluno
CREATE TABLE aluno (
    CGM VARCHAR(20) PRIMARY KEY,
    nome_aluno VARCHAR(120) NOT NULL,
    email VARCHAR(150),
    telefone VARCHAR(20),
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    id_turma INT NOT NULL,
    CONSTRAINT fk_aluno_turma FOREIGN KEY (id_turma) REFERENCES turma(id_turma) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. Funcionário
CREATE TABLE funcionario (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    nome_funcionario VARCHAR(120) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- 4. Editora
CREATE TABLE editora (
    id_editora INT AUTO_INCREMENT PRIMARY KEY,
    nome_editora VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    cidade VARCHAR(80)
) ENGINE=InnoDB;

-- 5. Gênero
CREATE TABLE genero (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nome_genero VARCHAR(60) NOT NULL
) ENGINE=InnoDB;

-- 6. Autor
CREATE TABLE autor (
    id_autor INT AUTO_INCREMENT PRIMARY KEY,
    nome_autor VARCHAR(100) NOT NULL,
    nacionalidade VARCHAR(80)
) ENGINE=InnoDB;

-- 7. Livro
CREATE TABLE livro (
    ISBN VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    ano_publicacao INT,
    edicao VARCHAR(30),
    idioma VARCHAR(30),
    id_editora INT NOT NULL,
    id_genero INT NOT NULL,
    CONSTRAINT fk_livro_editora FOREIGN KEY (id_editora) REFERENCES editora(id_editora) ON UPDATE CASCADE,
    CONSTRAINT fk_livro_genero FOREIGN KEY (id_genero) REFERENCES genero(id_genero) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. Tabela N:N Livro_Autor
CREATE TABLE livro_autor (
    ISBN VARCHAR(20) NOT NULL,
    id_autor INT NOT NULL,
    PRIMARY KEY (ISBN, id_autor),
    CONSTRAINT fk_la_livro FOREIGN KEY (ISBN) REFERENCES livro(ISBN) ON DELETE CASCADE,
    CONSTRAINT fk_la_autor FOREIGN KEY (id_autor) REFERENCES autor(id_autor) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 9. Exemplar
CREATE TABLE exemplar (
    id_exemplar INT AUTO_INCREMENT PRIMARY KEY,
    numero_tombo VARCHAR(50) NOT NULL UNIQUE,
    localizacao VARCHAR(100),
    status ENUM('DISPONIVEL', 'EMPRESTADO', 'MANUTENCAO') DEFAULT 'DISPONIVEL',
    ISBN VARCHAR(20) NOT NULL,
    CONSTRAINT fk_exemplar_livro FOREIGN KEY (ISBN) REFERENCES livro(ISBN) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Empréstimo
CREATE TABLE emprestimo (
    id_emprestimo INT AUTO_INCREMENT PRIMARY KEY,
    data_emprestimo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao DATETIME NULL,
    observacao VARCHAR(255),
    status ENUM('ATIVO', 'CONCLUIDO', 'ATRASADO') DEFAULT 'ATIVO',
    CGM VARCHAR(20) NOT NULL,
    id_exemplar INT NOT NULL,
    id_funcionario INT NOT NULL,
    CONSTRAINT fk_emp_aluno FOREIGN KEY (CGM) REFERENCES aluno(CGM) ON UPDATE CASCADE,
    CONSTRAINT fk_emp_exemplar FOREIGN KEY (id_exemplar) REFERENCES exemplar(id_exemplar),
    CONSTRAINT fk_emp_func FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario)
) ENGINE=InnoDB;

-- 1. Na tabela ALUNO, adicionamos o controle de suspensão
ALTER TABLE aluno 
ADD COLUMN suspenso_ate DATETIME NULL AFTER status;

-- 2. Na tabela EMPRESTIMO, garantimos a coluna data_prevista e justificativa
ALTER TABLE emprestimo 
ADD COLUMN data_prevista_devolucao DATETIME NOT NULL AFTER data_emprestimo,
ADD COLUMN justificativa VARCHAR(255) NULL AFTER observacao;
