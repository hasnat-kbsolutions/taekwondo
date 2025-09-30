import{c as d}from"./createLucideIcon-CDCLNRtp.js";import{m as p,a as D}from"./format-LUeNQFBy.js";/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=d("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=d("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=d("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=d("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);function H(t,e){const n=h(t);let i;if(n.date){const a=C(n.date,2);i=k(a.restDateString,a.year)}if(!i||isNaN(i.getTime()))return new Date(NaN);const s=i.getTime();let o=0,c;if(n.time&&(o=w(n.time),isNaN(o)))return new Date(NaN);if(n.timezone){if(c=x(n.timezone),isNaN(c))return new Date(NaN)}else{const a=new Date(s+o),u=new Date(0);return u.setFullYear(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate()),u.setHours(a.getUTCHours(),a.getUTCMinutes(),a.getUTCSeconds(),a.getUTCMilliseconds()),u}return new Date(s+o+c)}const f={dateTimeDelimiter:/[T ]/,timeZoneDelimiter:/[Z ]/i,timezone:/([Z+-].*)$/},y=/^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,N=/^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,T=/^([+-])(\d{2})(?::?(\d{2}))?$/;function h(t){const e={},r=t.split(f.dateTimeDelimiter);let n;if(r.length>2)return e;if(/:/.test(r[0])?n=r[0]:(e.date=r[0],n=r[1],f.timeZoneDelimiter.test(e.date)&&(e.date=t.split(f.timeZoneDelimiter)[0],n=t.substr(e.date.length,t.length))),n){const i=f.timezone.exec(n);i?(e.time=n.replace(i[1],""),e.timezone=i[1]):e.time=n}return e}function C(t,e){const r=new RegExp("^(?:(\\d{4}|[+-]\\d{"+(4+e)+"})|(\\d{2}|[+-]\\d{"+(2+e)+"})$)"),n=t.match(r);if(!n)return{year:NaN,restDateString:""};const i=n[1]?parseInt(n[1]):null,s=n[2]?parseInt(n[2]):null;return{year:s===null?i:s*100,restDateString:t.slice((n[1]||n[2]).length)}}function k(t,e){if(e===null)return new Date(NaN);const r=t.match(y);if(!r)return new Date(NaN);const n=!!r[4],i=l(r[1]),s=l(r[2])-1,o=l(r[3]),c=l(r[4]),a=l(r[5])-1;if(n)return Y(e,c,a)?U(e,c,a):new Date(NaN);{const u=new Date(0);return!M(e,s,o)||!z(e,i)?new Date(NaN):(u.setUTCFullYear(e,s,Math.max(i,o)),u)}}function l(t){return t?parseInt(t):1}function w(t){const e=t.match(N);if(!e)return NaN;const r=m(e[1]),n=m(e[2]),i=m(e[3]);return O(r,n,i)?r*p+n*D+i*1e3:NaN}function m(t){return t&&parseFloat(t.replace(",","."))||0}function x(t){if(t==="Z")return 0;const e=t.match(T);if(!e)return 0;const r=e[1]==="+"?-1:1,n=parseInt(e[2]),i=e[3]&&parseInt(e[3])||0;return Z(n,i)?r*(n*p+i*D):NaN}function U(t,e,r){const n=new Date(0);n.setUTCFullYear(t,0,4);const i=n.getUTCDay()||7,s=(e-1)*7+r+1-i;return n.setUTCDate(n.getUTCDate()+s),n}const I=[31,null,31,30,31,30,31,31,30,31,30,31];function g(t){return t%400===0||t%4===0&&t%100!==0}function M(t,e,r){return e>=0&&e<=11&&r>=1&&r<=(I[e]||(g(t)?29:28))}function z(t,e){return e>=1&&e<=(g(t)?366:365)}function Y(t,e,r){return e>=1&&e<=53&&r>=0&&r<=6}function O(t,e,r){return t===24?e===0&&r===0:r>=0&&r<60&&e>=0&&e<60&&t>=0&&t<25}function Z(t,e){return e>=0&&e<=59}export{S as C,$ as M,v as T,W as a,H as p};
