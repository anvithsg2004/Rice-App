import React from 'react';
import './css/AboutRicePage.css';
import { Link } from 'react-router-dom';

const AboutRicePage = () => {
    return (
        <div className="about-rice-container" id="about-rice">
            {/* Header */}
            <div className="header-animation">
                <h1>The World of Rice</h1>
                <p>Discover the fascinating journey of rice from ancient civilizations to modern tables</p>
            </div>

            {/* Benefits Section */}
            <div className="benefits-section">
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
            </div>

            {/* Life Cycle Section */}
            <div className="life-cycle-section">
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
            </div>

            {/* Premium Rice Varieties */}
            <div className="premium-varieties">
                <h2>Premium Rice Varieties</h2>
                <div className="varieties-grid">
                    <div className="variety-card">
                        <Link to="/item/67f08d9b5cfea66e0ad55053">
                            <img
                                src={`/src/components/img/67f08d9b5cfea66e0ad55053.jpeg`}
                                alt="Superfino Arborio Rice"
                                loading="lazy"
                            />
                            <h3>Superfino Arborio Rice</h3>
                            <p>Highest quality Arborio rice, rich in starch, best for creamy risottos.</p>
                        </Link>
                    </div>
                    <div className="variety-card">
                        <Link to="/item/67f08e125cfea66e0ad55065">
                            <img
                                src={`/src/components/img/67f08e125cfea66e0ad55065.jpeg`}
                                alt="Cultivated Wild Rice"
                                loading="lazy"
                            />
                            <h3>Cultivated Wild Rice</h3>
                            <p>Commercially farmed variety of wild rice that has a milder taste and softer texture.</p>
                        </Link>
                    </div>
                    <div className="variety-card">
                        <Link to="/item/67f08e055cfea66e0ad55062">
                            <img
                                src={`/src/components/img/67f08e055cfea66e0ad55062.jpeg`}
                                alt="Northern Wild Rice"
                                loading="lazy"
                            />
                            <h3>Northern Wild Rice</h3>
                            <p>Grown in Canada, this variety has a firm texture and a slightly smoky flavor.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutRicePage;
