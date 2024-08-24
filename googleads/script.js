function ajustarValor(valor) {
    valor = valor.replace("R$ ", "").replace(".", "").replace(",", ".");
    return parseFloat(valor) || 0;
}

function calcularTotais() {
    const RPASaoPaulo = ajustarValor(document.getElementById('RPASaoPaulo').value);
    const MobileSiteAgence = ajustarValor(document.getElementById('MobileSiteAgence').value);
    const HuntingOutsourcing = ajustarValor(document.getElementById('HuntingOutsourcing').value);
    const PMaxSaoPaulo = ajustarValor(document.getElementById('PMaxSaoPaulo').value);
    const SistemasWeb = ajustarValor(document.getElementById('SistemasWeb').value);
    const YoutubeAgence = ajustarValor(document.getElementById('YoutubeAgence').value);
    const Ajustes = ajustarValor(document.getElementById('Ajustes').value);

    const totalFabrica = RPASaoPaulo + MobileSiteAgence + SistemasWeb + Ajustes;
    const totalHuntingOutsourcing = HuntingOutsourcing + PMaxSaoPaulo;
    const totalDisplay = YoutubeAgence;

    document.getElementById('resultados').innerHTML = `
        <p id="totalFabrica" class="clicavel">Total [BR] Fábrica: R$ <span>${totalFabrica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
        <p id="totalHuntingOutsourcing" class="clicavel">Total [BR] Hunting e Outsourcing: R$ <span>${totalHuntingOutsourcing.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
        <p id="totalDisplay" class="clicavel">Total [BR] Display: R$ <span>${totalDisplay.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
    `;

    adicionarOuvintesDeCliqueParaTotais();
}

function adicionarOuvintesDeCliqueParaTotais() {
    document.querySelectorAll('.clicavel').forEach(elemento => {
        elemento.addEventListener('click', function () {
            const textoParaCopiar = this.querySelector('span').textContent.trim();
            copiarParaClipboard(textoParaCopiar);
        });
    });
}

function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            console.log('Texto copiado com sucesso!');
            mostrarPopUp('Valor copiado para a área de transferência!');
        })
        .catch(err => console.error('Falha ao copiar texto:', err));
}

function mostrarPopUp(mensagem) {
    let popUp = document.querySelector('.pop-up');
    if (!popUp) {
        popUp = document.createElement('div');
        popUp.className = 'pop-up';
        document.body.appendChild(popUp);
    }
    popUp.textContent = mensagem;
    popUp.classList.add('active');

    setTimeout(() => {
        popUp.classList.remove('active');
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    calcularTotais();
});