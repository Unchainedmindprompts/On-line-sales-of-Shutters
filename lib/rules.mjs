import {priceWindow} from './pricing.mjs';
export const fields = ['widthTop','widthMiddle','widthBottom','heightLeft','heightCenter','heightRight','diagonalOne','diagonalTwo'];
export const frames = {
 z:{name:'Inside · Z-frame', detail:'1½″ Bullnose Z-frame', addW:2,addH:2},
 l:{name:'Outside · L-frame', detail:'Plain L-frame',addW:3,addH:3},
 hang:{name:'Inside · Hangstrip',detail:'Mounted behind the panel',addW:0,addH:0}
};
export function assess(w){
 const nums=fields.map(f=>Number(w[f]));
 const valid=nums.every(v=>Number.isFinite(v)&&v>0&&v<=300)&&fields.every(f=>String(w[f]??'').trim()!=='');
 const flags=[];
 if(!valid)return {valid:false,flags:['Enter all eight positive measurements.']};
 const widths=nums.slice(0,3),heights=nums.slice(3,6);
 if(Math.max(...widths)-Math.min(...widths)>.25)flags.push('Width varies by more than ¼″.');
 if(Math.max(...heights)-Math.min(...heights)>.25)flags.push('Height varies by more than ¼″.');
 if(Math.abs(nums[6]-nums[7])>.25)flags.push('Diagonals differ by more than ¼″.');
 const outside=w.frame==='l', frame=frames[w.frame];
 if(!frame)return {valid:false,flags:['Choose a mounting style.']};
 const width=(outside?Math.max:Math.min)(...widths),height=(outside?Math.max:Math.min)(...heights);
 const expected=Math.hypot(width,height);
 if(nums.slice(6).some(v=>Math.abs(v-expected)>2))flags.push('Please recheck the diagonal measurements.');
 for(const [key,msg] of [['obstructions','Window hardware or obstructions need review.'],['tiltIn','Tilt-in cleaning clearance needs review.'],['sill','The bottom sill and support need review.']]) if(w[key]!=='no')flags.push(msg);
 if(!(Number(w.depth)>0))flags.push('Window depth needs confirmation.');
 if(w.frame==='hang')flags.push('Behind-panel hangstrip clearance needs review.');
 if(w.rail==='exact')flags.push('Exact divider position requires approval of top and bottom rail sizes.');
 if(w.alignment==='yes')flags.push('Divider alignment with adjacent windows needs review.');
 if(width/Number(w.panels)>30)flags.push('Panel width and required support need factory verification.');
 if(height>120)flags.push('Height needs factory size-limit verification.');
 const area=Math.max(8,(width+frame.addW)*(height+frame.addH)/144);
 const pricing=priceWindow(area,w);
 if(!pricing)return {valid:false,flags:['Choose a supported panel count and tilt style.']};
 return {valid:true,width,height,area,flags,pricing,estimate:pricing.total};
}
