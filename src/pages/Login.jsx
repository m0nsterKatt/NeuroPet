import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signIn,
  signUp,
} from "../services/authService";

import "../assets/styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let result;

      if (isRegister) {
        result = await signUp(email, password, username);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        setError(result.error.message);
        return;
      }

      navigate("/");
    } catch (err) {
      setError("Ha ocurrido un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="login-title">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h1>

        {isRegister && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="login-submit-button"
        >
          {loading ? "Cargando..." : isRegister ? "Crear cuenta" : "Entrar"}
        </button>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="login-toggle-button"
        >
          {isRegister ? "Ya tengo cuenta" : "Crear una cuenta"}
        </button>
      </form>
    </main>
  );
}