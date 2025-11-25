import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcPath = join(__dirname, '../src/data/positions.ts');
const distPath = join(__dirname, '../public/data');

async function buildPositionsJson() {
  const source = await readFile(srcPath, 'utf-8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });

  const context = {
    module: { exports: {} },
    exports: {},
    require: createRequire(import.meta.url),
    console,
    process,
  };

  vm.createContext(context);
  const script = new vm.Script(transpiled.outputText, { filename: 'positions.js' });
  script.runInContext(context);

  const exportedPositions = context.module.exports?.positions ?? context.exports?.positions;
  const positions = Array.isArray(exportedPositions) ? exportedPositions : null;
  if (!positions) {
    throw new Error('positions export not found in src/data/positions.ts');
  }

  const jsonData = positions.map(position => ({
    ...position,
    postedAt:
      position.postedAt instanceof Date ? position.postedAt.toISOString() : position.postedAt,
  }));

  await mkdir(distPath, { recursive: true });
  const outputFile = join(distPath, 'positions.json');
  await writeFile(outputFile, JSON.stringify(jsonData, null, 2), 'utf-8');

  console.log(`✅ Generated ${outputFile} from src/data/positions.ts`);
}

buildPositionsJson().catch(error => {
  console.error('Failed to generate positions.json:', error);
  process.exitCode = 1;
});
