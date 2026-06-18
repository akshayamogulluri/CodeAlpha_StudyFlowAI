const EmptyState = ({ title, message, action }) => {
  return (
    <div className="panel flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 h-2 w-20 rounded-full bg-emerald-500" />
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
