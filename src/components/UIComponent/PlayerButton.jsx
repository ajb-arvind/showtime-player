const PlayerButton = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-none  border-none outline-none h-8 w-8 p-0 text-lg cursor-pointer opacity-85 hover:opacity-100 ease-in-out duration-150 flex justify-center items-center ${className}`}
    >
      {children}
    </button>
  );
};
export default PlayerButton;
