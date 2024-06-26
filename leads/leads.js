let NomeDoContato = "";
let NomeDaEmpresa = "";
let EmailDoContato = "";
let TextoLeadConsultor = ""; // Variável global para armazenar o texto especial
let EmailFormatado = '';
var textoFormatadoGlobal = ""; // Variável global para armazenar o texto formatado
let PromptGPTFormatado = '';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('inputText').addEventListener('input', function () {
        identificarInformacoesAutomaticamente(); // Função existente
        obterInformacoesEconodata();
        formatarTextoLeadConsultor(); // Chamada da função para formatar e exibir detalhes do lead
        formatarPromptGPT();
    });

    document.getElementById('copiarTextoEspecial').addEventListener('click', copiarTextoEspecial);
    document.getElementById('copiarLeadFaleCom').addEventListener('click', copiarLeadFaleComParaClipboard);
});



// Função interna para extrair e formatar o nome
function obterNomeDoContato(texto) {
    const nomeRegex = /Nome: (.+)|Name: (.+)/i;
    const nomeMatch = texto.match(nomeRegex);
    if (nomeMatch) {
        const nome = nomeMatch[1] || nomeMatch[2];
        return nome.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
    } else {
        return 'não informado';
    }
}


// Função interna para extrair e formatar a empresa
function obterEmpresa(texto) {
    const empresaRegex = /Empresa: (.+)|Enterprise: (.+)/i;
    const empresaMatch = texto.match(empresaRegex);
    if (empresaMatch) {
        const empresa = empresaMatch[1] || empresaMatch[2];

        // Regex para encontrar partes entre aspas simples
        const upperCaseParts = empresa.match(/'([^']+)'/g) || [];

        // Remover aspas simples e manter maiúsculas
        const upperCaseWords = upperCaseParts.map(part => part.replace(/'/g, ''));

        return empresa.split(' ').map(palavra => {
            // Verifica se a palavra está na lista de palavras que devem ficar em maiúsculas
            if (upperCaseWords.includes(palavra.replace(/'/g, ''))) {
                return palavra.replace(/'/g, '').toUpperCase();
            } else {
                return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
            }
        }).join(' ');
    } else {
        return 'não informado';
    }
}


// Função interna para extrair e formatar a localidade a partir do telefone
function obterLocalidade(texto) {
    const telefoneRegex = /Telefone:.*?(\d[\d\s().-]*)/i;
    const telefoneMatch = texto.match(telefoneRegex);

    let telefone = telefoneMatch ? telefoneMatch[1].replace(/\D/g, '') : null;
    if (telefone) {
        const telefoneFormatado = formatarTelefone(telefone);
        const localidade = telefoneFormatado.localidade;
        const ddd = telefoneFormatado.ddd;
        return ddd ? `${localidade}` : `${localidade}`;
    } else {
        return null;
    }
}

// Função interna para extrair o perfil do LinkedIn
function obterLinkedin(texto) {
    const linkedinRegex = /https:\/\/www\.linkedin\.com\/in\/[^/?\s]+/i;
    const linkedinMatch = texto.match(linkedinRegex);
    if (linkedinMatch) {
        return linkedinMatch[0].split('?')[0];
    } else {
        return "ainda não identificado";
    }
}

// Função principal que formata o nome
function copiarNome() {
    const texto = document.getElementById('inputText').value;
    const nomeFormatado = obterNomeDoContato(texto);
    if (nomeFormatado) {
        NomeDoContato = nomeFormatado;
        copiarParaClipboard(nomeFormatado);
    } else {
        copiarParaClipboard('Nome nao identificado');
        mostrarPopUp("Nome nao identificado");
    }
}

// Função principal que formata a empresa
function copiarEmpresa() {
    const texto = document.getElementById('inputText').value;
    const empresaFormatada = obterEmpresa(texto);
    if (empresaFormatada) {
        NomeDaEmpresa = empresaFormatada;
        copiarParaClipboard(empresaFormatada);
    } else {
        copiarParaClipboard('Sem informação');
        mostrarPopUp("Empresa não identificada.");
    }
}

// Função principal que formata a localidade
function copiarLocalidade() {
    const texto = document.getElementById('inputText').value;
    const localidadeTexto = obterLocalidade(texto);
    if (localidadeTexto) {
        copiarParaClipboard(localidadeTexto);
        mostrarPopUp("Localidade copiada com sucesso!");
    } else {
        copiarParaClipboard('Localidade não identificada.');
        mostrarPopUp("Localidade não identificada");
    }
}

// Função principal que formata o perfil do LinkedIn
function copiarLinkedin() {
    const texto = document.getElementById('inputText').value;
    const perfilLinkedin = obterLinkedin(texto);
    if (perfilLinkedin) {
        copiarParaClipboard(perfilLinkedin);
    } else {
        copiarParaClipboard('Linkedin não identificado.');
        mostrarPopUp("Linkedin não identificado");
    }
}

// Função para formatar o assunto internamente
function obterAssunto(texto) {
    // Encontrar a última ocorrência de "Agence"
    const ultimaOcorrenciaAgence = texto.lastIndexOf("Agence");
    if (ultimaOcorrenciaAgence === -1) {
        return 'não encontrado';
    }

    // Encontrar a ocorrência de "Comentários:" antes da última ocorrência de "Agence"
    const comentariosIndex = texto.lastIndexOf("Comentários:", ultimaOcorrenciaAgence);
    if (comentariosIndex === -1) {
        return 'não encontrado';
    }

    // Capturar o texto entre "Comentários:" e a última ocorrência de "Agence"
    const assunto = texto.substring(comentariosIndex + "Comentários:".length, ultimaOcorrenciaAgence).trim();

    // Formatar o texto capturado
    let assuntoFormatado = assunto.toLowerCase();
    assuntoFormatado = assuntoFormatado.replace(/([.!?]\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    assuntoFormatado = assuntoFormatado.replace("© 2024", "").trim();
    return assuntoFormatado.charAt(0).toUpperCase() + assuntoFormatado.slice(1);
}


// Função principal que usa a função interna para formatar o assunto
function copiarAssunto() {
    const texto = document.getElementById('inputText').value;
    const assuntoFormatado = obterAssunto(texto);
    if (assuntoFormatado) {
        copiarParaClipboard(assuntoFormatado);
        mostrarPopUp("Assunto formatado e copiado para a área de transferência");
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

// Função interna para extrair e formatar o e-mail
function obterEmail(texto) {
    const emailRegex = /E-mail: (.+)|Email: (.+)/i;
    const emailMatch = texto.match(emailRegex);
    if (emailMatch) {
        return (emailMatch[1] || emailMatch[2]).toLowerCase();
    } else {
        return 'não informado';
    }
}

// Função principal que formata o e-mail
function copiarEmail() {
    const texto = document.getElementById('inputText').value;
    const emailFormatado = obterEmail(texto);
    if (emailFormatado) {
        EmailDoContato = emailFormatado; // Atualiza a variável global corretamente
        EmailFormatado = emailFormatado; // Mantém esta linha se precisar do email formatado em minúsculas em outra parte do código
        copiarParaClipboard(emailFormatado);
    } else {
        copiarParaClipboard('email@email.com');
        mostrarPopUp("e-mail não encontrado.");
    }
}



function formatarTelefone(numeros) {
    const dddsBrasil = {
        "11": "São Paulo - SP",
        "12": "São José dos Campos - SP",
        "13": "Santos - SP",
        "14": "Bauru - SP",
        "15": "Sorocaba - SP",
        "16": "Ribeirão Preto - SP",
        "17": "São José do Rio Preto - SP",
        "18": "Presidente Prudente - SP",
        "19": "Campinas - SP",
        "21": "Rio de Janeiro - RJ",
        "22": "Campos dos Goytacazes - RJ",
        "24": "Volta Redonda - RJ",
        "27": "Vila Velha/Vitória - ES",
        "28": "Cachoeiro de Itapemirim - ES",
        "31": "Belo Horizonte - MG",
        "32": "Juiz de Fora - MG",
        "33": "Governador Valadares - MG",
        "34": "Uberlândia - MG",
        "35": "Poços de Caldas - MG",
        "37": "Divinópolis - MG",
        "38": "Montes Claros - MG",
        "41": "Curitiba - PR",
        "42": "Ponta Grossa - PR",
        "43": "Londrina - PR",
        "44": "Maringá - PR",
        "45": "Foz do Iguaçú - PR",
        "46": "Francisco Beltrão/Pato Branco - PR",
        "47": "Joinville - SC",
        "48": "Florianópolis - SC",
        "49": "Chapecó - SC",
        "51": "Porto Alegre - RS",
        "53": "Pelotas - RS",
        "54": "Caxias do Sul - RS",
        "55": "Santa Maria - RS",
        "61": "Brasília - DF",
        "62": "Goiânia - GO",
        "63": "Palmas - TO",
        "64": "Rio Verde - GO",
        "65": "Cuiabá - MT",
        "66": "Rondonópolis - MT",
        "67": "Campo Grande - MS",
        "68": "Rio Branco - AC",
        "69": "Porto Velho - RO",
        "71": "Salvador - BA",
        "73": "Ilhéus - BA",
        "74": "Juazeiro - BA",
        "75": "Feira de Santana - BA",
        "77": "Barreiras - BA",
        "79": "Aracaju - SE",
        "81": "Recife - PE",
        "82": "Maceió - AL",
        "83": "João Pessoa - PB",
        "84": "Natal - RN",
        "85": "Fortaleza - CE",
        "86": "Teresina - PI",
        "87": "Petrolina - PE",
        "88": "Juazeiro do Norte - CE",
        "89": "Picos - PI",
        "91": "Belém - PA",
        "92": "Manaus - AM",
        "93": "Santarém - PA",
        "94": "Marabá - PA",
        "95": "Boa Vista - RR",
        "96": "Macapá - AP",
        "97": "Coari - AM",
        "98": "São Luís - MA",
        "99": "Imperatriz - MA"
    };

    // Remover zeros à esquerda
    numeros = numeros.replace(/^0+/, '');

    // Remover o prefixo "55" se presente
    if (numeros.startsWith('55')) {
        numeros = numeros.substring(2);
    }

    // Verificar se os dois primeiros dígitos são um DDD válido
    const ddd = numeros.substring(0, 2);
    if (dddsBrasil.hasOwnProperty(ddd)) {
        const localidade = dddsBrasil[ddd];
        if (numeros.length === 10 || numeros.length === 11) {
            numeros = '55' + numeros;
            const formatado = '+' + numeros.substring(0, 2) + ' ' + numeros.substring(2, 4) + ' ' + numeros.substring(4);
            return { formatado, localidade, ddd };
        } else {
            return { formatado: numeros, localidade: "Número inválido", ddd: null };
        }
    } else {
        return { formatado: numeros, localidade: "DDD não reconhecido", ddd: null };
    }
}

// Função principal que usa a função interna para formatar o telefone
function copiarTelefone() {
    const texto = document.getElementById('inputText').value;
    const telefoneRegex = /Telefone:.*?(\d[\d\s().-]*)/i;
    const telefoneMatch = texto.match(telefoneRegex);

    if (telefoneMatch) {
        let numeros = telefoneMatch[1].replace(/\D/g, '');
        const resultado = formatarTelefone(numeros);

        copiarParaClipboard(resultado.formatado);
        mostrarPopUp(`Telefone formatado e copiado com sucesso! Localidade: ${resultado.localidade}`);
    } else {
        copiarParaClipboard('0000000000000');
        mostrarPopUp("Telefone não encontrado");
    }
}



// Função interna para identificar a origem
function obterOrigem(textoMinusculo) {
    if (textoMinusculo.includes("chatbot") || textoMinusculo.includes("inbound chatbot")) {
        return "Origem: Inbound Whatsapp / Chatbot";
    } else if (textoMinusculo.includes("© 2024 agence. todos os direitos reservados.")) {
        return "Origem: Formulário LP Mobile";
    } else if (textoMinusculo.includes("falecom@agence.com.br")) {
        return "Origem: Inbound E-mail";
    } else if (textoMinusculo.includes("fale conosco - agence")) {
        return "Origem: Formulário Fale Conosco";
    } else if (textoMinusculo.includes("origem: outbound e-mail") || textoMinusculo.includes("origem: outbound email")) {
        return "Origem: Outbound E-mail";
    } else if (textoMinusculo.includes("origem: outbound linkedin")) {
        return "Origem: Outbound Linkedin";
    } else if (textoMinusculo.includes("origem: outbound bdr")) {
        return "Origem: Outbound BDR";
    } else {
        return "Origem: não identificada";
    }
}

// Função interna para identificar o interesse
function obterInteresse(texto) {
    const necessidadeRegex = /Necessidade: (.+)/i;
    const interesseRegex = /Estou interessado em: (.+)/i;
    const necessidadeMatch = texto.match(necessidadeRegex);
    const interesseMatch = texto.match(interesseRegex);

    let interesse = "Interesse: não informado";

    if (necessidadeMatch) {
        interesse = "Interesse: " + necessidadeMatch[1];
    } else if (interesseMatch) {
        interesse = "Interesse: " + interesseMatch[1];
    } else if (texto.includes("© 2024 Agence. Todos os direitos reservados.")) {
        interesse = "Interesse: Desenvolvimento Mobile";
    }

    // Verifica se o interesse contém termos específicos
    if (interesse.toLowerCase().includes("rpa")) {
        interesse = "Interesse: Robotic Process Automation (RPA)";
    } else if (interesse.toLowerCase().includes("consultoria")) {
        interesse = "Interesse: Consultoria de Ti";
    } else if (interesse.toLowerCase().includes("aplicativo") || interesse.toLowerCase().includes("mobile")) {
        interesse = "Interesse: Desenvolvimento Mobile";
    } else if (interesse.toLowerCase().includes("headhunting")) {
        interesse = "Interesse: Headhunting de Ti";
    } else if (interesse.toLowerCase().includes("outsourcing")) {
        interesse = "Interesse: Outsourcing de Ti";
    }

    return interesse;
}

// Função interna para identificar o porte da empresa
function obterPorte(texto) {
    const porteRegex = /icone Porte(.*?)icone Quantidade de Funcionários/s;
    const porteMatch = texto.match(porteRegex);

    if (porteMatch && porteMatch[1]) {
        let porteTexto = porteMatch[1].replace("Porte", "").trim();
        return `Porte da Empresa: ${porteTexto}`;
    } else {
        return "Porte da Empresa: Pequeno"; // Valor padrão caso o porte não seja encontrado
    }
}

// Função principal que identifica as informações automaticamente
function identificarInformacoesAutomaticamente() {
    const texto = document.getElementById('inputText').value;
    const textoMinusculo = texto.toLowerCase();

    const origem = obterOrigem(textoMinusculo);
    const interesse = obterInteresse(texto);
    const porte = obterPorte(texto);

    // Exibe as informações capturadas nos elementos HTML correspondentes
    document.getElementById('origemLead').textContent = origem;
    document.getElementById('interesseLead').textContent = interesse;
    document.getElementById('porteLead').textContent = porte;
}



function formatarTextoLeadFilaA() {
    const texto = document.getElementById('inputText').value;
    const textoMinusculo = texto.toLowerCase();

    const NomeDoContato = obterNomeDoContato(texto)
    const NomeDaEmpresa = obterEmpresa(texto)

    const origem = obterOrigem(textoMinusculo);
    const interesse = obterInteresse(texto);

    const telefoneRegex = /Telefone:.*?(\d[\d\s().-]*)/i;
    const telefoneMatch = texto.match(telefoneRegex);
    let telefone = telefoneMatch ? telefoneMatch[1].replace(/\D/g, '') : "não informado";
    const telefoneFormatado = formatarTelefone(telefone);
    telefone = telefoneFormatado.formatado;
    const localidade = telefoneFormatado.localidade;
    const ddd = telefoneFormatado.ddd;

    let infoEconodata = obterEconodata(texto);

    // Verifica se infoEconodata não está vazia e adiciona espaços
    if (infoEconodata) {
        infoEconodata = `${infoEconodata}\n\n`;
    }

    let perfilLinkedin = obterLinkedin(texto)

    const localidadeTexto = ddd ? `\nDDD ${ddd}: ${localidade}` : ``;

    // Verifica se a origem contém a palavra "outbound"
    let nomeDaFila = "Fila A"; // Valor padrão
    if (origem.toLowerCase().includes("outbound")) {
        nomeDaFila = "Fila Outbound";
    }

    const resultadoTexto = `Chegou lead na ${nomeDaFila} para o @\n\nContato: ${NomeDoContato}\nEmpresa: ${NomeDaEmpresa}\nTelefone: ${telefone}${localidadeTexto}\n${interesse}\n${origem} \n\n${infoEconodata}Perfil linkedin: \n${perfilLinkedin}\n--------------------------------------------------------\npróximo da fila é o @`;
    document.getElementById('resultado').textContent = resultadoTexto;
}


function copiarTextoLeadFilaA() {
    const textoParaCopiar = document.getElementById('resultado').textContent;
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        mostrarPopUp('Texto copiado com sucesso!');
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        mostrarPopUp('Falha ao copiar texto.');
    });
}

document.getElementById('inputText').addEventListener('input', formatarTextoLeadFilaA);

// Garante que a formatação seja feita automaticamente ao carregar a página, se houver texto preenchido.
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('inputText').value) {
        formatarTextoLeadFilaA();
    }
});


// Função principal para obter todas as informações e retornar a string infoEconodata
function obterEconodata(texto) {
    let infoEconodata = "";

    // Definindo as expressões regulares para cada tipo de informação
    const cnpjRegex = /CNPJ: (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i;
    const porteRegex = /icone Porte(.*?)icone Quantidade de Funcionários/s;
    const numeroFuncionariosRegex = /Quantidade de Funcionários(.*?)icone like/s;
    const faturamentoAnualRegex = /Faturamento Anual(.*?)icone like/s;

    // Procurando pelo CNPJ no texto
    const cnpjMatch = texto.match(cnpjRegex);

    // Se o CNPJ for encontrado, adiciona as informações à string infoEconodata
    if (cnpjMatch) {
        infoEconodata += `CNPJ: ${cnpjMatch[1]}\n`;

        const porteMatch = texto.match(porteRegex);
        if (porteMatch) {
            const porteTexto = porteMatch[1].replace("Porte", "").trim();
            infoEconodata += `Porte da Empresa: ${porteTexto}\n`;
        }

        const numeroFuncionariosMatch = texto.match(numeroFuncionariosRegex);
        if (numeroFuncionariosMatch) {
            let numeroFuncionariosTexto = numeroFuncionariosMatch[1].replace("Quantidade de Funcionários", "").trim();
            numeroFuncionariosTexto = numeroFuncionariosTexto.replace("funcionários", "").trim();
            infoEconodata += `Número de Funcionários: ${numeroFuncionariosTexto}\n`;
        }

        const faturamentoAnualMatch = texto.match(faturamentoAnualRegex);
        if (faturamentoAnualMatch) {
            let faturamentoAnualTexto = faturamentoAnualMatch[1].replace("Faturamento Anual", "").trim();
            infoEconodata += `Faturamento Anual: ${faturamentoAnualTexto}`;
        }
    }

    return infoEconodata.trim();
}

// Função principal que identifica informações adicionais e exibe no HTML
function obterInformacoesEconodata() {
    const texto = document.getElementById('inputText').value;
    const infoEconodata = obterEconodata(texto);

    // Exibindo as informações
    document.getElementById('informacoesAdicionais').textContent = infoEconodata;
}

function copiarInformacoesEconodata() {
    const textoParaCopiar = document.getElementById('informacoesAdicionais').textContent;
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        mostrarPopUp('Econodata copiado');
    }).catch(err => {
        console.error('Erro ao copiar informações adicionais: ', err);
        mostrarPopUp('Falha ao copiar informações adicionais.');
    });
}


function PesquisarLinkedin() {
    const texto = document.getElementById('inputText').value;
    NomeDoContato = obterNomeDoContato(texto)
    NomeDaEmpresa = obterEmpresa(texto);

    if (NomeDoContato && NomeDaEmpresa) {
        const query = `${NomeDoContato} ${NomeDaEmpresa} Linkedin`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    } else {
        mostrarPopUp("Nome do contato e/ou nome da empresa não identificados.");
    }
}

function SiteDaEmpresa() {
    const texto = document.getElementById('inputText').value;
    EmailDoContato = obterEmail(texto); // Isso garantirá que EmailDoContato esteja atualizado

    if (EmailDoContato) {
        const dominio = EmailDoContato.split('@')[1];
        const dominiosPessoais = ['gmail.com', 'hotmail.com', 'icloud.com', 'yahoo.com', 'outlook.com', 'aol.com', 'mail.com', 'protonmail.com', 'zoho.com', 'gmx.com', 'yandex.com', 'fastmail', 'tutanota.com', 'terra.com.br', 'uol.com.br'];

        if (!dominiosPessoais.includes(dominio.toLowerCase())) {
            const url = `http://www.${dominio}`;
            window.open(url, '_blank');
            copiarParaClipboard("cnpj da " + dominio)
        } else {
            mostrarPopUp("O e-mail fornecido é pessoal");
        }
    } else {
        mostrarPopUp("E-mail do contato não identificado");
    }
}


function formatarTextoLeadConsultor() {
    const texto = document.getElementById('inputText').value;
    const textoMinusculo = texto.toLowerCase();

    const origem = obterOrigem(textoMinusculo);
    const interesse = obterInteresse(texto);

    const telefoneRegex = /Telefone:.*?(\d[\d\s().-]*)/i;
    const telefoneMatch = texto.match(telefoneRegex);

    let NomeDoContato = obterNomeDoContato(texto)
    let NomeDaEmpresa = obterEmpresa(texto)
    let EmailFormatado = obterEmail(texto)

    let assuntoFormatado = obterAssunto(texto)

    let telefone = telefoneMatch ? telefoneMatch[1].replace(/\D/g, '') : "não informado";
    const telefoneFormatado = formatarTelefone(telefone);
    telefone = telefoneFormatado.formatado;
    const localidade = telefoneFormatado.localidade;
    const ddd = telefoneFormatado.ddd;

    const localidadeTexto = ddd ? `\nDDD ${ddd}: ${localidade}` : ``;

    TextoLeadConsultor = `Chegou lead para você.\n\nContato: ${NomeDoContato}\nEmpresa: ${NomeDaEmpresa}\nE-mail: ${EmailFormatado}\nTelefone: ${telefone}${localidadeTexto}\n${interesse}\n${origem}\n\nAssunto: ${assuntoFormatado}`;

    // Atualizando o elemento HTML com o texto especial
    document.getElementById('detalhesLead').textContent = TextoLeadConsultor;
}


function copiarTextoLeadConsultor() {
    formatarTextoLeadConsultor(); // Garante que o texto especial esteja atualizado
    navigator.clipboard.writeText(TextoLeadConsultor).then(() => {
        mostrarPopUp('Texto copiado!');
    }).catch(err => {
        console.error('Erro ao copiar o texto especial: ', err);
        mostrarPopUp('Falha ao copiar o texto especial.');
    });
}


function formatarPromptGPT() {
    const texto = document.getElementById('inputText').value;
    const textoMinusculo = texto.toLowerCase();

    const origem = obterOrigem(textoMinusculo);

    let interesse = obterInteresse(texto);
    interesse = interesse.replace("Interesse: ", "")

    let NomeDaEmpresa = obterEmpresa(texto)
    let EmailFormatado = obterEmail(texto)

    let siteDaEmpresa = EmailFormatado.split("@")[1];
    siteDaEmpresa = "https://www." + siteDaEmpresa;

    let assuntoFormatado = obterAssunto(texto)

    PromptGPTFormatado = `Acesse o site ${siteDaEmpresa} e me traga um resumo do que essa empresa faz, seus principais serviços e principais clientes.

Além disso, e segundo meu contexto como potencial fornecedor de ${interesse}, e sabendo que é esse o serviço desejado por essa empresa, quais seriam as 5 melhores perguntas que posso fazer a eles nessa primeira reunião que terei com eles. Considere também que esse lead da empresa ${NomeDaEmpresa} chegou com o seguinte texto no formulário do fale conosco: "${assuntoFormatado}"

Quais são os principais clientes e concorrentes diretos da ${NomeDaEmpresa}? E o que estão fazendo de inovação nesse ramo que sou potencial fornecedor.

Por favor me dê isso tudo em português do Brasil, o texto deve ser formatado de forma limpa e direta, sem o uso de cabeçalhos ou marcadores especiais, sem qualquer tipo de aspas ou caracteres que possam dar problema em códigos de sistemas.`;

}


function copiarPromptGPT() {
    formatarPromptGPT(); // Garante que o texto especial esteja atualizado
    navigator.clipboard.writeText(PromptGPTFormatado).then(() => {
        mostrarPopUp('Texto copiado!');
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
    let nomeFormatado = '';
    let emailFormatado = '';
    let telefoneFormatado = '';
    let assuntoFormatado = `\n\nASSUNTO_FORMATADO\n`;

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
    let textoFormatado = `Nome: ${nomeFormatado}\nEmpresa: \nEmail: ${emailFormatado}\nEstou interessado em: \nTelefone: ${telefoneFormatado}\nComentários: ${assuntoFormatado}\nAgence - falecom@agence.com.br`;

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
