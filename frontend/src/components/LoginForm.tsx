import { useState } from "preact/hooks";

import { useAuth } from "../service/auth/useAuth";

export function LoginForm() {
  const {
    login,
    loginIsLoading,
    loginError,
    isAuthenticated,
    logout,
    logoutIsLoading,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    await login({ email, password });
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>¡Ya estás autenticado!</p>
        <button onClick={() => logout()} disabled={logoutIsLoading}>
          {logoutIsLoading ? "Cerrando sesión..." : "Cerrar sesión"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onInput={e => setEmail((e.target as HTMLInputElement).value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onInput={e => setPassword((e.target as HTMLInputElement).value)}
        required
      />
      <button type="submit" >
        {loginIsLoading ? "Ingresando..." : "Ingresar"}
      </button>
      {loginError && <p style={{ color: "red" }}>{loginError.message}</p>}
    </form>
  );
}
