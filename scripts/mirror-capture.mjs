// Imported by the supported browser developer REPL. Never persists cookies or headers.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const sensitive = /password|passwd|secret|token|sessionid|ubus_rpc_session|private.?key|auth.?key|auth_user|auth_pass|^dase$|api.?key|subscription|subscribe_url|access_key|^key$|^username$/i;
const identifiers = /^(hostname|host_name|ssid|bssid|macaddr|mac|client_id|duid)$/i;
const aliases = new Map();
function alias(value, type) {
  if (!value) return value;
  if (!aliases.has(value)) aliases.set(value, `${type}-${String(aliases.size + 1).padStart(2, '0')}`);
  return aliases.get(value);
}
export function scrub(value, key = '') {
  if (sensitive.test(key)) return typeof value === 'string' && value ? 'preview-only' : value;
  if (Array.isArray(value)) return value.map(v => scrub(v, key));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [scrubText(k), scrub(v,k)]));
  if (typeof value !== 'string') return value;
  if (identifiers.test(key) && !/mac|bssid/i.test(key)) return alias(value, key === 'ssid' ? 'Aeris-Lab' : 'Device');
  return scrubText(value);
}
export function scrubText(text) {
  return text
    .replace(/\b[0-9a-f]{32}\b/gi, '00000000000000000000000000000001')
    .replace(/\b(?:[0-9a-f]{2}:){5}[0-9a-f]{2}\b/gi, s => '02:00:00:' + crypto.createHash('sha256').update(s.toLowerCase()).digest('hex').slice(0,6).match(/../g).join(':'))
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, s => {
      if (/^(127\.|0\.|255\.)/.test(s) || ['8.8.8.8','1.1.1.1'].includes(s)) return s;
      return '192.0.2.' + (1 + parseInt(crypto.createHash('sha256').update(s).digest('hex').slice(0,4),16) % 253);
    })
    .replace(/-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g, '[private key removed]');
}
export function normalizeURL(raw) {
  const url = new URL(raw, 'http://localhost');
  const pairs = [...url.searchParams].filter(([k]) => !/^\d{10,}$/.test(k) && !['v','_','token','sid'].includes(k));
  return url.pathname + (pairs.length ? '?' + new URLSearchParams(pairs).toString() : '');
}
export function rpcKey(call) {
  const params = call.params || [];
  return JSON.stringify(call.method === 'call' ? [params[1], params[2], scrub(params[3] || {})] : [call.method, scrub(params)]);
}
export function httpKey(method, url, post) {
  let key = normalizeURL(url);
  if (method === 'POST') {
    const params = new URLSearchParams(post || '');
    for (const name of ['sessionid', 'token', 'sid', 'ubus_rpc_session']) params.delete(name);
    params.sort();
    key = 'POST ' + key + '\n' + params.toString();
  }
  return key;
}
export class MirrorCapture {
  constructor(cdp, directory) { this.cdp=cdp; this.directory=directory; this.requests=new Map(); this.records=new Map(); this.rpc=new Map(); this.errors=[]; this.pages=[]; }
  async start() {
    await fs.mkdir(this.directory, {recursive:true});
    await this.cdp.send('Network.enable',{maxTotalBufferSize:100000000,maxResourceBufferSize:15000000});
    await this.cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    this.cursor=(await this.cdp.readEvents()).cursor;
  }
  async drain() {
    let more=true, count=0;
    while(more) {
      const result=await this.cdp.readEvents({afterSequence:this.cursor,methods:['Network.requestWillBeSent','Network.responseReceived','Network.loadingFinished'],limit:1000});
      this.cursor=result.cursor; more=result.hasMore;
      for(const event of result.events) {
        const p=event.params, id=p.requestId;
        if(event.method==='Network.requestWillBeSent') {
          if(p.request.url.startsWith('http://127.0.0.1:42080/')) this.requests.set(id,{url:p.request.url,method:p.request.method,post:p.request.postData});
        } else if(event.method==='Network.responseReceived') {
          const r=this.requests.get(id); if(r) {r.status=p.response.status; r.mime=p.response.mimeType;}
        } else {
          const r=this.requests.get(id); this.requests.delete(id);
          if(!r || !r.status || r.status!==200 || new URL(r.url).pathname.startsWith('/luci-static/')) continue;
          try {
            const body=await this.cdp.send('Network.getResponseBody',{requestId:id});
            const raw=body.base64Encoded ? Buffer.from(body.body,'base64').toString('utf8') : body.body;
            let parsed; try{parsed=JSON.parse(raw);}catch{}
            let request; try{request=JSON.parse(r.post);}catch{}
            if(request && (Array.isArray(request) || request.jsonrpc)) {
              const calls=Array.isArray(request)?request:[request], replies=Array.isArray(parsed)?parsed:[parsed];
              for(const call of calls) {
                const reply=replies.find(x=>x?.id===call.id);
                if(reply) this.rpc.set(rpcKey(call),scrub({...reply,id:undefined}));
              }
            } else {
              // These are shipped source files translated by LuCI, not user data.
              // Regex redaction must never rewrite JavaScript syntax or templates.
              const publicSource = r.mime.includes('javascript') && /\/(?:translations\/|openclash\/translate_js)/.test(new URL(r.url).pathname);
              const text=publicSource?raw:parsed===undefined?scrubText(raw):JSON.stringify(scrub(parsed));
              this.records.set(httpKey(r.method,r.url,r.post),{mime:r.mime,body:text});
            }
            count++;
          } catch(e) {this.errors.push({path:normalizeURL(r.url),error:String(e).slice(0,120)});}
        }
      }
    }
    await this.save();
    return {newResponses:count,http:this.records.size,rpc:this.rpc.size,errors:this.errors.length};
  }
  async save() {
    const data={capturedAt:new Date().toISOString(),records:Object.fromEntries(this.records),rpc:Object.fromEntries(this.rpc),pages:this.pages,errors:this.errors};
    await fs.writeFile(path.join(this.directory,'responses.json'),JSON.stringify(data,null,2));
  }
}
