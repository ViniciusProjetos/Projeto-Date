var TEXTOS = {
    p1: "Você topa sair num date comigo?",
    avisoNao: "shh siga o roteiro",
    p2: "Onde você prefere ir?",
    p3: "Qual a sua disponibilidade?",
    p4: "Eita, se você chegou até aqui então está mesmo interessada né e claramente não é porque você não teve outra opção hihi. Dito isso, poderia avaliar meu serviço de agendamento?",
    nota10Falso: "você quis dizer nota 10 né bb? rsrs segue o roteiro !!",
    nota10Real: "uau.. nota 10 igual você bb rsrs"
  };

  var LOCAIS = [
    {emoji:"🍽️", nome:"RESTAURANTE"},
    {emoji:"🥐", nome:"PADARIA"},
    {emoji:"🌳", nome:"PARQUE"},
    {emoji:"🎬", nome:"CINEMA"}
  ];

  /* ==================================================================
     🖼️ IMAGENS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
     ================================================================== */
  var IMG_LARGURA = "240px";
  var IMG_ALTURA  = "170px";
  var IMG_AJUSTE  = "cover";

  var IMAGENS = {
    sim:        "emoji ok.jpg",   // clicou S
    nao:        "",   // clicou N
    RESTAURANTE:"emoji local.jpg",
    PADARIA:    "emoji local.jpg",
    PARQUE:     "emoji local.jpg",
    CINEMA:     "emoji local.jpg",
    data:       "emoji data.jpg",   // calendario
    nota10:     "emoji feedback.jpg",   // escolheu 10 
    notaErrada: "emoji feedback.jpg"    // escolheu outra nota 
  };

  var ESPERA = 3600; // <<<<<<<<<<<<<<<<<<<tempo 


  // coracoes do fundo
  (function(){
    var caixa = document.getElementById("coracoes");
    var tipos = ["💖","💗","💖","💖"];
    for (var i = 0; i < 18; i++) {
      var s = document.createElement("span");
      s.textContent = tipos[i % tipos.length];
      s.style.left = (Math.random() * 120 - 30) + "%";
      s.style.fontSize = (16 + Math.random() * 28) + "px";
      s.style.animationDuration = (9 + Math.random() * 12) + "s";
      s.style.animationDelay = (-Math.random() * 20) + "s";
      caixa.appendChild(s);
    }
  })();

  // musica
  var audio = document.getElementById("musica");
  var btnMusica = document.getElementById("musica-btn");

  function atualizarIcone(){ btnMusica.textContent = audio.paused ? "🔇" : "🔊"; }

  function tocar(){
    audio.volume = 0.6;
    var p = audio.play();
    if (p && p.catch) p.catch(function(){});
    atualizarIcone();
  }

  // o navegador so deixa tocar depois do primeiro toque
  document.addEventListener("pointerdown", function primeiro(e){
    if (e.target === btnMusica) return;
    document.removeEventListener("pointerdown", primeiro);
    tocar();
  });

  btnMusica.addEventListener("click", function(){
    if (audio.paused) tocar(); else { audio.pause(); atualizarIcone(); }
  });
  audio.addEventListener("play", atualizarIcone);
  audio.addEventListener("pause", atualizarIcone);


  var escolhas = {local:"", data:""};
  var ocupado = false;

  function mostrar(html){
    var velha = document.getElementById("janela");
    var nova = velha.cloneNode(false);
    nova.innerHTML = html;
    velha.replaceWith(nova);
    ocupado = false;
  }
  var atual = function(){ return document.getElementById("janela"); };

  // poe a imagem no slot, devolve true se tinha imagem
  function poeImagem(chave){
    var slot = document.getElementById("slotImg");
    var src = IMAGENS[chave];
    if (!slot || !src) return false;

    slot.style.width = IMG_LARGURA;
    slot.style.height = IMG_ALTURA;
    slot.innerHTML = "";

    var im = document.createElement("img");
    im.src = src;
    im.alt = "";
    im.style.objectFit = IMG_AJUSTE;
    im.onerror = function(){ slot.classList.remove("aberto"); }; // se nao achar o arquivo, some
    slot.appendChild(im);
    slot.classList.add("aberto");
    return true;
  }

  // mostra a imagem e so depois vai pra proxima
  function comImagem(chave, depois){
    if (poeImagem(chave)) setTimeout(depois, ESPERA);
    else depois();
  }

  function pergunta1(){
    mostrar(
      '<h1>' + TEXTOS.p1 + '</h1>' +
      '<div id="slotImg"></div>' +
      '<div class="opcoes lado">' +
        '<button id="sim">SIM</button>' +
        '<button id="nao">NÃO</button>' +
      '</div>' +
      '<p class="aviso" id="aviso"></p>'
    );
    var nao = document.getElementById("nao");
    var aviso = document.getElementById("aviso");

    document.getElementById("sim").onclick = function(){
      if (ocupado) return;
      ocupado = true;
      comImagem("sim", pergunta2);
    };

    nao.onclick = function(){
      aviso.textContent = TEXTOS.avisoNao;
      aviso.classList.remove("treme");
      void aviso.offsetWidth;
      aviso.classList.add("treme");
      nao.classList.add("apagado");
      poeImagem("nao");
    };
  }

  function pergunta2(){
    var botoes = "";
    for (var i = 0; i < LOCAIS.length; i++) {
      botoes += '<button data-i="' + i + '">' + LOCAIS[i].emoji + ' ' + LOCAIS[i].nome + '</button>';
    }
    mostrar(
      '<h1>' + TEXTOS.p2 + '</h1>' +
      '<div id="slotImg"></div>' +
      '<div class="opcoes grade">' + botoes + '</div>'
    );
    atual().querySelectorAll("button").forEach(function(b){
      b.onclick = function(){
        if (ocupado) return;
        ocupado = true;
        var nome = LOCAIS[b.dataset.i].nome;
        escolhas.local = nome;
        comImagem(nome, pergunta3);
      };
    });
  }

  function pergunta3(){
    var ANO = "2026"; // ano fixo
    mostrar(
      '<h1>' + TEXTOS.p3 + '</h1>' +
      '<div id="slotImg"></div>' +
      '<div class="linhaData">' +
        '<select id="dia" aria-label="Dia"><option value="">Dia</option></select>' +
        '<select id="mes" aria-label="Mês"><option value="">Mês</option></select>' +
        '<div class="ano" aria-label="Ano">' + ANO + '</div>' +
      '</div>' +
      '<button id="avancar" class="escondido">AVANÇAR</button>'
    );
    var selDia = document.getElementById("dia");
    var selMes = document.getElementById("mes");
    var avancar = document.getElementById("avancar");

    var nomesMes = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    var diasNoMes = [31,28,31,30,31,30,31,31,30,31,30,31]; // 2026 nao e bissexto
    var pad = function(n){ return String(n).padStart(2, "0"); };

    for (var i = 0; i < 12; i++) {
      selMes.innerHTML += '<option value="' + (i + 1) + '">' + nomesMes[i] + '</option>';
    }

    function montaDias(){
      var m = Number(selMes.value);
      var max = m ? diasNoMes[m - 1] : 31;
      var guardado = selDia.value;
      selDia.innerHTML = '<option value="">Dia</option>';
      for (var d = 1; d <= max; d++) selDia.innerHTML += '<option value="' + d + '">' + d + '</option>';
      if (guardado && Number(guardado) <= max) selDia.value = guardado;
    }

    function conferir(){
      if (selDia.value && selMes.value) {
        escolhas.data = ANO + "-" + pad(selMes.value) + "-" + pad(selDia.value);
        avancar.classList.remove("escondido");
      } else {
        avancar.classList.add("escondido");
      }
    }

    montaDias();
    selMes.onchange = function(){ montaDias(); conferir(); };
    selDia.onchange = conferir;

    avancar.onclick = function(){
      if (ocupado) return;
      ocupado = true;
      comImagem("data", pergunta4);
    };
  }

  function pergunta4(){
    var botoes = "";
    for (var n = 1; n <= 10; n++) botoes += '<button data-n="' + n + '">' + n + '</button>';

    mostrar(
      '<h1 class="longo">' + TEXTOS.p4 + '</h1>' +
      '<div id="slotImg"></div>' +
      '<div class="notas">' + botoes + '</div>' +
      '<p class="aviso" id="aviso"></p>'
    );
    var lista = Array.prototype.slice.call(atual().querySelectorAll(".notas button"));
    var aviso = document.getElementById("aviso");
    var travado = false;

    lista.forEach(function(b){
      b.onclick = function(){
        if (travado) return;
        travado = true;
        var n = Number(b.dataset.n);

        if (n === 10) {
          b.classList.add("sel");
          aviso.textContent = TEXTOS.nota10Real;
          poeImagem("nota10");
          setTimeout(final, 2500);
        } else {
          b.classList.add("tentou");
          aviso.textContent = TEXTOS.nota10Falso;
          aviso.classList.add("treme");
          poeImagem("notaErrada");
          // troca pra nota 10 depois de um tempinho
          setTimeout(function(){
            b.classList.remove("tentou");
            lista[9].classList.add("sel");
          }, 450);
          setTimeout(final, 3200);
        }
      };
    });
  }

  function final(){
    var partes = escolhas.data.split("-");
    var d = partes[2], m = partes[1];
    var local = escolhas.local.charAt(0) + escolhas.local.slice(1).toLowerCase();
    mostrar(
      '<div class="grande">💜</div>' +
      '<h1>Combinado!</h1>' +
      '<p class="resumo">' + local + '<br>no dia <strong>' + d + '/' + m + '</strong><br>Já pode ir escolhendo a roupa 😌</p>'
    );
  }

  pergunta1();
