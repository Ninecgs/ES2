import { Entity } from "./Entity.js";
import { Email, TipoPerfil } from "../value-objects/index.js";

export class Usuario extends Entity {
  private readonly _nome: string;
  private readonly _email: Email;
  private readonly _tipoPerfil: TipoPerfil;
  private readonly _senhaHash: string;

  private constructor(
    id: string | undefined,
    nome: string,
    email: Email,
    tipoPerfil: TipoPerfil,
    senhaHash: string,
  ) {
    super(id);
    this._nome = nome;
    this._email = email;
    this._tipoPerfil = tipoPerfil;
    this._senhaHash = senhaHash;
  }

  public static create(
    nome: string,
    email: Email,
    tipoPerfil: TipoPerfil,
    senhaHash: string,
  ): Usuario {
    if (!nome || nome.trim().length === 0) {
      throw new Error("Nome é obrigatório");
    }
    return new Usuario(undefined, nome, email, tipoPerfil, senhaHash);
  }

  public isAdmin(): boolean {
    return this._tipoPerfil.isAdmin();
  }

  public get nome(): string {
    return this._nome;
  }

  public get email(): Email {
    return this._email;
  }

  public get tipoPerfil(): TipoPerfil {
    return this._tipoPerfil;
  }

  public get senhaHash(): string {
    return this._senhaHash;
  }
}
