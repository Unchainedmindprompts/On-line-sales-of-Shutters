'use client';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
const slides=[
 ['homepage-hero.jpeg','White plantation shutters along a row of windows','cover'],
 ['4DAD36F9-10B3-42F5-87A6-DC132CC95325.jpeg','White shutters behind a reading chair','cover'],
 ['IMG_1862.jpeg','White shutters across bedroom windows','contain'],
 ['IMG_1865.jpeg','Bedroom with white shutters across two walls','contain'],
 ['IMG_3225.jpeg','White shutters above a kitchen sink','contain'],
 ['IMG_3863.jpeg','White shutters beside a dining room sideboard','cover'],
 ['IMG_2360.jpeg','White shutters fitted into a rectangular window','cover'],
 ['IMG_1868.jpeg','White shutters around a corner bathtub','contain'],
 ['IMG_4436.jpeg','Living room with white shutters and a fireplace','contain'],
 ['FD4ACB05-1DF1-4107-A365-DA3455CD0B0E.jpeg','White window shutters in a sitting area','cover']
];
export default function HeroSlideshow(){
 const [current,setCurrent]=useState(0),[paused,setPaused]=useState(false),[reduced,setReduced]=useState(true),[hover,setHover]=useState(false),[focused,setFocused]=useState(false),[visible,setVisible]=useState(true),[loaded,setLoaded]=useState([]),[requested,setRequested]=useState([0]);
 const touch=useRef(null);
 useEffect(()=>{const q=window.matchMedia('(prefers-reduced-motion: reduce)');const motion=()=>setReduced(q.matches);motion();q.addEventListener('change',motion);const visibility=()=>setVisible(!document.hidden);visibility();document.addEventListener('visibilitychange',visibility);return()=>{q.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility)}},[]);
 useEffect(()=>{if(loaded.includes(current))setRequested(p=>[...new Set([...p,(current+1)%slides.length])])},[current,loaded]);
 const running=!paused&&!reduced&&!hover&&!focused&&visible;
 useEffect(()=>{if(!running||!loaded.includes(current)||!loaded.includes((current+1)%slides.length))return;const timer=setTimeout(()=>setCurrent(n=>(n+1)%slides.length),5500);return()=>clearTimeout(timer)},[current,running,loaded]);
 function move(delta){setPaused(true);const next=(current+delta+slides.length)%slides.length;setRequested(p=>[...new Set([...p,next])]);setCurrent(next)}
 return <section className="hero-visual hero-photo slideshow" aria-label="Shutter photo gallery" aria-roledescription="carousel" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}}} onTouchStart={e=>{touch.current=[e.touches[0].clientX,e.touches[0].clientY]}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current[0],dy=e.changedTouches[0].clientY-touch.current[1];touch.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1)}}>
 {slides.map(([file,alt,fit],i)=>requested.includes(i)&&<div key={file} className={'hero-slide '+(i%2===0?'zoom-in ':'zoom-out ')+(i===current?'active':'')} aria-hidden={i!==current} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${slides.length}`}><Image src={'/images/shutters/'+file} alt={alt} fill sizes="(max-width: 760px) 90vw, 45vw" priority={i===0} loading={i===0?undefined:'eager'} style={{objectFit:fit,animationPlayState:running&&loaded.includes(i)?'running':'paused'}} onLoad={()=>setLoaded(p=>p.includes(i)?p:[...p,i])}/></div>)}
 <div className="slide-controls"><button type="button" aria-label="Previous photo" onClick={()=>move(-1)}>←</button><span aria-live={paused?'polite':'off'}>{current+1} / {slides.length}</span><button type="button" aria-label="Next photo" onClick={()=>move(1)}>→</button><button type="button" className="slide-pause" aria-label={paused||reduced?'Play slideshow':'Pause slideshow'} onClick={()=>{if(paused||reduced){setReduced(false);setPaused(false)}else setPaused(true)}}>{paused||reduced?'Play':'Pause'}</button></div>
 </section>
}
