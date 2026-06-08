export function Materia({
  materia,
  onUpdate,
  onDelete,
  disabled,
}) {
  return (
    <>
      <button
        onClick={() => onUpdate(materia)}
        disabled={disabled}
      >
        ✏️
      </button>

      <button
        onClick={() => onDelete(materia)}
        disabled={disabled}
        style={{
          color: "red",
          marginLeft: "10px",
        }}
      >
        🗑️
      </button>
    </>
  );
}