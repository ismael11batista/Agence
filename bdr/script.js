document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('inputText').addEventListener('input', extrairInformacoes);
    configurarBotoes();
});

let first_name = ''; // Variável global para armazenar o primeiro nome do contato
let company_name = ''; // Variável global para armazenar o nome da empresa
let time_in_position = '';
let position = '';
let NomeCompletoDoContato = '';

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
    }, 3000);
}

// Função auxiliar para tentar múltiplos regex
function tentarRegex(texto, regexes, valorPadrao) {
    for (let i = 0; i < regexes.length; i++) {
        const match = texto.match(regexes[i]);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return valorPadrao;
}

// Função auxiliar para ajustar strings duplicadas
function ajustarStringDuplicada(str) {
    // Divide a string ao meio
    const metade = Math.floor(str.length / 2);
    const primeiraMetade = str.substr(0, metade);
    const segundaMetade = str.substr(metade);

    // Verifica se as duas metades são iguais
    if (primeiraMetade === segundaMetade) {
        return primeiraMetade.trim(); // Retorna apenas uma das metades se forem iguais
    }
    return str.trim(); // Retorna a string original se não houver duplicação
}

// Função auxiliar para remover termos de tempo de trabalho da string
function removerTermosTempoTrabalho(str) {
    // Lista de termos a serem removidos
    const termosParaRemover = [" · Tempo integral", " · Tempo parcial", "Tempo integral · ", " - o momento · "];

    // Remove termos da string
    termosParaRemover.forEach(termo => {
        str = str.replace(termo, "");
    });

    return str.trim(); // Retorna a string ajustada
}


// Função auxiliar para remover termos indesejados do nome
function removerTermosIndesejadosDoNome(str) {
    // Lista de termos a serem removidos do nome
    const termosParaRemover = [
        ", #OPEN_TO_WORK",
        // Adicione mais termos indesejados aqui conforme necessário
        ", #DISPONÍVEL_PARA_TRABALHO",
        ", #PROCURANDO_OPORTUNIDADES",
        ", #DISPONIVEL"
    ];

    // Remove cada termo da string
    termosParaRemover.forEach(termo => {
        str = str.replace(termo, "");
    });

    return str.trim(); // Retorna a string ajustada
}


function extrairInformacoes() {
    const textoPerfil = document.getElementById('inputText').value;

    // Extração e ajustes com base nas funções tentarRegex e ajustarStringDuplicada
    const nomeRegexes = [
        /^\s*(.{3,})\r?\n\s*\1/m,
        /Imagem de fundo\n(.+?)\n/,
        /\n(.+?) \n.+?\n\s * Conexão de \dº grau /

    ];

    let nomeCompleto = tentarRegex(textoPerfil, nomeRegexes, "NOME_DO_CONTATO");
    nomeCompleto = removerTermosIndesejadosDoNome(nomeCompleto); // Aplica a remoção de termos indesejados
    document.getElementById('nomeContato').textContent = `Nome do Contato: ${nomeCompleto}`;

    NomeCompletoDoContato = nomeCompleto

    // Extração do primeiro nome a partir do nome completo
    const primeiroNomeRegex = /^\w+/;
    const primeiroNomeMatch = nomeCompleto.match(primeiroNomeRegex);
    first_name = primeiroNomeMatch ? primeiroNomeMatch[0] : "PRIMEIRO_NOME";


    const cargoRegexes = [
        /Experiência\n.+?\n(.+?)\n/,
        /\n\s*Conexão de \dº grau\dº\n(.+?)\n\n/,
        /Experiência\n.+?\n(.+?)\n/
    ];
    position = ajustarStringDuplicada(tentarRegex(textoPerfil, cargoRegexes, "CARGO_DO_CONTATO"));
    document.getElementById('ultimoCargo').textContent = `Último Cargo: ${position}`;

    const empresaRegexes = [
        /Conexão de \dº grau\dº\n.+\n\n(.+?)\n/,
        /\n\s*Conexão de \dº grau\dº\n.+?\n\n(.+?)\n/,
        /Experiência\n.+?\n.+?\n(.+?)\n/
    ];

    company_name = ajustarStringDuplicada(tentarRegex(textoPerfil, empresaRegexes, "EMPRESA_DO_CONTATO"));
    company_name = removerTermosTempoTrabalho(company_name); // Aplica a remoção dos termos especificados
    document.getElementById('ultimaEmpresa').textContent = `Última Empresa: ${company_name}`;

    const duracaoRegexes = [
        /- o momento · (\d+ anos? \d+ meses?|\d+ meses?|\d+ anos?)/,
        /(\d+ anos? \d+ meses?|\d+ meses?|\d+ anos?)\s+/,
        /Experiência\n.+?\n.+?\n.+?\n(\d+ anos? \d+ meses?|\d+ meses?|\d+ anos?)/,
        /- o momento · (\d+ anos? \d+ meses?|\d+ meses?|\d+ anos?)/
    ];
    time_in_position = tentarRegex(textoPerfil, duracaoRegexes, "DURAÇÃO_NÃO_ENCONTRADA");
    document.getElementById('duracaoExperiencia').textContent = `Duração da Última Experiência: ${time_in_position}`;
}


function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarPopUp("Informação copiada com sucesso!");
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        mostrarPopUp("Erro ao copiar texto.");
    });
}



