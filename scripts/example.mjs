import {mkdir,writeFile} from 'node:fs/promises';
import {example} from '../src/example.mjs';
import {build} from '../src/audit.mjs';
import {projectJSON,receiptJSON,reviewHTML,summarySVG} from '../src/exports.mjs';
const p=example(),r=build(p);await mkdir('examples',{recursive:true});
for(const [name,value] of [['lantern-project.json',projectJSON(p)],['lantern-rehearsal.cho',r.output],['lantern-receipt.json',receiptJSON(r)],['lantern-sheet.html',reviewHTML(r)],['lantern-summary.svg',summarySVG(r)]])await writeFile('examples/'+name,value);
console.log('Generated five actual exports: '+JSON.stringify(r.stats));
