import './Badge.css';

interface BadgeProps {
  label: string;
  color: 'green' | 'yellow' | 'blue' | 'red' | 'grey' | 'orange';
}

const Badge = ({ label, color }: BadgeProps) => {
  return (
    <span className={`badge badge-${color}`}>
      {label}
    </span>
  );
};

export default Badge;
