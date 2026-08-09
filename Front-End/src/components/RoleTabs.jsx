import "./RoleTabs.css";

const ROLES = [
  { key: "buyer", label: "Buyer" },
  { key: "seller", label: "Seller" },
  { key: "ngo", label: "NGO" },
];

/**
 * Pill-shaped role switcher used on both the Sign Up and Log In screens.
 *
 * @param {"buyer"|"seller"|"ngo"} activeRole
 * @param {(role: string) => void} onChange
 */
export default function RoleTabs({ activeRole, onChange }) {
  return (
    <div className="role-tabs" role="tablist" aria-label="Select account type">
      {ROLES.map((role) => (
        <button
          key={role.key}
          type="button"
          role="tab"
          aria-selected={activeRole === role.key}
          className={`role-tab ${activeRole === role.key ? "role-tab--active" : ""}`}
          onClick={() => onChange(role.key)}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}