function copiarNome() {
    const nome = document.getElementById('nomeContato').textContent.split(": ")[1];
    copiarParaClipboard(nome);
}

function copiarCargo() {
    const cargo = document.getElementById('ultimoCargo').textContent.split(": ")[1];
    copiarParaClipboard(cargo);
}

function copiarEmpresa() {
    const empresa = document.getElementById('ultimaEmpresa').textContent.split(": ")[1];
    copiarParaClipboard(empresa);
}

function copiarDuracao() {
    const duracao = document.getElementById('duracaoExperiencia').textContent.split(": ")[1];
    copiarParaClipboard(duracao);
}

function copiarTudo() {
    const nome = document.getElementById('nomeContato').textContent.split(": ")[1];
    const cargo = document.getElementById('ultimoCargo').textContent.split(": ")[1];
    const empresa = document.getElementById('ultimaEmpresa').textContent.split(": ")[1];
    const duracao = document.getElementById('duracaoExperiencia').textContent.split(": ")[1];
    const todasInformacoes = `Nome: ${nome}\nCargo: ${cargo}\nEmpresa: ${empresa}\nDuração: ${duracao}`;
    copiarParaClipboard(todasInformacoes);
}


function copiarLead() {
    copiarParaClipboard(`Chegou lead na fila BR para o \nNome da empresa: ${company_name}\nWhatsapp: Não informado\nContato: ${NomeCompletoDoContato}\nEmail: \nOrigem: Outbound Linkedin\n\nPerfil linkedin:\n\n--------------------------------------------------------
próximo da fila é o @`);
}


function configurarBotoes() {
    document.getElementById('copiarNome').addEventListener('click', copiarNome);
    document.getElementById('copiarCargo').addEventListener('click', copiarCargo);
    document.getElementById('copiarEmpresa').addEventListener('click', copiarEmpresa);
    document.getElementById('copiarDuracao').addEventListener('click', copiarDuracao);
    document.getElementById('copiarTudo').addEventListener('click', copiarTudo);
    document.getElementById('copiarLead').addEventListener('click', copiarLead);


    var selectField = document.getElementById("selectField");
    var list = document.getElementById("list");
    var arrowIcon = document.getElementById("arrowIcon");
    var options = document.getElementsByClassName("options");

    selectField.onclick = function () {
        list.classList.toggle("hide");
        arrowIcon.classList.toggle("rotate");
    }

    Array.from(options).forEach(function (element) {
        element.onclick = function () {
            document.getElementById("selectText").textContent = this.textContent;
            list.classList.add("hide");
            arrowIcon.classList.toggle("rotate");
            document.getElementById("buttonsContainer").classList.remove("hide");
            displayButtons(this.textContent);
        }
    });

    function displayButtons(selection) {
        var CFButtons = document.getElementById("CFButtons");
        var RSButtons = document.getElementById("RSButtons");
        var LeanButtons = document.getElementById("LeanButtons");
        var FabricaButtons = document.getElementById("FabricaButtons");
        var OtherButtons = document.getElementById("OtherButtons");


        CFButtons.classList.add("hide");
        RSButtons.classList.add("hide");
        LeanButtons.classList.add("hide");
        FabricaButtons.classList.add("hide");
        OtherButtons.classList.add("hide");


        if (selection === "Carlos Flávio R&S") {
            CFButtons.classList.remove("hide");
        } else if (selection === "R&S") {
            RSButtons.classList.remove("hide");
        } else if (selection === "Lean") {
            LeanButtons.classList.remove("hide");
        } else if (selection === "Fábrica") {
            FabricaButtons.classList.remove("hide");
        } else if (selection === "Outros") {
            OtherButtons.classList.remove("hide");
        }

    }

    configurarBotoesEspecificos();
}



