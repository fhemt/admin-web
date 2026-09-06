import type { Metadata } from "next";
import { LoginForm } from "../LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { activated } = await searchParams;

  return (
    <>
      <h1 className="mb-1 font-display text-xl font-bold text-foreground">Se connecter</h1>
      <p className="mb-4 text-sm text-foreground-secondary">
        Un code de vérification te sera envoyé par email après ton mot de passe.
      </p>
      {activated && (
        <p className="mb-4 rounded-xl bg-success-light px-3.5 py-2.5 text-sm font-medium text-success">
          Compte activé — connecte-toi pour continuer.
        </p>
      )}
      <LoginForm />
    </>
  );
}
