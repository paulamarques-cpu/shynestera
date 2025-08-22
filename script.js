/* ================================================
   SYNÉSTHÉRA - SCRIPT PRINCIPAL UNIFICADO
   ================================================
   Organização:
   1. Evento Principal DOMContentLoaded
   2. Funções de Inicialização para cada página
   3. Lógica Específica de cada página (Animações, etc.)
   ================================================ */

// 1. PONTO DE ENTRADA PRINCIPAL
// Este é o único 'DOMContentLoaded' do arquivo. Ele organiza e chama as outras funções.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Synesthéra Scripts Iniciados.");

    // Chama as funções de inicialização para cada tipo de página.
    // Cada função interna verificará se está na página correta antes de executar.
    initHomePage();
    initForcasCosmicasPage();
    initCronologiaPage();
    initDinamicaCosmicaPage();
    initProfilePages();
    initEraDetailPage();
    
    // Inicializa o controle de áudio globalmente.
    initAudioPlayer();
});


// 2. FUNÇÕES DE INICIALIZAÇÃO
// Cada função aqui é um "portão" para a lógica de uma página específica.

function initHomePage() {
    const nebulaCanvas = document.getElementById('nebula-canvas');
    if (!nebulaCanvas) return; // Sai se não estiver na Home

    console.log("-> Inicializando: Página Inicial");
    animateNebula(nebulaCanvas);

    // Lógica do Scroll Reveal (pode ser usada em várias páginas)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }
}

function initForcasCosmicasPage() {
    const forcesPageContainer = document.querySelector('.content-wrapper');
    if (!forcesPageContainer || !forcesPageContainer.querySelector('.force-section')) return;

    console.log("-> Inicializando: Forças Cósmicas");
    setupRhozaiaForceCanvas();
    setupCythalForceCanvas();
    setupThaianForceCanvas();
    setupKhaanlurForceCanvas();
}

function initCronologiaPage() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    console.log("-> Inicializando: Cronologia");
    const melodicCord = timeline.querySelector('.melodic-cord');
    const eraContainers = timeline.querySelectorAll('.era-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const eraContainer = entry.target;
            // Verifica se os elementos internos existem antes de usá-los
            const node = eraContainer.querySelector('.timeline-node');
            const card = eraContainer.querySelector('.era-card');
            const eraColor = eraContainer.dataset.eraColor || '#FFD700';

            if (entry.isIntersecting) {
                eraContainer.classList.add('visible');
                if(node) node.classList.add('active');
                if (melodicCord) {
                    melodicCord.style.backgroundColor = eraColor;
                    melodicCord.style.boxShadow = `0 0 15px ${eraColor}`;
                }
                if(card) card.style.boxShadow = `0 0 25px -5px ${eraColor}`;
            } else {
                if(node) node.classList.remove('active');
                if(card) card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            }
        });
    }, { root: null, threshold: 0.5 });

    eraContainers.forEach(container => observer.observe(container));
}

function initDinamicaCosmicaPage() {
    const dinamicaContainer = document.getElementById('dinamica-container');
    if (!dinamicaContainer) return;

    console.log("-> Inicializando: Dinâmica Cósmica");
    const overlay = document.createElement('div');
    overlay.id = 'dinamica-overlay';
    dinamicaContainer.appendChild(overlay);

    const interactiveNodes = document.querySelectorAll('.force-node.interactive');
    const allCards = document.querySelectorAll('.interaction-card');
    let hideTimeout;

    const showCard = (interactionId) => {
        clearTimeout(hideTimeout);
        const cardToShow = document.getElementById(interactionId);
        if (cardToShow) {
            allCards.forEach(c => c.classList.remove('visible'));
            cardToShow.classList.add('visible');
            dinamicaContainer.classList.add('card-active');
        }
    };

    const hideAllCards = () => {
        hideTimeout = setTimeout(() => {
            dinamicaContainer.classList.remove('card-active');
            allCards.forEach(card => card.classList.remove('visible'));
        }, 300);
    };

    interactiveNodes.forEach(node => {
        node.addEventListener('mouseenter', () => showCard(node.dataset.interaction));
        node.addEventListener('mouseleave', hideAllCards);
    });

    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        card.addEventListener('mouseleave', hideAllCards);
    });
}

function initProfilePages() {
    // Detecção mais robusta para qualquer página de perfil
    if (document.querySelector('[id*="-profile-canvas"], [id*="-profile-body"]')) {
        console.log("-> Inicializando: Página de Perfil");
        setupRhozaiaProfileCanvas();
        setupCythalProfileCanvas();
        setupKhaanlurProfileCanvas();
        // Autoplay seguro para perfis que possuem áudio
        initProfileAudio();
    }
}

// Inicializa autoplay seguro para páginas de perfil com áudio
function initProfileAudio() {
    // If a thematic interaction veil exists on the page, skip profile autoplay
    if (document.getElementById('interaction-veil')) return;
    const audio = document.getElementById('page-audio');
    const musicControl = document.getElementById('music-control');
    if (!audio || !musicControl) return;

    // Garante que o áudio esteja mudo no carregamento para permitir autoplay
    audio.muted = true;
    audio.play().catch(() => { /* autoplay pode falhar, será ativado na interação */ });

    // Atualiza o ícone inicial
    musicControl.textContent = '🔇';

    musicControl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.muted) {
            audio.muted = false;
            musicControl.textContent = '🔊';
            audio.play().catch(() => {});
        } else {
            audio.muted = true;
            musicControl.textContent = '🔇';
            audio.pause();
        }
    });
}

function initEraDetailPage() {
    const bgContainer = document.getElementById('era-background-container');
    if (!bgContainer) return;

    console.log("-> Inicializando: Detalhe da Era");
    const textBlocks = document.querySelectorAll('.era-text-block[data-bg-image]');
    if (textBlocks.length === 0) return;

    textBlocks.forEach((block, index) => {
        const bgImageDiv = document.createElement('div');
        bgImageDiv.classList.add('era-background-image');
        bgImageDiv.style.backgroundImage = `url(${block.dataset.bgImage})`;
        bgImageDiv.dataset.index = index;
        bgContainer.appendChild(bgImageDiv);
    });

    const bgImages = document.querySelectorAll('.era-background-image');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const blockIndex = Array.from(textBlocks).indexOf(entry.target);
                bgImages.forEach(img => img.classList.remove('active'));
                const activeImage = document.querySelector(`.era-background-image[data-index="${blockIndex}"]`);
                if (activeImage) activeImage.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    textBlocks.forEach(block => observer.observe(block));
}

// A versão corrigida e mais segura:
function initAudioPlayer() {
    const veil = document.getElementById('interaction-veil');
    const startContainer = document.getElementById('start-experience-container');
    const audio = document.getElementById('page-audio');
    const musicControl = document.getElementById('music-control');

    // Se os elementos essenciais não existirem, encerra a função.
    if (!veil || !startContainer || !audio || !musicControl) return;

    // Inicia animação do véu se houver.
    animateVeilCanvas();

    console.log('-> Inicializando: Player de Áudio com Véu de Interação');

    let isPlaying = false;
    let userHasInteracted = false;

    const tryToPlay = () => {
        audio.play().catch(() => { /* falha silenciosa até primeira interação */ });
    };

    const enableSound = () => {
        userHasInteracted = true;
        audio.muted = false;
        tryToPlay();
    };

    const updateButtonIcon = () => {
        musicControl.textContent = isPlaying ? '🔊' : '🔇';
    };

    // Clique inicial no container: esconde véu e inicia áudio
    startContainer.addEventListener('click', () => {
        veil.classList.add('hidden');
        enableSound();
        isPlaying = true;
        updateButtonIcon();
    }, { once: true });

    // Controle principal de play/pause
    musicControl.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!userHasInteracted) enableSound();
        isPlaying = !isPlaying;
        if (isPlaying) tryToPlay(); else audio.pause();
        updateButtonIcon();
    });

    // Garante que, na primeira interação do usuário, o som seja habilitado
    const onFirstInteraction = () => {
        if (userHasInteracted) return;
        enableSound();
        // Remove ouvintes após a primeira interação
        document.body.removeEventListener('click', onFirstInteraction);
        document.body.removeEventListener('wheel', onFirstInteraction);
        document.body.removeEventListener('touchstart', onFirstInteraction);
    };

    document.body.addEventListener('click', onFirstInteraction, { once: true });
    document.body.addEventListener('wheel', onFirstInteraction, { once: true });
    document.body.addEventListener('touchstart', onFirstInteraction, { once: true });

    // Tenta tocar silenciosamente (pode falhar até interação)
    tryToPlay();
}

