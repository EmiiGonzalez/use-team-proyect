export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
        {/* Aquí va el formulario de registro */}
        <form>
          <input className="w-full mb-4 p-2 border rounded" placeholder="Email" />
          <input className="w-full mb-4 p-2 border rounded" placeholder="Contraseña" type="password" />
          <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}
