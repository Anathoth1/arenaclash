/*
 * CLASH ARENA HD - Sistema de Gráficos Avançados
 */

// Adiciona métodos de renderização à classe ClashArena
ClashArena.prototype.render = function() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.save();
    
    // Screen shake
    if (this.screenShake > 0.5) {
        ctx.translate((Math.random() - 0.5) * this.screenShake, (Math.random() - 0.5) * this.screenShake);
    }
    
    // Background com gradiente
    const s = STAGES[this.playingStage - 1];
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, s ? s.bg1 : '#2d5a35');
    grad.addColorStop(1, s ? s.bg2 : '#1a3d20');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    
    // Elementos visuais
    this.drawGrass();
    this.drawArena();
    this.drawGlows();
    this.drawTowers();
    this.drawTroops();
    this.drawProjectiles();
    this.drawSparks();
    this.drawEffects();
    this.drawParticles();
    this.drawDamageNumbers();
    
    // Indicador de spawn
    if (this.selected !== null) this.drawIndicator();
    
    // Efeito Double Elixir
    if (this.doubleElixir) {
        ctx.fillStyle = 'rgba(155, 89, 182, 0.12)';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 5;
        ctx.strokeRect(2, 2, w - 4, h - 4);
    }
    
    // Vinheta
    const vg = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.85);
    vg.addColorStop(0, 'transparent');
    vg.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    
    ctx.restore();
};

ClashArena.prototype.drawGrass = function() {
    const ctx = this.ctx, t = Date.now() * 0.002;
    ctx.fillStyle = 'rgba(0,35,0,0.2)';
    this.grass.forEach(g => {
        ctx.beginPath();
        ctx.moveTo(g.x, g.y);
        ctx.lineTo(g.x - g.s/3, g.y - g.s + Math.sin(t + g.x * 0.02) * 2);
        ctx.lineTo(g.x + g.s/3, g.y - g.s + Math.sin(t + g.x * 0.02 + 1) * 2);
        ctx.closePath();
        ctx.fill();
    });
};

