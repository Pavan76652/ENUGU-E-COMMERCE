const StatCard = ({ label, value, subtext, accent = 'gold' }) => {
  const accentClasses = {
    gold: 'border-enugu-gold/30 bg-enugu-gold/5',
    black: 'border-enugu-black/10 bg-white',
    green: 'border-emerald-200 bg-emerald-50',
    blue: 'border-sky-200 bg-sky-50',
  };

  return (
    <div className={`rounded-lg border p-5 ${accentClasses[accent] ?? accentClasses.black}`}>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-enugu-black sm:text-3xl">{value}</p>
      {subtext && <p className="mt-2 text-xs text-gray-500">{subtext}</p>}
    </div>
  );
};

export default StatCard;
