# pokethnos_java

- **backend/** — Java 17 + Spring Boot. Toda a lógica de domínio e as regras do jogo (tribos, bandos, eras, pontuação, controle de regiões) expostas como API REST. Estado da partida mantido em memória (sem banco de dados).
- **frontend/** — React (Vite). Interface do jogo, consumindo a API do backend.

## Regras do Jogo

Pokéthnos é um jogo de controle de regiões baseado em *Ethnos*, de Paolo Mori. De 2 a 6 jogadores competem para se tornar o Grande Mestre das seis regiões do mundo Pokémon. Ao longo de duas ou três Eras (dependendo do número de jogadores), cada jogador recruta Bandos de Pokémon aliados, posiciona sua influência nas regiões e usa as habilidades únicas de cada classe para acumular Glória. Quem tiver mais Glória ao fim da última Era vence.

> **Simplificação em relação ao Ethnos original:** Pokéthnos remove todos os tabuleiros auxiliares e marcadores de tribos específicas (tabuleiro de Orcs, tabuleiro do Povo do Mar, fichas de Troll, ficha de Gigante). Toda a ação acontece no mapa principal e nas cartas.
>
> **Nova mecânica: Evolução.** Cada classe possui cartas de Pokémon base e cartas de Pokémon evoluído. Quando um Pokémon evoluído é escolhido como Líder do Bando, ele ativa uma versão aprimorada (BUFF) da habilidade da sua classe.

### Componentes

- **72 cartas de Pokémon** — 6 classes × 6 regiões × 2 cartas (base + evoluído)
- **3 cartas de Dragão** — Dratini, Dragonair e Dragonite
- **1 mapa** com as 6 Regiões
- **Marcadores de Controle** por cor de jogador (26 por jogador)
- **1 Trilha de Glória** com fichas numeradas por Região

### As Seis Regiões

| Cor | Região |
|---|---|
| Marrom | Deserto |
| Verde | Floresta Densa |
| Vermelho | Vulcão em Erupção |
| Azul | Templo do Mar |
| Roxo | Cemitério |
| Cinza | Cidade Abandonada |

A cor de uma carta de Pokémon indica a região que ela representa.

### As Seis Classes e Suas Habilidades

Cada classe tem 12 cartas: 1 Pokémon base e 1 Pokémon evoluído por região. Somente o **Líder** do Bando ativa sua habilidade. Se o Líder for um Pokémon **base**, usa-se a habilidade normal; se for **evoluído**, usa-se a versão aprimorada (BUFF).

| Classe | Base | Evoluído (BUFF) |
|---|---|---|
| **Voadores** | *Planagem* — ao colocar um marcador com este Bando, você pode colocá-lo em **qualquer** Região do mapa, independente da cor do Líder — desde que o Bando seja grande o suficiente para a posição desejada *naquela* Região. | *Planagem Supersônica* — igual ao base, e ao colocar o marcador em uma Região diferente da cor do Líder, você precisa de **1 carta a menos** do que normalmente seria necessário para essa posição. |
| **Venenosos** | *Veneno Paralisante* — após jogar seu Bando, escolha **1 carta** com a face para cima na mesa (se houver alguma disponível) e remova-a do jogo até o fim da Era. Ela não pode ser recrutada por nenhum jogador. | *Veneno Letal* — após jogar seu Bando, escolha **até 2 cartas** com a face para cima na mesa e remova-as do jogo até o fim da Era. |
| **Psíquicos** | *Visão Futura* — após jogar seu Bando e descartar as cartas restantes da mão, compre **1 carta** do topo do Deck de Aliados para a sua mão. | *Mente Expandida* — compre do topo do Deck uma quantidade de cartas igual ao **número de cartas no Bando jogado** (máximo de 3). |
| **Metálicos** | *Corpo de Aço* — ao jogar este Bando, conte-o como se tivesse **1 carta a mais**, tanto para fins de colocar marcadores de Controle quanto para calcular a Glória pelo tamanho do Bando. | *Armadura Suprema* — conte-o como se tivesse **2 cartas a mais** para os mesmos fins. |
| **Fadas** | *Magia Encantadora* — após jogar seu Bando, em vez de descartar todas as cartas restantes, você pode manter na mão um número de cartas igual ao **tamanho do Bando jogado**. Descarte o restante face para cima. | *Encantamento Eterno* — mantenha **todas** as cartas restantes na mão; não descarte nenhuma. |
| **Lutadores** | *Golpe Duplo* — após jogar seu Bando e colocar um marcador de Controle (se aplicável), você pode jogar imediatamente um segundo Bando com as cartas restantes da sua mão. O segundo Bando segue as regras normais (1 a 10 cartas da mesma cor **ou** da mesma Classe), mas a habilidade do seu Líder **não** é ativada — o marcador do 2° Bando segue apenas a regra padrão de posição na região do próprio Líder. | *Combo Devastador* — igual ao base, mas o segundo Bando jogado **também ativa normalmente** a habilidade do seu Líder (incluindo, por exemplo, a Planagem de um Líder Voador ou a compra de um Líder Psíquico). |

### Cartas de Dragão

As três cartas de Dragão (Dratini, Dragonair, Dragonite) são embaralhadas na metade inferior do Deck de Aliados apenas na preparação da **Primeira Era** — elas não retornam ao baralho depois de sacadas. Qualquer carta de Dragão que seja revelada **encerra a Era corrente imediatamente** (o turno em andamento termina sem completar-se e a fase de pontuação começa). Como só existe uma Era por Dragão sacado, o **último Dragão da partida** — o 2° (Dragonair) em jogos de 2-3 jogadores (2 Eras), ou o 3° (Dragonite) em jogos de 4-6 jogadores (3 Eras) — é o que efetivamente encerra o jogo.

> **Nota:** As cartas de Dragão não pertencem a nenhuma classe nem região. Elas nunca fazem parte de um Bando de Aliados e nunca podem ser recrutadas da mesa.

### Preparação Inicial

1. Posicione o mapa no centro da mesa.
2. Em cada Região, coloque 3 fichas de Glória com a face para cima (em ordem crescente: menor na posição I, maior na posição III).
3. Cada jogador escolhe uma cor, pega seus marcadores de Controle e coloca um deles no espaço "0" da Trilha de Glória.
4. Embaralhe todas as 75 cartas (72 Pokémon + 3 Dragão) para formar o Deck de Aliados, com os 3 Dragões distribuídos na metade inferior do deck (ver "Iniciando uma Nova Era").
5. Inicie a Primeira Era.

### Iniciando uma Nova Era

1. Cada jogador saca **1 carta** do Deck de Aliados e a adiciona à sua mão.
2. Revele uma quantidade de cartas igual ao **dobro do número de jogadores** e coloque-as com a face para cima próximas ao tabuleiro.
3. **Somente na Primeira Era:** divida o restante do Deck em duas pilhas iguais, embaralhe as 3 cartas de Dragão em uma delas e coloque-a *embaixo* da outra — os Dragões ficam assim distribuídos ao longo do deck, um por Era, e não são reembaralhados nas Eras seguintes.
4. Defina o Jogador Inicial: aleatoriamente na Primeira Era; nas Eras seguintes, o jogador com **menos Glória** começa (empate: o mais próximo, em sentido horário, de quem sacou o Dragão que encerrou a Era anterior).

### Jogando um Turno

Em seu turno, escolha **uma** destas duas ações:

**Recrutar um Aliado**
1. Saque **1 carta**: escolha uma das cartas com a face para cima na mesa *ou* a carta do topo do Deck.
2. Adicione-a à sua mão.
3. Se sacou uma carta face para cima, **não** a reponha imediatamente.
4. Se sacou uma carta de Dragão do Deck, ela encerra a Era imediatamente (ver "Cartas de Dragão").

> Limite de mão: se você já tiver 10 cartas, não pode recrutar — deve jogar um Bando.

**Jogar um Bando de Aliados**
1. Coloque à sua frente de 1 a 10 cartas da mesma **cor** ou da mesma **Classe**.
2. Escolha 1 carta do Bando para ser o **Líder** e coloque-a sobre o Bando.
3. Se o Bando for grande o suficiente, coloque 1 marcador de Controle na Região correspondente à cor do Líder (a menos que a habilidade diga o contrário).
4. Ative a habilidade do Líder (base ou evoluída, dependendo da carta).
5. Descarte as cartas restantes da sua mão face para cima na mesa (salvo habilidades que permitam manter cartas).

**Colocando Marcadores de Controle:** você só pode colocar um marcador de Controle em uma Região se houver **menos marcadores** da sua cor naquela Região do que a quantidade de cartas no Bando. Por exemplo: para colocar seu *segundo* marcador em uma Região, você precisa de um Bando com pelo menos 2 cartas.

### Glória no Fim de uma Era

Quando o último Dragão de uma Era é sacado, a Era termina. Todos os jogadores descartam as cartas das mãos. Então:

**1. Glória pelas Regiões**

| Era | Pontuação |
|---|---|
| Primeira Era | O jogador com mais marcadores em cada Região ganha os pontos da ficha na posição **I**. |
| Segunda Era (partidas de 4-6 jogadores) | 1° lugar ganha posição **II**. 2° lugar ganha posição **I**. |
| Terceira Era (partidas de 4-6 jogadores) | 1° lugar → posição **III**. 2° lugar → posição **II**. 3° lugar → posição **I**. |
| Segunda Era = Era final (partidas de 2-3 jogadores) | 1° lugar ganha as posições **I e II somadas**. 2° lugar não ganha pontos dessa Região (se apenas um jogador tiver marcadores ali, ele ganha a soma das duas fichas). |

Em caso de empate em uma Região, some os pontos de **todas as posições em disputa pelo grupo empatado** e divida igualmente entre eles (arredonde para baixo). Por exemplo, em uma Terceira Era com fichas I=2/II=4/III=6, se dois jogadores empatam na frente (mais marcadores), eles dividem (III+II)/2 = (6+4)/2 = 5 pontos cada, e o 3° colocado recebe a ficha I normalmente.

**2. Glória pelos Bandos de Aliados**

Cada jogador pontua por cada Bando que jogou durante a Era, de acordo com seu tamanho (contando os bônus dos Metálicos, se houver):

| Cartas no Bando | Glória Conquistada |
|---|---|
| 1 | 0 |
| 2 | 1 |
| 3 | 3 |
| 4 | 6 |
| 5 | 10 |
| 6 ou mais | 15 |

### Nova Era e Fim da Partida

Após a pontuação, todos descartam seus Bandos. Se ainda restam Eras, inicie a próxima (os marcadores de Controle no mapa permanecem). Ao fim da última Era, a partida termina: o jogador com mais Glória é o Grande Mestre.

**Empate final:** vence quem tiver mais marcadores de Controle no tabuleiro. Se ainda empatado, vence quem jogou o maior Bando na última Era; persistindo o empate, compara-se o segundo maior Bando de cada um, e assim por diante.

### Partidas com 2 ou 3 Jogadores

- Apenas **duas Eras**.
- Remova as fichas de Glória marcadas com "4+" antes de embaralhar.
- Na Segunda Era (Era final), veja a regra especial de pontuação por Regiões acima.

## Como rodar

### 1. Backend

Requer Docker e Docker Compose. Na raiz do projeto:

```bash
docker compose up --build
```

- backend em `http://localhost:8080`
- frontend em `http://localhost:5173`

O `frontend/Dockerfile` recebe `VITE_API_BASE_URL` como build arg (padrão `http://localhost:8080`, já configurado no `docker-compose.yml`) — a Vite embute essa URL no bundle estático em tempo de build, então ela precisa ser o endereço que o **navegador** vai usar para falar com o backend, não o nome do serviço dentro da rede do Compose. Se for publicar em outro host/porta, ajuste esse valor e rode `docker compose build frontend` de novo.

Para derrubar: `docker compose down`.

## Arquitetura

O jogo original roda inteiramente no navegador, com um objeto de estado global (`GerenciadorJogo`) e habilidades de tribo implementadas como callbacks síncronos que abrem modais e esperam o clique do jogador (padrão Strategy + State, ambos preservados aqui).

Como o backend não pode "pausar" uma requisição HTTP esperando um clique, esse fluxo foi convertido em uma máquina de estados explícita:

- Cada ação do jogador é um endpoint REST (`POST /api/games/{id}/actions/...`) que avança a partida o quanto for possível sem intervenção do jogador.
- Quando uma habilidade precisa de uma escolha (ex.: Voadores escolhendo a região do marcador, Venenosos escolhendo cartas para remover, Fadas escolhendo cartas para manter, Lutadores decidindo jogar um 2° Bando), o backend pausa e retorna um `pendingDecision` no estado da partida, com as opções válidas já calculadas.
- O frontend renderiza o modal correspondente e chama o endpoint de resolução daquela decisão, que retoma o fluxo de onde parou.

Principais pacotes do backend (`backend/src/main/java/com/pokethnos/`):

- `domain/` — classes de domínio (Carta, CartaPokemon, CartaDragao, Bando, Jogador, Regiao, Tribo, Baralho, Tabuleiro, MarcadorRegiao), espelhando `js/models.js`.
- `strategy/` — uma `EstrategiaHabilidade` por tribo (Voadores, Venenosos, Psíquicos, Metálicos, Fadas, Lutadores), espelhando `js/strategies.js`.
- `engine/` — `GerenciadorJogo` (estado da partida), `GameData` (dados estáticos: regiões, tribos, cartas, tokens de glória), `ScoringService` (pontuação de era).
- `service/GameService` — orquestra o ciclo de vida da partida e a máquina de estados de turno.
- `web/` — controller REST, DTOs e o mapeamento de estado interno → JSON.