function configurarBotoesEspecificos() {
    // Adicione aqui a configuração específica de botões para R&S, Lean, Fábrica, etc.
    // Exemplo: Configuração para os botões de R&S

    // Speech Conexão RS CARLOS FLAVIO
    document.getElementById('copiarTextoRSConexaoCF').addEventListener('click', function () {
        copiarParaClipboard(`Olá ${first_name}, vi que você já atua no cargo ${position} há ${time_in_position}. Parabéns! Meu nome é Carlos, sou CEO da Agence e acredito que uma parceria entre nossas empresas seria ótimo. O que acha de conversarmos sobre como a Agence pode ajudar vocês na área de tecnologia?`);
    });


    //Speech do Email 1 para CARLOS FLAVIO Recrutamento e Seleção
    document.getElementById('copiarTextoRSCF1').addEventListener('click', function () {
        copiarParaClipboard(`Transforme Sua Equipe de TI com os Melhores Talentos do Mercado
${first_name},

Meu nome é Carlos Flávio, CEO na Agence. Percebemos que o sucesso de equipes de TI, especialmente em empresas como a ${company_name}, depende da habilidade de atrair talentos. Por isso, gostaria de compartilhar como nosso serviço especializado de headhunting pode ser um diferencial para vocês.

Nosso Processo Único:

🔹Entendimento Aprofundado: Iniciamos com uma análise detalhada das necessidades de TI e da cultura da sua empresa.
🔹Rede Exclusiva de Talentos: Acessamos uma rede diversificada de profissionais de TI, muitos dos quais estão exclusivamente conosco (mais de 15 mil profissionais avaliados em nossa base de dados).
🔹Seleção Rigorosa: Combinamos técnicas avançadas de avaliação e entrevistas profundas, além de muita tecnologia aplicada aos processos, para garantir não só competência técnica, mas também alinhamento cultural.
🔹Acompanhamento Contínuo: Após a contratação, oferecemos suporte para garantir uma integração bem - sucedida.
        
Estamos confiantes de que podemos ajudar a ${company_name} a alcançar novos patamares em inovação e desempenho de TI. 
        
Seria possível agendar uma breve reunião para discutir como podemos contribuir especificamente para seus objetivos ?

Agradeço pela atenção e aguardo a oportunidade de conversarmos mais.

Atenciosamente,`);

    });


    // Speech Email 2 RS  CARLOS FLAVIO 
    document.getElementById('copiarTextoRSCF2').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},

Espero que tenha encontrado nossa introdução ao serviço de headhunting da Agence útil. Acredito que uma parceria entre nossas organizações pode trazer resultados significativos para a ${company_name}, especialmente em um momento tão crucial para a inovação tecnológica.

Gostaria de oferecer um resumo conciso de como podemos trabalhar juntos para atender às suas necessidades específicas:

🔹Análise Competitiva do Mercado: Insights essenciais sobre tendências de recrutamento e remuneração no setor de TI;
🔹Processo Ágil: Adaptação rápida para atender às suas necessidades urgentes, mantendo o foco na qualidade;
🔹Parceria Estratégica: Comprometemo-nos a ser mais do que um fornecedor, mas um verdadeiro parceiro para o crescimento contínuo da sua equipe de TI.
            
Entendo que escolher o parceiro certo para headhunting é uma decisão importante. Por isso, gostaria de sugerir um bate-papo rápido de 20 minutos para discutir como a Agence pode ajudar especificamente a ${company_name}. Na próxima semana, terça-feira às 10h ou quinta-feira às 15h seriam convenientes para você?

