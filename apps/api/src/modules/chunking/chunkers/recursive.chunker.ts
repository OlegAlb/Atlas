import { KnowledgeDocument } from "../../document/models/document";
import { TextPiece } from "../../document/models/text-piece";
import { KnowledgeChunk } from "../../knowledge/models/knowledge-chunk";
import { MetadataMerger } from "../metadata/metadata-merger";
import { Separator } from "../models/separator";
import { Tokenizer } from "../tokenizer/tokenizer.interface";
import { Chunker } from "./chunker.interface";

export class RecursiveChunker implements Chunker {
  constructor(
    private readonly tokenizer: Tokenizer,
    private readonly metadataMerger: MetadataMerger,
    private readonly maxSize = 1000,
    private readonly overlap = 200,
    private readonly separators: Separator[] = [
      { value: "\n# ", keepSeparator: true },
      { value: "\n## ", keepSeparator: true },
      { value: "\n\n" },
      { value: "\n" },
      { value: ". " },
      { value: " " },
      { value: "" },
    ],
  ) {}

  chunk(document: KnowledgeDocument) {
    const pieces = document.pieces.flatMap((piece) =>
      this.splitRecursive(piece, this.separators),
    );

    const groups = this.merge(pieces);

    const overlapped = this.applyOverlap(groups);

    return this.join(overlapped);
  }

  private splitRecursive(
    piece: TextPiece,
    separators: Separator[],
  ): TextPiece[] {
    if (this.tokenizer.count(piece.text) <= this.maxSize) {
      return [{ text: piece.text, metadata: piece.metadata }];
    }

    if (separators.length === 0) {
      return this.splitByLength(piece);
    }

    const [separator, ...rest] = separators;

    const pieces = this.splitBySeparator(piece, separator);

    return pieces.flatMap((piece) => this.splitRecursive(piece, rest));
  }

  private splitByLength(piece: TextPiece): TextPiece[] {
    const pieces: TextPiece[] = [];

    for (let i = 0; i < this.tokenizer.count(piece.text); i += this.maxSize) {
      pieces.push({
        text: piece.text.slice(i, i + this.maxSize),
        metadata: piece.metadata,
      });
    }

    return pieces;
  }

  private splitBySeparator(
    piece: TextPiece,
    separator: Separator,
  ): TextPiece[] {
    if (!separator.value) {
      return this.splitByLength(piece);
    }

    const parts: TextPiece[] = [];

    let start = 0;

    while (true) {
      const index = piece.text.indexOf(separator.value, start);

      if (index === -1) {
        parts.push({ text: piece.text.slice(start), metadata: piece.metadata });

        break;
      }

      const end = separator.keepSeparator
        ? index + separator.value.length
        : index;

      parts.push({
        text: piece.text.slice(start, end),
        metadata: piece.metadata,
      });

      start = index + separator.value.length;
    }

    return parts.filter((piece) => this.tokenizer.count(piece.text) > 0);
  }

  private merge(pieces: TextPiece[]): TextPiece[][] {
    const groups: TextPiece[][] = [];

    let current: TextPiece[] = [];

    let size = 0;

    for (const piece of pieces) {
      const pieceSize = this.tokenizer.count(piece.text);

      if (size + pieceSize <= this.maxSize) {
        current.push(piece);

        size += pieceSize;

        continue;
      }

      if (current.length) {
        groups.push(current);
      }

      current = [piece];

      size = pieceSize;
    }

    if (current.length) {
      groups.push(current);
    }

    return groups;
  }

  private applyOverlap(groups: TextPiece[][]): TextPiece[][] {
    if (this.overlap <= 0) {
      return groups;
    }

    const result: TextPiece[][] = [];

    for (let i = 0; i < groups.length; i++) {
      if (i === 0) {
        result.push(groups[i]);

        continue;
      }

      const previous = groups[i - 1];

      const overlap = this.takeOverlap(previous);

      result.push([...overlap, ...groups[i]]);
    }

    return result;
  }

  private takeOverlap(pieces: TextPiece[]): TextPiece[] {
    const overlap: TextPiece[] = [];

    let length = 0;

    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];

      overlap.unshift(piece);

      length += this.tokenizer.count(piece.text);

      if (length >= this.overlap) {
        break;
      }
    }

    return overlap;
  }

  private join(groups: TextPiece[][]): KnowledgeChunk[] {
    return groups.map((group, index) => ({
      order: index,

      text: group.map((piece) => piece.text).join("\n"),

      metadata: this.metadataMerger.merge(group),
    }));
  }
}
