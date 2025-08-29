import jwt from "jsonwebtoken";

export function generateToken(payload: object, expiresIn: string = "1h") {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY as string,
    { expiresIn } as jwt.SignOptions
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY as string);
}
