import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // eslint-disable-next-line no-console
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: '#FAFAF6',
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                }}>
                    <div style={{
                        maxWidth: 480,
                        textAlign: 'center',
                        padding: '2.5rem 2rem',
                        background: '#FFFFFF',
                        borderRadius: 24,
                        border: '1px solid rgba(15, 23, 17, 0.06)',
                        boxShadow: '0 16px 40px rgba(15, 23, 17, 0.08)',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
                        <h1 style={{
                            margin: '0 0 0.75rem',
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            color: '#18221B',
                            fontFamily: "'Fraunces', Georgia, serif",
                            letterSpacing: '-0.02em',
                        }}>
                            Something went sideways
                        </h1>
                        <p style={{
                            margin: '0 0 2rem',
                            color: '#5A615C',
                            lineHeight: 1.6,
                            fontSize: '0.95rem',
                        }}>
                            We hit an unexpected error. Refreshing usually does the trick — or head home and try again.
                        </p>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '0.85rem 1.85rem',
                                background: '#18221B',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 9999,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                            }}
                        >
                            Back to home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
