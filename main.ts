import {mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output',D=[[0,-1,'u','U'],[0,1,'d','D'],[-1,0,'l','L'],[1,0,'r','R']],M=1e6;
function P(t){
const r=t.split('\n').filter(x=>x.length),h=r.length,w=Math.max(...r.map(x=>x.length)),a=new Uint8Array(w*h).fill(1),g=[],b=[];
let p=-1;
r.forEach((s,y)=>{for(let x=0;x<s.length;x++){const c=s[x],i=y*w+x;if(c=='#')continue;a[i]=0;if(c=='.'||c=='*'||c=='+')g.push(i);if(c=='$'||c=='*')b.push(i);if(c=='@'||c=='+')p=i}});
for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!x||!y||x==w-1||y==h-1)a[y*w+x]=1;
return[w,a,g,b.sort((x,y)=>x-y),p];
}
function L(w,a,g){
const v=new Uint8Array(a.length),q=[...g];
for(const x of g)v[x]=1;
for(let i=0;i<q.length;i++){const x=q[i];for(const[dx,dy]of D){const d=dy*w+dx,y=x-d;if(!a[y]&&!a[y-d]&&!v[y]){v[y]=1;q.push(y)}}}
return v;
}
function W(w,a,o,f,t){
if(f==t)return'';
const p=new Int32Array(a.length).fill(-1),h=[],q=[f];
p[f]=f;
for(let i=0;i<q.length;i++){const x=q[i];if(x==t)break;for(const[dx,dy,l]of D){const y=x+dy*w+dx;if(a[y]||o[y]||p[y]>=0)continue;p[y]=x;h[y]=l;q.push(y)}}
if(p[t]<0)return'';
let s='';
for(let x=t;x!=f;x=p[x])s=h[x]+s;
return s;
}
function S(l,C){
const[w,a,g,b,p]=l,n=a.length,G=new Uint8Array(n);
for(const x of g)G[x]=1;
const v=L(w,a,g);
if(b.some(x=>!v[x]))return null;
const z=x=>x.every(y=>G[y]);
if(z(b))return{moves:'',end:p};
const o=new Uint8Array(n),s=new Int32Array(n),m=new Int32Array(n),k=new Int32Array(n);
let T=0;
const R=(f,u)=>{T++;let e=f,q=0;k[q++]=f;u[f]=T;while(q>0){const x=k[--q];if(x<e)e=x;for(const[dx,dy]of D){const y=x+dy*w+dx;if(!a[y]&&!o[y]&&u[y]!=T){u[y]=T;k[q++]=y}}}return e};
const F=t=>{for(const x of[t,t-1,t-w,t-w-1]){const y=x+1,c=x+w,d=c+1;if(!(a[x]||o[x])||!(a[y]||o[y])||!(a[c]||o[c])||!(a[d]||o[d]))continue;if(o[x]&&!G[x]||o[y]&&!G[y]||o[c]&&!G[c]||o[d]&&!G[d])return 1}return 0};
const B=[b],Y=[p],A=[-1],U=[-1],V=[-1],X=new Map();
for(const x of b)o[x]=1;
X.set(String.fromCharCode(R(p,s),...b),0);
for(const x of b)o[x]=0;
let f=-1;
for(let h=0;f<0&&h<B.length;h++){
const c=B[h];
for(const x of c)o[x]=1;
R(Y[h],s);
const e=T;
for(let i=0;i<c.length&&f<0;i++){
const x=c[i];
for(const[dx,dy]of D){
const d=dy*w+dx,t=x+d;
if(s[x-d]!=e||a[t]||o[t]||!v[t])continue;
o[x]=0;o[t]=1;
let K=null,N=null;
if(!F(t)){N=c.slice();N[i]=t;N.sort((j,q)=>j-q);K=String.fromCharCode(R(x,m),...N)}
o[t]=0;o[x]=1;
if(!N||X.has(K))continue;
if(B.length>=C)return null;
X.set(K,B.length);
B.push(N);Y.push(x);A.push(h);U.push(x);V.push(t);
if(z(N)){f=B.length-1;break}
}
}
for(const x of c)o[x]=0;
}
if(f<0)return null;
const q=[];
for(let x=f;x>0;x=A[x])q.push(x);
q.reverse();
let mv='',pl=p,bx=b;
for(const x of q){
const fr=U[x],to=V[x],d=to-fr,di=D.find(([dx,dy])=>dy*w+dx==d);
for(const y of bx)o[y]=1;
mv+=W(w,a,o,pl,fr-d);
for(const y of bx)o[y]=0;
mv+=di[3];pl=fr;bx=B[x];
}
return{moves:mv,end:pl};
}
function E(l){
const[w,a,g,b,p]=l,v=L(w,a,g),r=p/w|0,c=new Uint8Array(a.length);
for(let i=r*w;i<(r+1)*w;i++)if(!a[i]&&!v[i])c[i]=1;
if(b.some(x=>c[x]))return null;
const q=new Int32Array(a.length).fill(-1),R=[];
for(let s2=0;s2<a.length;s2++){
if(a[s2]||c[s2]||q[s2]>=0)continue;
const id=R.length,sq=[s2];
q[s2]=id;
for(let i=0;i<sq.length;i++)for(const[dx,dy]of D){const y=sq[i]+dy*w+dx;if(!a[y]&&!c[y]&&q[y]<0){q[y]=id;sq.push(y)}}
R.push([[],[]]);
}
for(const x of b)R[q[x]][0].push(x);
for(const x of g){if(q[x]<0)return null;R[q[x]][1].push(x)}
if(R.some(x=>x[0].length!=x[1].length))return null;
return R.filter(x=>x[0].length);
}
function H(l){
const R=E(l);
if(!R)return null;
const[w,a]=l;
let pl=l[4],mv='';
const d=R.map(()=>0);
for(let i=0;i<R.length;i++){
const wl=a.slice();
for(let j=0;j<R.length;j++)if(j!=i)for(const x of d[j]?R[j][1]:R[j][0])wl[x]=1;
const r=S([w,wl,R[i][1],R[i][0],pl],M);
if(!r)return null;
mv+=r.moves;pl=r.end;d[i]=1;
}
return{moves:mv};
}
function solve(t){
const l=P(t),g=l[2],b=l[3];
if(l[4]<0||!b.length)return'';
const G=new Set(g);
if(b.every(x=>G.has(x)))return'';
const r=H(l)||S(l,2e5);
return r?r.moves:'';
}
for(const id of readdirSync(I).sort()){
const mv=solve(readFileSync(join(I,id,'level.txt'),'utf8'));
mkdirSync(join(O,id),{recursive:true});
writeFileSync(join(O,id,'solution.txt'),mv+'\n');
}
