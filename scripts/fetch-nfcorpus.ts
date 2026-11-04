import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { unzipSync } from "fflate";

const ARCHIVE_URL =
  "https://public.ukp.informatik.tu-darmstadt.de/thakur/BEIR/datasets/nfcorpus.zip";

const DATA_DIR = join(__dirname, "..", "apps", "core", "eval", "datasets", "retrieval", "hard");

interface CorpusDocument {
  id: string;
  title: string;
  content: string;
}

interface UpstreamDocument {
  _id: string;
  title: string;
  text: string;
}

interface SearchCase {
  id: string;
  query: string;
  relevantDocuments: string[];
}

function parseJsonLines<T>(content: string): T[] {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as T);
}

function parseQrels(content: string): Map<string, string[]> {
  const qrels = new Map<string, string[]>();

  for (const line of content.split(/\r?\n/).slice(1)) {
    const [queryId, corpusId] = line.split("\t");

    if (!queryId || !corpusId) continue;

    const current = qrels.get(queryId) ?? [];

    current.push(corpusId);

    qrels.set(queryId, current);
  }

  return qrels;
}

async function downloadArchive(attempts = 3): Promise<Uint8Array> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      console.log(`downloading ${ARCHIVE_URL} (attempt ${attempt}/${attempts})`);

      const response = await fetch(ARCHIVE_URL);

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`,
        );
      }

      return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
      lastError = error;

      console.error(error instanceof Error ? error.message : error);

      if (attempt < attempts) {
        const delay = attempt * 2_000;

        console.log(`retrying in ${delay / 1000}s`);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Download failed");
}

async function download(): Promise<Record<string, Uint8Array>> {
  const archive = await downloadArchive();

  console.log(`downloaded ${Math.round(archive.byteLength / 1024 / 1024)} MB`);

  const wanted = ["corpus.jsonl", "queries.jsonl", "qrels/test.tsv"];

  const files = unzipSync(archive, {
    filter: (file) => wanted.some((name) => file.name.endsWith(name)),
  });

  const result: Record<string, Uint8Array> = {};

  for (const [path, content] of Object.entries(files)) {
    for (const name of wanted) {
      if (path.endsWith(name)) result[name] = content;
    }
  }

  for (const name of wanted) {
    if (!result[name]) throw new Error(`Archive is missing ${name}`);
  }

  return result;
}

function verify(corpus: CorpusDocument[], qrels: Map<string, string[]>) {
  const casesPath = join(DATA_DIR, "cases.json");

  let cases: SearchCase[];

  try {
    cases = JSON.parse(readFileSync(casesPath, "utf8")) as SearchCase[];
  } catch {
    console.log("cases.json not found, skipping label check");

    return;
  }

  const ids = new Set(corpus.map((document) => document.id));

  let missingRelevant = 0;
  let unlabeled = 0;

  for (const testCase of cases) {
    if ((qrels.get(testCase.id) ?? []).length === 0) unlabeled += 1;

    for (const relevant of testCase.relevantDocuments) {
      if (!ids.has(relevant)) missingRelevant += 1;
    }
  }

  console.log(`cases:                 ${cases.length}`);
  console.log(`cases without qrels:   ${unlabeled}`);
  console.log(`relevant docs missing: ${missingRelevant}`);
}

async function main() {
  const files = await download();

  const documents = parseJsonLines<UpstreamDocument>(
    new TextDecoder().decode(files["corpus.jsonl"]),
  );

  const qrels = parseQrels(new TextDecoder().decode(files["qrels/test.tsv"]));

  const corpus: CorpusDocument[] = documents.map((document) => ({
    id: document._id,
    title: document.title,
    content: document.text,
  }));

  await mkdir(DATA_DIR, { recursive: true });

  const target = join(DATA_DIR, "corpus.json");

  await writeFile(target, `${JSON.stringify(corpus, null, 2)}\n`, "utf8");

  console.log(`documents:             ${corpus.length}`);
  console.log(`labeled queries:       ${qrels.size}`);
  console.log(`written to:            ${target}`);

  verify(corpus, qrels);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);

  process.exit(1);
});
