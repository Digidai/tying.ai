import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Position } from '@/types';

interface RawPosition extends Omit<Position, 'postedAt'> {
  postedAt: string;
}

let cachedPositions: Position[] | null = null;

export async function loadPositions(): Promise<Position[]> {
  if (cachedPositions) {
    return cachedPositions;
  }

  const dataPath = join(process.cwd(), 'public', 'data', 'positions.json');
  const fileContent = await readFile(dataPath, 'utf-8');
  const rawPositions = JSON.parse(fileContent) as RawPosition[];

  cachedPositions = rawPositions.map(position => ({
    ...position,
    postedAt: new Date(position.postedAt),
  }));

  return cachedPositions;
}
