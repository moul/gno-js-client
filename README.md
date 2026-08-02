> ### ⚠ This is a fork, and it is ahead of upstream
>
> **`moul/gno-js-client`, branch `gnomputer`.** It exists so
> [gnomputer](https://github.com/moul/gnomputer) can use fixes that are
> submitted upstream but not yet merged. It is not a maintained alternative
> to [`gnolang/gno-js-client`](https://github.com/gnolang/gno-js-client) —
> if you are not gnomputer, use that one.
>
> This branch is `gnolang/gno-js-client@main` plus exactly two open PRs:
>
> | upstream PR | what it does | why gnomputer needs it |
> |---|---|---|
> | [#251](https://github.com/gnolang/gno-js-client/pull/251) | Surfaces the node's real ABCI error (typed `NoRenderDeclError`, `InvalidPkgPathError`, …) instead of `"ABCI response is not initialized"` for every VM failure | Its realm browser greys out the Render tab for packages that declare no `Render()`. Without typed errors that has to be a substring match on a message — and a reworded message would silently disable the feature |
> | [#253](https://github.com/gnolang/gno-js-client/pull/253) | Adds `packages: []` to `pnpm-workspace.yaml` | Without it pnpm 9 cannot install this repo as a git dependency at all — `ERROR packages field missing or empty` — so this fork could not be consumed the way it is being consumed |
>
> **No changes of our own.** Every commit here is an upstream PR, unmodified.
> The moment both merge and a release ships, this branch is deleted and
> gnomputer goes back to the published package.
>
> Companion fork: [`moul/tm2-js-client`](https://github.com/moul/tm2-js-client),
> for the same reason.

<h2 align="center">⚛️ GNO JS/TS Client ⚛️</h2>

## Overview

`@gnolang/gno-js-client` is a JavaScript/TypeScript client implementation for Gno chains. It is an extension of the
[tm2-js-client](https://github.com/gnolang/tm2-js-client), but with Gno-specific functionality.

## Key Features

- Provides the ability to interact with Gno Realms / Packages
- Easy interaction with VM-specific ABCI queries

## Installation

To install `@gnolang/gno-js-client`, use your preferred package manager:

```bash
yarn add @gnolang/gno-js-client
```

```bash
npm install @gnolang/gno-js-client
```

## Error handling

VM queries that the node refuses come back as a successful HTTP response with an error
inside it, so the provider raises them as typed errors. Branch on the class — or on
`type`, which holds the amino type URL — instead of matching on messages:

```ts
import { GnoJSONRPCProvider, NoRenderDeclError } from "@gnolang/gno-js-client";

const provider = await GnoJSONRPCProvider.create("https://rpc.gno.land");

try {
  await provider.getRenderOutput("gno.land/p/demo/ufmt", "");
}
catch (err) {
  if (err instanceof NoRenderDeclError) {
    // the package is there, it just declares no Render function
  }
}
```

Every error extends `GnoABCIError` (itself a `TM2Error`) and keeps the node's raw log
under `log`.

## Documentation

For the sake of keeping the README short and sweet, you can find the documentation and usage examples
for the package [here](https://docs.gno.land/reference/gno-js-client/).
