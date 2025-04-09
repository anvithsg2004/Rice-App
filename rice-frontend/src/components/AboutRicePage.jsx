import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './css/AboutRicePage.css';

const AboutRicePage = () => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [isBenefitsVisible, setIsBenefitsVisible] = useState(false);
    const [isLifeCycleVisible, setIsLifeCycleVisible] = useState(false);
    const [isVarietiesVisible, setIsVarietiesVisible] = useState(false);

    const headerRef = useRef();
    const benefitsRef = useRef();
    const lifeCycleRef = useRef();
    const varietiesRef = useRef();

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const observers = [];

        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.isIntersecting && setIsHeaderVisible(true));
        }, observerOptions);
        if (headerRef.current) {
            headerObserver.observe(headerRef.current);
            observers.push(headerObserver);
        }

        const benefitsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.isIntersecting && setIsBenefitsVisible(true));
        }, observerOptions);
        if (benefitsRef.current) {
            benefitsObserver.observe(benefitsRef.current);
            observers.push(benefitsObserver);
        }

        const lifeCycleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.isIntersecting && setIsLifeCycleVisible(true));
        }, observerOptions);
        if (lifeCycleRef.current) {
            lifeCycleObserver.observe(lifeCycleRef.current);
            observers.push(lifeCycleObserver);
        }

        const varietiesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.isIntersecting && setIsVarietiesVisible(true));
        }, observerOptions);
        if (varietiesRef.current) {
            varietiesObserver.observe(varietiesRef.current);
            observers.push(varietiesObserver);
        }

        return () => observers.forEach(observer => observer.disconnect());
    }, []);

    return (
        <div className="about-rice-container" id="about-rice">
            {/* Animated Header */}
            <motion.div
                ref={headerRef}
                className="header-animation"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isHeaderVisible ? 1 : 0, y: isHeaderVisible ? 0 : 50 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                <h1>The World of Rice</h1>
                <p>Discover the fascinating journey of rice from ancient civilizations to modern tables</p>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
                ref={benefitsRef}
                className="benefits-section"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isBenefitsVisible ? 1 : 0, y: isBenefitsVisible ? 0 : 50 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <h2>Health Benefits of Rice</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon">🌾</div>
                        <h3>Rich in Nutrients</h3>
                        <p>Rice is a great source of complex carbohydrates, providing sustained energy throughout the day.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">💪</div>
                        <h3>Supports Digestion</h3>
                        <p>Contains resistant starch that promotes gut health and supports beneficial gut bacteria.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🛡️</div>
                        <h3>Antioxidant Properties</h3>
                        <p>Especially brown rice, contains antioxidants that help protect cells from damage.</p>
                    </div>
                </div>
            </motion.div>

            {/* Life Cycle Section */}
            <motion.div
                ref={lifeCycleRef}
                className="life-cycle-section"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isLifeCycleVisible ? 1 : 0, y: isLifeCycleVisible ? 0 : 50 }}
                transition={{ duration: 1, delay: 0.6 }}
            >
                <h2>The Life Cycle of Rice</h2>
                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-icon">🌱</div>
                        <div className="timeline-content">
                            <h3>Seeding</h3>
                            <p>The journey begins with tiny seeds planted in carefully prepared fields.</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-icon">🌿</div>
                        <div className="timeline-content">
                            <h3>Growth</h3>
                            <p>Over 3-4 months, the seedlings grow into mature plants under the sun.</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-icon">🌾</div>
                        <div className="timeline-content">
                            <h3>Harvesting</h3>
                            <p>When the grains turn golden, farmers harvest the rice using traditional or modern methods.</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-icon">🍚</div>
                        <div className="timeline-content">
                            <h3>Processing</h3>
                            <p>The harvested rice undergoes processing to remove husks and polish the grains.</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-icon">🍽️</div>
                        <div className="timeline-content">
                            <h3>Consumption</h3>
                            <p>Finally, the rice reaches your table, ready to nourish and delight.</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Premium Rice Varieties */}
            <motion.div
                ref={varietiesRef}
                className="premium-varieties"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isVarietiesVisible ? 1 : 0, y: isVarietiesVisible ? 0 : 50 }}
                transition={{ duration: 1, delay: 0.8 }}
            >
                <h2>Premium Rice Varieties</h2>
                <div className="varieties-grid">
                    <div className="variety-card">
                        <img
                            src="https://images.unsplash.com/photo-1611143669185-af24681a3251?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            alt="Basmati Rice"
                            loading="lazy"
                        />
                        <h3>Basmati Rice</h3>
                        <p>Long-grained aromatic rice from India, known for its delicate flavor and fragrance.</p>
                    </div>
                    <div className="variety-card">
                        <img
                            src="https://images.unsplash.com/photo-1598379007742-315e2c024786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            alt="Jasmine Rice"
                            loading="lazy"
                        />
                        <h3>Jasmine Rice</h3>
                        <p>Aromatic rice from Thailand with a slightly sweet flavor and a distinctive fragrance.</p>
                    </div>
                    <div className="variety-card">
                        <img
                            src="https://images.unsplash.com/photo-1606751029598-4a642f1f9e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            alt="Black Rice"
                            loading="lazy"
                        />
                        <h3>Black Rice</h3>
                        <p>Nutrient-dense heirloom rice with deep purple color and high antioxidant content.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutRicePage;