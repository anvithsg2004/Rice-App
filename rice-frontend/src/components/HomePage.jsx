import React from 'react';
import { Link } from 'react-router-dom';
import './css/HomePage.css';

const HomePage = () => {
    const newArrivals = [
        {
            id: 1,
            name: 'Traditional Basmati',
            description: 'Aged long-grain rice with a highly aromatic fragrance.',
            price: '₹170',
            image: `/images/67f08d055cfea66e0ad55048.jpeg`,
        },
        {
            id: 2,
            name: 'Vietnamese Jasmine Rice',
            description: 'Similar to Thai Jasmine rice but slightly softer and less fragrant.',
            price: '₹493',
            image: `/images/67f08d915cfea66e0ad55052.jpeg`,
        },
        {
            id: 3,
            name: 'Northern Wild Rice',
            description: 'Grown in Canada, this variety has a firm texture and a slightly smoky flavor.',
            price: '₹553',
            image: `/images/67f08e055cfea66e0ad55062.jpeg`,
        },
        {
            id: 4,
            name: 'Indonesian Black Rice',
            description: 'Naturally sweet black rice variety used in Indonesian desserts.',
            price: '₹475',
            image: `/images/67f08e3f5cfea66e0ad5506c.jpeg`,
        },
        {
            id: 5,
            name: 'Sugandha Basmati',
            description: 'Long-grain variety with mild fragrance, primarily used in everyday meals.',
            price: '₹132',
            image: `/images/67f08d375cfea66e0ad5504e.jpeg`,
        },
        {
            id: 6,
            name: 'Long-Grain Brown Rice',
            description: 'Firm, less sticky variety that retains the bran layer, making it more nutritious than white rice.',
            price: '₹468',
            image: `/images/67f08df25cfea66e0ad5505e.jpeg`,
        },
    ];

    const highestBought = [
        {
            id: 1,
            name: 'Sharbati Basmati',
            description: 'More affordable variety with a mild aroma, often used as a substitute for premium Basmati.',
            price: '₹126',
            image: `/images/67f08d2f5cfea66e0ad5504d.jpeg`,
        },
        {
            id: 2,
            name: 'Sugandha Basmati',
            description: 'Long-grain variety with mild fragrance, primarily used in everyday meals.',
            price: '₹132',
            image: `/images/67f08d375cfea66e0ad5504e.jpeg`,
        },
        {
            id: 3,
            name: 'Manoomin (Native American Wild Rice)',
            description: 'Hand-harvested wild rice with a distinct nutty flavor, commonly used in Native American cuisine.',
            price: '₹563',
            image: `/images/67f08e0c5cfea66e0ad55064.jpeg`,
        },
        {
            id: 4,
            name: 'Indonesian Black Rice',
            description: 'Naturally sweet black rice variety used in Indonesian desserts.',
            price: '₹475',
            image: `/images/67f08e3f5cfea66e0ad5506c.jpeg`,
        },
        {
            id: 5,
            name: 'Black Glutinous Rice',
            description: 'Dark purple variety of sticky rice with a nutty flavor.',
            price: '₹477',
            image: `/images/67f08ea15cfea66e0ad55070.jpeg`,
        },
        {
            id: 6,
            name: 'Thai Red Cargo Rice',
            description: 'Dense, chewy rice used in Thai cuisine, known for its reddish-brown color.',
            price: '₹493',
            image: `/images/67f08e1e5cfea66e0ad55068.jpeg`,
        },
    ];

    const getItemIdFromImage = (imagePath) => {
        const parts = imagePath.split('/');
        const filename = parts[parts.length - 1];
        return filename.split('.')[0];
    };

    const renderCarouselItem = (item, suffix, baseClass) => {
        const itemId = getItemIdFromImage(item.image);
        return (
            <div key={`${item.id}${suffix}`} className={`${baseClass}-item`}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className={`${baseClass}-item-content`}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="price">{item.price}</div>
                    <Link to={`/item/${itemId}`}>
                        <button className="buy-now-button">Buy Now</button>
                    </Link>
                </div>
            </div>
        );
    };

    const features = [
        {
            icon: '🌾',
            title: 'Premium Selection',
            text: 'Hand-picked rice varieties sourced from the world\'s finest growing regions.',
        },
        {
            icon: '🚚',
            title: 'Free Delivery',
            text: 'Complimentary shipping on every order above ₹1,000 — straight to your door.',
        },
        {
            icon: '🌱',
            title: 'Sustainably Sourced',
            text: 'Partnering with family farms that practice responsible cultivation.',
        },
        {
            icon: '✨',
            title: 'Quality Guaranteed',
            text: 'Every grain tested for purity and freshness before it reaches your kitchen.',
        },
    ];

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-eyebrow">Premium Rice · Sourced Worldwide</span>
                    <h1 className="hero-title">
                        The world's finest rice, <em>delivered</em>.
                    </h1>
                    <p className="hero-subtitle">
                        From aromatic Basmati to heritage Black rice — discover varieties grown
                        with care across continents, curated for kitchens that care about every grain.
                    </p>
                    <div className="hero-actions">
                        <Link to="/categories" className="hero-button primary">
                            Shop the Collection
                        </Link>
                        <Link to="/about-rice" className="hero-button ghost">
                            Our Story
                        </Link>
                    </div>
                </div>
                <div className="hero-decoration" aria-hidden="true" />
            </section>

            <section className="features-grid-section">
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-icon" aria-hidden="true">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="know-about-rice">
                <div className="section-header">
                    <span className="section-eyebrow">Discover</span>
                    <h2 className="section-title">The story of rice</h2>
                    <p className="section-intro">
                        From paddy to plate — discover the heritage, varieties, and cultivation
                        process behind the world's most essential grain.
                    </p>
                </div>
                <div className="about-rice-preview">
                    <img
                        src="/images/pexels-photo-2589457.jpeg"
                        alt="Rice paddy field at golden hour"
                        loading="lazy"
                    />
                    <div className="preview-content">
                        <h3>A grain with a 10,000-year story</h3>
                        <p>
                            Rice has nourished civilizations for millennia. Each variety carries
                            the soul of its land — from the misty terraces of Asia to the sun-soaked
                            deltas of the Americas. We bring you that heritage, intact.
                        </p>
                        <Link to="/about-rice" className="learn-more-button">
                            Read more
                        </Link>
                    </div>
                </div>
            </section>

            <section className="new-arrivals">
                <div className="section-header">
                    <span className="section-eyebrow">Fresh in</span>
                    <h2 className="section-title">New arrivals</h2>
                    <p className="section-intro">
                        The latest additions to our shelves — discovered, vetted, and ready to ship.
                    </p>
                </div>
                <div className="new-arrivals-container">
                    <div className="new-arrivals-slider marquee-track">
                        {newArrivals.map(item => renderCarouselItem(item, '', 'new-arrivals'))}
                        {newArrivals.map(item => renderCarouselItem(item, '-dup', 'new-arrivals'))}
                    </div>
                </div>
            </section>

            <section className="highest-bought">
                <div className="section-header">
                    <span className="section-eyebrow">Bestsellers</span>
                    <h2 className="section-title">Customer favourites</h2>
                    <p className="section-intro">
                        The rice our community returns to, again and again.
                    </p>
                </div>
                <div className="highest-bought-container">
                    <div className="highest-bought-slider marquee-track marquee-track-reverse">
                        {highestBought.map(item => renderCarouselItem(item, '', 'highest-bought'))}
                        {highestBought.map(item => renderCarouselItem(item, '-dup', 'highest-bought'))}
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <div className="section-header">
                    <span className="section-eyebrow">Loved by cooks</span>
                    <h2 className="section-title">Words from our kitchen community</h2>
                </div>
                <div className="testimonials-grid">
                    {[
                        {
                            quote: 'The aged Basmati genuinely transformed my biryani. Long, fluffy grains and that aroma — exactly like my grandmother\'s.',
                            author: 'Priya Menon',
                            role: 'Home cook · Bengaluru',
                            stars: 5,
                        },
                        {
                            quote: 'I run a small Italian restaurant and switched all my risotto rice to their Superfino Arborio. The creaminess is unmatched.',
                            author: 'Marco Rossi',
                            role: 'Chef · Mumbai',
                            stars: 5,
                        },
                        {
                            quote: 'Shipping was fast and the packaging is beautiful. The Black Glutinous rice is now my Sunday dessert staple.',
                            author: 'Aisha Khan',
                            role: 'Food blogger · Delhi',
                            stars: 5,
                        },
                    ].map((t, i) => (
                        <figure key={i} className="testimonial-card">
                            <div className="testimonial-stars" aria-label={`${t.stars} out of 5 stars`}>
                                {Array.from({ length: t.stars }).map((_, j) => (
                                    <span key={j} aria-hidden="true">★</span>
                                ))}
                            </div>
                            <blockquote>
                                <p>"{t.quote}"</p>
                            </blockquote>
                            <figcaption>
                                <span className="testimonial-author">{t.author}</span>
                                <span className="testimonial-role">{t.role}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-card">
                    <span className="section-eyebrow">Get started</span>
                    <h2>Ready to taste the difference?</h2>
                    <p>Browse the full collection and find the rice your kitchen has been waiting for.</p>
                    <Link to="/categories" className="cta-button">Explore the catalogue</Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
