// ==================== 页面加载 ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pageLoader').classList.add('hidden');
    }, 500);
});

// ==================== 打字机效果 ====================
const typewriterText = 'UI设计师 & 数字牧场主';
const typewriterElement = document.getElementById('typewriter');
let charIndex = 0;

function typeWriter() {
    if (charIndex < typewriterText.length) {
        typewriterElement.innerHTML = typewriterText.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
        charIndex++;
        setTimeout(typeWriter, 100);
    } else {
        typewriterElement.innerHTML = typewriterText + '<span class="typing-cursor"></span>';
    }
}

setTimeout(typeWriter, 600);

// ==================== 移动端菜单 ====================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 点击链接后关闭菜单
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ==================== 导航高亮 ====================
(function () {
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    const sections = navLinks
        .map(link => {
            const id = link.getAttribute('href');
            if (!id || !id.startsWith('#')) return null;
            const el = document.querySelector(id);
            return el ? { id, el } : null;
        })
        .filter(Boolean);

    if (!navLinks.length || !sections.length) return;

    function setActiveById(id) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === id) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                setActiveById(href);
            }
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            let best = null;
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                if (!best || entry.intersectionRatio > best.intersectionRatio) {
                    best = entry;
                }
            }
            if (best && best.target && best.target.id) {
                setActiveById('#' + best.target.id);
            }
        },
        {
            threshold: [0.3, 0.6],
            rootMargin: '-20% 0px -40% 0px',
        }
    );

    sections.forEach(({ el }) => observer.observe(el));
})();

// ==================== 鼠标聚光灯效果 ====================
(function () {
    const spotlight = document.getElementById('globalSpotlight');
    if (!spotlight) return;
    
    // 检测是否为触摸设备
    if (window.matchMedia('(pointer: coarse)').matches) {
        spotlight.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let spotX = 0, spotY = 0;
    let isActive = false;
    let rafId = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isActive) {
            isActive = true;
            spotlight.style.opacity = '1';
            animate();
        }
    });

    document.addEventListener('mouseleave', () => {
        isActive = false;
        spotlight.style.opacity = '0';
        if (rafId) cancelAnimationFrame(rafId);
    });

    function animate() {
        if (!isActive) return;
        spotX += (mouseX - spotX) * 0.1;
        spotY += (mouseY - spotY) * 0.1;
        spotlight.style.left = spotX + 'px';
        spotlight.style.top = spotY + 'px';
        rafId = requestAnimationFrame(animate);
    }
})();

