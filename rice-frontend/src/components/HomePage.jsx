import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/HomePage.css';

const HomePage = () => {
    const newArrivals = [
        {
            id: 1,
            name: 'Traditional Basmati',
            description: 'Aged long-grain rice with a highly aromatic fragrance.',
            price: '₹170',
            image: `/src/components/img/67f08d055cfea66e0ad55048.jpeg`,
        },
        {
            id: 2,
            name: 'Vietnamese Jasmine Rice',
            description: 'Similar to Thai Jasmine rice but slightly softer and less fragrant.',
            price: '₹493',
            image: `/src/components/img/67f08d915cfea66e0ad55052.jpeg`,
        },
        {
            id: 3,
            name: 'Northern Wild Rice',
            description: 'Grown in Canada, this variety has a firm texture and a slightly smoky flavor.',
            price: '₹553',
            image: `/src/components/img/67f08e055cfea66e0ad55062.jpeg`,
        },
        {
            id: 4,
            name: 'Indonesian Black Rice',
            description: 'Naturally sweet black rice variety used in Indonesian desserts.',
            price: '₹475',
            image: `/src/components/img/67f08e3f5cfea66e0ad5506c.jpeg`,
        },
        {
            id: 5,
            name: 'Sugandha Basmati',
            description: 'Long-grain variety with mild fragrance, primarily used in everyday meals.',
            price: '₹132',
            image: `/src/components/img/67f08d375cfea66e0ad5504e.jpeg`,
        },
        {
            id: 6,
            name: 'Long-Grain Brown Rice',
            description: 'Firm, less sticky variety that retains the bran layer, making it more nutritious than white rice.',
            price: '₹468',
            image: `/src/components/img/67f08df25cfea66e0ad5505e.jpeg`,
        },
    ];

    const highestBought = [
        {
            id: 1,
            name: 'Sharbati Basmati',
            description: 'More affordable variety with a mild aroma, often used as a substitute for premium Basmati.',
            price: '₹126',
            image: `/src/components/img/67f08d2f5cfea66e0ad5504d.jpeg`,
        },
        {
            id: 2,
            name: 'Sugandha Basmati',
            description: 'Long-grain variety with mild fragrance, primarily used in everyday meals.',
            price: '₹132',
            image: `/src/components/img/67f08d375cfea66e0ad5504e.jpeg`,
        },
        {
            id: 3,
            name: 'Manoomin (Native American Wild Rice)',
            description: 'Hand-harvested wild rice with a distinct nutty flavor, commonly used in Native American cuisine.',
            price: '₹563',
            image: `/src/components/img/67f08e0c5cfea66e0ad55064.jpeg`,
        },
        {
            id: 4,
            name: 'Indonesian Black Rice',
            description: 'Naturally sweet black rice variety used in Indonesian desserts.',
            price: '₹475',
            image: `/src/components/img/67f08e3f5cfea66e0ad5506c.jpeg`,
        },
        {
            id: 5,
            name: 'Black Glutinous Rice',
            description: 'Dark purple variety of sticky rice with a nutty flavor.',
            price: '₹477',
            image: `/src/components/img/67f08ea15cfea66e0ad55070.jpeg`,
        },
        {
            id: 6,
            name: 'Thai Red Cargo Rice',
            description: 'Dense, chewy rice used in Thai cuisine, known for its reddish-brown color.',
            price: '₹493',
            image: `/src/components/img/67f08e1e5cfea66e0ad55068.jpeg`,
        },
    ];

    const [newArrivalsScroll, setNewArrivalsScroll] = useState(0);
    const [highestBoughtScroll, setHighestBoughtScroll] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Helper function to extract itemId from image path
    const getItemIdFromImage = (imagePath) => {
        const parts = imagePath.split('/');
        const filename = parts[parts.length - 1];
        return filename.split('.')[0];
    };

    useEffect(() => {
        const newArrivalsContainer = document.querySelector('.new-arrivals-container');
        const highestBoughtContainer = document.querySelector('.highest-bought-container');

        let newArrivalsAnimationId;
        let highestBoughtAnimationId;

        const scrollNewArrivals = () => {
            if (newArrivalsContainer && !isHovered) {
                const scrollAmount = newArrivalsScroll + 0.5;
                if (scrollAmount >= newArrivalsContainer.scrollWidth / 2) {
                    setNewArrivalsScroll(0);
                } else {
                    setNewArrivalsScroll(scrollAmount);
                }
                newArrivalsAnimationId = requestAnimationFrame(scrollNewArrivals);
            }
        };

        const scrollHighestBought = () => {
            if (highestBoughtContainer && !isHovered) {
                const scrollAmount = highestBoughtScroll + 0.5;
                if (scrollAmount >= highestBoughtContainer.scrollWidth / 2) {
                    setHighestBoughtScroll(0);
                } else {
                    setHighestBoughtScroll(scrollAmount);
                }
                highestBoughtAnimationId = requestAnimationFrame(scrollHighestBought);
            }
        };

        newArrivalsAnimationId = requestAnimationFrame(scrollNewArrivals);
        highestBoughtAnimationId = requestAnimationFrame(scrollHighestBought);

        return () => {
            cancelAnimationFrame(newArrivalsAnimationId);
            cancelAnimationFrame(highestBoughtAnimationId);
        };
    }, [newArrivalsScroll, highestBoughtScroll, isHovered]);

    return (
        <div className="home-page">
            <h1>Welcome to Rice and Glory</h1>
            <p>Your premier destination for premium rice varieties from around the world</p>

            {/* New "Know About Rice" Section */}
            <div className="know-about-rice">
                <h2 className="section-title">Know About Rice</h2>
                <p style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                    Discover the fascinating world of rice - its history, benefits, and cultivation process
                </p>
                <div className="about-rice-preview">
                    <img
                        src="src\components\Images\HomePage\pexels-photo-2589457.jpeg"
                        alt="Rice Field"
                        loading="lazy"
                    />
                    <div className="preview-content">
                        <h3>The Story of Rice</h3>
                        <p>Rice is the most important staple food for over half of humanity. Discover why it's considered a superfood and its incredible journey from farm to table.</p>
                        <Link to="/about-rice" className="learn-more-button">
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            <div className="new-arrivals">
                <h2 className="section-title">New Arrivals</h2>
                <div
                    className="new-arrivals-container"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        className="new-arrivals-slider"
                        style={{ transform: `translateX(-${newArrivalsScroll}px)` }}
                    >
                        {newArrivals.map(item => {
                            const itemId = getItemIdFromImage(item.image);
                            return (
                                <div key={item.id} className="new-arrivals-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="new-arrivals-item-content">
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <div className="price">{item.price}</div>
                                        <Link to={`/item/${itemId}`}>
                                            <button className="buy-now-button">Buy Now</button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                        {newArrivals.map(item => {
                            const itemId = getItemIdFromImage(item.image);
                            return (
                                <div key={`${item.id}-duplicate`} className="new-arrivals-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="new-arrivals-item-content">
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <div className="price">{item.price}</div>
                                        <Link to={`/item/${itemId}`}>
                                            <button className="buy-now-button">Buy Now</button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="highest-bought">
                <h2 className="section-title">Highest Bought</h2>
                <div
                    className="highest-bought-container"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        className="highest-bought-slider"
                        style={{ transform: `translateX(-${highestBoughtScroll}px)` }}
                    >
                        {highestBought.map(item => {
                            const itemId = getItemIdFromImage(item.image);
                            return (
                                <div key={item.id} className="highest-bought-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="highest-bought-item-content">
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <div className="price">{item.price}</div>
                                        <Link to={`/item/${itemId}`}>
                                            <button className="buy-now-button">Buy Now</button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                        {highestBought.map(item => {
                            const itemId = getItemIdFromImage(item.image);
                            return (
                                <div key={`${item.id}-duplicate`} className="highest-bought-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="highest-bought-item-content">
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <div className="price">{item.price}</div>
                                        <Link to={`/item/${itemId}`}>
                                            <button className="buy-now-button">Buy Now</button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
