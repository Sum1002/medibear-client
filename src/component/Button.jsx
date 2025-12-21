function Button({ onClick, buttonText }) {
  return (
    <button
      className={
        "px-4 py-2 rounded-4xl border bg-linear-to-r from-blue-950 to-blue-700 text-sm md:text-base text-white font-medium"
      }
      onClick={onClick}
    >
      {buttonText || "Login"}
    </button>
  );
}

export default Button;