// ==================== 技能卡片 Magic Bento 交互 ====================
(function () {
    const cards = document.querySelectorAll('.magic-bento-card--border-glow');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--glow-x', x + '%');
            card.style.setProperty('--glow-y', y + '%');
            card.style.setProperty('--glow-intensity', '1');
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--glow-intensity', '0');
        });

        card.addEventListener('mouseenter', () => createParticles(card));

        card.addEventListener('click', () => {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(132, 0, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 3;
            `;
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.marginLeft = -size / 2 + 'px';
            ripple.style.marginTop = -size / 2 + 'px';
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    function createParticles(card) {
        const existing = card.querySelectorAll('.particle');
        if (existing.length > 5) return;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = '100%';
                particle.style.animationDelay = Math.random() * 0.5 + 's';
                particle.style.animationDuration = (2 + Math.random() * 2) + 's';
                card.appendChild(particle);
                setTimeout(() => particle.remove(), 4000);
            }, i * 200);
        }
    }

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 1200 + index * 100);
    });
})();

// ==================== WebGL 光线背景 ====================
(function () {
    const container = document.getElementById('lightRaysBackground');
    if (!container) return;

    const waitForOGL = () =>
        new Promise((resolve) => {
            if (window.OGL) return resolve(window.OGL);
            const t = setInterval(() => {
                if (window.OGL) {
                    clearInterval(t);
                    resolve(window.OGL);
                }
            }, 50);
        });

    waitForOGL().then((OGL) => {
        if (!container) return; // 组件可能已卸载
        initLightRays(container, OGL);
    });

    function initLightRays(container, OGL) {
        const { Renderer, Program, Triangle, Mesh } = OGL;

    function hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m
            ? [
                  parseInt(m[1], 16) / 255,
                  parseInt(m[2], 16) / 255,
                  parseInt(m[3], 16) / 255,
              ]
            : [1, 1, 1];
    }

    function rgbToHex(r, g, b) {
        const toHex = (n) => {
            const h = Math.round(n * 255).toString(16);
            return h.length === 1 ? '0' + h : h;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    let raysOrigin = 'top-center';

    function getAnchorAndDir(origin, w, h) {
        const outside = 0.2;
        const positions = {
            'top-center': { anchor: [0.5 * w, -outside * h], dir: [0, 1] },
            'top-left': { anchor: [-outside * w, -outside * h], dir: [1, 1] },
            'top-right': { anchor: [w + outside * w, -outside * h], dir: [-1, 1] },
            'center-left': { anchor: [-outside * w, 0.5 * h], dir: [1, 0] },
            'center-right': { anchor: [w + outside * w, 0.5 * h], dir: [-1, 0] },
            'bottom-center': { anchor: [0.5 * w, h + outside * h], dir: [0, -1] },
            'bottom-left': { anchor: [-outside * w, h + outside * h], dir: [1, -1] },
            'bottom-right': { anchor: [w + outside * w, h + outside * h], dir: [-1, -1] },
        };
        const { anchor, dir } = positions[origin] || positions['top-center'];
        const len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
        return {
            anchor: [...anchor],
            dir: [dir[0] / len, dir[1] / len],
        };
    }

    const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
    });

    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(gl.canvas);

    const vert = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
            vUv = position * 0.5 + 0.5;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const frag = `precision highp float;
        uniform float iTime;
        uniform vec2  iResolution;
        uniform vec2  rayPos;
        uniform vec2  rayDir;
        uniform vec3  raysColor;
        uniform float raysSpeed;
        uniform float lightSpread;
        uniform float rayLength;
        uniform float pulsating;
        uniform float fadeDistance;
        uniform float saturation;
        uniform vec2  mousePos;
        uniform float mouseInfluence;
        uniform float noiseAmount;
        uniform float distortion;
        varying vec2 vUv;

        float noise(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
            vec2 sourceToCoord = coord - raySource;
            vec2 dirNorm = normalize(sourceToCoord);
            float cosAngle = dot(dirNorm, rayRefDirection);
            float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
            float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
            float distance = length(sourceToCoord);
            float maxDistance = iResolution.x * rayLength;
            float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
            float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
            float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
            float baseStrength = clamp(
                (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
                (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
                0.0, 1.0
            );
            return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
        }

        void main() {
            vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
            vec2 finalRayDir = rayDir;
            if (mouseInfluence > 0.0) {
                vec2 mouseScreenPos = mousePos * iResolution.xy;
                vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
                finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
            }
            vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
            vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
            vec4 color = rays1 * 0.5 + rays2 * 0.4;
            if (noiseAmount > 0.0) {
                float n = noise(coord * 0.01 + iTime * 0.1);
                color.rgb *= (1.0 - noiseAmount + noiseAmount * n);
            }
            float brightness = 1.0 - (coord.y / iResolution.y);
            color.x *= 0.1 + brightness * 0.8;
            color.y *= 0.3 + brightness * 0.6;
            color.z *= 0.5 + brightness * 0.5;
            if (saturation != 1.0) {
                float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                color.rgb = mix(vec3(gray), color.rgb, saturation);
            }
            color.rgb *= raysColor;
            gl_FragColor = color;
        }
    `;

    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: hexToRgb('#b686fd') },
        raysSpeed: { value: 0.5 },
        lightSpread: { value: 1.2 },
        rayLength: { value: 2.5 },
        pulsating: { value: 1.0 },
        fadeDistance: { value: 1.2 },
        saturation: { value: 1.2 },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: 0.15 },
        noiseAmount: { value: 0.5 },
        distortion: { value: 0.0 },
    };

    const mouseRaw = { x: 0.5, y: 0.5 };
    const mouseSmooth = { x: 0.5, y: 0.5 };
    let followMouse = true;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms,
    });
    const mesh = new Mesh(gl, { geometry, program });

    function updateSize() {
        const rect = container.getBoundingClientRect();
        const wCSS = rect.width;
        const hCSS = rect.height;
        renderer.setSize(wCSS, hCSS);
        const dpr = renderer.dpr;
        const w = wCSS * dpr;
        const h = hCSS * dpr;
        uniforms.iResolution.value = [w, h];
        const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
        uniforms.rayPos.value = anchor;
        uniforms.rayDir.value = dir;
    }

    updateSize();
    window.addEventListener('resize', updateSize);

    const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        mouseRaw.x = (e.clientX - rect.left) / rect.width;
        mouseRaw.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    function loop(t) {
        uniforms.iTime.value = t * 0.001;
        if (followMouse && uniforms.mouseInfluence.value > 0) {
            const smoothing = 0.92;
            mouseSmooth.x = mouseSmooth.x * smoothing + mouseRaw.x * (1 - smoothing);
            mouseSmooth.y = mouseSmooth.y * smoothing + mouseRaw.y * (1 - smoothing);
            uniforms.mousePos.value = [mouseSmooth.x, mouseSmooth.y];
        }
        renderer.render({ scene: mesh });
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // 控制面板
    const panel = document.getElementById('lightRaysControls');
    const bodyEl = document.getElementById('lightRaysControlsBody');
    const toggleBtn = document.getElementById('lightRaysToggle');
    const showBtn = document.getElementById('lightRaysShowBtn');
    if (!panel || !bodyEl || !toggleBtn || !showBtn) return;

    const originLabels = {
        'top-center': '顶部中心',
        'top-left': '左上',
        'top-right': '右上',
        'center-left': '左侧',
        'center-right': '右侧',
        'bottom-center': '底部中心',
        'bottom-left': '左下',
        'bottom-right': '右下',
    };

    function addRow(labelContent, html) {
        const row = document.createElement('div');
        row.className = 'control-row';
        row.innerHTML = labelContent ? `<label>${labelContent}</label>${html}` : html;
        bodyEl.appendChild(row);
        return row;
    }

    addRow(
        '光源位置',
        `<select id="lrOrigin">
            ${Object.entries(originLabels)
                .map(([v, t]) => `<option value="${v}" ${v === raysOrigin ? 'selected' : ''}>${t}</option>`)
                .join('')}
        </select>`
    );

    addRow('光线颜色', `<input type="color" id="lrColor" value="${rgbToHex(uniforms.raysColor.value[0], uniforms.raysColor.value[1], uniforms.raysColor.value[2])}">`);

    addRow(
        `速度 <span class="value-display" id="lrSpeedVal">${uniforms.raysSpeed.value.toFixed(1)}</span>`,
        `<input type="range" id="lrSpeed" min="0" max="3" step="0.1" value="${uniforms.raysSpeed.value}">`
    );
    addRow(
        `扩散 <span class="value-display" id="lrSpreadVal">${uniforms.lightSpread.value.toFixed(1)}</span>`,
        `<input type="range" id="lrSpread" min="0.1" max="3" step="0.1" value="${uniforms.lightSpread.value}">`
    );
    addRow(
        `长度 <span class="value-display" id="lrLengthVal">${uniforms.rayLength.value.toFixed(1)}</span>`,
        `<input type="range" id="lrLength" min="0.5" max="5" step="0.1" value="${uniforms.rayLength.value}">`
    );
    addRow(
        `鼠标影响 <span class="value-display" id="lrMouseInfVal">${(uniforms.mouseInfluence.value * 100).toFixed(0)}%</span>`,
        `<input type="range" id="lrMouseInf" min="0" max="1" step="0.05" value="${uniforms.mouseInfluence.value}">`
    );
    addRow(
        `扭曲 <span class="value-display" id="lrDistortionVal">${(uniforms.distortion.value * 100).toFixed(0)}%</span>`,
        `<input type="range" id="lrDistortion" min="0" max="2" step="0.1" value="${uniforms.distortion.value}">`
    );
    addRow(
        `噪点 <span class="value-display" id="lrNoiseVal">${(uniforms.noiseAmount.value * 100).toFixed(0)}%</span>`,
        `<input type="range" id="lrNoise" min="0" max="1" step="0.05" value="${uniforms.noiseAmount.value}">`
    );
    addRow(
        '渐变距离',
        `<input type="range" id="lrFade" min="0.2" max="2" step="0.1" value="${uniforms.fadeDistance.value}">`
    );
    addRow(
        '饱和度',
        `<input type="range" id="lrSaturation" min="0" max="2" step="0.1" value="${uniforms.saturation.value}">`
    );
    addRow(
        '脉冲效果',
        `<label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;"><input type="checkbox" id="lrPulsating" ${uniforms.pulsating.value > 0.5 ? 'checked' : ''}>启用</label>`
    );
    addRow(
        '跟随鼠标',
        `<label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;"><input type="checkbox" id="lrFollowMouse" ${followMouse ? 'checked' : ''}>启用</label>`
    );

    document.getElementById('lrOrigin').addEventListener('change', (e) => {
        raysOrigin = e.target.value;
        updateSize();
    });
    document.getElementById('lrColor').addEventListener('input', (e) => {
        uniforms.raysColor.value = hexToRgb(e.target.value);
    });
    document.getElementById('lrSpeed').addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        uniforms.raysSpeed.value = v;
        const el = document.getElementById('lrSpeedVal');
        if (el) el.textContent = v.toFixed(1);
    });
    document.getElementById('lrSpread').addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        uniforms.lightSpread.value = v;
        const el = document.getElementById('lrSpreadVal');
        if (el) el.textContent = v.toFixed(1);
    });
    document.getElementById('lrLength').addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        uniforms.rayLength.value = v;
        const el = document.getElementById('lrLengthVal');
        if (el) el.textContent = v.toFixed(1);
    });
    document.getElementById('lrMouseInf').addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        uniforms.mouseInfluence.value = v;
        const el = document.getElementById('lrMouseInfVal');
        if (el) el.textContent = (v * 100).toFixed(0) + '%';
    });
    document.getElementById('lrDistortion').addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        uniforms.distortion.value = v;
        const el = document.getElementById('lrDistortionVal');
        if (el) el.textContent = (v * 100).toFixed(0) + '%';
    });
    document.getElementById('lrNoise').addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        uniforms.noiseAmount.value = v;
        const el = document.getElementById('lrNoiseVal');
        if (el) el.textContent = (v * 100).toFixed(0) + '%';
    });
    document.getElementById('lrFade').addEventListener('input', (e) => {
        uniforms.fadeDistance.value = parseFloat(e.target.value);
    });
    document.getElementById('lrSaturation').addEventListener('input', (e) => {
        uniforms.saturation.value = parseFloat(e.target.value);
    });
    document.getElementById('lrPulsating').addEventListener('change', (e) => {
        uniforms.pulsating.value = e.target.checked ? 1.0 : 0.0;
    });
    document.getElementById('lrFollowMouse').addEventListener('change', (e) => {
        followMouse = e.target.checked;
    });

    toggleBtn.addEventListener('click', () => {
        const hidden = panel.classList.toggle('controls-hidden');
        toggleBtn.textContent = hidden ? '显示' : '隐藏';
        showBtn.style.display = hidden ? 'block' : 'none';
    });

    showBtn.addEventListener('click', () => {
        panel.classList.remove('controls-hidden');
        toggleBtn.textContent = '隐藏';
        showBtn.style.display = 'none';
    });
    } // end initLightRays
})();

