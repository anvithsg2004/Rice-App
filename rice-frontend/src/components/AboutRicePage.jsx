import React, { useEffect, useRef, useState } from 'react';
import './css/AboutRicePage.css';

const LIFE_CYCLE_STAGES = [
    {
        emoji: '🌰',
        title: 'Seeding',
        duration: 'Day 1 – 7',
        description: 'Tiny rice seeds, soaked overnight, are sown into nutrient-rich nursery beds where the first roots take hold.',
        accent: 'seeding',
        details: ['Soaked & sown', 'Nursery beds', 'First germination'],
    },
    {
        emoji: '🌱',
        title: 'Growth',
        duration: 'Week 2 – 12',
        description: 'Seedlings are transplanted to flooded paddies. They drink the sun and rain, growing tall and green over three months.',
        accent: 'growth',
        details: ['Transplanted', '3–4 months in paddies', 'Tillering & flowering'],
    },
    {
        emoji: '🌿',
        title: 'Maturity',
        duration: 'Month 3',
        description: 'The plants mature, tillering into bushy clumps. Tiny flowers bloom and then form the first grains.',
        accent: 'plant',
        details: ['Bushy clumps', 'Flowering panicles', 'Grain formation'],
    },
    {
        emoji: '🌾',
        title: 'Harvest',
        duration: 'Month 4',
        description: 'When grains turn a rich golden colour, the paddy is ready. Farmers harvest each panicle — by hand or machine.',
        accent: 'harvest',
        details: ['Grains turn golden', 'Hand or machine', 'Threshed & winnowed'],
    },
    {
        emoji: '🍚',
        title: 'Your Table',
        duration: 'A meal away',
        description: 'Husks removed, grains polished, packaged with care, and shipped to your kitchen — every grain a finished story.',
        accent: 'table',
        details: ['Husked & sorted', 'Polished or bran-on', 'Ready to cook'],
    },
];

// The journey path — same `d` is used by the SVG and by the traveler's offset calculation
const JOURNEY_PATH = 'M 80,80 C 700,140 100,420 600,560 S 1120,840 380,1060 S 80,1480 720,1700 S 980,1980 600,2280';

const FORM_PEAKS = [0.05, 0.28, 0.50, 0.75, 0.98]; // where each form is at maximum

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const computeFormOpacity = (progress, peak, halfWidth = 0.18) => {
    const dist = Math.abs(progress - peak);
    if (dist > halfWidth) return 0;
    // ease-in-out curve for nicer fade
    const t = 1 - dist / halfWidth;
    return t * t * (3 - 2 * t);
};

