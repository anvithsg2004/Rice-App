import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/HomePage.css';

const HomePage = () => {
    const newArrivals = [
        {
            id: 1,
            name: 'Basmati Rice',
            description: 'Premium quality basmati rice from India',
            price: '₹12.99',
            image: 'https://images.unsplash.com/photo-1611143669185-af24681a3251?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 2,
            name: 'Jasmine Rice',
            description: 'Aromatic jasmine rice from Thailand',
            price: '₹10.99',
            image: 'https://images.unsplash.com/photo-1598379007742-315e2c024786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 3,
            name: 'Wild Rice',
            description: 'Nutritious wild rice blend',
            price: '₹14.99',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 4,
            name: 'Black Rice',
            description: 'Organic black rice with antioxidants',
            price: '₹15.99',
            image: 'https://images.unsplash.com/photo-1606751029598-4a642f1f9e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 5,
            name: 'Carolina Gold Rice',
            description: 'Historic and flavorful rice variety',
            price: '₹13.99',
            image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 6,
            name: 'Brown Rice',
            description: 'Whole grain brown rice with fiber',
            price: '₹9.99',
            image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
    ];

    const highestBought = [
        {
            id: 1,
            name: 'Basmati Rice',
            description: 'Premium quality basmati rice from India',
            price: '₹12.99',
            image: 'https://images.unsplash.com/photo-1611143669185-af24681a3251?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 2,
            name: 'Jasmine Rice',
            description: 'Aromatic jasmine rice from Thailand',
            price: '₹10.99',
            image: 'https://images.unsplash.com/photo-1598379007742-315e2c024786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 3,
            name: 'Wild Rice',
            description: 'Nutritious wild rice blend',
            price: '₹14.99',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 4,
            name: 'Black Rice',
            description: 'Organic black rice with antioxidants',
            price: '₹15.99',
            image: 'https://images.unsplash.com/photo-1606751029598-4a642f1f9e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 5,
            name: 'Sushi Rice',
            description: 'Short-grain rice perfect for sushi',
            price: '₹11.99',
            image: 'https://images.unsplash.com/photo-1599599810769-b24aef221a0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 6,
            name: 'Arborio Rice',
            description: 'Ideal for risotto and creamy dishes',
            price: '₹13.49',
            image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
    ];

    const [newArrivalsScroll, setNewArrivalsScroll] = useState(0);
    const [highestBoughtScroll, setHighestBoughtScroll] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const newArrivalsContainer = document.querySelector('.new-arrivals-container');
        const highestBoughtContainer = document.querySelector('.highest-bought-container');

        const scrollNewArrivals = () => {
            if (newArrivalsContainer && !isHovered) {
                const scrollAmount = newArrivalsScroll + 1;
                if (scrollAmount >= newArrivalsContainer.scrollWidth / 2) {
                    setNewArrivalsScroll(0);
                } else {
                    setNewArrivalsScroll(scrollAmount);
                }
            }
        };

        const scrollHighestBought = () => {
            if (highestBoughtContainer && !isHovered) {
                const scrollAmount = highestBoughtScroll + 1;
                if (scrollAmount >= highestBoughtContainer.scrollWidth / 2) {
                    setHighestBoughtScroll(0);
                } else {
                    setHighestBoughtScroll(scrollAmount);
                }
            }
        };

        const newArrivalsInterval = setInterval(scrollNewArrivals, 50);
        const highestBoughtInterval = setInterval(scrollHighestBought, 50);

        return () => {
            clearInterval(newArrivalsInterval);
            clearInterval(highestBoughtInterval);
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
                        {newArrivals.map(item => (
                            <div key={item.id} className="new-arrivals-item">
                                <img src={item.image} alt={item.name} />
                                <div className="new-arrivals-item-content">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <div className="price">{item.price}</div>
                                    <button className="buy-now-button">Buy Now</button>
                                </div>
                            </div>
                        ))}
                        {newArrivals.map(item => (
                            <div key={`${item.id}-duplicate`} className="new-arrivals-item">
                                <img src={item.image} alt={item.name} />
                                <div className="new-arrivals-item-content">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <div className="price">{item.price}</div>
                                    <button className="buy-now-button">Buy Now</button>
                                </div>
                            </div>
                        ))}
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
                        {highestBought.map(item => (
                            <div key={item.id} className="highest-bought-item">
                                <img src={item.image} alt={item.name} />
                                <div className="highest-bought-item-content">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <div className="price">{item.price}</div>
                                    <button className="buy-now-button">Buy Now</button>
                                </div>
                            </div>
                        ))}
                        {highestBought.map(item => (
                            <div key={`${item.id}-duplicate`} className="highest-bought-item">
                                <img src={item.image} alt={item.name} />
                                <div className="highest-bought-item-content">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <div className="price">{item.price}</div>
                                    <button className="buy-now-button">Buy Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;