// ==================== 滚动指示器 ====================
document.getElementById('scrollIndicator').addEventListener('click', () => {
    document.getElementById('bio').scrollIntoView({ behavior: 'smooth' });
});

// ==================== 项目页时间轴 ====================
(function () {
    const projectsData = {
        2022: ['项目01：《智能云平台》', '项目02：《数据分析系统》', '项目03：《移动端APP》', '项目04：《企业官网重构》'],
        2023: ['项目01：《AI助手开发》', '项目02：《区块链应用》', '项目03：《电商小程序》', '项目04：《后台管理系统》', '项目05：《数据可视化平台》'],
        2024: ['项目01：《大模型应用》', '项目02：《物联网平台》', '项目03：《智慧城市方案》', '项目04：《金融风控系统》'],
        2025: ['项目01：《元宇宙项目》', '项目02：《自动驾驶UI》', '项目03：《医疗AI诊断》', '项目04：《教育科技平台》', '项目05：《新能源监控》'],
        2026: ['项目01：《量子计算界面》', '项目02：《太空探索数据》', '项目03：《脑机接口设计》', '项目04：《未来城市规划》']
    };
    const years = [2022, 2023, 2024, 2025, 2026];
    let isYearSelected = false;

    const INFINITE_COPIES = 3; // 无限流：复制多份以实现无缝循环

    function initProjectTimeline() {
        const track = document.getElementById('projectTimelineTrack');
        if (!track) return;
        track.innerHTML = '';
        track.classList.add('project-timeline-infinite');
        track.classList.remove('project-timeline-tags');
        for (let i = 0; i < INFINITE_COPIES; i++) {
            years.forEach(year => {
                const node = document.createElement('div');
                node.className = 'project-year-node';
                node.setAttribute('data-year', year);
                node.onclick = () => selectProjectYear(year);
                node.innerHTML = `<span class="project-year-text">${String(year).slice(0, 2)}</span><span class="project-year-sub">${String(year).slice(2)}</span>`;
                track.appendChild(node);
            });
        }
    }

    function selectProjectYear(year) {
        if (isYearSelected) return;
        isYearSelected = true;

        const container = document.getElementById('projectTimelineContainer');
        const track = document.getElementById('projectTimelineTrack');
        const yearFixed = document.getElementById('projectYearFixed');
        const backBtn = document.getElementById('projectBackBtn');
        const mainContent = document.getElementById('projectMainContent');

        if (!container || !track) return;

        document.body.classList.add('project-year-active');
        container.classList.add('active');
        if (backBtn) backBtn.classList.add('visible');
        if (mainContent) mainContent.classList.add('dimmed');

        if (yearFixed) {
            yearFixed.innerHTML = '';
            const node = document.createElement('div');
            node.className = 'project-year-node active';
            node.innerHTML = `<span class="project-year-text">${String(year).slice(0, 2)}</span><span class="project-year-sub">${String(year).slice(2)}</span>`;
            yearFixed.appendChild(node);
        }

        track.innerHTML = '';
        track.style.animation = 'none';
        track.classList.remove('project-timeline-infinite');
        track.classList.add('project-timeline-tags');

        const projects = projectsData[year] || [];
        const TAG_COPIES = 4;
        for (let i = 0; i < TAG_COPIES; i++) {
            projects.forEach((project) => {
                const tag = document.createElement('div');
                tag.className = 'project-tag';
                tag.textContent = project;
                tag.onclick = () => {
                    tag.style.background = 'rgba(139, 92, 246, 0.5)';
                    setTimeout(() => { tag.style.background = ''; }, 300);
                };
                track.appendChild(tag);
            });
        }
        setTimeout(() => {
            track.style.animation = `projectSlideLeft 25s linear infinite`;
            track.style.setProperty('--infinite-loop-offset', `${-100 / TAG_COPIES}%`);
        }, 50);
    }

    function resetProjectTimeline() {
        isYearSelected = false;
        document.body.classList.remove('project-year-active');

        const container = document.getElementById('projectTimelineContainer');
        const track = document.getElementById('projectTimelineTrack');
        const yearFixed = document.getElementById('projectYearFixed');
        const backBtn = document.getElementById('projectBackBtn');
        const mainContent = document.getElementById('projectMainContent');

        if (container) container.classList.remove('active');
        if (yearFixed) yearFixed.innerHTML = '';
        if (backBtn) backBtn.classList.remove('visible');
        if (mainContent) mainContent.classList.remove('dimmed');

        if (track) {
            track.style.animation = '';
            track.style.setProperty('--infinite-loop-offset', '');
            setTimeout(initProjectTimeline, 100);
        }
    }

    document.getElementById('projectBackBtn')?.addEventListener('click', resetProjectTimeline);
    initProjectTimeline();
})();