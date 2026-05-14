import React from 'react';
import './css/Loading.css';

/**
 * Loading
 *
 * Props:
 *   variant   'spinner' (default) | 'dots' | 'pulse' | 'skeleton' | 'branded'
 *   size      'sm' | 'md' (default) | 'lg' | 'xl'
 *   label     Optional text shown beneath the indicator
 *   fullPage  If true, renders centered in a full-page overlay
 *   inline    If true, renders inline (no flex centering)
 *   className Extra class for the wrapper
 */
const Loading = ({
    variant = 'spinner',
    size = 'md',
    label,
    fullPage = false,
    inline = false,
    className = '',
}) => {
    const wrapperClasses = [
        'loading',
        `loading--${size}`,
        fullPage && 'loading--full-page',
        inline && 'loading--inline',
        className,
    ].filter(Boolean).join(' ');

    const renderIndicator = () => {
        switch (variant) {
            case 'dots':
                return (
                    <div className="loading-dots" aria-hidden="true">
                        <span /><span /><span />
                    </div>
                );
            case 'pulse':
                return (
                    <div className="loading-pulse" aria-hidden="true">
                        <span /><span /><span />
                    </div>
                );
            case 'branded':
                return (
                    <div className="loading-branded" aria-hidden="true">
                        <div className="loading-branded-grain" />
                        <div className="loading-branded-ring" />
                    </div>
                );
            case 'spinner':
            default:
                return (
                    <div className="loading-spinner" aria-hidden="true">
                        <svg viewBox="25 25 50 50">
                            <circle cx="50" cy="50" r="20" fill="none" />
                        </svg>
                    </div>
                );
        }
    };

    if (variant === 'skeleton') {
        return (
            <div className={`${wrapperClasses} loading--skeleton`} role="status" aria-label={label || 'Loading'}>
                <div className="loading-skeleton-card">
                    <div className="skeleton loading-skeleton-image" />
                    <div className="loading-skeleton-body">
                        <div className="skeleton loading-skeleton-line" style={{ width: '85%' }} />
                        <div className="skeleton loading-skeleton-line" style={{ width: '60%' }} />
                        <div className="skeleton loading-skeleton-line loading-skeleton-line--short" style={{ width: '35%' }} />
                    </div>
                </div>
                <span className="visually-hidden">{label || 'Loading'}</span>
            </div>
        );
    }

    return (
        <div className={wrapperClasses} role="status" aria-live="polite">
            {renderIndicator()}
            {label && <p className="loading-label">{label}</p>}
            {!label && <span className="visually-hidden">Loading</span>}
        </div>
    );
};

export default Loading;
