import { TOKEN_NAME } from "@api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@api";

export const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await login(password);
      localStorage.setItem(TOKEN_NAME, response.data.token);
      navigate("/admin");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "login ..." : "enter"}
        </button>
      </form>
    </div>
  );
};
