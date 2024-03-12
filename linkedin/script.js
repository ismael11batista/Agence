document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('inputText').addEventListener('input', extrairInformacoes);
    configurarBotoes();
});

let first_name = ''; // Variável global para armazenar o primeiro nome do contato
let company_name = ''; // Variável global para armazenar o nome da empresa
let time_in_position = '';
let position = '';

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

function extrairInformacoes() {
    const textoPerfil = document.getElementById('inputText').value;
    const nomeRegex = /^\s*(.{3,})\r?\n\s*\1/m;
    const nomeMatch = textoPerfil.match(nomeRegex);
    const nomeContato = nomeMatch ? nomeMatch[1].trim() : "NOME_DO_CONTATO";
    document.getElementById('nomeContato').textContent = `Nome do Contato: ${nomeContato}`;

    // Adicionando lógica para extrair o primeiro nome do nomeContato
    const primeiroNomeRegex = /^\w+/; // Esta regex extrai a primeira palavra da string
    const primeiroNomeMatch = nomeContato.match(primeiroNomeRegex);
    first_name = primeiroNomeMatch ? primeiroNomeMatch[0] : "FIRST_NAME";
    document.getElementById('nomeContato').textContent = `Nome do Contato: ${nomeContato}`;

    const cargoRegex = /Conexão de \dº grau\dº\n(.+?)\n/;
    const cargoMatch = textoPerfil.match(cargoRegex);
    let ultimoCargo = cargoMatch ? cargoMatch[1].trim() : "CARGO_DO_CONTATO";
    position = ultimoCargo
    document.getElementById('ultimoCargo').textContent = `Último Cargo: ${ultimoCargo}`;

    let empresaRegex = /Conexão de \dº grau\dº\n.+\n\n(.+?)\n/;
    let empresaMatch = textoPerfil.match(empresaRegex);
    let ultimaEmpresa = empresaMatch ? empresaMatch[1].trim() : "COMPANY_NAME";
    company_name = ultimaEmpresa;
    document.getElementById('ultimaEmpresa').textContent = `Última Empresa: ${ultimaEmpresa}`;

    const duracaoRegex = /- o momento · (\d+ anos? \d+ meses?|\d+ meses?|\d+ anos?)/;
    const duracaoMatch = textoPerfil.match(duracaoRegex);
    const duracao = duracaoMatch ? duracaoMatch[1] : "TIME_IN_POSITION";
    time_in_position = duracao
    document.getElementById('duracaoExperiencia').textContent = `Duração da Última Experiência: ${duracao}`;
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

function configurarBotoes() {
    document.getElementById('copiarNome').addEventListener('click', copiarNome);
    document.getElementById('copiarCargo').addEventListener('click', copiarCargo);
    document.getElementById('copiarEmpresa').addEventListener('click', copiarEmpresa);
    document.getElementById('copiarDuracao').addEventListener('click', copiarDuracao);
    document.getElementById('copiarTudo').addEventListener('click', copiarTudo);

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
        var RSButtons = document.getElementById("RSButtons");
        var LeanButtons = document.getElementById("LeanButtons");
        var FabricaButtons = document.getElementById("FabricaButtons");

        RSButtons.classList.add("hide");
        LeanButtons.classList.add("hide");
        FabricaButtons.classList.add("hide");

        if (selection === "R&S") {
            RSButtons.classList.remove("hide");
        } else if (selection === "Lean") {
            LeanButtons.classList.remove("hide");
        } else if (selection === "Fábrica") {
            FabricaButtons.classList.remove("hide");
        }
    }

    configurarBotoesEspecificos();
}



function configurarBotoesEspecificos() {
    // Adicione aqui a configuração específica de botões para R&S, Lean, Fábrica, etc.
    // Exemplo: Configuração para os botões de R&S

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
        copiarParaClipboard(`${first_name},`);
    });



    // Speech Follow Up 1 Lean
    document.getElementById('copiarFollowUp1RS').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},`);
    });


    // Speech Follow Up 2 Lean
    document.getElementById('copiarFollowUp2RS').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},`);
    });





    // Configuração para os botões de Lean
    // Speech Conexão Lean
    document.getElementById('copiarTextoLeanConexao').addEventListener('click', function () {
        copiarParaClipboard(`Olá ${first_name}, vi que você já atua no cargo ${position} há ${time_in_position}. Parabéns! Meu nome é Carlos, sou CEO da Agence e acredito que uma parceria entre nossas empresas seria ótimo. O que acha de conversarmos sobre como a Agence pode ajudar vocês na área de tecnologia?`);
    });



    // Speech Email 1 Lean 
    document.getElementById('copiarTextoLean1').addEventListener('click', function () {
        copiarParaClipboard(`Agence & ${company_name} - Melhoria contínua
Olá ${first_name}, 
          
Você como ${position} sabe da importância de manter a melhora contínua dentro da sua empresa. 
       
Analisando o modelo de melhoria contínua que a ${company_name} possui, acredito que nós da Agence podemos te ajudar a continuar melhorando seus processos, aumentando a produtividade e reduzindo seus custos através de Automação de processos repetitivos (RPA).
       
Para isso, gostaria de saber:
       
Qual a sua disponibilidade para marcarmos uma bate papo sobre isso?`);
    });


    // Speech Email 2 Lean 
    document.getElementById('copiarTextoLean2').addEventListener('click', function () {
        copiarParaClipboard(`Olá ${first_name},      
       
Sei que sua agenda está corrida, por isso acredito que não conseguiu ler meu último e-mail, então vamos direto ao ponto:
       
O motivo do meu contato é sobre melhoria contínua na ${company_name} e como podemos automatizar processos repetitivos com o objetivo de reduzir o tempo no dia a dia da sua equipe. 
       
Qual a sua disponibilidade para analisarmos seus processos e quais  processos podemos automatizar através de RPA?`);
    });



    // Speech Pedido Reuniao Lean
    document.getElementById('copiarPedidoReuniaoLean').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},`);
    });



    // Speech Follow Up 1 Lean
    document.getElementById('copiarFollowUp1Lean').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},`);
    });


    // Speech Follow Up 2 Lean
    document.getElementById('copiarFollowUp2Lean').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},`);
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
        copiarParaClipboard(`${first_name},`);
    });



    // Speech Follow Up 1
    document.getElementById('copiarFollowUp1').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},`);
    });


    // Speech Follow Up 2
    document.getElementById('copiarFollowUp2').addEventListener('click', function () {
        copiarParaClipboard(`${first_name},`);
    });




}

