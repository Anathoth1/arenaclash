/*
 * CLASH ARENA - Jogo estilo Clash Royale
 * Versão 2.0 - Código robusto e otimizado
 */

// ==================== CONFIGURAÇÕES ====================
const CONFIG = {
    GAME_DURATION: 180,
    MAX_ELIXIR: 10,
    ELIXIR_RATE: 0.035,
    TOWER_RANGE: 120,
    TOWER_DAMAGE: 80,
    TOWER_ATTACK_SPEED: 800,
    KING_TOWER_HP: 4000,
    PRINCESS_TOWER_HP: 2500
};

// ==================== SPRITES DOS PERSONAGENS ====================
const SPRITES = {
    knight: {
        body: '#f4a460',
        armor: '#708090',
        helmet: '#4a4a4a',
        weapon: '#c0c0c0',
        shield: '#8b4513'
    },
    archer: {
        body: '#ffdbac',
        hair: '#8b4513',
        outfit: '#228b22',
        bow: '#8b4513',
        cape: '#006400'
    },
    giant: {
        body: '#d2691e',
        pants: '#4a4a4a',
        belt: '#8b4513',
        hair: '#2f1810'
    },
    minion: {
        body: '#4169e1',
        wings: '#87ceeb',
        horns: '#ffd700',
        eyes: '#ff0000'
    },
    skeleton: {
        bones: '#f5f5dc',
        eyes: '#ff4444',
        weapon: '#8b4513'
    },
    musketeer: {
        body: '#ffdbac',
        hair: '#ffd700',
        outfit: '#4169e1',
        hat: '#191970',
        gun: '#696969'
    },
    valkyrie: {
        body: '#ffdbac',
        hair: '#ff6347',
        armor: '#cd853f',
        axe: '#c0c0c0',
        cape: '#8b0000'
    },
    wizard: {
        body: '#ffdbac',
        robe: '#4b0082',
        beard: '#dcdcdc',
        staff: '#8b4513',
        orb: '#00ffff'
    }
};

// ==================== DEFINIÇÃO DAS CARTAS ====================
const CARDS = {
    knight: {
        name: 'Cavaleiro',
        icon: '🗡️',
        cost: 3,
        hp: 800,
        damage: 90,
        speed: 1.0,
        range: 25,
        attackSpeed: 1100,
        type: 'melee',
        color: '#f39c12',
        sprite: 'knight'
    },
    archer: {
        name: 'Arqueira',
        icon: '🏹',
        cost: 3,
        hp: 300,
        damage: 60,
        speed: 0.9,
        range: 110,
        attackSpeed: 900,
        type: 'ranged',
        count: 2,
        color: '#e91e63',
        sprite: 'archer'
    },
    giant: {
        name: 'Gigante',
        icon: '👹',
        cost: 5,
        hp: 2500,
        damage: 150,
        speed: 0.5,
        range: 25,
        attackSpeed: 1500,
        type: 'melee',
        targetBuildings: true,
        color: '#795548',
        sprite: 'giant'
    },
    minion: {
        name: 'Lacaios',
        icon: '👿',
        cost: 3,
        hp: 180,
        damage: 50,
        speed: 1.4,
        range: 45,
        attackSpeed: 700,
        type: 'ranged',
        flying: true,
        count: 3,
        color: '#3f51b5',
        sprite: 'minion'
    },
    fireball: {
        name: 'Bola de Fogo',
        icon: '🔥',
        cost: 4,
        damage: 400,
        radius: 70,
        type: 'spell',
        color: '#ff5722'
    },
    skeleton: {
        name: 'Esqueletos',
        icon: '💀',
        cost: 1,
        hp: 60,
        damage: 40,
        speed: 1.6,
        range: 20,
        attackSpeed: 500,
        type: 'melee',
        count: 4,
        color: '#ecf0f1',
        sprite: 'skeleton'
    },
    musketeer: {
        name: 'Mosqueteira',
        icon: '🔫',
        cost: 4,
        hp: 500,
        damage: 120,
        speed: 0.9,
        range: 130,
        attackSpeed: 1000,
        type: 'ranged',
        color: '#9c27b0',
        sprite: 'musketeer'
    },
    valkyrie: {
        name: 'Valquíria',
        icon: '⚔️',
        cost: 4,
        hp: 1000,
        damage: 100,
        speed: 0.9,
        range: 30,
        attackSpeed: 1300,
        type: 'melee',
        splash: true,
        splashRadius: 50,
        color: '#e91e63',
        sprite: 'valkyrie'
    }
};

// ==================== ESTADO DO JOGO ====================
let gameState = {
    running: false,
    elixir: 5,
    enemyElixir: 5,
    timeRemaining: CONFIG.GAME_DURATION,
    selectedCard: null,
    deck: ['knight', 'archer', 'giant', 'fireball', 'skeleton', 'musketeer', 'valkyrie', 'minion'],
    hand: [],
    nextCard: null,
    troops: [],
    projectiles: [],
    effects: [],
    particles: [],
    decorations: [],
    stats: {
        troopsSpawned: 0,
        totalDamage: 0
    },
    towers: {
        player: {
            king: { x: 0, y: 0, hp: CONFIG.KING_TOWER_HP, maxHp: CONFIG.KING_TOWER_HP, active: false },
            left: { x: 0, y: 0, hp: CONFIG.PRINCESS_TOWER_HP, maxHp: CONFIG.PRINCESS_TOWER_HP, active: true },
            right: { x: 0, y: 0, hp: CONFIG.PRINCESS_TOWER_HP, maxHp: CONFIG.PRINCESS_TOWER_HP, active: true }
        },
        enemy: {
            king: { x: 0, y: 0, hp: CONFIG.KING_TOWER_HP, maxHp: CONFIG.KING_TOWER_HP, active: false },
            left: { x: 0, y: 0, hp: CONFIG.PRINCESS_TOWER_HP, maxHp: CONFIG.PRINCESS_TOWER_HP, active: true },
            right: { x: 0, y: 0, hp: CONFIG.PRINCESS_TOWER_HP, maxHp: CONFIG.PRINCESS_TOWER_HP, active: true }
        }
    },
    lastTowerAttack: {
        player: { king: 0, left: 0, right: 0 },
        enemy: { king: 0, left: 0, right: 0 }
    }
};

// ==================== AMBIENTE / CENÁRIO ====================
const ARENA = {
    grassColors: ['#3d8b40', '#4a9f4d', '#2d7a30', '#45a049'],
    pathColor: '#c4a574',
    riverColor: '#4a90d9',
    bridgeColor: '#8b6914',
    treeColors: ['#228b22', '#2d5a27', '#1e4620']
};

// ==================== ELEMENTOS DOM ====================
const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const timerDisplay = document.getElementById('timer');
const elixirFill = document.getElementById('elixir-fill');
const elixirCount = document.getElementById('elixir-count');
const handCards = document.getElementById('hand-cards');
const nextCardSlot = document.getElementById('next-card');
const resultText = document.getElementById('result-text');
const playerCrowns = document.getElementById('player-crowns');
const enemyCrowns = document.getElementById('enemy-crowns');
const damageNumbers = document.getElementById('damage-numbers');

