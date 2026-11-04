# Hard retrieval dataset (NFCorpus)

`cases.json` and `corpus.json` are derived from **NFCorpus**, the biomedical IR
collection distributed with [BEIR](https://github.com/beir-cellar/beir).

- Source archive: <https://public.ukp.informatik.tu-darmstadt.de/thakur/BEIR/datasets/nfcorpus.zip>
- Documents: 3,633 medical abstracts (`MED-*` ids)
- Queries: `cases.json` keeps only the **test split** — 323 queries that have
  relevance judgments in `nfcorpus/qrels/test.tsv`
- Relevance: graded 1–2, stored per case in `relevantDocuments`

## What is stored here

`cases.json` is committed: it is small and defines the benchmark.

`corpus.json` is **not** committed — it is 6 MB of third-party data. It is
downloaded into a gitignored file on demand:

```bash
npm run fetch:data
```

The script downloads the archive, converts `corpus.jsonl` into
`{ id, title, content }` records, writes `corpus.json` next to this file, and
verifies that every `relevantDocuments` id of every case exists in the corpus.

If the file is missing, the evaluation runner stops with an explicit message
instead of failing somewhere deep in the pipeline.

## History

The original `cases.json` in this repository contained all 3,237 queries without
any relevance judgments, so no metric could be computed for this dataset — the
evaluator crashed on the first case. It was replaced by the labeled test split
downloaded from the upstream archive.

## License

NFCorpus is distributed for research use. Check the upstream terms before
redistributing the corpus or the queries.