ClashArena.prototype.drawGlows = function() {
    const ctx = this.ctx;
    this.glows.filter(g => g && isFinite(g.x) && isFinite(g.y) && isFinite(g.size) && g.life > 0.01).forEach(g => {
        const radius = Math.max(1, g.size * g.life);
        ctx.globalAlpha = Math.max(0, g.life * 0.5);
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x, g.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
};

ClashArena.prototype.drawSparks = function() {
    const ctx = this.ctx;
    this.sparks.filter(s => s && isFinite(s.x) && isFinite(s.y) && s.life > 0).forEach(s => {
        const radius = Math.max(0.1, s.size * s.life);
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
};

ClashArena.prototype.drawArena = function() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height, t = Date.now() * 0.001;
    
    // Rio com gradiente e ondas
    const rY = h * 0.46, rH = h * 0.08;
    const rg = ctx.createLinearGradient(0, rY, 0, rY + rH);
    rg.addColorStop(0, '#0d47a1');
    rg.addColorStop(0.3, '#1976d2');
    rg.addColorStop(0.5, '#42a5f5');
    rg.addColorStop(0.7, '#1976d2');
    rg.addColorStop(1, '#0d47a1');
    ctx.fillStyle = rg;
    ctx.fillRect(0, rY, w, rH);
    
    // Ondas animadas
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
            const y = rY + rH / 2 + Math.sin(x * 0.05 + t * 3.5 + i * 0.6) * 3;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    // Pontes
    this.drawBridge(w * 0.10, rY - 8, w * 0.24, rH + 16);
    this.drawBridge(w * 0.66, rY - 8, w * 0.24, rH + 16);
    
    // Caminhos centrais
    const pathGrad = ctx.createLinearGradient(w * 0.44, 0, w * 0.56, 0);
    pathGrad.addColorStop(0, 'rgba(139,115,85,0.5)');
    pathGrad.addColorStop(0.5, 'rgba(160,130,90,0.6)');
    pathGrad.addColorStop(1, 'rgba(139,115,85,0.5)');
    ctx.fillStyle = pathGrad;
    ctx.fillRect(w * 0.44, 0, w * 0.12, h * 0.46);
    ctx.fillRect(w * 0.44, h * 0.54, w * 0.12, h * 0.46);
    
    // Borda da arena
    ctx.strokeStyle = '#1a0a00';
    ctx.lineWidth = 5;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    
    // Linha divisória
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(w, h * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
};

ClashArena.prototype.drawBridge = function(x, y, bw, bh) {
    const ctx = this.ctx;
    
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(x + 4, y + 4, bw, bh);
    
    // Ponte com gradiente
    const g = ctx.createLinearGradient(x, y, x, y + bh);
    g.addColorStop(0, '#d4a84b');
    g.addColorStop(0.3, '#b8942a');
    g.addColorStop(0.7, '#8b6914');
    g.addColorStop(1, '#5d4e37');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, bw, bh);
    
    // Tábuas
    ctx.strokeStyle = '#4a3a20';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 7; i++) {
        ctx.beginPath();
        ctx.moveTo(x + bw / 7 * i, y);
        ctx.lineTo(x + bw / 7 * i, y + bh);
        ctx.stroke();
    }
    
    // Borda
    ctx.strokeStyle = '#3d2e17';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, bw, bh);
};

ClashArena.prototype.drawTowers = function() {
    // Torres inimigas
    this.drawTower(this.towers.enemy.left, '#c0392b', '🏰', false, 'enemy');
    this.drawTower(this.towers.enemy.right, '#c0392b', '🏰', false, 'enemy');
    this.drawTower(this.towers.enemy.king, '#922b21', '👑', true, 'enemy');
    
    // Torres do jogador
    this.drawTower(this.towers.player.left, '#2980b9', '🏰', false, 'player');
    this.drawTower(this.towers.player.right, '#2980b9', '🏰', false, 'player');
    this.drawTower(this.towers.player.king, '#1a5276', '👑', true, 'player');
};

ClashArena.prototype.drawTower = function(tw, color, icon, king, side) {
    const ctx = this.ctx, sz = king ? 42 : 34;
    
    // Verificar se as coordenadas são válidas
    if (!tw || !isFinite(tw.x) || !isFinite(tw.y)) return;
    
    if (tw.hp <= 0) {
        // Torre destruída - escombros
        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath();
        ctx.arc(tw.x, tw.y, sz * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Sombra dos escombros
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(tw.x, tw.y + sz * 0.25, sz * 0.5, sz * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pedras espalhadas
        ctx.fillStyle = '#3a3a3a';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(tw.x + Math.cos(i * 1.2) * sz * 0.4, tw.y + Math.sin(i * 1.2) * sz * 0.3, 4 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fill();
        }
        return;
    }
    
    // Sombra grande
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(tw.x + 4, tw.y + sz * 0.85, sz * 1.1, sz * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Base da torre
    ctx.fillStyle = this.darkenColor(color, 40);
    ctx.beginPath();
    ctx.ellipse(tw.x, tw.y + sz * 0.3, sz * 0.9, sz * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Corpo da torre com gradiente 3D
    const tg = ctx.createRadialGradient(tw.x - sz * 0.3, tw.y - sz * 0.3, 0, tw.x, tw.y, sz);
    tg.addColorStop(0, this.lightenColor(color, 50));
    tg.addColorStop(0.5, color);
    tg.addColorStop(1, this.darkenColor(color, 40));
    ctx.fillStyle = tg;
    ctx.beginPath();
    ctx.arc(tw.x, tw.y, sz, 0, Math.PI * 2);
    ctx.fill();
    
    // Borda
    ctx.strokeStyle = this.darkenColor(color, 60);
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Brilho
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(tw.x, tw.y, sz - 5, -Math.PI * 0.75, -Math.PI * 0.15);
    ctx.stroke();
    
    // Ícone
    ctx.font = `${king ? 34 : 28}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, tw.x, tw.y);
    
    // Barra de HP
    this.drawHP(tw.x, tw.y - sz - 16, sz * 1.9, 12, tw.hp / tw.max);
};

ClashArena.prototype.lightenColor = function(c, p) {
    let r = parseInt(c.slice(1, 3), 16);
    let g = parseInt(c.slice(3, 5), 16);
    let b = parseInt(c.slice(5, 7), 16);
    r = Math.min(255, r + p);
    g = Math.min(255, g + p);
    b = Math.min(255, b + p);
    return `rgb(${r},${g},${b})`;
};

ClashArena.prototype.darkenColor = function(c, p) {
    let r = parseInt(c.slice(1, 3), 16);
    let g = parseInt(c.slice(3, 5), 16);
    let b = parseInt(c.slice(5, 7), 16);
    r = Math.max(0, r - p);
    g = Math.max(0, g - p);
    b = Math.max(0, b - p);
    return `rgb(${r},${g},${b})`;
};

ClashArena.prototype.drawHP = function(x, y, w, h, pct) {
    const ctx = this.ctx, bx = x - w / 2;
    
    // Fundo com borda arredondada
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.beginPath();
    ctx.roundRect(bx - 2, y - 2, w + 4, h + 4, 5);
    ctx.fill();
    
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.roundRect(bx, y, w, h, 4);
    ctx.fill();
    
    if (pct > 0) {
        // Gradiente da barra de HP
        const hpGrad = ctx.createLinearGradient(bx, y, bx, y + h);
        if (pct > 0.5) {
            hpGrad.addColorStop(0, '#4ade80');
            hpGrad.addColorStop(0.5, '#22c55e');
            hpGrad.addColorStop(1, '#16a34a');
        } else if (pct > 0.25) {
            hpGrad.addColorStop(0, '#fbbf24');
            hpGrad.addColorStop(0.5, '#f59e0b');
            hpGrad.addColorStop(1, '#d97706');
        } else {
            hpGrad.addColorStop(0, '#f87171');
            hpGrad.addColorStop(0.5, '#ef4444');
            hpGrad.addColorStop(1, '#dc2626');
        }
        
        ctx.fillStyle = hpGrad;
        ctx.beginPath();
        ctx.roundRect(bx, y, w * Math.max(0, pct), h, 4);
        ctx.fill();
        
        // Brilho
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.roundRect(bx, y, w * Math.max(0, pct), h / 2, [4, 4, 0, 0]);
        ctx.fill();
    }
};

ClashArena.prototype.drawTroops = function() {
    const ctx = this.ctx, t = Date.now() * 0.005;
    
    // Ordenar por Y para profundidade
    [...this.troops].filter(tr => tr && isFinite(tr.x) && isFinite(tr.y)).sort((a, b) => a.y - b.y).forEach(tr => {
        const yo = tr.fly ? -15 + Math.sin(t + tr.id) * 5 : 0;
        const dy = tr.y + yo;
        
        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(tr.x, tr.y + tr.size * 0.55, tr.size * 0.75, tr.size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Aura de raridade
        if (tr.rarity === 'legendary') {
            const aura = ctx.createRadialGradient(tr.x, dy, 0, tr.x, dy, tr.size * 1.5);
            aura.addColorStop(0, 'rgba(255,215,0,0.3)');
            aura.addColorStop(1, 'transparent');
            ctx.fillStyle = aura;
            ctx.beginPath();
            ctx.arc(tr.x, dy, tr.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (tr.rarity === 'epic') {
            const aura = ctx.createRadialGradient(tr.x, dy, 0, tr.x, dy, tr.size * 1.3);
            aura.addColorStop(0, 'rgba(155,89,182,0.25)');
            aura.addColorStop(1, 'transparent');
            ctx.fillStyle = aura;
            ctx.beginPath();
            ctx.arc(tr.x, dy, tr.size * 1.3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Corpo com gradiente 3D
        const tg = ctx.createRadialGradient(tr.x - tr.size * 0.3, dy - tr.size * 0.3, 0, tr.x, dy, tr.size);
        tg.addColorStop(0, this.lightenColor(tr.color, 40));
        tg.addColorStop(0.6, tr.color);
        tg.addColorStop(1, this.darkenColor(tr.color, 30));
        ctx.fillStyle = tg;
        ctx.beginPath();
        ctx.arc(tr.x, dy, tr.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Borda do time
        ctx.strokeStyle = tr.owner === 'player' ? '#3498db' : '#e74c3c';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Brilho
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tr.x, dy, tr.size - 3, -Math.PI * 0.7, -Math.PI * 0.2);
        ctx.stroke();
        
        // Ícone
        ctx.font = `${tr.size * 1.1}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tr.icon, tr.x, dy);
        
        // Barra de HP se danificado
        if (tr.hp < tr.max) {
            this.drawHP(tr.x, dy - tr.size - 10, tr.size * 1.6, 6, tr.hp / tr.max);
        }
    });
};

ClashArena.prototype.drawProjectiles = function() {
    const ctx = this.ctx;
    
    this.projectiles.filter(p => p && isFinite(p.x) && isFinite(p.y)).forEach(p => {
        // Trail
        if (p.trail) {
            p.trail.filter(t => t && t.life > 0).forEach((t, i) => {
                const r = Math.max(0.5, 4 * t.life);
                ctx.globalAlpha = Math.max(0, t.life * 0.6);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        ctx.globalAlpha = 1;
        
        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 15);
        glow.addColorStop(0, p.color + 'aa');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Projétil
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
};

ClashArena.prototype.drawEffects = function() {
    const ctx = this.ctx;
    
    this.effects.filter(e => e && isFinite(e.x) && isFinite(e.y)).forEach(e => {
        const p = e.t / e.dur;
        ctx.globalAlpha = 1 - p;
        
        if (e.type === 'spawn') {
            // Círculos expandindo
            ctx.strokeStyle = e.color;
            ctx.lineWidth = 3;
            for (let i = 0; i < 2; i++) {
                ctx.beginPath();
                ctx.arc(e.x, e.y, 15 + p * 35 + i * 10, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else if (e.type === 'explosion') {
            // Explosão com múltiplas camadas
            for (let i = 0; i < 4; i++) {
                const colors = ['#ff3300', '#ff6600', '#ff9900', '#ffcc00'];
                ctx.fillStyle = colors[i];
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.r * (0.2 + p * 0.8) * (1 - i * 0.2), 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Anel externo
            ctx.strokeStyle = '#ff6600';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r * p * 1.2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (e.type === 'splash') {
            // Onda de impacto
            ctx.strokeStyle = e.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r * p, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r * p * 0.7, 0, Math.PI * 2);
            ctx.stroke();
        } else if (e.type === 'hit') {
            // Flash de impacto
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(e.x, e.y, 12 * (1 - p), 0, Math.PI * 2);
            ctx.fill();
            
            // Estrela
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const angle = i * Math.PI / 2 + p * Math.PI;
                ctx.beginPath();
                ctx.moveTo(e.x, e.y);
                ctx.lineTo(e.x + Math.cos(angle) * 15 * (1 - p), e.y + Math.sin(angle) * 15 * (1 - p));
                ctx.stroke();
            }
        }
        
        ctx.globalAlpha = 1;
    });
};

ClashArena.prototype.drawParticles = function() {
    const ctx = this.ctx;
    
    this.particles.filter(p => p && isFinite(p.x) && isFinite(p.y) && p.life > 0).forEach(p => {
        const radius = Math.max(0.1, p.size * p.life);
        ctx.globalAlpha = Math.max(0, p.life);
        
        // Partícula simples (sem glow para performance)
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.globalAlpha = 1;
};

ClashArena.prototype.drawDamageNumbers = function() {
    const ctx = this.ctx;
    
    this.damageNumbers.filter(d => d && isFinite(d.x) && isFinite(d.y)).forEach(d => {
        ctx.globalAlpha = d.life;
        
        // Sombra
        ctx.fillStyle = '#000';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`-${d.damage}`, d.x + 2, d.y + 2);
        
        // Texto
        ctx.fillStyle = d.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeText(`-${d.damage}`, d.x, d.y);
        ctx.fillText(`-${d.damage}`, d.x, d.y);
    });
    
    ctx.globalAlpha = 1;
};

ClashArena.prototype.drawIndicator = function() {
    const ctx = this.ctx, h = this.canvas.height, w = this.canvas.width, t = Date.now() * 0.003;
    const vy = h * 0.55;
    
    // Área de spawn
    const alpha = 0.12 + Math.sin(t) * 0.05;
    const grad = ctx.createLinearGradient(0, vy, 0, h);
    grad.addColorStop(0, `rgba(46,204,113,${alpha})`);
    grad.addColorStop(1, `rgba(46,204,113,${alpha * 0.5})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, vy, w, h - vy);
    
    // Linha pulsante
    ctx.strokeStyle = `rgba(46,204,113,${0.5 + Math.sin(t * 2) * 0.3})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([15, 10]);
    ctx.beginPath();
    ctx.moveTo(0, vy);
    ctx.lineTo(w, vy);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Texto
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👆 CLIQUE PARA POSICIONAR', w / 2, vy + 30);
    
    // Ícone da carta selecionada
    if (this.selected !== null && this.hand[this.selected]) {
        const c = ALL_CARDS[this.hand[this.selected]];
        if (c) {
            ctx.font = '42px Arial';
            ctx.fillText(c.icon, w / 2, vy + 75);
            ctx.font = 'bold 14px Arial';
            ctx.fillText(c.name, w / 2, vy + 105);
        }
    }
};

console.log('✅ Sistema de gráficos HD carregado!');