// ==================== INICIALIZAÇÃO ====================
function init() {
    console.log('Initializing game...');
    console.log('Canvas element:', canvas);
    console.log('Context:', ctx);
    
    if (!canvas || !ctx) {
        console.error('Canvas or context not found!');
        return;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('click', handleCanvasClick);
    
    if (startBtn) startBtn.addEventListener('click', startGame);
    if (restartBtn) restartBtn.addEventListener('click', restartGame);
    
    console.log('Game initialized successfully');
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || window.innerHeight;
    
    canvas.width = Math.max(300, containerWidth);
    canvas.height = Math.max(400, containerHeight - 180); // Espaço para HUD
    
    console.log('Canvas resized:', canvas.width, 'x', canvas.height);
    
    // Posicionar torres
    const w = canvas.width;
    const h = canvas.height;
    
    // Torres do jogador (embaixo)
    gameState.towers.player.king.x = w / 2;
    gameState.towers.player.king.y = h - 40;
    gameState.towers.player.left.x = w * 0.25;
    gameState.towers.player.left.y = h - 80;
    gameState.towers.player.right.x = w * 0.75;
    gameState.towers.player.right.y = h - 80;
    
    // Torres do inimigo (em cima)
    gameState.towers.enemy.king.x = w / 2;
    gameState.towers.enemy.king.y = 40;
    gameState.towers.enemy.left.x = w * 0.25;
    gameState.towers.enemy.left.y = 80;
    gameState.towers.enemy.right.x = w * 0.75;
    gameState.towers.enemy.right.y = 80;
}

function startGame() {
    console.log('Starting game...');
    resetGameState();
    menuScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Redimensionar canvas após mostrar a tela
    setTimeout(() => {
        resizeCanvas();
        console.log('Canvas after resize:', canvas.width, canvas.height);
    }, 100);
    
    // Embaralhar e distribuir cartas
    shuffleDeck();
    dealCards();
    
    gameState.running = true;
    console.log('Game running:', gameState.running);
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    startTimer();
}

function restartGame() {
    startGame();
}

function resetGameState() {
    gameState = {
        ...gameState,
        running: false,
        elixir: 5,
        enemyElixir: 5,
        timeRemaining: CONFIG.GAME_DURATION,
        selectedCard: null,
        hand: [],
        nextCard: null,
        troops: [],
        projectiles: [],
        effects: [],
        particles: [],
        stats: {
            troopsSpawned: 0,
            totalDamage: 0
        },
        towers: {
            player: {
                king: { x: gameState.towers.player.king.x, y: gameState.towers.player.king.y, hp: CONFIG.KING_TOWER_HP, maxHp: CONFIG.KING_TOWER_HP, active: false },
                left: { x: gameState.towers.player.left.x, y: gameState.towers.player.left.y, hp: CONFIG.PRINCESS_TOWER_HP, maxHp: CONFIG.PRINCESS_TOWER_HP, active: true },
                right: { x: gameState.towers.player.right.x, y: gameState.towers.player.right.y, hp: CONFIG.PRINCESS_TOWER_HP, maxHp: CONFIG.PRINCESS_TOWER_HP, active: true }
            },
            enemy: {
                king: { x: gameState.towers.enemy.king.x, y: gameState.towers.enemy.king.y, hp: CONFIG.KING_TOWER_HP, maxHp: CONFIG.KING_TOWER_HP, active: false },
                left: { x: gameState.towers.enemy.left.x, y: gameState.towers.enemy.left.y, hp: CONFIG.PRINCESS_TOWER_HP, maxHp: CONFIG.PRINCESS_TOWER_HP, active: true },
                right: { x: gameState.towers.enemy.right.x, y: gameState.towers.enemy.right.y, hp: CONFIG.PRINCESS_TOWER_HP, maxHp: CONFIG.PRINCESS_TOWER_HP, active: true }
            }
        },
        lastTowerAttack: {
            player: { king: 0, left: 0, right: 0 },
            enemy: { king: 0, left: 0, right: 0 }
        }
    };
    resizeCanvas();
    
    // Reset crowns display
    if (playerCrowns) playerCrowns.textContent = '👑 0';
    if (enemyCrowns) enemyCrowns.textContent = '👑 0';
}

function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

function dealCards() {
    gameState.hand = gameState.deck.slice(0, 4);
    gameState.nextCard = gameState.deck[4];
    console.log('Dealt cards:', gameState.hand);
    console.log('Next card:', gameState.nextCard);
    console.log('Elixir:', gameState.elixir);
    renderCards();
    
    // Verificar se as cartas foram criadas
    setTimeout(() => {
        const cards = document.querySelectorAll('#hand-cards .card');
        console.log('Cards rendered:', cards.length);
        cards.forEach((card, i) => {
            console.log('Card', i, ':', card.className);
        });
    }, 100);
}

function drawCard() {
    // Se a mão não está cheia, adicionar carta
    if (gameState.hand.length < 4 && gameState.nextCard) {
        gameState.hand.push(gameState.nextCard);
        
        // Encontrar próxima carta que não está na mão
        const availableCards = gameState.deck.filter(c => !gameState.hand.includes(c));
        if (availableCards.length > 0) {
            gameState.nextCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        }
        
        renderCards();
    }
}

function renderCards() {
    if (!handCards) {
        console.error('handCards element not found!');
        return;
    }
    
    handCards.innerHTML = '';
    
    for (let index = 0; index < gameState.hand.length; index++) {
        const cardId = gameState.hand[index];
        if (!cardId) continue;
        
        const card = CARDS[cardId];
        if (!card) continue;
        
        const hasEnoughElixir = Math.floor(gameState.elixir) >= card.cost;
        const isSelected = gameState.selectedCard === index;
        
        const cardEl = document.createElement('div');
        cardEl.className = 'card' + (hasEnoughElixir ? '' : ' disabled') + (isSelected ? ' selected' : '');
        
        cardEl.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-icon">${card.icon}</div>
            <div class="card-name">${card.name}</div>
        `;
        
        // Closure para capturar o índice correto
        (function(idx, cid) {
            cardEl.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Card clicked! Index:', idx, 'CardId:', cid);
                selectCard(idx);
            });
        })(index, cardId);
        
        handCards.appendChild(cardEl);
    }
    
    // Próxima carta
    if (gameState.nextCard) {
        const nextCard = CARDS[gameState.nextCard];
        nextCardSlot.innerHTML = `
            <div class="card-icon" style="font-size: 1.5rem;">${nextCard.icon}</div>
            <span class="card-label">PRÓX</span>
        `;
    }
}

function selectCard(index) {
    console.log('selectCard called with index:', index);
    console.log('Current hand:', gameState.hand);
    
    const cardId = gameState.hand[index];
    if (!cardId) {
        console.log('No card at index', index);
        return;
    }
    
    const card = CARDS[cardId];
    if (!card) {
        console.log('Card not found:', cardId);
        return;
    }
    
    const currentElixir = Math.floor(gameState.elixir);
    console.log('Card:', card.name, 'Cost:', card.cost, 'Elixir:', currentElixir);
    
    if (currentElixir < card.cost) {
        console.log('Not enough elixir');
        return;
    }
    
    if (gameState.selectedCard === index) {
        gameState.selectedCard = null;
        console.log('Card deselected');
    } else {
        gameState.selectedCard = index;
        console.log('Card selected:', index);
    }
    
    renderCards();
}

// ==================== LOOP DO JOGO ====================
let lastTime = 0;

function gameLoop(timestamp = 0) {
    if (!gameState.running) {
        console.log('Game not running');
        return;
    }
    
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    try {
        update(deltaTime);
        render();
    } catch (error) {
        console.error('Error in gameLoop:', error);
    }
    
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Regenerar elixir
    gameState.elixir = Math.min(CONFIG.MAX_ELIXIR, gameState.elixir + CONFIG.ELIXIR_RATE);
    gameState.enemyElixir = Math.min(CONFIG.MAX_ELIXIR, gameState.enemyElixir + CONFIG.ELIXIR_RATE);
    
    updateElixirUI();
    
    // IA do inimigo
    enemyAI();
    
    // Atualizar tropas
    updateTroops(deltaTime);
    
    // Atualizar projéteis
    updateProjectiles(deltaTime);
    
    // Atualizar efeitos
    updateEffects(deltaTime);
    
    // Torres atacam
    towerAttacks();
    
    // Verificar condições de vitória
    checkWinCondition();
    
    // Atualizar UI das cartas
    renderCards();
}

function updateElixirUI() {
    const percentage = (gameState.elixir / CONFIG.MAX_ELIXIR) * 100;
    elixirFill.style.width = percentage + '%';
    elixirCount.textContent = Math.floor(gameState.elixir);
}

// ==================== TIMER ====================
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        
        const minutes = Math.floor(gameState.timeRemaining / 60);
        const seconds = gameState.timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// ==================== SPAWNAR TROPAS ====================
function handleCanvasClick(e) {
    console.log('Canvas clicked, selectedCard:', gameState.selectedCard);
    
    if (gameState.selectedCard === null) {
        console.log('No card selected');
        return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    console.log('Click position:', x, y, 'Canvas height:', canvas.height);
    
    // Só pode spawnar no próprio lado (metade inferior, após o rio)
    const minY = canvas.height * 0.55; // Após o rio
    if (y < minY) {
        console.log('Click above player area, deselecting card');
        gameState.selectedCard = null;
        renderCards();
        return;
    }
    
    const cardId = gameState.hand[gameState.selectedCard];
    console.log('Card ID:', cardId, 'Hand:', gameState.hand);
    
    if (!cardId) {
        console.log('Invalid card');
        gameState.selectedCard = null;
        renderCards();
        return;
    }
    
    const card = CARDS[cardId];
    const currentElixir = Math.floor(gameState.elixir);
    
    if (currentElixir < card.cost) {
        console.log('Not enough elixir:', currentElixir, 'needed:', card.cost);
        return;
    }
    
    console.log('Spawning troop:', cardId, 'at', x, y);
    gameState.elixir -= card.cost;
    
    if (card.type === 'spell') {
        // Feitiços podem ser usados em qualquer lugar
        castSpell(cardId, x, y);
    } else {
        spawnTroop(cardId, x, y, 'player');
    }
    
    // Remover carta da mão e puxar nova
    gameState.hand.splice(gameState.selectedCard, 1);
    gameState.selectedCard = null;
    
    // Puxar nova carta
    drawCard();
    
    renderCards();
}

function spawnTroop(cardId, x, y, owner) {
    const card = CARDS[cardId];
    const count = card.count || 1;
    
    for (let i = 0; i < count; i++) {
        const offsetX = (i - (count - 1) / 2) * 30;
        const offsetY = (Math.random() - 0.5) * 20;
        
        const troop = {
            id: Date.now() + Math.random() + i,
            cardId,
            owner,
            x: x + offsetX,
            y: y + offsetY,
            hp: card.hp,
            maxHp: card.hp,
            damage: card.damage,
            speed: card.speed,
            range: card.range,
            attackSpeed: card.attackSpeed,
            lastAttack: 0,
            target: null,
            flying: card.flying || false,
            targetBuildings: card.targetBuildings || false,
            splash: card.splash || false,
            splashRadius: card.splashRadius || 40,
            color: card.color,
            icon: card.icon,
            size: card.hp > 1000 ? 28 : card.hp > 300 ? 22 : 16
        };
        
        gameState.troops.push(troop);
        
        // Efeito de spawn
        gameState.effects.push({
            type: 'spawn',
            x: troop.x,
            y: troop.y,
            duration: 300,
            elapsed: 0,
            color: owner === 'player' ? '#3498db' : '#e74c3c'
        });
    }
    
    // Estatísticas
    if (owner === 'player') {
        gameState.stats.troopsSpawned += count;
    }
}

function castSpell(cardId, x, y) {
    const card = CARDS[cardId];
    
    // Efeito visual
    gameState.effects.push({
        type: 'explosion',
        x, y,
        radius: card.radius,
        maxRadius: card.radius,
        duration: 500,
        elapsed: 0,
        color: card.color
    });
    
    // Dano em área
    gameState.troops.forEach(troop => {
        const dist = Math.hypot(troop.x - x, troop.y - y);
        if (dist <= card.radius && troop.owner !== 'player') {
            troop.hp -= card.damage;
        }
    });
    
    // Dano em torres
    Object.entries(gameState.towers.enemy).forEach(([key, tower]) => {
        const dist = Math.hypot(tower.x - x, tower.y - y);
        if (dist <= card.radius && tower.hp > 0) {
            tower.hp -= card.damage;
            if (tower.hp <= 0) {
                tower.hp = 0;
                if (key !== 'king') {
                    gameState.towers.enemy.king.active = true;
                }
            }
        }
    });
}

// ==================== ATUALIZAR TROPAS ====================
function updateTroops(deltaTime) {
    const now = Date.now();
    const w = canvas.width;
    const h = canvas.height;
    
    // Definir área do rio
    const riverTop = h * 0.46;
    const riverBottom = h * 0.54;
    
    // Definir pontes (duas pontes)
    const bridge1Left = w * 0.12;
    const bridge1Right = w * 0.35;
    const bridge2Left = w * 0.65;
    const bridge2Right = w * 0.88;
    
    gameState.troops = gameState.troops.filter(troop => troop.hp > 0);
    
    gameState.troops.forEach(troop => {
        // Encontrar alvo
        const target = findTarget(troop);
        
        let newX = troop.x;
        let newY = troop.y;
        
        if (target) {
            const dist = Math.hypot(target.x - troop.x, target.y - troop.y);
            
            if (dist <= troop.range) {
                // Atacar
                if (now - troop.lastAttack >= troop.attackSpeed) {
                    attack(troop, target);
                    troop.lastAttack = now;
                }
            } else {
                // Mover em direção ao alvo
                const angle = Math.atan2(target.y - troop.y, target.x - troop.x);
                newX = troop.x + Math.cos(angle) * troop.speed;
                newY = troop.y + Math.sin(angle) * troop.speed;
            }
        } else {
            // Mover em direção às torres inimigas
            const targetY = troop.owner === 'player' ? 0 : canvas.height;
            newY = troop.y + (targetY > troop.y ? 1 : -1) * troop.speed;
        }
        
        // Verificar colisão com o rio (tropas voadoras ignoram)
        if (!troop.flying) {
            const crossingRiver = (troop.y < riverTop && newY >= riverTop) || 
                                  (troop.y > riverBottom && newY <= riverBottom) ||
                                  (newY >= riverTop && newY <= riverBottom);
            
            if (crossingRiver) {
                // Verificar se está em uma ponte
                const onBridge1 = newX >= bridge1Left && newX <= bridge1Right;
                const onBridge2 = newX >= bridge2Left && newX <= bridge2Right;
                
                if (!onBridge1 && !onBridge2) {
                    // Não está em uma ponte - ir para a ponte mais próxima
                    const bridge1Center = (bridge1Left + bridge1Right) / 2;
                    const bridge2Center = (bridge2Left + bridge2Right) / 2;
                    
                    const distToBridge1 = Math.abs(troop.x - bridge1Center);
                    const distToBridge2 = Math.abs(troop.x - bridge2Center);
                    
                    const targetBridge = distToBridge1 < distToBridge2 ? bridge1Center : bridge2Center;
                    
                    // Mover horizontalmente em direção à ponte
                    if (Math.abs(troop.x - targetBridge) > troop.speed) {
                        newX = troop.x + (targetBridge > troop.x ? 1 : -1) * troop.speed;
                        newY = troop.y; // Não mover verticalmente até chegar na ponte
                    }
                }
            }
        }
        
        // Limitar aos limites do mapa
        newX = Math.max(20, Math.min(w - 20, newX));
        newY = Math.max(20, Math.min(h - 20, newY));
        
        troop.x = newX;
        troop.y = newY;
    });
}

function findTarget(troop) {
    const enemyOwner = troop.owner === 'player' ? 'enemy' : 'player';
    let closestTarget = null;
    let closestDist = Infinity;
    
    // Se a tropa só ataca construções
    if (troop.targetBuildings) {
        Object.values(gameState.towers[enemyOwner]).forEach(tower => {
            if (tower.hp > 0 && (tower.active || tower === gameState.towers[enemyOwner].king)) {
                const dist = Math.hypot(tower.x - troop.x, tower.y - troop.y);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestTarget = tower;
                }
            }
        });
        return closestTarget;
    }
    
    // Procurar tropas inimigas
    gameState.troops.forEach(enemy => {
        if (enemy.owner !== troop.owner && enemy.hp > 0) {
            // Tropas terrestres não podem atacar voadoras (a menos que sejam ranged)
            if (enemy.flying && troop.range < 50) return;
            
            const dist = Math.hypot(enemy.x - troop.x, enemy.y - troop.y);
            if (dist < closestDist) {
                closestDist = dist;
                closestTarget = enemy;
            }
        }
    });
    
    // Se não há tropas, atacar torres
    if (!closestTarget) {
        Object.values(gameState.towers[enemyOwner]).forEach(tower => {
            if (tower.hp > 0 && (tower.active || tower === gameState.towers[enemyOwner].king)) {
                const dist = Math.hypot(tower.x - troop.x, tower.y - troop.y);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestTarget = tower;
                }
            }
        });
    }
    
    return closestTarget;
}

function attack(attacker, target) {
    let totalDamage = 0;
    
    if (attacker.splash) {
        // Ataque em área
        gameState.troops.forEach(troop => {
            if (troop.owner !== attacker.owner) {
                const dist = Math.hypot(troop.x - target.x, troop.y - target.y);
                if (dist <= attacker.splashRadius) {
                    troop.hp -= attacker.damage;
                    totalDamage += attacker.damage;
                }
            }
        });
        
        // Efeito visual de splash
        gameState.effects.push({
            type: 'splash',
            x: target.x,
            y: target.y,
            radius: attacker.splashRadius,
            duration: 200,
            elapsed: 0,
            color: attacker.color
        });
    } else {
        totalDamage = attacker.damage;
    }
    
    target.hp -= attacker.damage;
    
    // Estatísticas de dano
    if (attacker.owner === 'player') {
        gameState.stats.totalDamage += totalDamage;
    }
    
    // Efeito visual de ataque
    if (attacker.range > 50) {
        gameState.projectiles.push({
            x: attacker.x,
            y: attacker.y,
            targetX: target.x,
            targetY: target.y,
            speed: 10,
            color: attacker.color
        });
    } else {
        // Efeito de impacto melee
        gameState.effects.push({
            type: 'hit',
            x: target.x,
            y: target.y,
            duration: 150,
            elapsed: 0
        });
    }
    
    // Se destruiu uma torre princesa, ativa a torre rei
    if (target.maxHp === CONFIG.PRINCESS_TOWER_HP && target.hp <= 0) {
        const enemyOwner = attacker.owner === 'player' ? 'enemy' : 'player';
        gameState.towers[enemyOwner].king.active = true;
    }
}

// ==================== TORRES ATACAM ====================
function towerAttacks() {
    const now = Date.now();
    
    ['player', 'enemy'].forEach(owner => {
        const enemyOwner = owner === 'player' ? 'enemy' : 'player';
        
        Object.entries(gameState.towers[owner]).forEach(([key, tower]) => {
            if (tower.hp <= 0) return;
            if (!tower.active && key === 'king') return;
            
            // Encontrar tropa inimiga mais próxima
            let closestEnemy = null;
            let closestDist = CONFIG.TOWER_RANGE;
            
            gameState.troops.forEach(troop => {
                if (troop.owner === enemyOwner) {
                    const dist = Math.hypot(troop.x - tower.x, troop.y - tower.y);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestEnemy = troop;
                    }
                }
            });
            
            if (closestEnemy && now - gameState.lastTowerAttack[owner][key] >= CONFIG.TOWER_ATTACK_SPEED) {
                closestEnemy.hp -= CONFIG.TOWER_DAMAGE;
                gameState.lastTowerAttack[owner][key] = now;
                
                // Projétil da torre
                gameState.projectiles.push({
                    x: tower.x,
                    y: tower.y,
                    targetX: closestEnemy.x,
                    targetY: closestEnemy.y,
                    speed: 10,
                    color: owner === 'player' ? '#3498db' : '#e74c3c'
                });
            }
        });
    });
}

// ==================== PROJÉTEIS ====================
function updateProjectiles(deltaTime) {
    gameState.projectiles = gameState.projectiles.filter(proj => {
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);
        if (dist < 10) return false;
        
        const angle = Math.atan2(proj.targetY - proj.y, proj.targetX - proj.x);
        proj.x += Math.cos(angle) * proj.speed;
        proj.y += Math.sin(angle) * proj.speed;
        
        return true;
    });
}

// ==================== EFEITOS ====================
function updateEffects(deltaTime) {
    gameState.effects = gameState.effects.filter(effect => {
        effect.elapsed += 16; // aproximadamente 1 frame
        return effect.elapsed < effect.duration;
    });
}

// ==================== IA DO INIMIGO ====================
function enemyAI() {
    // IA simples: spawna tropas aleatoriamente quando tem elixir suficiente
    if (Math.random() > 0.99) { // ~1% de chance por frame
        const availableCards = Object.keys(CARDS).filter(cardId => {
            const card = CARDS[cardId];
            return gameState.enemyElixir >= card.cost && card.type !== 'spell';
        });
        
        if (availableCards.length > 0) {
            const cardId = availableCards[Math.floor(Math.random() * availableCards.length)];
            const card = CARDS[cardId];
            
            // Spawnar no lado do inimigo, perto das pontes
            const w = canvas.width;
            const h = canvas.height;
            
            // Escolher aleatoriamente ponte esquerda ou direita
            const useBridge1 = Math.random() > 0.5;
            const bridgeX = useBridge1 ? w * 0.23 : w * 0.77;
            
            // Spawnar um pouco atrás da ponte (no lado inimigo)
            const x = bridgeX + (Math.random() - 0.5) * 60;
            const y = h * 0.15 + Math.random() * h * 0.15;
            
            gameState.enemyElixir -= card.cost;
            spawnTroop(cardId, x, y, 'enemy');
        }
    }
}

// ==================== VERIFICAR VITÓRIA ====================
function checkWinCondition() {
    const playerKingDead = gameState.towers.player.king.hp <= 0;
    const enemyKingDead = gameState.towers.enemy.king.hp <= 0;
    
    if (playerKingDead || enemyKingDead) {
        endGame();
    }
    
    // Atualizar display de coroas
    updateCrownsDisplay();
}

function endGame() {
    gameState.running = false;
    clearInterval(timerInterval);
    
    // Calcular resultado
    const playerTowersDestroyed = 
        (gameState.towers.enemy.king.hp <= 0 ? 3 : 
            (gameState.towers.enemy.left.hp <= 0 ? 1 : 0) +
            (gameState.towers.enemy.right.hp <= 0 ? 1 : 0));
    
    const enemyTowersDestroyed = 
        (gameState.towers.player.king.hp <= 0 ? 3 : 
            (gameState.towers.player.left.hp <= 0 ? 1 : 0) +
            (gameState.towers.player.right.hp <= 0 ? 1 : 0));
    
    const playerWins = playerTowersDestroyed > enemyTowersDestroyed || 
                       gameState.towers.enemy.king.hp <= 0;
    
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    // Atualizar estatísticas
    const towersDestroyedEl = document.getElementById('towers-destroyed');
    const troopsSpawnedEl = document.getElementById('troops-spawned');
    const totalDamageEl = document.getElementById('total-damage');
    
    if (towersDestroyedEl) towersDestroyedEl.textContent = playerTowersDestroyed;
    if (troopsSpawnedEl) troopsSpawnedEl.textContent = gameState.stats.troopsSpawned;
    if (totalDamageEl) totalDamageEl.textContent = gameState.stats.totalDamage.toLocaleString();
    
    // Atualizar coroas com animação
    const crowns = document.querySelectorAll('#crowns-earned .crown');
    crowns.forEach((crown, index) => {
        setTimeout(() => {
            if (index < playerTowersDestroyed) {
                crown.classList.add('earned');
            } else {
                crown.classList.remove('earned');
            }
        }, index * 300);
    });
    
    if (playerWins) {
        resultText.textContent = 'VITÓRIA!';
        resultText.className = 'victory';
    } else {
        resultText.textContent = 'DERROTA';
        resultText.className = 'defeat';
    }
}

// ==================== RENDERIZAÇÃO ESPETACULAR ====================
function render() {
    try {
        // Limpar canvas
        ctx.fillStyle = '#1a472a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar cenário detalhado
        drawDetailedArena();
        
        // Desenhar decorações
        drawDecorations();
        
        // Desenhar torres
        drawTowers();
        
        // Desenhar tropas com sprites
        drawTroops();
        
        // Desenhar projéteis com efeitos
        drawProjectiles();
        
        // Desenhar efeitos especiais
        drawEffects();
        
        // Desenhar partículas
        drawParticles();
        
        // Indicador de posicionamento
        if (gameState.selectedCard !== null) {
            drawPlacementIndicator();
        }
    } catch (error) {
        console.error('Erro no render:', error);
    }
}

function drawDetailedArena() {
    const w = canvas.width;
    const h = canvas.height;
    
    // Gradiente de grama para área do inimigo (vermelho)
    const enemyGradient = ctx.createLinearGradient(0, 0, 0, h * 0.48);
    enemyGradient.addColorStop(0, '#1a3d20');
    enemyGradient.addColorStop(1, '#2d5a35');
    ctx.fillStyle = enemyGradient;
    ctx.fillRect(0, 0, w, h * 0.48);
    
    // Gradiente de grama para área do jogador (azul)
    const playerGradient = ctx.createLinearGradient(0, h * 0.52, 0, h);
    playerGradient.addColorStop(0, '#2d5a35');
    playerGradient.addColorStop(1, '#1a3d20');
    ctx.fillStyle = playerGradient;
    ctx.fillRect(0, h * 0.52, w, h * 0.48);
    
    // Textura de grama (padrão)
    drawGrassPattern();
    
    // Caminhos de terra
    drawPaths();
    
    // Rio animado
    drawRiver();
    
    // Pontes detalhadas
    drawBridges();
    
    // Bordas da arena
    drawArenaBorders();
    
    // Indicadores de território
    drawTerritoryIndicators();
}

// Padrão de grama
function drawGrassPattern() {
    const w = canvas.width;
    const h = canvas.height;
    const time = Date.now() * 0.001;
    
    ctx.save();
    for (let i = 0; i < 80; i++) {
        const x = (i * 37 + 10) % w;
        const y = (i * 23 + 5) % h;
        const size = 3 + Math.sin(time + i) * 1;
        const alpha = 0.1 + (Math.sin(i * 0.5) * 0.5 + 0.5) * 0.1;
        
        ctx.fillStyle = `rgba(34, 139, 34, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

// Caminhos de terra
function drawPaths() {
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.fillStyle = '#8B7355';
    
    // Caminho central vertical (lado inimigo)
    ctx.beginPath();
    ctx.moveTo(w * 0.45, 0);
    ctx.lineTo(w * 0.55, 0);
    ctx.lineTo(w * 0.55, h * 0.15);
    ctx.quadraticCurveTo(w * 0.5, h * 0.18, w * 0.5, h * 0.2);
    ctx.lineTo(w * 0.5, h * 0.48);
    ctx.lineTo(w * 0.45, h * 0.48);
    ctx.lineTo(w * 0.45, h * 0.2);
    ctx.quadraticCurveTo(w * 0.5, h * 0.18, w * 0.45, h * 0.15);
    ctx.closePath();
    ctx.fill();
    
    // Caminho central vertical (lado jogador)
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h * 0.52);
    ctx.lineTo(w * 0.55, h * 0.52);
    ctx.lineTo(w * 0.55, h * 0.8);
    ctx.quadraticCurveTo(w * 0.5, h * 0.82, w * 0.5, h * 0.85);
    ctx.lineTo(w * 0.5, h);
    ctx.lineTo(w * 0.45, h);
    ctx.closePath();
    ctx.fill();
    
    // Textura do caminho (posições fixas)
    ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
    for (let i = 0; i < 20; i++) {
        const px = w * 0.45 + (((i * 7) % 10) / 10) * w * 0.1;
        const py = (i / 20) * h;
        const psize = 2 + (i % 3);
        ctx.beginPath();
        ctx.arc(px, py, psize, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Rio animado
function drawRiver() {
    const w = canvas.width;
    const h = canvas.height;
    const time = Date.now() * 0.002;
    const riverY = h * 0.48;
    const riverHeight = h * 0.04;
    
    // Base do rio
    const riverGradient = ctx.createLinearGradient(0, riverY, 0, riverY + riverHeight);
    riverGradient.addColorStop(0, '#1e5799');
    riverGradient.addColorStop(0.5, '#2989d8');
    riverGradient.addColorStop(1, '#1e5799');
    ctx.fillStyle = riverGradient;
    ctx.fillRect(0, riverY, w, riverHeight);
    
    // Ondas animadas
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 5) {
            const waveY = riverY + riverHeight / 2 + Math.sin(x * 0.05 + time + i) * 3;
            if (x === 0) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
    }
    
    // Brilhos na água
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 10; i++) {
        const sparkleX = ((time * 50 + i * 50) % w);
        const sparkleY = riverY + riverHeight * 0.3 + Math.sin(time + i) * 5;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Pontes detalhadas
function drawBridges() {
    const w = canvas.width;
    const h = canvas.height;
    
    drawBridge(w * 0.15, h * 0.46, w * 0.18, h * 0.08);
    drawBridge(w * 0.67, h * 0.46, w * 0.18, h * 0.08);
}

function drawBridge(x, y, bw, bh) {
    // Sombra da ponte
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x + 3, y + 3, bw, bh);
    
    // Base da ponte
    const bridgeGradient = ctx.createLinearGradient(x, y, x, y + bh);
    bridgeGradient.addColorStop(0, '#8B6914');
    bridgeGradient.addColorStop(0.5, '#A0782C');
    bridgeGradient.addColorStop(1, '#6B4F0A');
    ctx.fillStyle = bridgeGradient;
    ctx.fillRect(x, y, bw, bh);
    
    // Tábuas da ponte
    ctx.strokeStyle = '#5D4E37';
    ctx.lineWidth = 1;
    const plankCount = 6;
    for (let i = 0; i <= plankCount; i++) {
        const px = x + (bw / plankCount) * i;
        ctx.beginPath();
        ctx.moveTo(px, y);
        ctx.lineTo(px, y + bh);
        ctx.stroke();
    }
    
    // Bordas da ponte
    ctx.fillStyle = '#5D4E37';
    ctx.fillRect(x, y, bw, 4);
    ctx.fillRect(x, y + bh - 4, bw, 4);
    
    // Detalhes de corda/corrimão
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + 2);
    ctx.lineTo(x + bw, y + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y + bh - 2);
    ctx.lineTo(x + bw, y + bh - 2);
    ctx.stroke();
}

// Bordas da arena
function drawArenaBorders() {
    const w = canvas.width;
    const h = canvas.height;
    
    // Borda esquerda
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, 0, 5, h);
    
    // Borda direita
    ctx.fillRect(w - 5, 0, 5, h);
    
    // Arbustos nas bordas
    const bushPositions = [
        {x: 10, y: h * 0.2}, {x: 10, y: h * 0.4}, {x: 10, y: h * 0.6}, {x: 10, y: h * 0.8},
        {x: w - 20, y: h * 0.2}, {x: w - 20, y: h * 0.4}, {x: w - 20, y: h * 0.6}, {x: w - 20, y: h * 0.8}
    ];
    
    bushPositions.forEach(pos => {
        drawBush(pos.x, pos.y);
    });
}

function drawBush(x, y) {
    const colors = ['#228B22', '#2E8B2E', '#1E6B1E'];
    colors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + i * 5, y + Math.sin(i) * 3, 8 - i, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Indicadores de território
function drawTerritoryIndicators() {
    const w = canvas.width;
    const h = canvas.height;
    
    // Linha divisória sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 10]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(w * 0.15, h * 0.5);
    ctx.moveTo(w * 0.33, h * 0.5);
    ctx.lineTo(w * 0.67, h * 0.5);
    ctx.moveTo(w * 0.85, h * 0.5);
    ctx.lineTo(w, h * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Brilho vermelho sutil no território inimigo
    ctx.fillStyle = 'rgba(231, 76, 60, 0.05)';
    ctx.fillRect(0, 0, w, h * 0.48);
    
    // Brilho azul sutil no território do jogador
    ctx.fillStyle = 'rgba(52, 152, 219, 0.05)';
    ctx.fillRect(0, h * 0.52, w, h * 0.48);
}

// Decorações (árvores, pedras, etc)
function drawDecorations() {
    // Árvores nos cantos
    drawTree(25, 30);
    drawTree(canvas.width - 25, 30);
    drawTree(25, canvas.height - 30);
    drawTree(canvas.width - 25, canvas.height - 30);
    
    // Pedras decorativas
    drawRock(60, canvas.height * 0.3);
    drawRock(canvas.width - 60, canvas.height * 0.3);
    drawRock(60, canvas.height * 0.7);
    drawRock(canvas.width - 60, canvas.height * 0.7);
}

function drawTree(x, y) {
    // Tronco
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(x - 4, y, 8, 15);
    
    // Copa (3 círculos)
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(x, y - 5, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.arc(x - 6, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 6, y, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawRock(x, y) {
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.ellipse(x - 2, y - 2, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Partículas
function drawParticles() {
    const time = Date.now() * 0.001;
    
    // Partículas de poeira/brilho
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time + i * 0.5) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.7 + i * 0.3) * 0.5 + 0.5) * canvas.height;
        const size = 1 + Math.sin(time * 2 + i) * 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawTowers() {
    // Torres do jogador
    drawTower(gameState.towers.player.king, '#3498db', '👑', true);
    drawTower(gameState.towers.player.left, '#3498db', '🏰', false);
    drawTower(gameState.towers.player.right, '#3498db', '🏰', false);
    
    // Torres do inimigo
    drawTower(gameState.towers.enemy.king, '#e74c3c', '👑', true);
    drawTower(gameState.towers.enemy.left, '#e74c3c', '🏰', false);
    drawTower(gameState.towers.enemy.right, '#e74c3c', '🏰', false);
}

function drawTower(tower, color, icon, isKing) {
    const size = isKing ? 38 : 30;
    const time = Date.now() * 0.003;
    
    if (tower.hp <= 0) {
        // Torre destruída - ruínas
        drawRuins(tower.x, tower.y, size);
        return;
    }
    
    // Sombra da torre
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(tower.x + 3, tower.y + size * 0.8, size * 0.8, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Base de pedra
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.ellipse(tower.x, tower.y + size * 0.5, size * 0.9, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Corpo da torre (gradiente)
    const towerGradient = ctx.createRadialGradient(
        tower.x - size * 0.3, tower.y - size * 0.3, 0,
        tower.x, tower.y, size
    );
    towerGradient.addColorStop(0, lightenColor(color, 30));
    towerGradient.addColorStop(0.7, color);
    towerGradient.addColorStop(1, darkenColor(color, 30));
    
    ctx.fillStyle = towerGradient;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Borda 3D
    ctx.strokeStyle = darkenColor(color, 40);
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Detalhes da torre (ameias)
    drawTowerDetails(tower.x, tower.y, size, color, isKing);
    
    // Ícone com brilho
    ctx.save();
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.font = `${isKing ? 32 : 24}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, tower.x, tower.y);
    ctx.restore();
    
    // Range indicator quando torre está ativa
    if (tower.active || !isKing) {
        ctx.strokeStyle = `rgba(${color === '#3498db' ? '52, 152, 219' : '231, 76, 60'}, ${0.1 + Math.sin(time) * 0.05})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, CONFIG.TOWER_RANGE, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Barra de vida estilizada
    drawHealthBar(tower.x, tower.y - size - 15, size * 1.8, 8, tower.hp / tower.maxHp, color);
}

function drawRuins(x, y, size) {
    // Fumaça animada
    const time = Date.now() * 0.002;
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    for (let i = 0; i < 3; i++) {
        const smokeY = y - 10 - Math.sin(time + i) * 10 - i * 8;
        const smokeSize = 8 + Math.sin(time * 2 + i) * 3;
        ctx.beginPath();
        ctx.arc(x + Math.sin(time + i * 2) * 5, smokeY, smokeSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Ruínas
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.moveTo(x - size * 0.6, y + size * 0.3);
    ctx.lineTo(x - size * 0.4, y - size * 0.3);
    ctx.lineTo(x - size * 0.1, y - size * 0.1);
    ctx.lineTo(x + size * 0.2, y - size * 0.4);
    ctx.lineTo(x + size * 0.5, y - size * 0.2);
    ctx.lineTo(x + size * 0.6, y + size * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Pedras espalhadas (posições fixas baseadas em índice)
    ctx.fillStyle = '#555';
    const stonePositions = [
        {dx: -0.3, dy: 0.1, s: 4},
        {dx: 0.2, dy: 0.2, s: 5},
        {dx: -0.1, dy: 0.3, s: 3},
        {dx: 0.3, dy: 0.15, s: 4},
        {dx: 0, dy: 0.25, s: 3}
    ];
    stonePositions.forEach(stone => {
        ctx.beginPath();
        ctx.arc(x + stone.dx * size, y + stone.dy * size, stone.s, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawTowerDetails(x, y, size, color, isKing) {
    // Ameias no topo
    const battlementCount = isKing ? 8 : 6;
    ctx.fillStyle = darkenColor(color, 20);
    
    for (let i = 0; i < battlementCount; i++) {
        const angle = (i / battlementCount) * Math.PI * 2;
        const bx = x + Math.cos(angle) * (size - 5);
        const by = y + Math.sin(angle) * (size - 5);
        
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Bandeira para torre rei
    if (isKing) {
        ctx.fillStyle = color;
        ctx.fillRect(x + size * 0.3, y - size - 15, 3, 20);
        
        ctx.fillStyle = lightenColor(color, 20);
        ctx.beginPath();
        ctx.moveTo(x + size * 0.3 + 3, y - size - 15);
        ctx.lineTo(x + size * 0.3 + 18, y - size - 10);
        ctx.lineTo(x + size * 0.3 + 3, y - size - 5);
        ctx.closePath();
        ctx.fill();
    }
}

function drawHealthBar(x, y, width, height, percent, color) {
    const barX = x - width / 2;
    
    // Fundo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    drawRoundedRect(barX - 2, y - 2, width + 4, height + 4, 4);
    ctx.fill();
    
    // Barra de fundo
    ctx.fillStyle = '#333';
    drawRoundedRect(barX, y, width, height, 3);
    ctx.fill();
    
    // Barra de vida com gradiente
    if (percent > 0) {
        const hpColor = percent > 0.5 ? '#2ecc71' : percent > 0.25 ? '#f39c12' : '#e74c3c';
        const hpGradient = ctx.createLinearGradient(barX, y, barX, y + height);
        hpGradient.addColorStop(0, lightenColor(hpColor, 20));
        hpGradient.addColorStop(1, hpColor);
        
        ctx.fillStyle = hpGradient;
        drawRoundedRect(barX, y, width * percent, height, 3);
        ctx.fill();
        
        // Brilho
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        drawRoundedRect(barX, y, width * percent, height / 2, 3);
        ctx.fill();
    }
}

// Função auxiliar para retângulo arredondado (compatibilidade)
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Funções auxiliares de cor
function lightenColor(color, percent) {
    try {
        if (!color || typeof color !== 'string') return '#ffffff';
        if (!color.startsWith('#')) return color;
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `rgb(${R}, ${G}, ${B})`;
    } catch (e) {
        return color || '#ffffff';
    }
}

function darkenColor(color, percent) {
    try {
        if (!color || typeof color !== 'string') return '#000000';
        if (!color.startsWith('#')) return color;
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `rgb(${R}, ${G}, ${B})`;
    } catch (e) {
        return color || '#000000';
    }
}

function drawTroops() {
    // Ordenar tropas por Y para efeito de profundidade
    const sortedTroops = [...gameState.troops].sort((a, b) => a.y - b.y);
    
    sortedTroops.forEach(troop => {
        const time = Date.now() * 0.005;
        const yOffset = troop.flying ? -15 + Math.sin(time + troop.id) * 3 : 0;
        const drawY = troop.y + yOffset;
        
        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(troop.x, troop.y + troop.size * 0.5, troop.size * 0.7, troop.size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar sprite baseado no tipo
        drawTroopSprite(troop, troop.x, drawY, time);
        
        // Indicador de time (círculo colorido embaixo)
        const teamColor = troop.owner === 'player' ? '#3498db' : '#e74c3c';
        ctx.strokeStyle = teamColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(troop.x, troop.y + troop.size * 0.5, troop.size * 0.6, troop.size * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Barra de vida
        drawHealthBar(troop.x, drawY - troop.size - 8, troop.size * 1.6, 5, troop.hp / troop.maxHp, teamColor);
        
        // Efeito de ataque
        if (Date.now() - troop.lastAttack < 200) {
            drawAttackEffect(troop, time);
        }
    });
}

function drawTroopSprite(troop, x, y, time) {
    const size = troop.size;
    const cardId = troop.cardId;
    const sprite = SPRITES[cardId] || SPRITES.knight;
    const isMoving = true; // Animação constante
    const bounce = Math.sin(time * 3) * 2;
    
    ctx.save();
    
    switch(cardId) {
        case 'knight':
            drawKnight(x, y + bounce, size, sprite, troop.owner);
            break;
        case 'archer':
            drawArcher(x, y + bounce, size, sprite, troop.owner);
            break;
        case 'giant':
            drawGiant(x, y + bounce * 0.5, size, sprite, troop.owner);
            break;
        case 'minion':
            drawMinion(x, y, size, sprite, troop.owner, time);
            break;
        case 'skeleton':
            drawSkeleton(x, y + bounce, size, sprite, troop.owner);
            break;
        case 'musketeer':
            drawMusketeer(x, y + bounce, size, sprite, troop.owner);
            break;
        case 'valkyrie':
            drawValkyrie(x, y + bounce, size, sprite, troop.owner, time);
            break;
        default:
            drawGenericTroop(x, y + bounce, size, troop.color, troop.icon);
    }
    
    ctx.restore();
}

// Cavaleiro
function drawKnight(x, y, size, sprite, owner) {
    // Corpo
    ctx.fillStyle = sprite.armor;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.7, size * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça com capacete
    ctx.fillStyle = sprite.helmet;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.5, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Viseira
    ctx.fillStyle = '#222';
    ctx.fillRect(x - size * 0.3, y - size * 0.55, size * 0.6, size * 0.15);
    
    // Escudo
    ctx.fillStyle = sprite.shield;
    ctx.beginPath();
    ctx.ellipse(x - size * 0.6, y, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Espada
    ctx.fillStyle = sprite.weapon;
    ctx.save();
    ctx.translate(x + size * 0.5, y - size * 0.3);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-2, -size * 0.8, 4, size * 0.8);
    ctx.restore();
    
    // Borda do time
    ctx.strokeStyle = owner === 'player' ? '#3498db' : '#e74c3c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.75, size * 0.95, 0, 0, Math.PI * 2);
    ctx.stroke();
}

// Arqueira
function drawArcher(x, y, size, sprite, owner) {
    // Capa
    ctx.fillStyle = sprite.cape;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.4, y - size * 0.3);
    ctx.lineTo(x + size * 0.4, y - size * 0.3);
    ctx.lineTo(x + size * 0.3, y + size * 0.6);
    ctx.lineTo(x - size * 0.3, y + size * 0.6);
    ctx.closePath();
    ctx.fill();
    
    // Corpo
    ctx.fillStyle = sprite.outfit;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça
    ctx.fillStyle = sprite.body;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.5, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabelo
    ctx.fillStyle = sprite.hair;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.6, size * 0.35, Math.PI, 0);
    ctx.fill();
    
    // Arco
    ctx.strokeStyle = sprite.bow;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + size * 0.5, y, size * 0.6, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    
    // Corda do arco
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + size * 0.5 + Math.cos(-Math.PI * 0.4) * size * 0.6, y + Math.sin(-Math.PI * 0.4) * size * 0.6);
    ctx.lineTo(x + size * 0.5 + Math.cos(Math.PI * 0.4) * size * 0.6, y + Math.sin(Math.PI * 0.4) * size * 0.6);
    ctx.stroke();
}

// Gigante
function drawGiant(x, y, size, sprite, owner) {
    // Corpo grande
    ctx.fillStyle = sprite.body;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.9, size, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Calças
    ctx.fillStyle = sprite.pants;
    ctx.beginPath();
    ctx.ellipse(x, y + size * 0.5, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cinto
    ctx.fillStyle = sprite.belt;
    ctx.fillRect(x - size * 0.7, y + size * 0.1, size * 1.4, size * 0.2);
    
    // Cabeça pequena
    ctx.fillStyle = sprite.body;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.7, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabelo/sobrancelha
    ctx.fillStyle = sprite.hair;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.85, size * 0.3, Math.PI, 0);
    ctx.fill();
    
    // Olhos
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.7, size * 0.1, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.7, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.7, size * 0.05, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.7, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
}

// Lacaio (voador)
function drawMinion(x, y, size, sprite, owner, time) {
    const wingFlap = Math.sin(time * 10) * 0.3;
    
    // Asas
    ctx.fillStyle = sprite.wings;
    ctx.save();
    ctx.translate(x - size * 0.5, y);
    ctx.rotate(-0.5 + wingFlap);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.translate(x + size * 0.5, y);
    ctx.rotate(0.5 - wingFlap);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Corpo
    ctx.fillStyle = sprite.body;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.5, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chifres
    ctx.fillStyle = sprite.horns;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.3, y - size * 0.4);
    ctx.lineTo(x - size * 0.5, y - size * 0.8);
    ctx.lineTo(x - size * 0.1, y - size * 0.3);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x + size * 0.3, y - size * 0.4);
    ctx.lineTo(x + size * 0.5, y - size * 0.8);
    ctx.lineTo(x + size * 0.1, y - size * 0.3);
    ctx.fill();
    
    // Olhos
    ctx.fillStyle = sprite.eyes;
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.1, size * 0.12, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.1, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
}

// Esqueleto
function drawSkeleton(x, y, size, sprite, owner) {
    // Corpo (ossos)
    ctx.fillStyle = sprite.bones;
    
    // Costelas
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.4, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Linhas das costelas
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(x - size * 0.3, y + i * size * 0.15);
        ctx.lineTo(x + size * 0.3, y + i * size * 0.15);
        ctx.stroke();
    }
    
    // Crânio
    ctx.fillStyle = sprite.bones;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.5, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Olhos do crânio
    ctx.fillStyle = sprite.eyes;
    ctx.beginPath();
    ctx.arc(x - size * 0.12, y - size * 0.55, size * 0.1, 0, Math.PI * 2);
    ctx.arc(x + size * 0.12, y - size * 0.55, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Boca
    ctx.fillStyle = '#333';
    ctx.fillRect(x - size * 0.15, y - size * 0.35, size * 0.3, size * 0.08);
    
    // Espada de osso
    ctx.fillStyle = sprite.weapon;
    ctx.save();
    ctx.translate(x + size * 0.4, y);
    ctx.rotate(Math.PI / 6);
    ctx.fillRect(-2, -size * 0.5, 4, size * 0.6);
    ctx.restore();
}

// Mosqueteira
function drawMusketeer(x, y, size, sprite, owner) {
    // Corpo
    ctx.fillStyle = sprite.outfit;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça
    ctx.fillStyle = sprite.body;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.5, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Chapéu
    ctx.fillStyle = sprite.hat;
    ctx.beginPath();
    ctx.ellipse(x, y - size * 0.7, size * 0.5, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - size * 0.8, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabelo
    ctx.fillStyle = sprite.hair;
    ctx.beginPath();
    ctx.arc(x - size * 0.2, y - size * 0.4, size * 0.15, 0, Math.PI * 2);
    ctx.arc(x + size * 0.2, y - size * 0.4, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Mosquete
    ctx.fillStyle = sprite.gun;
    ctx.save();
    ctx.translate(x + size * 0.3, y);
    ctx.rotate(-Math.PI / 6);
    ctx.fillRect(-3, -size * 0.9, 6, size * 1.2);
    ctx.restore();
}

// Valquíria
function drawValkyrie(x, y, size, sprite, owner, time) {
    const spin = time * 2;
    
    // Capa
    ctx.fillStyle = sprite.cape;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.3, y - size * 0.2);
    ctx.quadraticCurveTo(x - size * 0.6, y + size * 0.3, x - size * 0.4, y + size * 0.7);
    ctx.lineTo(x + size * 0.4, y + size * 0.7);
    ctx.quadraticCurveTo(x + size * 0.6, y + size * 0.3, x + size * 0.3, y - size * 0.2);
    ctx.closePath();
    ctx.fill();
    
    // Corpo com armadura
    ctx.fillStyle = sprite.armor;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça
    ctx.fillStyle = sprite.body;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.5, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabelo vermelho
    ctx.fillStyle = sprite.hair;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.55, size * 0.4, Math.PI * 0.8, Math.PI * 0.2);
    ctx.fill();
    // Tranças
    ctx.beginPath();
    ctx.moveTo(x - size * 0.35, y - size * 0.3);
    ctx.quadraticCurveTo(x - size * 0.5, y, x - size * 0.4, y + size * 0.3);
    ctx.lineTo(x - size * 0.3, y + size * 0.3);
    ctx.quadraticCurveTo(x - size * 0.4, y, x - size * 0.25, y - size * 0.3);
    ctx.fill();
    
    // Machado girando
    ctx.save();
    ctx.translate(x + size * 0.5, y - size * 0.2);
    ctx.rotate(spin);
    ctx.fillStyle = sprite.axe;
    ctx.fillRect(-3, -size * 0.6, 6, size * 0.8);
    ctx.beginPath();
    ctx.moveTo(3, -size * 0.5);
    ctx.lineTo(size * 0.4, -size * 0.3);
    ctx.lineTo(size * 0.4, -size * 0.1);
    ctx.lineTo(3, -size * 0.3);
    ctx.fill();
    ctx.restore();
}

// Tropa genérica (fallback)
function drawGenericTroop(x, y, size, color, icon) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, x, y);
}

// Efeito de ataque
function drawAttackEffect(troop, time) {
    const size = troop.size;
    ctx.save();
    ctx.globalAlpha = 0.6;
    
    if (troop.range > 50) {
        // Efeito de tiro
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(troop.x, troop.y, size + 5, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        // Efeito de golpe
        ctx.fillStyle = '#fff';
        const slashAngle = time * 10;
        ctx.beginPath();
        ctx.moveTo(troop.x, troop.y);
        ctx.lineTo(troop.x + Math.cos(slashAngle) * size * 1.5, troop.y + Math.sin(slashAngle) * size * 1.5);
        ctx.lineTo(troop.x + Math.cos(slashAngle + 0.3) * size * 1.2, troop.y + Math.sin(slashAngle + 0.3) * size * 1.2);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
}

function drawProjectiles() {
    gameState.projectiles.forEach(proj => {
        const angle = Math.atan2(proj.targetY - proj.y, proj.targetX - proj.x);
        
        // Brilho
        ctx.save();
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 10;
        
        // Projétil principal
        const gradient = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 8);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.5, proj.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Rastro com gradiente
        const trailLength = 20;
        const trailGradient = ctx.createLinearGradient(
            proj.x, proj.y,
            proj.x - Math.cos(angle) * trailLength,
            proj.y - Math.sin(angle) * trailLength
        );
        trailGradient.addColorStop(0, proj.color);
        trailGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(proj.x, proj.y);
        ctx.lineTo(proj.x - Math.cos(angle) * trailLength, proj.y - Math.sin(angle) * trailLength);
        ctx.stroke();
    });
}

function drawEffects() {
    gameState.effects.forEach(effect => {
        const progress = effect.elapsed / effect.duration;
        
        if (effect.type === 'explosion') {
            // Múltiplos anéis de explosão
            for (let i = 0; i < 3; i++) {
                const ringProgress = Math.max(0, progress - i * 0.1);
                const currentRadius = effect.maxRadius * ringProgress;
                const alpha = (1 - ringProgress) * 0.6;
                
                if (alpha > 0) {
                    ctx.globalAlpha = alpha;
                    
                    // Anel de fogo
                    const gradient = ctx.createRadialGradient(
                        effect.x, effect.y, currentRadius * 0.5,
                        effect.x, effect.y, currentRadius
                    );
                    gradient.addColorStop(0, 'transparent');
                    gradient.addColorStop(0.5, effect.color);
                    gradient.addColorStop(1, '#ff0');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, currentRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Centro brilhante
            if (progress < 0.3) {
                ctx.globalAlpha = 1 - progress * 3;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.maxRadius * 0.3 * (1 - progress), 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Partículas de fogo
            ctx.globalAlpha = 1 - progress;
            for (let i = 0; i < 8; i++) {
                const particleAngle = (i / 8) * Math.PI * 2 + progress * 2;
                const particleDist = effect.maxRadius * progress * 1.2;
                const px = effect.x + Math.cos(particleAngle) * particleDist;
                const py = effect.y + Math.sin(particleAngle) * particleDist;
                
                ctx.fillStyle = i % 2 === 0 ? '#ff6600' : '#ffcc00';
                ctx.beginPath();
                ctx.arc(px, py, 5 * (1 - progress), 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
        }
        
        else if (effect.type === 'spawn') {
            // Efeito de invocação
            ctx.globalAlpha = 1 - progress;
            
            // Círculo crescente
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, 20 * progress, 0, Math.PI * 2);
            ctx.stroke();
            
            // Partículas subindo
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const dist = 15 * progress;
                const px = effect.x + Math.cos(angle) * dist;
                const py = effect.y - 20 * progress + Math.sin(angle) * 5;
                
                ctx.fillStyle = effect.color;
                ctx.beginPath();
                ctx.arc(px, py, 3 * (1 - progress), 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
        }
        
        else if (effect.type === 'splash') {
            // Efeito de ataque em área
            ctx.globalAlpha = (1 - progress) * 0.5;
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius * (0.5 + progress * 0.5), 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        else if (effect.type === 'hit') {
            // Efeito de impacto
            ctx.globalAlpha = 1 - progress;
            
            // Estrela de impacto
            ctx.fillStyle = '#fff';
            ctx.save();
            ctx.translate(effect.x, effect.y);
            ctx.rotate(progress * Math.PI);
            
            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(5, -3);
                ctx.lineTo(15 * (1 - progress), 0);
                ctx.lineTo(5, 3);
                ctx.closePath();
                ctx.fill();
            }
            
            ctx.restore();
            ctx.globalAlpha = 1;
        }
    });
}

function drawPlacementIndicator() {
    const time = Date.now() * 0.003;
    const h = canvas.height;
    const w = canvas.width;
    
    // Área válida (após o rio - 55% até o final)
    const validAreaTop = h * 0.55;
    const pulseAlpha = 0.15 + Math.sin(time) * 0.05;
    
    // Gradiente de cima para baixo
    const gradient = ctx.createLinearGradient(0, validAreaTop, 0, h);
    gradient.addColorStop(0, `rgba(46, 204, 113, ${pulseAlpha})`);
    gradient.addColorStop(1, `rgba(46, 204, 113, ${pulseAlpha * 0.3})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, validAreaTop, w, h - validAreaTop);
    
    // Linha de divisão brilhante
    ctx.strokeStyle = `rgba(46, 204, 113, ${0.5 + Math.sin(time * 2) * 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, validAreaTop);
    ctx.lineTo(w, validAreaTop);
    ctx.stroke();
    
    // Texto de instrução com sombra
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👆 Clique aqui para posicionar', w / 2, validAreaTop + 25);
    ctx.restore();
    
    // Ícone da carta selecionada
    if (gameState.selectedCard !== null) {
        const cardId = gameState.hand[gameState.selectedCard];
        if (cardId) {
            const card = CARDS[cardId];
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(card.icon, w / 2, validAreaTop + 70);
        }
    }
}

// ==================== ATUALIZAR CROWNS ====================
function updateCrownsDisplay() {
    const playerCrownsCount = 
        (gameState.towers.enemy.king.hp <= 0 ? 3 : 0) ||
        ((gameState.towers.enemy.left.hp <= 0 ? 1 : 0) + 
         (gameState.towers.enemy.right.hp <= 0 ? 1 : 0));
    
    const enemyCrownsCount = 
        (gameState.towers.player.king.hp <= 0 ? 3 : 0) ||
        ((gameState.towers.player.left.hp <= 0 ? 1 : 0) + 
         (gameState.towers.player.right.hp <= 0 ? 1 : 0));
    
    if (playerCrowns) playerCrowns.textContent = `👑 ${playerCrownsCount}`;
    if (enemyCrowns) enemyCrowns.textContent = `👑 ${enemyCrownsCount}`;
}

// ==================== MOSTRAR DANO FLUTUANTE ====================
function showDamageNumber(x, y, damage, isPlayerDamage) {
    if (!damageNumbers) return;
    
    const dmgEl = document.createElement('div');
    dmgEl.className = `damage-number ${isPlayerDamage ? 'player-damage' : 'enemy-damage'}`;
    dmgEl.textContent = `-${damage}`;
    dmgEl.style.left = `${x}px`;
    dmgEl.style.top = `${y}px`;
    
    damageNumbers.appendChild(dmgEl);
    
    setTimeout(() => {
        dmgEl.remove();
    }, 1000);
}

// ==================== INICIAR ====================
init();