Agradeço a oportunidade de potencialmente trabalhar com você e aguardo ansiosamente a chance de discutir como podemos contribuir para o sucesso contínuo da ${company_name}.`);
    });


    // Speech Pedido Reuniao RS CARLOS FLAVIO 
    document.getElementById('copiarPedidoReuniaoRSCF').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}. Obrigado pela conexão!

Vi que você atua na ${company_name} e resolvi chamar, vejo uma oportunidade para otimizarmos seus processos através de nossa tecnologia. Que tal uma breve reunião para discutir possibilidades?

Aguardo seu retorno.`);
    });


    // Speech Follow Up 1 RS CARLOS FLAVIO  
    document.getElementById('copiarFollowUp1RSCF').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}, você teve a oportunidade de ler as minhas mensagens anteriores?
        
Qual a sua disponibilidade para analisarmos seus processos e o que poderíamos automatizar e/ou sistematizar na sua empresa?`);
    });


    // Speech Follow Up 2 RS CARLOS FLAVIO  
    document.getElementById('copiarFollowUp2RSCF').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}, você teve a oportunidade de ler minhas mensagens anteriores?

Entendo que o desafio de manter a competitividade no mercado atual exige soluções inovadoras e eficientes. É aqui que a Agence pode se tornar seu braço de tecnologia.

Qual a sua disponibilidade para analisarmos seus processos e o que poderíamos automatizar e/ou sistematizar na sua empresa?`);
    });





    // Speech Conexão RS 
    document.getElementById('copiarTextoRSConexao').addEventListener('click', function () {
        copiarParaClipboard(`Olá ${first_name}, vi que você já atua no cargo ${position} há ${time_in_position}. Parabéns! Meu nome é Carlos, sou CEO da Agence e acredito que uma parceria entre nossas empresas seria ótimo. O que acha de conversarmos sobre como a Agence pode ajudar vocês na área de tecnologia?`);
    });


    //Speech do Email 1 para Recrutamento e Seleção
    document.getElementById('copiarTextoRS1').addEventListener('click', function () {
        copiarParaClipboard(`Transforme Sua Equipe de TI com os Melhores Talentos do Mercado
${first_name},

Meu nome é Carlos Flávio, CEO na Agence. Percebemos que o sucesso de equipes de TI, especialmente em empresas como a ${company_name}, depende da habilidade de atrair talentos. Por isso, gostaria de compartilhar como nosso serviço especializado de headhunting pode ser um diferencial para vocês.
        
Nosso Processo Único:
        
🔹Entendimento Aprofundado: Iniciamos com uma análise detalhada das necessidades de TI e da cultura da sua empresa.
🔹Rede Exclusiva de Talentos: Acessamos uma rede diversificada de profissionais de TI, muitos dos quais estão exclusivamente conosco (mais de 15 mil profissionais avaliados em nossa base de dados).
🔹Seleção Rigorosa: Combinamos técnicas avançadas de avaliação e entrevistas profundas, além de muita tecnologia aplicada aos processos, para garantir não só competência técnica, mas também alinhamento cultural.
🔹Acompanhamento Contínuo: Após a contratação, oferecemos suporte para garantir uma integração bem - sucedida.
        
Estamos confiantes de que podemos ajudar a ${company_name} a alcançar novos patamares em inovação e desempenho de TI. 
        
Seria possível agendar uma breve reunião para discutir como podemos contribuir especificamente para seus objetivos ?

Agradeço pela atenção e aguardo a oportunidade de conversarmos mais.

Atenciosamente,`);

    });


    // Speech Email 2 RS 
    document.getElementById('copiarTextoRS2').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},

Espero que tenha encontrado nossa introdução ao serviço de headhunting da Agence útil. Acredito que uma parceria entre nossas organizações pode trazer resultados significativos para a ${company_name}, especialmente em um momento tão crucial para a inovação tecnológica.
        
Gostaria de oferecer um resumo conciso de como podemos trabalhar juntos para atender às suas necessidades específicas:
        
🔹Análise Competitiva do Mercado: Insights essenciais sobre tendências de recrutamento e remuneração no setor de TI;
🔹Processo Ágil: Adaptação rápida para atender às suas necessidades urgentes, mantendo o foco na qualidade;
🔹Parceria Estratégica: Comprometemo-nos a ser mais do que um fornecedor, mas um verdadeiro parceiro para o crescimento contínuo da sua equipe de TI.
        
