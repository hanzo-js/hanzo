#!/usr/bin/env node
// Hand the real binary the argv it was given and get out of the way.
//
// ONE HOP, NOT TWO. @hanzo/cli ships its own launcher that finds the binary and
// execs it, and calling THAT would put a second Node process between the
// terminal and an interactive program. So this resolves the same binary and
// execs it directly: `hanzo` is interactive, and every process in front of the
// real one is a process that owns its signals instead of forwarding them.
//
// The binary itself arrives with @hanzo/cli, whose install script fetches the
// build for this platform. Nothing is vendored here — one downloader, one
// naming rule, in the package that owns it.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

let cliDir;
try {
  cliDir = dirname(require.resolve("@hanzo/cli/package.json"));
} catch {
  console.error(
    "hanzo: @hanzo/cli is not installed. It is a dependency of this package, so\n" +
      "reinstall with `npm install -g hanzo` (or `npm install hanzo` in a project)."
  );
  process.exit(1);
}

const bin = join(cliDir, "bin", process.platform === "win32" ? "hanzo.exe" : "hanzo");
if (!existsSync(bin)) {
  console.error(
    "hanzo: the binary is missing. @hanzo/cli's install script fetches it;\n" +
      "if that was skipped (--ignore-scripts) run `node " + join(cliDir, "install.js") + "`."
  );
  process.exit(1);
}

const { status, signal } = spawnSync(bin, process.argv.slice(2), { stdio: "inherit" });
// A signalled child did not choose its exit code, so report the signal the way
// a shell does rather than collapsing it to 0.
if (signal) process.kill(process.pid, signal);
process.exit(status ?? 1);
