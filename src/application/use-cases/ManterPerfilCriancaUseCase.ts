import type { ICriancaRepository } from "../../domain/repositories/ICriancaRepository.js";
import type { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository.js";
import { TipoPerfilEnum } from "../../domain/value-objects/TipoPerfil.js";

export class EditarCriancaUseCase {
  constructor(
    private readonly criancaRepo: ICriancaRepository,
    private readonly usuarioRepo: IUsuarioRepository,
  ) {}

  public async execute(
    usuarioId: string,
    criancaId: string,
    dados: { escolaId?: string, nome?: string, dataNascimento?: Date, _grauTEA?: number, _grauSuporte: number, responsavelIds: string[] },
  ): Promise<void> {
    const usuario = await this.usuarioRepo.buscarPorId(usuarioId);
    if (!usuario) throw new Error("Usuário não encontrado");

    const agregado = await this.criancaRepo.buscarPorId(criancaId);
    if (!agregado) throw new Error("Criança não encontrada");

    const crianca = agregado.crianca;
    const perfil = usuario.tipoPerfil.tipo;
    if (perfil === TipoPerfilEnum.ADMIN) {
    } else if (perfil === TipoPerfilEnum.PROFESSOR) {
      if (!usuario.escolaId || usuario.escolaId !== crianca.escolaId) {
        throw new Error(
          "Permissão negada: professor não pertence à mesma escola",
        );
      }
    } else {
      if (!crianca.responsavelIds.includes(usuario.id)) {
        throw new Error(
          "Permissão negada: usuário não é responsável pela criança",
        );
      }
    }

    if (dados.escolaId) {
      crianca.alterarEscola(dados.escolaId);
    }

    await this.criancaRepo.salvar(agregado);
  }
}
