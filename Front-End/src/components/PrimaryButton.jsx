import "./PrimaryButton.css";

export default function PrimaryButton({ children, onClick, type = "button", disabled }) {
  return (
    <button
      type={type}
      className="primary-button"
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? "Please wait..." : children}
    </button>
  );
}
