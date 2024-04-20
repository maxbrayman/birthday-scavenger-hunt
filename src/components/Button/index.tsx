import styles from "./index.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ className, ...otherProps }: ButtonProps) => {
  const finalClassName = `${styles.button}${className ? ` ${className}` : ""}`;
  return <button {...otherProps} className={finalClassName}></button>;
};

export default Button;
