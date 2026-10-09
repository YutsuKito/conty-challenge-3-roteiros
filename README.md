# Desafio 3 — Revisão de roteiro

API Node.js 22, sem dependências externas, com versões preservadas e estados explícitos (`submitted`, `changes_requested`, `approved`). Armazenamento em memória para demonstração.

```bash
npm test
npm start
```

```bash
curl -X POST http://localhost:3003/scripts -H 'Content-Type: application/json' -d '{"brand_id":"brand_1","content":"Roteiro inicial"}'
# response: {"id":"scr_1","brand_id":"brand_1","status":"submitted","versions":[{"number":1,"content":"Roteiro inicial","created_at":"..."}],"change_requests":[],"current_version":1}
curl -X POST http://localhost:3003/scripts/scr_1/changes -H 'Content-Type: application/json' -d '{"reason":"Rever CTA","deadline_date":"2026-12-31"}'
curl -X POST http://localhost:3003/scripts/scr_1/versions -H 'Content-Type: application/json' -d '{"content":"Roteiro revisado"}'
curl -X POST http://localhost:3003/scripts/scr_1/approve
curl http://localhost:3003/scripts/scr_1
```

Prazo é **dia civil em America/Sao_Paulo** (inclusivo até 23:59:59.999, nunca UTC bruto); relógio injetável. Aprovação final é imutável. Uma versão nova exige pedido de alteração válido e não elimina a anterior.

## Com mais tempo

Persistência transacional, autenticação e papéis de marca/criador, auditoria e concorrência otimista. Upload/vídeo/GUI fora do escopo.

## Planejamento, execução e revisão

Planejamento e execução utilizando Codex GPT Sol 6.1. As implementações iniciais tiveram assistência de ChatGPT. O Codex realizou a revisão técnica e a análise dos requisitos, inspecionou o código e executou a validação automatizada registrada nesta entrega.

O autor realizou a revisão pessoal dos nove desafios, conforme declarado nesta execução. Os pontos abaixo documentam os critérios de análise da estrutura, da geração de testes e da qualidade do código.

| Área | Pontos de análise e revisão |
|---|---|
| Geração da estrutura | Separar rotas HTTP da máquina de estados e injetar relógio no serviço. Manter histórico de versões e solicitações de alteração. |
| Geração e revisão dos testes | Cobrir limite civil de São Paulo, prazo inválido, motivo obrigatório, transições indevidas e aprovação final irreversível. |
| Qualidade estrutural | Conferir que novas versões não alteram versões anteriores e que a validação ocorre antes da mutação. |



## Verificação completa em 09/10/2026

Acrescentado teste de envio de versão no primeiro milissegundo após o prazo, com preservação do histórico.

O transporte HTTP rejeita JSON nulo, arrays e valores primitivos com 400 antes de chamar o serviço. Parâmetros de rota são decodificados uma vez; escape inválido retorna 400. Dois testes de transporte verificam esses comportamentos, incluindo códigos com caracteres especiais.

Resultado desta rodada: 6 testes aprovados, zero falhas; checagem sintática aprovada e smoke HTTP com entrada válida 200 e inválida 400. As correções e a nova validação foram realizadas pelo Codex; não são atribuídas como revisão manual do autor.
