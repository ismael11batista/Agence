let NomeDoContato = "";
let NomeDaEmpresa = "";
let EmailDoContato = "";
let TextoEspecial = ""; // Variável global para armazenar o texto especial
let TelefoneDoContato = '';
let EmailFormatado = '';
let InteresseDoLead = '';
var textoFormatadoGlobal = ""; // Variável global para armazenar o texto formatado
let origemGlobal = '';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('inputText').addEventListener('input', function () {
        identificarInformacoesAutomaticamente(); // Função existente
        identificarInformacoesAdicionais();
        formatarTextoEspecial(); // Chamada da função para formatar e exibir detalhes do lead
    });

    document.getElementById('copiarTextoEspecial').addEventListener('click', copiarTextoEspecial);
    document.getElementById('copiarLeadFaleCom').addEventListener('click', copiarLeadFaleComParaClipboard);
});



function formatarNome() {
    const texto = document.getElementById('inputText').value;
    const nomeRegex = /Nome: (.+)|Name: (.+)/i;
    const nomeMatch = texto.match(nomeRegex);
    if (nomeMatch) {
        const nome = nomeMatch[1] || nomeMatch[2];
        const nomeFormatado = nome.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
        NomeDoContato = nomeFormatado
        copiarParaClipboard(nomeFormatado);
    } else {
        copiarParaClipboard('Nome nao identificado');
        mostrarPopUp("Nome nao identificado");
    }
}

function formatarEmpresa() {
    const texto = document.getElementById('inputText').value;
    const empresaRegex = /Empresa: (.+)|Enterprise: (.+)/i;
    const empresaMatch = texto.match(empresaRegex);
    if (empresaMatch) {
        const empresa = empresaMatch[1] || empresaMatch[2];
        const empresaFormatada = empresa.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
        NomeDaEmpresa = empresaFormatada
        copiarParaClipboard(empresaFormatada);
    } else {
        copiarParaClipboard('Sem informação');
        mostrarPopUp("Empresa não identificada.");
    }
}

function formatarAssunto() {
    const texto = document.getElementById('inputText').value;
    const éChatbot = /ChatBot <agencechatbot76@gmail.com>/i.test(texto);

    if (éChatbot) {
        copiarParaClipboard("Nao ha campo de assunto no chatbot.");
        mostrarPopUp("Nao ha campo de assunto no chatbot.");
        return;
    }

    const assuntoRegex = /Comentários:\s*([\s\S]*?)\s*Agence/;
    const assuntoMatch = texto.match(assuntoRegex);
    if (assuntoMatch) {
        let assunto = assuntoMatch[1].trim();
        assunto = assunto.toLowerCase();
        let assuntoFormatado = assunto.replace(/([.!?]\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());

        copiarParaClipboard(assuntoFormatado.charAt(0).toUpperCase() + assuntoFormatado.slice(1));
        mostrarPopUp("Assunto formatado e copiado para a área de transferência: " + assuntoFormatado);
    } else {
        copiarParaClipboard("Campo de assunto não encontrado.");
        mostrarPopUp("Campo de assunto não encontrado.");
    }
}


function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarPopUp("Texto copiado: " + texto.substring(0, 30) + (texto.length > 30 ? "..." : ""));
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
    });
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
    }, 1000);
}

function formatarEmail() {
    const texto = document.getElementById('inputText').value;
    const emailRegex = /E-mail: (.+)|Email: (.+)/i;
    const emailMatch = texto.match(emailRegex);
    if (emailMatch) {
        const email = (emailMatch[1] || emailMatch[2]).toLowerCase();
        EmailDoContato = email; // Atualiza a variável global corretamente
        EmailFormatado = email; // Mantém esta linha se precisar do email formatado em minúsculas em outra parte do código
        copiarParaClipboard(email);
    } else {
        copiarParaClipboard('email@email.com');
        mostrarPopUp("e-mail não encontrado.");
    }
}

