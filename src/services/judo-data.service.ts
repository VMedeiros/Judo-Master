import { Injectable, signal } from '@angular/core';
import { Belt, Technique } from '../models/judo.model';

const initialBelts: Belt[] = [
  {
    "id": 1,
    "name": "Faixa Branca",
    "color": "bg-white",
    "textColor": "text-gray-800",
    "ageGroup": "A partir de 4 anos",
    "prerequisites": "Nenhum",
    "information": "A faixa branca simboliza a pureza e o início da jornada no Judô. O foco está nos fundamentos básicos, como ukemi (amortecimentos de queda), posturas e a filosofia do esporte.",
    "techniques": [
      {
        "id": 101,
        "name": "Ukemi",
        "translation": "Amortecimento de Queda",
        "description": "Técnicas para cair com segurança.",
        "execution": "Rolar o corpo para dissipar o impacto, protegendo a cabeça e os órgãos vitais.",
        "application": "Essencial para a segurança em todos os treinos e competições.",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "Fundamentos (Kihon)"
      },
      {
        "id": 102,
        "name": "Kumi-kata",
        "translation": "Pegada",
        "description": "Formas de segurar o judogi.",
        "execution": "Pegada padrão com uma mão na gola (eri) e outra na manga (sode).",
        "application": "Fundamental para controlar o oponente e aplicar técnicas.",
        "demoUrl": "https://www.youtube.com/watch?v=61HkMNNKrVk",
        "category": "Fundamentos (Kihon)"
      }
    ]
  },
  {
    "id": 2,
    "name": "Faixa Cinza",
    "color": "bg-gray-400",
    "textColor": "text-white",
    "ageGroup": "4 a 5 anos",
    "prerequisites": "Conhecimento básico dos fundamentos.",
    "information": "Introdução aos primeiros movimentos de desequilíbrio e técnicas simples.",
    "techniques": [
      {
        "id": 201,
        "name": "O-soto-gari",
        "translation": "Grande ceifada por fora",
        "description": "Uma das primeiras técnicas de projeção aprendidas.",
        "execution": "Desequilibrar o oponente para trás e ceifar sua perna de apoio por fora.",
        "application": "Eficaz quando o oponente está se movendo para frente.",
        "demoUrl": "https://www.youtube.com/watch?v=c-A_nP7mKAc",
        "category": "Técnicas de Projeção (Nage-waza)"
      }
    ]
  },
  {
    "id": 3,
    "name": "Faixa Azul",
    "color": "bg-blue-600",
    "textColor": "text-white",
    "ageGroup": "6 a 7 anos",
    "prerequisites": "Domínio das técnicas da faixa cinza.",
    "information": "A faixa azul representa a fluidez da água. O judoca começa a desenvolver um repertório maior de técnicas e a combiná-las.",
    "techniques": [
      {
        "id": 301,
        "name": "O-goshi",
        "translation": "Grande quadril",
        "description": "Técnica de projeção usando o quadril.",
        "execution": "Envolver a cintura do oponente, encaixar o quadril e projetá-lo por cima das costas.",
        "application": "Poderosa técnica de curto alcance.",
        "demoUrl": "https://www.youtube.com/watch?v=yhu1mfy2vJ4",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 302,
        "name": "Kesa-gatame",
        "translation": "Imobilização em echarpe",
        "description": "Técnica fundamental de imobilização no solo.",
        "execution": "Controlar o oponente no chão, segurando a cabeça e o braço, com o corpo posicionado lateralmente.",
        "application": "Usada para garantir a pontuação ou preparar uma finalização.",
        "demoUrl": "https://www.youtube.com/watch?v=NDaQuJOFBYk",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      }
    ]
  },
  {
    "id": 4,
    "name": "Faixa Amarela",
    "color": "bg-yellow-400",
    "textColor": "text-gray-800",
    "ageGroup": "8 a 9 anos",
    "prerequisites": "Consistência nas técnicas da faixa azul.",
    "information": "A faixa amarela simboliza a terra, onde as sementes do conhecimento começam a germinar. O judoca aprimora a coordenação e o tempo de suas técnicas.",
    "techniques": [
      {
        "id": 401,
        "name": "Uki-goshi",
        "translation": "Quadril flutuante",
        "description": "Variação mais sutil do O-goshi.",
        "execution": "Similar ao O-goshi, mas com um movimento de quadril mais rápido e flutuante.",
        "application": "Usado para surpreender o oponente com uma rotação rápida.",
        "demoUrl": "https://www.youtube.com/watch?v=bPKwtB4lyOQ",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 402,
        "name": "Ryote-jime",
        "translation": "Estrangulamento com as duas mãos",
        "description": "Técnica de estrangulamento (Shime-waza) fundamental no Judô.",
        "execution": "Aplicar pressão diretamente no pescoço do oponente usando a força de ambas as mãos.",
        "application": "Depende da posição do tori e da habilidade de fechar o espaço do pescoço do uke.",
        "demoUrl": "https://www.youtube.com/watch?v=-RHC4V7TQiY",
        "category": "Técnicas de Estrangulamento (Shime-waza)"
      }
    ]
  },
  {
    "id": 5,
    "name": "Faixa Laranja",
    "color": "bg-orange-500",
    "textColor": "text-white",
    "ageGroup": "10 a 11 anos",
    "prerequisites": "Bom desenvolvimento das técnicas da faixa amarela.",
    "information": "A faixa laranja representa o sol nascente. O judoca começa a ter mais consciência corporal e a entender a dinâmica dos golpes.",
    "techniques": [
      {
        "id": 501,
        "name": "Uchi-mata",
        "translation": "Ceifada interna da coxa",
        "description": "Uma das técnicas mais dinâmicas e eficazes do Judô.",
        "execution": "Desequilibrar o oponente para frente, girar e ceifar a parte interna de sua coxa com um movimento de \"chute\" para cima.",
        "application": "Extremamente versátil, pode ser usada em diversas situações.",
        "demoUrl": "https://www.youtube.com/watch?v=iUpSu5J-bgw",
        "category": "Técnicas de Projeção (Nage-waza)"
      }
    ]
  },
  {
    "id": 6,
    "name": "Faixa Verde",
    "color": "bg-green-600",
    "textColor": "text-white",
    "ageGroup": "12 a 13 anos",
    "prerequisites": "Domínio das técnicas anteriores e início de combinações (renraku-waza).",
    "information": "A faixa verde simboliza o crescimento e a vegetação. O judoca desenvolve a força e a resistência, aplicando técnicas com mais vigor.",
    "techniques": [
      {
        "id": 601,
        "name": "Nami-Juji-Jime",
        "translation": "Estrangulamento cruzado normal",
        "description": "Estrangulamento com as mãos cruzadas e palmas para baixo, aplicando pressão com as bordas das mãos.",
        "execution": "Cruzar os braços, segurar as lapelas opostas com as palmas para baixo e aplicar pressão.",
        "application": "Eficaz quando o oponente está na guarda ou de costas.",
        "demoUrl": "https://youtu.be/k2cHry9HByQ?si=X07lCZhUw5sVzfMZ",
        "category": "Técnicas de Estrangulamento (Shime-waza)"
      },
      {
        "id": 602,
        "name": "Kata-Juji-Jime",
        "translation": "Meio estrangulamento cruzado",
        "description": "Estrangulamento com uma palma para cima e outra para baixo, criando uma alavanca poderosa.",
        "execution": "Uma mão segura a gola com a palma para cima e a outra com a palma para baixo, aplicando uma torção.",
        "application": "Quebra a postura do oponente e é difícil de defender.",
        "demoUrl": "https://www.youtube.com/watch?v=3VZVUAmiMD8",
        "category": "Técnicas de Estrangulamento (Shime-waza)"
      },
      {
        "id": 603,
        "name": "Gyaku-Juji-Jime",
        "translation": "Estrangulamento cruzado invertido",
        "description": "Estrangulamento com as mãos cruzadas e palmas para cima.",
        "execution": "Cruzar os braços com as palmas para cima, segurar as lapelas opostas e puxar para estrangular.",
        "application": "Comumente usado em posições de controle no solo.",
        "demoUrl": "https://www.youtube.com/watch?v=t3tQriIPdlI",
        "category": "Técnicas de Estrangulamento (Shime-waza)"
      },
      {
        "id": 622,
        "name": "Ryote-Jime",
        "translation": "Estrangulamento com as duas mãos",
        "description": "Técnica de estrangulamento (Shime-waza) fundamental no Judô, que aplica pressão no pescoço usando a força de ambas as mãos.",
        "execution": "Utilizar as duas mãos para apertar as laterais do pescoço ou a traqueia do oponente, geralmente sem o auxílio das lapelas.",
        "application": "Depende da posição do tori e da habilidade de fechar o espaço do pescoço do uke para neutralizá-lo.",
        "demoUrl": "https://www.youtube.com/watch?v=-RHC4V7TQiY",
        "category": "Técnicas de Estrangulamento (Shime-waza)"
      },
      {
        "id": 604,
        "name": "Hon-Kesa-Gatame",
        "translation": "Imobilização básica em escarfalho",
        "description": "Controle lateral passando o braço sob o pescoço do oponente.",
        "execution": "Sentar ao lado do oponente, controlar seu braço e pescoço, usando o peso do corpo para imobilizar.",
        "application": "Uma das imobilizações mais fundamentais e seguras do judô.",
        "demoUrl": "https://www.youtube.com/watch?v=NDaQuJOFBYk",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 605,
        "name": "Yoko-Shiho-Gatame",
        "translation": "Imobilização lateral de quatro pontos",
        "description": "Controle lateral perpendicular ao corpo do oponente.",
        "execution": "Deitar sobre o oponente, controlando o pescoço com um braço e passando o outro por entre as pernas.",
        "application": "Imobilização muito estável que distribui o peso sobre o adversário.",
        "demoUrl": "https://www.youtube.com/watch?v=TT7XJVSEQxA",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 606,
        "name": "Kami-Shiho-Gatame",
        "translation": "Imobilização superior de quatro pontos",
        "description": "Controle pela cabeça do oponente.",
        "execution": "Deitar sobre o peito do oponente vindo de sua cabeça, controlando ambos os braços e segurando a faixa.",
        "application": "Domínio total da parte superior do corpo, dificultando a respiração do oponente.",
        "demoUrl": "https://www.youtube.com/watch?v=HFuMjOv0WN8",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 607,
        "name": "Kuzure-Kesa-Gatame",
        "translation": "Imobilização em escarfalho modificada",
        "description": "Variação do Hon-Kesa-Gatame, geralmente segurando por baixo da axila em vez do pescoço.",
        "execution": "Similar ao Hon-Kesa-Gatame, mas a pegada é ajustada para a axila, oferecendo uma alternativa.",
        "application": "Usado quando o oponente defende a pegada no pescoço.",
        "demoUrl": "https://www.youtube.com/watch?v=Q2fb9jaoUFQ",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 623,
        "name": "Kuzure-Yoko-Shiho-Gatame",
        "translation": "Imobilização lateral de quatro pontos modificada",
        "description": "Variação do Yoko-Shiho-Gatame com diferentes pegadas nos braços ou pernas.",
        "execution": "Ajustar as pegadas do Yoko-Shiho-Gatame para controlar melhor a defesa do oponente.",
        "application": "Adaptar a imobilização para manter o controle quando o oponente tenta escapar.",
        "demoUrl": "https://www.youtube.com/watch?v=3UEPeLUYeZk",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 624,
        "name": "Kuzure-Kami-Shiho-Gatame",
        "translation": "Imobilização superior de quatro pontos modificada",
        "description": "Variação do Kami-Shiho-Gatame onde as pegadas são alteradas.",
        "execution": "Em vez de segurar a faixa, uma ou ambas as mãos podem controlar os braços ou as lapelas do oponente.",
        "application": "Oferece mais opções para neutralizar as defesas do oponente a partir da imobilização superior.",
        "demoUrl": "https://www.youtube.com/watch?v=YUrogQWdwiY",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 625,
        "name": "Makura-Kesa-Gatame",
        "translation": "Imobilização em escarfalho com travesseiro",
        "description": "Variação do Kesa-Gatame onde o tori usa sua perna como um 'travesseiro' sob a cabeça do uke.",
        "execution": "Prender a cabeça do oponente com a coxa, aumentando o controle e a pressão.",
        "application": "Dificulta a fuga do oponente e pode preparar para outras técnicas.",
        "demoUrl": "https://www.youtube.com/watch?v=k9MYaHbYqnQ",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 626,
        "name": "Ushiro-Kesa-Gatame",
        "translation": "Imobilização em escarfalho por trás",
        "description": "Imobilização similar ao Kesa-Gatame, mas com o tori virado na direção oposta.",
        "execution": "O tori se senta de costas para a cabeça do uke, controlando o braço e o quadril.",
        "application": "Uma posição de controle surpreendente, muitas vezes usada em transições.",
        "demoUrl": "https://www.youtube.com/watch?v=SBapox2M2dE",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 608,
        "name": "Tate-Shiho-Gatame",
        "translation": "Imobilização longitudinal de quatro pontos",
        "description": "Imobilização montada sobre o tronco do oponente.",
        "execution": "Montar sobre o oponente, controlando seus braços e usando o peso para imobilizar.",
        "application": "Posição dominante que abre muitas oportunidades para finalizações.",
        "demoUrl": "https://www.youtube.com/watch?v=55-rFmBx53g",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 609,
        "name": "Kata-Gatame",
        "translation": "Imobilização de ombro",
        "description": "Imobilização que usa o ombro do oponente para auxiliar em um estrangulamento.",
        "execution": "Controlar o braço e a cabeça do oponente juntos, aplicando pressão com o ombro e a cabeça.",
        "application": "Poderosa transição de imobilização para estrangulamento.",
        "demoUrl": "https://www.youtube.com/watch?v=zQR3IOXxO_Q",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 627,
        "name": "Kuzure-Makura-Kesa-Gatame",
        "translation": "Variação da imobilização em escarfalho com travesseiro",
        "description": "Variação do Makura-Kesa-Gatame com pegadas diferentes.",
        "execution": "Ajustar as pegadas para obter melhor controle enquanto se mantém a perna como 'travesseiro'.",
        "application": "Adaptar a imobilização para neutralizar as defesas específicas do oponente.",
        "demoUrl": "https://www.youtube.com/watch?v=Q2fb9jaoUFQ",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 628,
        "name": "Kuzure-Ushiro-Keza-Gatame",
        "translation": "Variação da imobilização em escarfalho por trás",
        "description": "Variação do Ushiro-Kesa-Gatame com pegadas alternativas.",
        "execution": "Modificar as pegadas no braço ou no quadril para aumentar a estabilidade da imobilização.",
        "application": "Usada para manter o controle quando o oponente tenta girar ou escapar.",
        "demoUrl": "https://www.youtube.com/watch?v=WlXdG-_3WZ8",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 629,
        "name": "Kuzure-Tate-Shiho-Gatame",
        "translation": "Variação da imobilização longitudinal",
        "description": "Variação da montada (Tate-Shiho-Gatame) com diferentes controles dos braços.",
        "execution": "Da montada, usar pegadas como 'vinha' ou controlar um braço com as duas mãos.",
        "application": "Manter o domínio da montada e preparar para chaves de braço.",
        "demoUrl": "https://www.youtube.com/watch?v=RKmJoIby9So",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 630,
        "name": "Kuzure-Kata-Gatame",
        "translation": "Variação da imobilização de ombro",
        "description": "Variação do Kata-Gatame com pegadas ou posicionamento ligeiramente diferentes.",
        "execution": "Ajustar o ângulo do corpo ou as pegadas para finalizar a imobilização ou o estrangulamento associado.",
        "application": "Adaptar a técnica para se adequar ao tipo de corpo ou à defesa do oponente.",
        "demoUrl": "https://www.youtube.com/shorts/aWKpNIiEGfo",
        "category": "Técnicas de Controle no Solo (Katame-waza)"
      },
      {
        "id": 610,
        "name": "Ude-Garami",
        "translation": "Chave de braço flexionada (Figura 4)",
        "description": "Torção do braço do oponente em \"figura quatro\". Inclui múltiplas variações de aplicação.",
        "execution": "Segurar o pulso do oponente com uma mão e passar o outro braço sob o dele, segurando o próprio pulso para torcer o ombro.",
        "application": "Aplicável em diversas posições no solo para forçar a submissão.",
        "demoUrl": "https://www.youtube.com/watch?v=AIlTvZb4RlE",
        "category": "Técnicas de Articulação (Kansetsu-waza)"
      },
      {
        "id": 612,
        "name": "Ude-Gatame",
        "translation": "Chave de braço esticado",
        "description": "Pressionar o cotovelo do oponente com o braço esticado usando as mãos.",
        "execution": "Usar as duas mãos para controlar o braço esticado do oponente e aplicar pressão contra a articulação.",
        "application": "Eficaz quando o oponente tenta empurrar ou se apoiar no chão.",
        "demoUrl": "https://www.youtube.com/watch?v=o8fdi811VSI",
        "category": "Técnicas de Articulação (Kansetsu-waza)"
      },
      {
        "id": 631,
        "name": "Juji-Gatame",
        "translation": "Chave de braço cruzada",
        "description": "Hiperextensão do cotovelo do oponente usando as pernas.",
        "execution": "Controlar o braço do oponente entre as coxas e usar o quadril para hiperextender a articulação do cotovelo.",
        "application": "Uma das finalizações mais comuns e eficazes do judô.",
        "demoUrl": "https://www.youtube.com/watch?v=uR-4bu1H38c",
        "category": "Técnicas de Articulação (Kansetsu-waza)"
      },
      {
        "id": 613,
        "name": "Ko-Soto-Gake",
        "translation": "Pequeno gancho por fora",
        "description": "Enganchar o calcanhar do oponente por fora para derrubá-lo para trás.",
        "execution": "Desequilibrar o oponente para trás e enganchar seu calcanhar com o pé.",
        "application": "Efetivo como um ataque surpresa ou contra-ataque.",
        "demoUrl": "https://www.youtube.com/watch?v=8b6kY4s4zH4",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 614,
        "name": "Tsuri-Goshi",
        "translation": "Projeção de quadril suspensa",
        "description": "Levantar o oponente pelo cinto antes de projetar com o quadril.",
        "execution": "Segurar a faixa nas costas, levantar o oponente para quebrar a postura e usar o quadril para projetar.",
        "application": "Eficaz contra oponentes que se inclinam para a frente.",
        "demoUrl": "https://www.youtube.com/watch?v=51Htlp7xEvE",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 615,
        "name": "Yoko-Otoshi",
        "translation": "Queda lateral",
        "description": "Técnica de sacrifício (Sutemi-waza) onde o tori cai para o lado para projetar o uke.",
        "execution": "Puxar o oponente, cair para o lado e usar a perna para bloquear e derrubá-lo.",
        "application": "Surpreende oponentes que resistem a projeções para frente.",
        "demoUrl": "https://www.youtube.com/watch?v=MnNG67pF_a0",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 616,
        "name": "Ashi-Guruma",
        "translation": "Roda de perna",
        "description": "Projetar o oponente em um círculo sobre a perna estendida.",
        "execution": "Girar e colocar a perna estendida na frente do joelho do oponente, usando-a como um eixo.",
        "application": "Técnica de longo alcance eficaz contra oponentes em movimento.",
        "demoUrl": "https://www.youtube.com/watch?v=ROeayhvom9U",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 632,
        "name": "Ko-Tsuri-Goshi",
        "translation": "Pequena projeção de quadril suspensa",
        "description": "Variação do Tsuri-Goshi com uma pegada por baixo do braço.",
        "execution": "Em vez de segurar a faixa, a mão passa por baixo do braço do oponente para controlar a gola oposta, antes de levantar e projetar.",
        "application": "Eficaz quando não é possível alcançar a faixa nas costas.",
        "demoUrl": "https://www.youtube.com/watch?v=aNrgTx4--L0",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 617,
        "name": "Harai-Tsuri-Komi-Ashi",
        "translation": "Varrida de pé suspensa e puxada",
        "description": "Varrer o tornozelo do oponente enquanto o puxa para cima.",
        "execution": "Puxar a manga para desequilibrar o oponente para cima e para frente, enquanto varre seu pé de apoio.",
        "application": "Uma técnica de Ashi-waza (técnica de perna) muito dinâmica e clássica.",
        "demoUrl": "https://www.youtube.com/watch?v=gGPXvWL8VbE",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 633,
        "name": "Tomoe-Nage",
        "translation": "Projeção em círculo",
        "description": "Técnica de sacrifício frontal (Ma-sutemi-waza) em que o tori se joga para trás.",
        "execution": "O tori desequilibra o uke para frente, cai para trás, coloca o pé em seu abdômen e o projeta por cima da cabeça.",
        "application": "Eficaz contra um oponente que está empurrando ou avançando com força.",
        "demoUrl": "https://www.youtube.com/watch?v=880WbHvHv6A",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 618,
        "name": "Seoi-Nage → Tani-Otoshi",
        "translation": "Contra-ataque de Tani-Otoshi para Seoi-Nage",
        "description": "Quando o oponente tenta um Seoi-Nage, o tori gira e o derruba para trás com Tani-Otoshi.",
        "execution": "Aproveitar a rotação do oponente para envolvê-lo e projetá-lo para trás.",
        "application": "Defesa e contra-ataque fundamental contra projeções de ombro.",
        "demoUrl": "https://www.youtube.com/watch?v=3b9Me3Fohpk",
        "category": "Técnicas de Contra-ataque (Kaeshi-waza)"
      },
      {
        "id": 634,
        "name": "Koshi-Guruma → Ushiro-Goshi",
        "translation": "Contra-ataque de Ushiro-Goshi para Koshi-Guruma",
        "description": "Quando o oponente tenta um Koshi-Guruma, o tori bloqueia o quadril, levanta o oponente e o projeta para trás.",
        "execution": "Abaixar o centro de gravidade, levantar o oponente pelo quadril durante seu ataque e projetá-lo para trás.",
        "application": "Contra-ataque eficaz contra técnicas de quadril.",
        "demoUrl": "https://www.youtube.com/watch?v=SU7Id6uVJ44",
        "category": "Técnicas de Contra-ataque (Kaeshi-waza)"
      },
      {
        "id": 619,
        "name": "Ouchi-Gari → Sasae-Tsuri-Komi-Ashi",
        "translation": "Contra-ataque de Sasae para Ouchi-Gari",
        "description": "Quando o oponente ataca com Ouchi-Gari, usar o desequilíbrio para aplicar um Sasae.",
        "execution": "Esquivar da ceifada e usar o movimento do oponente para projetá-lo sobre o pé de bloqueio.",
        "application": "Transforma a agressão do oponente em uma oportunidade.",
        "demoUrl": "https://www.youtube.com/watch?v=699i--pvYmE",
        "category": "Técnicas de Contra-ataque (Kaeshi-waza)"
      },
      {
        "id": 635,
        "name": "Uchi-Mata → Tani-Otoshi",
        "translation": "Contra-ataque de Tani-Otoshi para Uchi-Mata",
        "description": "Quando o oponente ataca com Uchi-Mata, o tori se move para o lado e o projeta para trás.",
        "execution": "Sair da linha de ataque do Uchi-Mata, desequilibrar o oponente para trás e aplicar o Tani-Otoshi.",
        "application": "Uma defesa comum e eficaz contra um dos golpes mais populares.",
        "demoUrl": "https://www.youtube.com/watch?v=iUpSu5J-bgw",
        "category": "Técnicas de Contra-ataque (Kaeshi-waza)"
      },
      {
        "id": 636,
        "name": "Seoi-Nage → Ouchi-Gari",
        "translation": "Combinação de Seoi-Nage para Ouchi-Gari",
        "description": "Ameaçar com Seoi-Nage para fazer o oponente recuar, criando a oportunidade para o Ouchi-Gari.",
        "execution": "Fintar a entrada do Seoi-Nage e, quando o oponente transferir o peso para trás, aplicar a ceifada interna.",
        "application": "Explora a reação defensiva a uma forte ameaça de projeção de ombro.",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "Técnicas Combinadas (Renraku-waza)"
      },
      {
        "id": 620,
        "name": "Ko-Uchi-Gari → O-Soto-Gari",
        "translation": "Combinação de Ko-Uchi-Gari para O-Soto-Gari",
        "description": "Ameaçar com uma pequena ceifada interna para forçar o oponente a mover a perna, abrindo espaço para a grande ceifada externa.",
        "execution": "Fintar o Ko-Uchi-Gari e, na reação do oponente, trocar o passo e aplicar O-Soto-Gari.",
        "application": "Combinação clássica que explora a reação natural do oponente.",
        "demoUrl": "https://www.youtube.com/watch?v=c-A_nP7mKAc",
        "category": "Técnicas Combinadas (Renraku-waza)"
      },
      {
        "id": 621,
        "name": "Ouchi-Gari → Harai-Goshi",
        "translation": "Combinação de Ouchi-Gari para Harai-Goshi",
        "description": "Usar a ceifada interna para desequilibrar o oponente e prepará-lo para uma projeção de quadril.",
        "execution": "Atacar com Ouchi-Gari; quando o oponente move o peso para se defender, girar para o Harai-Goshi.",
        "application": "Uma combinação poderosa que une técnicas de perna e quadril.",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "Técnicas Combinadas (Renraku-waza)"
      },
      {
        "id": 637,
        "name": "Ko-Uchi-Gari → Uchi-Mata",
        "translation": "Combinação de Ko-Uchi-Gari para Uchi-Mata",
        "description": "Usar uma pequena ceifada interna para fazer o oponente transferir o peso, abrindo a oportunidade para o Uchi-Mata.",
        "execution": "Atacar com Ko-Uchi-Gari e, na defesa do oponente, usar o pé de pivô para entrar o Uchi-Mata.",
        "application": "Combinação eficaz para preparar uma das projeções mais potentes.",
        "demoUrl": "https://www.youtube.com/watch?v=iUpSu5J-bgw",
        "category": "Técnicas Combinadas (Renraku-waza)"
      },
      {
        "id": 638,
        "name": "Seoi-Nage → Ko-Uchi-Gari",
        "translation": "Combinação de Seoi-Nage para Ko-Uchi-Gari",
        "description": "Ameaçar com Seoi-Nage para fazer o oponente endurecer a postura, e então atacá-lo com Ko-Uchi-Gari.",
        "execution": "Fintar a entrada do Seoi-Nage e, quando o oponente resistir, usar a ceifada interna na perna de apoio.",
        "application": "Uma combinação inteligente que usa a força defensiva do oponente contra ele mesmo.",
        "demoUrl": "https://www.youtube.com/watch?v=3Jb3tZvr9Ng",
        "category": "Técnicas Combinadas (Renraku-waza)"
      }
    ]
  },
  {
    "id": 7,
    "name": "Faixa Roxa",
    "color": "bg-purple-600",
    "textColor": "text-white",
    "ageGroup": "14 a 15 anos",
    "prerequisites": "Boa execução de combinações e contra-ataques (kaeshi-waza).",
    "information": "A faixa roxa representa a nobreza e a sabedoria. O judoca começa a desenvolver um pensamento mais estratégico durante o combate.",
    "techniques": [
      {
        "id": 701,
        "name": "Tomoe-nage",
        "translation": "Projeção em círculo (sacrifício)",
        "description": "Técnica de sacrifício em que o tori se joga para trás para projetar o uke.",
        "execution": "O tori cai para trás, colocando o pé na barriga do uke e o projeta por cima da cabeça.",
        "application": "Excelente para surpreender um oponente que está empurrando para frente.",
        "demoUrl": "https://www.youtube.com/watch?v=880WbHvHv6A",
        "category": "Técnicas de Sacrifício (Sutemi-waza)"
      }
    ]
  },
  {
    "id": 8,
    "name": "Faixa Marrom",
    "color": "bg-yellow-800",
    "textColor": "text-white",
    "ageGroup": "A partir de 16 anos",
    "prerequisites": "Maturidade técnica e tática, domínio de um tokui-waza (técnica preferida).",
    "information": "A faixa marrom simboliza a solidez e a maturidade. É a última etapa antes da faixa preta, exigindo grande dedicação e polimento técnico.",
    "techniques": [
      {
        "id": 801,
        "name": "Ura-nage",
        "translation": "Projeção para trás (sacrifício)",
        "description": "Técnica de sacrifício projetando o oponente para trás.",
        "execution": "Abraçar o oponente por trás ou pela frente, levantar e cair junto com ele para projetá-lo.",
        "application": "Um contra-ataque poderoso para técnicas de quadril como o Uchi-mata.",
        "demoUrl": "https://www.youtube.com/watch?v=Fgi9b8DJ5sQ",
        "category": "Técnicas de Sacrifício (Sutemi-waza)"
      }
    ]
  },
  {
    "id": 9,
    "name": "Faixa Preta",
    "color": "bg-black",
    "textColor": "text-white",
    "ageGroup": "A partir de 18 anos (geralmente)",
    "prerequisites": "Excelência em todos os princípios do Judô, conhecimento de katas e aprovação em exame rigoroso.",
    "information": "A faixa preta (Yudansha) não é o fim, mas o começo de uma nova jornada de aprendizado. Simboliza que o judoca dominou os fundamentos e está pronto para aprofundar seu conhecimento.",
    "techniques": [
      {
        "id": 901,
        "name": "Kata-guruma",
        "translation": "Roda no ombro",
        "description": "Técnica clássica de Te-waza (técnicas de mão).",
        "execution": "Entrar sob o oponente, levantá-lo sobre os ombros e projetá-lo para frente.",
        "application": "Requer grande força e técnica apurada. Foi modificada nas regras atuais de competição.",
        "demoUrl": "https://www.youtube.com/watch?v=cnHRhSy8yi4",
        "category": "Técnicas de Projeção (Nage-waza)"
      },
      {
        "id": 902,
        "name": "Hadaka-jime",
        "translation": "Estrangulamento nu",
        "description": "Técnica de estrangulamento sem o uso do judogi.",
        "execution": "Aplicar um mata-leão, usando o braço para pressionar as artérias carótidas.",
        "application": "Uma finalização poderosa no chão (ne-waza).",
        "demoUrl": "https://www.youtube.com/watch?v=9f0n8jez7iA",
        "category": "Técnicas de Estrangulamento (Shime-waza)"
      }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class JudoDataService {
  belts = signal<Belt[]>(initialBelts);

  private nextId = 1000;

  addTechnique(beltId: number, technique: Omit<Technique, 'id'>) {
    this.belts.update(belts =>
      belts.map(belt => {
        if (belt.id === beltId) {
          const newTechnique = { ...technique, id: this.nextId++ };
          return { ...belt, techniques: [...belt.techniques, newTechnique] };
        }
        return belt;
      })
    );
  }

  updateTechnique(beltId: number, updatedTechnique: Technique) {
    this.belts.update(belts =>
      belts.map(belt => {
        if (belt.id === beltId) {
          return {
            ...belt,
            techniques: belt.techniques.map(t => t.id === updatedTechnique.id ? updatedTechnique : t)
          };
        }
        return belt;
      })
    );
  }

  deleteTechnique(beltId: number, techniqueId: number) {
    this.belts.update(belts =>
      belts.map(belt => {
        if (belt.id === beltId) {
          return { ...belt, techniques: belt.techniques.filter(t => t.id !== techniqueId) };
        }
        return belt;
      })
    );
  }
}