const AboutRicePage = () => {
    const stagesRef = useRef([]);
    const sceneRef = useRef(null);
    const pathRef = useRef(null);
    const pathTraceRef = useRef(null);
    const travelerRef = useRef(null);
    const [activeStage, setActiveStage] = useState(0);
    const [visibleStages, setVisibleStages] = useState(() => new Set());

    /* === Scroll-driven journey: position traveler + draw path === */
    useEffect(() => {
        const scene = sceneRef.current;
        const path = pathRef.current;
        const pathTrace = pathTraceRef.current;
        const traveler = travelerRef.current;
        if (!scene || !path || !pathTrace || !traveler) return;

        const pathLength = path.getTotalLength();
        pathTrace.style.strokeDasharray = `${pathLength}`;
        pathTrace.style.strokeDashoffset = `${pathLength}`;

        let rafId = 0;

        const update = () => {
            rafId = 0;
            const rect = scene.getBoundingClientRect();
            const wh = window.innerHeight;

            // Progress driven by how far the section has scrolled through the viewport.
            // 0 when scene top reaches ~70% down the viewport,
            // 1 when scene bottom reaches ~30% up the viewport.
            const startAt = wh * 0.7;
            const endAt = -rect.height + wh * 0.3;
            const range = startAt - endAt;
            const raw = (startAt - rect.top) / range;
            const progress = clamp(raw, 0, 1);

            // Path drawing
            pathTrace.style.strokeDashoffset = `${pathLength * (1 - progress)}`;

            // Traveler position along path (viewBox coords)
            const len = progress * pathLength;
            const point = path.getPointAtLength(len);
            const nextPoint = path.getPointAtLength(Math.min(len + 1.5, pathLength));
            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;

            // Convert viewBox coords → scene pixel coords
            const svg = path.ownerSVGElement;
            const svgRect = svg.getBoundingClientRect();
            const sceneRect = scene.getBoundingClientRect();
            const viewBox = svg.viewBox.baseVal;
            const scaleX = svgRect.width / viewBox.width;
            const scaleY = svgRect.height / viewBox.height;
            const x = (svgRect.left - sceneRect.left) + point.x * scaleX;
            const y = (svgRect.top - sceneRect.top) + point.y * scaleY;

            // Subtle depth modulation — push the traveler forward/back as it travels
            const zWave = Math.sin(progress * Math.PI * 4) * 24;

            traveler.style.transform =
                `translate(${x}px, ${y}px) translate(-50%, -50%) translateZ(${zWave}px) rotate(${angle * 0.15}deg)`;

            // Compute form opacities and apply
            FORM_PEAKS.forEach((peak, i) => {
                const op = computeFormOpacity(progress, peak);
                const form = traveler.querySelector(`[data-form="${i}"]`);
                if (form) {
                    form.style.opacity = op.toFixed(2);
                    form.style.transform = `scale(${(0.65 + op * 0.35).toFixed(3)}) rotate(${((1 - op) * -20).toFixed(1)}deg)`;
                }
            });

            // Set active stage on the traveler for accent colors
            let stage = 0;
            FORM_PEAKS.forEach((peak, i) => {
                if (progress >= peak - 0.1) stage = i;
            });
            if (traveler.dataset.stage !== String(stage)) {
                traveler.dataset.stage = String(stage);
                setActiveStage(stage);
            }
        };

        const onScroll = () => { if (!rafId) rafId = requestAnimationFrame(update); };
        const onResize = () => { if (!rafId) rafId = requestAnimationFrame(update); };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        update();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    /* === Scroll-triggered card reveals (state-based so re-renders preserve visibility) === */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = Number(entry.target.dataset.stage);
                        if (!Number.isNaN(idx)) {
                            setVisibleStages((prev) => {
                                if (prev.has(idx)) return prev;
                                const next = new Set(prev);
                                next.add(idx);
                                return next;
                            });
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        stagesRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    /* === Mouse parallax === */
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        let rafId = 0;
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        const handleMove = (e) => {
            const rect = scene.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            targetX = x * 6;
            targetY = -y * 4;
            if (!rafId) rafId = requestAnimationFrame(tick);
        };

        const handleLeave = () => { targetX = 0; targetY = 0; if (!rafId) rafId = requestAnimationFrame(tick); };

        const tick = () => {
            currentX += (targetX - currentX) * 0.06;
            currentY += (targetY - currentY) * 0.06;
            scene.style.setProperty('--tilt-x', `${currentY.toFixed(2)}deg`);
            scene.style.setProperty('--tilt-y', `${currentX.toFixed(2)}deg`);

            if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
                rafId = requestAnimationFrame(tick);
            } else {
                rafId = 0;
            }
        };

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion) {
            scene.addEventListener('mousemove', handleMove);
            scene.addEventListener('mouseleave', handleLeave);
        }
        return () => {
            scene.removeEventListener('mousemove', handleMove);
            scene.removeEventListener('mouseleave', handleLeave);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className="about-rice-container" id="about-rice">
            <div className="header-animation">
                <h1>The World of Rice</h1>
                <p>Discover the fascinating journey of rice from ancient civilizations to modern tables</p>
            </div>

            <section className="life-cycle-section">
                <div className="lc-header">
                    <span className="lc-eyebrow">An ancient journey</span>
                    <h2>From seed to rice</h2>
                    <p className="lc-intro">
                        Follow a single grain as it travels through five months of growth.
                        Scroll down to watch the seed sprout, mature, ripen, and reach your kitchen.
                    </p>
                    <div
                        className={`lc-scroll-hint ${visibleStages.size > 0 ? 'is-hidden' : ''}`}
                        aria-hidden={visibleStages.size > 0}
                    >
                        <span className="lc-scroll-hint-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <polyline points="19 12 12 19 5 12" />
                            </svg>
                        </span>
                        <span>Scroll to begin the journey</span>
                    </div>
                </div>

                {/* === Sticky progress meter === */}
                <div className="lc-progress-meter-wrap">
                    <div className="lc-progress-meter">
                        {/* Progress fill line behind the dots */}
                        <div
                            className="lc-pm-fill"
                            aria-hidden="true"
                            style={{ '--progress': activeStage / (LIFE_CYCLE_STAGES.length - 1) }}
                        />
                        {LIFE_CYCLE_STAGES.map((s, i) => (
                            <div
                                key={s.title}
                                className={`lc-pm-step ${activeStage >= i ? 'is-active' : ''} ${activeStage === i ? 'is-current' : ''}`}
                            >
                                <span className="lc-pm-dot" aria-hidden="true">
                                    <span className="lc-pm-emoji">{s.emoji}</span>
                                </span>
                                <span className="lc-pm-label">{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lc-3d-context life-cycle-3d">
                <div className="lc-scene" ref={sceneRef}>
                    {/* === SVG journey path === */}
                    <svg
                        className="lc-path"
                        viewBox="0 0 1200 2400"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#8B6F3E" />
                                <stop offset="22%"  stopColor="#79C28A" />
                                <stop offset="45%"  stopColor="#2E7D32" />
                                <stop offset="68%"  stopColor="#D4AF37" />
                                <stop offset="100%" stopColor="#1B5E20" />
                            </linearGradient>
                            <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="5" result="blur"/>
                                <feMerge>
                                    <feMergeNode in="blur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background path — faint, shows the full route */}
                        <path
                            d={JOURNEY_PATH}
                            fill="none"
                            stroke="rgba(15, 23, 17, 0.10)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="2 14"
                        />

                        {/* Foreground path — draws as you scroll */}
                        <path
                            ref={pathRef}
                            d={JOURNEY_PATH}
                            fill="none"
                            stroke="url(#pathGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            filter="url(#pathGlow)"
                            opacity="0"
                            style={{ visibility: 'hidden' }}
                        />
                        <path
                            ref={pathTraceRef}
                            d={JOURNEY_PATH}
                            fill="none"
                            stroke="url(#pathGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            filter="url(#pathGlow)"
                            className="lc-path-trace"
                        />
                    </svg>

                    {/* === The traveler: a seed that becomes rice === */}
                    <div className="lc-traveler" ref={travelerRef} data-stage="0">
                        {/* Soft halo */}
                        <span className="lc-traveler-halo" aria-hidden="true" />

                        {/* Orbit rings for 3D feel */}
                        <span className="lc-traveler-orbit lc-traveler-orbit-1" aria-hidden="true" />
                        <span className="lc-traveler-orbit lc-traveler-orbit-2" aria-hidden="true" />

                        {/* Five morphing forms — opacity controlled by scroll */}
                        <span className="lc-form" data-form="0" aria-hidden="true">
                            <span className="lc-form-emoji lc-form-emoji--seed">🌰</span>
                        </span>
                        <span className="lc-form" data-form="1" aria-hidden="true">
                            <span className="lc-form-emoji">🌱</span>
                        </span>
                        <span className="lc-form" data-form="2" aria-hidden="true">
                            <span className="lc-form-emoji">🌿</span>
                        </span>
                        <span className="lc-form" data-form="3" aria-hidden="true">
                            <span className="lc-form-emoji">🌾</span>
                        </span>
                        <span className="lc-form" data-form="4" aria-hidden="true">
                            <span className="lc-form-emoji">🍚</span>
                        </span>

                        {/* Sparkle particles emit from the traveler */}
                        <span className="lc-traveler-sparkle lc-traveler-sparkle-1" />
                        <span className="lc-traveler-sparkle lc-traveler-sparkle-2" />
                        <span className="lc-traveler-sparkle lc-traveler-sparkle-3" />
                    </div>

                    {/* === Stage cards === */}
                    <div className="lc-stages">
                        {LIFE_CYCLE_STAGES.map((stage, i) => (
                            <article
                                key={stage.title}
                                ref={(el) => (stagesRef.current[i] = el)}
                                data-stage={i}
                                className={`lc-stage lc-stage--${stage.accent} lc-stage--${i % 2 === 0 ? 'left' : 'right'} ${activeStage === i ? 'lc-stage--active' : ''} ${visibleStages.has(i) ? 'is-visible' : ''}`}
                                style={{ '--stage-index': i, '--stage-z': i % 2 === 0 ? '40px' : '-30px' }}
                            >
                                <div className="lc-stage-card">
                                    <div className="lc-card-backplate lc-card-backplate-1" aria-hidden="true" />
                                    <div className="lc-card-backplate lc-card-backplate-2" aria-hidden="true" />
                                    <div className="lc-card-aurora" aria-hidden="true" />
                                    <div className="lc-card-floor-shadow" aria-hidden="true" />

                                    <div className="lc-card-header">
                                        <span className="lc-card-number">
                                            <span className="lc-card-number-prefix">Stage</span>
                                            <strong>{String(i + 1).padStart(2, '0')}</strong>
                                        </span>
                                        <span className="lc-card-duration">{stage.duration}</span>
                                    </div>

                                    <div className="lc-card-body">
                                        <h3>{stage.title}</h3>
                                        <p>{stage.description}</p>
                                        <ul className="lc-card-details">
                                            {stage.details.map((d) => (
                                                <li key={d}>
                                                    <span className="lc-detail-dot" aria-hidden="true" />
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
                </div>
            </section>
        </div>
    );
};

export default AboutRicePage;