function formatarTelefone() {
    const texto = document.getElementById('inputText').value;
    const telefoneRegex = /Telefone:.*?(\d[\d\s().-]*)/i;
    const telefoneMatch = texto.match(telefoneRegex);
    if (telefoneMatch) {
        let numeros = telefoneMatch[1].replace(/\D/g, '');

        if (numeros.startsWith('55') && (numeros.length === 12 || numeros.length === 13)) {
            const formatado = '+' + numeros.substring(0, 2) + ' ' + numeros.substring(2, 4) + ' ' + numeros.substring(4);
            copiarParaClipboard(formatado);
            mostrarPopUp("Telefone formatado e copiado com sucesso!");
        } else if (numeros.length >= 10 && numeros.length <= 11) {
            numeros = '55' + numeros;
            const formatado = '+' + numeros.substring(0, 2) + ' ' + numeros.substring(2, 4) + ' ' + numeros.substring(4);
            copiarParaClipboard(formatado);
            mostrarPopUp("Telefone formatado e copiado com sucesso!");
        } else {
            // Ajuste: se não for possível formatar corretamente, copia o número na forma crua.
            copiarParaClipboard(telefoneMatch[1]);
            mostrarPopUp("Telefone inválido. Número copiado na forma original.");
        }
    } else {
        copiarParaClipboard('0000000000000')
        mostrarPopUp("Telefone não encontrado.");
    }
}


function identificarInformacoesAutomaticamente() {
    const texto = document.getElementById('inputText').value;
    let origem = "Origem: não identificada";
    let interesse = "Interesse: não identificado";
    let porte = "Porte da Empresa: Pequeno"; // Valor padrão caso o porte não seja encontrado

    if (texto.includes("ChatBot") || texto.includes("Inbound Chatbot")) {
        origem = "Origem: Inbound Whatsapp";
    } else if (texto.includes("Fale Conosco") || texto.includes("Inbound E-mail")) {
        origem = "Origem: Inbound E-mail";
    }



    const necessidadeRegex = /Necessidade: (.+)/i;
    const interesseRegex = /Estou interessado em: (.+)/i;
    const porteRegex = /icone Porte(.*?)icone Quantidade de Funcionários/s;
    const necessidadeMatch = texto.match(necessidadeRegex);
    const interesseMatch = texto.match(interesseRegex);
    const porteMatch = texto.match(porteRegex); // Tenta encontrar o porte da empresa no texto

    if (necessidadeMatch) {
        interesse = "Interesse: " + necessidadeMatch[1];
    } else if (interesseMatch) {
        interesse = "Interesse: " + interesseMatch[1];
    }

    // Verifica se o interesse contém o termo "rpa" em letras minúsculas
    if (interesse.toLowerCase().includes("rpa")) {
        interesse = "Interesse: RPA - Robotic Process Automation";
    }


    if (porteMatch && porteMatch[1]) {
        let porteTexto = porteMatch[1].replace("Porte", "").trim();
        porte = `Porte da Empresa: ${porteTexto}`; // Atribui o porte encontrado à variável
    }

    InteresseDoLead = interesse
    origemGlobal = origem


    // Exibe as informações capturadas nos elementos HTML correspondentes
    document.getElementById('origemLead').textContent = origem;
    document.getElementById('interesseLead').textContent = interesse;
    document.getElementById('porteLead').textContent = porte; // Exibe o porte da empresa
}