Entendo que escolher o parceiro certo para headhunting é uma decisão importante. Por isso, gostaria de sugerir um bate-papo rápido de 20 minutos para discutir como a Agence pode ajudar especificamente a ${company_name}. Na próxima semana, terça-feira às 10h ou quinta-feira às 15h seriam convenientes para você?
        
Agradeço a oportunidade de potencialmente trabalhar com você e aguardo ansiosamente a chance de discutir como podemos contribuir para o sucesso contínuo da ${company_name}.`);
    });


    // Speech Pedido Reuniao RS
    document.getElementById('copiarPedidoReuniaoRS').addEventListener('click', function () {
        copiarParaClipboard(`Boa tarde, ${first_name}. Tudo bem? Obrigado pela conexão!

Sou Carlos, CEO da Agence Consultoria. Vi que você atua na ${company_name} e resolvi chamar, vejo uma oportunidade para otimizarmos seus processos de RH através de nossa tecnologia. Que tal uma breve reunião para discutir possibilidades?

Aguardo seu retorno.`);
    });


    // Speech Follow Up 1 Lean
    document.getElementById('copiarFollowUp1RS').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}, entendo que todos temos agendas cheias, mas acredito sinceramente no valor que podemos trazer para sua empresa. Você teria disponibilidade para uma conversa rápida nos próximos dias?`);
    });


    // Speech Follow Up 2 Lean
    document.getElementById('copiarFollowUp2RS').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}, você teve a oportunidade de ler minhas mensagens anteriores?

Entendo que o desafio de manter a competitividade no mercado atual exige soluções inovadoras e eficientes. É aqui que a Agence pode se tornar seu braço de tecnologia.

Qual a sua disponibilidade para analisarmos seus processos e o que poderíamos automatizar e/ou sistematizar na sua empresa?`);
    });



    // Configuração para os botões de Lean
    // Speech Conexão Lean
    document.getElementById('copiarTextoLeanConexao').addEventListener('click', function () {
        copiarParaClipboard(`Olá ${first_name}, vi que você já atua no cargo ${position} há ${time_in_position}. Parabéns! Meu nome é Carlos, sou CEO da Agence e acredito que uma parceria entre nossas empresas seria ótimo. O que acha de conversarmos sobre como a Agence pode ajudar vocês na área de tecnologia?`);
    });



    // Speech Email 1 Lean 
    document.getElementById('copiarTextoLean1').addEventListener('click', function () {
        copiarParaClipboard(`Agence & ${company_name} - Melhoria contínua
${first_name}, 
          
Como ${position}, você deve valorizar a inovação e a eficiência operacional. Em nossa análise, notamos que ${company_name} já implementa estratégias de melhoria contínua, o que é ótimo. Contudo, percebemos uma oportunidade de elevar ainda mais o êxito da sua operação: a Automação de Processos Robóticos (RPA) para otimizar as operações repetitivas e desenvolvimento de sistemas Web/Mobile sob medida.

Esses serviços podem não só acelerar a execução de tarefas mas também liberar sua equipe para focar em atividades de maior valor agregado, aumentando a produtividade e reduzindo custos operacionais de forma significativa.

Qual a sua disponibilidade para marcarmos um bate papo a respeito?`);
    });


    // Speech Email 2 Lean 
    document.getElementById('copiarTextoLean2').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}, você teve a oportunidade de ler o e-mail abaixo?

Entendo que o desafio de manter a competitividade no mercado atual exige soluções inovadoras e eficientes. É aqui que a Agence pode se tornar seu braço de tecnologia.
        
Qual a sua disponibilidade para analisarmos seus processos e o que poderíamos automatizar e/ou sistematizar na sua empresa?`);
    });



    // Speech Pedido Reuniao Lean
    document.getElementById('copiarPedidoReuniaoLean').addEventListener('click', function () {
        copiarParaClipboard(`Boa tarde, ${first_name}. Tudo bem? Obrigado pela conexão!

Sou Carlos, CEO da Agence Consultoria. Vi que você atua na ${company_name} e resolvi chamar, vejo uma oportunidade para otimizarmos seus processos através de nossa tecnologia. Que tal uma breve reunião para discutir possibilidades?
        
Aguardo seu retorno.`);
    });



    // Speech Follow Up 1 Lean
    document.getElementById('copiarFollowUp1Lean').addEventListener('click', function () {
        copiarParaClipboard(`Olá, ${first_name}, espero que esteja tendo um bom dia. Notei que talvez não tenha visto minha última mensagem sobre como a Agence pode auxiliar a ${company_name} a otimizar seus processos. Posso agendar alguns minutos para conversarmos sobre isso?`);
    });


    // Speech Follow Up 2 Lean
    document.getElementById('copiarFollowUp2Lean').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}, você teve a oportunidade de ler as minhas mensagens anteriores?

