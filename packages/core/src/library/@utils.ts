import * as ChildProcess from 'child_process';
import * as Path from 'path';

import * as FSExtra from 'fs-extra';

export function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function uniqueBy<T, TKey>(
  values: T[],
  keyCallback: (value: T) => TKey,
): T[] {
  let map = new Map<TKey, T>();

  for (let value of values) {
    let key = keyCallback(value);

    if (!map.has(key)) {
      map.set(key, value);
    }
  }

  return Array.from(map.values());
}

export function spawnSync(
  cwd: string,
  command: string,
  args: string[],
): string {
  let {error, status, stdout, stderr} = ChildProcess.spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
  });

  if (error) {
    throw error;
  }

  if (status !== 0) {
    throw new Error(stderr.trim() || stdout.trim());
  }

  return stdout;
}

/**
 * Move directory content without conflict.
 *
 * @returns `true` if content completely moved, otherwise `false`.
 */
export function conservativelyMove(from: string, to: string): boolean {
  if (FSExtra.existsSync(to)) {
    if (FSExtra.statSync(to).isDirectory()) {
      let names = FSExtra.readdirSync(from);

      let completelyMoved = names
        .map(name =>
          conservativelyMove(Path.join(from, name), Path.join(to, name)),
        )
        .every(result => result);

      if (completelyMoved) {
        FSExtra.rmdirSync(from);
      }

      return true;
    } else {
      return false;
    }
  } else {
    FSExtra.moveSync(from, to);
    return true;
  }
}

export function getClosetExistingUpperDirectory(path: string): string | undefined{
  while (!FSExtra.existsSync(path)) {
    let upperPath = Path.dirname(path);

    if (upperPath === path) {
      return undefined;
    }

    path = upperPath;
  }

  return path;
}
