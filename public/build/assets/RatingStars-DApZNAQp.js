import{j as e}from"./app-CikEoOUb.js";import{d as n}from"./authenticated-layout-tnqnI4FE.js";/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=n("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]),f=({rating:r,onRatingChange:o,readonly:t=!1,size:a="md"})=>{const l=[1,2,3,4,5],c={sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6"},i=s=>{!t&&o&&o(s)};return e.jsx("div",{className:"flex items-center gap-1",children:l.map(s=>e.jsx("button",{type:"button",onClick:()=>i(s),disabled:t,className:`${t?"cursor-default":"cursor-pointer hover:scale-110 transition-transform"}`,children:e.jsx(m,{className:`${c[a]} ${s<=r?"fill-yellow-400 text-yellow-400":"text-gray-300"}`})},s))})};export{f as R,m as S};