Entendo que o desafio de manter a competitividade no mercado atual exige soluções inovadoras e eficientes. É aqui que a Agence pode se tornar seu braço de tecnologia.
        
Qual a sua disponibilidade para analisarmos seus processos e o que poderíamos automatizar e/ou sistematizar na sua empresa?`);
    });


    // Configuração para os botões de Fábrica

    // Speech Conexão Fábrica
    document.getElementById('copiarTextoFabricaConexao').addEventListener('click', function () {
        copiarParaClipboard(`Olá ${first_name}, vi que você já atua no cargo ${position} há ${time_in_position}. Parabéns! Meu nome é Carlos, sou CEO da Agence e acredito que uma parceria entre nossas empresas seria ótimo. O que acha de conversarmos sobre como a Agence pode ajudar vocês na área de tecnologia?`);
    });

    // Speech Email 1 Fábrica
    document.getElementById('copiarTextoFabrica1').addEventListener('click', function () {
        copiarParaClipboard(`Transforme Seus Desafios de TI em Soluções Inovadoras com a Agence
${first_name},
        
Meu nome é Carlos Arruda, e, como CEO na Agence, faço parte de uma equipe com mais de 24 anos de experiência em fornecer soluções de TI inovadoras para grandes empresas.
        
No dinâmico mundo da tecnologia, sabemos que estar à frente da concorrência significa não apenas adotar tecnologias avançadas, mas também aplicar a expertise necessária para integrá-las efetivamente aos seus processos de negócios. Aqui na Agence, nos especializamos exatamente nisso - transformar desafios complexos de TI em soluções eficientes e personalizadas.
        
Nossa abordagem no Desenvolvimento de Software Personalizado se concentra em:
🔹Soluções Sob Medida: Entendemos que cada negócio é único. Por isso, criamos soluções de software que se alinham perfeitamente com seus objetivos específicos, integrando-se de forma harmoniosa aos seus processos de negócios.
🔹Equipe de Desenvolvimento Experiente: Nossa equipe é composta por desenvolvedores altamente qualificados e criativos, prontos para transformar suas ideias mais ousadas em realidade.
🔹Compromisso com a Excelência: Estamos comprometidos em entregar projetos com a mais alta qualidade, dentro do prazo e do orçamento, assegurando que as soluções não apenas atendam, mas superem suas expectativas.
🔹Gestão e transparência: todo cliente recebe acesso ao portal do cliente, onde consegue visualizar diariamente como está o andamento do projeto.
        
Entendemos a importância de soluções que não apenas resolvam problemas, mas também impulsionem o crescimento e a inovação.
        
Por isso, gostaria de sugerir um bate-papo rápido de 20 minutos para discutir como a Agence pode ajudar especificamente a ${company_name}. Na próxima semana, terça-feira às 10h ou às 15h seriam convenientes para você?
        
