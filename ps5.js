// ===== VARIÁVEIS =====
let carrinho = [];
let freteAtual = 0;
let freteCalculadoValor = false;
const maxItensPorProduto = 10;

const produtoAtual = { nome: "PlayStation 5 Slim", preco: 3999.90 };

// ===== ELEMENTOS =====
const btnComprar = document.querySelector('.btn-comprar');
const btnCarrinho = document.querySelector('.btn-carrinho');
const modalCompra = document.getElementById('modal-carrinho');
const btnFecharCompra = document.getElementById('fechar-compra');
const btnFinalizar = document.getElementById('btn-finalizar');
const btnLimpar = document.getElementById('btn-limpar');
const resumoCarrinho = document.getElementById('resumo-carrinho');
const freteCalculado = document.getElementById('frete-calculado');
const formEndereco = document.getElementById('form-endereco');

const modalCarrinhoItens = document.getElementById('modal-carrinho-itens');
const listaItens = document.getElementById('lista-itens');
const btnFecharItens = document.getElementById('fechar-itens');

// ===== FUNÇÕES =====

// Atualiza o resumo do modal de compra
function atualizarResumoCompra() {
    resumoCarrinho.innerHTML = '';
    if(carrinho.length === 0){
        resumoCarrinho.innerHTML = '<p style="text-align:center; color:#888;">Seu carrinho está vazio</p>';
        freteCalculado.textContent = '';
        return;
    }

    let subtotal = 0;
    carrinho.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade} = R$ ${(item.preco * item.quantidade).toFixed(2)}`;
        resumoCarrinho.appendChild(p);
        subtotal += item.preco * item.quantidade;
    });

    const subtotalP = document.createElement('p');
    subtotalP.style.fontWeight = 'bold';
    subtotalP.style.marginTop = '10px';
    subtotalP.textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
    resumoCarrinho.appendChild(subtotalP);

    if(freteCalculadoValor){
        freteCalculado.innerHTML = `Frete: Grátis!<br>Total da compra: <strong>R$ ${(subtotal + freteAtual).toFixed(2)}</strong>`;
    } else {
        freteCalculado.textContent = '';
    }
}

// Atualiza modal de itens do carrinho
function atualizarModalItens() {
    listaItens.innerHTML = '';

    if(carrinho.length === 0){
        listaItens.innerHTML = '<p style="text-align:center; color:#888;">Seu carrinho está vazio</p>';
        return;
    }

    carrinho.forEach((item, index) => {
        const divItem = document.createElement('div');
        divItem.style.display = 'flex';
        divItem.style.justifyContent = 'space-between';
        divItem.style.alignItems = 'center';
        divItem.style.marginBottom = '10px';

        divItem.innerHTML = `
            <span>${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade} = R$ ${(item.preco*item.quantidade).toFixed(2)}</span>
            <div>
                <button class="menos" data-index="${index}">➖</button>
                <span class="quantidade">${item.quantidade}</span>
                <button class="mais" data-index="${index}">➕</button>
                <button class="lixeira" data-index="${index}">🗑️</button>
            </div>
        `;
        listaItens.appendChild(divItem);
    });

    // Eventos de incremento
    listaItens.querySelectorAll('.mais').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.index);
            if(carrinho[i].quantidade < maxItensPorProduto){
                carrinho[i].quantidade++;
            } else {
                alert(`Produto limitado a ${maxItensPorProduto} unidades por cliente!`);
            }
            atualizarModalItens();
            atualizarResumoCompra();
        });
    });

    // Eventos de decremento
    listaItens.querySelectorAll('.menos').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.index);
            if(carrinho[i].quantidade > 1){
                carrinho[i].quantidade--;
            } else {
                carrinho.splice(i, 1);
            }
            atualizarModalItens();
            atualizarResumoCompra();
        });
    });

    // Eventos de lixeira
    listaItens.querySelectorAll('.lixeira').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.index);
            carrinho.splice(i, 1);
            atualizarModalItens();
            atualizarResumoCompra();
        });
    });
}

// Abrir e fechar modais
function abrirModalCompra() { atualizarResumoCompra(); modalCompra.style.display = 'block'; }
function fecharModalCompra() { modalCompra.style.display = 'none'; }
function abrirModalItens() { atualizarModalItens(); modalCarrinhoItens.style.display = 'block'; }
function fecharModalItens() { modalCarrinhoItens.style.display = 'none'; }

// Adicionar produto
function adicionarProduto() {
    const itemExistente = carrinho.find(item => item.nome === produtoAtual.nome);
    if(itemExistente){
        if(itemExistente.quantidade < maxItensPorProduto){
            itemExistente.quantidade++;
        } else {
            alert(`Produto limitado a ${maxItensPorProduto} unidades por cliente!`);
        }
    } else {
        carrinho.push({...produtoAtual, quantidade: 1});
    }
    abrirModalCompra();
}

// Limpar carrinho
function limparCarrinho() {
    carrinho = [];
    freteAtual = 0;
    freteCalculadoValor = false;
    atualizarResumoCompra();
    atualizarModalItens();
}

// Calcular frete
function calcularFrete() {
    const nome = formEndereco.nome.value.trim();
    const cep = formEndereco.cep.value.trim();

    if(!nome || !cep){
        alert("Preencha todos os campos antes de calcular o frete.");
        return;
    }

    freteAtual = 0; // Grátis
    freteCalculadoValor = true;
    atualizarResumoCompra();
    alert("Frete calculado: Grátis!");
}

// Finalizar compra
function finalizarCompra() {
    if(carrinho.length === 0){
        alert("Seu carrinho está vazio!");
        return;
    }

    if(!freteCalculadoValor){
        alert("Calcule o frete antes de finalizar a compra!");
        return;
    }

    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const total = subtotal + freteAtual;

    resumoCarrinho.innerHTML = `
        <p style="font-weight:bold; color:green; text-align:center;">
            Compra finalizada com sucesso!<br>
            Subtotal: R$ ${subtotal.toFixed(2)}<br>
            Frete: Grátis<br>
            Total: R$ ${total.toFixed(2)}<br><br>
            Obrigado por comprar na Smart Direct!
        </p>
    `;

    freteCalculado.textContent = '';
    freteAtual = 0;
    freteCalculadoValor = false;
    atualizarModalItens();
}

// ===== EVENTOS =====
btnComprar.addEventListener('click', adicionarProduto);
btnCarrinho.addEventListener('click', abrirModalItens);
btnFecharCompra.addEventListener('click', fecharModalCompra);
btnFecharItens.addEventListener('click', fecharModalItens);
btnLimpar.addEventListener('click', limparCarrinho);
btnFinalizar.addEventListener('click', finalizarCompra);
formEndereco.addEventListener('submit', (e) => { e.preventDefault(); calcularFrete(); });



























