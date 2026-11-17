import {clone} from './model.mjs';
import {parse} from './parse.mjs';
const natural={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const sharp=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const flat=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const pitch=n=>(natural[n[0]]+(n[1]==='#'?1:n[1]==='b'?-1:0)+12)%12;
export function moveChord(c,steps,spelling){if(steps===0)return c.raw;const names=spelling==='sharps'?sharp:flat,shift=n=>names[(pitch(n)+steps+24)%12];return shift(c.root)+c.quality+(c.bass?'/'+shift(c.bass):'')}
export function transpose(project){const p=clone(project),parsed=parse(p.source),changes=[];let cursor=0,output='';for(const c of parsed.tokens){const after=moveChord(c,p.semitones,p.spelling);output+=p.source.slice(cursor,c.start)+'['+after+']';cursor=c.end;changes.push({id:c.id,line:c.line,column:c.column,before:c.raw,after})}output+=p.source.slice(cursor);if(output.length>100000)throw Error('Transposed output exceeds 100000 characters; shorten the source.');return {schema:'cadenceleaf-transform-v1',project:p,output,changes}}