Atenciosamente,`);
    });


    // Speech Email 2 Fábrica
    document.getElementById('copiarTextoFabrica2').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},

Recentemente, compartilhei com você como nossas soluções de Desenvolvimento de Software Personalizado podem ajudar a ${company_name} a superar desafios de TI e impulsionar o crescimento. Hoje, gostaria de apresentar outra dimensão de nossos serviços que pode ser igualmente valiosa para sua organização: o Outsourcing de Profissionais de Tecnologia.
        
No caso, o Outsourcing de TI da Agence oferece:
🔹 Talento sob Demanda: Tenha acesso a uma ampla gama de profissionais de TI altamente qualificados para atender às suas necessidades específicas, seja para projetos de curto ou longo prazo.
🔹Redução de Custos e Complicações Operacionais: Diminua os custos operacionais associados à contratação e treinamento de novos funcionários. Nós cuidamos disso para você, permitindo que você se concentre no core business.
🔹Flexibilidade e Escalabilidade: Ajuste rapidamente a sua equipe de acordo com as demandas do projeto, garantindo eficiência e adaptabilidade às mudanças do mercado.
        
Nosso objetivo é oferecer soluções de TI que não apenas atendam às suas necessidades atuais, mas que também proporcionem a flexibilidade para se adaptar e crescer no futuro. Com o Outsourcing de TI da Agence, você pode esperar um serviço que complementa e amplia as capacidades do seu departamento de TI.
        
Por isso, gostaria de sugerir uma reunião breve, virtual mesmo, para discutir como podemos ajudar a ${company_name}. Esta conversa seria uma chance para explorar possibilidades. Como está sua disponibilidade?
        
Atenciosamente,`);
    });




    // Speech Pedido Reuniao Fabrica
    document.getElementById('copiarPedidoReuniaoFabrica').addEventListener('click', function () {
        copiarParaClipboard(`Boa tarde, ${first_name}. Tudo bem? Obrigado pela conexão!

Sou Carlos, CEO da Agence Consultoria. Vi que você atua na ${company_name} e resolvi chamar, vejo uma oportunidade para otimizarmos seus processos através de nossa tecnologia. Que tal uma breve reunião para discutir possibilidades?
                
Aguardo seu retorno.`);
    });



    // Speech Follow Up 1
    document.getElementById('copiarFollowUp1').addEventListener('click', function () {
        copiarParaClipboard(`Olá, ${first_name}, espero que esteja tendo um bom dia. Notei que talvez não tenha visto minha última mensagem sobre como a Agence pode auxiliar a ${company_name} a otimizar seus processos. 
        
Posso agendar alguns minutos para conversarmos sobre isso?`);
    });


    // Speech Follow Up 2
    document.getElementById('copiarFollowUp2').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}, você teve a oportunidade de ler minhas mensagens anteriores?

Entendo que o desafio de manter a competitividade no mercado atual exige soluções inovadoras e eficientes. É aqui que a Agence pode se tornar seu braço de tecnologia.
        
Qual a sua disponibilidade para analisarmos seus processos e o que poderíamos automatizar e/ou sistematizar na sua empresa?`);
    });



    //INICIO DOS BOTÕES PARA O CAMPO "OUTROS"
    // Speech Pediu nosso Portfólio
    document.getElementById('copiarTextoPediuPortfólio').addEventListener('click', function () {
        copiarParaClipboard(`Olá, ${first_name}.

Agradeço por ter dedicado um momento para considerar nossa proposta. Aqui está um breve resumo dos serviços que a Agence oferece.
        
1. Consultoria de Requisitos com Prototipagem High Definition (HTML5);
2. Desenvolvimento de Sistemas Web:
    a. PHP
    b. Ruby on Rails
    c. Python
    d. Java
    e. Node.JS
        f. .Net C#
3. Desenvolvimento de Apps Mobile:
        a. iOS Object C / Swift
        b. Android Java / Kotlin
        c. Google Flutter
