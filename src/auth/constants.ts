export const jwtConstants = {
  secret: process.env.SECRET_KEY_JWT || 'SECRET_KEY_JWT', // Garanta que você tem uma chave secreta definida no .env
};