function formatarLead() {
    let origem = "Origem: não identificada";
    const texto = document.getElementById('inputText').value;
    const nomeRegex = /Nome: (.+)|Name: (.+)/i;
    const empresaRegex = /Empresa: (.+)|Enterprise: (.+)/i;
    const telefoneRegex = /Telefone:.*?(\d[\d\s().-]*)/i;
    const interesseRegex = /Necessidade: (.+)|Estou interessado em: (.+)/i;
    const linkedinRegex = /https:\/\/www\.linkedin\.com\/in\/[^/?\s]+/i;


    const nomeMatch = texto.match(nomeRegex);
    const empresaMatch = texto.match(empresaRegex);
    const telefoneMatch = texto.match(telefoneRegex);
    const interesseMatch = texto.match(interesseRegex);
    const linkedinMatch = texto.match(linkedinRegex);


    const nome = nomeMatch ? nomeMatch[1] || nomeMatch[2] : "não informado";
    const nomeFormatado = nome.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
    NomeDoContato = nomeFormatado

    const empresa = empresaMatch ? empresaMatch[1] || empresaMatch[2] : "não informado";
    const empresaFormatada = empresa.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
    NomeDaEmpresa = empresaFormatada

    let telefone = telefoneMatch ? telefoneMatch[1].replace(/\D/g, '') : "não informado";

    let interesse = interesseMatch ? interesseMatch[1] || interesseMatch[2] : "não informado";

    // Verifica se o interesse contém o termo "rpa" em letras minúsculas
    if (interesse.toLowerCase().includes("rpa")) {
        interesse = "RPA - Robotic Process Automation";
    }

    if (telefone.startsWith('55') && (telefone.length === 12 || telefone.length === 13)) {
        telefone = '+' + telefone.substring(0, 2) + ' ' + telefone.substring(2, 4) + ' ' + telefone.substring(4);
    } else if (telefone.length >= 10 && telefone.length <= 11) {
        telefone = '55' + telefone;
        telefone = '+' + telefone.substring(0, 2) + ' ' + telefone.substring(2, 4) + ' ' + telefone.substring(4);
    }

    TelefoneDoContato = telefone

    let informacoes = "";

    // Definindo as expressões regulares para cada tipo de informação
    const cnpjRegex = /CNPJ: (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i;
    const porteRegex = /icone Porte(.*?)icone Quantidade de Funcionários/s;
    const numeroFuncionariosRegex = /Quantidade de Funcionários(.*?)icone like/s;
    const faturamentoAnualRegex = /Faturamento Anual(.*?)icone like/s;

    // Procurando pelas informações no texto
    const cnpjMatch = texto.match(cnpjRegex);
    const porteMatch = texto.match(porteRegex);
    const numeroFuncionariosMatch = texto.match(numeroFuncionariosRegex);
    const faturamentoAnualMatch = texto.match(faturamentoAnualRegex);

    if (texto.includes("ChatBot") || texto.includes("Inbound Chatbot")) {
        origem = "Origem: Inbound Whatsapp";
    } else if (texto.includes("Fale Conosco") || texto.includes("Inbound E-mail")) {
        origem = "Origem: Inbound E-mail";
    }

    // Adicionando as informações encontradas na string de informacoes
    if (porteMatch) {
        const porteTexto = porteMatch[1].replace("Porte", "").trim();
        informacoes += `Porte da Empresa: ${porteTexto}\n`;
    }

    if (cnpjMatch) informacoes += `CNPJ: ${cnpjMatch[1]}\n`;

    if (numeroFuncionariosMatch) {
        // Removendo a frase indesejada e espaços extras
        let numeroFuncionariosTexto = numeroFuncionariosMatch[1].replace("Quantidade de Funcionários", "").trim();
        numeroFuncionariosTexto = numeroFuncionariosTexto.replace(" funcionários", "").trim();
        informacoes += `Nº de Funcionários: ${numeroFuncionariosTexto}\n`;
    }
    if (faturamentoAnualMatch) {
        // Removendo a frase indesejada e espaços extras
        let faturamentoAnualTexto = faturamentoAnualMatch[1].replace("Faturamento Anual", "").trim();
        informacoes += `Faturamento Anual: ${faturamentoAnualTexto}\n\n`;
    }

    let perfilLinkedin = linkedinMatch ? linkedinMatch[0].split('?')[0] : "ainda não identificado";


    const resultadoTexto = `Chegou lead na fila Brasil para o @\nEmpresa: ${NomeDaEmpresa}\nWhatsapp: ${telefone}\nContato: ${NomeDoContato}\nInteresse: ${interesse}\n${origem} \n\n${informacoes}Perfil linkedin: \n${perfilLinkedin}\n--------------------------------------------------------\npróximo da fila é o @`;
    document.getElementById('resultado').textContent = resultadoTexto;
}

function copiarTexto() {
    const textoParaCopiar = document.getElementById('resultado').textContent;
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        mostrarPopUp('Texto copiado com sucesso!');
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        mostrarPopUp('Falha ao copiar texto.');
    });
}

document.getElementById('inputText').addEventListener('input', formatarLead);

// Garante que a formatação seja feita automaticamente ao carregar a página, se houver texto preenchido.
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('inputText').value) {
        formatarLead();
    }
});



function identificarInformacoesAdicionais() {
    const texto = document.getElementById('inputText').value;
    let informacoes = "";

    // Definindo as expressões regulares para cada tipo de informação
    const cnpjRegex = /CNPJ: (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i;
    const porteRegex = /icone Porte(.*?)icone Quantidade de Funcionários/s;
    const numeroFuncionariosRegex = /Quantidade de Funcionários(.*?)icone like/s;
    const faturamentoAnualRegex = /Faturamento Anual(.*?)icone like/s;

    // Procurando pelas informações no texto
    const cnpjMatch = texto.match(cnpjRegex);
    const porteMatch = texto.match(porteRegex);
    const numeroFuncionariosMatch = texto.match(numeroFuncionariosRegex);
    const faturamentoAnualMatch = texto.match(faturamentoAnualRegex);

    if (porteMatch) {
        const porteTexto = porteMatch[1].replace("Porte", "").trim();
        informacoes += `Porte da Empresa: ${porteTexto}\n`;
    }

    // Adicionando as informações encontradas na string de informacoes
    if (cnpjMatch) informacoes += `CNPJ: ${cnpjMatch[1]}\n`;

    if (numeroFuncionariosMatch) {
        // Removendo a frase indesejada e espaços extras
        let numeroFuncionariosTexto = numeroFuncionariosMatch[1].replace("Quantidade de Funcionários", "").trim();
        numeroFuncionariosTexto = numeroFuncionariosTexto.replace("funcionários", "").trim();
        informacoes += `Nº de Funcionários: ${numeroFuncionariosTexto}\n`;
    }
    if (faturamentoAnualMatch) {
        // Removendo a frase indesejada e espaços extras
        let faturamentoAnualTexto = faturamentoAnualMatch[1].replace("Faturamento Anual", "").trim();
        informacoes += `Faturamento Anual: ${faturamentoAnualTexto}`;
    }

    // Exibindo as informações
    document.getElementById('informacoesAdicionais').textContent = informacoes;
}

function copiarInformacoesAdicionais() {
    const textoParaCopiar = document.getElementById('informacoesAdicionais').textContent;
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        mostrarPopUp('Informações adicionais copiadas com sucesso!');
    }).catch(err => {
        console.error('Erro ao copiar informações adicionais: ', err);
        mostrarPopUp('Falha ao copiar informações adicionais.');
    });
}


function PesquisarLinkedin() {
    // Garante que os nomes estejam formatados antes da pesquisa
    formatarNome();
    formatarEmpresa();

    if (NomeDoContato && NomeDaEmpresa) {
        const query = `${NomeDoContato} ${NomeDaEmpresa} Linkedin`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    } else {
        mostrarPopUp("Nome do contato e/ou nome da empresa não identificados.");
    }
}

function SiteDaEmpresa() {
    formatarEmail(); // Isso garantirá que EmailDoContato esteja atualizado

    if (EmailDoContato) {
        const dominio = EmailDoContato.split('@')[1];
        const dominiosPessoais = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];

        if (!dominiosPessoais.includes(dominio.toLowerCase())) {
            const url = `http://${dominio}`;
            window.open(url, '_blank');
        } else {
            mostrarPopUp("O e-mail fornecido é pessoal.");
        }
    } else {
        mostrarPopUp("E-mail do contato não identificado.");
    }
}


