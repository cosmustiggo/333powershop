var form = document.getElementById('productForm');
form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Pegue os dados do formulário
  var data = new FormData(form);

  // Converta os dados do formulário em um objeto JavaScript
  var product = Object.fromEntries(data);

  // Adicione um id único ao produto
  product.id = Date.now();

  // Carregue produtos existentes do localStorage
  var products = localStorage.getItem('products');
  products = products ? JSON.parse(products) : [];

  // Adicione o novo produto à lista
  products.push(product);

  // Salve a lista atualizada de produtos no localStorage
  localStorage.setItem('products', JSON.stringify(products));

  // Mostre uma mensagem de alerta
  alert('Product inserted successfully!');

  // Limpe o formulário
  form.reset();
});