4. Outsourcing de profissionais de TI;
5. Headhunting de profissionais de TI;
6. RPA;
7. Plataforma de Assinatura Digital (https://www.e-digital.global/pt/)

Estou à disposição para agendar uma apresentação remota, onde podemos discutir mais profundamente como a Agence pode contribuir com o sucesso da sua organização.`);
    });



    // Speech Contato Sem Interesse
    document.getElementById('copiarTextoSemInteresse').addEventListener('click', function () {
        copiarParaClipboard(`Certo ${first_name}, sem problemas.

Entendo completamente, ${first_name}. Agradeço por ter dedicado um momento para considerar nossa proposta.

Apenas para sua referência futura, aqui está um breve resumo dos serviços que a Agence oferece. Ficaríamos felizes em ajudar caso surja uma necessidade:

    1. Consultoria de Requisitos com Prototipagem High Definition (HTML5);
    2. Desenvolvimento de Sistemas Web:
        a. PHP
        b. Ruby on Rails
        c. Python
        d. Java
        e. Node.JS
            f. .Net C#
    3. Desenvolvimento de Apps Mobile:
            a. iOS Object C / Swift
            b. Android Java / Kotlin
            c. Google Flutter
    4. Outsourcing de profissionais de TI;
    5. Headhunting de profissionais de TI;
    6. RPA;
    7. Plataforma de Assinatura Digital (https://www.e-digital.global/pt/)

Agradeço novamente pelo seu tempo e esteja à vontade para entrar em contato conosco no futuro, caso veja uma oportunidade para trabalharmos juntos.

Atenciosamente,`);
    });


    // Speech Texto Material Apresentação
    document.getElementById('copiarTextoMaterialApresentação').addEventListener('click', function () {
        copiarParaClipboard(`Olá, ${first_name},

Como mencionei durante nossa conversa no LinkedIn, gostaria de compartilhar com você uma introdução aos serviços e soluções que a Agence oferece. Para facilitar, anexei a este e-mail uma versão enxuta de nossa apresentação, ideal para uma visualização rápida e compartilhamento por e-mail.

Entretanto, nossa apresentação completa é mais interativa e detalhada, sendo idealmente conduzida de forma remota, com o compartilhamento de tela, para que possamos explorar juntos as nuances de nossas soluções e como elas podem se alinhar às suas necessidades específicas.

Aqui está um resumo do nosso portfólio de serviços, que visa abordar diversos desafios de TI e promover a inovação dentro das organizações:

    1. Consultoria de Requisitos com Prototipagem High Definition(HTML5);
    2. Desenvolvimento de Sistemas Web, abrangendo:
        a. PHP
        b. Ruby on Rails
        c. Python
        d. Java
        e. Node.JS
        f. .Net C#
    3. Desenvolvimento de Apps Mobile, incluindo:
        a. iOS (Object C / Swift)
        b. Android (Java / Kotlin)
        c. Google Flutter
    4. Outsourcing de Profissionais de TI;
    5. Headhunting de Profissionais de TI;
    6. Automação de Processos Robóticos (RPA);
    7. Plataforma de Assinatura Digital (https://www.e-digital.global/pt/).

Para mais informações, convido você a visitar nosso site: www.agence.global ou www.agence.com.br.

Estou à disposição para agendar uma apresentação remota, onde podemos discutir mais profundamente como a Agence pode contribuir com o sucesso da sua organização. 

Agradeço o seu tempo e fico no aguardo do seu retorno.

Atenciosamente,`);
    });


    // Speech Texto Conectou Pessoa Aderente
    document.getElementById('copiarTextoConectouPessoaAderente').addEventListener('click', function () {
        copiarParaClipboard(`Olá NOME_DO_RESPONSÁVEL,

Sou Felipe Santos da Agence. Recebi sua indicação através do NOME_DE_QUEM_INDICOU para discutir possíveis colaborações entre a Agence e a COMPANY_NAME, especialmente em áreas relacionadas à melhoria contínua e inovação tecnológica.

Na Agence, temos um histórico robusto de ajudar empresas a maximizar sua eficiência operacional e inovar em seus processos através de soluções tecnológicas personalizadas, incluindo Automação de Processos Robóticos (RPA) e desenvolvimento de sistemas Web/Mobile.

Estou ansioso para explorar como podemos colaborar e trazer valor à COMPANY_NAME.

Podemos marcar uma conversa sobre isso?

Atenciosamente,`);
    });


    // Speech Texto Como Pegaram meu E-mail?
    document.getElementById('copiarComoPegaramMeuEmail').addEventListener('click', function () {
        copiarParaClipboard(`${first_name}, 

No processo de pesquisa para entender melhor como poderíamos colaborar e trazer valor à sua organização, identificamos seu endereço de e-mail em fontes públicas associadas à ${company_name}. Nosso objetivo é sempre estabelecer conexões significativas e respeitosas, visando explorar possíveis sinergias.

Caso prefira não receber comunicações futuras, por favor, informe-nos, e garantiremos o respeito à sua escolha.
        
Atenciosamente,`);
    });



    // Speech Texto Como Pegaram meu E-mail?
    document.getElementById('copiarConfirmaçãoDeReunião').addEventListener('click', function () {
        copiarParaClipboard(`Perfeito,

Enviei o convite para nosso encontro no dia DIA_DA_REUNIÃO, das HORÁRIO_DE_INÍCIO às HORÁRIO_DE_TÉRMINO, via Google Meet. Além disso, coloquei em cópia o nosso especialista NOME_DO_CONSULTOR (    ), que também participará da conversa, trazendo insights valiosos para a discussão.

Estou à disposição para qualquer dúvida ou informação adicional que precise antes da nossa reunião. Até lá.

Atenciosamente,`);
    });






}



