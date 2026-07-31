# Atlas Architecture

## High-level architecture

                Documents

                    |
                    v

            Document Pipeline

                    |
                    v

             Knowledge Storage

                    |
                    v

            SearchEngine

                    |
                    v

                LLM Layer

---

# Layers

## modules

Business capabilities.

Examples:

- document
- knowledge
- chat

## engines

Technical capabilities.

Examples:

- embeddings
- retrieval
- llm

## infrastructure

External integrations:

- databases
- APIs
- queues

---

# Current dependency direction

modules
|
v
engines
|
v
infrastructure

Business logic should not depend on implementations.
