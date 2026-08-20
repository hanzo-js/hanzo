# hanzo

One install. The CLI, and the client.

```sh
npm install -g hanzo     # the CLI
npm install hanzo        # the client
```

```js
import { Configuration, AdminApi } from 'hanzo'      // the Open AI Cloud
import { Agent } from 'hanzo/ai'                     // agents and inference
```

```sh
hanzo --version
```

## What it is

A front door, and nothing else. The code lives where it is generated and
maintained, and this package composes it:

| import | comes from | what it is |
|---|---|---|
| `hanzo` | `hanzoai` | the full Open AI Cloud client, generated from the document `hanzo-inc/cloud` emits |
| `hanzo/ai` | `@hanzo/ai` | the AI and agents library |
| `hanzo` (the command) | `@hanzo/cli` | the Rust CLI, fetched for your platform on install |

Nothing is vendored and nothing is reimplemented here — there is one downloader,
one generated client and one agents library, each in the package that owns it.
Depending on any of them directly still works; this is the name you reach for
when you do not want to choose.

## Why one package

Four names published the same idea and a reader had to know which. The cost was
not tidiness: a wrong guess installs a client that does not carry the surface
you are calling. One name, two imports, one command.
