import './Spinner.css';

interface SpinnerProps {
  label?: string;
}

const Spinner = ({ label }: SpinnerProps) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );
};

export default Spinner;
