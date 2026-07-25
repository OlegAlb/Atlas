import { TextPiece } from "../../document/models/text-piece";

export class MetadataMerger {
  merge(pieces: TextPiece[]) {
    return pieces.reduce(
      (acc, piece) => ({
        ...acc,
        ...piece.metadata,
      }),
      {},
    );
  }
}
