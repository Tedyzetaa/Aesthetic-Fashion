import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE_NAME } from "./session-cookie";

// Autenticação de administrador único (não é multiusuário — só você
// acessa o painel). Credenciais e segredo vêm de variáveis de ambiente;
// nunca commitar valores reais neste arquivo.

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "troque-este-segredo-em-producao";

export function verifyCredentials(email: string, senha: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!adminEmail || !adminHash) return false;
  if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) return false;
  return bcrypt.compareSync(senha, adminHash);
}

export function createSessionToken(email: string): string {
  return jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// Verificação completa (assinatura + expiração) usada dentro de cada rota
// de API sensível. O middleware.ts só checa a presença do cookie (roda no
// Edge Runtime e cuida do redirecionamento); esta função é a autorização
// de verdade e é quem decide se a operação no banco pode acontecer.
export function isAuthorized(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };
