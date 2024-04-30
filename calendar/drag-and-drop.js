let elementoArrastado = null;
let cloneElemento = null;
let offsetX = 0, offsetY = 0;
let listaAtividades = null;

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('tarefa-arrastavel')) {
        elementoArrastado = e.target;
        listaAtividades = elementoArrastado.parentNode;

        cloneElemento = elementoArrastado.cloneNode(true);
        cloneElemento.classList.add('arrastando');
        document.body.appendChild(cloneElemento);

        const retanguloElemento = elementoArrastado.getBoundingClientRect();
        offsetX = e.clientX - retanguloElemento.left;
        offsetY = e.clientY - retanguloElemento.top;

        cloneElemento.style.position = 'absolute';
        cloneElemento.style.width = retanguloElemento.width + 'px';
        cloneElemento.style.height = retanguloElemento.height + 'px';
        cloneElemento.style.pointerEvents = 'none';

        atualizarPosicaoClone(e.clientX, e.clientY);

        elementoArrastado.style.opacity = '0.5';

        document.addEventListener('mousemove', eventoMouseMove);
        document.addEventListener('mouseup', eventoMouseUp);
    }
});

function atualizarPosicaoClone(x, y) {
    cloneElemento.style.left = (x - offsetX) + 'px';
    cloneElemento.style.top = (y - offsetY) + 'px';
}

function eventoMouseMove(e) {
    if (!cloneElemento) return;

    atualizarPosicaoClone(e.clientX, e.clientY);
}

function eventoMouseUp(e) {
    if (!cloneElemento) return;

    document.removeEventListener('mousemove', eventoMouseMove);
    document.removeEventListener('mouseup', eventoMouseUp);

    document.body.removeChild(cloneElemento);
    cloneElemento = null;

    elementoArrastado.style.opacity = '1';

    elementoArrastado = null;
    listaAtividades = null;
}

listaAtividades.addEventListener('dragover', (e) => {
    e.preventDefault();

    const elementoAlvo = e.target.closest('.tarefa-arrastavel');

    if (elementoAlvo && elementoAlvo !== elementoArrastado) {
        const retanguloAlvo = elementoAlvo.getBoundingClientRect();
        const metadeAltura = retanguloAlvo.height / 2;

        if (e.clientY < retanguloAlvo.top + metadeAltura) {
            listaAtividades.insertBefore(elementoArrastado, elementoAlvo);
        } else {
            listaAtividades.insertBefore(elementoArrastado, elementoAlvo.nextSibling);
        }
    } else if (!elementoAlvo) {
        listaAtividades.appendChild(elementoArrastado);
    }
});

listaAtividades.addEventListener('drop', (e) => {
    e.preventDefault();
});