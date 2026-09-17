// Public selling prices only. Never put supplier costs in this module.
export const retail = Object.freeze({basePerSquareFoot:25.77,invisibleTiltPerPanel:30.77});
const cents = amount => Math.round((amount + Number.EPSILON)*100);
export function priceWindow(area, {panels, tilt='center'}) {
 const count=Number(panels);
 if(!Number.isFinite(area)||area<0||![1,2].includes(count)||!['center','invisible'].includes(tilt))return null;
 const baseCents=cents(Math.max(8,area)*retail.basePerSquareFoot);
 const tiltCents=tilt==='invisible'?count*cents(retail.invisibleTiltPerPanel):0;
 return {base:baseCents/100,invisibleTilt:tiltCents/100,total:(baseCents+tiltCents)/100};
}
