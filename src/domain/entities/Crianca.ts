import { Entity } from "./Entity.js";
import {
  GrauSuporte,
  GrauTEA,
  DataNascimento,
} from "../value-objects/index.js";

export class Crianca extends Entity {
  private readonly _dataNascimento: DataNascimento;
  private readonly _grauTEA: GrauTEA;
  private readonly _grauSuporte: GrauSuporte;

  private constructor(
    id: string | undefined,
    dataNascimento: DataNascimento,
    grauTEA: GrauTEA,
    grauSuporte: GrauSuporte,
  ) {
    super(id);
    this._dataNascimento = dataNascimento;
    this._grauTEA = grauTEA;
    this._grauSuporte = grauSuporte;
  }
 
  public static create(
    dataNascimento: DataNascimento,
    grauTEA: GrauTEA,
    grauSuporte: GrauSuporte,
  ): Crianca {
    return new Crianca(undefined, dataNascimento, grauTEA, grauSuporte);
  }

  public solicitarSuporte(): boolean {
    // Lógica de negócio: verificar se pode solicitar suporte

    console.log(`Suporte solicitado para criança ${this._id}`);
    return true;
  }


  public visualizarCalendario(): string {
    // Lógica para buscar eventos do calendário
    
    return `Calendário da criança ${this._id}`;
  }

  public get dataNascimento(): DataNascimento {
    return this._dataNascimento;
  }

  public get grauTEA(): GrauTEA {
    return this._grauTEA;
  }

  public get grauSuporte(): GrauSuporte {
    return this._grauSuporte;
  }
}
