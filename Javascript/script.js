document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const loginForm = document.getElementById('loginForm');
    const searchForm = document.getElementById('searchForm');
  
    if (registroForm) {
      registroForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const repetirSenha = document.getElementById('repetirSenha').value;
  
        if (senha !== repetirSenha) {
          alert('As senhas não coincidem!');
          return;
        }
  
        const user = { nome, email, senha };
        localStorage.setItem('user', JSON.stringify(user));
        alert('Registro bem-sucedido!');
        window.location.href = 'login.html';
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('emailLogin').value;
        const senha = document.getElementById('senhaLogin').value;
        const user = JSON.parse(localStorage.getItem('user'));
  
        if (user && user.email === email && user.senha === senha) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          alert('Login bem-sucedido!');
          window.location.href = 'logged.html';
        } else {
          alert('E-mail ou senha incorretos!');
        }
      });
    }
  
    // Pesquisa dinâmica
    $('#searchInput').on('input', function() {
      const searchQuery = $(this).val().toLowerCase();
      $.getJSON('produtos.json', function(produtos) {
        const resultados = produtos.filter(produto => produto.nome.toLowerCase().includes(searchQuery));
        displayResultados(resultados);
      });
    });
  });
  
  function displayResultados(produtos) {
    const resultadosDiv = $('#resultadosBusca');
    resultadosDiv.empty().append('<h2>Resultados da Pesquisa</h2>');
    if (produtos.length === 0) {
      resultadosDiv.append('<p>Nenhum livro encontrado.</p>');
    } else {
      const row = $('<div class="row"></div>');
      produtos.forEach(produto => {
        const col = $(`
          <div class="col-md-4">
            <div class="card mb-4 produto-card">
              <div class="card-body">
                <h5 class="card-title">${produto.nome}</h5>
                <p class="card-text">${produto.descricao}</p>
                <button class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id})">Adicionar a minha Biblioteca</button>
              </div>
            </div>
          </div>`);
        row.append(col);
      });
      resultadosDiv.append(row);
    }
  }
  
  window.adicionarAoCarrinho = function(produtoId) {
    $.getJSON('produtos.json', function(produtos) {
      const produto = produtos.find(produto => produto.id === produtoId);
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      carrinho.push(produto);
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      alert(`${produto.nome} foi adicionado ao carrinho!`);
    });
  };