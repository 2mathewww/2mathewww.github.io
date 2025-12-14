// ============ PARTICLE SYSTEM ============
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let width, height, particles, mouse;

function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    mouse = { x: null, y: null, radius: 100 };

    // Reduce particles on mobile for performance
    const isMobile = window.innerWidth < 768;
    const numParticles = isMobile 
        ? Math.floor((width * height) / 20000) 
        : Math.floor((width * height) / 12000);
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.4 + 0.1
        });
    }
}

let shapeAngle = 0;

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (mouse.x) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                p.x += dx * force * 0.02;
                p.y += dy * force * 0.02;
            }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Connect particles (reduce connections on mobile)
        const connectionLimit = window.innerWidth < 768 ? 80 : 100;
        particles.slice(i + 1, i + 10).forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionLimit) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / connectionLimit)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    });

    // Alien geometric pattern (smaller on mobile)
    shapeAngle += 0.002;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * (window.innerWidth < 768 ? 0.12 : 0.15);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(shapeAngle);

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x1 = Math.cos(angle) * radius * 0.5;
        const y1 = Math.sin(angle) * radius * 0.5;
        const x2 = Math.cos(angle + Math.PI) * radius * 0.5;
        const y2 = Math.sin(angle + Math.PI) * radius * 0.5;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.setLineDash([]);
        ctx.stroke();
    }

    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 - shapeAngle * 2;
        const x = Math.cos(angle) * radius * 0.8;
        const y = Math.sin(angle) * radius * 0.8;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
    }

    ctx.restore();

    requestAnimationFrame(animateParticles);
}

// Touch support for mobile
document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('touchmove', e => {
    if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
});

document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

document.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();

// ============ GITHUB INTEGRATION ============
async function fetchGitHubRepos() {
    const username = document.getElementById('github-username').value.trim();
    if (!username) return;

    document.getElementById('display-username').textContent = username;
    document.getElementById('repo-tree').innerHTML = `
        <div class="loading">
            <span class="loading-spinner">◐</span> Fetching...
        </div>
    `;

    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('User not found');
        const userData = await userRes.json();

        document.getElementById('github-stats').innerHTML = `
            <span>📦 ${userData.public_repos} repos</span>
            <span>👥 ${userData.followers} followers</span>
        `;

        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        const repos = await reposRes.json();

        if (repos.length === 0) {
            document.getElementById('repo-tree').innerHTML = `
                <div class="error-msg">No public repositories found.</div>
            `;
            return;
        }

        let html = '';
        repos.forEach((repo) => {
            html += `
                <div class="repo-item">
                    <div class="repo-node"></div>
                    <div class="repo-content">
                        <div class="repo-name">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                            ${repo.fork ? '<span style="opacity:0.4">(fork)</span>' : ''}
                        </div>
                        <div class="repo-desc">${repo.description || 'No description'}</div>
                        <div class="repo-meta">
                            ${repo.language ? `<span class="repo-lang">${repo.language}</span>` : ''}
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span>🍴 ${repo.forks_count}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        document.getElementById('repo-tree').innerHTML = html;

    } catch (error) {
        document.getElementById('repo-tree').innerHTML = `
            <div class="error-msg">
                ⚠️ ${error.message}
            </div>
        `;
        document.getElementById('github-stats').innerHTML = '';
    }
}

document.getElementById('github-username').addEventListener('keypress', e => {
    if (e.key === 'Enter') fetchGitHubRepos();
});

fetchGitHubRepos();

// ============ TIME ============
function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('time').textContent = time;
}
updateTime();
setInterval(updateTime, 1000);

document.getElementById('year').textContent = new Date().getFullYear();

// ============ LIGHTBOX ============
function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

// ============ SCROLL TO TOP ============
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}