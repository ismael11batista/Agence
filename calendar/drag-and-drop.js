let elementoArrastado = null;
let cloneElemento = null;
let offsetX = 0, offsetY = 0;
let listaAtividades = null;
let ultimaPosicao = null;
let espacoVazio = null;

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('tarefa-arrastavel')) {
        elementoArrastado = e.target;
        listaAtividades = elementoArrastado.parentNode;

        cloneElemento = elementoArrastado.cloneNode(true);
        cloneElemento.classList.add('arrastando');
        document.body.appendChild(cloneElemento);

        offsetX = e.clientX - elementoArrastado.getBoundingClientRect().left;
        offsetY = e.clientY - elementoArrastado.getBoundingClientRect().top;

        cloneElemento.style.position = 'absolute';
        cloneElemento.style.left = (e.clientX - offsetX) + 'px';
        cloneElemento.style.top = (e.clientY - offsetY) + 'px';
        cloneElemento.style.width = elementoArrastado.offsetWidth + 'px';
        cloneElemento.style.pointerEvents = 'none';

        elementoArrastado.style.opacity = '0.5';

        espacoVazio = document.createElement('div');
        espacoVazio.classList.add('espaco-vazio');
        espacoVazio.style.height = elementoArrastado.offsetHeight + 'px';
        listaAtividades.insertBefore(espacoVazio, elementoArrastado);

        document.addEventListener('mousemove', eventoMouseMove);
        document.addEventListener('mouseup', eventoMouseUp);
    }
});

function eventoMouseMove(e) {
    if (!cloneElemento) return;

    cloneElemento.style.left = (e.clientX - offsetX) + 'px';
    cloneElemento.style.top = (e.clientY - offsetY) + 'px';

    let elementoAlvo = document.elementFromPoint(e.clientX, e.clientY);

    if (elementoAlvo && elementoAlvo !== elementoArrastado && elementoAlvo.classList.contains('tarefa-arrastavel')) {
        const retanguloAlvo = elementoAlvo.getBoundingClientRect();
        const metadeAltura = retanguloAlvo.height / 2;

        if (e.clientY < retanguloAlvo.top + metadeAltura) {
            if (elementoAlvo !== ultimaPosicao) {
                listaAtividades.insertBefore(espacoVazio, elementoAlvo);
                ultimaPosicao = elementoAlvo;
            }
        } else {
            if (elementoAlvo.nextSibling !== ultimaPosicao) {
                listaAtividades.insertBefore(espacoVazio, elementoAlvo.nextSibling);
                ultimaPosicao = elementoAlvo.nextSibling;
            }
        }
    } else if (elementoAlvo && elementoAlvo.classList.contains('lista-atividades')) {
        if (elementoAlvo.lastChild !== ultimaPosicao) {
            listaAtividades.appendChild(espacoVazio);
            ultimaPosicao = elementoAlvo.lastChild;
        }
    }
}

function eventoMouseUp(e) {
    if (!cloneElemento) return;

    document.removeEventListener('mousemove', eventoMouseMove);
    document.removeEventListener('mouseup', eventoMouseUp);

    document.body.removeChild(cloneElemento);
    cloneElemento = null;

    elementoArrastado.style.opacity = '1';
    listaAtividades.insertBefore(elementoArrastado, espacoVazio);
    listaAtividades.removeChild(espacoVazio);

    elementoArrastado = null;
    listaAtividades = null;
    ultimaPosicao = null;
    espacoVazio = null;
}