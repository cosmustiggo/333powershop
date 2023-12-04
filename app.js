let cart = [];

function showEditForm(index) {
  // Carregar produtos do localStorage
  var products = JSON.parse(localStorage.getItem('products')) || [];

  // Obter o produto que queremos editar
  var product = products[index];

  // Verificar se o produto foi encontrado
  if (product) {
      // Verificar se o produto está no carrinho
      if (isProductInCart(product.id)) {
          alert('Product on cart. Please remove to edit');
      } else {
          // Preencher o formulário com os dados do produto
          document.getElementById('wheelname').value = product.title; // use 'title' aqui
          document.getElementById('price').value = product.price;
          document.getElementById('description').value = product.description;

          // Mostrar o formulário
          var form = document.getElementById('editForm');
          form.style.display = 'block';

          // Salvar o ID do produto que estamos editando
          localStorage.setItem('editId', product.id);
      }
  } else {
      // Caso o produto não seja encontrado, exibir uma mensagem de erro
      alert('Erro: Produto não encontrado!');
  }
}

// Função para verificar se o produto está no carrinho
function isProductInCart(productId) {
  // Carregar produtos do carrinho do localStorage
  var cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Verificar se o produto está no carrinho pelo ID
  return cartProducts.some(function(product) {
  return product.id == productId;
  });
}
               

//Função para Remover do Carrinho
function removeFromCart(id) {
    // Carregue o carrinho do localStorage
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Remova o produto do carrinho
    cart = cart.filter(item => item.id !== id);
  
    // Salve o carrinho atualizado de volta ao localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Atualize o carrinho na página
    updateCart();
  }

//Função para Aumentar a Quantidade de Itens do Carrinho 
function increaseQuantity(id) {
    // Carregue o carrinho do localStorage
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Encontre o produto no carrinho
    var product = cart.find(item => item.id === id);
  
    // Aumente a quantidade do produto
    if (product) {
      product.quantity++;
    }
  
    // Salve o carrinho atualizado de volta ao localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Atualize o carrinho na página
    updateCart();
  }


//Função para Diminuir a Quantidade de Itens do Carrinho
function decreaseQuantity(id) {
  // Carregue o carrinho do localStorage
  var cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Encontre o produto no carrinho
  var product = cart.find(item => item.id === id);
  
  // Diminua a quantidade do produto, garantindo que não seja menor que 1
  if (product && product.quantity > 1) {
    product.quantity--;
  } else {
    // Se a quantidade for 1 ou menor, remova o produto do carrinho
    cart = cart.filter(item => item.id !== id);
  }
  
  // Salve o carrinho atualizado de volta ao localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Atualize o carrinho na página
  updateCart();
}

//Função para Adicionar ao Carrinho
function addToCart(productOrIndex) {
  
  // Determine se estamos lidando com um produto ou um índice
  var product;
  if (typeof productOrIndex === 'number') {
    // Se for um número, assumimos que é um índice
    var products = localStorage.getItem('products');
    products = products ? JSON.parse(products) : [];
    product = products[productOrIndex];
  } else {
    // Caso contrário, assumimos que é um objeto de produto
    product = productOrIndex;
  }
  
  // Carregue o carrinho do localStorage
  var cart = localStorage.getItem('cart');
  cart = cart ? JSON.parse(cart) : [];
  
  // Verifique se o produto já existe no carrinho
  var existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    // Se o produto já existe, aumente a quantidade
      existingItem.quantity++;
  } else {
    // Se o produto não existe, adicione ao carrinho
    cart.push({...product, quantity: 1});
  }
  
  // Salve o carrinho atualizado de volta ao localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Atualize o carrinho na página
  updateCart();
}


//Função para Atualizar o Carrinho
  function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let totalPrice = 0;
  
    // Carregue o carrinho do localStorage
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    cart.forEach(item => {
      const li = document.createElement('li');
      // Use a propriedade wheelname se existir, caso contrário use title
      const name = item.wheelname ? item.wheelname : item.title;
      li.innerHTML = `
      <img src="${item.image}" alt="${name}"/>
      <div class="item-info">   
          <h3>${name}</h3>
          <p>${item.description}</p>
          <h4>$${item.price}</h4>
      </div>
      <div class="item-buttons">          
          <div>
              <button class="more" onclick="increaseQuantity(${item.id})">+</button>
              <button class="less" onclick="decreaseQuantity(${item.id})">-</button>
              <span>Quantity: ${item.quantity}</span>
          </div>
      </div>
      `;
      cartItems.appendChild(li);
      totalPrice += item.price * item.quantity;
    
      // Crie o botão de exclusão separadamente para que possamos adicionar um evento de clique
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete');
      deleteButton.innerText = 'Delete';
      deleteButton.addEventListener('click', function(event) {
          event.preventDefault();
          showDialog(item.id);
      });
      li.appendChild(deleteButton);
    }); 
    const cartCount = document.getElementById('cart-count');
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.innerText = 'Total: $' + totalPrice.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
}
  
//On click para redirecionar a página de Checkout
document.getElementById('checkout').addEventListener('click', function() {
    window.location.href = 'checkout.html';   
});

//Função para Carregar os Itens do data.json para a página "Products"
function carregar(){
    fetch('data.json')
        .then(response => response.json())
        .then(wheels => {
            const container = document.querySelector("#wheels-container")
                wheels.map(wheel => {
                    const card = document.createElement("div")
                    card.classList.add("card")

                    const img = document.createElement("img")
                    img.src = wheel.image
                    img.alt = wheel.wheelname

                    const titulo = document.createElement("h3")
                    titulo.textContent = wheel.wheelname

                    const conteudo = document.createElement("p")
                    conteudo.textContent = wheel.description

                    const price = document.createElement("h4")
                    price.textContent = `$${wheel.price}`

                    const btn = document.createElement("button");
                    btn.innerHTML= `<i class="fa-solid fa-cart-plus"></i> Buy now!`;
                    btn.onclick = () => addToCart(wheel);

                    card.appendChild(img)
                    card.appendChild(titulo)
                    card.appendChild(conteudo)
                    card.appendChild(price)
                    card.appendChild(btn)
                    container.appendChild(card)})
    })
}carregar()


//Função para adicionar o carrinho OnClick
document.getElementById('cart').addEventListener('click', function() {
    const cartMenu = document.getElementById('cart-menu');
    if (cartMenu.style.display === 'none') {
        cartMenu.style.display = 'block';
        setTimeout(function() {
            cartMenu.style.opacity = '1';
        }, 50); // Espera um pouco para a opacidade começar a mudar
    } else {
        cartMenu.style.opacity = '0';
        setTimeout(function() {
            cartMenu.style.display = 'none';
        }, 500); // Espera até a transição da opacidade terminar para mudar o display
    }
});

//Função para Aparecer o diálogo quando remove um item do carrinho
function showDialog(id) {
    const dialog = document.getElementById('dialog');
    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');

    //Função para fechar a caixa de diálogo e remover os eventos de clique
    function closeDialog() {
        dialog.style.display = "none";
        yesButton.removeEventListener('click', removeItem);
        noButton.removeEventListener('click', closeDialog);
    }

    //Função para remover o item do carrinho e fechar a caixa de diálogo
    function removeItem() {
        removeFromCart(id);
        closeDialog();
    }

    //Adiciona os eventos de click
    yesButton.addEventListener('click', removeItem);
    noButton.addEventListener('click', closeDialog);

    //Mostre a caixa de diálogo
    dialog.style.display = "block";
}

