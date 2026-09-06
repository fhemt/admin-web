import type { Metadata } from "next";
import { LoginForm } from "../LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 font-display text-xl font-bold text-foreground">Se connecter</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Un code de vérification te sera envoyé par email après ton mot de passe.
      </p>
      <LoginForm />
    </>
  );
}
