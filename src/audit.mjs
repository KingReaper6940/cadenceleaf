import {clone} from './model.mjs';
import {parse} from './parse.mjs';
import {transpose} from './transpose.mjs';
function pc(note){const position='ABCDEFG'.indexOf(note[0]),base=[9,11,0,2,4,5,7][position];return (base+(note.endsWith('#')?1:note.endsWith('b')?-1:0)+12)%12}
export function verify(project,result){const p=clone(project);if(!result||result.schema!=='cadenceleaf-transform-v1'||JSON.stringify(result.project)!==JSON.stringify(p)||typeof result.output!=='string'||!Array.isArray(result.changes))throw Error('Transform identity mismatch.');const a=parse(p.source),b=parse(result.output);if(a.tokens.length!==b.tokens.length||a.tokens.length!==result.changes.length)throw Error('Chord occurrence count changed.');let from=0,to=0;const rows=[];
 for(let i=0;i<a.tokens.length;i++){const old=a.tokens[i],next=b.tokens[i],row=result.changes[i];if(p.source.slice(from,old.start)!==result.output.slice(to,next.start))throw Error('Non-chord source text changed.');from=old.end;to=next.end;
 if(old.quality!==next.quality||Boolean(old.bass)!==Boolean(next.bass)||(pc(next.root)-pc(old.root)-p.semitones+36)%12!==0||(old.bass&&(pc(next.bass)-pc(old.bass)-p.semitones+36)%12!==0))throw Error('Root, quality or bass transformation is inconsistent.');
 if(p.semitones===0&&old.raw!==next.raw)throw Error('Zero shift must preserve original spelling.');
 if(p.semitones!==0){const forbidden=p.spelling==='sharps'?'b':'#';if(next.root.includes(forbidden)||next.bass?.includes(forbidden))throw Error('Root or bass spelling differs from the selected policy.')}
 if(row.id!==old.id||row.line!==old.line||row.column!==old.column||row.before!==old.raw||row.after!==next.raw)throw Error('Occurrence receipt mismatch.');
 rows.push({...row,rootBefore:old.root,rootAfter:next.root,bassBefore:old.bass,bassAfter:next.bass,quality:old.quality,rootDelta:(pc(next.root)-pc(old.root)+12)%12});
 }if(p.source.slice(from)!==result.output.slice(to))throw Error('Non-chord source suffix changed.');
 return {schema:'cadenceleaf-receipt-v1',checked:true,project:p,output:result.output,rows,lines:b.lines,stats:{occurrences:rows.length,changed:rows.filter(r=>r.before!==r.after).length,uniqueBefore:new Set(rows.map(r=>r.before)).size,slashBasses:rows.filter(r=>r.bassBefore).length,sourceLines:a.lines.length}}}
export const build=p=>verify(p,transpose(p));
