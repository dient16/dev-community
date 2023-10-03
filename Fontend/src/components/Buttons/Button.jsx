import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import './Button.scss';

function Button({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    rounded = false,
    disabled = false,
    small = false,
    large = false,
    children,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...additionalProps
}) {
    let ButtonType = 'button';
    const props = {
        onClick,
        ...additionalProps,
    };

    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    if (to) {
        props.to = to;
        ButtonType = Link;
    } else if (href) {
        props.href = href;
        ButtonType = 'a';
    }

    const buttonClasses = clsx('button__wrapper', {
        [className]: className,
        'button--primary': primary,
        'button--outline': outline,
        'button--text': text,
        'button--disabled': disabled,
        'button--rounded': rounded,
        'button--small': small,
        'button--large': large,
    });

    return (
        <ButtonType className={buttonClasses} {...props}>
            {leftIcon && <span className="button__icon">{leftIcon}</span>}
            <span className="button__title">{children}</span>
            {rightIcon && <span className="button__icon">{rightIcon}</span>}
        </ButtonType>
    );
}

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onClick: PropTypes.func,
};

export default Button;