function formatarTextoEspecial() {
    const texto = document.getElementById('inputText').value;
    // Suponha que você queira incluir informações similares, mas com um formato diferente
    const emailRegex = /E-mail: (.+)|Email: (.+)/i;
    const emailMatch = texto.match(emailRegex);

    /* const interesseRegex = /Necessidade: (.+)|Estou interessado em: (.+)/i;
     const interesseMatch = texto.match(interesseRegex); */


    let EmailFormatado = "";
    if (emailMatch) {
        // Captura o e-mail do match encontrado e converte para minúsculas
        EmailFormatado = (emailMatch[1] || emailMatch[2]).toLowerCase();
    } else {
        console.log("não informado.");
        EmailFormatado = "não informado";
    }


    // Identificação e formatação do assunto
    const éChatbot = /ChatBot <agencechatbot76@gmail.com>/i.test(texto);
    let assuntoFormatado = "";

    if (éChatbot) {
        assuntoFormatado = "Não há campo de assunto no chatbot.";
    } else {
        const assuntoRegex = /Comentários:\s*([\s\S]*?)\s*Agence/;
        const assuntoMatch = texto.match(assuntoRegex);
        if (assuntoMatch) {
            let assunto = assuntoMatch[1].trim();
            assunto = assunto.toLowerCase();
            assuntoFormatado = assunto.replace(/([.!?]\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
            assuntoFormatado = assuntoFormatado.charAt(0).toUpperCase() + assuntoFormatado.slice(1);
        } else {
            console.log("não encontrado.");
            assuntoFormatado = "não encontrado";
        }
    }


    TextoEspecial = `Chegou lead para você.\n\nContato: ${NomeDoContato}\nEmpresa: ${NomeDaEmpresa}\nE-mail: ${EmailFormatado}\nTelefone: ${TelefoneDoContato}\n${InteresseDoLead}\n${origemGlobal}\n\nAssunto: ${assuntoFormatado}`;

    // Atualizando o elemento HTML com o texto especial
    document.getElementById('detalhesLead').textContent = TextoEspecial;
}


function copiarTextoEspecial() {
    formatarTextoEspecial(); // Garante que o texto especial esteja atualizado
    navigator.clipboard.writeText(TextoEspecial).then(() => {
        mostrarPopUp('Texto especial copiado com sucesso!');
    }).catch(err => {
        console.error('Erro ao copiar o texto especial: ', err);
        mostrarPopUp('Falha ao copiar o texto especial.');
    });
}


function removerLinhasPorInicio(texto, iniciosParaRemover) {
    // Divide o texto em linhas para processamento
    let linhas = texto.split('\n');
    // Filtra as linhas, removendo aquelas que começam com algum dos inícios especificados
    linhas = linhas.filter(linha => !iniciosParaRemover.some(inicio => linha.startsWith(inicio)));
    // Reconstitui o texto com as linhas restantes
    return linhas.join('\n');
}

function removerTermosEspecificos(texto, termosParaRemover) {
    termosParaRemover.forEach(termo => {
        // Usando expressão regular para substituir o termo por uma string vazia globalmente, ignorando maiúsculas e minúsculas
        texto = texto.replace(new RegExp(termo, 'gi'), '');
    });
    return texto;
}

function ajustarQuebrasDeLinha(texto) {
    // Primeiro, substitui múltiplas quebras de linha por uma única quebra de linha
    // Segundo, remove linhas que contêm somente espaços ou são totalmente vazias
    return texto.replace(/\n+/g, '\n').replace(/^\s*$(?:\r\n?|\n)/gm, '');
}

function removerTextoAposTermos(texto, termos) {
    let indiceMinimo = texto.length;
    termos.forEach(termo => {
        const indice = texto.indexOf(termo);
        if (indice !== -1 && indice < indiceMinimo) {
            indiceMinimo = indice;
        }
    });
    return indiceMinimo !== texto.length ? texto.substring(0, indiceMinimo) : texto;
}


function FormatarLeadFaleCom(texto) {
    // Regexes e listas de exclusão para cada categoria
    const nomeRegexes = [
        /(?<=para:\s)(.*?)(?=\s<)/,
        /(?<=From: ')(.*?)(?=' via Falecom)/,
        /(?<=From: falecom@agence.com.br <falecom@agence.com.br> On Behalf Of )(.*?)(?=\r?\nSent:)/,
        /(?<=From: falecom@agence.com.br <falecom@agence.com.br> On Behalf Of )(.*?)(?=\nSent:)/,
    ];
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailsIgnorados = [
        "carlos.arruda@agence.cl",
        "ismael.batista@sp.agence.com.br",
        "falecom@agence.com.br",
        "pedro.catini@agence.com.br",
        "daniel.silva@sp.agence.com.br",
        "carlos.carvalho@agence.com.br",
        "danilo.camargo@sp.agence.com.br",
    ];
    const telefoneRegexes = [
        /\b(?:\+?(\d{1,3}))?[-. ]?(\d{2,3})[-. ]?(\d{4,5})[-. ]?(\d{4})\b/g,
        /\+\d{1,3}\s?\(\d{1,3}\)\s?\d{4,5}-\d{4}/g,
        /\+\d{1,3}\s?\(\d{1,3}\)\s?\d{3,4}-\d{4}/g,
    ];
    const telefonesIgnorados = [
        "+5512992117495",
        "+551121577514",
        "11987654321",
        "+56227998951",
        "+56974529257",
        "+551135542187",
    ];
    const assuntoRegexes = [
        /(?<=Subject: )([\s\S]*?)(?=\d{1,2} de \w+\. de \d{4}, \d{1,2}:\d{2})/,
        /(?<=Subject: )([\s\S]*?)(?=\n\n\n)/,
    ];

    // Variáveis de resultado
    let nomeFormatado = 'Nome não identificado';
    let emailFormatado = 'E-mail não informado';
    let telefoneFormatado = 'Telefone não informado';
    let assuntoFormatado = 'Campo de assunto não encontrado';

    // Processamento de nome
    for (const regex of nomeRegexes) {
        const nomeMatch = texto.match(regex);
        if (nomeMatch) {
            nomeFormatado = nomeMatch[0].split(' ')
                .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
                .join(' ');
            break;
        }
    }

    // Processamento de email
    const todosEmails = texto.match(emailRegex) || [];
    const emailsValidos = todosEmails.filter(email => !emailsIgnorados.includes(email.toLowerCase()));

    if (emailsValidos.length > 0) {
        emailFormatado = emailsValidos[0].toLowerCase();
    }

    // Processamento de telefone
    let todosTelefones = [];
    telefoneRegexes.forEach(regex => {
        const telefonesEncontrados = [...texto.matchAll(regex)].map(match => match[0]);
        todosTelefones = [...todosTelefones, ...telefonesEncontrados];
    });
    const telefonesValidos = todosTelefones.filter(telefone =>
        !telefonesIgnorados.includes(telefone.replace(/[-. ()]/g, ''))
    );
    if (telefonesValidos.length > 0) {
        telefoneFormatado = telefonesValidos[0];
    }

    // Processamento de assunto com lógica específica
    const iniciosParaRemoverAssunto = [
        "Ismael Borges Batista",
        // Adicione mais inícios para remover conforme necessário
    ];

    const termosParaRemoverAssunto = [
        // Adicione mais termos para remover conforme necessário
    ];

    const termosParaCorteAssunto = [
        "Atenciosamente",
        "Obrigado",
        "Obrigada",
        "obrigado",
        "obrigada",
        "[Mensagem cortada]",
        "Exibir toda a mensagem",
        // Adicione mais termos conforme necessário
    ];


    for (const regex of assuntoRegexes) {
        const assuntoMatch = texto.match(regex);
        if (assuntoMatch) {
            let assunto = assuntoMatch[0].trim();

            // Processamento adicional do assunto com lógica específica
            assunto = removerLinhasPorInicio(assunto, iniciosParaRemoverAssunto);
            assunto = removerTermosEspecificos(assunto, termosParaRemoverAssunto);
            assunto = ajustarQuebrasDeLinha(assunto);
            assunto = removerTextoAposTermos(assunto, termosParaCorteAssunto);

            assuntoFormatado = assunto.charAt(0).toUpperCase() + assunto.slice(1);
            break; // Garante que apenas o último assunto seja processado e formatado
        }
    }

    // Construção do texto formatado
    let textoFormatado = `Nome: ${nomeFormatado}\nEmpresa: \nEmail: ${emailFormatado}\nEstou interessado em: \nServiços de consultoria – Prototipagem\nDesenvolvimento de aplicativos móveis\nDesenvolvimento Web\ne-Commerce\nProfissionais de TI – Outsourcing\nProfissionais de TI – Headhunting\nRPA – Robotic Process Automation\n\nTelefone: ${telefoneFormatado}\nComentários: ${assuntoFormatado}\nAgence - Fale Conosco`;

    // Exibição do resultado e/ou outras ações
    textoFormatadoGlobal = textoFormatado; // Armazena o texto formatado na variável global

    // Retorno do texto formatado, caso necessário
    return textoFormatado;

}



function copiarLeadFaleComParaClipboard() {
    const texto = document.getElementById('inputText').value; // Obtém o texto de entrada
    FormatarLeadFaleCom(texto); // Formata o texto e atualiza a variável global

    // Verifica se o textoFormatadoGlobal não está vazio
    if (textoFormatadoGlobal !== "") {
        navigator.clipboard.writeText(textoFormatadoGlobal).then(() => {
            mostrarPopUp('Texto copiado para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar o texto do Lead FaleCom: ', err);
            mostrarPopUp('Falha ao copiar o texto do Lead FaleCom.');
        });
    } else {
        mostrarPopUp('Nenhum texto disponível para copiar.');
    }
}
