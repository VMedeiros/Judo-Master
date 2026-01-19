import { Injectable, signal } from '@angular/core';
import { Belt, Technique } from '../models/judo.model';

const initialBelts: Belt[] = [
  {
    "id": 1,
    "name": "11º Kyu - Faixa Branca",
    "color": "bg-white",
    "textColor": "text-gray-800",
    "ageGroup": "Idade Mínima 4 anos",
    "prerequisites": "Carência CBJ 3 Meses",
    "information": "Primeira graduação no judô, focada em fundamentos básicos e condicionamento físico.",
    "beltImage": "assets/belts/branca.png",
    "techniques": [
      {
        "id": 101,
        "name": "Sensei",
        "translation": "Professor",
        "description": "Termo usado para se referir ao professor de judô",
        "execution": "Conhecimento teórico - Pergunta: O que significa Sensei? R: Professor.",
        "application": "Respeito e etiqueta no judô",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 102,
        "name": "Fundador do Judô",
        "translation": "Sensei Jigoro Kano",
        "description": "Conhecimento sobre o fundador do judô",
        "execution": "Conhecimento teórico - Pergunta: Quem foi o fundador do Judô? R: Sensei Jigoro Kano.",
        "application": "História do judô",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 103,
        "name": "Chokuritsu",
        "translation": "Postura em pé",
        "description": "Postura ereta fundamental no judô",
        "execution": "Manter-se em pé com postura ereta, pés paralelos na largura dos ombros, corpo relaxado mas atento.",
        "application": "Postura básica utilizada no início e fim dos treinos e cumprimentos",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "POSTURAS"
      },
      {
        "id": 104,
        "name": "Seiza",
        "translation": "Postura ajoelhada",
        "description": "Postura de respeito sentado sobre os calcanhares",
        "execution": "Ajoelhar-se com os joelhos juntos, sentar sobre os calcanhares, mãos sobre as coxas, coluna ereta.",
        "application": "Postura de meditação, respeito e cerimônias",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "POSTURAS"
      },
      {
        "id": 105,
        "name": "Tabi-rei ou Ritsu-rei",
        "translation": "Cumprimento em pé",
        "description": "Saudação realizada na posição em pé",
        "execution": "Da posição chokuritsu, inclinar o tronco mantendo as costas retas, olhar para baixo, retornar à posição inicial.",
        "application": "Cumprimento formal ao entrar/sair do tatame, ao cumprimentar colegas e professores",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "CUMPRIMENTOS"
      },
      {
        "id": 106,
        "name": "Ushiro-ukemi-zai",
        "translation": "Batida de mão para trás",
        "description": "Técnica de amortecimento de queda para trás",
        "execution": "Deitado de costas, bater os braços estendidos no tatame formando ângulo de 45° com o corpo, queixo no peito.",
        "application": "Proteção ao cair de costas",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS"
      },
      {
        "id": 107,
        "name": "Mae-mawara-ukemi",
        "translation": "Rolamento para frente",
        "description": "Rolamento frontal de segurança",
        "execution": "Iniciar com um passo à frente, colocar o braço no chão formando um círculo, rolar sobre o ombro diagonalmente até o quadril oposto.",
        "application": "Proteção ao ser projetado para frente",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS"
      },
      {
        "id": 108,
        "name": "Yoko-Ukemi",
        "translation": "Batida de mão lateral (deitado)",
        "description": "Técnica de amortecimento de queda lateral",
        "execution": "Deitado de lado, bater o braço estendido no tatame formando ângulo de 45°, perna de cima flexionada, cabeça protegida.",
        "application": "Proteção ao cair de lado",
        "demoUrl": "https://www.youtube.com/watch?v=JCwK1Ia4jsc",
        "category": "UKEMIS"
      },
      {
        "id": 109,
        "name": "Koshi-guruma",
        "translation": "Roda de quadril",
        "description": "Técnica de projeção usando o quadril como alavanca circular",
        "execution": "Entrar girando o corpo, passar o braço em volta do pescoço do oponente, colocar o quadril abaixo do centro dele e girá-lo sobre o quadril.",
        "application": "Projeção efetiva quando o oponente está em pé ou ligeiramente curvado",
        "demoUrl": "https://www.youtube.com/watch?v=SU7Id6uVJ44",
        "category": "NAGUE-WAZA - Koshi-waza"
      },
      {
        "id": 110,
        "name": "O-soto-gari",
        "translation": "Grande ceifa externa",
        "description": "Técnica de projeção ceifando a perna externa do oponente",
        "execution": "Avançar empurrando o oponente para trás, passar a perna por trás da perna de apoio dele e ceifar com força para trás.",
        "application": "Projeção quando o oponente recua ou está com peso na perna de trás",
        "demoUrl": "https://www.youtube.com/watch?v=c-A_nP7mKAc",
        "category": "NAGUE-WAZA - Ashi-waza"
      },
      {
        "id": 111,
        "name": "O-uchi-gari",
        "translation": "Grande ceifa interna",
        "description": "Técnica de projeção ceifando a perna interna do oponente",
        "execution": "Aproximar-se do oponente, passar a perna entre as pernas dele e ceifar a perna de apoio por dentro, puxando para trás.",
        "application": "Projeção quando o oponente tem as pernas afastadas ou peso em uma perna",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "NAGUE-WAZA - Ashi-waza"
      },
      {
        "id": 112,
        "name": "Hon-kessa-gatame",
        "translation": "Controle lateral fundamental",
        "description": "Técnica de imobilização lateral básica",
        "execution": "Posicionar-se perpendicular ao oponente deitado, passar um braço sob o pescoço e outro sob a axila, controlar com o peso do corpo.",
        "application": "Imobilização após projeção ou durante o trabalho de solo",
        "demoUrl": "https://www.youtube.com/watch?v=NDaQuJOFBYk",
        "category": "KATAME-WAZA - Ossae-komi-waza"
      },
      {
        "id": 113,
        "name": "Yoko-shiho-gatame",
        "translation": "Controle lateral pelos quatro cantos",
        "description": "Técnica de imobilização lateral completa",
        "execution": "Posicionar-se lateral ao oponente, passar um braço sob a cabeça e outro sob a perna mais próxima, controlar com o peito sobre o peito dele.",
        "application": "Imobilização forte e segura após derrubar o oponente",
        "demoUrl": "https://www.youtube.com/watch?v=TT7XJVSEQxA",
        "category": "KATAME-WAZA - Ossae-komi-waza"
      }
    ]
  },
  {
    "id": 2,
    "name": "10º Kyu - Faixa Cinza",
    "color": "bg-gray-400",
    "textColor": "text-white",
    "ageGroup": "Idade Mínima 5 anos",
    "prerequisites": "Carência CBJ 3 meses na faixa anterior",
    "information": "Introdução aos primeiros movimentos de desequilíbrio e técnicas simples. Aprofundamento dos fundamentos.",
    "beltImage": "assets/belts/cinza.png",
    "techniques": [
      {
        "id": 201,
        "name": "Sensei",
        "translation": "Professor",
        "description": "Termo usado para se referir ao professor de judô",
        "execution": "Conhecimento teórico - Pergunta: O que significa Sensei? R: Professor.",
        "application": "Respeito e etiqueta no judô",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 202,
        "name": "Fundador do Judô",
        "translation": "Sensei Jigoro Kano",
        "description": "Conhecimento sobre o fundador do judô",
        "execution": "Conhecimento teórico - Pergunta: Quem foi o fundador do Judô? R: Sensei Jigoro Kano.",
        "application": "História do judô",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 203,
        "name": "Judô",
        "translation": "Caminho da Suavidade",
        "description": "Significado do termo Judô",
        "execution": "Conhecimento teórico - Pergunta: O que significa Judô? R: Caminho da Suavidade.",
        "application": "Compreensão filosófica da arte marcial",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 204,
        "name": "Tatami",
        "translation": "Peças que compõem local de treinamento",
        "description": "Conhecimento sobre o local de prática",
        "execution": "Conhecimento teórico - Pergunta: O que significa Tatami? R: Peças que compõem local de treinamento ou competição.",
        "application": "Conhecimento do ambiente de treino",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 205,
        "name": "Contagem até 10",
        "translation": "ITI, NI, SAN, SHI, GO, ROKU, SHITI, HATI, KYU, DYU",
        "description": "Contagem em japonês de 1 a 10",
        "execution": "Conhecimento teórico - Conferir 10 elementos: ITI, NI, SAN, SHI, GO, ROKU, SHITI, HATI, KYU, DYU.",
        "application": "Vocabulário básico em japonês usado no judô",
        "demoUrl": "https://www.youtube.com/shorts/I_IGzpziW2A",
        "category": "PERGUNTAS"
      },
      {
        "id": 206,
        "name": "Judogui",
        "translation": "Uniforme do praticante de Judô",
        "description": "Conhecimento sobre o uniforme do judô",
        "execution": "Conhecimento teórico - Pergunta: Qual é o uniforme do praticante de Judô? R: Judogui.",
        "application": "Conhecimento básico do equipamento",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 207,
        "name": "Chokuritsu",
        "translation": "Postura em pé",
        "description": "Postura ereta fundamental no judô",
        "execution": "Manter-se em pé com postura ereta, pés paralelos na largura dos ombros, corpo relaxado mas atento.",
        "application": "Postura básica utilizada no início e fim dos treinos e cumprimentos",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "POSTURAS"
      },
      {
        "id": 208,
        "name": "Seiza",
        "translation": "Postura ajoelhada",
        "description": "Postura de respeito sentado sobre os calcanhares",
        "execution": "Ajoelhar-se com os joelhos juntos, sentar sobre os calcanhares, mãos sobre as coxas, coluna ereta.",
        "application": "Postura de meditação, respeito e cerimônias",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "POSTURAS"
      },
      {
        "id": 209,
        "name": "Tati-rei ou Ritsu-rei",
        "translation": "Cumprimento em pé",
        "description": "Saudação realizada na posição em pé",
        "execution": "Da posição chokuritsu, inclinar o tronco mantendo as costas retas, olhar para baixo, retornar à posição inicial.",
        "application": "Cumprimento formal ao entrar/sair do tatame, ao cumprimentar colegas e professores",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "CUMPRIMENTOS"
      },
      {
        "id": 210,
        "name": "Za-rei",
        "translation": "Cumprimento sentado",
        "description": "Saudação realizada na posição seiza",
        "execution": "Da posição seiza, inclinar o tronco para frente apoiando as mãos no chão, formar um triângulo com as mãos, baixar a cabeça.",
        "application": "Cumprimento formal durante cerimônias e início/fim de treinos",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "CUMPRIMENTOS"
      },
      {
        "id": 211,
        "name": "Ushiro-ukemi-zai",
        "translation": "Batida de mão para trás",
        "description": "Técnica de amortecimento de queda para trás",
        "execution": "Deitado de costas, bater os braços estendidos no tatame formando ângulo de 45° com o corpo, queixo no peito.",
        "application": "Proteção ao cair de costas",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS"
      },
      {
        "id": 212,
        "name": "Mae-mawara-ukemi",
        "translation": "Rolamento para frente",
        "description": "Rolamento frontal de segurança",
        "execution": "Iniciar com um passo à frente, colocar o braço no chão formando um círculo, rolar sobre o ombro diagonalmente até o quadril oposto.",
        "application": "Proteção ao ser projetado para frente",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS"
      },
      {
        "id": 213,
        "name": "Koho-kaiten-ukemi",
        "translation": "Batida de mão para trás com rolamento",
        "description": "Rolamento para trás com amortecimento",
        "execution": "Rolar para trás de forma diagonal sobre o ombro, batendo o braço no tatame para amortecer o impacto.",
        "application": "Proteção em quedas para trás com movimento",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS"
      },
      {
        "id": 214,
        "name": "Yoko-Ukemi",
        "translation": "Batida de mão lateral (deitado)",
        "description": "Técnica de amortecimento de queda lateral",
        "execution": "Deitado de lado, bater o braço estendido no tatame formando ângulo de 45°, perna de cima flexionada, cabeça protegida.",
        "application": "Proteção ao cair de lado",
        "demoUrl": "https://www.youtube.com/watch?v=JCwK1Ia4jsc",
        "category": "UKEMIS"
      },
      {
        "id": 215,
        "name": "Kihon-gata",
        "translation": "Rolamento lateral ajoelhado",
        "description": "Rolamento lateral executado da posição ajoelhada",
        "execution": "Da posição ajoelhada, executar um rolamento lateral suave, protegendo a cabeça e batendo o braço no final.",
        "application": "Forma básica de proteção em quedas laterais",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS"
      },
      {
        "id": 216,
        "name": "Koshi-guruma",
        "translation": "Roda de quadril",
        "description": "Técnica de projeção usando o quadril como alavanca circular",
        "execution": "Entrar girando o corpo, passar o braço em volta do pescoço do oponente, colocar o quadril abaixo do centro dele e girá-lo sobre o quadril.",
        "application": "Projeção efetiva quando o oponente está em pé ou ligeiramente curvado",
        "demoUrl": "https://www.youtube.com/watch?v=SU7Id6uVJ44",
        "category": "NAGUE-WAZA - Koshi-waza"
      },
      {
        "id": 217,
        "name": "O-soto-gari",
        "translation": "Grande ceifa externa",
        "description": "Técnica de projeção ceifando a perna externa do oponente",
        "execution": "Avançar empurrando o oponente para trás, passar a perna por trás da perna de apoio dele e ceifar com força para trás.",
        "application": "Projeção quando o oponente recua ou está com peso na perna de trás",
        "demoUrl": "https://www.youtube.com/watch?v=c-A_nP7mKAc",
        "category": "NAGUE-WAZA - Ashi-waza"
      },
      {
        "id": 218,
        "name": "O-uchi-gari",
        "translation": "Grande ceifa interna",
        "description": "Técnica de projeção ceifando a perna interna do oponente",
        "execution": "Aproximar-se do oponente, passar a perna entre as pernas dele e ceifar a perna de apoio por dentro, puxando para trás.",
        "application": "Projeção quando o oponente tem as pernas afastadas ou peso em uma perna",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "NAGUE-WAZA - Ashi-waza"
      },
      {
        "id": 219,
        "name": "Ko-uchi-gari",
        "translation": "Pequena ceifa interna",
        "description": "Técnica de projeção ceifando a parte interna do calcanhar",
        "execution": "Ceifar o calcanhar do oponente por dentro com um movimento rápido e curto, causando desequilíbrio para trás.",
        "application": "Projeção rápida e eficaz em distância curta",
        "demoUrl": "https://www.youtube.com/watch?v=3Jb3tZvr9Ng",
        "category": "NAGUE-WAZA - Ashi-waza"
      },
      {
        "id": 220,
        "name": "Hon-kessa-gatame",
        "translation": "Controle lateral fundamental",
        "description": "Técnica de imobilização lateral básica",
        "execution": "Posicionar-se perpendicular ao oponente deitado, passar um braço sob o pescoço e outro sob a axila, controlar com o peso do corpo.",
        "application": "Imobilização após projeção ou durante o trabalho de solo",
        "demoUrl": "https://www.youtube.com/watch?v=NDaQuJOFBYk",
        "category": "KATAME-WAZA - Ossae-komi-waza"
      },
      {
        "id": 221,
        "name": "Yoko-shiho-gatame",
        "translation": "Controle lateral pelos quatro cantos",
        "description": "Técnica de imobilização lateral completa",
        "execution": "Posicionar-se lateral ao oponente, passar um braço sob a cabeça e outro sob a perna mais próxima, controlar com o peito sobre o peito dele.",
        "application": "Imobilização forte e segura após derrubar o oponente",
        "demoUrl": "https://www.youtube.com/watch?v=TT7XJVSEQxA",
        "category": "KATAME-WAZA - Ossae-komi-waza"
      },
      {
        "id": 222,
        "name": "Kuzure-kessa-gatame",
        "translation": "Controle lateral modificado",
        "description": "Variação do Hon-kessa-gatame com pegada diferente",
        "execution": "Similar ao Hon-kessa-gatame, mas segurando por baixo da axila ou com pegada na faixa, oferecendo mais controle.",
        "application": "Imobilização adaptada quando o oponente defende a pegada tradicional",
        "demoUrl": "https://www.youtube.com/watch?v=Q2fb9jaoUFQ",
        "category": "KATAME-WAZA - Ossae-komi-waza"
      },
      {
        "id": 223,
        "name": "Tate-shiho-gatame",
        "translation": "Controle longitudinal pelos quatro cantos",
        "description": "Imobilização montada sobre o tronco do oponente",
        "execution": "Montar sobre o oponente, controlando seus braços e usando o peso para imobilizar, mantendo o equilíbrio.",
        "application": "Posição dominante que oferece grande controle e oportunidades de finalização",
        "demoUrl": "https://www.youtube.com/watch?v=55-rFmBx53g",
        "category": "KATAME-WAZA - Ossae-komi-waza"
      }
    ]
  },
  {
    "id": 3,
    "name": "6º Kyu - Faixa Amarela",
    "color": "bg-yellow-400",
    "textColor": "text-gray-800",
    "ageGroup": "Idade Mínima 9 anos",
    "prerequisites": "Carência CBJ 6 meses na faixa anterior",
    "information": "A faixa amarela simboliza a terra, onde as sementes do conhecimento começam a germinar. Foco em vocabulário, posturas, passos e aperfeiçoamento técnico.",
    "beltImage": "assets/belts/amarela.png",
    "techniques": [
      {
        "id": 301,
        "name": "História de Jigoro Kano",
        "translation": "Em 04 de maio de 1938",
        "description": "Conhecimento histórico sobre o fundador",
        "execution": "Pergunta: Em que ano Jigoro Kano? R: Em 04 de maio de 1938 - a bordo do Navio Hikawa Maru que o transportava de volta para o Japão, da cidade de Cairo - Egito, onde participou da Assembléia Geral do Comitê Olímpico Internacional.",
        "application": "História e contexto cultural do judô",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 302,
        "name": "Utikomi",
        "translation": "Entradas de golpes",
        "description": "Prática de entrada de técnicas sem projeção completa",
        "execution": "Conhecimento teórico - Pergunta: O que é Utikomi? R: Entradas de golpes.",
        "application": "Treinamento de repetição técnica",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 303,
        "name": "Randori",
        "translation": "Treino livre",
        "description": "Prática livre de combate",
        "execution": "Conhecimento teórico - Pergunta: O que é Randori? R: Treino livre.",
        "application": "Desenvolvimento de habilidades em situação real",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 304,
        "name": "Shiai",
        "translation": "Competição",
        "description": "Combate competitivo oficial",
        "execution": "Conhecimento teórico - Pergunta: O que é Shiai? R: Competição.",
        "application": "Teste de habilidades em ambiente competitivo",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 305,
        "name": "Dojo",
        "translation": "Academia/Local de treinamento",
        "description": "Lugar onde se pratica judô",
        "execution": "Conhecimento teórico - Pergunta: O que é Dojo? R: Academia/Local de treinamento.",
        "application": "Ambiente sagrado de prática",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 306,
        "name": "Shiajô",
        "translation": "Local de competição",
        "description": "Área específica de competição",
        "execution": "Conhecimento teórico - Pergunta: O que é Shiajô? R: Local de competição.",
        "application": "Conhecimento do ambiente competitivo",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 307,
        "name": "Tori",
        "translation": "Judoísta ativo - quem executa o golpe",
        "description": "Aquele que ataca ou executa a técnica",
        "execution": "Conhecimento teórico - Pergunta: O que é Tori? R: Judoísta ativo - quem executa o golpe.",
        "application": "Compreensão dos papéis no treino",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 308,
        "name": "Uke",
        "translation": "Judoísta passivo, quem recebe o golpe",
        "description": "Aquele que recebe ou defende a técnica",
        "execution": "Conhecimento teórico - Pergunta: O que é Uke? R: Judoísta passivo, quem recebe o golpe.",
        "application": "Compreensão dos papéis no treino",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 309,
        "name": "6º Princípio do Judô",
        "translation": "O judoca não se aperfeiçoa para lutar",
        "description": "Princípio filosófico fundamental",
        "execution": "Conhecimento teórico - Pergunta: 6º Princípio do Judô: R: O judoca não se aperfeiçoa para lutar, luta para se aperfeiçoar.",
        "application": "Filosofia e ética do judô",
        "demoUrl": "",
        "category": "VOCABULÁRIO"
      },
      {
        "id": 310,
        "name": "Chokuritsu",
        "translation": "Postura em pé natural",
        "description": "Postura ereta fundamental no judô",
        "execution": "Manter-se em pé com postura ereta, pés paralelos na largura dos ombros, corpo relaxado mas atento.",
        "application": "Postura básica utilizada no início e fim dos treinos",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 311,
        "name": "Hidari-shizentai",
        "translation": "Postura natural com pé esquerdo avançado",
        "description": "Postura de combate com guarda esquerda",
        "execution": "Posicionar o pé esquerdo à frente, joelhos levemente flexionados, corpo equilibrado e pronto para movimentação.",
        "application": "Postura de combate para destros",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 312,
        "name": "Hidari-jigotai",
        "translation": "Postura defensiva com pé esquerdo avançado",
        "description": "Postura defensiva com base mais larga",
        "execution": "Similar ao hidari-shizentai, mas com base mais ampla e centro de gravidade mais baixo para maior estabilidade.",
        "application": "Postura defensiva contra ataques",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 313,
        "name": "Sizen-hontai",
        "translation": "Postura natural fundamental",
        "description": "Postura natural com pés paralelos",
        "execution": "Pés paralelos na largura dos ombros, joelhos levemente flexionados, postura ereta e relaxada.",
        "application": "Postura base para iniciar técnicas",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 314,
        "name": "Jigotai",
        "translation": "Postura defensiva",
        "description": "Postura defensiva com base larga",
        "execution": "Pés afastados além da largura dos ombros, centro de gravidade baixo, postura forte e estável.",
        "application": "Resistência a projeções",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 315,
        "name": "Migui-Shizentai",
        "translation": "Postura natural com pé direito avançado",
        "description": "Postura de combate com guarda direita",
        "execution": "Posicionar o pé direito à frente, joelhos levemente flexionados, corpo equilibrado.",
        "application": "Postura de combate para canhotos",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 316,
        "name": "Migui-jigotai",
        "translation": "Postura defensiva com pé direito avançado",
        "description": "Postura defensiva com guarda direita",
        "execution": "Similar ao migui-shizentai, mas com base mais ampla e centro de gravidade baixo.",
        "application": "Defesa com guarda direita",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 317,
        "name": "Ayumi-ashi",
        "translation": "Passo normal",
        "description": "Passo alternado natural",
        "execution": "Caminhar naturalmente alternando os pés, mantendo equilíbrio e postura.",
        "application": "Movimentação básica no tatame",
        "demoUrl": "",
        "category": "SHINTAI - Passos"
      },
      {
        "id": 318,
        "name": "Tsugi-ashi",
        "translation": "Passo sucessivo",
        "description": "Passo deslizante sem cruzar os pés",
        "execution": "Deslizar o pé da frente e trazer o de trás sem cruzar, mantendo a guarda constante.",
        "application": "Movimentação de combate mantendo postura",
        "demoUrl": "",
        "category": "SHINTAI - Passos"
      },
      {
        "id": 319,
        "name": "Ushiro-ukemi-zai",
        "translation": "Batida de mão para trás",
        "description": "Queda para trás",
        "execution": "Deitado de costas, bater os braços estendidos no tatame formando ângulo de 45°, queixo no peito.",
        "application": "Proteção ao cair de costas",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 320,
        "name": "Kihon-gata (migui e hidari)",
        "translation": "Rolamento lateral ajoelhado",
        "description": "Rolamento lateral dos dois lados",
        "execution": "Da posição ajoelhada, executar rolamento lateral suave para ambos os lados, protegendo a cabeça.",
        "application": "Forma básica de proteção lateral",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 321,
        "name": "Mae-mawara-ukemi",
        "translation": "Rolamento para frente",
        "description": "Rolamento frontal",
        "execution": "Rolar sobre o ombro diagonalmente até o quadril oposto, batendo o braço no final.",
        "application": "Proteção ao ser projetado para frente",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 322,
        "name": "Koho-kaiten-ukemi",
        "translation": "Rolamento para trás",
        "description": "Rolamento para trás com amortecimento",
        "execution": "Rolar para trás de forma diagonal sobre o ombro, batendo o braço no final.",
        "application": "Proteção em quedas para trás",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 323,
        "name": "Mae-ukemi",
        "translation": "Queda para frente",
        "description": "Amortecimento de queda frontal",
        "execution": "Cair de frente amortecendo com os antebraços paralelos, mantendo o corpo rígido.",
        "application": "Proteção em quedas frontais",
        "demoUrl": "https://www.youtube.com/watch?v=veM5RFdjo0U",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 324,
        "name": "Yoko-ukemi",
        "translation": "Queda lateral",
        "description": "Amortecimento de queda lateral",
        "execution": "Cair de lado batendo o braço estendido no tatame formando ângulo de 45°.",
        "application": "Proteção ao cair de lado",
        "demoUrl": "https://www.youtube.com/watch?v=JCwK1Ia4jsc",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 325,
        "name": "Eri-seoi-negue (Go-Kyô)",
        "translation": "Arremesso de ombro pela gola",
        "description": "Técnica de projeção de ombro",
        "execution": "Segurar a gola, girar entrando com o ombro sob o centro do oponente, projetá-lo sobre o ombro.",
        "application": "Projeção eficaz em curta distância",
        "demoUrl": "https://www.youtube.com/watch?v=L1deOa7c5Jo",
        "category": "NAGUE-WAZA - Tê-waza - Koshi-waza e Ashi-waza"
      },
      {
        "id": 326,
        "name": "Uki-goshi (Go-Kyô)",
        "translation": "Quadril flutuante",
        "description": "Projeção de quadril leve",
        "execution": "Entrar com o quadril sob o oponente, levantá-lo levemente e projetá-lo com movimento circular.",
        "application": "Projeção rápida e fluida",
        "demoUrl": "https://www.youtube.com/watch?v=bPKwtB4lyOQ",
        "category": "NAGUE-WAZA - Tê-waza - Koshi-waza e Ashi-waza"
      },
      {
        "id": 327,
        "name": "O-goshi (Go-Kyô)",
        "translation": "Grande quadril",
        "description": "Projeção de quadril forte",
        "execution": "Envolver a cintura, encaixar o quadril profundamente e projetar o oponente sobre as costas.",
        "application": "Técnica de quadril poderosa",
        "demoUrl": "https://www.youtube.com/watch?v=yhu1mfy2vJ4",
        "category": "NAGUE-WAZA - Tê-waza - Koshi-waza e Ashi-waza"
      },
      {
        "id": 328,
        "name": "De-ashi-barai (Go-Kyô)",
        "translation": "Varrida de pé avançado",
        "description": "Varrer o pé do oponente em movimento",
        "execution": "Varrer o pé do oponente no momento em que ele dá um passo, usando o tempo correto.",
        "application": "Técnica de timing e precisão",
        "demoUrl": "https://www.youtube.com/watch?v=4BUUvqxi_Kk",
        "category": "NAGUE-WAZA - Tê-waza - Koshi-waza e Ashi-waza"
      },
      {
        "id": 329,
        "name": "Sassae-tsuri-komi-ashi (Go-Kyô)",
        "translation": "Apoio e puxada do pé",
        "description": "Bloquear o pé e puxar",
        "execution": "Bloquear o pé do oponente com a planta do pé enquanto puxa para cima e para o lado.",
        "application": "Técnica de bloqueio eficaz",
        "demoUrl": "https://www.youtube.com/watch?v=699i--pvYmE",
        "category": "NAGUE-WAZA - Tê-waza - Koshi-waza e Ashi-waza"
      },
      {
        "id": 330,
        "name": "Ko-tsuri-goshi (Go-Kyô)",
        "translation": "Pequeno quadril suspenso",
        "description": "Projeção de quadril com suspensão",
        "execution": "Levantar o oponente com pegada por baixo do braço, encaixar o quadril e projetar.",
        "application": "Projeção com levantamento",
        "demoUrl": "https://www.youtube.com/watch?v=aNrgTx4--L0",
        "category": "NAGUE-WAZA - Tê-waza - Koshi-waza e Ashi-waza"
      },
      {
        "id": 331,
        "name": "Ko-uchi-gari X O-uchi-gari",
        "translation": "Combinação pequena ceifa interna com grande ceifa interna",
        "description": "Técnica combinada de ceifas",
        "execution": "Atacar com ko-uchi-gari e, na reação, aplicar o-uchi-gari.",
        "application": "Combinação de ataques de perna",
        "demoUrl": "https://www.youtube.com/watch?v=3Jb3tZvr9Ng",
        "category": "RENRAKU-HENKA-WAZA - Técnicas combinadas"
      },
      {
        "id": 332,
        "name": "O-uchi-gari X Tai-otoshi",
        "translation": "Combinação ceifa interna com derrubada de corpo",
        "description": "Técnica combinada",
        "execution": "Iniciar com o-uchi-gari e, na defesa, girar para tai-otoshi.",
        "application": "Combinação de ceifa com projeção",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "RENRAKU-HENKA-WAZA - Técnicas combinadas"
      },
      {
        "id": 333,
        "name": "O-uchi-gari X Ko-uchi-gari",
        "translation": "Combinação grande ceifa com pequena ceifa",
        "description": "Técnica combinada de ceifas",
        "execution": "Atacar com o-uchi-gari e, na movimentação defensiva, aplicar ko-uchi-gari.",
        "application": "Explorar reações do oponente",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "RENRAKU-HENKA-WAZA - Técnicas combinadas"
      },
      {
        "id": 334,
        "name": "O-uchi-gari X O-soto-gari",
        "translation": "Combinação ceifa interna com ceifa externa",
        "description": "Técnica combinada de ceifas opostas",
        "execution": "Fintar com o-uchi-gari e, quando o oponente recuar, aplicar o-soto-gari.",
        "application": "Combinação de lados opostos",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "RENRAKU-HENKA-WAZA - Técnicas combinadas"
      },
      {
        "id": 335,
        "name": "O-soto-gari X O-soto-otoshi",
        "translation": "Contra-ataque grande ceifa externa",
        "description": "Técnica de contra-golpe",
        "execution": "Defender o o-soto-gari e contra-atacar com o-soto-otoshi.",
        "application": "Contra-ataque eficaz",
        "demoUrl": "https://www.youtube.com/watch?v=c-A_nP7mKAc",
        "category": "KAESHI-WAZA - CONTRAGOLPES"
      },
      {
        "id": 336,
        "name": "Koshi-guruma X Ushiro-goshi",
        "translation": "Contra-ataque roda de quadril",
        "description": "Defesa e contra-golpe",
        "execution": "Defender o koshi-guruma e aplicar ushiro-goshi levantando por trás.",
        "application": "Contra-ataque de quadril",
        "demoUrl": "https://www.youtube.com/watch?v=SU7Id6uVJ44",
        "category": "KAESHI-WAZA - CONTRAGOLPES"
      },
      {
        "id": 337,
        "name": "Executar defesa (FUSEGUI) com as pernas em Katame-waza",
        "translation": "Defesa com pernas no solo",
        "description": "Técnica defensiva no trabalho de solo",
        "execution": "Usar as pernas para criar distância e impedir a aproximação do oponente no solo.",
        "application": "Defesa no ne-waza",
        "demoUrl": "",
        "category": "EXECUTAR DEFESA (FUSEGUI) COM AS PERNAS EM KATAME-WAZA"
      },
      {
        "id": 338,
        "name": "Passagem para imobilização - Técnica 1",
        "translation": "Uke de bruços deitado estendido",
        "description": "Passagem de guarda método 1",
        "execution": "Uke de bruços deitado estendido, pegar na faixa levantar, pegar na gola embaixo da axila e rolar para o lado e prender.",
        "application": "Transição para controle",
        "demoUrl": "",
        "category": "PASSAGEM PARA IMOBILIZAÇÃO"
      },
      {
        "id": 339,
        "name": "Passagem para imobilização - Técnica 2",
        "translation": "Uke de bruços encolhido",
        "description": "Passagem de guarda método 2",
        "execution": "Uke de bruços encolhido, igual ao anterior empurrar com a perna, girar o corpo e imobilizar.",
        "application": "Transição contra defesa encolhida",
        "demoUrl": "",
        "category": "PASSAGEM PARA IMOBILIZAÇÃO"
      },
      {
        "id": 340,
        "name": "Passagem para imobilização - Técnica 3",
        "translation": "Ajoelhar perto da cabeça",
        "description": "Passagem de guarda método 3",
        "execution": "Ajoelhar perto da cabeça, igual senkaku, puxar cotovelo com dois braços, colocar braço contrário, prender com o kimono ou faixa e ir puxando tudo para trás e imobilizando.",
        "application": "Controle pela cabeça",
        "demoUrl": "",
        "category": "PASSAGEM PARA IMOBILIZAÇÃO"
      },
      {
        "id": 341,
        "name": "Kuzure-kessa-gatame",
        "translation": "Imobilização lateral modificada",
        "description": "Controle lateral variado",
        "execution": "Variação do kesa-gatame com pegada diferente para maior controle.",
        "application": "Imobilização adaptada",
        "demoUrl": "https://www.youtube.com/watch?v=Q2fb9jaoUFQ",
        "category": "KATAME-WAZA - OSSAEKOMI-WAZA"
      },
      {
        "id": 342,
        "name": "Kuzure-yoko-shiho-gatame",
        "translation": "Imobilização lateral de quatro pontos modificada",
        "description": "Controle lateral variado",
        "execution": "Variação do yoko-shiho-gatame com pegadas alternativas.",
        "application": "Imobilização lateral forte",
        "demoUrl": "https://www.youtube.com/watch?v=3UEPeLUYeZk",
        "category": "KATAME-WAZA - OSSAEKOMI-WAZA"
      },
      {
        "id": 343,
        "name": "Makura-kessa-gatame",
        "translation": "Imobilização com travesseiro",
        "description": "Controle usando a perna como apoio",
        "execution": "Prender a cabeça do oponente com a coxa como travesseiro, aumentando o controle.",
        "application": "Imobilização com pressão na cabeça",
        "demoUrl": "https://www.youtube.com/watch?v=TipgWYYKHUg",
        "category": "KATAME-WAZA - OSSAEKOMI-WAZA"
      },
      {
        "id": 344,
        "name": "Ushiro-kesse-gatame",
        "translation": "Imobilização lateral por trás",
        "description": "Controle invertido",
        "execution": "Controlar o oponente sentando de costas para sua cabeça.",
        "application": "Imobilização de transição",
        "demoUrl": "https://www.youtube.com/watch?v=SBapox2M2dE",
        "category": "KATAME-WAZA - OSSAEKOMI-WAZA"
      },
      {
        "id": 345,
        "name": "Kuzure-tate-shiho-gatame",
        "translation": "Imobilização montada modificada",
        "description": "Montada com variação",
        "execution": "Variação da montada com controles diferentes dos braços.",
        "application": "Controle superior forte",
        "demoUrl": "https://www.youtube.com/watch?v=Sx7bgjx3O8Y",
        "category": "KATAME-WAZA - OSSAEKOMI-WAZA"
      }
    ]
  },
  {
    "id": 4,
    "name": "5º Kyu - Faixa Laranja",
    "color": "bg-orange-500",
    "textColor": "text-white",
    "ageGroup": "Idade Mínima 10 anos",
    "prerequisites": "Carência CBJ 1 ano na faixa anterior",
    "information": "A faixa laranja representa o sol nascente. Candidatos Adultos: 2 imobilizações e o restante do solo. Foco em defesas de técnicas em pé.",
    "beltImage": "assets/belts/laranja.png",
    "techniques": [
      {
        "id": 501,
        "name": "Judô",
        "translation": "Caminho da suavidade",
        "description": "Significado completo do termo Judô",
        "execution": "Conhecimento teórico - Pergunta: O que significa Judô? R: Caminho da suavidade - DÔ= Meio, Caminho - JU= Suavidade, não resistência.",
        "application": "Compreensão filosófica profunda",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 502,
        "name": "1º Campeonato Brasileiro de Judô",
        "translation": "1954",
        "description": "História do judô no Brasil",
        "execution": "Conhecimento teórico - Pergunta: Quando foi realizado o 1° Campeonato Brasileiro de Judô? R: 1954.",
        "application": "História do judô brasileiro",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 503,
        "name": "Jita-kyôei",
        "translation": "Amizade e prosperidade mútuas",
        "description": "Princípio fundamental do judô",
        "execution": "Conhecimento teórico - Pergunta: O QUE É Jita-kyôei? R: Amizade e prosperidade mútuas.",
        "application": "Valores sociais do judô",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 504,
        "name": "Seiryoku-zen-yô",
        "translation": "Mínimo esforço com o máximo resultado",
        "description": "Princípio de eficiência do judô",
        "execution": "Conhecimento teórico - Pergunta: O que é Seiryoku-zen-yô? R: Mínimo esforço com o máximo resultado, melhor uso da energia vital.",
        "application": "Eficiência e economia de energia",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 505,
        "name": "Demonstrar defesas de técnicas em pé",
        "translation": "Defesas de Nague-waza",
        "description": "Capacidade de defender projeções",
        "execution": "Demonstrar habilidade em defender técnicas de projeção em pé.",
        "application": "Defesa e contra-ataque",
        "demoUrl": "",
        "category": "PERGUNTAS"
      },
      {
        "id": 506,
        "name": "Chokuritsu",
        "translation": "Postura em pé natural",
        "description": "Postura ereta fundamental",
        "execution": "Manter-se em pé com postura ereta, pés paralelos na largura dos ombros.",
        "application": "Postura básica",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 507,
        "name": "Seiza",
        "translation": "Postura ajoelhada",
        "description": "Postura de respeito",
        "execution": "Ajoelhar-se com os joelhos juntos, sentar sobre os calcanhares, mãos sobre as coxas.",
        "application": "Postura de respeito e meditação",
        "demoUrl": "https://www.youtube.com/watch?v=BBZG9N4cW0U",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 508,
        "name": "Jigotai",
        "translation": "Postura defensiva",
        "description": "Postura defensiva com base larga",
        "execution": "Pés afastados, centro de gravidade baixo, postura forte e estável.",
        "application": "Resistência a projeções",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 509,
        "name": "Sizen-hontai",
        "translation": "Postura natural fundamental",
        "description": "Postura natural com pés paralelos",
        "execution": "Pés paralelos na largura dos ombros, joelhos levemente flexionados.",
        "application": "Postura base",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 510,
        "name": "Migui-shizentai",
        "translation": "Postura natural direita",
        "description": "Postura de combate com pé direito avançado",
        "execution": "Pé direito à frente, corpo equilibrado.",
        "application": "Postura de combate para canhotos",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 511,
        "name": "Hidari-shizentai",
        "translation": "Postura natural esquerda",
        "description": "Postura de combate com pé esquerdo avançado",
        "execution": "Pé esquerdo à frente, corpo equilibrado.",
        "application": "Postura de combate para destros",
        "demoUrl": "",
        "category": "SHISEI - Posturas"
      },
      {
        "id": 512,
        "name": "Ushiro-ukemi-zai",
        "translation": "Batida de mão para trás",
        "description": "Queda para trás",
        "execution": "Bater os braços estendidos no tatame formando ângulo de 45°, queixo no peito.",
        "application": "Proteção ao cair de costas",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 513,
        "name": "Kihon-gata - Migui e hidari",
        "translation": "Rolamento lateral básico ambos lados",
        "description": "Rolamento lateral dos dois lados",
        "execution": "Executar rolamento lateral para direita e esquerda.",
        "application": "Forma básica de proteção lateral",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 514,
        "name": "Zempô-kaiten-ukemi - Migui e hidari",
        "translation": "Rolamento frontal avançado ambos lados",
        "description": "Rolamento para frente dos dois lados",
        "execution": "Rolar para frente sobre ambos os ombros (direito e esquerdo).",
        "application": "Proteção avançada frontal",
        "demoUrl": "",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 515,
        "name": "Koho-kaiten-ukemi",
        "translation": "Rolamento para trás",
        "description": "Rolamento posterior com amortecimento",
        "execution": "Rolar para trás de forma diagonal sobre o ombro.",
        "application": "Proteção em quedas para trás",
        "demoUrl": "",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 516,
        "name": "Ushiro-ukemi (tyogoshi)",
        "translation": "Queda para trás alta",
        "description": "Queda para trás de altura elevada",
        "execution": "Queda para trás de posição elevada com amortecimento correto.",
        "application": "Proteção em quedas altas",
        "demoUrl": "https://www.youtube.com/watch?v=_g7rvsxTkz8",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 517,
        "name": "Mae-ukemi",
        "translation": "Queda para frente",
        "description": "Amortecimento de queda frontal",
        "execution": "Cair de frente amortecendo com os antebraços paralelos.",
        "application": "Proteção em quedas frontais",
        "demoUrl": "https://www.youtube.com/watch?v=veM5RFdjo0U",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 518,
        "name": "Mae-mawara-ukemi",
        "translation": "Rolamento para frente",
        "description": "Rolamento frontal circular",
        "execution": "Rolar sobre o ombro diagonalmente até o quadril oposto.",
        "application": "Proteção ao ser projetado para frente",
        "demoUrl": "https://www.youtube.com/watch?v=VoktcQAxEPg",
        "category": "UKEMIS - Rolamentos - Quedas"
      },
      {
        "id": 519,
        "name": "Mae-sabaki",
        "translation": "Esquiva com movimento para frente",
        "description": "Esquiva avançando",
        "execution": "Mover-se para frente esquivando do ataque do oponente.",
        "application": "Esquiva ofensiva",
        "demoUrl": "https://www.youtube.com/watch?v=zbBtzBd9Eg4",
        "category": "TAI-SABAKI (Esquivas)"
      },
      {
        "id": 520,
        "name": "Yokô-sabaki",
        "translation": "Esquiva com movimento para o lado",
        "description": "Esquiva lateral",
        "execution": "Mover-se lateralmente para esquivar do ataque.",
        "application": "Esquiva lateral rápida",
        "demoUrl": "https://www.youtube.com/watch?v=zbBtzBd9Eg4",
        "category": "TAI-SABAKI (Esquivas)"
      },
      {
        "id": 521,
        "name": "Mawari-sabai",
        "translation": "Esquiva com movimento em volta",
        "description": "Esquiva circular",
        "execution": "Girar em volta do oponente para esquivar e posicionar-se.",
        "application": "Esquiva circular estratégica",
        "demoUrl": "https://www.youtube.com/watch?v=zbBtzBd9Eg4",
        "category": "TAI-SABAKI (Esquivas)"
      },
      {
        "id": 522,
        "name": "Ushiro-sabaki",
        "translation": "Esquiva com movimento para trás",
        "description": "Esquiva recuando",
        "execution": "Recuar para esquivar do ataque mantendo postura.",
        "application": "Esquiva defensiva",
        "demoUrl": "https://www.youtube.com/watch?v=zbBtzBd9Eg4",
        "category": "TAI-SABAKI (Esquivas)"
      },
      {
        "id": 523,
        "name": "Dê-ashi-barai (Go-kyô)",
        "translation": "Varrida de pé avançado",
        "description": "Primeira técnica do Dai-Ikkyô",
        "execution": "Varrer o pé do oponente no momento exato do passo.",
        "application": "Técnica de timing perfeito",
        "demoUrl": "https://www.youtube.com/watch?v=zbBtzBd9Eg4",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 524,
        "name": "Hiza-guruma (Go-kyô)",
        "translation": "Roda de joelho",
        "description": "Técnica bloqueando o joelho",
        "execution": "Bloquear o joelho do oponente com o pé enquanto puxa para o lado.",
        "application": "Projeção com bloqueio de joelho",
        "demoUrl": "https://www.youtube.com/watch?v=JPJx9-oAVns",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 525,
        "name": "Sassae-Tsuri-komi-ashi (Go-kyô)",
        "translation": "Apoio e puxada do pé",
        "description": "Bloqueio de pé com puxada",
        "execution": "Bloquear o pé e puxar para cima e para o lado.",
        "application": "Técnica de bloqueio eficaz",
        "demoUrl": "https://www.youtube.com/watch?v=699i--pvYmE",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 526,
        "name": "Uki-goshi (Go-kyô)",
        "translation": "Quadril flutuante",
        "description": "Projeção de quadril leve",
        "execution": "Levantar o oponente com o quadril e projetar com movimento circular.",
        "application": "Projeção rápida e fluida",
        "demoUrl": "https://www.youtube.com/watch?v=bPKwtB4lyOQ",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 527,
        "name": "Sode-tsuri-komi-goshi",
        "translation": "Quadril com puxada pela manga",
        "description": "Projeção de quadril pela manga",
        "execution": "Segurar a manga e projetar com o quadril puxando para cima.",
        "application": "Projeção controlada pela manga",
        "demoUrl": "https://www.youtube.com/watch?v=QsmAxpmYLOI",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 528,
        "name": "Seoi-otoshi",
        "translation": "Queda de ombro",
        "description": "Projeção de ombro com queda",
        "execution": "Entrar com o ombro e deixar o próprio corpo cair para projetar.",
        "application": "Variação de seoi-nage",
        "demoUrl": "https://www.youtube.com/watch?v=vu1TMVNnq34",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 529,
        "name": "Ko-tsuri-koshi",
        "translation": "Pequeno quadril suspenso",
        "description": "Projeção de quadril com suspensão",
        "execution": "Levantar o oponente com pegada por baixo do braço e projetar.",
        "application": "Projeção com levantamento",
        "demoUrl": "https://www.youtube.com/watch?v=51Htlp7xEvE",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 530,
        "name": "O-soto-gari (Go-kyô)",
        "translation": "Grande ceifa externa",
        "description": "Ceifa externa poderosa",
        "execution": "Ceifar a perna externa do oponente com força.",
        "application": "Projeção potente para trás",
        "demoUrl": "https://www.youtube.com/watch?v=c-A_nP7mKAc",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 531,
        "name": "O-goshi (Go-kyô)",
        "translation": "Grande quadril",
        "description": "Projeção de quadril forte",
        "execution": "Encaixar o quadril profundamente e projetar sobre as costas.",
        "application": "Técnica de quadril poderosa",
        "demoUrl": "https://www.youtube.com/watch?v=yhu1mfy2vJ4",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 532,
        "name": "O-uchi-gari (Go-kyô)",
        "translation": "Grande ceifa interna",
        "description": "Ceifa interna poderosa",
        "execution": "Ceifar a perna interna do oponente por dentro.",
        "application": "Projeção de ceifa interna",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 533,
        "name": "Morotê-seoi-nague (Go-gyô)",
        "translation": "Arremesso de ombro com duas mãos",
        "description": "Seoi-nage com pegada dupla",
        "execution": "Segurar com as duas mãos e projetar sobre o ombro.",
        "application": "Projeção de ombro forte",
        "demoUrl": "https://www.youtube.com/watch?v=UjtL1h9htb8",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 534,
        "name": "O-soto-guruma",
        "translation": "Grande roda externa",
        "description": "Roda com bloqueio externo",
        "execution": "Bloquear a perna externa e girar o oponente em círculo.",
        "application": "Projeção circular externa",
        "demoUrl": "https://www.youtube.com/watch?v=92KbCm6pQeI",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 535,
        "name": "O-tsuri-goshi",
        "translation": "Grande quadril suspenso",
        "description": "Projeção de quadril com levantamento",
        "execution": "Levantar o oponente pela faixa e projetar com o quadril.",
        "application": "Projeção com levantamento completo",
        "demoUrl": "https://www.youtube.com/watch?v=51Htlp7xEvE",
        "category": "DAI-IKKYÔ 1ª SÉRIE"
      },
      {
        "id": 536,
        "name": "O-uchi-gari X Tai-otoshi",
        "translation": "Combinação ceifa interna com derrubada",
        "description": "Técnica combinada",
        "execution": "Iniciar com o-uchi-gari e, na defesa, aplicar tai-otoshi.",
        "application": "Combinação eficaz",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "RENRAKU-HENKA-WAZA"
      },
      {
        "id": 537,
        "name": "O-uchi-gari X Sassae-tsuri-komi-ashi",
        "translation": "Combinação ceifa interna com bloqueio de pé",
        "description": "Técnica combinada",
        "execution": "Fintar o-uchi-gari e aplicar sassae-tsuri-komi-ashi.",
        "application": "Combinação de ceifa com bloqueio",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "RENRAKU-HENKA-WAZA"
      },
      {
        "id": 538,
        "name": "Koshi-guruma X O-uchi-gari",
        "translation": "Combinação roda de quadril com ceifa interna",
        "description": "Técnica combinada",
        "execution": "Ameaçar com koshi-guruma e aplicar o-uchi-gari.",
        "application": "Combinação de quadril com ceifa",
        "demoUrl": "https://www.youtube.com/watch?v=SU7Id6uVJ44",
        "category": "RENRAKU-HENKA-WAZA"
      },
      {
        "id": 539,
        "name": "O-uchi-gari X Ippon-seoi-negue",
        "translation": "Combinação ceifa com seoi-nage",
        "description": "Técnica combinada",
        "execution": "Atacar com o-uchi-gari e girar para ippon-seoi-nage.",
        "application": "Combinação poderosa",
        "demoUrl": "https://www.youtube.com/watch?v=0itJFhV9pDQ",
        "category": "RENRAKU-HENKA-WAZA"
      },
      {
        "id": 540,
        "name": "O-soto-gari X O-soto-otoshi",
        "translation": "Contra-ataque grande ceifa externa",
        "description": "Contra-golpe de o-soto-gari",
        "execution": "Defender o-soto-gari e contra-atacar com o-soto-otoshi.",
        "application": "Contra-ataque eficaz",
        "demoUrl": "https://www.youtube.com/watch?v=c-A_nP7mKAc",
        "category": "KAESHI-WAZA"
      },
      {
        "id": 541,
        "name": "Dê-ashi-barai X Tsubame-gaeshi",
        "translation": "Contra-ataque varrida de pé",
        "description": "Contra-golpe de de-ashi-barai",
        "execution": "Defender de-ashi-barai e contra-atacar com tsubame-gaeshi.",
        "application": "Contra-ataque técnico",
        "demoUrl": "https://www.youtube.com/watch?v=zbBtzBd9Eg4",
        "category": "KAESHI-WAZA"
      },
      {
        "id": 542,
        "name": "Koshi-guruma X Ushiro-goshi",
        "translation": "Contra-ataque roda de quadril",
        "description": "Contra-golpe de koshi-guruma",
        "execution": "Defender koshi-guruma e aplicar ushiro-goshi.",
        "application": "Contra-ataque de quadril",
        "demoUrl": "https://www.youtube.com/watch?v=SU7Id6uVJ44",
        "category": "KAESHI-WAZA"
      },
      {
        "id": 543,
        "name": "Koshi-guruma X Utsushi-goshi",
        "translation": "Contra-ataque roda de quadril variante",
        "description": "Contra-golpe com transição de quadril",
        "execution": "Defender koshi-guruma e contra-atacar com utsushi-goshi.",
        "application": "Contra-ataque técnico de quadril",
        "demoUrl": "https://www.youtube.com/watch?v=SU7Id6uVJ44",
        "category": "KAESHI-WAZA"
      },
      {
        "id": 544,
        "name": "Passagem para imobilização",
        "translation": "Uke de bruços encolhido",
        "description": "Técnica de passagem de guarda",
        "execution": "Uke de bruços encolhido, na defesa do Uke, colocar o mão entre as pernas no 'buraco', segurar a manga, gola ou faixa e puxar 1° na direção da perna para ficar com o braço na coxa, depois empurrar pressionando o ombro para o chão e lado.",
        "application": "Transição para controle no solo",
        "demoUrl": "",
        "category": "PASSAGEM PARA IMOBILIZAÇÃO"
      }
    ]
  },
  {
    "id": 5,
    "name": "4º Kyu - Faixa Verde",
    "color": "bg-green-600",
    "textColor": "text-white",
    "ageGroup": "12 a 13 anos",
    "prerequisites": "Domínio das técnicas anteriores e início de combinações (renraku-waza).",
    "information": "A faixa verde simboliza o crescimento e a vegetação. O judoca desenvolve a força e a resistência, aplicando técnicas com mais vigor.",
    "beltImage": "assets/belts/verde.png",
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
        "id": 639,
        "name": "Hane-Goshi",
        "translation": "Projeção de quadril saltitante",
        "description": "Técnica de quadril explosiva onde a perna é usada para empurrar a coxa do oponente.",
        "execution": "Entrar com o quadril baixo, colocar a coxa sob o quadril do oponente e levantar com um movimento de mola para projetá-lo.",
        "application": "Técnica dinâmica e poderosa, eficaz contra oponentes que se movem para frente.",
        "demoUrl": "https://www.youtube.com/watch?v=M9_7De6A1kk",
        "category": "Técnicas de Quadril (Koshi-waza)"
      },
      {
        "id": 633,
        "name": "Tomoe-Nage",
        "translation": "Projeção em círculo",
        "description": "Técnica de sacrifício frontal (Ma-sutemi-waza) em que o tori se joga para trás.",
        "execution": "O tori desequilibra o uke para frente, cai para trás, coloca o pé em seu abdômen e o projeta por cima da cabeça.",
        "application": "Eficaz contra um oponente que está empurrando ou avançando com força.",
        "demoUrl": "https://www.youtube.com/watch?v=880WbHvHv6A",
        "category": "Técnicas de Sacrifício Frontal (Ma-Sutemi-waza)"
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
    "id": 6,
    "name": "Faixa Roxa",
    "color": "bg-purple-600",
    "textColor": "text-white",
    "ageGroup": "14 a 15 anos",
    "prerequisites": "Boa execução de combinações e contra-ataques (kaeshi-waza).",
    "information": "A faixa roxa representa a nobreza e a sabedoria. O judoca começa a desenvolver um pensamento mais estratégico durante o combate.",
    "beltImage": "assets/belts/roxa.png",
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
    "id": 7,
    "name": "Faixa Marrom",
    "color": "bg-yellow-800",
    "textColor": "text-white",
    "ageGroup": "A partir de 16 anos",
    "prerequisites": "Maturidade técnica e tática, domínio de um tokui-waza (técnica preferida).",
    "information": "A faixa marrom simboliza a solidez e a maturidade. É a última etapa antes da faixa preta, exigindo grande dedicação e polimento técnico.",
    "beltImage": "assets/belts/marrom.png",
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
    "id": 8,
    "name": "Faixa Preta",
    "color": "bg-black",
    "textColor": "text-white",
    "ageGroup": "A partir de 18 anos (geralmente)",
    "prerequisites": "Excelência em todos os princípios do Judô, conhecimento de katas e aprovação em exame rigoroso.",
    "information": "A faixa preta (Yudansha) não é o fim, mas o começo de uma nova jornada de aprendizado. Simboliza que o judoca dominou os fundamentos e está pronto para aprofundar seu conhecimento.",
    "beltImage": "assets/belts/preta.png",
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