// 3. LÓGICA ESPECÍFICA (FUNÇÕES DE ANIMAÇÃO, ETC.)
// Todo o código de animação que estava dentro dos 'if' agora está em funções nomeadas
// para manter o código limpo e organizado.

function animateNebula(canvas) {
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    const particleCount = 200;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 2 + 1,
            color: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 50 + 150}, ${Math.random() * 100 + 150}, ${Math.random() * 0.5 + 0.2})`
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath(); ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function setupRhozaiaForceCanvas() {
    const canvas = document.getElementById('rhozaia-force-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let veins = [];
    class Vein {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 1 + 0.5;
            this.lineWidth = Math.random() * 2 + 1;
            this.life = 150;
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.angle += (Math.random() - 0.5) * 0.5;
            this.life--;
        }
        draw(context) {
            context.beginPath();
            context.moveTo(this.x, this.y);
            this.update();
            context.lineTo(this.x, this.y);
            context.strokeStyle = `rgba(255, 20, 147, ${this.life / 150})`;
            context.lineWidth = this.lineWidth;
            context.stroke();
        }
    }

    function animate() {
        if (veins.length < 100) {
            veins.push(new Vein(Math.random() * canvas.width, Math.random() * canvas.height));
        }
        ctx.fillStyle = 'rgba(61, 15, 36, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = veins.length - 1; i >= 0; i--) {
            veins[i].draw(ctx);
            if (veins[i].life <= 0) {
                veins.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function setupCythalForceCanvas() {
    const canvas = document.getElementById('cythal-force-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let time = 0;
    function animate() {
        time += 0.005;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1;

        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i + Math.sin(time + i * 0.1) * 10, 0);
            ctx.lineTo(i + Math.sin(time + i * 0.1) * 10, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 30) {
            ctx.beginPath();
            ctx.moveTo(0, i + Math.cos(time + i * 0.1) * 10);
            ctx.lineTo(canvas.width, i + Math.cos(time + i * 0.1) * 10);
            ctx.stroke();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function setupThaianForceCanvas() {
    const canvas = document.getElementById('thaian-force-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let starDust = [];
    const starCount = 200;
    class Star {
        constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 1.5; this.speedY = Math.random() * 0.2 + 0.1; this.opacity = Math.random() * 0.5 + 0.2; }
        update() { this.y += this.speedY; if (this.y > canvas.height) { this.y = 0; this.x = Math.random() * canvas.width; } }
        draw() { ctx.fillStyle = `rgba(220, 200, 255, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    for (let i = 0; i < starCount; i++) { starDust.push(new Star()); }

    let time = 0;
    function drawNebula() {
        time += 0.001;
        const gradient = ctx.createRadialGradient(
            canvas.width / 2 + Math.sin(time) * 100,
            canvas.height / 2 + Math.cos(time) * 100,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 1.5
        );
        gradient.addColorStop(0, '#483D8B');
        gradient.addColorStop(0.5, '#8A2BE2');
        gradient.addColorStop(1, '#2c1a4c');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawNebula();
        starDust.forEach(star => { star.update(); star.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

function setupKhaanlurForceCanvas() {
    const canvas = document.getElementById('khaanlur-force-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const eyeImage = new Image();
    eyeImage.src = 'images/khaanlur-symbol.png';
    const eyes = [];
    const numEyes = 10;
    for (let i = 0; i < numEyes; i++) {
        eyes.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            size: Math.random() * 80 + 40, opacity: 0,
            speed: Math.random() * 0.004 + 0.001, fadingIn: true
        });
    }

    function animateEyes() {
        ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        eyes.forEach(eye => {
            if (eye.fadingIn) {
                eye.opacity += eye.speed;
                if (eye.opacity >= 0.1) eye.fadingIn = false;
            } else {
                eye.opacity -= eye.speed;
                if (eye.opacity <= 0) {
                    eye.x = Math.random() * canvas.width;
                    eye.y = Math.random() * canvas.height;
                    eye.fadingIn = true;
                }
            }
            ctx.globalAlpha = eye.opacity;
            ctx.drawImage(eyeImage, eye.x - eye.size / 2, eye.y - eye.size / 2, eye.size, eye.size);
        });
        ctx.globalAlpha = 1.0;
        requestAnimationFrame(animateEyes);
    }
    eyeImage.onload = animateEyes;
}
function setupRhozaiaProfileCanvas() {
    const canvas = document.getElementById('rhozaia-profile-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { 
        width = canvas.width = window.innerWidth; 
        height = canvas.height = window.innerHeight; 
    });

    const particles = [];
    const particleCount = 50;
    class Particle {
        constructor() { this.respawn(); }
        respawn() { this.x = Math.random() * width; this.y = Math.random() * height; this.size = Math.random() * 2 + 1; this.speedX = (Math.random() - 0.5) * 0.5; this.speedY = (Math.random() - 0.5) * 0.5; this.opacity = Math.random() * 0.5 + 0.5; }
        update() { this.x += this.speedX; this.y += this.speedY; if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) { this.respawn(); } }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 220, 185, ${this.opacity})`; ctx.fill(); }
    }
    for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); }

    function animate() {
        ctx.fillStyle = 'rgba(26, 8, 18, 0.2)';
        ctx.fillRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

function setupCythalProfileCanvas() {
    const canvas = document.getElementById('cythal-canvas');
    if (!canvas || document.body.id !== 'cythal-profile-body') return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { 
        width = canvas.width = window.innerWidth; 
        height = canvas.height = window.innerHeight; 
    });

    const nodes = [];
    const nodeCount = 50;
    const maxDist = 150;
    class Node {
        constructor() { this.x = Math.random() * width; this.y = Math.random() * height; this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5; this.radius = Math.random() * 1.5 + 1; }
        update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > width) this.vx *= -1; if (this.y < 0 || this.y > height) this.vy *= -1; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = '#00e5ff'; ctx.fill(); }
    }
    for (let i = 0; i < nodeCount; i++) { nodes.push(new Node()); }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        nodes.forEach(node => { node.update(); node.draw(); });
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                if (dist < maxDist) {
                    ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(0, 229, 255, ${1 - dist / maxDist})`; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function setupKhaanlurProfileCanvas() {
    const canvas = document.getElementById('khaanlur-corruption-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { 
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight; 
    });

    const eyeImage = new Image();
    eyeImage.src = '../images/khaanlur-symbol.png';
    const eyes = [];
    const numEyes = 10;
    for (let i = 0; i < numEyes; i++) { 
        eyes.push({ 
            x: Math.random() * canvas.width, y: Math.random() * canvas.height, 
            size: Math.random() * 100 + 50, opacity: 0, 
            fadeSpeed: Math.random() * 0.005 + 0.002, isFadingIn: true 
        }); 
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        eyes.forEach(eye => { 
            if (eye.isFadingIn) { 
                eye.opacity += eye.fadeSpeed; 
                if (eye.opacity >= 0.1) eye.isFadingIn = false; 
            } else { 
                eye.opacity -= eye.fadeSpeed; 
                if (eye.opacity <= 0) { 
                    eye.x = Math.random() * canvas.width; 
                    eye.y = Math.random() * canvas.height; 
                    eye.isFadingIn = true; 
                } 
            } 
            ctx.globalAlpha = eye.opacity; 
            ctx.drawImage(eyeImage, eye.x - eye.size / 2, eye.y - eye.size / 2, eye.size, eye.size * (eyeImage.height / eyeImage.width)); 
            ctx.globalAlpha = 1.0; 
        });
        requestAnimationFrame(animate);
    }
    eyeImage.onload = animate;
}
function animateVeilCanvas() {
    const canvas = document.getElementById('veil-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}
