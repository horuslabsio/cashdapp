import Pe, { useMemo as vn, useState as at, useCallback as Yt, useEffect as Ct, useRef as bn, useSyncExternalStore as Ku, useLayoutEffect as qu, useDebugValue as Wu } from "react";
import { NativeModules as ju, Platform as wt, StyleSheet as jn, View as un, Text as Oi, Pressable as ps, useColorScheme as Yu, Animated as Ot, Easing as As, Image as Xu, TurboModuleRegistry as Zu, Keyboard as gs, Appearance as ms, Linking as Ju, Modal as Qu, KeyboardAvoidingView as el } from "react-native";
import { WebView as tl } from "react-native-webview";
const bt = {
  ARBITRUM: "ARBITRUM_MAINNET",
  ARBITRUM_TESTNET: "ARBITRUM_TESTNET",
  AVALANCHE: "AVALANCHE_MAINNET",
  AVALANCHE_TESTNET: "AVALANCHE_TESTNET",
  BASE: "BASE_MAINNET",
  BASE_TESTNET: "BASE_TESTNET",
  BSC: "BSC_MAINNET",
  ETHEREUM: "ETHEREUM_MAINNET",
  ETHEREUM_TESTNET: "ETHEREUM_TESTNET",
  HYPEREVM: "HYPEREVM_MAINNET",
  LISK: "LISK_MAINNET",
  MONAD: "MONAD_MAINNET",
  MONAD_TESTNET: "MONAD_TESTNET",
  OPTIMISM: "OPTIMISM_MAINNET",
  OPTIMISM_TESTNET: "OPTIMISM_TESTNET",
  POLYGON: "POLYGON_MAINNET",
  SOLANA: "SOLANA_MAINNET",
  SOLANA_TESTNET: "SOLANA_TESTNET",
  STARKNET: "STARKNET_MAINNET",
  STARKNET_TESTNET: "STARKNET_TESTNET"
};
function So(e, { strict: t = !0 } = {}) {
  return !e || typeof e != "string" ? !1 : t ? /^0x[0-9a-fA-F]*$/.test(e) : e.startsWith("0x");
}
function Os(e) {
  return So(e, { strict: !1 }) ? Math.ceil((e.length - 2) / 2) : e.length;
}
const ka = "2.43.4";
let Si = {
  getDocsUrl: ({ docsBaseUrl: e, docsPath: t = "", docsSlug: n }) => t ? `${e ?? "https://viem.sh"}${t}${n ? `#${n}` : ""}` : void 0,
  version: `viem@${ka}`
};
class hn extends Error {
  constructor(t, n = {}) {
    const r = n.cause instanceof hn ? n.cause.details : n.cause?.message ? n.cause.message : n.details, o = n.cause instanceof hn && n.cause.docsPath || n.docsPath, i = Si.getDocsUrl?.({ ...n, docsPath: o }), s = [
      t || "An error occurred.",
      "",
      ...n.metaMessages ? [...n.metaMessages, ""] : [],
      ...i ? [`Docs: ${i}`] : [],
      ...r ? [`Details: ${r}`] : [],
      ...Si.version ? [`Version: ${Si.version}`] : []
    ].join(`
`);
    super(s, n.cause ? { cause: n.cause } : void 0), Object.defineProperty(this, "details", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "docsPath", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "metaMessages", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "shortMessage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "version", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "BaseError"
    }), this.details = r, this.docsPath = o, this.metaMessages = n.metaMessages, this.name = n.name ?? this.name, this.shortMessage = t, this.version = ka;
  }
  walk(t) {
    return Fa(this, t);
  }
}
function Fa(e, t) {
  return t?.(e) ? e : e && typeof e == "object" && "cause" in e && e.cause !== void 0 ? Fa(e.cause, t) : t ? null : e;
}
let za = class extends hn {
  constructor({ size: t, targetSize: n, type: r }) {
    super(`${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} size (${t}) exceeds padding size (${n}).`, { name: "SizeExceedsPaddingSizeError" });
  }
};
function Gr(e, { dir: t, size: n = 32 } = {}) {
  return typeof e == "string" ? nl(e, { dir: t, size: n }) : rl(e, { dir: t, size: n });
}
function nl(e, { dir: t, size: n = 32 } = {}) {
  if (n === null)
    return e;
  const r = e.replace("0x", "");
  if (r.length > n * 2)
    throw new za({
      size: Math.ceil(r.length / 2),
      targetSize: n,
      type: "hex"
    });
  return `0x${r[t === "right" ? "padEnd" : "padStart"](n * 2, "0")}`;
}
function rl(e, { dir: t, size: n = 32 } = {}) {
  if (n === null)
    return e;
  if (e.length > n)
    throw new za({
      size: e.length,
      targetSize: n,
      type: "bytes"
    });
  const r = new Uint8Array(n);
  for (let o = 0; o < n; o++) {
    const i = t === "right";
    r[i ? o : n - o - 1] = e[i ? o : e.length - o - 1];
  }
  return r;
}
let il = class extends hn {
  constructor({ max: t, min: n, signed: r, size: o, value: i }) {
    super(`Number "${i}" is not in safe ${o ? `${o * 8}-bit ${r ? "signed" : "unsigned"} ` : ""}integer range ${t ? `(${n} to ${t})` : `(above ${n})`}`, { name: "IntegerOutOfRangeError" });
  }
}, ol = class extends hn {
  constructor({ givenSize: t, maxSize: n }) {
    super(`Size cannot exceed ${n} bytes. Given size: ${t} bytes.`, { name: "SizeOverflowError" });
  }
};
function No(e, { size: t }) {
  if (Os(e) > t)
    throw new ol({
      givenSize: Os(e),
      maxSize: t
    });
}
function sl(e, t = {}) {
  const { signed: n, size: r } = t, o = BigInt(e);
  let i;
  r ? n ? i = (1n << BigInt(r) * 8n - 1n) - 1n : i = 2n ** (BigInt(r) * 8n) - 1n : typeof e == "number" && (i = BigInt(Number.MAX_SAFE_INTEGER));
  const s = typeof i == "bigint" && n ? -i - 1n : 0;
  if (i && o > i || o < s) {
    const f = typeof e == "bigint" ? "n" : "";
    throw new il({
      max: i ? `${i}${f}` : void 0,
      min: `${s}${f}`,
      signed: n,
      size: r,
      value: `${e}${f}`
    });
  }
  const l = `0x${(n && o < 0 ? (1n << BigInt(r * 8)) + BigInt(o) : o).toString(16)}`;
  return r ? Gr(l, { size: r }) : l;
}
const al = /* @__PURE__ */ new TextEncoder();
function cl(e, t = {}) {
  return typeof e == "number" || typeof e == "bigint" ? ll(e, t) : typeof e == "boolean" ? ul(e, t) : So(e) ? Va(e, t) : Ha(e, t);
}
function ul(e, t = {}) {
  const n = new Uint8Array(1);
  return n[0] = Number(e), typeof t.size == "number" ? (No(n, { size: t.size }), Gr(n, { size: t.size })) : n;
}
const zt = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function Ss(e) {
  if (e >= zt.zero && e <= zt.nine)
    return e - zt.zero;
  if (e >= zt.A && e <= zt.F)
    return e - (zt.A - 10);
  if (e >= zt.a && e <= zt.f)
    return e - (zt.a - 10);
}
function Va(e, t = {}) {
  let n = e;
  t.size && (No(n, { size: t.size }), n = Gr(n, { dir: "right", size: t.size }));
  let r = n.slice(2);
  r.length % 2 && (r = `0${r}`);
  const o = r.length / 2, i = new Uint8Array(o);
  for (let s = 0, l = 0; s < o; s++) {
    const f = Ss(r.charCodeAt(l++)), m = Ss(r.charCodeAt(l++));
    if (f === void 0 || m === void 0)
      throw new hn(`Invalid byte sequence ("${r[l - 2]}${r[l - 1]}" in "${r}").`);
    i[s] = f * 16 + m;
  }
  return i;
}
function ll(e, t) {
  const n = sl(e, t);
  return Va(n);
}
function Ha(e, t = {}) {
  const n = al.encode(e);
  return typeof t.size == "number" ? (No(n, { size: t.size }), Gr(n, { dir: "right", size: t.size })) : n;
}
const cr = /* @__PURE__ */ BigInt(2 ** 32 - 1), Ns = /* @__PURE__ */ BigInt(32);
function dl(e, t = !1) {
  return t ? { h: Number(e & cr), l: Number(e >> Ns & cr) } : { h: Number(e >> Ns & cr) | 0, l: Number(e & cr) | 0 };
}
function fl(e, t = !1) {
  const n = e.length;
  let r = new Uint32Array(n), o = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: s, l } = dl(e[i], t);
    [r[i], o[i]] = [s, l];
  }
  return [r, o];
}
const hl = (e, t, n) => e << n | t >>> 32 - n, _l = (e, t, n) => t << n | e >>> 32 - n, Rl = (e, t, n) => t << n - 32 | e >>> 64 - n, El = (e, t, n) => e << n - 32 | t >>> 64 - n;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function pl(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function ys(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Tr(e, ...t) {
  if (!pl(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Ts(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Al(e, t) {
  Tr(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function gl(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Ga(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
const ml = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ol(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
function Sl(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = Ol(e[t]);
  return e;
}
const Is = ml ? (e) => e : Sl;
function Nl(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Ka(e) {
  return typeof e == "string" && (e = Nl(e)), Tr(e), e;
}
let yl = class {
};
function Tl(e) {
  const t = (r) => e().update(Ka(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
const Il = BigInt(0), Fn = BigInt(1), wl = BigInt(2), vl = BigInt(7), bl = BigInt(256), Cl = BigInt(113), qa = [], Wa = [], ja = [];
for (let e = 0, t = Fn, n = 1, r = 0; e < 24; e++) {
  [n, r] = [r, (2 * n + 3 * r) % 5], qa.push(2 * (5 * r + n)), Wa.push((e + 1) * (e + 2) / 2 % 64);
  let o = Il;
  for (let i = 0; i < 7; i++)
    t = (t << Fn ^ (t >> vl) * Cl) % bl, t & wl && (o ^= Fn << (Fn << /* @__PURE__ */ BigInt(i)) - Fn);
  ja.push(o);
}
const Ya = fl(ja, !0), Ll = Ya[0], xl = Ya[1], ws = (e, t, n) => n > 32 ? Rl(e, t, n) : hl(e, t, n), vs = (e, t, n) => n > 32 ? El(e, t, n) : _l(e, t, n);
function Ul(e, t = 24) {
  const n = new Uint32Array(10);
  for (let r = 24 - t; r < 24; r++) {
    for (let s = 0; s < 10; s++)
      n[s] = e[s] ^ e[s + 10] ^ e[s + 20] ^ e[s + 30] ^ e[s + 40];
    for (let s = 0; s < 10; s += 2) {
      const l = (s + 8) % 10, f = (s + 2) % 10, m = n[f], y = n[f + 1], C = ws(m, y, 1) ^ n[l], D = vs(m, y, 1) ^ n[l + 1];
      for (let v = 0; v < 50; v += 10)
        e[s + v] ^= C, e[s + v + 1] ^= D;
    }
    let o = e[2], i = e[3];
    for (let s = 0; s < 24; s++) {
      const l = Wa[s], f = ws(o, i, l), m = vs(o, i, l), y = qa[s];
      o = e[y], i = e[y + 1], e[y] = f, e[y + 1] = m;
    }
    for (let s = 0; s < 50; s += 10) {
      for (let l = 0; l < 10; l++)
        n[l] = e[s + l];
      for (let l = 0; l < 10; l++)
        e[s + l] ^= ~n[(l + 2) % 10] & n[(l + 4) % 10];
    }
    e[0] ^= Ll[r], e[1] ^= xl[r];
  }
  Ga(n);
}
let Dl = class Xa extends yl {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(t, n, r, o = !1, i = 24) {
    if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = t, this.suffix = n, this.outputLen = r, this.enableXOF = o, this.rounds = i, ys(r), !(0 < t && t < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200), this.state32 = gl(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    Is(this.state32), Ul(this.state32, this.rounds), Is(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(t) {
    Ts(this), t = Ka(t), Tr(t);
    const { blockLen: n, state: r } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const s = Math.min(n - this.pos, o - i);
      for (let l = 0; l < s; l++)
        r[this.pos++] ^= t[i++];
      this.pos === n && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: t, suffix: n, pos: r, blockLen: o } = this;
    t[r] ^= n, (n & 128) !== 0 && r === o - 1 && this.keccak(), t[o - 1] ^= 128, this.keccak();
  }
  writeInto(t) {
    Ts(this, !1), Tr(t), this.finish();
    const n = this.state, { blockLen: r } = this;
    for (let o = 0, i = t.length; o < i; ) {
      this.posOut >= r && this.keccak();
      const s = Math.min(r - this.posOut, i - o);
      t.set(n.subarray(this.posOut, this.posOut + s), o), this.posOut += s, o += s;
    }
    return t;
  }
  xofInto(t) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(t);
  }
  xof(t) {
    return ys(t), this.xofInto(new Uint8Array(t));
  }
  digestInto(t) {
    if (Al(t, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(t), this.destroy(), t;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, Ga(this.state);
  }
  _cloneInto(t) {
    const { blockLen: n, suffix: r, outputLen: o, rounds: i, enableXOF: s } = this;
    return t || (t = new Xa(n, r, o, s, i)), t.state32.set(this.state32), t.pos = this.pos, t.posOut = this.posOut, t.finished = this.finished, t.rounds = i, t.suffix = r, t.outputLen = o, t.enableXOF = s, t.destroyed = this.destroyed, t;
  }
};
const Ml = (e, t, n) => Tl(() => new Dl(t, e, n)), Bl = Ml(1, 136, 256 / 8);
function Pl(e, t) {
  return Bl(So(e, { strict: !1 }) ? cl(e) : e);
}
class $l extends hn {
  constructor({ address: t }) {
    super(`Address "${t}" is invalid.`, {
      metaMessages: [
        "- Address must be a hex value of 20 bytes (40 hex characters).",
        "- Address must match its checksum counterpart."
      ],
      name: "InvalidAddressError"
    });
  }
}
let Za = class extends Map {
  constructor(t) {
    super(), Object.defineProperty(this, "maxSize", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.maxSize = t;
  }
  get(t) {
    const n = super.get(t);
    return super.has(t) && n !== void 0 && (this.delete(t), super.set(t, n)), n;
  }
  set(t, n) {
    if (super.set(t, n), this.maxSize && this.size > this.maxSize) {
      const r = this.keys().next().value;
      r && this.delete(r);
    }
    return this;
  }
};
const Ni = /* @__PURE__ */ new Za(8192);
function Ja(e, t) {
  if (Ni.has(`${e}.${t}`))
    return Ni.get(`${e}.${t}`);
  const n = e.substring(2).toLowerCase(), r = Pl(Ha(n)), o = n.split("");
  for (let s = 0; s < 40; s += 2)
    r[s >> 1] >> 4 >= 8 && o[s] && (o[s] = o[s].toUpperCase()), (r[s >> 1] & 15) >= 8 && o[s + 1] && (o[s + 1] = o[s + 1].toUpperCase());
  const i = `0x${o.join("")}`;
  return Ni.set(`${e}.${t}`, i), i;
}
function ut(e, t) {
  if (!Fl(e, { strict: !1 }))
    throw new $l({ address: e });
  return Ja(e, t);
}
const kl = /^0x[a-fA-F0-9]{40}$/, yi = /* @__PURE__ */ new Za(8192);
function Fl(e, t) {
  const { strict: n = !0 } = t ?? {}, r = `${e}.${n}`;
  if (yi.has(r))
    return yi.get(r);
  const o = kl.test(e) ? e.toLowerCase() === e ? !0 : n ? Ja(e) === e : !0 : !1;
  return yi.set(r, o), o;
}
const lt = {
  USDC: "USDC",
  USDT: "USDT",
  DAI: "DAI",
  WETH: "WETH"
};
bt.ARBITRUM + "", lt.DAI + "", ut("0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"), lt.USDC + "", ut("0xaf88d065e77c8cC2239327C5EDb3A432268e5831"), lt.USDT + "", ut("0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"), lt.WETH + "", ut("0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"), bt.ARBITRUM_TESTNET + "", lt.USDC + "", ut("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"), bt.AVALANCHE + "", lt.USDC + "", ut("0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"), bt.AVALANCHE_TESTNET + "", lt.USDC + "", ut("0x5425890298aed601595a70AB815c96711a31Bc65"), bt.BASE + "", lt.USDC + "", ut("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"), lt.WETH + "", ut("0x4200000000000000000000000000000000000006"), bt.BASE_TESTNET + "", lt.USDC + "", ut("0x036CbD53842c5426634e7929541eC2318f3dCF7e"), bt.BSC + "", lt.USDC + "", ut("0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"), bt.ETHEREUM + "", lt.DAI + "", ut("0x6B175474E89094C44Da98b954EedeAC495271d0F"), lt.USDC + "", ut("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"), lt.USDT + "", ut("0xdAC17F958D2ee523a2206206994597C13D831ec7"), lt.WETH + "", ut("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"), bt.ETHEREUM_TESTNET + "", lt.USDC + "", ut("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");
const zl = new Set(Object.values(bt));
function Vl(e) {
  if (Hl(e))
    return e;
  const t = bt[e];
  if (!t)
    throw new Error(`Invalid chain: ${e}.`);
  return t;
}
function Hl(e) {
  return zl.has(e);
}
class io extends Error {
  response;
  request;
  options;
  constructor(t, n, r) {
    const o = t.status || t.status === 0 ? t.status : "", i = t.statusText ?? "", s = `${o} ${i}`.trim(), l = s ? `status code ${s}` : "an unknown error";
    super(`Request failed with ${l}: ${n.method} ${n.url}`), this.name = "HTTPError", this.response = t, this.request = n, this.options = r;
  }
}
class Qa extends Error {
  name = "NonError";
  value;
  constructor(t) {
    let n = "Non-error value was thrown";
    try {
      typeof t == "string" ? n = t : t && typeof t == "object" && "message" in t && typeof t.message == "string" && (n = t.message);
    } catch {
    }
    super(n), this.value = t;
  }
}
class Ti extends Error {
  name = "ForceRetryError";
  customDelay;
  code;
  customRequest;
  constructor(t) {
    const n = t?.cause ? t.cause instanceof Error ? t.cause : new Qa(t.cause) : void 0;
    super(t?.code ? `Forced retry: ${t.code}` : "Forced retry", n ? { cause: n } : void 0), this.customDelay = t?.delay, this.code = t?.code, this.customRequest = t?.request;
  }
}
const bs = (() => {
  let e = !1, t = !1;
  const n = typeof globalThis.ReadableStream == "function", r = typeof globalThis.Request == "function";
  if (n && r)
    try {
      t = new globalThis.Request("https://empty.invalid", {
        body: new globalThis.ReadableStream(),
        method: "POST",
        // @ts-expect-error - Types are outdated.
        get duplex() {
          return e = !0, "half";
        }
      }).headers.has("Content-Type");
    } catch (o) {
      if (o instanceof Error && o.message === "unsupported BodyInit type")
        return !1;
      throw o;
    }
  return e && !t;
})(), Gl = typeof globalThis.AbortController == "function", ec = typeof globalThis.AbortSignal == "function" && typeof globalThis.AbortSignal.any == "function", Kl = typeof globalThis.ReadableStream == "function", ql = typeof globalThis.FormData == "function", tc = ["get", "post", "put", "patch", "head", "delete"], Wl = {
  json: "application/json",
  text: "text/*",
  formData: "multipart/form-data",
  arrayBuffer: "*/*",
  blob: "*/*",
  // Supported in modern Fetch implementations (for example, browsers and recent Node.js/undici).
  // We still feature-check at runtime before exposing the shortcut.
  bytes: "*/*"
}, Ii = 2147483647, jl = new TextEncoder().encode("------WebKitFormBoundaryaxpyiPgbbPti10Rw").length, nc = Symbol("stop");
class rc {
  options;
  constructor(t) {
    this.options = t;
  }
}
const Yl = (e) => new rc(e), Xl = {
  json: !0,
  parseJson: !0,
  stringifyJson: !0,
  searchParams: !0,
  prefixUrl: !0,
  retry: !0,
  timeout: !0,
  hooks: !0,
  throwHttpErrors: !0,
  onDownloadProgress: !0,
  onUploadProgress: !0,
  fetch: !0,
  context: !0
}, Zl = {
  next: !0
  // Next.js cache revalidation (revalidate, tags)
}, Jl = {
  method: !0,
  headers: !0,
  body: !0,
  mode: !0,
  credentials: !0,
  cache: !0,
  redirect: !0,
  referrer: !0,
  referrerPolicy: !0,
  integrity: !0,
  keepalive: !0,
  signal: !0,
  window: !0,
  duplex: !0
}, Ql = (e) => {
  if (!e)
    return 0;
  if (e instanceof FormData) {
    let t = 0;
    for (const [n, r] of e)
      t += jl, t += new TextEncoder().encode(`Content-Disposition: form-data; name="${n}"`).length, t += typeof r == "string" ? new TextEncoder().encode(r).length : r.size;
    return t;
  }
  if (e instanceof Blob)
    return e.size;
  if (e instanceof ArrayBuffer)
    return e.byteLength;
  if (typeof e == "string")
    return new TextEncoder().encode(e).length;
  if (e instanceof URLSearchParams)
    return new TextEncoder().encode(e.toString()).length;
  if ("byteLength" in e)
    return e.byteLength;
  if (typeof e == "object" && e !== null)
    try {
      const t = JSON.stringify(e);
      return new TextEncoder().encode(t).length;
    } catch {
      return 0;
    }
  return 0;
}, ic = (e, t, n) => {
  let r, o = 0;
  return e.pipeThrough(new TransformStream({
    transform(i, s) {
      if (s.enqueue(i), r) {
        o += r.byteLength;
        let l = t === 0 ? 0 : o / t;
        l >= 1 && (l = 1 - Number.EPSILON), n?.({ percent: l, totalBytes: Math.max(t, o), transferredBytes: o }, r);
      }
      r = i;
    },
    flush() {
      r && (o += r.byteLength, n?.({ percent: 1, totalBytes: Math.max(t, o), transferredBytes: o }, r));
    }
  }));
}, ed = (e, t) => {
  if (!e.body)
    return e;
  if (e.status === 204)
    return new Response(null, {
      status: e.status,
      statusText: e.statusText,
      headers: e.headers
    });
  const n = Math.max(0, Number(e.headers.get("content-length")) || 0);
  return new Response(ic(e.body, n, t), {
    status: e.status,
    statusText: e.statusText,
    headers: e.headers
  });
}, td = (e, t, n) => {
  if (!e.body)
    return e;
  const r = Ql(n ?? e.body);
  return new Request(e, {
    // @ts-expect-error - Types are outdated.
    duplex: "half",
    body: ic(e.body, r, t)
  });
}, _n = (e) => e !== null && typeof e == "object", ur = (...e) => {
  for (const t of e)
    if ((!_n(t) || Array.isArray(t)) && t !== void 0)
      throw new TypeError("The `options` argument must be an object");
  return yo({}, ...e);
}, oc = (e = {}, t = {}) => {
  const n = new globalThis.Headers(e), r = t instanceof globalThis.Headers, o = new globalThis.Headers(t);
  for (const [i, s] of o.entries())
    r && s === "undefined" || s === void 0 ? n.delete(i) : n.set(i, s);
  return n;
};
function lr(e, t, n) {
  return Object.hasOwn(t, n) && t[n] === void 0 ? [] : yo(e[n] ?? [], t[n] ?? []);
}
const sc = (e = {}, t = {}) => ({
  beforeRequest: lr(e, t, "beforeRequest"),
  beforeRetry: lr(e, t, "beforeRetry"),
  afterResponse: lr(e, t, "afterResponse"),
  beforeError: lr(e, t, "beforeError")
}), nd = (e, t) => {
  const n = new URLSearchParams();
  for (const r of [e, t])
    if (r !== void 0)
      if (r instanceof URLSearchParams)
        for (const [o, i] of r.entries())
          n.append(o, i);
      else if (Array.isArray(r))
        for (const o of r) {
          if (!Array.isArray(o) || o.length !== 2)
            throw new TypeError("Array search parameters must be provided in [[key, value], ...] format");
          n.append(String(o[0]), String(o[1]));
        }
      else if (_n(r))
        for (const [o, i] of Object.entries(r))
          i !== void 0 && n.append(o, String(i));
      else {
        const o = new URLSearchParams(r);
        for (const [i, s] of o.entries())
          n.append(i, s);
      }
  return n;
}, yo = (...e) => {
  let t = {}, n = {}, r = {}, o;
  const i = [];
  for (const s of e)
    if (Array.isArray(s))
      Array.isArray(t) || (t = []), t = [...t, ...s];
    else if (_n(s)) {
      for (let [l, f] of Object.entries(s)) {
        if (l === "signal" && f instanceof globalThis.AbortSignal) {
          i.push(f);
          continue;
        }
        if (l === "context") {
          if (f != null && (!_n(f) || Array.isArray(f)))
            throw new TypeError("The `context` option must be an object");
          t = {
            ...t,
            context: f == null ? {} : { ...t.context, ...f }
          };
          continue;
        }
        if (l === "searchParams") {
          f == null ? o = void 0 : o = o === void 0 ? f : nd(o, f);
          continue;
        }
        _n(f) && l in t && (f = yo(t[l], f)), t = { ...t, [l]: f };
      }
      _n(s.hooks) && (r = sc(r, s.hooks), t.hooks = r), _n(s.headers) && (n = oc(n, s.headers), t.headers = n);
    }
  return o !== void 0 && (t.searchParams = o), i.length > 0 && (i.length === 1 ? t.signal = i[0] : ec ? t.signal = AbortSignal.any(i) : t.signal = i.at(-1)), t.context === void 0 && (t.context = {}), t;
}, rd = (e) => tc.includes(e) ? e.toUpperCase() : e, id = ["get", "put", "head", "delete", "options", "trace"], od = [408, 413, 429, 500, 502, 503, 504], sd = [413, 429, 503], Cs = {
  limit: 2,
  methods: id,
  statusCodes: od,
  afterStatusCodes: sd,
  maxRetryAfter: Number.POSITIVE_INFINITY,
  backoffLimit: Number.POSITIVE_INFINITY,
  delay: (e) => 0.3 * 2 ** (e - 1) * 1e3,
  jitter: void 0,
  retryOnTimeout: !1
}, ad = (e = {}) => {
  if (typeof e == "number")
    return {
      ...Cs,
      limit: e
    };
  if (e.methods && !Array.isArray(e.methods))
    throw new Error("retry.methods must be an array");
  if (e.statusCodes && !Array.isArray(e.statusCodes))
    throw new Error("retry.statusCodes must be an array");
  return {
    ...Cs,
    ...e
  };
};
class oo extends Error {
  request;
  constructor(t) {
    super(`Request timed out: ${t.method} ${t.url}`), this.name = "TimeoutError", this.request = t;
  }
}
async function cd(e, t, n, r) {
  return new Promise((o, i) => {
    const s = setTimeout(() => {
      n && n.abort(), i(new oo(e));
    }, r.timeout);
    r.fetch(e, t).then(o).catch(i).then(() => {
      clearTimeout(s);
    });
  });
}
async function ud(e, { signal: t }) {
  return new Promise((n, r) => {
    t && (t.throwIfAborted(), t.addEventListener("abort", o, { once: !0 }));
    function o() {
      clearTimeout(i), r(t.reason);
    }
    const i = setTimeout(() => {
      t?.removeEventListener("abort", o), n();
    }, e);
  });
}
const ld = (e, t) => {
  const n = {};
  for (const r in t)
    Object.hasOwn(t, r) && !(r in Jl) && !(r in Xl) && (!(r in e) || r in Zl) && (n[r] = t[r]);
  return n;
}, dd = (e) => e === void 0 ? !1 : Array.isArray(e) ? e.length > 0 : e instanceof URLSearchParams ? e.size > 0 : typeof e == "object" ? Object.keys(e).length > 0 : typeof e == "string" ? e.trim().length > 0 : !!e;
function fd(e) {
  return e instanceof io || e?.name === io.name;
}
function hd(e) {
  return e instanceof oo || e?.name === oo.name;
}
class Yn {
  static create(t, n) {
    const r = new Yn(t, n), o = async () => {
      if (typeof r.#e.timeout == "number" && r.#e.timeout > Ii)
        throw new RangeError(`The \`timeout\` option cannot be greater than ${Ii}`);
      await Promise.resolve();
      let s = await r.#R();
      for (const l of r.#e.hooks.afterResponse) {
        const f = r.#l(s.clone()), m = await l(r.request, r.#a(), f, { retryCount: r.#n });
        if (m instanceof globalThis.Response && (s = m), m instanceof rc)
          throw await Promise.all([
            f.body?.cancel(),
            s.body?.cancel()
          ]), new Ti(m.options);
      }
      if (r.#l(s), !s.ok && (typeof r.#e.throwHttpErrors == "function" ? r.#e.throwHttpErrors(s.status) : r.#e.throwHttpErrors)) {
        let l = new io(s, r.request, r.#a());
        for (const f of r.#e.hooks.beforeError)
          l = await f(l, { retryCount: r.#n });
        throw l;
      }
      if (r.#e.onDownloadProgress) {
        if (typeof r.#e.onDownloadProgress != "function")
          throw new TypeError("The `onDownloadProgress` option must be a function");
        if (!Kl)
          throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
        return ed(s.clone(), r.#e.onDownloadProgress);
      }
      return s;
    }, i = r.#d(o).finally(async () => {
      const s = r.#o, l = [];
      s && !s.bodyUsed && l.push(s.body?.cancel()), r.request.bodyUsed || l.push(r.request.body?.cancel()), await Promise.all(l);
    });
    for (const [s, l] of Object.entries(Wl))
      s === "bytes" && typeof globalThis.Response?.prototype?.bytes != "function" || (i[s] = async () => {
        r.request.headers.set("accept", r.request.headers.get("accept") || l);
        const f = await i;
        if (s === "json") {
          if (f.status === 204)
            return "";
          const m = await f.text();
          return m === "" ? "" : n.parseJson ? n.parseJson(m) : JSON.parse(m);
        }
        return f[s]();
      });
    return i;
  }
  // eslint-disable-next-line unicorn/prevent-abbreviations
  static #h(t) {
    return t && typeof t == "object" && !Array.isArray(t) && !(t instanceof URLSearchParams) ? Object.fromEntries(Object.entries(t).filter(([, n]) => n !== void 0)) : t;
  }
  request;
  #r;
  #n = 0;
  // eslint-disable-next-line @typescript-eslint/prefer-readonly -- False positive: #input is reassigned on line 202
  #t;
  #e;
  #o;
  #i;
  #s;
  // eslint-disable-next-line complexity
  constructor(t, n = {}) {
    if (this.#t = t, this.#e = {
      ...n,
      headers: oc(this.#t.headers, n.headers),
      hooks: sc({
        beforeRequest: [],
        beforeRetry: [],
        beforeError: [],
        afterResponse: []
      }, n.hooks),
      method: rd(n.method ?? this.#t.method ?? "GET"),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      prefixUrl: String(n.prefixUrl || ""),
      retry: ad(n.retry),
      throwHttpErrors: n.throwHttpErrors ?? !0,
      timeout: n.timeout ?? 1e4,
      fetch: n.fetch ?? globalThis.fetch.bind(globalThis),
      context: n.context ?? {}
    }, typeof this.#t != "string" && !(this.#t instanceof URL || this.#t instanceof globalThis.Request))
      throw new TypeError("`input` must be a string, URL, or Request");
    if (this.#e.prefixUrl && typeof this.#t == "string") {
      if (this.#t.startsWith("/"))
        throw new Error("`input` must not begin with a slash when using `prefixUrl`");
      this.#e.prefixUrl.endsWith("/") || (this.#e.prefixUrl += "/"), this.#t = this.#e.prefixUrl + this.#t;
    }
    Gl && ec && (this.#i = this.#e.signal ?? this.#t.signal, this.#r = new globalThis.AbortController(), this.#e.signal = this.#i ? AbortSignal.any([this.#i, this.#r.signal]) : this.#r.signal), bs && (this.#e.duplex = "half"), this.#e.json !== void 0 && (this.#e.body = this.#e.stringifyJson?.(this.#e.json) ?? JSON.stringify(this.#e.json), this.#e.headers.set("content-type", this.#e.headers.get("content-type") ?? "application/json"));
    const r = n.headers && new globalThis.Headers(n.headers).has("content-type");
    if (this.#t instanceof globalThis.Request && (ql && this.#e.body instanceof globalThis.FormData || this.#e.body instanceof URLSearchParams) && !r && this.#e.headers.delete("content-type"), this.request = new globalThis.Request(this.#t, this.#e), dd(this.#e.searchParams)) {
      const i = "?" + (typeof this.#e.searchParams == "string" ? this.#e.searchParams.replace(/^\?/, "") : new URLSearchParams(Yn.#h(this.#e.searchParams)).toString()), s = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, i);
      this.request = new globalThis.Request(s, this.#e);
    }
    if (this.#e.onUploadProgress) {
      if (typeof this.#e.onUploadProgress != "function")
        throw new TypeError("The `onUploadProgress` option must be a function");
      if (!bs)
        throw new Error("Request streams are not supported in your environment. The `duplex` option for `Request` is not available.");
      this.request = this.#f(this.request, this.#e.body ?? void 0);
    }
  }
  #c() {
    const t = this.#e.retry.delay(this.#n);
    let n = t;
    return this.#e.retry.jitter === !0 ? n = Math.random() * t : typeof this.#e.retry.jitter == "function" && (n = this.#e.retry.jitter(t), (!Number.isFinite(n) || n < 0) && (n = t)), Math.min(this.#e.retry.backoffLimit, n);
  }
  async #_(t) {
    if (this.#n++, this.#n > this.#e.retry.limit)
      throw t;
    const n = t instanceof Error ? t : new Qa(t);
    if (n instanceof Ti)
      return n.customDelay ?? this.#c();
    if (!this.#e.retry.methods.includes(this.request.method.toLowerCase()))
      throw t;
    if (this.#e.retry.shouldRetry !== void 0) {
      const r = await this.#e.retry.shouldRetry({ error: n, retryCount: this.#n });
      if (r === !1)
        throw t;
      if (r === !0)
        return this.#c();
    }
    if (hd(t) && !this.#e.retry.retryOnTimeout)
      throw t;
    if (fd(t)) {
      if (!this.#e.retry.statusCodes.includes(t.response.status))
        throw t;
      const r = t.response.headers.get("Retry-After") ?? t.response.headers.get("RateLimit-Reset") ?? t.response.headers.get("X-RateLimit-Retry-After") ?? t.response.headers.get("X-RateLimit-Reset") ?? t.response.headers.get("X-Rate-Limit-Reset");
      if (r && this.#e.retry.afterStatusCodes.includes(t.response.status)) {
        let o = Number(r) * 1e3;
        Number.isNaN(o) ? o = Date.parse(r) - Date.now() : o >= Date.parse("2024-01-01") && (o -= Date.now());
        const i = this.#e.retry.maxRetryAfter ?? o;
        return o < i ? o : i;
      }
      if (t.response.status === 413)
        throw t;
    }
    return this.#c();
  }
  #l(t) {
    return this.#e.parseJson && (t.json = async () => this.#e.parseJson(await t.text())), t;
  }
  async #d(t) {
    try {
      return await t();
    } catch (n) {
      const r = Math.min(await this.#_(n), Ii);
      if (this.#n < 1)
        throw n;
      if (await ud(r, this.#i ? { signal: this.#i } : {}), n instanceof Ti && n.customRequest) {
        const o = this.#e.signal ? new globalThis.Request(n.customRequest, { signal: this.#e.signal }) : new globalThis.Request(n.customRequest);
        this.#u(o);
      }
      for (const o of this.#e.hooks.beforeRetry) {
        const i = await o({
          request: this.request,
          options: this.#a(),
          error: n,
          retryCount: this.#n
        });
        if (i instanceof globalThis.Request) {
          this.#u(i);
          break;
        }
        if (i instanceof globalThis.Response)
          return i;
        if (i === nc)
          return;
      }
      return this.#d(t);
    }
  }
  async #R() {
    this.#r?.signal.aborted && (this.#r = new globalThis.AbortController(), this.#e.signal = this.#i ? AbortSignal.any([this.#i, this.#r.signal]) : this.#r.signal, this.request = new globalThis.Request(this.request, { signal: this.#e.signal }));
    for (const n of this.#e.hooks.beforeRequest) {
      const r = await n(this.request, this.#a(), { retryCount: this.#n });
      if (r instanceof Response)
        return r;
      if (r instanceof globalThis.Request) {
        this.#u(r);
        break;
      }
    }
    const t = ld(this.request, this.#e);
    return this.#o = this.request, this.request = this.#o.clone(), this.#e.timeout === !1 ? this.#e.fetch(this.#o, t) : cd(this.#o, t, this.#r, this.#e);
  }
  #a() {
    if (!this.#s) {
      const { hooks: t, ...n } = this.#e;
      this.#s = Object.freeze(n);
    }
    return this.#s;
  }
  #u(t) {
    this.#s = void 0, this.request = this.#f(t);
  }
  #f(t, n) {
    return !this.#e.onUploadProgress || !t.body ? t : td(t, this.#e.onUploadProgress, n ?? this.#e.body ?? void 0);
  }
}
/*! MIT License © Sindre Sorhus */
const so = (e) => {
  const t = (n, r) => Yn.create(n, ur(e, r));
  for (const n of tc)
    t[n] = (r, o) => Yn.create(r, ur(e, o, { method: n }));
  return t.create = (n) => so(ur(n)), t.extend = (n) => (typeof n == "function" && (n = n(e ?? {})), so(ur(e, n))), t.stop = nc, t.retry = Yl, t;
}, _d = so(), Me = {
  ARBITRUM: "ARBITRUM_MAINNET",
  ARBITRUM_TESTNET: "ARBITRUM_TESTNET",
  AVALANCHE: "AVALANCHE_MAINNET",
  AVALANCHE_TESTNET: "AVALANCHE_TESTNET",
  BASE: "BASE_MAINNET",
  BASE_TESTNET: "BASE_TESTNET",
  BSC: "BSC_MAINNET",
  ETHEREUM: "ETHEREUM_MAINNET",
  ETHEREUM_TESTNET: "ETHEREUM_TESTNET",
  HYPEREVM: "HYPEREVM_MAINNET",
  LISK: "LISK_MAINNET",
  MONAD: "MONAD_MAINNET",
  MONAD_TESTNET: "MONAD_TESTNET",
  OPTIMISM: "OPTIMISM_MAINNET",
  OPTIMISM_TESTNET: "OPTIMISM_TESTNET",
  POLYGON: "POLYGON_MAINNET",
  SOLANA: "SOLANA_MAINNET",
  SOLANA_TESTNET: "SOLANA_TESTNET",
  STARKNET: "STARKNET_MAINNET",
  STARKNET_TESTNET: "STARKNET_TESTNET"
}, vT = {
  ARBITRUM: "ARBITRUM",
  ARBITRUM_TESTNET: "ARBITRUM_TESTNET",
  AVALANCHE: "AVALANCHE",
  AVALANCHE_TESTNET: "AVALANCHE_TESTNET",
  BASE: "BASE",
  BASE_TESTNET: "BASE_TESTNET",
  BSC: "BSC",
  ETHEREUM: "ETHEREUM",
  ETHEREUM_TESTNET: "ETHEREUM_TESTNET",
  HYPEREVM: "HYPEREVM",
  LISK: "LISK",
  MONAD: "MONAD",
  MONAD_TESTNET: "MONAD_TESTNET",
  OPTIMISM: "OPTIMISM",
  OPTIMISM_TESTNET: "OPTIMISM_TESTNET",
  POLYGON: "POLYGON",
  SOLANA: "SOLANA",
  SOLANA_TESTNET: "SOLANA_TESTNET",
  STARKNET: "STARKNET",
  STARKNET_TESTNET: "STARKNET_TESTNET"
};
function To(e, { strict: t = !0 } = {}) {
  return !e || typeof e != "string" ? !1 : t ? /^0x[0-9a-fA-F]*$/.test(e) : e.startsWith("0x");
}
function Ls(e) {
  return To(e, { strict: !1 }) ? Math.ceil((e.length - 2) / 2) : e.length;
}
const ac = "2.43.4";
let wi = {
  getDocsUrl: ({ docsBaseUrl: e, docsPath: t = "", docsSlug: n }) => t ? `${e ?? "https://viem.sh"}${t}${n ? `#${n}` : ""}` : void 0,
  version: `viem@${ac}`
}, Qn = class ao extends Error {
  constructor(t, n = {}) {
    const r = n.cause instanceof ao ? n.cause.details : n.cause?.message ? n.cause.message : n.details, o = n.cause instanceof ao && n.cause.docsPath || n.docsPath, i = wi.getDocsUrl?.({ ...n, docsPath: o }), s = [
      t || "An error occurred.",
      "",
      ...n.metaMessages ? [...n.metaMessages, ""] : [],
      ...i ? [`Docs: ${i}`] : [],
      ...r ? [`Details: ${r}`] : [],
      ...wi.version ? [`Version: ${wi.version}`] : []
    ].join(`
`);
    super(s, n.cause ? { cause: n.cause } : void 0), Object.defineProperty(this, "details", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "docsPath", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "metaMessages", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "shortMessage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "version", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "BaseError"
    }), this.details = r, this.docsPath = o, this.metaMessages = n.metaMessages, this.name = n.name ?? this.name, this.shortMessage = t, this.version = ac;
  }
  walk(t) {
    return cc(this, t);
  }
};
function cc(e, t) {
  return t?.(e) ? e : e && typeof e == "object" && "cause" in e && e.cause !== void 0 ? cc(e.cause, t) : t ? null : e;
}
class uc extends Qn {
  constructor({ size: t, targetSize: n, type: r }) {
    super(`${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} size (${t}) exceeds padding size (${n}).`, { name: "SizeExceedsPaddingSizeError" });
  }
}
function Kr(e, { dir: t, size: n = 32 } = {}) {
  return typeof e == "string" ? Rd(e, { dir: t, size: n }) : Ed(e, { dir: t, size: n });
}
function Rd(e, { dir: t, size: n = 32 } = {}) {
  if (n === null)
    return e;
  const r = e.replace("0x", "");
  if (r.length > n * 2)
    throw new uc({
      size: Math.ceil(r.length / 2),
      targetSize: n,
      type: "hex"
    });
  return `0x${r[t === "right" ? "padEnd" : "padStart"](n * 2, "0")}`;
}
function Ed(e, { dir: t, size: n = 32 } = {}) {
  if (n === null)
    return e;
  if (e.length > n)
    throw new uc({
      size: e.length,
      targetSize: n,
      type: "bytes"
    });
  const r = new Uint8Array(n);
  for (let o = 0; o < n; o++) {
    const i = t === "right";
    r[i ? o : n - o - 1] = e[i ? o : e.length - o - 1];
  }
  return r;
}
class pd extends Qn {
  constructor({ max: t, min: n, signed: r, size: o, value: i }) {
    super(`Number "${i}" is not in safe ${o ? `${o * 8}-bit ${r ? "signed" : "unsigned"} ` : ""}integer range ${t ? `(${n} to ${t})` : `(above ${n})`}`, { name: "IntegerOutOfRangeError" });
  }
}
class Ad extends Qn {
  constructor({ givenSize: t, maxSize: n }) {
    super(`Size cannot exceed ${n} bytes. Given size: ${t} bytes.`, { name: "SizeOverflowError" });
  }
}
function Io(e, { size: t }) {
  if (Ls(e) > t)
    throw new Ad({
      givenSize: Ls(e),
      maxSize: t
    });
}
function gd(e, t = {}) {
  const { signed: n, size: r } = t, o = BigInt(e);
  let i;
  r ? n ? i = (1n << BigInt(r) * 8n - 1n) - 1n : i = 2n ** (BigInt(r) * 8n) - 1n : typeof e == "number" && (i = BigInt(Number.MAX_SAFE_INTEGER));
  const s = typeof i == "bigint" && n ? -i - 1n : 0;
  if (i && o > i || o < s) {
    const f = typeof e == "bigint" ? "n" : "";
    throw new pd({
      max: i ? `${i}${f}` : void 0,
      min: `${s}${f}`,
      signed: n,
      size: r,
      value: `${e}${f}`
    });
  }
  const l = `0x${(n && o < 0 ? (1n << BigInt(r * 8)) + BigInt(o) : o).toString(16)}`;
  return r ? Kr(l, { size: r }) : l;
}
const md = /* @__PURE__ */ new TextEncoder();
function Od(e, t = {}) {
  return typeof e == "number" || typeof e == "bigint" ? Nd(e, t) : typeof e == "boolean" ? Sd(e, t) : To(e) ? lc(e, t) : dc(e, t);
}
function Sd(e, t = {}) {
  const n = new Uint8Array(1);
  return n[0] = Number(e), typeof t.size == "number" ? (Io(n, { size: t.size }), Kr(n, { size: t.size })) : n;
}
const Vt = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function xs(e) {
  if (e >= Vt.zero && e <= Vt.nine)
    return e - Vt.zero;
  if (e >= Vt.A && e <= Vt.F)
    return e - (Vt.A - 10);
  if (e >= Vt.a && e <= Vt.f)
    return e - (Vt.a - 10);
}
function lc(e, t = {}) {
  let n = e;
  t.size && (Io(n, { size: t.size }), n = Kr(n, { dir: "right", size: t.size }));
  let r = n.slice(2);
  r.length % 2 && (r = `0${r}`);
  const o = r.length / 2, i = new Uint8Array(o);
  for (let s = 0, l = 0; s < o; s++) {
    const f = xs(r.charCodeAt(l++)), m = xs(r.charCodeAt(l++));
    if (f === void 0 || m === void 0)
      throw new Qn(`Invalid byte sequence ("${r[l - 2]}${r[l - 1]}" in "${r}").`);
    i[s] = f * 16 + m;
  }
  return i;
}
function Nd(e, t) {
  const n = gd(e, t);
  return lc(n);
}
function dc(e, t = {}) {
  const n = md.encode(e);
  return typeof t.size == "number" ? (Io(n, { size: t.size }), Kr(n, { dir: "right", size: t.size })) : n;
}
const dr = /* @__PURE__ */ BigInt(2 ** 32 - 1), Us = /* @__PURE__ */ BigInt(32);
function yd(e, t = !1) {
  return t ? { h: Number(e & dr), l: Number(e >> Us & dr) } : { h: Number(e >> Us & dr) | 0, l: Number(e & dr) | 0 };
}
function Td(e, t = !1) {
  const n = e.length;
  let r = new Uint32Array(n), o = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: s, l } = yd(e[i], t);
    [r[i], o[i]] = [s, l];
  }
  return [r, o];
}
const Id = (e, t, n) => e << n | t >>> 32 - n, wd = (e, t, n) => t << n | e >>> 32 - n, vd = (e, t, n) => t << n - 32 | e >>> 64 - n, bd = (e, t, n) => e << n - 32 | t >>> 64 - n;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Cd(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Ds(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Ir(e, ...t) {
  if (!Cd(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Ms(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ld(e, t) {
  Ir(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function xd(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function fc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
const Ud = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Dd(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
function Md(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = Dd(e[t]);
  return e;
}
const Bs = Ud ? (e) => e : Md;
function Bd(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function hc(e) {
  return typeof e == "string" && (e = Bd(e)), Ir(e), e;
}
class Pd {
}
function $d(e) {
  const t = (r) => e().update(hc(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
const kd = BigInt(0), zn = BigInt(1), Fd = BigInt(2), zd = BigInt(7), Vd = BigInt(256), Hd = BigInt(113), _c = [], Rc = [], Ec = [];
for (let e = 0, t = zn, n = 1, r = 0; e < 24; e++) {
  [n, r] = [r, (2 * n + 3 * r) % 5], _c.push(2 * (5 * r + n)), Rc.push((e + 1) * (e + 2) / 2 % 64);
  let o = kd;
  for (let i = 0; i < 7; i++)
    t = (t << zn ^ (t >> zd) * Hd) % Vd, t & Fd && (o ^= zn << (zn << /* @__PURE__ */ BigInt(i)) - zn);
  Ec.push(o);
}
const pc = Td(Ec, !0), Gd = pc[0], Kd = pc[1], Ps = (e, t, n) => n > 32 ? vd(e, t, n) : Id(e, t, n), $s = (e, t, n) => n > 32 ? bd(e, t, n) : wd(e, t, n);
function qd(e, t = 24) {
  const n = new Uint32Array(10);
  for (let r = 24 - t; r < 24; r++) {
    for (let s = 0; s < 10; s++)
      n[s] = e[s] ^ e[s + 10] ^ e[s + 20] ^ e[s + 30] ^ e[s + 40];
    for (let s = 0; s < 10; s += 2) {
      const l = (s + 8) % 10, f = (s + 2) % 10, m = n[f], y = n[f + 1], C = Ps(m, y, 1) ^ n[l], D = $s(m, y, 1) ^ n[l + 1];
      for (let v = 0; v < 50; v += 10)
        e[s + v] ^= C, e[s + v + 1] ^= D;
    }
    let o = e[2], i = e[3];
    for (let s = 0; s < 24; s++) {
      const l = Rc[s], f = Ps(o, i, l), m = $s(o, i, l), y = _c[s];
      o = e[y], i = e[y + 1], e[y] = f, e[y + 1] = m;
    }
    for (let s = 0; s < 50; s += 10) {
      for (let l = 0; l < 10; l++)
        n[l] = e[s + l];
      for (let l = 0; l < 10; l++)
        e[s + l] ^= ~n[(l + 2) % 10] & n[(l + 4) % 10];
    }
    e[0] ^= Gd[r], e[1] ^= Kd[r];
  }
  fc(n);
}
class wo extends Pd {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(t, n, r, o = !1, i = 24) {
    if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = t, this.suffix = n, this.outputLen = r, this.enableXOF = o, this.rounds = i, Ds(r), !(0 < t && t < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200), this.state32 = xd(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    Bs(this.state32), qd(this.state32, this.rounds), Bs(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(t) {
    Ms(this), t = hc(t), Ir(t);
    const { blockLen: n, state: r } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const s = Math.min(n - this.pos, o - i);
      for (let l = 0; l < s; l++)
        r[this.pos++] ^= t[i++];
      this.pos === n && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: t, suffix: n, pos: r, blockLen: o } = this;
    t[r] ^= n, (n & 128) !== 0 && r === o - 1 && this.keccak(), t[o - 1] ^= 128, this.keccak();
  }
  writeInto(t) {
    Ms(this, !1), Ir(t), this.finish();
    const n = this.state, { blockLen: r } = this;
    for (let o = 0, i = t.length; o < i; ) {
      this.posOut >= r && this.keccak();
      const s = Math.min(r - this.posOut, i - o);
      t.set(n.subarray(this.posOut, this.posOut + s), o), this.posOut += s, o += s;
    }
    return t;
  }
  xofInto(t) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(t);
  }
  xof(t) {
    return Ds(t), this.xofInto(new Uint8Array(t));
  }
  digestInto(t) {
    if (Ld(t, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(t), this.destroy(), t;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, fc(this.state);
  }
  _cloneInto(t) {
    const { blockLen: n, suffix: r, outputLen: o, rounds: i, enableXOF: s } = this;
    return t || (t = new wo(n, r, o, s, i)), t.state32.set(this.state32), t.pos = this.pos, t.posOut = this.posOut, t.finished = this.finished, t.rounds = i, t.suffix = r, t.outputLen = o, t.enableXOF = s, t.destroyed = this.destroyed, t;
  }
}
const Wd = (e, t, n) => $d(() => new wo(t, e, n)), jd = Wd(1, 136, 256 / 8);
function Yd(e, t) {
  return jd(To(e, { strict: !1 }) ? Od(e) : e);
}
class Xd extends Qn {
  constructor({ address: t }) {
    super(`Address "${t}" is invalid.`, {
      metaMessages: [
        "- Address must be a hex value of 20 bytes (40 hex characters).",
        "- Address must match its checksum counterpart."
      ],
      name: "InvalidAddressError"
    });
  }
}
class Ac extends Map {
  constructor(t) {
    super(), Object.defineProperty(this, "maxSize", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.maxSize = t;
  }
  get(t) {
    const n = super.get(t);
    return super.has(t) && n !== void 0 && (this.delete(t), super.set(t, n)), n;
  }
  set(t, n) {
    if (super.set(t, n), this.maxSize && this.size > this.maxSize) {
      const r = this.keys().next().value;
      r && this.delete(r);
    }
    return this;
  }
}
const vi = /* @__PURE__ */ new Ac(8192);
function gc(e, t) {
  if (vi.has(`${e}.${t}`))
    return vi.get(`${e}.${t}`);
  const n = e.substring(2).toLowerCase(), r = Yd(dc(n)), o = n.split("");
  for (let s = 0; s < 40; s += 2)
    r[s >> 1] >> 4 >= 8 && o[s] && (o[s] = o[s].toUpperCase()), (r[s >> 1] & 15) >= 8 && o[s + 1] && (o[s + 1] = o[s + 1].toUpperCase());
  const i = `0x${o.join("")}`;
  return vi.set(`${e}.${t}`, i), i;
}
function dt(e, t) {
  if (!Jd(e, { strict: !1 }))
    throw new Xd({ address: e });
  return gc(e, t);
}
const Zd = /^0x[a-fA-F0-9]{40}$/, bi = /* @__PURE__ */ new Ac(8192);
function Jd(e, t) {
  const { strict: n = !0 } = t ?? {}, r = `${e}.${n}`;
  if (bi.has(r))
    return bi.get(r);
  const o = Zd.test(e) ? e.toLowerCase() === e ? !0 : n ? gc(e) === e : !0 : !1;
  return bi.set(r, o), o;
}
const Z = {
  USDC: "USDC",
  USDT: "USDT",
  DAI: "DAI",
  BUSD: "BUSD",
  EURC: "EURC",
  ETH: "ETH",
  WETH: "WETH",
  STRK: "STRK",
  BNB: "BNB",
  LORDS: "LORDS"
};
Z.USDC;
const mc = {
  [Me.ARBITRUM]: {
    [Z.DAI]: {
      address: dt("0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"),
      symbol: Z.DAI,
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/dai_bsokf4.png",
      nativeToken: !1
    },
    [Z.ETH]: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: Z.ETH,
      name: "Ethereum",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087942/ethereum_iyciq3.svg",
      nativeToken: !0
    },
    [Z.USDC]: {
      address: dt("0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    },
    [Z.USDT]: {
      address: dt("0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"),
      symbol: Z.USDT,
      name: "Tether USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdt_gtwbg4.png",
      nativeToken: !1
    },
    [Z.WETH]: {
      address: dt("0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"),
      symbol: Z.WETH,
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087897/weth_ndqdae.png",
      nativeToken: !1
    }
  },
  [Me.ARBITRUM_TESTNET]: {
    [Z.USDC]: {
      address: dt("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"),
      symbol: Z.USDC,
      name: "USD Coin",
      fiatISO: "USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.AVALANCHE]: {
    [Z.DAI]: {
      address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      symbol: Z.DAI,
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/dai_bsokf4.png",
      nativeToken: !1
    },
    [Z.USDC]: {
      address: dt("0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"),
      symbol: Z.USDC,
      name: "USD Coin",
      fiatISO: "USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    },
    [Z.USDT]: {
      address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      symbol: Z.USDT,
      name: "Tether USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdt_gtwbg4.png",
      nativeToken: !1
    },
    [Z.WETH]: {
      address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      symbol: Z.WETH,
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087897/weth_ndqdae.png",
      nativeToken: !1
    }
  },
  [Me.AVALANCHE_TESTNET]: {
    [Z.USDC]: {
      address: dt("0x5425890298aed601595a70AB815c96711a31Bc65"),
      symbol: Z.USDC,
      name: "USD Coin",
      fiatISO: "USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.BASE]: {
    [Z.DAI]: {
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      symbol: Z.DAI,
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/dai_bsokf4.png",
      nativeToken: !1
    },
    [Z.ETH]: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: Z.ETH,
      name: "Ethereum",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087942/ethereum_iyciq3.svg",
      nativeToken: !0
    },
    [Z.EURC]: {
      address: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
      symbol: Z.EURC,
      name: "Euro Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/eurc_strgsy.png",
      nativeToken: !1
    },
    [Z.USDC]: {
      address: dt("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
      symbol: Z.USDC,
      name: "USD Coin",
      fiatISO: "USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    },
    [Z.WETH]: {
      address: dt("0x4200000000000000000000000000000000000006"),
      symbol: Z.WETH,
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087897/weth_ndqdae.png",
      nativeToken: !1
    }
  },
  [Me.BASE_TESTNET]: {
    [Z.USDC]: {
      address: dt("0x036CbD53842c5426634e7929541eC2318f3dCF7e"),
      symbol: Z.USDC,
      name: "USD Coin",
      fiatISO: "USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.BSC]: {
    [Z.BNB]: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: Z.BNB,
      name: "BNB",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087942/bsc_k1jm6z.webp",
      nativeToken: !0
    },
    [Z.BUSD]: {
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      symbol: Z.BUSD,
      name: "Binance USD",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/busd_lvorsz.png",
      nativeToken: !1
    },
    [Z.DAI]: {
      address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
      symbol: Z.DAI,
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/dai_bsokf4.png",
      nativeToken: !1
    },
    [Z.ETH]: {
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      symbol: Z.ETH,
      name: "Ethereum",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087942/ethereum_iyciq3.svg",
      nativeToken: !1
    },
    [Z.USDC]: {
      address: dt("0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"),
      symbol: Z.USDC,
      decimals: 18,
      name: "USD Coin",
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    },
    [Z.USDT]: {
      address: "0x55d398326f99059fF775485246999027B3197955",
      symbol: Z.USDT,
      name: "Tether USD",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdt_gtwbg4.png",
      nativeToken: !1
    }
  },
  [Me.ETHEREUM]: {
    [Z.BUSD]: {
      address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      symbol: Z.BUSD,
      name: "Binance USD",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/busd_lvorsz.png",
      nativeToken: !1
    },
    [Z.DAI]: {
      address: dt("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
      symbol: Z.DAI,
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/dai_bsokf4.png",
      nativeToken: !1
    },
    [Z.ETH]: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: Z.ETH,
      name: "Ethereum",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087942/ethereum_iyciq3.svg",
      nativeToken: !0
    },
    [Z.EURC]: {
      address: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
      symbol: Z.EURC,
      name: "Euro Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/eurc_strgsy.png",
      nativeToken: !1
    },
    [Z.STRK]: {
      address: "0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766",
      symbol: Z.STRK,
      name: "Starknet Token",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087943/starknet_ltvror.svg",
      nativeToken: !1
    },
    [Z.USDC]: {
      address: dt("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    },
    [Z.USDT]: {
      address: dt("0xdAC17F958D2ee523a2206206994597C13D831ec7"),
      symbol: Z.USDT,
      name: "Tether USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdt_gtwbg4.png",
      nativeToken: !1
    },
    [Z.WETH]: {
      address: dt("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
      symbol: Z.WETH,
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087897/weth_ndqdae.png",
      nativeToken: !1
    }
  },
  [Me.ETHEREUM_TESTNET]: {
    [Z.USDC]: {
      address: dt("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"),
      symbol: Z.USDC,
      decimals: 6,
      name: "USD Coin",
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.HYPEREVM]: {
    [Z.USDC]: {
      address: "0xb88339CB7199b77E23DB6E890353E22632Ba630f",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.LISK]: {
    [Z.USDC]: {
      address: "0xF242275d3a6527d877f2c927a82D9b057609cc71",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.MONAD]: {
    [Z.USDC]: {
      address: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.MONAD_TESTNET]: {
    [Z.USDC]: {
      address: "0x534b2f3A21130d7a60830c2Df862319e593943A3",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.OPTIMISM]: {
    [Z.DAI]: {
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      symbol: Z.DAI,
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/dai_bsokf4.png",
      nativeToken: !1
    },
    [Z.ETH]: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: Z.ETH,
      name: "Ethereum",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087942/ethereum_iyciq3.svg",
      nativeToken: !0
    },
    [Z.USDC]: {
      address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    },
    [Z.USDT]: {
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      symbol: Z.USDT,
      name: "Tether USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdt_gtwbg4.png",
      nativeToken: !1
    },
    [Z.WETH]: {
      address: "0x4200000000000000000000000000000000000006",
      symbol: Z.WETH,
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087897/weth_ndqdae.png",
      nativeToken: !1
    }
  },
  [Me.OPTIMISM_TESTNET]: {
    [Z.USDC]: {
      address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.POLYGON]: {
    [Z.DAI]: {
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      symbol: Z.DAI,
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/dai_bsokf4.png",
      nativeToken: !1
    },
    [Z.USDC]: {
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    },
    [Z.USDT]: {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      symbol: Z.USDT,
      name: "Tether USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdt_gtwbg4.png",
      nativeToken: !1
    },
    [Z.WETH]: {
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      symbol: Z.WETH,
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087897/weth_ndqdae.png",
      nativeToken: !1
    }
  },
  [Me.SOLANA]: {
    [Z.USDC]: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.SOLANA_TESTNET]: {
    [Z.USDC]: {
      address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  },
  [Me.STARKNET]: {
    [Z.DAI]: {
      address: "0x05574eb6b8789a91466f902c380d978e472db68170ff82a5b650b95a58ddf4ad",
      symbol: Z.DAI,
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/dai_bsokf4.png",
      nativeToken: !1
    },
    [Z.ETH]: {
      address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      symbol: Z.ETH,
      name: "Ethereum",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087942/ethereum_iyciq3.svg",
      nativeToken: !1
    },
    [Z.LORDS]: {
      address: "0x0124aeb495b947201f5faC96fD1138E326AD86195B98df6DEc9009158A533B49",
      symbol: Z.LORDS,
      name: "LORDS Token",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/lords_tynrsj.png",
      nativeToken: !1
    },
    [Z.STRK]: {
      address: "0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D",
      symbol: Z.STRK,
      name: "Starknet Token",
      decimals: 18,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087943/starknet_ltvror.svg",
      nativeToken: !1
    },
    [Z.USDC]: {
      address: "0x033068F6539f8e6e6b131e6B2B814e6c34A5224bC66947c47DaB9dFeE93b35fb",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      logoSourceURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    },
    [Z.USDT]: {
      address: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
      symbol: Z.USDT,
      name: "Tether USD",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdt_gtwbg4.png",
      nativeToken: !1
    }
  },
  [Me.STARKNET_TESTNET]: {
    [Z.USDC]: {
      address: "0x0512feAc6339Ff7889822cb5aA2a86C848e9D392bB0E3E237C008674feeD8343",
      symbol: Z.USDC,
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://res.cloudinary.com/dc3gdzgel/image/upload/v1772087896/usdc_rexec2.svg",
      nativeToken: !1
    }
  }
}, Qd = new Set(Object.values(Me));
function At(e) {
  if (ef(e))
    return e;
  const t = Me[e];
  if (!t)
    throw new Error(`Invalid chain: ${e}.`);
  return t;
}
function ef(e) {
  return Qd.has(e);
}
function tf(e, t) {
  const n = t.toLowerCase().trim(), r = mc[e];
  if (!r)
    throw new Error(
      `Chain not found: ${e}. The chain key must be a valid chain identifier.`
    );
  let o;
  for (const i in r) {
    const s = r[i];
    if (s && s.address.toLowerCase() === n.toLowerCase()) {
      o = s;
      break;
    }
  }
  if (!o)
    throw new Error(
      `Token address mismatch: address ${t} does not exist on chain ${e}. The token address must be a valid token address on the specified chain.`
    );
  return o;
}
function Ci(e, t, n) {
  const r = tf(e, t);
  if (r.symbol !== n)
    throw new Error(
      `Token address and symbol mismatch: address ${t} on chain ${e} corresponds to token "${r.symbol}", but expected "${n}". The token address must correspond to a token with the expected symbol on the specified chain.`
    );
  return r;
}
function nf(e, t) {
  return mc[e]?.[t];
}
function ks(e, t) {
  return nf(e, t)?.address;
}
var vo = /* @__PURE__ */ ((e) => (e.PRODUCTION = "production", e.STAGING = "staging", e))(vo || {});
class Oe {
  constructor({ api_key: t, env: n, seesion_token: r, props: o }) {
    this.api_key = t || "", this.sessionToken = r || "", this.env = n ?? vo.PRODUCTION, this.props = o;
  }
  static async config(t) {
    if (!Oe.app) {
      if (!t)
        throw new Error("Please provide an api_key");
      Oe.app = new Oe(t);
    }
    return t && (t.api_key !== void 0 && (Oe.app.api_key = t.api_key), t.seesion_token !== void 0 && (Oe.app.sessionToken = t.seesion_token), t.env !== void 0 && (Oe.app.env = t.env), t.props !== void 0 && (Oe.app.props = t.props)), Oe.app;
  }
  static getApiKey() {
    if (!Oe.app)
      throw new Error("Chainrails SDK not configured. Please call Chainrails.config() first.");
    return Oe.app.api_key;
  }
  static getSessionToken() {
    if (!Oe.app)
      throw new Error("Chainrails SDK not configured. Please call Chainrails.config() first.");
    return Oe.app.sessionToken;
  }
  static getProps() {
    if (!Oe.app)
      throw new Error("Chainrails SDK not configured. Please call Chainrails.config() first.");
    return Oe.app.props;
  }
  static getEnv() {
    if (!Oe.app)
      throw new Error("Chainrails SDK not configured. Please call Chainrails.config() first.");
    return Oe.app.env === "internal" ? "staging" : Oe.app.env;
  }
  static getBaseUrl() {
    if (!Oe.app)
      throw new Error("Chainrails SDK not configured. Please call Chainrails.config() first.");
    switch (Oe.app.env) {
      case "production":
        return "https://api.chainrails.io/api/v1";
      case "staging":
        return "https://dev.chainrails.io/api/v1";
      case "internal":
        return "https://dev.chainrails.io/api/v1";
      default:
        return "https://api.chainrails.io/api/v1";
    }
  }
  static getPayModalUrl(t) {
    if (!Oe.app)
      throw new Error("Chainrails SDK not configured. Please call Chainrails.config() first.");
    const n = Oe.app.env === "internal" ? "https://staging.chainrails-frontend.pages.dev" : "https://app.chainrails.io", r = Number(t), o = t && !isNaN(Number(t)) && r > 0 ? "/pay/" : "/deposit/", i = `${t && !isNaN(Number(t)) && r > 0 ? r * 100 : ""}`;
    return n + o + i;
  }
}
let co = null;
function rf() {
  co = _d.create({
    prefixUrl: Oe.getBaseUrl(),
    headers: {
      "Content-Type": "application/json"
    },
    hooks: {
      beforeRequest: [
        (e) => {
          const t = Oe.getSessionToken() || Oe.getApiKey();
          e.headers.set("Authorization", `Bearer ${t}`);
        }
      ],
      afterResponse: [(e, t, n) => n]
    },
    retry: {
      limit: 2
    }
  });
}
function he() {
  return co || rf(), co;
}
class of {
  async getById(t) {
    return await he().get("intents/" + t).json();
  }
  async getForSender(t) {
    return await he().get("intents/user/" + t).json();
  }
  async getForAddress(t) {
    return await he().get("intents/address/" + t).json();
  }
  async getForSession(t) {
    return await he().get("modal/sessions/intents/" + t).json();
  }
  async getAll(t) {
    return await he().get("intents", { searchParams: t }).json();
  }
  async create(t) {
    const n = At(t.source_chain), r = At(t.destination_chain);
    return await he().post("intents", {
      json: {
        ...t,
        source_chain: n,
        destination_chain: r
      }
    }).json();
  }
  async createForSession(t) {
    const n = At(t.sourceChain);
    return await he().post("modal/sessions/intents", {
      json: { ...t, sourceChain: n }
    }).json();
  }
  async update(t, n) {
    return await he().post("intents", { json: n }).json();
  }
  async triggerProcessing(t) {
    return await he().post(`intents/${t}/trigger-processing`).json();
  }
  async triggerProcessingForSession(t) {
    return await he().post(`modal/sessions/intents/${t}/process`).json();
  }
}
class sf {
  async getFromSpecificBridge(t) {
    const n = At(t.sourceChain);
    Ci(n, t.tokenIn, t.amountSymbol);
    const r = At(t.destinationChain);
    return await he().get("quotes/single", {
      searchParams: {
        ...t,
        sourceChain: n,
        destinationChain: r
      }
    }).json();
  }
  async getFromAllBridges(t) {
    const n = At(t.sourceChain);
    Ci(n, t.tokenIn, t.amountSymbol);
    const r = At(t.destinationChain);
    return await he().get("quotes/multiple", {
      searchParams: {
        ...t,
        sourceChain: n,
        destinationChain: r
      }
    }).json();
  }
  async getBestAcrossBridges(t) {
    const n = At(t.sourceChain);
    Ci(n, t.tokenIn, t.amountSymbol);
    const r = At(t.destinationChain);
    return await he().get("quotes/best", { searchParams: {
      ...t,
      sourceChain: n,
      destinationChain: r
    } }).json();
  }
  async getAll(t) {
    const n = At(t.destinationChain);
    return await he().get("quotes/multi-source", { searchParams: {
      ...t,
      destinationChain: n
    } }).json();
  }
  async getAllForSession(t) {
    return await he().get("modal/sessions/quotes", { searchParams: t }).json();
  }
}
class af {
  async getOptimalRoutes(t) {
    const n = At(t.sourceChain), r = At(t.destinationChain);
    return await he().get("router/optimal-route", {
      searchParams: {
        ...t,
        sourceChain: n,
        destinationChain: r
      }
    }).json();
  }
  async getAllSupportedBridges() {
    return await he().get("router/supported-bridges/all").json();
  }
  async getSupportedBridges(t) {
    const n = At(t.sourceChain), r = At(t.destinationChain);
    return await he().get("router/supported-bridges/route", { searchParams: {
      ...t,
      sourceChain: n,
      destinationChain: r
    } }).json();
  }
  async getSupportedRoutes(t) {
    return await he().get("router/supported-routes/bridge/" + t).json();
  }
}
class cf {
  async getSupported(t) {
    return await he().get("chains", { searchParams: t }).json();
  }
  async getBalance(t) {
    return await he().get(`chains/balances/${t.address}`, { searchParams: t }).json();
  }
}
class uf {
  async getClientInfo() {
    return await he().get("client/auth/client-info").json();
  }
  async getClientInfoForSession() {
    return await he().get("modal/sessions/client").json();
  }
}
class lf {
  async getSessionToken(t) {
    const n = At(t.destinationChain);
    let r = ks(n, t.token);
    r || (console.error(
      `${t.token} on ${t.destinationChain} is currently unsupported, defaulting to usdc`
    ), r = ks(n, "USDC"));
    const o = {
      recipient: t.recipient,
      tokenOut: r,
      destinationChain: n,
      amount: t.amount
    };
    return he().post("modal/sessions", { json: o }).json().then((i) => ({ ...i, amount: o.amount }));
  }
  async getHandOffToken() {
    return he().post("modal/sessions/handoff-token").json();
  }
  async resumeSession(t) {
    return he().post(`modal/sessions/${t.sessionId}/resume`, { json: t }).json();
  }
}
const df = "modal/sessions/history";
class ff {
  async getHistoryForSession(t) {
    return he().post(df, { json: t }).json();
  }
}
class hf {
  /**
   * Get aggregated fiat-to-crypto quotes from all eligible providers.
   * Fans out to multiple providers and picks the cheapest path.
   */
  async getQuotes(t) {
    return await he().get("ramp/quotes", { searchParams: t }).json();
  }
  async getQuotesForSession(t) {
    return await he().get("modal/sessions/ramp/quotes", { searchParams: t }).json();
  }
  /**
   * Get all supported countries with currency details.
   * Use this as the primary discovery endpoint.
   */
  async getCountries(t) {
    return await he().get("ramp/countries", { searchParams: t }).json();
  }
  async getCountriesForSession(t) {
    return await he().get("modal/sessions/ramp/countries", { searchParams: t }).json();
  }
  /**
   * Get a deduplicated list of supported fiat currencies.
   * Useful for currency dropdowns.
   */
  async getCurrencies(t) {
    return await he().get("ramp/currencies", { searchParams: t }).json();
  }
  async getCurrenciesForSession(t) {
    return await he().get("modal/sessions/ramp/currencies", { searchParams: t }).json();
  }
  /**
   * Create a fiat-to-crypto order.
   * Returns a provider widget URL for the user to complete payment.
   */
  async createOrder(t) {
    return await he().post("ramp/orders", { json: t }).json();
  }
  async createOrderForSession(t) {
    return await he().post("modal/sessions/ramp/orders", { json: t }).json();
  }
  /**
   * Get an order by ID.
   */
  async getOrder(t) {
    return await he().get(`ramp/orders/${t}`).json();
  }
  async getOrderForSession(t) {
    return await he().get(`modal/sessions/ramp/orders/${t}`).json();
  }
  /**
   * Get an order by intent address.
   */
  async getOrderByIntent(t) {
    return await he().get(`ramp/orders/by-intent/${t}`).json();
  }
  /**
   * List all orders (newest first).
   */
  async listOrders(t) {
    return await he().get("ramp/orders", { searchParams: t }).json();
  }
  /**
   * Confirm an order after the user completes the deposit action.
   */
  async confirmOrder(t) {
    return await he().post(`ramp/orders/${t}/confirm`).json();
  }
  async confirmOrderForSession(t) {
    return await he().post(`modal/sessions/ramp/orders/${t}/confirm`).json();
  }
  /**
   * Cancel an order if it's still in a cancellable state.
   */
  async cancelOrder(t) {
    return await he().post(`ramp/orders/${t}/cancel`).json();
  }
}
const bT = {
  router: new af(),
  quotes: new sf(),
  intents: new of(),
  chains: new cf(),
  client: new uf(),
  auth: new lf(),
  history: new ff(),
  ramp: new hf()
}, _f = "seeker-098a1d68", ot = {
  CLOSED: "closed",
  COMPLETED: "completed",
  REQUEST_CONNECT: "cr:request-connect",
  REQUEST_DISCONNECT: "cr:request-disconnect",
  REQUEST_SEND_TRANSACTION: "cr:request-send-transaction",
  REQUEST_DEEP_LINK: "cr:request-deep-link",
  CONNECTED: "cr:connected",
  DISCONNECTED: "cr:disconnected",
  SEND_TRANSACTION_RESULT: "cr:send-transaction-result"
};
function bo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Co(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      var o = !1;
      try {
        o = this instanceof r;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var Li = {}, Vn = {}, Fs;
function Rf() {
  if (Fs) return Vn;
  Fs = 1, Vn.byteLength = l, Vn.toByteArray = m, Vn.fromByteArray = D;
  for (var e = [], t = [], n = typeof Uint8Array < "u" ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, i = r.length; o < i; ++o)
    e[o] = r[o], t[r.charCodeAt(o)] = o;
  t[45] = 62, t[95] = 63;
  function s(v) {
    var M = v.length;
    if (M % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var b = v.indexOf("=");
    b === -1 && (b = M);
    var x = b === M ? 0 : 4 - b % 4;
    return [b, x];
  }
  function l(v) {
    var M = s(v), b = M[0], x = M[1];
    return (b + x) * 3 / 4 - x;
  }
  function f(v, M, b) {
    return (M + b) * 3 / 4 - b;
  }
  function m(v) {
    var M, b = s(v), x = b[0], q = b[1], X = new n(f(v, x, q)), H = 0, $ = q > 0 ? x - 4 : x, K;
    for (K = 0; K < $; K += 4)
      M = t[v.charCodeAt(K)] << 18 | t[v.charCodeAt(K + 1)] << 12 | t[v.charCodeAt(K + 2)] << 6 | t[v.charCodeAt(K + 3)], X[H++] = M >> 16 & 255, X[H++] = M >> 8 & 255, X[H++] = M & 255;
    return q === 2 && (M = t[v.charCodeAt(K)] << 2 | t[v.charCodeAt(K + 1)] >> 4, X[H++] = M & 255), q === 1 && (M = t[v.charCodeAt(K)] << 10 | t[v.charCodeAt(K + 1)] << 4 | t[v.charCodeAt(K + 2)] >> 2, X[H++] = M >> 8 & 255, X[H++] = M & 255), X;
  }
  function y(v) {
    return e[v >> 18 & 63] + e[v >> 12 & 63] + e[v >> 6 & 63] + e[v & 63];
  }
  function C(v, M, b) {
    for (var x, q = [], X = M; X < b; X += 3)
      x = (v[X] << 16 & 16711680) + (v[X + 1] << 8 & 65280) + (v[X + 2] & 255), q.push(y(x));
    return q.join("");
  }
  function D(v) {
    for (var M, b = v.length, x = b % 3, q = [], X = 16383, H = 0, $ = b - x; H < $; H += X)
      q.push(C(v, H, H + X > $ ? $ : H + X));
    return x === 1 ? (M = v[b - 1], q.push(
      e[M >> 2] + e[M << 4 & 63] + "=="
    )) : x === 2 && (M = (v[b - 2] << 8) + v[b - 1], q.push(
      e[M >> 10] + e[M >> 4 & 63] + e[M << 2 & 63] + "="
    )), q.join("");
  }
  return Vn;
}
var fr = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var zs;
function Ef() {
  return zs || (zs = 1, fr.read = function(e, t, n, r, o) {
    var i, s, l = o * 8 - r - 1, f = (1 << l) - 1, m = f >> 1, y = -7, C = n ? o - 1 : 0, D = n ? -1 : 1, v = e[t + C];
    for (C += D, i = v & (1 << -y) - 1, v >>= -y, y += l; y > 0; i = i * 256 + e[t + C], C += D, y -= 8)
      ;
    for (s = i & (1 << -y) - 1, i >>= -y, y += r; y > 0; s = s * 256 + e[t + C], C += D, y -= 8)
      ;
    if (i === 0)
      i = 1 - m;
    else {
      if (i === f)
        return s ? NaN : (v ? -1 : 1) * (1 / 0);
      s = s + Math.pow(2, r), i = i - m;
    }
    return (v ? -1 : 1) * s * Math.pow(2, i - r);
  }, fr.write = function(e, t, n, r, o, i) {
    var s, l, f, m = i * 8 - o - 1, y = (1 << m) - 1, C = y >> 1, D = o === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, v = r ? 0 : i - 1, M = r ? 1 : -1, b = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (l = isNaN(t) ? 1 : 0, s = y) : (s = Math.floor(Math.log(t) / Math.LN2), t * (f = Math.pow(2, -s)) < 1 && (s--, f *= 2), s + C >= 1 ? t += D / f : t += D * Math.pow(2, 1 - C), t * f >= 2 && (s++, f /= 2), s + C >= y ? (l = 0, s = y) : s + C >= 1 ? (l = (t * f - 1) * Math.pow(2, o), s = s + C) : (l = t * Math.pow(2, C - 1) * Math.pow(2, o), s = 0)); o >= 8; e[n + v] = l & 255, v += M, l /= 256, o -= 8)
      ;
    for (s = s << o | l, m += o; m > 0; e[n + v] = s & 255, v += M, s /= 256, m -= 8)
      ;
    e[n + v - M] |= b * 128;
  }), fr;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Vs;
function Lo() {
  return Vs || (Vs = 1, (function(e) {
    const t = Rf(), n = Ef(), r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    e.Buffer = l, e.SlowBuffer = X, e.INSPECT_MAX_BYTES = 50;
    const o = 2147483647;
    e.kMaxLength = o, l.TYPED_ARRAY_SUPPORT = i(), !l.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function i() {
      try {
        const p = new Uint8Array(1), d = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(d, Uint8Array.prototype), Object.setPrototypeOf(p, d), p.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(l.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (l.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(l.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (l.isBuffer(this))
          return this.byteOffset;
      }
    });
    function s(p) {
      if (p > o)
        throw new RangeError('The value "' + p + '" is invalid for option "size"');
      const d = new Uint8Array(p);
      return Object.setPrototypeOf(d, l.prototype), d;
    }
    function l(p, d, h) {
      if (typeof p == "number") {
        if (typeof d == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return C(p);
      }
      return f(p, d, h);
    }
    l.poolSize = 8192;
    function f(p, d, h) {
      if (typeof p == "string")
        return D(p, d);
      if (ArrayBuffer.isView(p))
        return M(p);
      if (p == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof p
        );
      if (Nt(p, ArrayBuffer) || p && Nt(p.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Nt(p, SharedArrayBuffer) || p && Nt(p.buffer, SharedArrayBuffer)))
        return b(p, d, h);
      if (typeof p == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const I = p.valueOf && p.valueOf();
      if (I != null && I !== p)
        return l.from(I, d, h);
      const B = x(p);
      if (B) return B;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof p[Symbol.toPrimitive] == "function")
        return l.from(p[Symbol.toPrimitive]("string"), d, h);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof p
      );
    }
    l.from = function(p, d, h) {
      return f(p, d, h);
    }, Object.setPrototypeOf(l.prototype, Uint8Array.prototype), Object.setPrototypeOf(l, Uint8Array);
    function m(p) {
      if (typeof p != "number")
        throw new TypeError('"size" argument must be of type number');
      if (p < 0)
        throw new RangeError('The value "' + p + '" is invalid for option "size"');
    }
    function y(p, d, h) {
      return m(p), p <= 0 ? s(p) : d !== void 0 ? typeof h == "string" ? s(p).fill(d, h) : s(p).fill(d) : s(p);
    }
    l.alloc = function(p, d, h) {
      return y(p, d, h);
    };
    function C(p) {
      return m(p), s(p < 0 ? 0 : q(p) | 0);
    }
    l.allocUnsafe = function(p) {
      return C(p);
    }, l.allocUnsafeSlow = function(p) {
      return C(p);
    };
    function D(p, d) {
      if ((typeof d != "string" || d === "") && (d = "utf8"), !l.isEncoding(d))
        throw new TypeError("Unknown encoding: " + d);
      const h = H(p, d) | 0;
      let I = s(h);
      const B = I.write(p, d);
      return B !== h && (I = I.slice(0, B)), I;
    }
    function v(p) {
      const d = p.length < 0 ? 0 : q(p.length) | 0, h = s(d);
      for (let I = 0; I < d; I += 1)
        h[I] = p[I] & 255;
      return h;
    }
    function M(p) {
      if (Nt(p, Uint8Array)) {
        const d = new Uint8Array(p);
        return b(d.buffer, d.byteOffset, d.byteLength);
      }
      return v(p);
    }
    function b(p, d, h) {
      if (d < 0 || p.byteLength < d)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (p.byteLength < d + (h || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let I;
      return d === void 0 && h === void 0 ? I = new Uint8Array(p) : h === void 0 ? I = new Uint8Array(p, d) : I = new Uint8Array(p, d, h), Object.setPrototypeOf(I, l.prototype), I;
    }
    function x(p) {
      if (l.isBuffer(p)) {
        const d = q(p.length) | 0, h = s(d);
        return h.length === 0 || p.copy(h, 0, 0, d), h;
      }
      if (p.length !== void 0)
        return typeof p.length != "number" || Ce(p.length) ? s(0) : v(p);
      if (p.type === "Buffer" && Array.isArray(p.data))
        return v(p.data);
    }
    function q(p) {
      if (p >= o)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o.toString(16) + " bytes");
      return p | 0;
    }
    function X(p) {
      return +p != p && (p = 0), l.alloc(+p);
    }
    l.isBuffer = function(d) {
      return d != null && d._isBuffer === !0 && d !== l.prototype;
    }, l.compare = function(d, h) {
      if (Nt(d, Uint8Array) && (d = l.from(d, d.offset, d.byteLength)), Nt(h, Uint8Array) && (h = l.from(h, h.offset, h.byteLength)), !l.isBuffer(d) || !l.isBuffer(h))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (d === h) return 0;
      let I = d.length, B = h.length;
      for (let F = 0, Y = Math.min(I, B); F < Y; ++F)
        if (d[F] !== h[F]) {
          I = d[F], B = h[F];
          break;
        }
      return I < B ? -1 : B < I ? 1 : 0;
    }, l.isEncoding = function(d) {
      switch (String(d).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, l.concat = function(d, h) {
      if (!Array.isArray(d))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (d.length === 0)
        return l.alloc(0);
      let I;
      if (h === void 0)
        for (h = 0, I = 0; I < d.length; ++I)
          h += d[I].length;
      const B = l.allocUnsafe(h);
      let F = 0;
      for (I = 0; I < d.length; ++I) {
        let Y = d[I];
        if (Nt(Y, Uint8Array))
          F + Y.length > B.length ? (l.isBuffer(Y) || (Y = l.from(Y)), Y.copy(B, F)) : Uint8Array.prototype.set.call(
            B,
            Y,
            F
          );
        else if (l.isBuffer(Y))
          Y.copy(B, F);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        F += Y.length;
      }
      return B;
    };
    function H(p, d) {
      if (l.isBuffer(p))
        return p.length;
      if (ArrayBuffer.isView(p) || Nt(p, ArrayBuffer))
        return p.byteLength;
      if (typeof p != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof p
        );
      const h = p.length, I = arguments.length > 2 && arguments[2] === !0;
      if (!I && h === 0) return 0;
      let B = !1;
      for (; ; )
        switch (d) {
          case "ascii":
          case "latin1":
          case "binary":
            return h;
          case "utf8":
          case "utf-8":
            return Ne(p).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return h * 2;
          case "hex":
            return h >>> 1;
          case "base64":
            return we(p).length;
          default:
            if (B)
              return I ? -1 : Ne(p).length;
            d = ("" + d).toLowerCase(), B = !0;
        }
    }
    l.byteLength = H;
    function $(p, d, h) {
      let I = !1;
      if ((d === void 0 || d < 0) && (d = 0), d > this.length || ((h === void 0 || h > this.length) && (h = this.length), h <= 0) || (h >>>= 0, d >>>= 0, h <= d))
        return "";
      for (p || (p = "utf8"); ; )
        switch (p) {
          case "hex":
            return S(this, d, h);
          case "utf8":
          case "utf-8":
            return a(this, d, h);
          case "ascii":
            return N(this, d, h);
          case "latin1":
          case "binary":
            return O(this, d, h);
          case "base64":
            return g(this, d, h);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return w(this, d, h);
          default:
            if (I) throw new TypeError("Unknown encoding: " + p);
            p = (p + "").toLowerCase(), I = !0;
        }
    }
    l.prototype._isBuffer = !0;
    function K(p, d, h) {
      const I = p[d];
      p[d] = p[h], p[h] = I;
    }
    l.prototype.swap16 = function() {
      const d = this.length;
      if (d % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let h = 0; h < d; h += 2)
        K(this, h, h + 1);
      return this;
    }, l.prototype.swap32 = function() {
      const d = this.length;
      if (d % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let h = 0; h < d; h += 4)
        K(this, h, h + 3), K(this, h + 1, h + 2);
      return this;
    }, l.prototype.swap64 = function() {
      const d = this.length;
      if (d % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let h = 0; h < d; h += 8)
        K(this, h, h + 7), K(this, h + 1, h + 6), K(this, h + 2, h + 5), K(this, h + 3, h + 4);
      return this;
    }, l.prototype.toString = function() {
      const d = this.length;
      return d === 0 ? "" : arguments.length === 0 ? a(this, 0, d) : $.apply(this, arguments);
    }, l.prototype.toLocaleString = l.prototype.toString, l.prototype.equals = function(d) {
      if (!l.isBuffer(d)) throw new TypeError("Argument must be a Buffer");
      return this === d ? !0 : l.compare(this, d) === 0;
    }, l.prototype.inspect = function() {
      let d = "";
      const h = e.INSPECT_MAX_BYTES;
      return d = this.toString("hex", 0, h).replace(/(.{2})/g, "$1 ").trim(), this.length > h && (d += " ... "), "<Buffer " + d + ">";
    }, r && (l.prototype[r] = l.prototype.inspect), l.prototype.compare = function(d, h, I, B, F) {
      if (Nt(d, Uint8Array) && (d = l.from(d, d.offset, d.byteLength)), !l.isBuffer(d))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof d
        );
      if (h === void 0 && (h = 0), I === void 0 && (I = d ? d.length : 0), B === void 0 && (B = 0), F === void 0 && (F = this.length), h < 0 || I > d.length || B < 0 || F > this.length)
        throw new RangeError("out of range index");
      if (B >= F && h >= I)
        return 0;
      if (B >= F)
        return -1;
      if (h >= I)
        return 1;
      if (h >>>= 0, I >>>= 0, B >>>= 0, F >>>= 0, this === d) return 0;
      let Y = F - B, Ee = I - h;
      const de = Math.min(Y, Ee), ue = this.slice(B, F), ve = d.slice(h, I);
      for (let ce = 0; ce < de; ++ce)
        if (ue[ce] !== ve[ce]) {
          Y = ue[ce], Ee = ve[ce];
          break;
        }
      return Y < Ee ? -1 : Ee < Y ? 1 : 0;
    };
    function J(p, d, h, I, B) {
      if (p.length === 0) return -1;
      if (typeof h == "string" ? (I = h, h = 0) : h > 2147483647 ? h = 2147483647 : h < -2147483648 && (h = -2147483648), h = +h, Ce(h) && (h = B ? 0 : p.length - 1), h < 0 && (h = p.length + h), h >= p.length) {
        if (B) return -1;
        h = p.length - 1;
      } else if (h < 0)
        if (B) h = 0;
        else return -1;
      if (typeof d == "string" && (d = l.from(d, I)), l.isBuffer(d))
        return d.length === 0 ? -1 : te(p, d, h, I, B);
      if (typeof d == "number")
        return d = d & 255, typeof Uint8Array.prototype.indexOf == "function" ? B ? Uint8Array.prototype.indexOf.call(p, d, h) : Uint8Array.prototype.lastIndexOf.call(p, d, h) : te(p, [d], h, I, B);
      throw new TypeError("val must be string, number or Buffer");
    }
    function te(p, d, h, I, B) {
      let F = 1, Y = p.length, Ee = d.length;
      if (I !== void 0 && (I = String(I).toLowerCase(), I === "ucs2" || I === "ucs-2" || I === "utf16le" || I === "utf-16le")) {
        if (p.length < 2 || d.length < 2)
          return -1;
        F = 2, Y /= 2, Ee /= 2, h /= 2;
      }
      function de(ve, ce) {
        return F === 1 ? ve[ce] : ve.readUInt16BE(ce * F);
      }
      let ue;
      if (B) {
        let ve = -1;
        for (ue = h; ue < Y; ue++)
          if (de(p, ue) === de(d, ve === -1 ? 0 : ue - ve)) {
            if (ve === -1 && (ve = ue), ue - ve + 1 === Ee) return ve * F;
          } else
            ve !== -1 && (ue -= ue - ve), ve = -1;
      } else
        for (h + Ee > Y && (h = Y - Ee), ue = h; ue >= 0; ue--) {
          let ve = !0;
          for (let ce = 0; ce < Ee; ce++)
            if (de(p, ue + ce) !== de(d, ce)) {
              ve = !1;
              break;
            }
          if (ve) return ue;
        }
      return -1;
    }
    l.prototype.includes = function(d, h, I) {
      return this.indexOf(d, h, I) !== -1;
    }, l.prototype.indexOf = function(d, h, I) {
      return J(this, d, h, I, !0);
    }, l.prototype.lastIndexOf = function(d, h, I) {
      return J(this, d, h, I, !1);
    };
    function re(p, d, h, I) {
      h = Number(h) || 0;
      const B = p.length - h;
      I ? (I = Number(I), I > B && (I = B)) : I = B;
      const F = d.length;
      I > F / 2 && (I = F / 2);
      let Y;
      for (Y = 0; Y < I; ++Y) {
        const Ee = parseInt(d.substr(Y * 2, 2), 16);
        if (Ce(Ee)) return Y;
        p[h + Y] = Ee;
      }
      return Y;
    }
    function j(p, d, h, I) {
      return ye(Ne(d, p.length - h), p, h, I);
    }
    function k(p, d, h, I) {
      return ye(be(d), p, h, I);
    }
    function P(p, d, h, I) {
      return ye(we(d), p, h, I);
    }
    function W(p, d, h, I) {
      return ye(On(d, p.length - h), p, h, I);
    }
    l.prototype.write = function(d, h, I, B) {
      if (h === void 0)
        B = "utf8", I = this.length, h = 0;
      else if (I === void 0 && typeof h == "string")
        B = h, I = this.length, h = 0;
      else if (isFinite(h))
        h = h >>> 0, isFinite(I) ? (I = I >>> 0, B === void 0 && (B = "utf8")) : (B = I, I = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const F = this.length - h;
      if ((I === void 0 || I > F) && (I = F), d.length > 0 && (I < 0 || h < 0) || h > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      B || (B = "utf8");
      let Y = !1;
      for (; ; )
        switch (B) {
          case "hex":
            return re(this, d, h, I);
          case "utf8":
          case "utf-8":
            return j(this, d, h, I);
          case "ascii":
          case "latin1":
          case "binary":
            return k(this, d, h, I);
          case "base64":
            return P(this, d, h, I);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return W(this, d, h, I);
          default:
            if (Y) throw new TypeError("Unknown encoding: " + B);
            B = ("" + B).toLowerCase(), Y = !0;
        }
    }, l.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function g(p, d, h) {
      return d === 0 && h === p.length ? t.fromByteArray(p) : t.fromByteArray(p.slice(d, h));
    }
    function a(p, d, h) {
      h = Math.min(p.length, h);
      const I = [];
      let B = d;
      for (; B < h; ) {
        const F = p[B];
        let Y = null, Ee = F > 239 ? 4 : F > 223 ? 3 : F > 191 ? 2 : 1;
        if (B + Ee <= h) {
          let de, ue, ve, ce;
          switch (Ee) {
            case 1:
              F < 128 && (Y = F);
              break;
            case 2:
              de = p[B + 1], (de & 192) === 128 && (ce = (F & 31) << 6 | de & 63, ce > 127 && (Y = ce));
              break;
            case 3:
              de = p[B + 1], ue = p[B + 2], (de & 192) === 128 && (ue & 192) === 128 && (ce = (F & 15) << 12 | (de & 63) << 6 | ue & 63, ce > 2047 && (ce < 55296 || ce > 57343) && (Y = ce));
              break;
            case 4:
              de = p[B + 1], ue = p[B + 2], ve = p[B + 3], (de & 192) === 128 && (ue & 192) === 128 && (ve & 192) === 128 && (ce = (F & 15) << 18 | (de & 63) << 12 | (ue & 63) << 6 | ve & 63, ce > 65535 && ce < 1114112 && (Y = ce));
          }
        }
        Y === null ? (Y = 65533, Ee = 1) : Y > 65535 && (Y -= 65536, I.push(Y >>> 10 & 1023 | 55296), Y = 56320 | Y & 1023), I.push(Y), B += Ee;
      }
      return R(I);
    }
    const _ = 4096;
    function R(p) {
      const d = p.length;
      if (d <= _)
        return String.fromCharCode.apply(String, p);
      let h = "", I = 0;
      for (; I < d; )
        h += String.fromCharCode.apply(
          String,
          p.slice(I, I += _)
        );
      return h;
    }
    function N(p, d, h) {
      let I = "";
      h = Math.min(p.length, h);
      for (let B = d; B < h; ++B)
        I += String.fromCharCode(p[B] & 127);
      return I;
    }
    function O(p, d, h) {
      let I = "";
      h = Math.min(p.length, h);
      for (let B = d; B < h; ++B)
        I += String.fromCharCode(p[B]);
      return I;
    }
    function S(p, d, h) {
      const I = p.length;
      (!d || d < 0) && (d = 0), (!h || h < 0 || h > I) && (h = I);
      let B = "";
      for (let F = d; F < h; ++F)
        B += Ue[p[F]];
      return B;
    }
    function w(p, d, h) {
      const I = p.slice(d, h);
      let B = "";
      for (let F = 0; F < I.length - 1; F += 2)
        B += String.fromCharCode(I[F] + I[F + 1] * 256);
      return B;
    }
    l.prototype.slice = function(d, h) {
      const I = this.length;
      d = ~~d, h = h === void 0 ? I : ~~h, d < 0 ? (d += I, d < 0 && (d = 0)) : d > I && (d = I), h < 0 ? (h += I, h < 0 && (h = 0)) : h > I && (h = I), h < d && (h = d);
      const B = this.subarray(d, h);
      return Object.setPrototypeOf(B, l.prototype), B;
    };
    function A(p, d, h) {
      if (p % 1 !== 0 || p < 0) throw new RangeError("offset is not uint");
      if (p + d > h) throw new RangeError("Trying to access beyond buffer length");
    }
    l.prototype.readUintLE = l.prototype.readUIntLE = function(d, h, I) {
      d = d >>> 0, h = h >>> 0, I || A(d, h, this.length);
      let B = this[d], F = 1, Y = 0;
      for (; ++Y < h && (F *= 256); )
        B += this[d + Y] * F;
      return B;
    }, l.prototype.readUintBE = l.prototype.readUIntBE = function(d, h, I) {
      d = d >>> 0, h = h >>> 0, I || A(d, h, this.length);
      let B = this[d + --h], F = 1;
      for (; h > 0 && (F *= 256); )
        B += this[d + --h] * F;
      return B;
    }, l.prototype.readUint8 = l.prototype.readUInt8 = function(d, h) {
      return d = d >>> 0, h || A(d, 1, this.length), this[d];
    }, l.prototype.readUint16LE = l.prototype.readUInt16LE = function(d, h) {
      return d = d >>> 0, h || A(d, 2, this.length), this[d] | this[d + 1] << 8;
    }, l.prototype.readUint16BE = l.prototype.readUInt16BE = function(d, h) {
      return d = d >>> 0, h || A(d, 2, this.length), this[d] << 8 | this[d + 1];
    }, l.prototype.readUint32LE = l.prototype.readUInt32LE = function(d, h) {
      return d = d >>> 0, h || A(d, 4, this.length), (this[d] | this[d + 1] << 8 | this[d + 2] << 16) + this[d + 3] * 16777216;
    }, l.prototype.readUint32BE = l.prototype.readUInt32BE = function(d, h) {
      return d = d >>> 0, h || A(d, 4, this.length), this[d] * 16777216 + (this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3]);
    }, l.prototype.readBigUInt64LE = vt(function(d) {
      d = d >>> 0, Te(d, "offset");
      const h = this[d], I = this[d + 7];
      (h === void 0 || I === void 0) && Re(d, this.length - 8);
      const B = h + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24, F = this[++d] + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + I * 2 ** 24;
      return BigInt(B) + (BigInt(F) << BigInt(32));
    }), l.prototype.readBigUInt64BE = vt(function(d) {
      d = d >>> 0, Te(d, "offset");
      const h = this[d], I = this[d + 7];
      (h === void 0 || I === void 0) && Re(d, this.length - 8);
      const B = h * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d], F = this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + I;
      return (BigInt(B) << BigInt(32)) + BigInt(F);
    }), l.prototype.readIntLE = function(d, h, I) {
      d = d >>> 0, h = h >>> 0, I || A(d, h, this.length);
      let B = this[d], F = 1, Y = 0;
      for (; ++Y < h && (F *= 256); )
        B += this[d + Y] * F;
      return F *= 128, B >= F && (B -= Math.pow(2, 8 * h)), B;
    }, l.prototype.readIntBE = function(d, h, I) {
      d = d >>> 0, h = h >>> 0, I || A(d, h, this.length);
      let B = h, F = 1, Y = this[d + --B];
      for (; B > 0 && (F *= 256); )
        Y += this[d + --B] * F;
      return F *= 128, Y >= F && (Y -= Math.pow(2, 8 * h)), Y;
    }, l.prototype.readInt8 = function(d, h) {
      return d = d >>> 0, h || A(d, 1, this.length), this[d] & 128 ? (255 - this[d] + 1) * -1 : this[d];
    }, l.prototype.readInt16LE = function(d, h) {
      d = d >>> 0, h || A(d, 2, this.length);
      const I = this[d] | this[d + 1] << 8;
      return I & 32768 ? I | 4294901760 : I;
    }, l.prototype.readInt16BE = function(d, h) {
      d = d >>> 0, h || A(d, 2, this.length);
      const I = this[d + 1] | this[d] << 8;
      return I & 32768 ? I | 4294901760 : I;
    }, l.prototype.readInt32LE = function(d, h) {
      return d = d >>> 0, h || A(d, 4, this.length), this[d] | this[d + 1] << 8 | this[d + 2] << 16 | this[d + 3] << 24;
    }, l.prototype.readInt32BE = function(d, h) {
      return d = d >>> 0, h || A(d, 4, this.length), this[d] << 24 | this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3];
    }, l.prototype.readBigInt64LE = vt(function(d) {
      d = d >>> 0, Te(d, "offset");
      const h = this[d], I = this[d + 7];
      (h === void 0 || I === void 0) && Re(d, this.length - 8);
      const B = this[d + 4] + this[d + 5] * 2 ** 8 + this[d + 6] * 2 ** 16 + (I << 24);
      return (BigInt(B) << BigInt(32)) + BigInt(h + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24);
    }), l.prototype.readBigInt64BE = vt(function(d) {
      d = d >>> 0, Te(d, "offset");
      const h = this[d], I = this[d + 7];
      (h === void 0 || I === void 0) && Re(d, this.length - 8);
      const B = (h << 24) + // Overflow
      this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d];
      return (BigInt(B) << BigInt(32)) + BigInt(this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + I);
    }), l.prototype.readFloatLE = function(d, h) {
      return d = d >>> 0, h || A(d, 4, this.length), n.read(this, d, !0, 23, 4);
    }, l.prototype.readFloatBE = function(d, h) {
      return d = d >>> 0, h || A(d, 4, this.length), n.read(this, d, !1, 23, 4);
    }, l.prototype.readDoubleLE = function(d, h) {
      return d = d >>> 0, h || A(d, 8, this.length), n.read(this, d, !0, 52, 8);
    }, l.prototype.readDoubleBE = function(d, h) {
      return d = d >>> 0, h || A(d, 8, this.length), n.read(this, d, !1, 52, 8);
    };
    function c(p, d, h, I, B, F) {
      if (!l.isBuffer(p)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (d > B || d < F) throw new RangeError('"value" argument is out of bounds');
      if (h + I > p.length) throw new RangeError("Index out of range");
    }
    l.prototype.writeUintLE = l.prototype.writeUIntLE = function(d, h, I, B) {
      if (d = +d, h = h >>> 0, I = I >>> 0, !B) {
        const Ee = Math.pow(2, 8 * I) - 1;
        c(this, d, h, I, Ee, 0);
      }
      let F = 1, Y = 0;
      for (this[h] = d & 255; ++Y < I && (F *= 256); )
        this[h + Y] = d / F & 255;
      return h + I;
    }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function(d, h, I, B) {
      if (d = +d, h = h >>> 0, I = I >>> 0, !B) {
        const Ee = Math.pow(2, 8 * I) - 1;
        c(this, d, h, I, Ee, 0);
      }
      let F = I - 1, Y = 1;
      for (this[h + F] = d & 255; --F >= 0 && (Y *= 256); )
        this[h + F] = d / Y & 255;
      return h + I;
    }, l.prototype.writeUint8 = l.prototype.writeUInt8 = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 1, 255, 0), this[h] = d & 255, h + 1;
    }, l.prototype.writeUint16LE = l.prototype.writeUInt16LE = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 2, 65535, 0), this[h] = d & 255, this[h + 1] = d >>> 8, h + 2;
    }, l.prototype.writeUint16BE = l.prototype.writeUInt16BE = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 2, 65535, 0), this[h] = d >>> 8, this[h + 1] = d & 255, h + 2;
    }, l.prototype.writeUint32LE = l.prototype.writeUInt32LE = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 4, 4294967295, 0), this[h + 3] = d >>> 24, this[h + 2] = d >>> 16, this[h + 1] = d >>> 8, this[h] = d & 255, h + 4;
    }, l.prototype.writeUint32BE = l.prototype.writeUInt32BE = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 4, 4294967295, 0), this[h] = d >>> 24, this[h + 1] = d >>> 16, this[h + 2] = d >>> 8, this[h + 3] = d & 255, h + 4;
    };
    function u(p, d, h, I, B) {
      fe(d, I, B, p, h, 7);
      let F = Number(d & BigInt(4294967295));
      p[h++] = F, F = F >> 8, p[h++] = F, F = F >> 8, p[h++] = F, F = F >> 8, p[h++] = F;
      let Y = Number(d >> BigInt(32) & BigInt(4294967295));
      return p[h++] = Y, Y = Y >> 8, p[h++] = Y, Y = Y >> 8, p[h++] = Y, Y = Y >> 8, p[h++] = Y, h;
    }
    function E(p, d, h, I, B) {
      fe(d, I, B, p, h, 7);
      let F = Number(d & BigInt(4294967295));
      p[h + 7] = F, F = F >> 8, p[h + 6] = F, F = F >> 8, p[h + 5] = F, F = F >> 8, p[h + 4] = F;
      let Y = Number(d >> BigInt(32) & BigInt(4294967295));
      return p[h + 3] = Y, Y = Y >> 8, p[h + 2] = Y, Y = Y >> 8, p[h + 1] = Y, Y = Y >> 8, p[h] = Y, h + 8;
    }
    l.prototype.writeBigUInt64LE = vt(function(d, h = 0) {
      return u(this, d, h, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeBigUInt64BE = vt(function(d, h = 0) {
      return E(this, d, h, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeIntLE = function(d, h, I, B) {
      if (d = +d, h = h >>> 0, !B) {
        const de = Math.pow(2, 8 * I - 1);
        c(this, d, h, I, de - 1, -de);
      }
      let F = 0, Y = 1, Ee = 0;
      for (this[h] = d & 255; ++F < I && (Y *= 256); )
        d < 0 && Ee === 0 && this[h + F - 1] !== 0 && (Ee = 1), this[h + F] = (d / Y >> 0) - Ee & 255;
      return h + I;
    }, l.prototype.writeIntBE = function(d, h, I, B) {
      if (d = +d, h = h >>> 0, !B) {
        const de = Math.pow(2, 8 * I - 1);
        c(this, d, h, I, de - 1, -de);
      }
      let F = I - 1, Y = 1, Ee = 0;
      for (this[h + F] = d & 255; --F >= 0 && (Y *= 256); )
        d < 0 && Ee === 0 && this[h + F + 1] !== 0 && (Ee = 1), this[h + F] = (d / Y >> 0) - Ee & 255;
      return h + I;
    }, l.prototype.writeInt8 = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 1, 127, -128), d < 0 && (d = 255 + d + 1), this[h] = d & 255, h + 1;
    }, l.prototype.writeInt16LE = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 2, 32767, -32768), this[h] = d & 255, this[h + 1] = d >>> 8, h + 2;
    }, l.prototype.writeInt16BE = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 2, 32767, -32768), this[h] = d >>> 8, this[h + 1] = d & 255, h + 2;
    }, l.prototype.writeInt32LE = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 4, 2147483647, -2147483648), this[h] = d & 255, this[h + 1] = d >>> 8, this[h + 2] = d >>> 16, this[h + 3] = d >>> 24, h + 4;
    }, l.prototype.writeInt32BE = function(d, h, I) {
      return d = +d, h = h >>> 0, I || c(this, d, h, 4, 2147483647, -2147483648), d < 0 && (d = 4294967295 + d + 1), this[h] = d >>> 24, this[h + 1] = d >>> 16, this[h + 2] = d >>> 8, this[h + 3] = d & 255, h + 4;
    }, l.prototype.writeBigInt64LE = vt(function(d, h = 0) {
      return u(this, d, h, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), l.prototype.writeBigInt64BE = vt(function(d, h = 0) {
      return E(this, d, h, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function T(p, d, h, I, B, F) {
      if (h + I > p.length) throw new RangeError("Index out of range");
      if (h < 0) throw new RangeError("Index out of range");
    }
    function U(p, d, h, I, B) {
      return d = +d, h = h >>> 0, B || T(p, d, h, 4), n.write(p, d, h, I, 23, 4), h + 4;
    }
    l.prototype.writeFloatLE = function(d, h, I) {
      return U(this, d, h, !0, I);
    }, l.prototype.writeFloatBE = function(d, h, I) {
      return U(this, d, h, !1, I);
    };
    function z(p, d, h, I, B) {
      return d = +d, h = h >>> 0, B || T(p, d, h, 8), n.write(p, d, h, I, 52, 8), h + 8;
    }
    l.prototype.writeDoubleLE = function(d, h, I) {
      return z(this, d, h, !0, I);
    }, l.prototype.writeDoubleBE = function(d, h, I) {
      return z(this, d, h, !1, I);
    }, l.prototype.copy = function(d, h, I, B) {
      if (!l.isBuffer(d)) throw new TypeError("argument should be a Buffer");
      if (I || (I = 0), !B && B !== 0 && (B = this.length), h >= d.length && (h = d.length), h || (h = 0), B > 0 && B < I && (B = I), B === I || d.length === 0 || this.length === 0) return 0;
      if (h < 0)
        throw new RangeError("targetStart out of bounds");
      if (I < 0 || I >= this.length) throw new RangeError("Index out of range");
      if (B < 0) throw new RangeError("sourceEnd out of bounds");
      B > this.length && (B = this.length), d.length - h < B - I && (B = d.length - h + I);
      const F = B - I;
      return this === d && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(h, I, B) : Uint8Array.prototype.set.call(
        d,
        this.subarray(I, B),
        h
      ), F;
    }, l.prototype.fill = function(d, h, I, B) {
      if (typeof d == "string") {
        if (typeof h == "string" ? (B = h, h = 0, I = this.length) : typeof I == "string" && (B = I, I = this.length), B !== void 0 && typeof B != "string")
          throw new TypeError("encoding must be a string");
        if (typeof B == "string" && !l.isEncoding(B))
          throw new TypeError("Unknown encoding: " + B);
        if (d.length === 1) {
          const Y = d.charCodeAt(0);
          (B === "utf8" && Y < 128 || B === "latin1") && (d = Y);
        }
      } else typeof d == "number" ? d = d & 255 : typeof d == "boolean" && (d = Number(d));
      if (h < 0 || this.length < h || this.length < I)
        throw new RangeError("Out of range index");
      if (I <= h)
        return this;
      h = h >>> 0, I = I === void 0 ? this.length : I >>> 0, d || (d = 0);
      let F;
      if (typeof d == "number")
        for (F = h; F < I; ++F)
          this[F] = d;
      else {
        const Y = l.isBuffer(d) ? d : l.from(d, B), Ee = Y.length;
        if (Ee === 0)
          throw new TypeError('The value "' + d + '" is invalid for argument "value"');
        for (F = 0; F < I - h; ++F)
          this[F + h] = Y[F % Ee];
      }
      return this;
    };
    const ee = {};
    function ie(p, d, h) {
      ee[p] = class extends h {
        constructor() {
          super(), Object.defineProperty(this, "message", {
            value: d.apply(this, arguments),
            writable: !0,
            configurable: !0
          }), this.name = `${this.name} [${p}]`, this.stack, delete this.name;
        }
        get code() {
          return p;
        }
        set code(B) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: B,
            writable: !0
          });
        }
        toString() {
          return `${this.name} [${p}]: ${this.message}`;
        }
      };
    }
    ie(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(p) {
        return p ? `${p} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), ie(
      "ERR_INVALID_ARG_TYPE",
      function(p, d) {
        return `The "${p}" argument must be of type number. Received type ${typeof d}`;
      },
      TypeError
    ), ie(
      "ERR_OUT_OF_RANGE",
      function(p, d, h) {
        let I = `The value of "${p}" is out of range.`, B = h;
        return Number.isInteger(h) && Math.abs(h) > 2 ** 32 ? B = me(String(h)) : typeof h == "bigint" && (B = String(h), (h > BigInt(2) ** BigInt(32) || h < -(BigInt(2) ** BigInt(32))) && (B = me(B)), B += "n"), I += ` It must be ${d}. Received ${B}`, I;
      },
      RangeError
    );
    function me(p) {
      let d = "", h = p.length;
      const I = p[0] === "-" ? 1 : 0;
      for (; h >= I + 4; h -= 3)
        d = `_${p.slice(h - 3, h)}${d}`;
      return `${p.slice(0, h)}${d}`;
    }
    function _e(p, d, h) {
      Te(d, "offset"), (p[d] === void 0 || p[d + h] === void 0) && Re(d, p.length - (h + 1));
    }
    function fe(p, d, h, I, B, F) {
      if (p > h || p < d) {
        const Y = typeof d == "bigint" ? "n" : "";
        let Ee;
        throw d === 0 || d === BigInt(0) ? Ee = `>= 0${Y} and < 2${Y} ** ${(F + 1) * 8}${Y}` : Ee = `>= -(2${Y} ** ${(F + 1) * 8 - 1}${Y}) and < 2 ** ${(F + 1) * 8 - 1}${Y}`, new ee.ERR_OUT_OF_RANGE("value", Ee, p);
      }
      _e(I, B, F);
    }
    function Te(p, d) {
      if (typeof p != "number")
        throw new ee.ERR_INVALID_ARG_TYPE(d, "number", p);
    }
    function Re(p, d, h) {
      throw Math.floor(p) !== p ? (Te(p, h), new ee.ERR_OUT_OF_RANGE("offset", "an integer", p)) : d < 0 ? new ee.ERR_BUFFER_OUT_OF_BOUNDS() : new ee.ERR_OUT_OF_RANGE(
        "offset",
        `>= 0 and <= ${d}`,
        p
      );
    }
    const ge = /[^+/0-9A-Za-z-_]/g;
    function Dt(p) {
      if (p = p.split("=")[0], p = p.trim().replace(ge, ""), p.length < 2) return "";
      for (; p.length % 4 !== 0; )
        p = p + "=";
      return p;
    }
    function Ne(p, d) {
      d = d || 1 / 0;
      let h;
      const I = p.length;
      let B = null;
      const F = [];
      for (let Y = 0; Y < I; ++Y) {
        if (h = p.charCodeAt(Y), h > 55295 && h < 57344) {
          if (!B) {
            if (h > 56319) {
              (d -= 3) > -1 && F.push(239, 191, 189);
              continue;
            } else if (Y + 1 === I) {
              (d -= 3) > -1 && F.push(239, 191, 189);
              continue;
            }
            B = h;
            continue;
          }
          if (h < 56320) {
            (d -= 3) > -1 && F.push(239, 191, 189), B = h;
            continue;
          }
          h = (B - 55296 << 10 | h - 56320) + 65536;
        } else B && (d -= 3) > -1 && F.push(239, 191, 189);
        if (B = null, h < 128) {
          if ((d -= 1) < 0) break;
          F.push(h);
        } else if (h < 2048) {
          if ((d -= 2) < 0) break;
          F.push(
            h >> 6 | 192,
            h & 63 | 128
          );
        } else if (h < 65536) {
          if ((d -= 3) < 0) break;
          F.push(
            h >> 12 | 224,
            h >> 6 & 63 | 128,
            h & 63 | 128
          );
        } else if (h < 1114112) {
          if ((d -= 4) < 0) break;
          F.push(
            h >> 18 | 240,
            h >> 12 & 63 | 128,
            h >> 6 & 63 | 128,
            h & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return F;
    }
    function be(p) {
      const d = [];
      for (let h = 0; h < p.length; ++h)
        d.push(p.charCodeAt(h) & 255);
      return d;
    }
    function On(p, d) {
      let h, I, B;
      const F = [];
      for (let Y = 0; Y < p.length && !((d -= 2) < 0); ++Y)
        h = p.charCodeAt(Y), I = h >> 8, B = h % 256, F.push(B), F.push(I);
      return F;
    }
    function we(p) {
      return t.toByteArray(Dt(p));
    }
    function ye(p, d, h, I) {
      let B;
      for (B = 0; B < I && !(B + h >= d.length || B >= p.length); ++B)
        d[B + h] = p[B];
      return B;
    }
    function Nt(p, d) {
      return p instanceof d || p != null && p.constructor != null && p.constructor.name != null && p.constructor.name === d.name;
    }
    function Ce(p) {
      return p !== p;
    }
    const Ue = (function() {
      const p = "0123456789abcdef", d = new Array(256);
      for (let h = 0; h < 16; ++h) {
        const I = h * 16;
        for (let B = 0; B < 16; ++B)
          d[I + B] = p[h] + p[B];
      }
      return d;
    })();
    function vt(p) {
      return typeof BigInt > "u" ? De : p;
    }
    function De() {
      throw new Error("BigInt not supported");
    }
  })(Li)), Li;
}
var pe = Lo();
const Sn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function pf(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function uo(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function er(e, ...t) {
  if (!pf(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Af(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  uo(e.outputLen), uo(e.blockLen);
}
function wr(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function gf(e, t) {
  er(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function xn(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function xi(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Mt(e, t) {
  return e << 32 - t | e >>> t;
}
function mf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function xo(e) {
  return typeof e == "string" && (e = mf(e)), er(e), e;
}
function Of(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    er(o), t += o.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, o), o += i.length;
  }
  return n;
}
class Oc {
}
function Sc(e) {
  const t = (r) => e().update(xo(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Nc(e = 32) {
  if (Sn && typeof Sn.getRandomValues == "function")
    return Sn.getRandomValues(new Uint8Array(e));
  if (Sn && typeof Sn.randomBytes == "function")
    return Uint8Array.from(Sn.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
function Sf(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), i = BigInt(4294967295), s = Number(n >> o & i), l = Number(n & i), f = r ? 4 : 0, m = r ? 0 : 4;
  e.setUint32(t + f, s, r), e.setUint32(t + m, l, r);
}
function Nf(e, t, n) {
  return e & t ^ ~e & n;
}
function yf(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class yc extends Oc {
  constructor(t, n, r, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(t), this.view = xi(this.buffer);
  }
  update(t) {
    wr(this), t = xo(t), er(t);
    const { view: n, buffer: r, blockLen: o } = this, i = t.length;
    for (let s = 0; s < i; ) {
      const l = Math.min(o - this.pos, i - s);
      if (l === o) {
        const f = xi(t);
        for (; o <= i - s; s += o)
          this.process(f, s);
        continue;
      }
      r.set(t.subarray(s, s + l), this.pos), this.pos += l, s += l, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    wr(this), gf(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: i } = this;
    let { pos: s } = this;
    n[s++] = 128, xn(this.buffer.subarray(s)), this.padOffset > o - s && (this.process(r, 0), s = 0);
    for (let C = s; C < o; C++)
      n[C] = 0;
    Sf(r, o - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const l = xi(t), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const m = f / 4, y = this.get();
    if (m > y.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let C = 0; C < m; C++)
      l.setUint32(4 * C, y[C], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: i, destroyed: s, pos: l } = this;
    return t.destroyed = s, t.finished = i, t.length = o, t.pos = l, o % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const nn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ft = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]), hr = /* @__PURE__ */ BigInt(2 ** 32 - 1), Hs = /* @__PURE__ */ BigInt(32);
function Tf(e, t = !1) {
  return t ? { h: Number(e & hr), l: Number(e >> Hs & hr) } : { h: Number(e >> Hs & hr) | 0, l: Number(e & hr) | 0 };
}
function If(e, t = !1) {
  const n = e.length;
  let r = new Uint32Array(n), o = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: s, l } = Tf(e[i], t);
    [r[i], o[i]] = [s, l];
  }
  return [r, o];
}
const Gs = (e, t, n) => e >>> n, Ks = (e, t, n) => e << 32 - n | t >>> n, Nn = (e, t, n) => e >>> n | t << 32 - n, yn = (e, t, n) => e << 32 - n | t >>> n, _r = (e, t, n) => e << 64 - n | t >>> n - 32, Rr = (e, t, n) => e >>> n - 32 | t << 64 - n;
function Ht(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const wf = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), vf = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, bf = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Cf = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, Lf = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), xf = (e, t, n, r, o, i) => t + n + r + o + i + (e / 2 ** 32 | 0) | 0, Uf = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), rn = /* @__PURE__ */ new Uint32Array(64);
class Df extends yc {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = nn[0] | 0, this.B = nn[1] | 0, this.C = nn[2] | 0, this.D = nn[3] | 0, this.E = nn[4] | 0, this.F = nn[5] | 0, this.G = nn[6] | 0, this.H = nn[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: i, F: s, G: l, H: f } = this;
    return [t, n, r, o, i, s, l, f];
  }
  // prettier-ignore
  set(t, n, r, o, i, s, l, f) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = i | 0, this.F = s | 0, this.G = l | 0, this.H = f | 0;
  }
  process(t, n) {
    for (let C = 0; C < 16; C++, n += 4)
      rn[C] = t.getUint32(n, !1);
    for (let C = 16; C < 64; C++) {
      const D = rn[C - 15], v = rn[C - 2], M = Mt(D, 7) ^ Mt(D, 18) ^ D >>> 3, b = Mt(v, 17) ^ Mt(v, 19) ^ v >>> 10;
      rn[C] = b + rn[C - 7] + M + rn[C - 16] | 0;
    }
    let { A: r, B: o, C: i, D: s, E: l, F: f, G: m, H: y } = this;
    for (let C = 0; C < 64; C++) {
      const D = Mt(l, 6) ^ Mt(l, 11) ^ Mt(l, 25), v = y + D + Nf(l, f, m) + Uf[C] + rn[C] | 0, b = (Mt(r, 2) ^ Mt(r, 13) ^ Mt(r, 22)) + yf(r, o, i) | 0;
      y = m, m = f, f = l, l = s + v | 0, s = i, i = o, o = r, r = v + b | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, i = i + this.C | 0, s = s + this.D | 0, l = l + this.E | 0, f = f + this.F | 0, m = m + this.G | 0, y = y + this.H | 0, this.set(r, o, i, s, l, f, m, y);
  }
  roundClean() {
    xn(rn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), xn(this.buffer);
  }
}
const Tc = If([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((e) => BigInt(e))), Mf = Tc[0], Bf = Tc[1], on = /* @__PURE__ */ new Uint32Array(80), sn = /* @__PURE__ */ new Uint32Array(80);
class Pf extends yc {
  constructor(t = 64) {
    super(128, t, 16, !1), this.Ah = ft[0] | 0, this.Al = ft[1] | 0, this.Bh = ft[2] | 0, this.Bl = ft[3] | 0, this.Ch = ft[4] | 0, this.Cl = ft[5] | 0, this.Dh = ft[6] | 0, this.Dl = ft[7] | 0, this.Eh = ft[8] | 0, this.El = ft[9] | 0, this.Fh = ft[10] | 0, this.Fl = ft[11] | 0, this.Gh = ft[12] | 0, this.Gl = ft[13] | 0, this.Hh = ft[14] | 0, this.Hl = ft[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: i, Cl: s, Dh: l, Dl: f, Eh: m, El: y, Fh: C, Fl: D, Gh: v, Gl: M, Hh: b, Hl: x } = this;
    return [t, n, r, o, i, s, l, f, m, y, C, D, v, M, b, x];
  }
  // prettier-ignore
  set(t, n, r, o, i, s, l, f, m, y, C, D, v, M, b, x) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = i | 0, this.Cl = s | 0, this.Dh = l | 0, this.Dl = f | 0, this.Eh = m | 0, this.El = y | 0, this.Fh = C | 0, this.Fl = D | 0, this.Gh = v | 0, this.Gl = M | 0, this.Hh = b | 0, this.Hl = x | 0;
  }
  process(t, n) {
    for (let H = 0; H < 16; H++, n += 4)
      on[H] = t.getUint32(n), sn[H] = t.getUint32(n += 4);
    for (let H = 16; H < 80; H++) {
      const $ = on[H - 15] | 0, K = sn[H - 15] | 0, J = Nn($, K, 1) ^ Nn($, K, 8) ^ Gs($, K, 7), te = yn($, K, 1) ^ yn($, K, 8) ^ Ks($, K, 7), re = on[H - 2] | 0, j = sn[H - 2] | 0, k = Nn(re, j, 19) ^ _r(re, j, 61) ^ Gs(re, j, 6), P = yn(re, j, 19) ^ Rr(re, j, 61) ^ Ks(re, j, 6), W = bf(te, P, sn[H - 7], sn[H - 16]), g = Cf(W, J, k, on[H - 7], on[H - 16]);
      on[H] = g | 0, sn[H] = W | 0;
    }
    let { Ah: r, Al: o, Bh: i, Bl: s, Ch: l, Cl: f, Dh: m, Dl: y, Eh: C, El: D, Fh: v, Fl: M, Gh: b, Gl: x, Hh: q, Hl: X } = this;
    for (let H = 0; H < 80; H++) {
      const $ = Nn(C, D, 14) ^ Nn(C, D, 18) ^ _r(C, D, 41), K = yn(C, D, 14) ^ yn(C, D, 18) ^ Rr(C, D, 41), J = C & v ^ ~C & b, te = D & M ^ ~D & x, re = Lf(X, K, te, Bf[H], sn[H]), j = xf(re, q, $, J, Mf[H], on[H]), k = re | 0, P = Nn(r, o, 28) ^ _r(r, o, 34) ^ _r(r, o, 39), W = yn(r, o, 28) ^ Rr(r, o, 34) ^ Rr(r, o, 39), g = r & i ^ r & l ^ i & l, a = o & s ^ o & f ^ s & f;
      q = b | 0, X = x | 0, b = v | 0, x = M | 0, v = C | 0, M = D | 0, { h: C, l: D } = Ht(m | 0, y | 0, j | 0, k | 0), m = l | 0, y = f | 0, l = i | 0, f = s | 0, i = r | 0, s = o | 0;
      const _ = wf(k, W, a);
      r = vf(_, j, P, g), o = _ | 0;
    }
    ({ h: r, l: o } = Ht(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: i, l: s } = Ht(this.Bh | 0, this.Bl | 0, i | 0, s | 0), { h: l, l: f } = Ht(this.Ch | 0, this.Cl | 0, l | 0, f | 0), { h: m, l: y } = Ht(this.Dh | 0, this.Dl | 0, m | 0, y | 0), { h: C, l: D } = Ht(this.Eh | 0, this.El | 0, C | 0, D | 0), { h: v, l: M } = Ht(this.Fh | 0, this.Fl | 0, v | 0, M | 0), { h: b, l: x } = Ht(this.Gh | 0, this.Gl | 0, b | 0, x | 0), { h: q, l: X } = Ht(this.Hh | 0, this.Hl | 0, q | 0, X | 0), this.set(r, o, i, s, l, f, m, y, C, D, v, M, b, x, q, X);
  }
  roundClean() {
    xn(on, sn);
  }
  destroy() {
    xn(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const Ic = /* @__PURE__ */ Sc(() => new Df()), $f = /* @__PURE__ */ Sc(() => new Pf());
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Uo = /* @__PURE__ */ BigInt(0), lo = /* @__PURE__ */ BigInt(1);
function tr(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Do(e) {
  if (!tr(e))
    throw new Error("Uint8Array expected");
}
function dn(e, t) {
  if (typeof t != "boolean")
    throw new Error(e + " boolean expected, got " + t);
}
function Er(e) {
  const t = e.toString(16);
  return t.length & 1 ? "0" + t : t;
}
function wc(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  return e === "" ? Uo : BigInt("0x" + e);
}
const vc = (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function"
), kf = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Un(e) {
  if (Do(e), vc)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += kf[e[n]];
  return t;
}
const Gt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function qs(e) {
  if (e >= Gt._0 && e <= Gt._9)
    return e - Gt._0;
  if (e >= Gt.A && e <= Gt.F)
    return e - (Gt.A - 10);
  if (e >= Gt.a && e <= Gt.f)
    return e - (Gt.a - 10);
}
function vr(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (vc)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let o = 0, i = 0; o < n; o++, i += 2) {
    const s = qs(e.charCodeAt(i)), l = qs(e.charCodeAt(i + 1));
    if (s === void 0 || l === void 0) {
      const f = e[i] + e[i + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + i);
    }
    r[o] = s * 16 + l;
  }
  return r;
}
function En(e) {
  return wc(Un(e));
}
function qn(e) {
  return Do(e), wc(Un(Uint8Array.from(e).reverse()));
}
function nr(e, t) {
  return vr(e.toString(16).padStart(t * 2, "0"));
}
function br(e, t) {
  return nr(e, t).reverse();
}
function ke(e, t, n) {
  let r;
  if (typeof t == "string")
    try {
      r = vr(t);
    } catch (i) {
      throw new Error(e + " must be hex string or Uint8Array, cause: " + i);
    }
  else if (tr(t))
    r = Uint8Array.from(t);
  else
    throw new Error(e + " must be hex string or Uint8Array");
  const o = r.length;
  if (typeof n == "number" && o !== n)
    throw new Error(e + " of length " + n + " expected, got " + o);
  return r;
}
function Dn(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    Do(o), t += o.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, o), o += i.length;
  }
  return n;
}
const Ui = (e) => typeof e == "bigint" && Uo <= e;
function Mo(e, t, n) {
  return Ui(e) && Ui(t) && Ui(n) && t <= e && e < n;
}
function Lt(e, t, n, r) {
  if (!Mo(t, n, r))
    throw new Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function Ff(e) {
  let t;
  for (t = 0; e > Uo; e >>= lo, t += 1)
    ;
  return t;
}
const qr = (e) => (lo << BigInt(e)) - lo, Di = (e) => new Uint8Array(e), Ws = (e) => Uint8Array.from(e);
function zf(e, t, n) {
  if (typeof e != "number" || e < 2)
    throw new Error("hashLen must be a number");
  if (typeof t != "number" || t < 2)
    throw new Error("qByteLen must be a number");
  if (typeof n != "function")
    throw new Error("hmacFn must be a function");
  let r = Di(e), o = Di(e), i = 0;
  const s = () => {
    r.fill(1), o.fill(0), i = 0;
  }, l = (...C) => n(o, r, ...C), f = (C = Di(0)) => {
    o = l(Ws([0]), C), r = l(), C.length !== 0 && (o = l(Ws([1]), C), r = l());
  }, m = () => {
    if (i++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let C = 0;
    const D = [];
    for (; C < t; ) {
      r = l();
      const v = r.slice();
      D.push(v), C += r.length;
    }
    return Dn(...D);
  };
  return (C, D) => {
    s(), f(C);
    let v;
    for (; !(v = D(m())); )
      f();
    return s(), v;
  };
}
const Vf = {
  bigint: (e) => typeof e == "bigint",
  function: (e) => typeof e == "function",
  boolean: (e) => typeof e == "boolean",
  string: (e) => typeof e == "string",
  stringOrUint8Array: (e) => typeof e == "string" || tr(e),
  isSafeInteger: (e) => Number.isSafeInteger(e),
  array: (e) => Array.isArray(e),
  field: (e, t) => t.Fp.isValid(e),
  hash: (e) => typeof e == "function" && Number.isSafeInteger(e.outputLen)
};
function rr(e, t, n = {}) {
  const r = (o, i, s) => {
    const l = Vf[i];
    if (typeof l != "function")
      throw new Error("invalid validator function");
    const f = e[o];
    if (!(s && f === void 0) && !l(f, e))
      throw new Error("param " + String(o) + " is invalid. Expected " + i + ", got " + f);
  };
  for (const [o, i] of Object.entries(t))
    r(o, i, !1);
  for (const [o, i] of Object.entries(n))
    r(o, i, !0);
  return e;
}
function Cr(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return (n, ...r) => {
    const o = t.get(n);
    if (o !== void 0)
      return o;
    const i = e(n, ...r);
    return t.set(n, i), i;
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const St = BigInt(0), ct = BigInt(1), Rn = /* @__PURE__ */ BigInt(2), Hf = /* @__PURE__ */ BigInt(3), bc = /* @__PURE__ */ BigInt(4), Cc = /* @__PURE__ */ BigInt(5), Lc = /* @__PURE__ */ BigInt(8);
function Le(e, t) {
  const n = e % t;
  return n >= St ? n : t + n;
}
function Be(e, t, n) {
  let r = e;
  for (; t-- > St; )
    r *= r, r %= n;
  return r;
}
function fo(e, t) {
  if (e === St)
    throw new Error("invert: expected non-zero number");
  if (t <= St)
    throw new Error("invert: expected positive modulus, got " + t);
  let n = Le(e, t), r = t, o = St, i = ct;
  for (; n !== St; ) {
    const l = r / n, f = r % n, m = o - i * l;
    r = n, n = f, o = i, i = m;
  }
  if (r !== ct)
    throw new Error("invert: does not exist");
  return Le(o, t);
}
function xc(e, t) {
  const n = (e.ORDER + ct) / bc, r = e.pow(t, n);
  if (!e.eql(e.sqr(r), t))
    throw new Error("Cannot find square root");
  return r;
}
function Gf(e, t) {
  const n = (e.ORDER - Cc) / Lc, r = e.mul(t, Rn), o = e.pow(r, n), i = e.mul(t, o), s = e.mul(e.mul(i, Rn), o), l = e.mul(i, e.sub(s, e.ONE));
  if (!e.eql(e.sqr(l), t))
    throw new Error("Cannot find square root");
  return l;
}
function Kf(e) {
  if (e < BigInt(3))
    throw new Error("sqrt is not defined for small field");
  let t = e - ct, n = 0;
  for (; t % Rn === St; )
    t /= Rn, n++;
  let r = Rn;
  const o = ir(e);
  for (; js(o, r) === 1; )
    if (r++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (n === 1)
    return xc;
  let i = o.pow(r, t);
  const s = (t + ct) / Rn;
  return function(f, m) {
    if (f.is0(m))
      return m;
    if (js(f, m) !== 1)
      throw new Error("Cannot find square root");
    let y = n, C = f.mul(f.ONE, i), D = f.pow(m, t), v = f.pow(m, s);
    for (; !f.eql(D, f.ONE); ) {
      if (f.is0(D))
        return f.ZERO;
      let M = 1, b = f.sqr(D);
      for (; !f.eql(b, f.ONE); )
        if (M++, b = f.sqr(b), M === y)
          throw new Error("Cannot find square root");
      const x = ct << BigInt(y - M - 1), q = f.pow(C, x);
      y = M, C = f.sqr(q), D = f.mul(D, C), v = f.mul(v, q);
    }
    return v;
  };
}
function qf(e) {
  return e % bc === Hf ? xc : e % Lc === Cc ? Gf : Kf(e);
}
const Wf = (e, t) => (Le(e, t) & ct) === ct, jf = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function Yf(e) {
  const t = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  }, n = jf.reduce((r, o) => (r[o] = "function", r), t);
  return rr(e, n);
}
function Xf(e, t, n) {
  if (n < St)
    throw new Error("invalid exponent, negatives unsupported");
  if (n === St)
    return e.ONE;
  if (n === ct)
    return t;
  let r = e.ONE, o = t;
  for (; n > St; )
    n & ct && (r = e.mul(r, o)), o = e.sqr(o), n >>= ct;
  return r;
}
function Bo(e, t, n = !1) {
  const r = new Array(t.length).fill(n ? e.ZERO : void 0), o = t.reduce((s, l, f) => e.is0(l) ? s : (r[f] = s, e.mul(s, l)), e.ONE), i = e.inv(o);
  return t.reduceRight((s, l, f) => e.is0(l) ? s : (r[f] = e.mul(s, r[f]), e.mul(s, l)), i), r;
}
function js(e, t) {
  const n = (e.ORDER - ct) / Rn, r = e.pow(t, n), o = e.eql(r, e.ONE), i = e.eql(r, e.ZERO), s = e.eql(r, e.neg(e.ONE));
  if (!o && !i && !s)
    throw new Error("invalid Legendre symbol result");
  return o ? 1 : i ? 0 : -1;
}
function Uc(e, t) {
  t !== void 0 && uo(t);
  const n = t !== void 0 ? t : e.toString(2).length, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
function ir(e, t, n = !1, r = {}) {
  if (e <= St)
    throw new Error("invalid field: expected ORDER > 0, got " + e);
  const { nBitLength: o, nByteLength: i } = Uc(e, t);
  if (i > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let s;
  const l = Object.freeze({
    ORDER: e,
    isLE: n,
    BITS: o,
    BYTES: i,
    MASK: qr(o),
    ZERO: St,
    ONE: ct,
    create: (f) => Le(f, e),
    isValid: (f) => {
      if (typeof f != "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof f);
      return St <= f && f < e;
    },
    is0: (f) => f === St,
    isOdd: (f) => (f & ct) === ct,
    neg: (f) => Le(-f, e),
    eql: (f, m) => f === m,
    sqr: (f) => Le(f * f, e),
    add: (f, m) => Le(f + m, e),
    sub: (f, m) => Le(f - m, e),
    mul: (f, m) => Le(f * m, e),
    pow: (f, m) => Xf(l, f, m),
    div: (f, m) => Le(f * fo(m, e), e),
    // Same as above, but doesn't normalize
    sqrN: (f) => f * f,
    addN: (f, m) => f + m,
    subN: (f, m) => f - m,
    mulN: (f, m) => f * m,
    inv: (f) => fo(f, e),
    sqrt: r.sqrt || ((f) => (s || (s = qf(e)), s(l, f))),
    toBytes: (f) => n ? br(f, i) : nr(f, i),
    fromBytes: (f) => {
      if (f.length !== i)
        throw new Error("Field.fromBytes: expected " + i + " bytes, got " + f.length);
      return n ? qn(f) : En(f);
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (f) => Bo(l, f),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (f, m, y) => y ? m : f
  });
  return Object.freeze(l);
}
function Dc(e) {
  if (typeof e != "bigint")
    throw new Error("field order must be bigint");
  const t = e.toString(2).length;
  return Math.ceil(t / 8);
}
function Mc(e) {
  const t = Dc(e);
  return t + Math.ceil(t / 2);
}
function Zf(e, t, n = !1) {
  const r = e.length, o = Dc(t), i = Mc(t);
  if (r < 16 || r < i || r > 1024)
    throw new Error("expected " + i + "-1024 bytes of input, got " + r);
  const s = n ? qn(e) : En(e), l = Le(s, t - ct) + ct;
  return n ? br(l, o) : nr(l, o);
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ys = BigInt(0), ho = BigInt(1);
function Mi(e, t) {
  const n = t.negate();
  return e ? n : t;
}
function Bc(e, t) {
  if (!Number.isSafeInteger(e) || e <= 0 || e > t)
    throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function Bi(e, t) {
  Bc(e, t);
  const n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), o = 2 ** e, i = qr(e), s = BigInt(e);
  return { windows: n, windowSize: r, mask: i, maxNumber: o, shiftBy: s };
}
function Xs(e, t, n) {
  const { windowSize: r, mask: o, maxNumber: i, shiftBy: s } = n;
  let l = Number(e & o), f = e >> s;
  l > r && (l -= i, f += ho);
  const m = t * r, y = m + Math.abs(l) - 1, C = l === 0, D = l < 0, v = t % 2 !== 0;
  return { nextN: f, offset: y, isZero: C, isNeg: D, isNegF: v, offsetF: m };
}
function Jf(e, t) {
  if (!Array.isArray(e))
    throw new Error("array expected");
  e.forEach((n, r) => {
    if (!(n instanceof t))
      throw new Error("invalid point at index " + r);
  });
}
function Qf(e, t) {
  if (!Array.isArray(e))
    throw new Error("array of scalars expected");
  e.forEach((n, r) => {
    if (!t.isValid(n))
      throw new Error("invalid scalar at index " + r);
  });
}
const Pi = /* @__PURE__ */ new WeakMap(), Pc = /* @__PURE__ */ new WeakMap();
function $i(e) {
  return Pc.get(e) || 1;
}
function $c(e, t) {
  return {
    constTimeNegate: Mi,
    hasPrecomputes(n) {
      return $i(n) !== 1;
    },
    // non-const time multiplication ladder
    unsafeLadder(n, r, o = e.ZERO) {
      let i = n;
      for (; r > Ys; )
        r & ho && (o = o.add(i)), i = i.double(), r >>= ho;
      return o;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(n, r) {
      const { windows: o, windowSize: i } = Bi(r, t), s = [];
      let l = n, f = l;
      for (let m = 0; m < o; m++) {
        f = l, s.push(f);
        for (let y = 1; y < i; y++)
          f = f.add(l), s.push(f);
        l = f.double();
      }
      return s;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(n, r, o) {
      let i = e.ZERO, s = e.BASE;
      const l = Bi(n, t);
      for (let f = 0; f < l.windows; f++) {
        const { nextN: m, offset: y, isZero: C, isNeg: D, isNegF: v, offsetF: M } = Xs(o, f, l);
        o = m, C ? s = s.add(Mi(v, r[M])) : i = i.add(Mi(D, r[y]));
      }
      return { p: i, f: s };
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(n, r, o, i = e.ZERO) {
      const s = Bi(n, t);
      for (let l = 0; l < s.windows && o !== Ys; l++) {
        const { nextN: f, offset: m, isZero: y, isNeg: C } = Xs(o, l, s);
        if (o = f, !y) {
          const D = r[m];
          i = i.add(C ? D.negate() : D);
        }
      }
      return i;
    },
    getPrecomputes(n, r, o) {
      let i = Pi.get(r);
      return i || (i = this.precomputeWindow(r, n), n !== 1 && Pi.set(r, o(i))), i;
    },
    wNAFCached(n, r, o) {
      const i = $i(n);
      return this.wNAF(i, this.getPrecomputes(i, n, o), r);
    },
    wNAFCachedUnsafe(n, r, o, i) {
      const s = $i(n);
      return s === 1 ? this.unsafeLadder(n, r, i) : this.wNAFUnsafe(s, this.getPrecomputes(s, n, o), r, i);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(n, r) {
      Bc(r, t), Pc.set(n, r), Pi.delete(n);
    }
  };
}
function kc(e, t, n, r) {
  Jf(n, e), Qf(r, t);
  const o = n.length, i = r.length;
  if (o !== i)
    throw new Error("arrays of points and scalars must have equal length");
  const s = e.ZERO, l = Ff(BigInt(o));
  let f = 1;
  l > 12 ? f = l - 3 : l > 4 ? f = l - 2 : l > 0 && (f = 2);
  const m = qr(f), y = new Array(Number(m) + 1).fill(s), C = Math.floor((t.BITS - 1) / f) * f;
  let D = s;
  for (let v = C; v >= 0; v -= f) {
    y.fill(s);
    for (let b = 0; b < i; b++) {
      const x = r[b], q = Number(x >> BigInt(v) & m);
      y[q] = y[q].add(n[b]);
    }
    let M = s;
    for (let b = y.length - 1, x = s; b > 0; b--)
      x = x.add(y[b]), M = M.add(x);
    if (D = D.add(M), v !== 0)
      for (let b = 0; b < f; b++)
        D = D.double();
  }
  return D;
}
function Po(e) {
  return Yf(e.Fp), rr(e, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  }), Object.freeze({
    ...Uc(e.n, e.nBitLength),
    ...e,
    p: e.Fp.ORDER
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Bt = BigInt(0), pt = BigInt(1), Zs = BigInt(2), eh = BigInt(8), th = { zip215: !0 };
function nh(e) {
  const t = Po(e);
  return rr(e, {
    hash: "function",
    a: "bigint",
    d: "bigint",
    randomBytes: "function"
  }, {
    adjustScalarBytes: "function",
    domain: "function",
    uvRatio: "function",
    mapToCurve: "function"
  }), Object.freeze({ ...t });
}
function rh(e) {
  const t = nh(e), { Fp: n, n: r, prehash: o, hash: i, randomBytes: s, nByteLength: l, h: f } = t, m = Zs << BigInt(l * 8) - pt, y = n.create, C = ir(t.n, t.nBitLength);
  function D(O, S) {
    const w = n.sqr(O), A = n.sqr(S), c = n.add(n.mul(t.a, w), A), u = n.add(n.ONE, n.mul(t.d, n.mul(w, A)));
    return n.eql(c, u);
  }
  if (!D(t.Gx, t.Gy))
    throw new Error("bad curve params: generator point");
  const v = t.uvRatio || ((O, S) => {
    try {
      return { isValid: !0, value: n.sqrt(O * n.inv(S)) };
    } catch {
      return { isValid: !1, value: Bt };
    }
  }), M = t.adjustScalarBytes || ((O) => O), b = t.domain || ((O, S, w) => {
    if (dn("phflag", w), S.length || w)
      throw new Error("Contexts/pre-hash are not supported");
    return O;
  });
  function x(O, S, w = !1) {
    const A = w ? pt : Bt;
    Lt("coordinate " + O, S, A, m);
  }
  function q(O) {
    if (!(O instanceof $))
      throw new Error("ExtendedPoint expected");
  }
  const X = Cr((O, S) => {
    const { ex: w, ey: A, ez: c } = O, u = O.is0();
    S == null && (S = u ? eh : n.inv(c));
    const E = y(w * S), T = y(A * S), U = y(c * S);
    if (u)
      return { x: Bt, y: pt };
    if (U !== pt)
      throw new Error("invZ was invalid");
    return { x: E, y: T };
  }), H = Cr((O) => {
    const { a: S, d: w } = t;
    if (O.is0())
      throw new Error("bad point: ZERO");
    const { ex: A, ey: c, ez: u, et: E } = O, T = y(A * A), U = y(c * c), z = y(u * u), ee = y(z * z), ie = y(T * S), me = y(z * y(ie + U)), _e = y(ee + y(w * y(T * U)));
    if (me !== _e)
      throw new Error("bad point: equation left != right (1)");
    const fe = y(A * c), Te = y(u * E);
    if (fe !== Te)
      throw new Error("bad point: equation left != right (2)");
    return !0;
  });
  class $ {
    constructor(S, w, A, c) {
      x("x", S), x("y", w), x("z", A, !0), x("t", c), this.ex = S, this.ey = w, this.ez = A, this.et = c, Object.freeze(this);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static fromAffine(S) {
      if (S instanceof $)
        throw new Error("extended point not allowed");
      const { x: w, y: A } = S || {};
      return x("x", w), x("y", A), new $(w, A, pt, y(w * A));
    }
    static normalizeZ(S) {
      const w = Bo(n, S.map((A) => A.ez));
      return S.map((A, c) => A.toAffine(w[c])).map($.fromAffine);
    }
    // Multiscalar Multiplication
    static msm(S, w) {
      return kc($, C, S, w);
    }
    // "Private method", don't use it directly
    _setWindowSize(S) {
      te.setWindowSize(this, S);
    }
    // Not required for fromHex(), which always creates valid points.
    // Could be useful for fromAffine().
    assertValidity() {
      H(this);
    }
    // Compare one point to another.
    equals(S) {
      q(S);
      const { ex: w, ey: A, ez: c } = this, { ex: u, ey: E, ez: T } = S, U = y(w * T), z = y(u * c), ee = y(A * T), ie = y(E * c);
      return U === z && ee === ie;
    }
    is0() {
      return this.equals($.ZERO);
    }
    negate() {
      return new $(y(-this.ex), this.ey, this.ez, y(-this.et));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a: S } = t, { ex: w, ey: A, ez: c } = this, u = y(w * w), E = y(A * A), T = y(Zs * y(c * c)), U = y(S * u), z = w + A, ee = y(y(z * z) - u - E), ie = U + E, me = ie - T, _e = U - E, fe = y(ee * me), Te = y(ie * _e), Re = y(ee * _e), ge = y(me * ie);
      return new $(fe, Te, ge, Re);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(S) {
      q(S);
      const { a: w, d: A } = t, { ex: c, ey: u, ez: E, et: T } = this, { ex: U, ey: z, ez: ee, et: ie } = S, me = y(c * U), _e = y(u * z), fe = y(T * A * ie), Te = y(E * ee), Re = y((c + u) * (U + z) - me - _e), ge = Te - fe, Dt = Te + fe, Ne = y(_e - w * me), be = y(Re * ge), On = y(Dt * Ne), we = y(Re * Ne), ye = y(ge * Dt);
      return new $(be, On, ye, we);
    }
    subtract(S) {
      return this.add(S.negate());
    }
    wNAF(S) {
      return te.wNAFCached(this, S, $.normalizeZ);
    }
    // Constant-time multiplication.
    multiply(S) {
      const w = S;
      Lt("scalar", w, pt, r);
      const { p: A, f: c } = this.wNAF(w);
      return $.normalizeZ([A, c])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Does NOT allow scalars higher than CURVE.n.
    // Accepts optional accumulator to merge with multiply (important for sparse scalars)
    multiplyUnsafe(S, w = $.ZERO) {
      const A = S;
      return Lt("scalar", A, Bt, r), A === Bt ? J : this.is0() || A === pt ? this : te.wNAFCachedUnsafe(this, A, $.normalizeZ, w);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Multiplies point by cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.multiplyUnsafe(f).is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return te.unsafeLadder(this, r).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(S) {
      return X(this, S);
    }
    clearCofactor() {
      const { h: S } = t;
      return S === pt ? this : this.multiplyUnsafe(S);
    }
    // Converts hash string or Uint8Array to Point.
    // Uses algo from RFC8032 5.1.3.
    static fromHex(S, w = !1) {
      const { d: A, a: c } = t, u = n.BYTES;
      S = ke("pointHex", S, u), dn("zip215", w);
      const E = S.slice(), T = S[u - 1];
      E[u - 1] = T & -129;
      const U = qn(E), z = w ? m : n.ORDER;
      Lt("pointHex.y", U, Bt, z);
      const ee = y(U * U), ie = y(ee - pt), me = y(A * ee - c);
      let { isValid: _e, value: fe } = v(ie, me);
      if (!_e)
        throw new Error("Point.fromHex: invalid y coordinate");
      const Te = (fe & pt) === pt, Re = (T & 128) !== 0;
      if (!w && fe === Bt && Re)
        throw new Error("Point.fromHex: x=0 and x_0=1");
      return Re !== Te && (fe = y(-fe)), $.fromAffine({ x: fe, y: U });
    }
    static fromPrivateKey(S) {
      const { scalar: w } = k(S);
      return K.multiply(w);
    }
    toRawBytes() {
      const { x: S, y: w } = this.toAffine(), A = br(w, n.BYTES);
      return A[A.length - 1] |= S & pt ? 128 : 0, A;
    }
    toHex() {
      return Un(this.toRawBytes());
    }
  }
  $.BASE = new $(t.Gx, t.Gy, pt, y(t.Gx * t.Gy)), $.ZERO = new $(Bt, pt, pt, Bt);
  const { BASE: K, ZERO: J } = $, te = $c($, l * 8);
  function re(O) {
    return Le(O, r);
  }
  function j(O) {
    return re(qn(O));
  }
  function k(O) {
    const S = n.BYTES;
    O = ke("private key", O, S);
    const w = ke("hashed private key", i(O), 2 * S), A = M(w.slice(0, S)), c = w.slice(S, 2 * S), u = j(A);
    return { head: A, prefix: c, scalar: u };
  }
  function P(O) {
    const { head: S, prefix: w, scalar: A } = k(O), c = K.multiply(A), u = c.toRawBytes();
    return { head: S, prefix: w, scalar: A, point: c, pointBytes: u };
  }
  function W(O) {
    return P(O).pointBytes;
  }
  function g(O = Uint8Array.of(), ...S) {
    const w = Dn(...S);
    return j(i(b(w, ke("context", O), !!o)));
  }
  function a(O, S, w = {}) {
    O = ke("message", O), o && (O = o(O));
    const { prefix: A, scalar: c, pointBytes: u } = P(S), E = g(w.context, A, O), T = K.multiply(E).toRawBytes(), U = g(w.context, T, u, O), z = re(E + U * c);
    Lt("signature.s", z, Bt, r);
    const ee = Dn(T, br(z, n.BYTES));
    return ke("result", ee, n.BYTES * 2);
  }
  const _ = th;
  function R(O, S, w, A = _) {
    const { context: c, zip215: u } = A, E = n.BYTES;
    O = ke("signature", O, 2 * E), S = ke("message", S), w = ke("publicKey", w, E), u !== void 0 && dn("zip215", u), o && (S = o(S));
    const T = qn(O.slice(E, 2 * E));
    let U, z, ee;
    try {
      U = $.fromHex(w, u), z = $.fromHex(O.slice(0, E), u), ee = K.multiplyUnsafe(T);
    } catch {
      return !1;
    }
    if (!u && U.isSmallOrder())
      return !1;
    const ie = g(c, z.toRawBytes(), U.toRawBytes(), S);
    return z.add(U.multiplyUnsafe(ie)).subtract(ee).clearCofactor().equals($.ZERO);
  }
  return K._setWindowSize(8), {
    CURVE: t,
    getPublicKey: W,
    sign: a,
    verify: R,
    ExtendedPoint: $,
    utils: {
      getExtendedPublicKey: P,
      /** ed25519 priv keys are uniform 32b. No need to check for modulo bias, like in secp256k1. */
      randomPrivateKey: () => s(n.BYTES),
      /**
       * We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
       * values. This slows down first getPublicKey() by milliseconds (see Speed section),
       * but allows to speed-up subsequent getPublicKey() calls up to 20x.
       * @param windowSize 2, 4, 8, 16
       */
      precompute(O = 8, S = $.BASE) {
        return S._setWindowSize(O), S.multiply(BigInt(3)), S;
      }
    }
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $o = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"), Js = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
BigInt(0);
const ih = BigInt(1), Qs = BigInt(2);
BigInt(3);
const oh = BigInt(5), sh = BigInt(8);
function ah(e) {
  const t = BigInt(10), n = BigInt(20), r = BigInt(40), o = BigInt(80), i = $o, l = e * e % i * e % i, f = Be(l, Qs, i) * l % i, m = Be(f, ih, i) * e % i, y = Be(m, oh, i) * m % i, C = Be(y, t, i) * y % i, D = Be(C, n, i) * C % i, v = Be(D, r, i) * D % i, M = Be(v, o, i) * v % i, b = Be(M, o, i) * v % i, x = Be(b, t, i) * y % i;
  return { pow_p_5_8: Be(x, Qs, i) * e % i, b2: l };
}
function ch(e) {
  return e[0] &= 248, e[31] &= 127, e[31] |= 64, e;
}
function uh(e, t) {
  const n = $o, r = Le(t * t * t, n), o = Le(r * r * t, n), i = ah(e * o).pow_p_5_8;
  let s = Le(e * r * i, n);
  const l = Le(t * s * s, n), f = s, m = Le(s * Js, n), y = l === e, C = l === Le(-e, n), D = l === Le(-e * Js, n);
  return y && (s = f), (C || D) && (s = m), Wf(s, n) && (s = Le(-s, n)), { isValid: y || C, value: s };
}
const ea = ir($o, void 0, !0), lh = {
  // Removing Fp.create() will still work, and is 10% faster on sign
  a: ea.create(BigInt(-1)),
  // d is -121665/121666 a.k.a. Fp.neg(121665 * Fp.inv(121666))
  d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
  // Finite field 2n**255n - 19n
  Fp: ea,
  // Subgroup order 2n**252n + 27742317777372353535851937790883648493n;
  n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
  h: sh,
  Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
  Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
  hash: $f,
  randomBytes: Nc,
  adjustScalarBytes: ch,
  // dom2
  // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
  // Constant-time, u/√v
  uvRatio: uh
}, ko = rh(lh);
var Sr = { exports: {} };
const dh = {}, fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dh
}, Symbol.toStringTag, { value: "Module" })), hh = /* @__PURE__ */ Co(fh);
var _h = Sr.exports, ta;
function Fc() {
  return ta || (ta = 1, (function(e) {
    (function(t, n) {
      function r(g, a) {
        if (!g) throw new Error(a || "Assertion failed");
      }
      function o(g, a) {
        g.super_ = a;
        var _ = function() {
        };
        _.prototype = a.prototype, g.prototype = new _(), g.prototype.constructor = g;
      }
      function i(g, a, _) {
        if (i.isBN(g))
          return g;
        this.negative = 0, this.words = null, this.length = 0, this.red = null, g !== null && ((a === "le" || a === "be") && (_ = a, a = 10), this._init(g || 0, a || 10, _ || "be"));
      }
      typeof t == "object" ? t.exports = i : n.BN = i, i.BN = i, i.wordSize = 26;
      var s;
      try {
        typeof window < "u" && typeof window.Buffer < "u" ? s = window.Buffer : s = hh.Buffer;
      } catch {
      }
      i.isBN = function(a) {
        return a instanceof i ? !0 : a !== null && typeof a == "object" && a.constructor.wordSize === i.wordSize && Array.isArray(a.words);
      }, i.max = function(a, _) {
        return a.cmp(_) > 0 ? a : _;
      }, i.min = function(a, _) {
        return a.cmp(_) < 0 ? a : _;
      }, i.prototype._init = function(a, _, R) {
        if (typeof a == "number")
          return this._initNumber(a, _, R);
        if (typeof a == "object")
          return this._initArray(a, _, R);
        _ === "hex" && (_ = 16), r(_ === (_ | 0) && _ >= 2 && _ <= 36), a = a.toString().replace(/\s+/g, "");
        var N = 0;
        a[0] === "-" && (N++, this.negative = 1), N < a.length && (_ === 16 ? this._parseHex(a, N, R) : (this._parseBase(a, _, N), R === "le" && this._initArray(this.toArray(), _, R)));
      }, i.prototype._initNumber = function(a, _, R) {
        a < 0 && (this.negative = 1, a = -a), a < 67108864 ? (this.words = [a & 67108863], this.length = 1) : a < 4503599627370496 ? (this.words = [
          a & 67108863,
          a / 67108864 & 67108863
        ], this.length = 2) : (r(a < 9007199254740992), this.words = [
          a & 67108863,
          a / 67108864 & 67108863,
          1
        ], this.length = 3), R === "le" && this._initArray(this.toArray(), _, R);
      }, i.prototype._initArray = function(a, _, R) {
        if (r(typeof a.length == "number"), a.length <= 0)
          return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(a.length / 3), this.words = new Array(this.length);
        for (var N = 0; N < this.length; N++)
          this.words[N] = 0;
        var O, S, w = 0;
        if (R === "be")
          for (N = a.length - 1, O = 0; N >= 0; N -= 3)
            S = a[N] | a[N - 1] << 8 | a[N - 2] << 16, this.words[O] |= S << w & 67108863, this.words[O + 1] = S >>> 26 - w & 67108863, w += 24, w >= 26 && (w -= 26, O++);
        else if (R === "le")
          for (N = 0, O = 0; N < a.length; N += 3)
            S = a[N] | a[N + 1] << 8 | a[N + 2] << 16, this.words[O] |= S << w & 67108863, this.words[O + 1] = S >>> 26 - w & 67108863, w += 24, w >= 26 && (w -= 26, O++);
        return this._strip();
      };
      function l(g, a) {
        var _ = g.charCodeAt(a);
        if (_ >= 48 && _ <= 57)
          return _ - 48;
        if (_ >= 65 && _ <= 70)
          return _ - 55;
        if (_ >= 97 && _ <= 102)
          return _ - 87;
        r(!1, "Invalid character in " + g);
      }
      function f(g, a, _) {
        var R = l(g, _);
        return _ - 1 >= a && (R |= l(g, _ - 1) << 4), R;
      }
      i.prototype._parseHex = function(a, _, R) {
        this.length = Math.ceil((a.length - _) / 6), this.words = new Array(this.length);
        for (var N = 0; N < this.length; N++)
          this.words[N] = 0;
        var O = 0, S = 0, w;
        if (R === "be")
          for (N = a.length - 1; N >= _; N -= 2)
            w = f(a, _, N) << O, this.words[S] |= w & 67108863, O >= 18 ? (O -= 18, S += 1, this.words[S] |= w >>> 26) : O += 8;
        else {
          var A = a.length - _;
          for (N = A % 2 === 0 ? _ + 1 : _; N < a.length; N += 2)
            w = f(a, _, N) << O, this.words[S] |= w & 67108863, O >= 18 ? (O -= 18, S += 1, this.words[S] |= w >>> 26) : O += 8;
        }
        this._strip();
      };
      function m(g, a, _, R) {
        for (var N = 0, O = 0, S = Math.min(g.length, _), w = a; w < S; w++) {
          var A = g.charCodeAt(w) - 48;
          N *= R, A >= 49 ? O = A - 49 + 10 : A >= 17 ? O = A - 17 + 10 : O = A, r(A >= 0 && O < R, "Invalid character"), N += O;
        }
        return N;
      }
      i.prototype._parseBase = function(a, _, R) {
        this.words = [0], this.length = 1;
        for (var N = 0, O = 1; O <= 67108863; O *= _)
          N++;
        N--, O = O / _ | 0;
        for (var S = a.length - R, w = S % N, A = Math.min(S, S - w) + R, c = 0, u = R; u < A; u += N)
          c = m(a, u, u + N, _), this.imuln(O), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
        if (w !== 0) {
          var E = 1;
          for (c = m(a, u, a.length, _), u = 0; u < w; u++)
            E *= _;
          this.imuln(E), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
        }
        this._strip();
      }, i.prototype.copy = function(a) {
        a.words = new Array(this.length);
        for (var _ = 0; _ < this.length; _++)
          a.words[_] = this.words[_];
        a.length = this.length, a.negative = this.negative, a.red = this.red;
      };
      function y(g, a) {
        g.words = a.words, g.length = a.length, g.negative = a.negative, g.red = a.red;
      }
      if (i.prototype._move = function(a) {
        y(a, this);
      }, i.prototype.clone = function() {
        var a = new i(null);
        return this.copy(a), a;
      }, i.prototype._expand = function(a) {
        for (; this.length < a; )
          this.words[this.length++] = 0;
        return this;
      }, i.prototype._strip = function() {
        for (; this.length > 1 && this.words[this.length - 1] === 0; )
          this.length--;
        return this._normSign();
      }, i.prototype._normSign = function() {
        return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
      }, typeof Symbol < "u" && typeof Symbol.for == "function")
        try {
          i.prototype[Symbol.for("nodejs.util.inspect.custom")] = C;
        } catch {
          i.prototype.inspect = C;
        }
      else
        i.prototype.inspect = C;
      function C() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      }
      var D = [
        "",
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000",
        "000000000000",
        "0000000000000",
        "00000000000000",
        "000000000000000",
        "0000000000000000",
        "00000000000000000",
        "000000000000000000",
        "0000000000000000000",
        "00000000000000000000",
        "000000000000000000000",
        "0000000000000000000000",
        "00000000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000"
      ], v = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ], M = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        1e7,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64e6,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        243e5,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
      ];
      i.prototype.toString = function(a, _) {
        a = a || 10, _ = _ | 0 || 1;
        var R;
        if (a === 16 || a === "hex") {
          R = "";
          for (var N = 0, O = 0, S = 0; S < this.length; S++) {
            var w = this.words[S], A = ((w << N | O) & 16777215).toString(16);
            O = w >>> 24 - N & 16777215, N += 2, N >= 26 && (N -= 26, S--), O !== 0 || S !== this.length - 1 ? R = D[6 - A.length] + A + R : R = A + R;
          }
          for (O !== 0 && (R = O.toString(16) + R); R.length % _ !== 0; )
            R = "0" + R;
          return this.negative !== 0 && (R = "-" + R), R;
        }
        if (a === (a | 0) && a >= 2 && a <= 36) {
          var c = v[a], u = M[a];
          R = "";
          var E = this.clone();
          for (E.negative = 0; !E.isZero(); ) {
            var T = E.modrn(u).toString(a);
            E = E.idivn(u), E.isZero() ? R = T + R : R = D[c - T.length] + T + R;
          }
          for (this.isZero() && (R = "0" + R); R.length % _ !== 0; )
            R = "0" + R;
          return this.negative !== 0 && (R = "-" + R), R;
        }
        r(!1, "Base should be between 2 and 36");
      }, i.prototype.toNumber = function() {
        var a = this.words[0];
        return this.length === 2 ? a += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? a += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && r(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -a : a;
      }, i.prototype.toJSON = function() {
        return this.toString(16, 2);
      }, s && (i.prototype.toBuffer = function(a, _) {
        return this.toArrayLike(s, a, _);
      }), i.prototype.toArray = function(a, _) {
        return this.toArrayLike(Array, a, _);
      };
      var b = function(a, _) {
        return a.allocUnsafe ? a.allocUnsafe(_) : new a(_);
      };
      i.prototype.toArrayLike = function(a, _, R) {
        this._strip();
        var N = this.byteLength(), O = R || Math.max(1, N);
        r(N <= O, "byte array longer than desired length"), r(O > 0, "Requested array length <= 0");
        var S = b(a, O), w = _ === "le" ? "LE" : "BE";
        return this["_toArrayLike" + w](S, N), S;
      }, i.prototype._toArrayLikeLE = function(a, _) {
        for (var R = 0, N = 0, O = 0, S = 0; O < this.length; O++) {
          var w = this.words[O] << S | N;
          a[R++] = w & 255, R < a.length && (a[R++] = w >> 8 & 255), R < a.length && (a[R++] = w >> 16 & 255), S === 6 ? (R < a.length && (a[R++] = w >> 24 & 255), N = 0, S = 0) : (N = w >>> 24, S += 2);
        }
        if (R < a.length)
          for (a[R++] = N; R < a.length; )
            a[R++] = 0;
      }, i.prototype._toArrayLikeBE = function(a, _) {
        for (var R = a.length - 1, N = 0, O = 0, S = 0; O < this.length; O++) {
          var w = this.words[O] << S | N;
          a[R--] = w & 255, R >= 0 && (a[R--] = w >> 8 & 255), R >= 0 && (a[R--] = w >> 16 & 255), S === 6 ? (R >= 0 && (a[R--] = w >> 24 & 255), N = 0, S = 0) : (N = w >>> 24, S += 2);
        }
        if (R >= 0)
          for (a[R--] = N; R >= 0; )
            a[R--] = 0;
      }, Math.clz32 ? i.prototype._countBits = function(a) {
        return 32 - Math.clz32(a);
      } : i.prototype._countBits = function(a) {
        var _ = a, R = 0;
        return _ >= 4096 && (R += 13, _ >>>= 13), _ >= 64 && (R += 7, _ >>>= 7), _ >= 8 && (R += 4, _ >>>= 4), _ >= 2 && (R += 2, _ >>>= 2), R + _;
      }, i.prototype._zeroBits = function(a) {
        if (a === 0) return 26;
        var _ = a, R = 0;
        return (_ & 8191) === 0 && (R += 13, _ >>>= 13), (_ & 127) === 0 && (R += 7, _ >>>= 7), (_ & 15) === 0 && (R += 4, _ >>>= 4), (_ & 3) === 0 && (R += 2, _ >>>= 2), (_ & 1) === 0 && R++, R;
      }, i.prototype.bitLength = function() {
        var a = this.words[this.length - 1], _ = this._countBits(a);
        return (this.length - 1) * 26 + _;
      };
      function x(g) {
        for (var a = new Array(g.bitLength()), _ = 0; _ < a.length; _++) {
          var R = _ / 26 | 0, N = _ % 26;
          a[_] = g.words[R] >>> N & 1;
        }
        return a;
      }
      i.prototype.zeroBits = function() {
        if (this.isZero()) return 0;
        for (var a = 0, _ = 0; _ < this.length; _++) {
          var R = this._zeroBits(this.words[_]);
          if (a += R, R !== 26) break;
        }
        return a;
      }, i.prototype.byteLength = function() {
        return Math.ceil(this.bitLength() / 8);
      }, i.prototype.toTwos = function(a) {
        return this.negative !== 0 ? this.abs().inotn(a).iaddn(1) : this.clone();
      }, i.prototype.fromTwos = function(a) {
        return this.testn(a - 1) ? this.notn(a).iaddn(1).ineg() : this.clone();
      }, i.prototype.isNeg = function() {
        return this.negative !== 0;
      }, i.prototype.neg = function() {
        return this.clone().ineg();
      }, i.prototype.ineg = function() {
        return this.isZero() || (this.negative ^= 1), this;
      }, i.prototype.iuor = function(a) {
        for (; this.length < a.length; )
          this.words[this.length++] = 0;
        for (var _ = 0; _ < a.length; _++)
          this.words[_] = this.words[_] | a.words[_];
        return this._strip();
      }, i.prototype.ior = function(a) {
        return r((this.negative | a.negative) === 0), this.iuor(a);
      }, i.prototype.or = function(a) {
        return this.length > a.length ? this.clone().ior(a) : a.clone().ior(this);
      }, i.prototype.uor = function(a) {
        return this.length > a.length ? this.clone().iuor(a) : a.clone().iuor(this);
      }, i.prototype.iuand = function(a) {
        var _;
        this.length > a.length ? _ = a : _ = this;
        for (var R = 0; R < _.length; R++)
          this.words[R] = this.words[R] & a.words[R];
        return this.length = _.length, this._strip();
      }, i.prototype.iand = function(a) {
        return r((this.negative | a.negative) === 0), this.iuand(a);
      }, i.prototype.and = function(a) {
        return this.length > a.length ? this.clone().iand(a) : a.clone().iand(this);
      }, i.prototype.uand = function(a) {
        return this.length > a.length ? this.clone().iuand(a) : a.clone().iuand(this);
      }, i.prototype.iuxor = function(a) {
        var _, R;
        this.length > a.length ? (_ = this, R = a) : (_ = a, R = this);
        for (var N = 0; N < R.length; N++)
          this.words[N] = _.words[N] ^ R.words[N];
        if (this !== _)
          for (; N < _.length; N++)
            this.words[N] = _.words[N];
        return this.length = _.length, this._strip();
      }, i.prototype.ixor = function(a) {
        return r((this.negative | a.negative) === 0), this.iuxor(a);
      }, i.prototype.xor = function(a) {
        return this.length > a.length ? this.clone().ixor(a) : a.clone().ixor(this);
      }, i.prototype.uxor = function(a) {
        return this.length > a.length ? this.clone().iuxor(a) : a.clone().iuxor(this);
      }, i.prototype.inotn = function(a) {
        r(typeof a == "number" && a >= 0);
        var _ = Math.ceil(a / 26) | 0, R = a % 26;
        this._expand(_), R > 0 && _--;
        for (var N = 0; N < _; N++)
          this.words[N] = ~this.words[N] & 67108863;
        return R > 0 && (this.words[N] = ~this.words[N] & 67108863 >> 26 - R), this._strip();
      }, i.prototype.notn = function(a) {
        return this.clone().inotn(a);
      }, i.prototype.setn = function(a, _) {
        r(typeof a == "number" && a >= 0);
        var R = a / 26 | 0, N = a % 26;
        return this._expand(R + 1), _ ? this.words[R] = this.words[R] | 1 << N : this.words[R] = this.words[R] & ~(1 << N), this._strip();
      }, i.prototype.iadd = function(a) {
        var _;
        if (this.negative !== 0 && a.negative === 0)
          return this.negative = 0, _ = this.isub(a), this.negative ^= 1, this._normSign();
        if (this.negative === 0 && a.negative !== 0)
          return a.negative = 0, _ = this.isub(a), a.negative = 1, _._normSign();
        var R, N;
        this.length > a.length ? (R = this, N = a) : (R = a, N = this);
        for (var O = 0, S = 0; S < N.length; S++)
          _ = (R.words[S] | 0) + (N.words[S] | 0) + O, this.words[S] = _ & 67108863, O = _ >>> 26;
        for (; O !== 0 && S < R.length; S++)
          _ = (R.words[S] | 0) + O, this.words[S] = _ & 67108863, O = _ >>> 26;
        if (this.length = R.length, O !== 0)
          this.words[this.length] = O, this.length++;
        else if (R !== this)
          for (; S < R.length; S++)
            this.words[S] = R.words[S];
        return this;
      }, i.prototype.add = function(a) {
        var _;
        return a.negative !== 0 && this.negative === 0 ? (a.negative = 0, _ = this.sub(a), a.negative ^= 1, _) : a.negative === 0 && this.negative !== 0 ? (this.negative = 0, _ = a.sub(this), this.negative = 1, _) : this.length > a.length ? this.clone().iadd(a) : a.clone().iadd(this);
      }, i.prototype.isub = function(a) {
        if (a.negative !== 0) {
          a.negative = 0;
          var _ = this.iadd(a);
          return a.negative = 1, _._normSign();
        } else if (this.negative !== 0)
          return this.negative = 0, this.iadd(a), this.negative = 1, this._normSign();
        var R = this.cmp(a);
        if (R === 0)
          return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        var N, O;
        R > 0 ? (N = this, O = a) : (N = a, O = this);
        for (var S = 0, w = 0; w < O.length; w++)
          _ = (N.words[w] | 0) - (O.words[w] | 0) + S, S = _ >> 26, this.words[w] = _ & 67108863;
        for (; S !== 0 && w < N.length; w++)
          _ = (N.words[w] | 0) + S, S = _ >> 26, this.words[w] = _ & 67108863;
        if (S === 0 && w < N.length && N !== this)
          for (; w < N.length; w++)
            this.words[w] = N.words[w];
        return this.length = Math.max(this.length, w), N !== this && (this.negative = 1), this._strip();
      }, i.prototype.sub = function(a) {
        return this.clone().isub(a);
      };
      function q(g, a, _) {
        _.negative = a.negative ^ g.negative;
        var R = g.length + a.length | 0;
        _.length = R, R = R - 1 | 0;
        var N = g.words[0] | 0, O = a.words[0] | 0, S = N * O, w = S & 67108863, A = S / 67108864 | 0;
        _.words[0] = w;
        for (var c = 1; c < R; c++) {
          for (var u = A >>> 26, E = A & 67108863, T = Math.min(c, a.length - 1), U = Math.max(0, c - g.length + 1); U <= T; U++) {
            var z = c - U | 0;
            N = g.words[z] | 0, O = a.words[U] | 0, S = N * O + E, u += S / 67108864 | 0, E = S & 67108863;
          }
          _.words[c] = E | 0, A = u | 0;
        }
        return A !== 0 ? _.words[c] = A | 0 : _.length--, _._strip();
      }
      var X = function(a, _, R) {
        var N = a.words, O = _.words, S = R.words, w = 0, A, c, u, E = N[0] | 0, T = E & 8191, U = E >>> 13, z = N[1] | 0, ee = z & 8191, ie = z >>> 13, me = N[2] | 0, _e = me & 8191, fe = me >>> 13, Te = N[3] | 0, Re = Te & 8191, ge = Te >>> 13, Dt = N[4] | 0, Ne = Dt & 8191, be = Dt >>> 13, On = N[5] | 0, we = On & 8191, ye = On >>> 13, Nt = N[6] | 0, Ce = Nt & 8191, Ue = Nt >>> 13, vt = N[7] | 0, De = vt & 8191, p = vt >>> 13, d = N[8] | 0, h = d & 8191, I = d >>> 13, B = N[9] | 0, F = B & 8191, Y = B >>> 13, Ee = O[0] | 0, de = Ee & 8191, ue = Ee >>> 13, ve = O[1] | 0, ce = ve & 8191, Fe = ve >>> 13, us = O[2] | 0, ze = us & 8191, Ve = us >>> 13, ls = O[3] | 0, He = ls & 8191, Ge = ls >>> 13, ds = O[4] | 0, Ke = ds & 8191, qe = ds >>> 13, fs = O[5] | 0, We = fs & 8191, je = fs >>> 13, hs = O[6] | 0, Ye = hs & 8191, Xe = hs >>> 13, _s = O[7] | 0, Ze = _s & 8191, Je = _s >>> 13, Rs = O[8] | 0, Qe = Rs & 8191, et = Rs >>> 13, Es = O[9] | 0, tt = Es & 8191, nt = Es >>> 13;
        R.negative = a.negative ^ _.negative, R.length = 19, A = Math.imul(T, de), c = Math.imul(T, ue), c = c + Math.imul(U, de) | 0, u = Math.imul(U, ue);
        var ni = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (ni >>> 26) | 0, ni &= 67108863, A = Math.imul(ee, de), c = Math.imul(ee, ue), c = c + Math.imul(ie, de) | 0, u = Math.imul(ie, ue), A = A + Math.imul(T, ce) | 0, c = c + Math.imul(T, Fe) | 0, c = c + Math.imul(U, ce) | 0, u = u + Math.imul(U, Fe) | 0;
        var ri = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (ri >>> 26) | 0, ri &= 67108863, A = Math.imul(_e, de), c = Math.imul(_e, ue), c = c + Math.imul(fe, de) | 0, u = Math.imul(fe, ue), A = A + Math.imul(ee, ce) | 0, c = c + Math.imul(ee, Fe) | 0, c = c + Math.imul(ie, ce) | 0, u = u + Math.imul(ie, Fe) | 0, A = A + Math.imul(T, ze) | 0, c = c + Math.imul(T, Ve) | 0, c = c + Math.imul(U, ze) | 0, u = u + Math.imul(U, Ve) | 0;
        var ii = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (ii >>> 26) | 0, ii &= 67108863, A = Math.imul(Re, de), c = Math.imul(Re, ue), c = c + Math.imul(ge, de) | 0, u = Math.imul(ge, ue), A = A + Math.imul(_e, ce) | 0, c = c + Math.imul(_e, Fe) | 0, c = c + Math.imul(fe, ce) | 0, u = u + Math.imul(fe, Fe) | 0, A = A + Math.imul(ee, ze) | 0, c = c + Math.imul(ee, Ve) | 0, c = c + Math.imul(ie, ze) | 0, u = u + Math.imul(ie, Ve) | 0, A = A + Math.imul(T, He) | 0, c = c + Math.imul(T, Ge) | 0, c = c + Math.imul(U, He) | 0, u = u + Math.imul(U, Ge) | 0;
        var oi = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (oi >>> 26) | 0, oi &= 67108863, A = Math.imul(Ne, de), c = Math.imul(Ne, ue), c = c + Math.imul(be, de) | 0, u = Math.imul(be, ue), A = A + Math.imul(Re, ce) | 0, c = c + Math.imul(Re, Fe) | 0, c = c + Math.imul(ge, ce) | 0, u = u + Math.imul(ge, Fe) | 0, A = A + Math.imul(_e, ze) | 0, c = c + Math.imul(_e, Ve) | 0, c = c + Math.imul(fe, ze) | 0, u = u + Math.imul(fe, Ve) | 0, A = A + Math.imul(ee, He) | 0, c = c + Math.imul(ee, Ge) | 0, c = c + Math.imul(ie, He) | 0, u = u + Math.imul(ie, Ge) | 0, A = A + Math.imul(T, Ke) | 0, c = c + Math.imul(T, qe) | 0, c = c + Math.imul(U, Ke) | 0, u = u + Math.imul(U, qe) | 0;
        var si = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (si >>> 26) | 0, si &= 67108863, A = Math.imul(we, de), c = Math.imul(we, ue), c = c + Math.imul(ye, de) | 0, u = Math.imul(ye, ue), A = A + Math.imul(Ne, ce) | 0, c = c + Math.imul(Ne, Fe) | 0, c = c + Math.imul(be, ce) | 0, u = u + Math.imul(be, Fe) | 0, A = A + Math.imul(Re, ze) | 0, c = c + Math.imul(Re, Ve) | 0, c = c + Math.imul(ge, ze) | 0, u = u + Math.imul(ge, Ve) | 0, A = A + Math.imul(_e, He) | 0, c = c + Math.imul(_e, Ge) | 0, c = c + Math.imul(fe, He) | 0, u = u + Math.imul(fe, Ge) | 0, A = A + Math.imul(ee, Ke) | 0, c = c + Math.imul(ee, qe) | 0, c = c + Math.imul(ie, Ke) | 0, u = u + Math.imul(ie, qe) | 0, A = A + Math.imul(T, We) | 0, c = c + Math.imul(T, je) | 0, c = c + Math.imul(U, We) | 0, u = u + Math.imul(U, je) | 0;
        var ai = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (ai >>> 26) | 0, ai &= 67108863, A = Math.imul(Ce, de), c = Math.imul(Ce, ue), c = c + Math.imul(Ue, de) | 0, u = Math.imul(Ue, ue), A = A + Math.imul(we, ce) | 0, c = c + Math.imul(we, Fe) | 0, c = c + Math.imul(ye, ce) | 0, u = u + Math.imul(ye, Fe) | 0, A = A + Math.imul(Ne, ze) | 0, c = c + Math.imul(Ne, Ve) | 0, c = c + Math.imul(be, ze) | 0, u = u + Math.imul(be, Ve) | 0, A = A + Math.imul(Re, He) | 0, c = c + Math.imul(Re, Ge) | 0, c = c + Math.imul(ge, He) | 0, u = u + Math.imul(ge, Ge) | 0, A = A + Math.imul(_e, Ke) | 0, c = c + Math.imul(_e, qe) | 0, c = c + Math.imul(fe, Ke) | 0, u = u + Math.imul(fe, qe) | 0, A = A + Math.imul(ee, We) | 0, c = c + Math.imul(ee, je) | 0, c = c + Math.imul(ie, We) | 0, u = u + Math.imul(ie, je) | 0, A = A + Math.imul(T, Ye) | 0, c = c + Math.imul(T, Xe) | 0, c = c + Math.imul(U, Ye) | 0, u = u + Math.imul(U, Xe) | 0;
        var ci = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (ci >>> 26) | 0, ci &= 67108863, A = Math.imul(De, de), c = Math.imul(De, ue), c = c + Math.imul(p, de) | 0, u = Math.imul(p, ue), A = A + Math.imul(Ce, ce) | 0, c = c + Math.imul(Ce, Fe) | 0, c = c + Math.imul(Ue, ce) | 0, u = u + Math.imul(Ue, Fe) | 0, A = A + Math.imul(we, ze) | 0, c = c + Math.imul(we, Ve) | 0, c = c + Math.imul(ye, ze) | 0, u = u + Math.imul(ye, Ve) | 0, A = A + Math.imul(Ne, He) | 0, c = c + Math.imul(Ne, Ge) | 0, c = c + Math.imul(be, He) | 0, u = u + Math.imul(be, Ge) | 0, A = A + Math.imul(Re, Ke) | 0, c = c + Math.imul(Re, qe) | 0, c = c + Math.imul(ge, Ke) | 0, u = u + Math.imul(ge, qe) | 0, A = A + Math.imul(_e, We) | 0, c = c + Math.imul(_e, je) | 0, c = c + Math.imul(fe, We) | 0, u = u + Math.imul(fe, je) | 0, A = A + Math.imul(ee, Ye) | 0, c = c + Math.imul(ee, Xe) | 0, c = c + Math.imul(ie, Ye) | 0, u = u + Math.imul(ie, Xe) | 0, A = A + Math.imul(T, Ze) | 0, c = c + Math.imul(T, Je) | 0, c = c + Math.imul(U, Ze) | 0, u = u + Math.imul(U, Je) | 0;
        var ui = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (ui >>> 26) | 0, ui &= 67108863, A = Math.imul(h, de), c = Math.imul(h, ue), c = c + Math.imul(I, de) | 0, u = Math.imul(I, ue), A = A + Math.imul(De, ce) | 0, c = c + Math.imul(De, Fe) | 0, c = c + Math.imul(p, ce) | 0, u = u + Math.imul(p, Fe) | 0, A = A + Math.imul(Ce, ze) | 0, c = c + Math.imul(Ce, Ve) | 0, c = c + Math.imul(Ue, ze) | 0, u = u + Math.imul(Ue, Ve) | 0, A = A + Math.imul(we, He) | 0, c = c + Math.imul(we, Ge) | 0, c = c + Math.imul(ye, He) | 0, u = u + Math.imul(ye, Ge) | 0, A = A + Math.imul(Ne, Ke) | 0, c = c + Math.imul(Ne, qe) | 0, c = c + Math.imul(be, Ke) | 0, u = u + Math.imul(be, qe) | 0, A = A + Math.imul(Re, We) | 0, c = c + Math.imul(Re, je) | 0, c = c + Math.imul(ge, We) | 0, u = u + Math.imul(ge, je) | 0, A = A + Math.imul(_e, Ye) | 0, c = c + Math.imul(_e, Xe) | 0, c = c + Math.imul(fe, Ye) | 0, u = u + Math.imul(fe, Xe) | 0, A = A + Math.imul(ee, Ze) | 0, c = c + Math.imul(ee, Je) | 0, c = c + Math.imul(ie, Ze) | 0, u = u + Math.imul(ie, Je) | 0, A = A + Math.imul(T, Qe) | 0, c = c + Math.imul(T, et) | 0, c = c + Math.imul(U, Qe) | 0, u = u + Math.imul(U, et) | 0;
        var li = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (li >>> 26) | 0, li &= 67108863, A = Math.imul(F, de), c = Math.imul(F, ue), c = c + Math.imul(Y, de) | 0, u = Math.imul(Y, ue), A = A + Math.imul(h, ce) | 0, c = c + Math.imul(h, Fe) | 0, c = c + Math.imul(I, ce) | 0, u = u + Math.imul(I, Fe) | 0, A = A + Math.imul(De, ze) | 0, c = c + Math.imul(De, Ve) | 0, c = c + Math.imul(p, ze) | 0, u = u + Math.imul(p, Ve) | 0, A = A + Math.imul(Ce, He) | 0, c = c + Math.imul(Ce, Ge) | 0, c = c + Math.imul(Ue, He) | 0, u = u + Math.imul(Ue, Ge) | 0, A = A + Math.imul(we, Ke) | 0, c = c + Math.imul(we, qe) | 0, c = c + Math.imul(ye, Ke) | 0, u = u + Math.imul(ye, qe) | 0, A = A + Math.imul(Ne, We) | 0, c = c + Math.imul(Ne, je) | 0, c = c + Math.imul(be, We) | 0, u = u + Math.imul(be, je) | 0, A = A + Math.imul(Re, Ye) | 0, c = c + Math.imul(Re, Xe) | 0, c = c + Math.imul(ge, Ye) | 0, u = u + Math.imul(ge, Xe) | 0, A = A + Math.imul(_e, Ze) | 0, c = c + Math.imul(_e, Je) | 0, c = c + Math.imul(fe, Ze) | 0, u = u + Math.imul(fe, Je) | 0, A = A + Math.imul(ee, Qe) | 0, c = c + Math.imul(ee, et) | 0, c = c + Math.imul(ie, Qe) | 0, u = u + Math.imul(ie, et) | 0, A = A + Math.imul(T, tt) | 0, c = c + Math.imul(T, nt) | 0, c = c + Math.imul(U, tt) | 0, u = u + Math.imul(U, nt) | 0;
        var di = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (di >>> 26) | 0, di &= 67108863, A = Math.imul(F, ce), c = Math.imul(F, Fe), c = c + Math.imul(Y, ce) | 0, u = Math.imul(Y, Fe), A = A + Math.imul(h, ze) | 0, c = c + Math.imul(h, Ve) | 0, c = c + Math.imul(I, ze) | 0, u = u + Math.imul(I, Ve) | 0, A = A + Math.imul(De, He) | 0, c = c + Math.imul(De, Ge) | 0, c = c + Math.imul(p, He) | 0, u = u + Math.imul(p, Ge) | 0, A = A + Math.imul(Ce, Ke) | 0, c = c + Math.imul(Ce, qe) | 0, c = c + Math.imul(Ue, Ke) | 0, u = u + Math.imul(Ue, qe) | 0, A = A + Math.imul(we, We) | 0, c = c + Math.imul(we, je) | 0, c = c + Math.imul(ye, We) | 0, u = u + Math.imul(ye, je) | 0, A = A + Math.imul(Ne, Ye) | 0, c = c + Math.imul(Ne, Xe) | 0, c = c + Math.imul(be, Ye) | 0, u = u + Math.imul(be, Xe) | 0, A = A + Math.imul(Re, Ze) | 0, c = c + Math.imul(Re, Je) | 0, c = c + Math.imul(ge, Ze) | 0, u = u + Math.imul(ge, Je) | 0, A = A + Math.imul(_e, Qe) | 0, c = c + Math.imul(_e, et) | 0, c = c + Math.imul(fe, Qe) | 0, u = u + Math.imul(fe, et) | 0, A = A + Math.imul(ee, tt) | 0, c = c + Math.imul(ee, nt) | 0, c = c + Math.imul(ie, tt) | 0, u = u + Math.imul(ie, nt) | 0;
        var fi = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (fi >>> 26) | 0, fi &= 67108863, A = Math.imul(F, ze), c = Math.imul(F, Ve), c = c + Math.imul(Y, ze) | 0, u = Math.imul(Y, Ve), A = A + Math.imul(h, He) | 0, c = c + Math.imul(h, Ge) | 0, c = c + Math.imul(I, He) | 0, u = u + Math.imul(I, Ge) | 0, A = A + Math.imul(De, Ke) | 0, c = c + Math.imul(De, qe) | 0, c = c + Math.imul(p, Ke) | 0, u = u + Math.imul(p, qe) | 0, A = A + Math.imul(Ce, We) | 0, c = c + Math.imul(Ce, je) | 0, c = c + Math.imul(Ue, We) | 0, u = u + Math.imul(Ue, je) | 0, A = A + Math.imul(we, Ye) | 0, c = c + Math.imul(we, Xe) | 0, c = c + Math.imul(ye, Ye) | 0, u = u + Math.imul(ye, Xe) | 0, A = A + Math.imul(Ne, Ze) | 0, c = c + Math.imul(Ne, Je) | 0, c = c + Math.imul(be, Ze) | 0, u = u + Math.imul(be, Je) | 0, A = A + Math.imul(Re, Qe) | 0, c = c + Math.imul(Re, et) | 0, c = c + Math.imul(ge, Qe) | 0, u = u + Math.imul(ge, et) | 0, A = A + Math.imul(_e, tt) | 0, c = c + Math.imul(_e, nt) | 0, c = c + Math.imul(fe, tt) | 0, u = u + Math.imul(fe, nt) | 0;
        var hi = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (hi >>> 26) | 0, hi &= 67108863, A = Math.imul(F, He), c = Math.imul(F, Ge), c = c + Math.imul(Y, He) | 0, u = Math.imul(Y, Ge), A = A + Math.imul(h, Ke) | 0, c = c + Math.imul(h, qe) | 0, c = c + Math.imul(I, Ke) | 0, u = u + Math.imul(I, qe) | 0, A = A + Math.imul(De, We) | 0, c = c + Math.imul(De, je) | 0, c = c + Math.imul(p, We) | 0, u = u + Math.imul(p, je) | 0, A = A + Math.imul(Ce, Ye) | 0, c = c + Math.imul(Ce, Xe) | 0, c = c + Math.imul(Ue, Ye) | 0, u = u + Math.imul(Ue, Xe) | 0, A = A + Math.imul(we, Ze) | 0, c = c + Math.imul(we, Je) | 0, c = c + Math.imul(ye, Ze) | 0, u = u + Math.imul(ye, Je) | 0, A = A + Math.imul(Ne, Qe) | 0, c = c + Math.imul(Ne, et) | 0, c = c + Math.imul(be, Qe) | 0, u = u + Math.imul(be, et) | 0, A = A + Math.imul(Re, tt) | 0, c = c + Math.imul(Re, nt) | 0, c = c + Math.imul(ge, tt) | 0, u = u + Math.imul(ge, nt) | 0;
        var _i = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (_i >>> 26) | 0, _i &= 67108863, A = Math.imul(F, Ke), c = Math.imul(F, qe), c = c + Math.imul(Y, Ke) | 0, u = Math.imul(Y, qe), A = A + Math.imul(h, We) | 0, c = c + Math.imul(h, je) | 0, c = c + Math.imul(I, We) | 0, u = u + Math.imul(I, je) | 0, A = A + Math.imul(De, Ye) | 0, c = c + Math.imul(De, Xe) | 0, c = c + Math.imul(p, Ye) | 0, u = u + Math.imul(p, Xe) | 0, A = A + Math.imul(Ce, Ze) | 0, c = c + Math.imul(Ce, Je) | 0, c = c + Math.imul(Ue, Ze) | 0, u = u + Math.imul(Ue, Je) | 0, A = A + Math.imul(we, Qe) | 0, c = c + Math.imul(we, et) | 0, c = c + Math.imul(ye, Qe) | 0, u = u + Math.imul(ye, et) | 0, A = A + Math.imul(Ne, tt) | 0, c = c + Math.imul(Ne, nt) | 0, c = c + Math.imul(be, tt) | 0, u = u + Math.imul(be, nt) | 0;
        var Ri = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (Ri >>> 26) | 0, Ri &= 67108863, A = Math.imul(F, We), c = Math.imul(F, je), c = c + Math.imul(Y, We) | 0, u = Math.imul(Y, je), A = A + Math.imul(h, Ye) | 0, c = c + Math.imul(h, Xe) | 0, c = c + Math.imul(I, Ye) | 0, u = u + Math.imul(I, Xe) | 0, A = A + Math.imul(De, Ze) | 0, c = c + Math.imul(De, Je) | 0, c = c + Math.imul(p, Ze) | 0, u = u + Math.imul(p, Je) | 0, A = A + Math.imul(Ce, Qe) | 0, c = c + Math.imul(Ce, et) | 0, c = c + Math.imul(Ue, Qe) | 0, u = u + Math.imul(Ue, et) | 0, A = A + Math.imul(we, tt) | 0, c = c + Math.imul(we, nt) | 0, c = c + Math.imul(ye, tt) | 0, u = u + Math.imul(ye, nt) | 0;
        var Ei = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (Ei >>> 26) | 0, Ei &= 67108863, A = Math.imul(F, Ye), c = Math.imul(F, Xe), c = c + Math.imul(Y, Ye) | 0, u = Math.imul(Y, Xe), A = A + Math.imul(h, Ze) | 0, c = c + Math.imul(h, Je) | 0, c = c + Math.imul(I, Ze) | 0, u = u + Math.imul(I, Je) | 0, A = A + Math.imul(De, Qe) | 0, c = c + Math.imul(De, et) | 0, c = c + Math.imul(p, Qe) | 0, u = u + Math.imul(p, et) | 0, A = A + Math.imul(Ce, tt) | 0, c = c + Math.imul(Ce, nt) | 0, c = c + Math.imul(Ue, tt) | 0, u = u + Math.imul(Ue, nt) | 0;
        var pi = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (pi >>> 26) | 0, pi &= 67108863, A = Math.imul(F, Ze), c = Math.imul(F, Je), c = c + Math.imul(Y, Ze) | 0, u = Math.imul(Y, Je), A = A + Math.imul(h, Qe) | 0, c = c + Math.imul(h, et) | 0, c = c + Math.imul(I, Qe) | 0, u = u + Math.imul(I, et) | 0, A = A + Math.imul(De, tt) | 0, c = c + Math.imul(De, nt) | 0, c = c + Math.imul(p, tt) | 0, u = u + Math.imul(p, nt) | 0;
        var Ai = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (Ai >>> 26) | 0, Ai &= 67108863, A = Math.imul(F, Qe), c = Math.imul(F, et), c = c + Math.imul(Y, Qe) | 0, u = Math.imul(Y, et), A = A + Math.imul(h, tt) | 0, c = c + Math.imul(h, nt) | 0, c = c + Math.imul(I, tt) | 0, u = u + Math.imul(I, nt) | 0;
        var gi = (w + A | 0) + ((c & 8191) << 13) | 0;
        w = (u + (c >>> 13) | 0) + (gi >>> 26) | 0, gi &= 67108863, A = Math.imul(F, tt), c = Math.imul(F, nt), c = c + Math.imul(Y, tt) | 0, u = Math.imul(Y, nt);
        var mi = (w + A | 0) + ((c & 8191) << 13) | 0;
        return w = (u + (c >>> 13) | 0) + (mi >>> 26) | 0, mi &= 67108863, S[0] = ni, S[1] = ri, S[2] = ii, S[3] = oi, S[4] = si, S[5] = ai, S[6] = ci, S[7] = ui, S[8] = li, S[9] = di, S[10] = fi, S[11] = hi, S[12] = _i, S[13] = Ri, S[14] = Ei, S[15] = pi, S[16] = Ai, S[17] = gi, S[18] = mi, w !== 0 && (S[19] = w, R.length++), R;
      };
      Math.imul || (X = q);
      function H(g, a, _) {
        _.negative = a.negative ^ g.negative, _.length = g.length + a.length;
        for (var R = 0, N = 0, O = 0; O < _.length - 1; O++) {
          var S = N;
          N = 0;
          for (var w = R & 67108863, A = Math.min(O, a.length - 1), c = Math.max(0, O - g.length + 1); c <= A; c++) {
            var u = O - c, E = g.words[u] | 0, T = a.words[c] | 0, U = E * T, z = U & 67108863;
            S = S + (U / 67108864 | 0) | 0, z = z + w | 0, w = z & 67108863, S = S + (z >>> 26) | 0, N += S >>> 26, S &= 67108863;
          }
          _.words[O] = w, R = S, S = N;
        }
        return R !== 0 ? _.words[O] = R : _.length--, _._strip();
      }
      function $(g, a, _) {
        return H(g, a, _);
      }
      i.prototype.mulTo = function(a, _) {
        var R, N = this.length + a.length;
        return this.length === 10 && a.length === 10 ? R = X(this, a, _) : N < 63 ? R = q(this, a, _) : N < 1024 ? R = H(this, a, _) : R = $(this, a, _), R;
      }, i.prototype.mul = function(a) {
        var _ = new i(null);
        return _.words = new Array(this.length + a.length), this.mulTo(a, _);
      }, i.prototype.mulf = function(a) {
        var _ = new i(null);
        return _.words = new Array(this.length + a.length), $(this, a, _);
      }, i.prototype.imul = function(a) {
        return this.clone().mulTo(a, this);
      }, i.prototype.imuln = function(a) {
        var _ = a < 0;
        _ && (a = -a), r(typeof a == "number"), r(a < 67108864);
        for (var R = 0, N = 0; N < this.length; N++) {
          var O = (this.words[N] | 0) * a, S = (O & 67108863) + (R & 67108863);
          R >>= 26, R += O / 67108864 | 0, R += S >>> 26, this.words[N] = S & 67108863;
        }
        return R !== 0 && (this.words[N] = R, this.length++), this.length = a === 0 ? 1 : this.length, _ ? this.ineg() : this;
      }, i.prototype.muln = function(a) {
        return this.clone().imuln(a);
      }, i.prototype.sqr = function() {
        return this.mul(this);
      }, i.prototype.isqr = function() {
        return this.imul(this.clone());
      }, i.prototype.pow = function(a) {
        var _ = x(a);
        if (_.length === 0) return new i(1);
        for (var R = this, N = 0; N < _.length && _[N] === 0; N++, R = R.sqr())
          ;
        if (++N < _.length)
          for (var O = R.sqr(); N < _.length; N++, O = O.sqr())
            _[N] !== 0 && (R = R.mul(O));
        return R;
      }, i.prototype.iushln = function(a) {
        r(typeof a == "number" && a >= 0);
        var _ = a % 26, R = (a - _) / 26, N = 67108863 >>> 26 - _ << 26 - _, O;
        if (_ !== 0) {
          var S = 0;
          for (O = 0; O < this.length; O++) {
            var w = this.words[O] & N, A = (this.words[O] | 0) - w << _;
            this.words[O] = A | S, S = w >>> 26 - _;
          }
          S && (this.words[O] = S, this.length++);
        }
        if (R !== 0) {
          for (O = this.length - 1; O >= 0; O--)
            this.words[O + R] = this.words[O];
          for (O = 0; O < R; O++)
            this.words[O] = 0;
          this.length += R;
        }
        return this._strip();
      }, i.prototype.ishln = function(a) {
        return r(this.negative === 0), this.iushln(a);
      }, i.prototype.iushrn = function(a, _, R) {
        r(typeof a == "number" && a >= 0);
        var N;
        _ ? N = (_ - _ % 26) / 26 : N = 0;
        var O = a % 26, S = Math.min((a - O) / 26, this.length), w = 67108863 ^ 67108863 >>> O << O, A = R;
        if (N -= S, N = Math.max(0, N), A) {
          for (var c = 0; c < S; c++)
            A.words[c] = this.words[c];
          A.length = S;
        }
        if (S !== 0) if (this.length > S)
          for (this.length -= S, c = 0; c < this.length; c++)
            this.words[c] = this.words[c + S];
        else
          this.words[0] = 0, this.length = 1;
        var u = 0;
        for (c = this.length - 1; c >= 0 && (u !== 0 || c >= N); c--) {
          var E = this.words[c] | 0;
          this.words[c] = u << 26 - O | E >>> O, u = E & w;
        }
        return A && u !== 0 && (A.words[A.length++] = u), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
      }, i.prototype.ishrn = function(a, _, R) {
        return r(this.negative === 0), this.iushrn(a, _, R);
      }, i.prototype.shln = function(a) {
        return this.clone().ishln(a);
      }, i.prototype.ushln = function(a) {
        return this.clone().iushln(a);
      }, i.prototype.shrn = function(a) {
        return this.clone().ishrn(a);
      }, i.prototype.ushrn = function(a) {
        return this.clone().iushrn(a);
      }, i.prototype.testn = function(a) {
        r(typeof a == "number" && a >= 0);
        var _ = a % 26, R = (a - _) / 26, N = 1 << _;
        if (this.length <= R) return !1;
        var O = this.words[R];
        return !!(O & N);
      }, i.prototype.imaskn = function(a) {
        r(typeof a == "number" && a >= 0);
        var _ = a % 26, R = (a - _) / 26;
        if (r(this.negative === 0, "imaskn works only with positive numbers"), this.length <= R)
          return this;
        if (_ !== 0 && R++, this.length = Math.min(R, this.length), _ !== 0) {
          var N = 67108863 ^ 67108863 >>> _ << _;
          this.words[this.length - 1] &= N;
        }
        return this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
      }, i.prototype.maskn = function(a) {
        return this.clone().imaskn(a);
      }, i.prototype.iaddn = function(a) {
        return r(typeof a == "number"), r(a < 67108864), a < 0 ? this.isubn(-a) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= a ? (this.words[0] = a - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(a), this.negative = 1, this) : this._iaddn(a);
      }, i.prototype._iaddn = function(a) {
        this.words[0] += a;
        for (var _ = 0; _ < this.length && this.words[_] >= 67108864; _++)
          this.words[_] -= 67108864, _ === this.length - 1 ? this.words[_ + 1] = 1 : this.words[_ + 1]++;
        return this.length = Math.max(this.length, _ + 1), this;
      }, i.prototype.isubn = function(a) {
        if (r(typeof a == "number"), r(a < 67108864), a < 0) return this.iaddn(-a);
        if (this.negative !== 0)
          return this.negative = 0, this.iaddn(a), this.negative = 1, this;
        if (this.words[0] -= a, this.length === 1 && this.words[0] < 0)
          this.words[0] = -this.words[0], this.negative = 1;
        else
          for (var _ = 0; _ < this.length && this.words[_] < 0; _++)
            this.words[_] += 67108864, this.words[_ + 1] -= 1;
        return this._strip();
      }, i.prototype.addn = function(a) {
        return this.clone().iaddn(a);
      }, i.prototype.subn = function(a) {
        return this.clone().isubn(a);
      }, i.prototype.iabs = function() {
        return this.negative = 0, this;
      }, i.prototype.abs = function() {
        return this.clone().iabs();
      }, i.prototype._ishlnsubmul = function(a, _, R) {
        var N = a.length + R, O;
        this._expand(N);
        var S, w = 0;
        for (O = 0; O < a.length; O++) {
          S = (this.words[O + R] | 0) + w;
          var A = (a.words[O] | 0) * _;
          S -= A & 67108863, w = (S >> 26) - (A / 67108864 | 0), this.words[O + R] = S & 67108863;
        }
        for (; O < this.length - R; O++)
          S = (this.words[O + R] | 0) + w, w = S >> 26, this.words[O + R] = S & 67108863;
        if (w === 0) return this._strip();
        for (r(w === -1), w = 0, O = 0; O < this.length; O++)
          S = -(this.words[O] | 0) + w, w = S >> 26, this.words[O] = S & 67108863;
        return this.negative = 1, this._strip();
      }, i.prototype._wordDiv = function(a, _) {
        var R = this.length - a.length, N = this.clone(), O = a, S = O.words[O.length - 1] | 0, w = this._countBits(S);
        R = 26 - w, R !== 0 && (O = O.ushln(R), N.iushln(R), S = O.words[O.length - 1] | 0);
        var A = N.length - O.length, c;
        if (_ !== "mod") {
          c = new i(null), c.length = A + 1, c.words = new Array(c.length);
          for (var u = 0; u < c.length; u++)
            c.words[u] = 0;
        }
        var E = N.clone()._ishlnsubmul(O, 1, A);
        E.negative === 0 && (N = E, c && (c.words[A] = 1));
        for (var T = A - 1; T >= 0; T--) {
          var U = (N.words[O.length + T] | 0) * 67108864 + (N.words[O.length + T - 1] | 0);
          for (U = Math.min(U / S | 0, 67108863), N._ishlnsubmul(O, U, T); N.negative !== 0; )
            U--, N.negative = 0, N._ishlnsubmul(O, 1, T), N.isZero() || (N.negative ^= 1);
          c && (c.words[T] = U);
        }
        return c && c._strip(), N._strip(), _ !== "div" && R !== 0 && N.iushrn(R), {
          div: c || null,
          mod: N
        };
      }, i.prototype.divmod = function(a, _, R) {
        if (r(!a.isZero()), this.isZero())
          return {
            div: new i(0),
            mod: new i(0)
          };
        var N, O, S;
        return this.negative !== 0 && a.negative === 0 ? (S = this.neg().divmod(a, _), _ !== "mod" && (N = S.div.neg()), _ !== "div" && (O = S.mod.neg(), R && O.negative !== 0 && O.iadd(a)), {
          div: N,
          mod: O
        }) : this.negative === 0 && a.negative !== 0 ? (S = this.divmod(a.neg(), _), _ !== "mod" && (N = S.div.neg()), {
          div: N,
          mod: S.mod
        }) : (this.negative & a.negative) !== 0 ? (S = this.neg().divmod(a.neg(), _), _ !== "div" && (O = S.mod.neg(), R && O.negative !== 0 && O.isub(a)), {
          div: S.div,
          mod: O
        }) : a.length > this.length || this.cmp(a) < 0 ? {
          div: new i(0),
          mod: this
        } : a.length === 1 ? _ === "div" ? {
          div: this.divn(a.words[0]),
          mod: null
        } : _ === "mod" ? {
          div: null,
          mod: new i(this.modrn(a.words[0]))
        } : {
          div: this.divn(a.words[0]),
          mod: new i(this.modrn(a.words[0]))
        } : this._wordDiv(a, _);
      }, i.prototype.div = function(a) {
        return this.divmod(a, "div", !1).div;
      }, i.prototype.mod = function(a) {
        return this.divmod(a, "mod", !1).mod;
      }, i.prototype.umod = function(a) {
        return this.divmod(a, "mod", !0).mod;
      }, i.prototype.divRound = function(a) {
        var _ = this.divmod(a);
        if (_.mod.isZero()) return _.div;
        var R = _.div.negative !== 0 ? _.mod.isub(a) : _.mod, N = a.ushrn(1), O = a.andln(1), S = R.cmp(N);
        return S < 0 || O === 1 && S === 0 ? _.div : _.div.negative !== 0 ? _.div.isubn(1) : _.div.iaddn(1);
      }, i.prototype.modrn = function(a) {
        var _ = a < 0;
        _ && (a = -a), r(a <= 67108863);
        for (var R = (1 << 26) % a, N = 0, O = this.length - 1; O >= 0; O--)
          N = (R * N + (this.words[O] | 0)) % a;
        return _ ? -N : N;
      }, i.prototype.modn = function(a) {
        return this.modrn(a);
      }, i.prototype.idivn = function(a) {
        var _ = a < 0;
        _ && (a = -a), r(a <= 67108863);
        for (var R = 0, N = this.length - 1; N >= 0; N--) {
          var O = (this.words[N] | 0) + R * 67108864;
          this.words[N] = O / a | 0, R = O % a;
        }
        return this._strip(), _ ? this.ineg() : this;
      }, i.prototype.divn = function(a) {
        return this.clone().idivn(a);
      }, i.prototype.egcd = function(a) {
        r(a.negative === 0), r(!a.isZero());
        var _ = this, R = a.clone();
        _.negative !== 0 ? _ = _.umod(a) : _ = _.clone();
        for (var N = new i(1), O = new i(0), S = new i(0), w = new i(1), A = 0; _.isEven() && R.isEven(); )
          _.iushrn(1), R.iushrn(1), ++A;
        for (var c = R.clone(), u = _.clone(); !_.isZero(); ) {
          for (var E = 0, T = 1; (_.words[0] & T) === 0 && E < 26; ++E, T <<= 1) ;
          if (E > 0)
            for (_.iushrn(E); E-- > 0; )
              (N.isOdd() || O.isOdd()) && (N.iadd(c), O.isub(u)), N.iushrn(1), O.iushrn(1);
          for (var U = 0, z = 1; (R.words[0] & z) === 0 && U < 26; ++U, z <<= 1) ;
          if (U > 0)
            for (R.iushrn(U); U-- > 0; )
              (S.isOdd() || w.isOdd()) && (S.iadd(c), w.isub(u)), S.iushrn(1), w.iushrn(1);
          _.cmp(R) >= 0 ? (_.isub(R), N.isub(S), O.isub(w)) : (R.isub(_), S.isub(N), w.isub(O));
        }
        return {
          a: S,
          b: w,
          gcd: R.iushln(A)
        };
      }, i.prototype._invmp = function(a) {
        r(a.negative === 0), r(!a.isZero());
        var _ = this, R = a.clone();
        _.negative !== 0 ? _ = _.umod(a) : _ = _.clone();
        for (var N = new i(1), O = new i(0), S = R.clone(); _.cmpn(1) > 0 && R.cmpn(1) > 0; ) {
          for (var w = 0, A = 1; (_.words[0] & A) === 0 && w < 26; ++w, A <<= 1) ;
          if (w > 0)
            for (_.iushrn(w); w-- > 0; )
              N.isOdd() && N.iadd(S), N.iushrn(1);
          for (var c = 0, u = 1; (R.words[0] & u) === 0 && c < 26; ++c, u <<= 1) ;
          if (c > 0)
            for (R.iushrn(c); c-- > 0; )
              O.isOdd() && O.iadd(S), O.iushrn(1);
          _.cmp(R) >= 0 ? (_.isub(R), N.isub(O)) : (R.isub(_), O.isub(N));
        }
        var E;
        return _.cmpn(1) === 0 ? E = N : E = O, E.cmpn(0) < 0 && E.iadd(a), E;
      }, i.prototype.gcd = function(a) {
        if (this.isZero()) return a.abs();
        if (a.isZero()) return this.abs();
        var _ = this.clone(), R = a.clone();
        _.negative = 0, R.negative = 0;
        for (var N = 0; _.isEven() && R.isEven(); N++)
          _.iushrn(1), R.iushrn(1);
        do {
          for (; _.isEven(); )
            _.iushrn(1);
          for (; R.isEven(); )
            R.iushrn(1);
          var O = _.cmp(R);
          if (O < 0) {
            var S = _;
            _ = R, R = S;
          } else if (O === 0 || R.cmpn(1) === 0)
            break;
          _.isub(R);
        } while (!0);
        return R.iushln(N);
      }, i.prototype.invm = function(a) {
        return this.egcd(a).a.umod(a);
      }, i.prototype.isEven = function() {
        return (this.words[0] & 1) === 0;
      }, i.prototype.isOdd = function() {
        return (this.words[0] & 1) === 1;
      }, i.prototype.andln = function(a) {
        return this.words[0] & a;
      }, i.prototype.bincn = function(a) {
        r(typeof a == "number");
        var _ = a % 26, R = (a - _) / 26, N = 1 << _;
        if (this.length <= R)
          return this._expand(R + 1), this.words[R] |= N, this;
        for (var O = N, S = R; O !== 0 && S < this.length; S++) {
          var w = this.words[S] | 0;
          w += O, O = w >>> 26, w &= 67108863, this.words[S] = w;
        }
        return O !== 0 && (this.words[S] = O, this.length++), this;
      }, i.prototype.isZero = function() {
        return this.length === 1 && this.words[0] === 0;
      }, i.prototype.cmpn = function(a) {
        var _ = a < 0;
        if (this.negative !== 0 && !_) return -1;
        if (this.negative === 0 && _) return 1;
        this._strip();
        var R;
        if (this.length > 1)
          R = 1;
        else {
          _ && (a = -a), r(a <= 67108863, "Number is too big");
          var N = this.words[0] | 0;
          R = N === a ? 0 : N < a ? -1 : 1;
        }
        return this.negative !== 0 ? -R | 0 : R;
      }, i.prototype.cmp = function(a) {
        if (this.negative !== 0 && a.negative === 0) return -1;
        if (this.negative === 0 && a.negative !== 0) return 1;
        var _ = this.ucmp(a);
        return this.negative !== 0 ? -_ | 0 : _;
      }, i.prototype.ucmp = function(a) {
        if (this.length > a.length) return 1;
        if (this.length < a.length) return -1;
        for (var _ = 0, R = this.length - 1; R >= 0; R--) {
          var N = this.words[R] | 0, O = a.words[R] | 0;
          if (N !== O) {
            N < O ? _ = -1 : N > O && (_ = 1);
            break;
          }
        }
        return _;
      }, i.prototype.gtn = function(a) {
        return this.cmpn(a) === 1;
      }, i.prototype.gt = function(a) {
        return this.cmp(a) === 1;
      }, i.prototype.gten = function(a) {
        return this.cmpn(a) >= 0;
      }, i.prototype.gte = function(a) {
        return this.cmp(a) >= 0;
      }, i.prototype.ltn = function(a) {
        return this.cmpn(a) === -1;
      }, i.prototype.lt = function(a) {
        return this.cmp(a) === -1;
      }, i.prototype.lten = function(a) {
        return this.cmpn(a) <= 0;
      }, i.prototype.lte = function(a) {
        return this.cmp(a) <= 0;
      }, i.prototype.eqn = function(a) {
        return this.cmpn(a) === 0;
      }, i.prototype.eq = function(a) {
        return this.cmp(a) === 0;
      }, i.red = function(a) {
        return new P(a);
      }, i.prototype.toRed = function(a) {
        return r(!this.red, "Already a number in reduction context"), r(this.negative === 0, "red works only with positives"), a.convertTo(this)._forceRed(a);
      }, i.prototype.fromRed = function() {
        return r(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
      }, i.prototype._forceRed = function(a) {
        return this.red = a, this;
      }, i.prototype.forceRed = function(a) {
        return r(!this.red, "Already a number in reduction context"), this._forceRed(a);
      }, i.prototype.redAdd = function(a) {
        return r(this.red, "redAdd works only with red numbers"), this.red.add(this, a);
      }, i.prototype.redIAdd = function(a) {
        return r(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, a);
      }, i.prototype.redSub = function(a) {
        return r(this.red, "redSub works only with red numbers"), this.red.sub(this, a);
      }, i.prototype.redISub = function(a) {
        return r(this.red, "redISub works only with red numbers"), this.red.isub(this, a);
      }, i.prototype.redShl = function(a) {
        return r(this.red, "redShl works only with red numbers"), this.red.shl(this, a);
      }, i.prototype.redMul = function(a) {
        return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, a), this.red.mul(this, a);
      }, i.prototype.redIMul = function(a) {
        return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, a), this.red.imul(this, a);
      }, i.prototype.redSqr = function() {
        return r(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
      }, i.prototype.redISqr = function() {
        return r(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
      }, i.prototype.redSqrt = function() {
        return r(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
      }, i.prototype.redInvm = function() {
        return r(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
      }, i.prototype.redNeg = function() {
        return r(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
      }, i.prototype.redPow = function(a) {
        return r(this.red && !a.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, a);
      };
      var K = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };
      function J(g, a) {
        this.name = g, this.p = new i(a, 16), this.n = this.p.bitLength(), this.k = new i(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
      }
      J.prototype._tmp = function() {
        var a = new i(null);
        return a.words = new Array(Math.ceil(this.n / 13)), a;
      }, J.prototype.ireduce = function(a) {
        var _ = a, R;
        do
          this.split(_, this.tmp), _ = this.imulK(_), _ = _.iadd(this.tmp), R = _.bitLength();
        while (R > this.n);
        var N = R < this.n ? -1 : _.ucmp(this.p);
        return N === 0 ? (_.words[0] = 0, _.length = 1) : N > 0 ? _.isub(this.p) : _.strip !== void 0 ? _.strip() : _._strip(), _;
      }, J.prototype.split = function(a, _) {
        a.iushrn(this.n, 0, _);
      }, J.prototype.imulK = function(a) {
        return a.imul(this.k);
      };
      function te() {
        J.call(
          this,
          "k256",
          "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
        );
      }
      o(te, J), te.prototype.split = function(a, _) {
        for (var R = 4194303, N = Math.min(a.length, 9), O = 0; O < N; O++)
          _.words[O] = a.words[O];
        if (_.length = N, a.length <= 9) {
          a.words[0] = 0, a.length = 1;
          return;
        }
        var S = a.words[9];
        for (_.words[_.length++] = S & R, O = 10; O < a.length; O++) {
          var w = a.words[O] | 0;
          a.words[O - 10] = (w & R) << 4 | S >>> 22, S = w;
        }
        S >>>= 22, a.words[O - 10] = S, S === 0 && a.length > 10 ? a.length -= 10 : a.length -= 9;
      }, te.prototype.imulK = function(a) {
        a.words[a.length] = 0, a.words[a.length + 1] = 0, a.length += 2;
        for (var _ = 0, R = 0; R < a.length; R++) {
          var N = a.words[R] | 0;
          _ += N * 977, a.words[R] = _ & 67108863, _ = N * 64 + (_ / 67108864 | 0);
        }
        return a.words[a.length - 1] === 0 && (a.length--, a.words[a.length - 1] === 0 && a.length--), a;
      };
      function re() {
        J.call(
          this,
          "p224",
          "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
        );
      }
      o(re, J);
      function j() {
        J.call(
          this,
          "p192",
          "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
        );
      }
      o(j, J);
      function k() {
        J.call(
          this,
          "25519",
          "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
        );
      }
      o(k, J), k.prototype.imulK = function(a) {
        for (var _ = 0, R = 0; R < a.length; R++) {
          var N = (a.words[R] | 0) * 19 + _, O = N & 67108863;
          N >>>= 26, a.words[R] = O, _ = N;
        }
        return _ !== 0 && (a.words[a.length++] = _), a;
      }, i._prime = function(a) {
        if (K[a]) return K[a];
        var _;
        if (a === "k256")
          _ = new te();
        else if (a === "p224")
          _ = new re();
        else if (a === "p192")
          _ = new j();
        else if (a === "p25519")
          _ = new k();
        else
          throw new Error("Unknown prime " + a);
        return K[a] = _, _;
      };
      function P(g) {
        if (typeof g == "string") {
          var a = i._prime(g);
          this.m = a.p, this.prime = a;
        } else
          r(g.gtn(1), "modulus must be greater than 1"), this.m = g, this.prime = null;
      }
      P.prototype._verify1 = function(a) {
        r(a.negative === 0, "red works only with positives"), r(a.red, "red works only with red numbers");
      }, P.prototype._verify2 = function(a, _) {
        r((a.negative | _.negative) === 0, "red works only with positives"), r(
          a.red && a.red === _.red,
          "red works only with red numbers"
        );
      }, P.prototype.imod = function(a) {
        return this.prime ? this.prime.ireduce(a)._forceRed(this) : (y(a, a.umod(this.m)._forceRed(this)), a);
      }, P.prototype.neg = function(a) {
        return a.isZero() ? a.clone() : this.m.sub(a)._forceRed(this);
      }, P.prototype.add = function(a, _) {
        this._verify2(a, _);
        var R = a.add(_);
        return R.cmp(this.m) >= 0 && R.isub(this.m), R._forceRed(this);
      }, P.prototype.iadd = function(a, _) {
        this._verify2(a, _);
        var R = a.iadd(_);
        return R.cmp(this.m) >= 0 && R.isub(this.m), R;
      }, P.prototype.sub = function(a, _) {
        this._verify2(a, _);
        var R = a.sub(_);
        return R.cmpn(0) < 0 && R.iadd(this.m), R._forceRed(this);
      }, P.prototype.isub = function(a, _) {
        this._verify2(a, _);
        var R = a.isub(_);
        return R.cmpn(0) < 0 && R.iadd(this.m), R;
      }, P.prototype.shl = function(a, _) {
        return this._verify1(a), this.imod(a.ushln(_));
      }, P.prototype.imul = function(a, _) {
        return this._verify2(a, _), this.imod(a.imul(_));
      }, P.prototype.mul = function(a, _) {
        return this._verify2(a, _), this.imod(a.mul(_));
      }, P.prototype.isqr = function(a) {
        return this.imul(a, a.clone());
      }, P.prototype.sqr = function(a) {
        return this.mul(a, a);
      }, P.prototype.sqrt = function(a) {
        if (a.isZero()) return a.clone();
        var _ = this.m.andln(3);
        if (r(_ % 2 === 1), _ === 3) {
          var R = this.m.add(new i(1)).iushrn(2);
          return this.pow(a, R);
        }
        for (var N = this.m.subn(1), O = 0; !N.isZero() && N.andln(1) === 0; )
          O++, N.iushrn(1);
        r(!N.isZero());
        var S = new i(1).toRed(this), w = S.redNeg(), A = this.m.subn(1).iushrn(1), c = this.m.bitLength();
        for (c = new i(2 * c * c).toRed(this); this.pow(c, A).cmp(w) !== 0; )
          c.redIAdd(w);
        for (var u = this.pow(c, N), E = this.pow(a, N.addn(1).iushrn(1)), T = this.pow(a, N), U = O; T.cmp(S) !== 0; ) {
          for (var z = T, ee = 0; z.cmp(S) !== 0; ee++)
            z = z.redSqr();
          r(ee < U);
          var ie = this.pow(u, new i(1).iushln(U - ee - 1));
          E = E.redMul(ie), u = ie.redSqr(), T = T.redMul(u), U = ee;
        }
        return E;
      }, P.prototype.invm = function(a) {
        var _ = a._invmp(this.m);
        return _.negative !== 0 ? (_.negative = 0, this.imod(_).redNeg()) : this.imod(_);
      }, P.prototype.pow = function(a, _) {
        if (_.isZero()) return new i(1).toRed(this);
        if (_.cmpn(1) === 0) return a.clone();
        var R = 4, N = new Array(1 << R);
        N[0] = new i(1).toRed(this), N[1] = a;
        for (var O = 2; O < N.length; O++)
          N[O] = this.mul(N[O - 1], a);
        var S = N[0], w = 0, A = 0, c = _.bitLength() % 26;
        for (c === 0 && (c = 26), O = _.length - 1; O >= 0; O--) {
          for (var u = _.words[O], E = c - 1; E >= 0; E--) {
            var T = u >> E & 1;
            if (S !== N[0] && (S = this.sqr(S)), T === 0 && w === 0) {
              A = 0;
              continue;
            }
            w <<= 1, w |= T, A++, !(A !== R && (O !== 0 || E !== 0)) && (S = this.mul(S, N[w]), A = 0, w = 0);
          }
          c = 26;
        }
        return S;
      }, P.prototype.convertTo = function(a) {
        var _ = a.umod(this.m);
        return _ === a ? _.clone() : _;
      }, P.prototype.convertFrom = function(a) {
        var _ = a.clone();
        return _.red = null, _;
      }, i.mont = function(a) {
        return new W(a);
      };
      function W(g) {
        P.call(this, g), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new i(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
      }
      o(W, P), W.prototype.convertTo = function(a) {
        return this.imod(a.ushln(this.shift));
      }, W.prototype.convertFrom = function(a) {
        var _ = this.imod(a.mul(this.rinv));
        return _.red = null, _;
      }, W.prototype.imul = function(a, _) {
        if (a.isZero() || _.isZero())
          return a.words[0] = 0, a.length = 1, a;
        var R = a.imul(_), N = R.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), O = R.isub(N).iushrn(this.shift), S = O;
        return O.cmp(this.m) >= 0 ? S = O.isub(this.m) : O.cmpn(0) < 0 && (S = O.iadd(this.m)), S._forceRed(this);
      }, W.prototype.mul = function(a, _) {
        if (a.isZero() || _.isZero()) return new i(0)._forceRed(this);
        var R = a.mul(_), N = R.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), O = R.isub(N).iushrn(this.shift), S = O;
        return O.cmp(this.m) >= 0 ? S = O.isub(this.m) : O.cmpn(0) < 0 && (S = O.iadd(this.m)), S._forceRed(this);
      }, W.prototype.invm = function(a) {
        var _ = this.imod(a._invmp(this.m).mul(this.r2));
        return _._forceRed(this);
      };
    })(e, _h);
  })(Sr)), Sr.exports;
}
var Rh = Fc();
const na = /* @__PURE__ */ bo(Rh);
var pr = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var ra;
function Eh() {
  return ra || (ra = 1, (function(e, t) {
    var n = Lo(), r = n.Buffer;
    function o(s, l) {
      for (var f in s)
        l[f] = s[f];
    }
    r.from && r.alloc && r.allocUnsafe && r.allocUnsafeSlow ? e.exports = n : (o(n, t), t.Buffer = i);
    function i(s, l, f) {
      return r(s, l, f);
    }
    i.prototype = Object.create(r.prototype), o(r, i), i.from = function(s, l, f) {
      if (typeof s == "number")
        throw new TypeError("Argument must not be a number");
      return r(s, l, f);
    }, i.alloc = function(s, l, f) {
      if (typeof s != "number")
        throw new TypeError("Argument must be a number");
      var m = r(s);
      return l !== void 0 ? typeof f == "string" ? m.fill(l, f) : m.fill(l) : m.fill(0), m;
    }, i.allocUnsafe = function(s) {
      if (typeof s != "number")
        throw new TypeError("Argument must be a number");
      return r(s);
    }, i.allocUnsafeSlow = function(s) {
      if (typeof s != "number")
        throw new TypeError("Argument must be a number");
      return n.SlowBuffer(s);
    };
  })(pr, pr.exports)), pr.exports;
}
var ki, ia;
function ph() {
  if (ia) return ki;
  ia = 1;
  var e = Eh().Buffer;
  function t(n) {
    if (n.length >= 255)
      throw new TypeError("Alphabet too long");
    for (var r = new Uint8Array(256), o = 0; o < r.length; o++)
      r[o] = 255;
    for (var i = 0; i < n.length; i++) {
      var s = n.charAt(i), l = s.charCodeAt(0);
      if (r[l] !== 255)
        throw new TypeError(s + " is ambiguous");
      r[l] = i;
    }
    var f = n.length, m = n.charAt(0), y = Math.log(f) / Math.log(256), C = Math.log(256) / Math.log(f);
    function D(b) {
      if ((Array.isArray(b) || b instanceof Uint8Array) && (b = e.from(b)), !e.isBuffer(b))
        throw new TypeError("Expected Buffer");
      if (b.length === 0)
        return "";
      for (var x = 0, q = 0, X = 0, H = b.length; X !== H && b[X] === 0; )
        X++, x++;
      for (var $ = (H - X) * C + 1 >>> 0, K = new Uint8Array($); X !== H; ) {
        for (var J = b[X], te = 0, re = $ - 1; (J !== 0 || te < q) && re !== -1; re--, te++)
          J += 256 * K[re] >>> 0, K[re] = J % f >>> 0, J = J / f >>> 0;
        if (J !== 0)
          throw new Error("Non-zero carry");
        q = te, X++;
      }
      for (var j = $ - q; j !== $ && K[j] === 0; )
        j++;
      for (var k = m.repeat(x); j < $; ++j)
        k += n.charAt(K[j]);
      return k;
    }
    function v(b) {
      if (typeof b != "string")
        throw new TypeError("Expected String");
      if (b.length === 0)
        return e.alloc(0);
      for (var x = 0, q = 0, X = 0; b[x] === m; )
        q++, x++;
      for (var H = (b.length - x) * y + 1 >>> 0, $ = new Uint8Array(H); x < b.length; ) {
        var K = b.charCodeAt(x);
        if (K > 255)
          return;
        var J = r[K];
        if (J === 255)
          return;
        for (var te = 0, re = H - 1; (J !== 0 || te < X) && re !== -1; re--, te++)
          J += f * $[re] >>> 0, $[re] = J % 256 >>> 0, J = J / 256 >>> 0;
        if (J !== 0)
          throw new Error("Non-zero carry");
        X = te, x++;
      }
      for (var j = H - X; j !== H && $[j] === 0; )
        j++;
      var k = e.allocUnsafe(q + (H - j));
      k.fill(0, 0, q);
      for (var P = q; j !== H; )
        k[P++] = $[j++];
      return k;
    }
    function M(b) {
      var x = v(b);
      if (x)
        return x;
      throw new Error("Non-base" + f + " character");
    }
    return {
      encode: D,
      decodeUnsafe: v,
      decode: M
    };
  }
  return ki = t, ki;
}
var Fi, oa;
function zc() {
  if (oa) return Fi;
  oa = 1;
  var e = ph(), t = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  return Fi = e(t), Fi;
}
var Ah = zc();
const gt = /* @__PURE__ */ bo(Ah), sa = Ic;
var Se = {};
function Xt(e, t, n) {
  return t <= e && e <= n;
}
function Wr(e) {
  if (e === void 0) return {};
  if (e === Object(e)) return e;
  throw TypeError("Could not convert argument to dictionary");
}
function gh(e) {
  for (var t = String(e), n = t.length, r = 0, o = []; r < n; ) {
    var i = t.charCodeAt(r);
    if (i < 55296 || i > 57343)
      o.push(i);
    else if (56320 <= i && i <= 57343)
      o.push(65533);
    else if (55296 <= i && i <= 56319)
      if (r === n - 1)
        o.push(65533);
      else {
        var s = e.charCodeAt(r + 1);
        if (56320 <= s && s <= 57343) {
          var l = i & 1023, f = s & 1023;
          o.push(65536 + (l << 10) + f), r += 1;
        } else
          o.push(65533);
      }
    r += 1;
  }
  return o;
}
function mh(e) {
  for (var t = "", n = 0; n < e.length; ++n) {
    var r = e[n];
    r <= 65535 ? t += String.fromCharCode(r) : (r -= 65536, t += String.fromCharCode(
      (r >> 10) + 55296,
      (r & 1023) + 56320
    ));
  }
  return t;
}
var Lr = -1;
function Fo(e) {
  this.tokens = [].slice.call(e);
}
Fo.prototype = {
  /**
   * @return {boolean} True if end-of-stream has been hit.
   */
  endOfStream: function() {
    return !this.tokens.length;
  },
  /**
   * When a token is read from a stream, the first token in the
   * stream must be returned and subsequently removed, and
   * end-of-stream must be returned otherwise.
   *
   * @return {number} Get the next token from the stream, or
   * end_of_stream.
   */
  read: function() {
    return this.tokens.length ? this.tokens.shift() : Lr;
  },
  /**
   * When one or more tokens are prepended to a stream, those tokens
   * must be inserted, in given order, before the first token in the
   * stream.
   *
   * @param {(number|!Array.<number>)} token The token(s) to prepend to the stream.
   */
  prepend: function(e) {
    if (Array.isArray(e))
      for (var t = (
        /**@type {!Array.<number>}*/
        e
      ); t.length; )
        this.tokens.unshift(t.pop());
    else
      this.tokens.unshift(e);
  },
  /**
   * When one or more tokens are pushed to a stream, those tokens
   * must be inserted, in given order, after the last token in the
   * stream.
   *
   * @param {(number|!Array.<number>)} token The tokens(s) to prepend to the stream.
   */
  push: function(e) {
    if (Array.isArray(e))
      for (var t = (
        /**@type {!Array.<number>}*/
        e
      ); t.length; )
        this.tokens.push(t.shift());
    else
      this.tokens.push(e);
  }
};
var Mn = -1;
function zi(e, t) {
  if (e)
    throw TypeError("Decoder error");
  return t || 65533;
}
var xr = "utf-8";
function Ur(e, t) {
  if (!(this instanceof Ur))
    return new Ur(e, t);
  if (e = e !== void 0 ? String(e).toLowerCase() : xr, e !== xr)
    throw new Error("Encoding not supported. Only utf-8 is supported");
  t = Wr(t), this._streaming = !1, this._BOMseen = !1, this._decoder = null, this._fatal = !!t.fatal, this._ignoreBOM = !!t.ignoreBOM, Object.defineProperty(this, "encoding", { value: "utf-8" }), Object.defineProperty(this, "fatal", { value: this._fatal }), Object.defineProperty(this, "ignoreBOM", { value: this._ignoreBOM });
}
Ur.prototype = {
  /**
   * @param {ArrayBufferView=} input The buffer of bytes to decode.
   * @param {Object=} options
   * @return {string} The decoded string.
   */
  decode: function(t, n) {
    var r;
    typeof t == "object" && t instanceof ArrayBuffer ? r = new Uint8Array(t) : typeof t == "object" && "buffer" in t && t.buffer instanceof ArrayBuffer ? r = new Uint8Array(
      t.buffer,
      t.byteOffset,
      t.byteLength
    ) : r = new Uint8Array(0), n = Wr(n), this._streaming || (this._decoder = new Oh({ fatal: this._fatal }), this._BOMseen = !1), this._streaming = !!n.stream;
    for (var o = new Fo(r), i = [], s; !o.endOfStream() && (s = this._decoder.handler(o, o.read()), s !== Mn); )
      s !== null && (Array.isArray(s) ? i.push.apply(
        i,
        /**@type {!Array.<number>}*/
        s
      ) : i.push(s));
    if (!this._streaming) {
      do {
        if (s = this._decoder.handler(o, o.read()), s === Mn)
          break;
        s !== null && (Array.isArray(s) ? i.push.apply(
          i,
          /**@type {!Array.<number>}*/
          s
        ) : i.push(s));
      } while (!o.endOfStream());
      this._decoder = null;
    }
    return i.length && ["utf-8"].indexOf(this.encoding) !== -1 && !this._ignoreBOM && !this._BOMseen && (i[0] === 65279 ? (this._BOMseen = !0, i.shift()) : this._BOMseen = !0), mh(i);
  }
};
function Dr(e, t) {
  if (!(this instanceof Dr))
    return new Dr(e, t);
  if (e = e !== void 0 ? String(e).toLowerCase() : xr, e !== xr)
    throw new Error("Encoding not supported. Only utf-8 is supported");
  t = Wr(t), this._streaming = !1, this._encoder = null, this._options = { fatal: !!t.fatal }, Object.defineProperty(this, "encoding", { value: "utf-8" });
}
Dr.prototype = {
  /**
   * @param {string=} opt_string The string to encode.
   * @param {Object=} options
   * @return {Uint8Array} Encoded bytes, as a Uint8Array.
   */
  encode: function(t, n) {
    t = t ? String(t) : "", n = Wr(n), this._streaming || (this._encoder = new Sh(this._options)), this._streaming = !!n.stream;
    for (var r = [], o = new Fo(gh(t)), i; !o.endOfStream() && (i = this._encoder.handler(o, o.read()), i !== Mn); )
      Array.isArray(i) ? r.push.apply(
        r,
        /**@type {!Array.<number>}*/
        i
      ) : r.push(i);
    if (!this._streaming) {
      for (; i = this._encoder.handler(o, o.read()), i !== Mn; )
        Array.isArray(i) ? r.push.apply(
          r,
          /**@type {!Array.<number>}*/
          i
        ) : r.push(i);
      this._encoder = null;
    }
    return new Uint8Array(r);
  }
};
function Oh(e) {
  var t = e.fatal, n = 0, r = 0, o = 0, i = 128, s = 191;
  this.handler = function(l, f) {
    if (f === Lr && o !== 0)
      return o = 0, zi(t);
    if (f === Lr)
      return Mn;
    if (o === 0) {
      if (Xt(f, 0, 127))
        return f;
      if (Xt(f, 194, 223))
        o = 1, n = f - 192;
      else if (Xt(f, 224, 239))
        f === 224 && (i = 160), f === 237 && (s = 159), o = 2, n = f - 224;
      else if (Xt(f, 240, 244))
        f === 240 && (i = 144), f === 244 && (s = 143), o = 3, n = f - 240;
      else
        return zi(t);
      return n = n << 6 * o, null;
    }
    if (!Xt(f, i, s))
      return n = o = r = 0, i = 128, s = 191, l.prepend(f), zi(t);
    if (i = 128, s = 191, r += 1, n += f - 128 << 6 * (o - r), r !== o)
      return null;
    var m = n;
    return n = o = r = 0, m;
  };
}
function Sh(e) {
  e.fatal, this.handler = function(t, n) {
    if (n === Lr)
      return Mn;
    if (Xt(n, 0, 127))
      return n;
    var r, o;
    Xt(n, 128, 2047) ? (r = 1, o = 192) : Xt(n, 2048, 65535) ? (r = 2, o = 224) : Xt(n, 65536, 1114111) && (r = 3, o = 240);
    for (var i = [(n >> 6 * r) + o]; r > 0; ) {
      var s = n >> 6 * (r - 1);
      i.push(128 | s & 63), r -= 1;
    }
    return i;
  };
}
const Nh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextDecoder: Ur,
  TextEncoder: Dr
}, Symbol.toStringTag, { value: "Module" })), yh = /* @__PURE__ */ Co(Nh);
var aa;
function Th() {
  if (aa) return Se;
  aa = 1;
  var e = Se && Se.__createBinding || (Object.create ? (function(j, k, P, W) {
    W === void 0 && (W = P), Object.defineProperty(j, W, { enumerable: !0, get: function() {
      return k[P];
    } });
  }) : (function(j, k, P, W) {
    W === void 0 && (W = P), j[W] = k[P];
  })), t = Se && Se.__setModuleDefault || (Object.create ? (function(j, k) {
    Object.defineProperty(j, "default", { enumerable: !0, value: k });
  }) : function(j, k) {
    j.default = k;
  }), n = Se && Se.__decorate || function(j, k, P, W) {
    var g = arguments.length, a = g < 3 ? k : W === null ? W = Object.getOwnPropertyDescriptor(k, P) : W, _;
    if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(j, k, P, W);
    else for (var R = j.length - 1; R >= 0; R--) (_ = j[R]) && (a = (g < 3 ? _(a) : g > 3 ? _(k, P, a) : _(k, P)) || a);
    return g > 3 && a && Object.defineProperty(k, P, a), a;
  }, r = Se && Se.__importStar || function(j) {
    if (j && j.__esModule) return j;
    var k = {};
    if (j != null) for (var P in j) P !== "default" && Object.hasOwnProperty.call(j, P) && e(k, j, P);
    return t(k, j), k;
  }, o = Se && Se.__importDefault || function(j) {
    return j && j.__esModule ? j : { default: j };
  };
  Object.defineProperty(Se, "__esModule", { value: !0 }), Se.deserializeUnchecked = Se.deserialize = Se.serialize = Se.BinaryReader = Se.BinaryWriter = Se.BorshError = Se.baseDecode = Se.baseEncode = void 0;
  const i = o(Fc()), s = o(zc()), l = r(yh), f = typeof TextDecoder != "function" ? l.TextDecoder : TextDecoder, m = new f("utf-8", { fatal: !0 });
  function y(j) {
    return typeof j == "string" && (j = Buffer.from(j, "utf8")), s.default.encode(Buffer.from(j));
  }
  Se.baseEncode = y;
  function C(j) {
    return Buffer.from(s.default.decode(j));
  }
  Se.baseDecode = C;
  const D = 1024;
  class v extends Error {
    constructor(k) {
      super(k), this.fieldPath = [], this.originalMessage = k;
    }
    addToFieldPath(k) {
      this.fieldPath.splice(0, 0, k), this.message = this.originalMessage + ": " + this.fieldPath.join(".");
    }
  }
  Se.BorshError = v;
  class M {
    constructor() {
      this.buf = Buffer.alloc(D), this.length = 0;
    }
    maybeResize() {
      this.buf.length < 16 + this.length && (this.buf = Buffer.concat([this.buf, Buffer.alloc(D)]));
    }
    writeU8(k) {
      this.maybeResize(), this.buf.writeUInt8(k, this.length), this.length += 1;
    }
    writeU16(k) {
      this.maybeResize(), this.buf.writeUInt16LE(k, this.length), this.length += 2;
    }
    writeU32(k) {
      this.maybeResize(), this.buf.writeUInt32LE(k, this.length), this.length += 4;
    }
    writeU64(k) {
      this.maybeResize(), this.writeBuffer(Buffer.from(new i.default(k).toArray("le", 8)));
    }
    writeU128(k) {
      this.maybeResize(), this.writeBuffer(Buffer.from(new i.default(k).toArray("le", 16)));
    }
    writeU256(k) {
      this.maybeResize(), this.writeBuffer(Buffer.from(new i.default(k).toArray("le", 32)));
    }
    writeU512(k) {
      this.maybeResize(), this.writeBuffer(Buffer.from(new i.default(k).toArray("le", 64)));
    }
    writeBuffer(k) {
      this.buf = Buffer.concat([
        Buffer.from(this.buf.subarray(0, this.length)),
        k,
        Buffer.alloc(D)
      ]), this.length += k.length;
    }
    writeString(k) {
      this.maybeResize();
      const P = Buffer.from(k, "utf8");
      this.writeU32(P.length), this.writeBuffer(P);
    }
    writeFixedArray(k) {
      this.writeBuffer(Buffer.from(k));
    }
    writeArray(k, P) {
      this.maybeResize(), this.writeU32(k.length);
      for (const W of k)
        this.maybeResize(), P(W);
    }
    toArray() {
      return this.buf.subarray(0, this.length);
    }
  }
  Se.BinaryWriter = M;
  function b(j, k, P) {
    const W = P.value;
    P.value = function(...g) {
      try {
        return W.apply(this, g);
      } catch (a) {
        if (a instanceof RangeError) {
          const _ = a.code;
          if (["ERR_BUFFER_OUT_OF_BOUNDS", "ERR_OUT_OF_RANGE"].indexOf(_) >= 0)
            throw new v("Reached the end of buffer when deserializing");
        }
        throw a;
      }
    };
  }
  class x {
    constructor(k) {
      this.buf = k, this.offset = 0;
    }
    readU8() {
      const k = this.buf.readUInt8(this.offset);
      return this.offset += 1, k;
    }
    readU16() {
      const k = this.buf.readUInt16LE(this.offset);
      return this.offset += 2, k;
    }
    readU32() {
      const k = this.buf.readUInt32LE(this.offset);
      return this.offset += 4, k;
    }
    readU64() {
      const k = this.readBuffer(8);
      return new i.default(k, "le");
    }
    readU128() {
      const k = this.readBuffer(16);
      return new i.default(k, "le");
    }
    readU256() {
      const k = this.readBuffer(32);
      return new i.default(k, "le");
    }
    readU512() {
      const k = this.readBuffer(64);
      return new i.default(k, "le");
    }
    readBuffer(k) {
      if (this.offset + k > this.buf.length)
        throw new v(`Expected buffer length ${k} isn't within bounds`);
      const P = this.buf.slice(this.offset, this.offset + k);
      return this.offset += k, P;
    }
    readString() {
      const k = this.readU32(), P = this.readBuffer(k);
      try {
        return m.decode(P);
      } catch (W) {
        throw new v(`Error decoding UTF-8 string: ${W}`);
      }
    }
    readFixedArray(k) {
      return new Uint8Array(this.readBuffer(k));
    }
    readArray(k) {
      const P = this.readU32(), W = Array();
      for (let g = 0; g < P; ++g)
        W.push(k());
      return W;
    }
  }
  n([
    b
  ], x.prototype, "readU8", null), n([
    b
  ], x.prototype, "readU16", null), n([
    b
  ], x.prototype, "readU32", null), n([
    b
  ], x.prototype, "readU64", null), n([
    b
  ], x.prototype, "readU128", null), n([
    b
  ], x.prototype, "readU256", null), n([
    b
  ], x.prototype, "readU512", null), n([
    b
  ], x.prototype, "readString", null), n([
    b
  ], x.prototype, "readFixedArray", null), n([
    b
  ], x.prototype, "readArray", null), Se.BinaryReader = x;
  function q(j) {
    return j.charAt(0).toUpperCase() + j.slice(1);
  }
  function X(j, k, P, W, g) {
    try {
      if (typeof W == "string")
        g[`write${q(W)}`](P);
      else if (W instanceof Array)
        if (typeof W[0] == "number") {
          if (P.length !== W[0])
            throw new v(`Expecting byte array of length ${W[0]}, but got ${P.length} bytes`);
          g.writeFixedArray(P);
        } else if (W.length === 2 && typeof W[1] == "number") {
          if (P.length !== W[1])
            throw new v(`Expecting byte array of length ${W[1]}, but got ${P.length} bytes`);
          for (let a = 0; a < W[1]; a++)
            X(j, null, P[a], W[0], g);
        } else
          g.writeArray(P, (a) => {
            X(j, k, a, W[0], g);
          });
      else if (W.kind !== void 0)
        switch (W.kind) {
          case "option": {
            P == null ? g.writeU8(0) : (g.writeU8(1), X(j, k, P, W.type, g));
            break;
          }
          case "map": {
            g.writeU32(P.size), P.forEach((a, _) => {
              X(j, k, _, W.key, g), X(j, k, a, W.value, g);
            });
            break;
          }
          default:
            throw new v(`FieldType ${W} unrecognized`);
        }
      else
        H(j, P, g);
    } catch (a) {
      throw a instanceof v && a.addToFieldPath(k), a;
    }
  }
  function H(j, k, P) {
    if (typeof k.borshSerialize == "function") {
      k.borshSerialize(P);
      return;
    }
    const W = j.get(k.constructor);
    if (!W)
      throw new v(`Class ${k.constructor.name} is missing in schema`);
    if (W.kind === "struct")
      W.fields.map(([g, a]) => {
        X(j, g, k[g], a, P);
      });
    else if (W.kind === "enum") {
      const g = k[W.field];
      for (let a = 0; a < W.values.length; ++a) {
        const [_, R] = W.values[a];
        if (_ === g) {
          P.writeU8(a), X(j, _, k[_], R, P);
          break;
        }
      }
    } else
      throw new v(`Unexpected schema kind: ${W.kind} for ${k.constructor.name}`);
  }
  function $(j, k, P = M) {
    const W = new P();
    return H(j, k, W), W.toArray();
  }
  Se.serialize = $;
  function K(j, k, P, W) {
    try {
      if (typeof P == "string")
        return W[`read${q(P)}`]();
      if (P instanceof Array) {
        if (typeof P[0] == "number")
          return W.readFixedArray(P[0]);
        if (typeof P[1] == "number") {
          const g = [];
          for (let a = 0; a < P[1]; a++)
            g.push(K(j, null, P[0], W));
          return g;
        } else
          return W.readArray(() => K(j, k, P[0], W));
      }
      if (P.kind === "option")
        return W.readU8() ? K(j, k, P.type, W) : void 0;
      if (P.kind === "map") {
        let g = /* @__PURE__ */ new Map();
        const a = W.readU32();
        for (let _ = 0; _ < a; _++) {
          const R = K(j, k, P.key, W), N = K(j, k, P.value, W);
          g.set(R, N);
        }
        return g;
      }
      return J(j, P, W);
    } catch (g) {
      throw g instanceof v && g.addToFieldPath(k), g;
    }
  }
  function J(j, k, P) {
    if (typeof k.borshDeserialize == "function")
      return k.borshDeserialize(P);
    const W = j.get(k);
    if (!W)
      throw new v(`Class ${k.name} is missing in schema`);
    if (W.kind === "struct") {
      const g = {};
      for (const [a, _] of j.get(k).fields)
        g[a] = K(j, a, _, P);
      return new k(g);
    }
    if (W.kind === "enum") {
      const g = P.readU8();
      if (g >= W.values.length)
        throw new v(`Enum index: ${g} is out of range`);
      const [a, _] = W.values[g], R = K(j, a, _, P);
      return new k({ [a]: R });
    }
    throw new v(`Unexpected schema kind: ${W.kind} for ${k.constructor.name}`);
  }
  function te(j, k, P, W = x) {
    const g = new W(P), a = J(j, k, g);
    if (g.offset < P.length)
      throw new v(`Unexpected ${P.length - g.offset} bytes after deserialized data`);
    return a;
  }
  Se.deserialize = te;
  function re(j, k, P, W = x) {
    const g = new W(P);
    return J(j, k, g);
  }
  return Se.deserializeUnchecked = re, Se;
}
var Vi = Th(), G = {}, ca;
function Ih() {
  if (ca) return G;
  ca = 1, Object.defineProperty(G, "__esModule", { value: !0 }), G.s16 = G.s8 = G.nu64be = G.u48be = G.u40be = G.u32be = G.u24be = G.u16be = G.nu64 = G.u48 = G.u40 = G.u32 = G.u24 = G.u16 = G.u8 = G.offset = G.greedy = G.Constant = G.UTF8 = G.CString = G.Blob = G.Boolean = G.BitField = G.BitStructure = G.VariantLayout = G.Union = G.UnionLayoutDiscriminator = G.UnionDiscriminator = G.Structure = G.Sequence = G.DoubleBE = G.Double = G.FloatBE = G.Float = G.NearInt64BE = G.NearInt64 = G.NearUInt64BE = G.NearUInt64 = G.IntBE = G.Int = G.UIntBE = G.UInt = G.OffsetLayout = G.GreedyCount = G.ExternalLayout = G.bindConstructorLayout = G.nameWithProperty = G.Layout = G.uint8ArrayToBuffer = G.checkUint8Array = void 0, G.constant = G.utf8 = G.cstr = G.blob = G.unionLayoutDiscriminator = G.union = G.seq = G.bits = G.struct = G.f64be = G.f64 = G.f32be = G.f32 = G.ns64be = G.s48be = G.s40be = G.s32be = G.s24be = G.s16be = G.ns64 = G.s48 = G.s40 = G.s32 = G.s24 = void 0;
  const e = Lo();
  function t(c) {
    if (!(c instanceof Uint8Array))
      throw new TypeError("b must be a Uint8Array");
  }
  G.checkUint8Array = t;
  function n(c) {
    return t(c), e.Buffer.from(c.buffer, c.byteOffset, c.length);
  }
  G.uint8ArrayToBuffer = n;
  let r = class {
    constructor(u, E) {
      if (!Number.isInteger(u))
        throw new TypeError("span must be an integer");
      this.span = u, this.property = E;
    }
    /** Function to create an Object into which decoded properties will
     * be written.
     *
     * Used only for layouts that {@link Layout#decode|decode} to Object
     * instances, which means:
     * * {@link Structure}
     * * {@link Union}
     * * {@link VariantLayout}
     * * {@link BitStructure}
     *
     * If left undefined the JavaScript representation of these layouts
     * will be Object instances.
     *
     * See {@link bindConstructorLayout}.
     */
    makeDestinationObject() {
      return {};
    }
    /**
     * Calculate the span of a specific instance of a layout.
     *
     * @param {Uint8Array} b - the buffer that contains an encoded instance.
     *
     * @param {Number} [offset] - the offset at which the encoded instance
     * starts.  If absent a zero offset is inferred.
     *
     * @return {Number} - the number of bytes covered by the layout
     * instance.  If this method is not overridden in a subclass the
     * definition-time constant {@link Layout#span|span} will be
     * returned.
     *
     * @throws {RangeError} - if the length of the value cannot be
     * determined.
     */
    getSpan(u, E) {
      if (0 > this.span)
        throw new RangeError("indeterminate span");
      return this.span;
    }
    /**
     * Replicate the layout using a new property.
     *
     * This function must be used to get a structurally-equivalent layout
     * with a different name since all {@link Layout} instances are
     * immutable.
     *
     * **NOTE** This is a shallow copy.  All fields except {@link
     * Layout#property|property} are strictly equal to the origin layout.
     *
     * @param {String} property - the value for {@link
     * Layout#property|property} in the replica.
     *
     * @returns {Layout} - the copy with {@link Layout#property|property}
     * set to `property`.
     */
    replicate(u) {
      const E = Object.create(this.constructor.prototype);
      return Object.assign(E, this), E.property = u, E;
    }
    /**
     * Create an object from layout properties and an array of values.
     *
     * **NOTE** This function returns `undefined` if invoked on a layout
     * that does not return its value as an Object.  Objects are
     * returned for things that are a {@link Structure}, which includes
     * {@link VariantLayout|variant layouts} if they are structures, and
     * excludes {@link Union}s.  If you want this feature for a union
     * you must use {@link Union.getVariant|getVariant} to select the
     * desired layout.
     *
     * @param {Array} values - an array of values that correspond to the
     * default order for properties.  As with {@link Layout#decode|decode}
     * layout elements that have no property name are skipped when
     * iterating over the array values.  Only the top-level properties are
     * assigned; arguments are not assigned to properties of contained
     * layouts.  Any unused values are ignored.
     *
     * @return {(Object|undefined)}
     */
    fromArray(u) {
    }
  };
  G.Layout = r;
  function o(c, u) {
    return u.property ? c + "[" + u.property + "]" : c;
  }
  G.nameWithProperty = o;
  function i(c, u) {
    if (typeof c != "function")
      throw new TypeError("Class must be constructor");
    if (Object.prototype.hasOwnProperty.call(c, "layout_"))
      throw new Error("Class is already bound to a layout");
    if (!(u && u instanceof r))
      throw new TypeError("layout must be a Layout");
    if (Object.prototype.hasOwnProperty.call(u, "boundConstructor_"))
      throw new Error("layout is already bound to a constructor");
    c.layout_ = u, u.boundConstructor_ = c, u.makeDestinationObject = (() => new c()), Object.defineProperty(c.prototype, "encode", {
      value(E, T) {
        return u.encode(this, E, T);
      },
      writable: !0
    }), Object.defineProperty(c, "decode", {
      value(E, T) {
        return u.decode(E, T);
      },
      writable: !0
    });
  }
  G.bindConstructorLayout = i;
  class s extends r {
    /**
     * Return `true` iff the external layout decodes to an unsigned
     * integer layout.
     *
     * In that case it can be used as the source of {@link
     * Sequence#count|Sequence counts}, {@link Blob#length|Blob lengths},
     * or as {@link UnionLayoutDiscriminator#layout|external union
     * discriminators}.
     *
     * @abstract
     */
    isCount() {
      throw new Error("ExternalLayout is abstract");
    }
  }
  G.ExternalLayout = s;
  class l extends s {
    constructor(u = 1, E) {
      if (!Number.isInteger(u) || 0 >= u)
        throw new TypeError("elementSpan must be a (positive) integer");
      super(-1, E), this.elementSpan = u;
    }
    /** @override */
    isCount() {
      return !0;
    }
    /** @override */
    decode(u, E = 0) {
      t(u);
      const T = u.length - E;
      return Math.floor(T / this.elementSpan);
    }
    /** @override */
    encode(u, E, T) {
      return 0;
    }
  }
  G.GreedyCount = l;
  class f extends s {
    constructor(u, E = 0, T) {
      if (!(u instanceof r))
        throw new TypeError("layout must be a Layout");
      if (!Number.isInteger(E))
        throw new TypeError("offset must be integer or undefined");
      super(u.span, T || u.property), this.layout = u, this.offset = E;
    }
    /** @override */
    isCount() {
      return this.layout instanceof m || this.layout instanceof y;
    }
    /** @override */
    decode(u, E = 0) {
      return this.layout.decode(u, E + this.offset);
    }
    /** @override */
    encode(u, E, T = 0) {
      return this.layout.encode(u, E, T + this.offset);
    }
  }
  G.OffsetLayout = f;
  class m extends r {
    constructor(u, E) {
      if (super(u, E), 6 < this.span)
        throw new RangeError("span must not exceed 6 bytes");
    }
    /** @override */
    decode(u, E = 0) {
      return n(u).readUIntLE(E, this.span);
    }
    /** @override */
    encode(u, E, T = 0) {
      return n(E).writeUIntLE(u, T, this.span), this.span;
    }
  }
  G.UInt = m;
  class y extends r {
    constructor(u, E) {
      if (super(u, E), 6 < this.span)
        throw new RangeError("span must not exceed 6 bytes");
    }
    /** @override */
    decode(u, E = 0) {
      return n(u).readUIntBE(E, this.span);
    }
    /** @override */
    encode(u, E, T = 0) {
      return n(E).writeUIntBE(u, T, this.span), this.span;
    }
  }
  G.UIntBE = y;
  class C extends r {
    constructor(u, E) {
      if (super(u, E), 6 < this.span)
        throw new RangeError("span must not exceed 6 bytes");
    }
    /** @override */
    decode(u, E = 0) {
      return n(u).readIntLE(E, this.span);
    }
    /** @override */
    encode(u, E, T = 0) {
      return n(E).writeIntLE(u, T, this.span), this.span;
    }
  }
  G.Int = C;
  class D extends r {
    constructor(u, E) {
      if (super(u, E), 6 < this.span)
        throw new RangeError("span must not exceed 6 bytes");
    }
    /** @override */
    decode(u, E = 0) {
      return n(u).readIntBE(E, this.span);
    }
    /** @override */
    encode(u, E, T = 0) {
      return n(E).writeIntBE(u, T, this.span), this.span;
    }
  }
  G.IntBE = D;
  const v = Math.pow(2, 32);
  function M(c) {
    const u = Math.floor(c / v), E = c - u * v;
    return { hi32: u, lo32: E };
  }
  function b(c, u) {
    return c * v + u;
  }
  class x extends r {
    constructor(u) {
      super(8, u);
    }
    /** @override */
    decode(u, E = 0) {
      const T = n(u), U = T.readUInt32LE(E), z = T.readUInt32LE(E + 4);
      return b(z, U);
    }
    /** @override */
    encode(u, E, T = 0) {
      const U = M(u), z = n(E);
      return z.writeUInt32LE(U.lo32, T), z.writeUInt32LE(U.hi32, T + 4), 8;
    }
  }
  G.NearUInt64 = x;
  class q extends r {
    constructor(u) {
      super(8, u);
    }
    /** @override */
    decode(u, E = 0) {
      const T = n(u), U = T.readUInt32BE(E), z = T.readUInt32BE(E + 4);
      return b(U, z);
    }
    /** @override */
    encode(u, E, T = 0) {
      const U = M(u), z = n(E);
      return z.writeUInt32BE(U.hi32, T), z.writeUInt32BE(U.lo32, T + 4), 8;
    }
  }
  G.NearUInt64BE = q;
  class X extends r {
    constructor(u) {
      super(8, u);
    }
    /** @override */
    decode(u, E = 0) {
      const T = n(u), U = T.readUInt32LE(E), z = T.readInt32LE(E + 4);
      return b(z, U);
    }
    /** @override */
    encode(u, E, T = 0) {
      const U = M(u), z = n(E);
      return z.writeUInt32LE(U.lo32, T), z.writeInt32LE(U.hi32, T + 4), 8;
    }
  }
  G.NearInt64 = X;
  class H extends r {
    constructor(u) {
      super(8, u);
    }
    /** @override */
    decode(u, E = 0) {
      const T = n(u), U = T.readInt32BE(E), z = T.readUInt32BE(E + 4);
      return b(U, z);
    }
    /** @override */
    encode(u, E, T = 0) {
      const U = M(u), z = n(E);
      return z.writeInt32BE(U.hi32, T), z.writeUInt32BE(U.lo32, T + 4), 8;
    }
  }
  G.NearInt64BE = H;
  class $ extends r {
    constructor(u) {
      super(4, u);
    }
    /** @override */
    decode(u, E = 0) {
      return n(u).readFloatLE(E);
    }
    /** @override */
    encode(u, E, T = 0) {
      return n(E).writeFloatLE(u, T), 4;
    }
  }
  G.Float = $;
  class K extends r {
    constructor(u) {
      super(4, u);
    }
    /** @override */
    decode(u, E = 0) {
      return n(u).readFloatBE(E);
    }
    /** @override */
    encode(u, E, T = 0) {
      return n(E).writeFloatBE(u, T), 4;
    }
  }
  G.FloatBE = K;
  class J extends r {
    constructor(u) {
      super(8, u);
    }
    /** @override */
    decode(u, E = 0) {
      return n(u).readDoubleLE(E);
    }
    /** @override */
    encode(u, E, T = 0) {
      return n(E).writeDoubleLE(u, T), 8;
    }
  }
  G.Double = J;
  class te extends r {
    constructor(u) {
      super(8, u);
    }
    /** @override */
    decode(u, E = 0) {
      return n(u).readDoubleBE(E);
    }
    /** @override */
    encode(u, E, T = 0) {
      return n(E).writeDoubleBE(u, T), 8;
    }
  }
  G.DoubleBE = te;
  class re extends r {
    constructor(u, E, T) {
      if (!(u instanceof r))
        throw new TypeError("elementLayout must be a Layout");
      if (!(E instanceof s && E.isCount() || Number.isInteger(E) && 0 <= E))
        throw new TypeError("count must be non-negative integer or an unsigned integer ExternalLayout");
      let U = -1;
      !(E instanceof s) && 0 < u.span && (U = E * u.span), super(U, T), this.elementLayout = u, this.count = E;
    }
    /** @override */
    getSpan(u, E = 0) {
      if (0 <= this.span)
        return this.span;
      let T = 0, U = this.count;
      if (U instanceof s && (U = U.decode(u, E)), 0 < this.elementLayout.span)
        T = U * this.elementLayout.span;
      else {
        let z = 0;
        for (; z < U; )
          T += this.elementLayout.getSpan(u, E + T), ++z;
      }
      return T;
    }
    /** @override */
    decode(u, E = 0) {
      const T = [];
      let U = 0, z = this.count;
      for (z instanceof s && (z = z.decode(u, E)); U < z; )
        T.push(this.elementLayout.decode(u, E)), E += this.elementLayout.getSpan(u, E), U += 1;
      return T;
    }
    /** Implement {@link Layout#encode|encode} for {@link Sequence}.
     *
     * **NOTE** If `src` is shorter than {@link Sequence#count|count} then
     * the unused space in the buffer is left unchanged.  If `src` is
     * longer than {@link Sequence#count|count} the unneeded elements are
     * ignored.
     *
     * **NOTE** If {@link Layout#count|count} is an instance of {@link
     * ExternalLayout} then the length of `src` will be encoded as the
     * count after `src` is encoded. */
    encode(u, E, T = 0) {
      const U = this.elementLayout, z = u.reduce((ee, ie) => ee + U.encode(ie, E, T + ee), 0);
      return this.count instanceof s && this.count.encode(u.length, E, T), z;
    }
  }
  G.Sequence = re;
  class j extends r {
    constructor(u, E, T) {
      if (!(Array.isArray(u) && u.reduce((z, ee) => z && ee instanceof r, !0)))
        throw new TypeError("fields must be array of Layout instances");
      typeof E == "boolean" && T === void 0 && (T = E, E = void 0);
      for (const z of u)
        if (0 > z.span && z.property === void 0)
          throw new Error("fields cannot contain unnamed variable-length layout");
      let U = -1;
      try {
        U = u.reduce((z, ee) => z + ee.getSpan(), 0);
      } catch {
      }
      super(U, E), this.fields = u, this.decodePrefixes = !!T;
    }
    /** @override */
    getSpan(u, E = 0) {
      if (0 <= this.span)
        return this.span;
      let T = 0;
      try {
        T = this.fields.reduce((U, z) => {
          const ee = z.getSpan(u, E);
          return E += ee, U + ee;
        }, 0);
      } catch {
        throw new RangeError("indeterminate span");
      }
      return T;
    }
    /** @override */
    decode(u, E = 0) {
      t(u);
      const T = this.makeDestinationObject();
      for (const U of this.fields)
        if (U.property !== void 0 && (T[U.property] = U.decode(u, E)), E += U.getSpan(u, E), this.decodePrefixes && u.length === E)
          break;
      return T;
    }
    /** Implement {@link Layout#encode|encode} for {@link Structure}.
     *
     * If `src` is missing a property for a member with a defined {@link
     * Layout#property|property} the corresponding region of the buffer is
     * left unmodified. */
    encode(u, E, T = 0) {
      const U = T;
      let z = 0, ee = 0;
      for (const ie of this.fields) {
        let me = ie.span;
        if (ee = 0 < me ? me : 0, ie.property !== void 0) {
          const _e = u[ie.property];
          _e !== void 0 && (ee = ie.encode(_e, E, T), 0 > me && (me = ie.getSpan(E, T)));
        }
        z = T, T += me;
      }
      return z + ee - U;
    }
    /** @override */
    fromArray(u) {
      const E = this.makeDestinationObject();
      for (const T of this.fields)
        T.property !== void 0 && 0 < u.length && (E[T.property] = u.shift());
      return E;
    }
    /**
     * Get access to the layout of a given property.
     *
     * @param {String} property - the structure member of interest.
     *
     * @return {Layout} - the layout associated with `property`, or
     * undefined if there is no such property.
     */
    layoutFor(u) {
      if (typeof u != "string")
        throw new TypeError("property must be string");
      for (const E of this.fields)
        if (E.property === u)
          return E;
    }
    /**
     * Get the offset of a structure member.
     *
     * @param {String} property - the structure member of interest.
     *
     * @return {Number} - the offset in bytes to the start of `property`
     * within the structure, or undefined if `property` is not a field
     * within the structure.  If the property is a member but follows a
     * variable-length structure member a negative number will be
     * returned.
     */
    offsetOf(u) {
      if (typeof u != "string")
        throw new TypeError("property must be string");
      let E = 0;
      for (const T of this.fields) {
        if (T.property === u)
          return E;
        0 > T.span ? E = -1 : 0 <= E && (E += T.span);
      }
    }
  }
  G.Structure = j;
  class k {
    constructor(u) {
      this.property = u;
    }
    /** Analog to {@link Layout#decode|Layout decode} for union discriminators.
     *
     * The implementation of this method need not reference the buffer if
     * variant information is available through other means. */
    decode(u, E) {
      throw new Error("UnionDiscriminator is abstract");
    }
    /** Analog to {@link Layout#decode|Layout encode} for union discriminators.
     *
     * The implementation of this method need not store the value if
     * variant information is maintained through other means. */
    encode(u, E, T) {
      throw new Error("UnionDiscriminator is abstract");
    }
  }
  G.UnionDiscriminator = k;
  class P extends k {
    constructor(u, E) {
      if (!(u instanceof s && u.isCount()))
        throw new TypeError("layout must be an unsigned integer ExternalLayout");
      super(E || u.property || "variant"), this.layout = u;
    }
    /** Delegate decoding to {@link UnionLayoutDiscriminator#layout|layout}. */
    decode(u, E) {
      return this.layout.decode(u, E);
    }
    /** Delegate encoding to {@link UnionLayoutDiscriminator#layout|layout}. */
    encode(u, E, T) {
      return this.layout.encode(u, E, T);
    }
  }
  G.UnionLayoutDiscriminator = P;
  class W extends r {
    constructor(u, E, T) {
      let U;
      if (u instanceof m || u instanceof y)
        U = new P(new f(u));
      else if (u instanceof s && u.isCount())
        U = new P(u);
      else if (u instanceof k)
        U = u;
      else
        throw new TypeError("discr must be a UnionDiscriminator or an unsigned integer layout");
      if (E === void 0 && (E = null), !(E === null || E instanceof r))
        throw new TypeError("defaultLayout must be null or a Layout");
      if (E !== null) {
        if (0 > E.span)
          throw new Error("defaultLayout must have constant span");
        E.property === void 0 && (E = E.replicate("content"));
      }
      let z = -1;
      E && (z = E.span, 0 <= z && (u instanceof m || u instanceof y) && (z += U.layout.span)), super(z, T), this.discriminator = U, this.usesPrefixDiscriminator = u instanceof m || u instanceof y, this.defaultLayout = E, this.registry = {};
      let ee = this.defaultGetSourceVariant.bind(this);
      this.getSourceVariant = function(ie) {
        return ee(ie);
      }, this.configGetSourceVariant = function(ie) {
        ee = ie.bind(this);
      };
    }
    /** @override */
    getSpan(u, E = 0) {
      if (0 <= this.span)
        return this.span;
      const T = this.getVariant(u, E);
      if (!T)
        throw new Error("unable to determine span for unrecognized variant");
      return T.getSpan(u, E);
    }
    /**
     * Method to infer a registered Union variant compatible with `src`.
     *
     * The first satisfied rule in the following sequence defines the
     * return value:
     * * If `src` has properties matching the Union discriminator and
     *   the default layout, `undefined` is returned regardless of the
     *   value of the discriminator property (this ensures the default
     *   layout will be used);
     * * If `src` has a property matching the Union discriminator, the
     *   value of the discriminator identifies a registered variant, and
     *   either (a) the variant has no layout, or (b) `src` has the
     *   variant's property, then the variant is returned (because the
     *   source satisfies the constraints of the variant it identifies);
     * * If `src` does not have a property matching the Union
     *   discriminator, but does have a property matching a registered
     *   variant, then the variant is returned (because the source
     *   matches a variant without an explicit conflict);
     * * An error is thrown (because we either can't identify a variant,
     *   or we were explicitly told the variant but can't satisfy it).
     *
     * @param {Object} src - an object presumed to be compatible with
     * the content of the Union.
     *
     * @return {(undefined|VariantLayout)} - as described above.
     *
     * @throws {Error} - if `src` cannot be associated with a default or
     * registered variant.
     */
    defaultGetSourceVariant(u) {
      if (Object.prototype.hasOwnProperty.call(u, this.discriminator.property)) {
        if (this.defaultLayout && this.defaultLayout.property && Object.prototype.hasOwnProperty.call(u, this.defaultLayout.property))
          return;
        const E = this.registry[u[this.discriminator.property]];
        if (E && (!E.layout || E.property && Object.prototype.hasOwnProperty.call(u, E.property)))
          return E;
      } else
        for (const E in this.registry) {
          const T = this.registry[E];
          if (T.property && Object.prototype.hasOwnProperty.call(u, T.property))
            return T;
        }
      throw new Error("unable to infer src variant");
    }
    /** Implement {@link Layout#decode|decode} for {@link Union}.
     *
     * If the variant is {@link Union#addVariant|registered} the return
     * value is an instance of that variant, with no explicit
     * discriminator.  Otherwise the {@link Union#defaultLayout|default
     * layout} is used to decode the content. */
    decode(u, E = 0) {
      let T;
      const U = this.discriminator, z = U.decode(u, E), ee = this.registry[z];
      if (ee === void 0) {
        const ie = this.defaultLayout;
        let me = 0;
        this.usesPrefixDiscriminator && (me = U.layout.span), T = this.makeDestinationObject(), T[U.property] = z, T[ie.property] = ie.decode(u, E + me);
      } else
        T = ee.decode(u, E);
      return T;
    }
    /** Implement {@link Layout#encode|encode} for {@link Union}.
     *
     * This API assumes the `src` object is consistent with the union's
     * {@link Union#defaultLayout|default layout}.  To encode variants
     * use the appropriate variant-specific {@link VariantLayout#encode}
     * method. */
    encode(u, E, T = 0) {
      const U = this.getSourceVariant(u);
      if (U === void 0) {
        const z = this.discriminator, ee = this.defaultLayout;
        let ie = 0;
        return this.usesPrefixDiscriminator && (ie = z.layout.span), z.encode(u[z.property], E, T), ie + ee.encode(u[ee.property], E, T + ie);
      }
      return U.encode(u, E, T);
    }
    /** Register a new variant structure within a union.  The newly
     * created variant is returned.
     *
     * @param {Number} variant - initializer for {@link
     * VariantLayout#variant|variant}.
     *
     * @param {Layout} layout - initializer for {@link
     * VariantLayout#layout|layout}.
     *
     * @param {String} property - initializer for {@link
     * Layout#property|property}.
     *
     * @return {VariantLayout} */
    addVariant(u, E, T) {
      const U = new g(this, u, E, T);
      return this.registry[u] = U, U;
    }
    /**
     * Get the layout associated with a registered variant.
     *
     * If `vb` does not produce a registered variant the function returns
     * `undefined`.
     *
     * @param {(Number|Uint8Array)} vb - either the variant number, or a
     * buffer from which the discriminator is to be read.
     *
     * @param {Number} offset - offset into `vb` for the start of the
     * union.  Used only when `vb` is an instance of {Uint8Array}.
     *
     * @return {({VariantLayout}|undefined)}
     */
    getVariant(u, E = 0) {
      let T;
      return u instanceof Uint8Array ? T = this.discriminator.decode(u, E) : T = u, this.registry[T];
    }
  }
  G.Union = W;
  class g extends r {
    constructor(u, E, T, U) {
      if (!(u instanceof W))
        throw new TypeError("union must be a Union");
      if (!Number.isInteger(E) || 0 > E)
        throw new TypeError("variant must be a (non-negative) integer");
      if (typeof T == "string" && U === void 0 && (U = T, T = null), T) {
        if (!(T instanceof r))
          throw new TypeError("layout must be a Layout");
        if (u.defaultLayout !== null && 0 <= T.span && T.span > u.defaultLayout.span)
          throw new Error("variant span exceeds span of containing union");
        if (typeof U != "string")
          throw new TypeError("variant must have a String property");
      }
      let z = u.span;
      0 > u.span && (z = T ? T.span : 0, 0 <= z && u.usesPrefixDiscriminator && (z += u.discriminator.layout.span)), super(z, U), this.union = u, this.variant = E, this.layout = T || null;
    }
    /** @override */
    getSpan(u, E = 0) {
      if (0 <= this.span)
        return this.span;
      let T = 0;
      this.union.usesPrefixDiscriminator && (T = this.union.discriminator.layout.span);
      let U = 0;
      return this.layout && (U = this.layout.getSpan(u, E + T)), T + U;
    }
    /** @override */
    decode(u, E = 0) {
      const T = this.makeDestinationObject();
      if (this !== this.union.getVariant(u, E))
        throw new Error("variant mismatch");
      let U = 0;
      return this.union.usesPrefixDiscriminator && (U = this.union.discriminator.layout.span), this.layout ? T[this.property] = this.layout.decode(u, E + U) : this.property ? T[this.property] = !0 : this.union.usesPrefixDiscriminator && (T[this.union.discriminator.property] = this.variant), T;
    }
    /** @override */
    encode(u, E, T = 0) {
      let U = 0;
      if (this.union.usesPrefixDiscriminator && (U = this.union.discriminator.layout.span), this.layout && !Object.prototype.hasOwnProperty.call(u, this.property))
        throw new TypeError("variant lacks property " + this.property);
      this.union.discriminator.encode(this.variant, E, T);
      let z = U;
      if (this.layout && (this.layout.encode(u[this.property], E, T + U), z += this.layout.getSpan(E, T + U), 0 <= this.union.span && z > this.union.span))
        throw new Error("encoded variant overruns containing union");
      return z;
    }
    /** Delegate {@link Layout#fromArray|fromArray} to {@link
     * VariantLayout#layout|layout}. */
    fromArray(u) {
      if (this.layout)
        return this.layout.fromArray(u);
    }
  }
  G.VariantLayout = g;
  function a(c) {
    return 0 > c && (c += 4294967296), c;
  }
  class _ extends r {
    constructor(u, E, T) {
      if (!(u instanceof m || u instanceof y))
        throw new TypeError("word must be a UInt or UIntBE layout");
      if (typeof E == "string" && T === void 0 && (T = E, E = !1), 4 < u.span)
        throw new RangeError("word cannot exceed 32 bits");
      super(u.span, T), this.word = u, this.msb = !!E, this.fields = [];
      let U = 0;
      this._packedSetValue = function(z) {
        return U = a(z), this;
      }, this._packedGetValue = function() {
        return U;
      };
    }
    /** @override */
    decode(u, E = 0) {
      const T = this.makeDestinationObject(), U = this.word.decode(u, E);
      this._packedSetValue(U);
      for (const z of this.fields)
        z.property !== void 0 && (T[z.property] = z.decode(u));
      return T;
    }
    /** Implement {@link Layout#encode|encode} for {@link BitStructure}.
     *
     * If `src` is missing a property for a member with a defined {@link
     * Layout#property|property} the corresponding region of the packed
     * value is left unmodified.  Unused bits are also left unmodified. */
    encode(u, E, T = 0) {
      const U = this.word.decode(E, T);
      this._packedSetValue(U);
      for (const z of this.fields)
        if (z.property !== void 0) {
          const ee = u[z.property];
          ee !== void 0 && z.encode(ee);
        }
      return this.word.encode(this._packedGetValue(), E, T);
    }
    /** Register a new bitfield with a containing bit structure.  The
     * resulting bitfield is returned.
     *
     * @param {Number} bits - initializer for {@link BitField#bits|bits}.
     *
     * @param {string} property - initializer for {@link
     * Layout#property|property}.
     *
     * @return {BitField} */
    addField(u, E) {
      const T = new R(this, u, E);
      return this.fields.push(T), T;
    }
    /** As with {@link BitStructure#addField|addField} for single-bit
     * fields with `boolean` value representation.
     *
     * @param {string} property - initializer for {@link
     * Layout#property|property}.
     *
     * @return {Boolean} */
    // `Boolean` conflicts with the native primitive type
    // eslint-disable-next-line @typescript-eslint/ban-types
    addBoolean(u) {
      const E = new N(this, u);
      return this.fields.push(E), E;
    }
    /**
     * Get access to the bit field for a given property.
     *
     * @param {String} property - the bit field of interest.
     *
     * @return {BitField} - the field associated with `property`, or
     * undefined if there is no such property.
     */
    fieldFor(u) {
      if (typeof u != "string")
        throw new TypeError("property must be string");
      for (const E of this.fields)
        if (E.property === u)
          return E;
    }
  }
  G.BitStructure = _;
  class R {
    constructor(u, E, T) {
      if (!(u instanceof _))
        throw new TypeError("container must be a BitStructure");
      if (!Number.isInteger(E) || 0 >= E)
        throw new TypeError("bits must be positive integer");
      const U = 8 * u.span, z = u.fields.reduce((ee, ie) => ee + ie.bits, 0);
      if (E + z > U)
        throw new Error("bits too long for span remainder (" + (U - z) + " of " + U + " remain)");
      this.container = u, this.bits = E, this.valueMask = (1 << E) - 1, E === 32 && (this.valueMask = 4294967295), this.start = z, this.container.msb && (this.start = U - z - E), this.wordMask = a(this.valueMask << this.start), this.property = T;
    }
    /** Store a value into the corresponding subsequence of the containing
     * bit field. */
    decode(u, E) {
      const T = this.container._packedGetValue();
      return a(T & this.wordMask) >>> this.start;
    }
    /** Store a value into the corresponding subsequence of the containing
     * bit field.
     *
     * **NOTE** This is not a specialization of {@link
     * Layout#encode|Layout.encode} and there is no return value. */
    encode(u) {
      if (typeof u != "number" || !Number.isInteger(u) || u !== a(u & this.valueMask))
        throw new TypeError(o("BitField.encode", this) + " value must be integer not exceeding " + this.valueMask);
      const E = this.container._packedGetValue(), T = a(u << this.start);
      this.container._packedSetValue(a(E & ~this.wordMask) | T);
    }
  }
  G.BitField = R;
  class N extends R {
    constructor(u, E) {
      super(u, 1, E);
    }
    /** Override {@link BitField#decode|decode} for {@link Boolean|Boolean}.
     *
     * @returns {boolean} */
    decode(u, E) {
      return !!super.decode(u, E);
    }
    /** @override */
    encode(u) {
      typeof u == "boolean" && (u = +u), super.encode(u);
    }
  }
  G.Boolean = N;
  class O extends r {
    constructor(u, E) {
      if (!(u instanceof s && u.isCount() || Number.isInteger(u) && 0 <= u))
        throw new TypeError("length must be positive integer or an unsigned integer ExternalLayout");
      let T = -1;
      u instanceof s || (T = u), super(T, E), this.length = u;
    }
    /** @override */
    getSpan(u, E) {
      let T = this.span;
      return 0 > T && (T = this.length.decode(u, E)), T;
    }
    /** @override */
    decode(u, E = 0) {
      let T = this.span;
      return 0 > T && (T = this.length.decode(u, E)), n(u).slice(E, E + T);
    }
    /** Implement {@link Layout#encode|encode} for {@link Blob}.
     *
     * **NOTE** If {@link Layout#count|count} is an instance of {@link
     * ExternalLayout} then the length of `src` will be encoded as the
     * count after `src` is encoded. */
    encode(u, E, T) {
      let U = this.length;
      if (this.length instanceof s && (U = u.length), !(u instanceof Uint8Array && U === u.length))
        throw new TypeError(o("Blob.encode", this) + " requires (length " + U + ") Uint8Array as src");
      if (T + U > E.length)
        throw new RangeError("encoding overruns Uint8Array");
      const z = n(u);
      return n(E).write(z.toString("hex"), T, U, "hex"), this.length instanceof s && this.length.encode(U, E, T), U;
    }
  }
  G.Blob = O;
  class S extends r {
    constructor(u) {
      super(-1, u);
    }
    /** @override */
    getSpan(u, E = 0) {
      t(u);
      let T = E;
      for (; T < u.length && u[T] !== 0; )
        T += 1;
      return 1 + T - E;
    }
    /** @override */
    decode(u, E = 0) {
      const T = this.getSpan(u, E);
      return n(u).slice(E, E + T - 1).toString("utf-8");
    }
    /** @override */
    encode(u, E, T = 0) {
      typeof u != "string" && (u = String(u));
      const U = e.Buffer.from(u, "utf8"), z = U.length;
      if (T + z > E.length)
        throw new RangeError("encoding overruns Buffer");
      const ee = n(E);
      return U.copy(ee, T), ee[T + z] = 0, z + 1;
    }
  }
  G.CString = S;
  class w extends r {
    constructor(u, E) {
      if (typeof u == "string" && E === void 0 && (E = u, u = void 0), u === void 0)
        u = -1;
      else if (!Number.isInteger(u))
        throw new TypeError("maxSpan must be an integer");
      super(-1, E), this.maxSpan = u;
    }
    /** @override */
    getSpan(u, E = 0) {
      return t(u), u.length - E;
    }
    /** @override */
    decode(u, E = 0) {
      const T = this.getSpan(u, E);
      if (0 <= this.maxSpan && this.maxSpan < T)
        throw new RangeError("text length exceeds maxSpan");
      return n(u).slice(E, E + T).toString("utf-8");
    }
    /** @override */
    encode(u, E, T = 0) {
      typeof u != "string" && (u = String(u));
      const U = e.Buffer.from(u, "utf8"), z = U.length;
      if (0 <= this.maxSpan && this.maxSpan < z)
        throw new RangeError("text length exceeds maxSpan");
      if (T + z > E.length)
        throw new RangeError("encoding overruns Buffer");
      return U.copy(n(E), T), z;
    }
  }
  G.UTF8 = w;
  class A extends r {
    constructor(u, E) {
      super(0, E), this.value = u;
    }
    /** @override */
    decode(u, E) {
      return this.value;
    }
    /** @override */
    encode(u, E, T) {
      return 0;
    }
  }
  return G.Constant = A, G.greedy = ((c, u) => new l(c, u)), G.offset = ((c, u, E) => new f(c, u, E)), G.u8 = ((c) => new m(1, c)), G.u16 = ((c) => new m(2, c)), G.u24 = ((c) => new m(3, c)), G.u32 = ((c) => new m(4, c)), G.u40 = ((c) => new m(5, c)), G.u48 = ((c) => new m(6, c)), G.nu64 = ((c) => new x(c)), G.u16be = ((c) => new y(2, c)), G.u24be = ((c) => new y(3, c)), G.u32be = ((c) => new y(4, c)), G.u40be = ((c) => new y(5, c)), G.u48be = ((c) => new y(6, c)), G.nu64be = ((c) => new q(c)), G.s8 = ((c) => new C(1, c)), G.s16 = ((c) => new C(2, c)), G.s24 = ((c) => new C(3, c)), G.s32 = ((c) => new C(4, c)), G.s40 = ((c) => new C(5, c)), G.s48 = ((c) => new C(6, c)), G.ns64 = ((c) => new X(c)), G.s16be = ((c) => new D(2, c)), G.s24be = ((c) => new D(3, c)), G.s32be = ((c) => new D(4, c)), G.s40be = ((c) => new D(5, c)), G.s48be = ((c) => new D(6, c)), G.ns64be = ((c) => new H(c)), G.f32 = ((c) => new $(c)), G.f32be = ((c) => new K(c)), G.f64 = ((c) => new J(c)), G.f64be = ((c) => new te(c)), G.struct = ((c, u, E) => new j(c, u, E)), G.bits = ((c, u, E) => new _(c, u, E)), G.seq = ((c, u, E) => new re(c, u, E)), G.union = ((c, u, E) => new W(c, u, E)), G.unionLayoutDiscriminator = ((c, u) => new P(c, u)), G.blob = ((c, u) => new O(c, u)), G.cstr = ((c) => new S(c)), G.utf8 = ((c, u) => new w(c, u)), G.constant = ((c, u) => new A(c, u)), G;
}
var L = Ih(), wh = 1, vh = 2, bh = 3, Ch = 4, Lh = 5, xh = 6, Uh = 7, Dh = 8, Mh = 9, Bh = 10, Ph = -32700, $h = -32603, kh = -32602, Fh = -32601, zh = -32600, Vh = -32016, Hh = -32015, Gh = -32014, Kh = -32013, qh = -32012, Wh = -32011, jh = -32010, Yh = -32009, Xh = -32008, Zh = -32007, Jh = -32006, Qh = -32005, e0 = -32004, t0 = -32003, n0 = -32002, r0 = -32001, i0 = 28e5, o0 = 2800001, s0 = 2800002, a0 = 2800003, c0 = 2800004, u0 = 2800005, l0 = 2800006, d0 = 2800007, f0 = 2800008, h0 = 2800009, _0 = 2800010, R0 = 2800011, E0 = 323e4, p0 = 32300001, A0 = 3230002, g0 = 3230003, m0 = 3230004, O0 = 361e4, S0 = 3610001, N0 = 3610002, y0 = 3610003, T0 = 3610004, I0 = 3610005, w0 = 3610006, v0 = 3610007, b0 = 3611e3, C0 = 3704e3, L0 = 3704001, x0 = 3704002, U0 = 3704003, D0 = 3704004, M0 = 4128e3, B0 = 4128001, P0 = 4128002, $0 = 4615e3, k0 = 4615001, F0 = 4615002, z0 = 4615003, V0 = 4615004, H0 = 4615005, G0 = 4615006, K0 = 4615007, q0 = 4615008, W0 = 4615009, j0 = 4615010, Y0 = 4615011, X0 = 4615012, Z0 = 4615013, J0 = 4615014, Q0 = 4615015, e_ = 4615016, t_ = 4615017, n_ = 4615018, r_ = 4615019, i_ = 4615020, o_ = 4615021, s_ = 4615022, a_ = 4615023, c_ = 4615024, u_ = 4615025, l_ = 4615026, d_ = 4615027, f_ = 4615028, h_ = 4615029, __ = 4615030, R_ = 4615031, E_ = 4615032, p_ = 4615033, A_ = 4615034, g_ = 4615035, m_ = 4615036, O_ = 4615037, S_ = 4615038, N_ = 4615039, y_ = 4615040, T_ = 4615041, I_ = 4615042, w_ = 4615043, v_ = 4615044, b_ = 4615045, C_ = 4615046, L_ = 4615047, x_ = 4615048, U_ = 4615049, D_ = 4615050, M_ = 4615051, B_ = 4615052, P_ = 4615053, $_ = 4615054, k_ = 5508e3, F_ = 5508001, z_ = 5508002, V_ = 5508003, H_ = 5508004, G_ = 5508005, K_ = 5508006, q_ = 5508007, W_ = 5508008, j_ = 5508009, Y_ = 5508010, X_ = 5508011, Z_ = 5663e3, J_ = 5663001, Q_ = 5663002, eR = 5663003, tR = 5663004, nR = 5663005, rR = 5663006, iR = 5663007, oR = 5663008, sR = 5663009, aR = 5663010, cR = 5663011, uR = 5663012, lR = 5663013, dR = 5663014, fR = 5663015, hR = 5663016, _R = 5663017, RR = 5663018, ER = 5663019, pR = 5663020, AR = 705e4, gR = 7050001, mR = 7050002, OR = 7050003, SR = 7050004, NR = 7050005, yR = 7050006, TR = 7050007, IR = 7050008, wR = 7050009, vR = 7050010, bR = 7050011, CR = 7050012, LR = 7050013, xR = 7050014, UR = 7050015, DR = 7050016, MR = 7050017, BR = 7050018, PR = 7050019, $R = 7050020, kR = 7050021, FR = 7050022, zR = 7050023, VR = 7050024, HR = 7050025, GR = 7050026, KR = 7050027, qR = 7050028, WR = 7050029, jR = 7050030, YR = 7050031, XR = 7050032, ZR = 7050033, JR = 7050034, QR = 7050035, eE = 7050036, Vc = 8078e3, Hc = 8078001, tE = 8078002, nE = 8078003, Gc = 8078004, Kc = 8078005, qc = 8078006, rE = 8078007, iE = 8078008, oE = 8078009, sE = 8078010, Wc = 8078011, aE = 8078012, cE = 8078013, uE = 8078014, lE = 8078015, dE = 8078016, fE = 8078017, hE = 8078018, _E = 8078019, RE = 8078020, EE = 8078021, pE = 8078022, AE = 81e5, gE = 8100001, mE = 8100002, OE = 8100003, SE = 819e4, NE = 8190001, yE = 8190002, TE = 8190003, IE = 8190004, wE = 99e5, vE = 9900001, bE = 9900002, CE = 9900003, LE = 9900004;
function jc(e) {
  return Array.isArray(e) ? "%5B" + e.map(jc).join(
    "%2C%20"
    /* ", " */
  ) + /* "]" */
  "%5D" : typeof e == "bigint" ? `${e}n` : encodeURIComponent(
    String(
      e != null && Object.getPrototypeOf(e) === null ? (
        // Plain objects with no prototype don't have a `toString` method.
        // Convert them before stringifying them.
        { ...e }
      ) : e
    )
  );
}
function xE([e, t]) {
  return `${e}=${jc(t)}`;
}
function UE(e) {
  const t = Object.entries(e).map(xE).join("&");
  return btoa(t);
}
var DE = {
  [E0]: "Account not found at address: $address",
  [m0]: "Not all accounts were decoded. Encoded accounts found at addresses: $addresses.",
  [g0]: "Expected decoded account at address: $address",
  [A0]: "Failed to decode account data at address: $address",
  [p0]: "Accounts not found at addresses: $addresses",
  [h0]: "Unable to find a viable program address bump seed.",
  [s0]: "$putativeAddress is not a base58-encoded address.",
  [i0]: "Expected base58 encoded address to decode to a byte array of length 32. Actual length: $actualLength.",
  [a0]: "The `CryptoKey` must be an `Ed25519` public key.",
  [R0]: "$putativeOffCurveAddress is not a base58-encoded off-curve address.",
  [f0]: "Invalid seeds; point must fall off the Ed25519 curve.",
  [c0]: "Expected given program derived address to have the following format: [Address, ProgramDerivedAddressBump].",
  [l0]: "A maximum of $maxSeeds seeds, including the bump seed, may be supplied when creating an address. Received: $actual.",
  [d0]: "The seed at index $index with length $actual exceeds the maximum length of $maxSeedLength bytes.",
  [u0]: "Expected program derived address bump to be in the range [0, 255], got: $bump.",
  [_0]: "Program address cannot end with PDA marker.",
  [o0]: "Expected base58-encoded address string of length in the range [32, 44]. Actual length: $actualLength.",
  [Ch]: "Expected base58-encoded blockash string of length in the range [32, 44]. Actual length: $actualLength.",
  [wh]: "The network has progressed past the last block for which this transaction could have been committed.",
  [Vc]: "Codec [$codecDescription] cannot decode empty byte arrays.",
  [pE]: "Enum codec cannot use lexical values [$stringValues] as discriminators. Either remove all lexical values or set `useValuesAsDiscriminators` to `false`.",
  [RE]: "Sentinel [$hexSentinel] must not be present in encoded bytes [$hexEncodedBytes].",
  [Kc]: "Encoder and decoder must have the same fixed size, got [$encoderFixedSize] and [$decoderFixedSize].",
  [qc]: "Encoder and decoder must have the same max size, got [$encoderMaxSize] and [$decoderMaxSize].",
  [Gc]: "Encoder and decoder must either both be fixed-size or variable-size.",
  [iE]: "Enum discriminator out of range. Expected a number in [$formattedValidDiscriminators], got $discriminator.",
  [tE]: "Expected a fixed-size codec, got a variable-size one.",
  [cE]: "Codec [$codecDescription] expected a positive byte length, got $bytesLength.",
  [nE]: "Expected a variable-size codec, got a fixed-size one.",
  [_E]: "Codec [$codecDescription] expected zero-value [$hexZeroValue] to have the same size as the provided fixed-size item [$expectedSize bytes].",
  [Hc]: "Codec [$codecDescription] expected $expected bytes, got $bytesLength.",
  [hE]: "Expected byte array constant [$hexConstant] to be present in data [$hexData] at offset [$offset].",
  [oE]: "Invalid discriminated union variant. Expected one of [$variants], got $value.",
  [sE]: "Invalid enum variant. Expected one of [$stringValues] or a number in [$formattedNumericalValues], got $variant.",
  [lE]: "Invalid literal union variant. Expected one of [$variants], got $value.",
  [rE]: "Expected [$codecDescription] to have $expected items, got $actual.",
  [aE]: "Invalid value $value for base $base with alphabet $alphabet.",
  [dE]: "Literal union discriminator out of range. Expected a number between $minRange and $maxRange, got $discriminator.",
  [Wc]: "Codec [$codecDescription] expected number to be in the range [$min, $max], got $value.",
  [uE]: "Codec [$codecDescription] expected offset to be in the range [0, $bytesLength], got $offset.",
  [EE]: "Expected sentinel [$hexSentinel] to be present in decoded bytes [$hexDecodedBytes].",
  [fE]: "Union variant out of range. Expected an index between $minRange and $maxRange, got $variant.",
  [b0]: "No random values implementation could be found.",
  [W0]: "instruction requires an uninitialized account",
  [a_]: "instruction tries to borrow reference for an account which is already borrowed",
  [c_]: "instruction left account with an outstanding borrowed reference",
  [o_]: "program other than the account's owner changed the size of the account data",
  [H0]: "account data too small for instruction",
  [s_]: "instruction expected an executable account",
  [C_]: "An account does not have enough lamports to be rent-exempt",
  [x_]: "Program arithmetic overflowed",
  [b_]: "Failed to serialize or deserialize account data: $encodedData",
  [$_]: "Builtin programs must consume compute units",
  [E_]: "Cross-program invocation call depth too deep",
  [S_]: "Computational budget exceeded",
  [l_]: "custom program error: #$code",
  [t_]: "instruction contains duplicate accounts",
  [u_]: "instruction modifications of multiply-passed account differ",
  [__]: "executable accounts must be rent exempt",
  [f_]: "instruction changed executable accounts data",
  [h_]: "instruction changed the balance of an executable account",
  [n_]: "instruction changed executable bit of an account",
  [J0]: "instruction modified data of an account it does not own",
  [Z0]: "instruction spent from the balance of an account it does not own",
  [k0]: "generic instruction error",
  [D_]: "Provided owner is not allowed",
  [w_]: "Account is immutable",
  [v_]: "Incorrect authority provided",
  [K0]: "incorrect program id for instruction",
  [G0]: "insufficient funds for instruction",
  [V0]: "invalid account data for instruction",
  [L_]: "Invalid account owner",
  [F0]: "invalid program argument",
  [d_]: "program returned invalid error code",
  [z0]: "invalid instruction data",
  [O_]: "Failed to reallocate account data",
  [m_]: "Provided seeds do not result in a valid address",
  [M_]: "Accounts data allocations exceeded the maximum allowed per transaction",
  [B_]: "Max accounts exceeded",
  [P_]: "Max instruction trace length exceeded",
  [g_]: "Length of the seed is too long for address generation",
  [p_]: "An account required by the instruction is missing",
  [q0]: "missing required signature for instruction",
  [X0]: "instruction illegally modified the program id of an account",
  [i_]: "insufficient account keys for instruction",
  [N_]: "Cross-program invocation with unauthorized signer or writable account",
  [y_]: "Failed to create program execution environment",
  [I_]: "Program failed to compile",
  [T_]: "Program failed to complete",
  [e_]: "instruction modified data of a read-only account",
  [Q0]: "instruction changed the balance of a read-only account",
  [A_]: "Cross-program invocation reentrancy not allowed for this instruction",
  [r_]: "instruction modified rent epoch of an account",
  [Y0]: "sum of account balances before and after instruction do not match",
  [j0]: "instruction requires an initialized account",
  [$0]: "",
  [R_]: "Unsupported program id",
  [U_]: "Unsupported sysvar",
  [M0]: "The instruction does not have any accounts.",
  [B0]: "The instruction does not have any data.",
  [P0]: "Expected instruction to have progress address $expectedProgramAddress, got $actualProgramAddress.",
  [Lh]: "Expected base58 encoded blockhash to decode to a byte array of length 32. Actual length: $actualLength.",
  [vh]: "The nonce `$expectedNonceValue` is no longer valid. It has advanced to `$actualNonceValue`",
  [bE]: "Invariant violation: Found no abortable iterable cache entry for key `$cacheKey`. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [LE]: "Invariant violation: This data publisher does not publish to the channel named `$channelName`. Supported channels include $supportedChannelNames.",
  [vE]: "Invariant violation: WebSocket message iterator state is corrupt; iterated without first resolving existing message promise. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [wE]: "Invariant violation: WebSocket message iterator is missing state storage. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [CE]: "Invariant violation: Switch statement non-exhaustive. Received unexpected value `$unexpectedValue`. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [$h]: "JSON-RPC error: Internal JSON-RPC error ($__serverMessage)",
  [kh]: "JSON-RPC error: Invalid method parameter(s) ($__serverMessage)",
  [zh]: "JSON-RPC error: The JSON sent is not a valid `Request` object ($__serverMessage)",
  [Fh]: "JSON-RPC error: The method does not exist / is not available ($__serverMessage)",
  [Ph]: "JSON-RPC error: An error occurred on the server while parsing the JSON text ($__serverMessage)",
  [qh]: "$__serverMessage",
  [r0]: "$__serverMessage",
  [e0]: "$__serverMessage",
  [Gh]: "$__serverMessage",
  [jh]: "$__serverMessage",
  [Yh]: "$__serverMessage",
  [Vh]: "Minimum context slot has not been reached",
  [Qh]: "Node is unhealthy; behind by $numSlotsBehind slots",
  [Xh]: "No snapshot",
  [n0]: "Transaction simulation failed",
  [Zh]: "$__serverMessage",
  [Wh]: "Transaction history is not available from this node",
  [Jh]: "$__serverMessage",
  [Kh]: "Transaction signature length mismatch",
  [t0]: "Transaction signature verification failure",
  [Hh]: "$__serverMessage",
  [C0]: "Key pair bytes must be of length 64, got $byteLength.",
  [L0]: "Expected private key bytes with length 32. Actual length: $actualLength.",
  [x0]: "Expected base58-encoded signature to decode to a byte array of length 64. Actual length: $actualLength.",
  [D0]: "The provided private key does not match the provided public key.",
  [U0]: "Expected base58-encoded signature string of length in the range [64, 88]. Actual length: $actualLength.",
  [xh]: "Lamports value must be in the range [0, 2e64-1]",
  [Uh]: "`$value` cannot be parsed as a `BigInt`",
  [Bh]: "$message",
  [Dh]: "`$value` cannot be parsed as a `Number`",
  [bh]: "No nonce account could be found at address `$nonceAccountAddress`",
  [SE]: "The notification name must end in 'Notifications' and the API must supply a subscription plan creator function for the notification '$notificationName'.",
  [yE]: "WebSocket was closed before payload could be added to the send buffer",
  [TE]: "WebSocket connection closed",
  [IE]: "WebSocket failed to connect",
  [NE]: "Failed to obtain a subscription id from the server",
  [OE]: "Could not find an API plan for RPC method: `$method`",
  [AE]: "The $argumentLabel argument to the `$methodName` RPC method$optionalPathLabel was `$value`. This number is unsafe for use with the Solana JSON-RPC because it exceeds `Number.MAX_SAFE_INTEGER`.",
  [mE]: "HTTP error ($statusCode): $message",
  [gE]: "HTTP header(s) forbidden: $headers. Learn more at https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name.",
  [k_]: "Multiple distinct signers were identified for address `$address`. Please ensure that you are using the same signer instance for each address.",
  [F_]: "The provided value does not implement the `KeyPairSigner` interface",
  [V_]: "The provided value does not implement the `MessageModifyingSigner` interface",
  [H_]: "The provided value does not implement the `MessagePartialSigner` interface",
  [z_]: "The provided value does not implement any of the `MessageSigner` interfaces",
  [K_]: "The provided value does not implement the `TransactionModifyingSigner` interface",
  [q_]: "The provided value does not implement the `TransactionPartialSigner` interface",
  [W_]: "The provided value does not implement the `TransactionSendingSigner` interface",
  [G_]: "The provided value does not implement any of the `TransactionSigner` interfaces",
  [j_]: "More than one `TransactionSendingSigner` was identified.",
  [Y_]: "No `TransactionSendingSigner` was identified. Please provide a valid `TransactionWithSingleSendingSigner` transaction.",
  [X_]: "Wallet account signers do not support signing multiple messages/transactions in a single operation",
  [v0]: "Cannot export a non-extractable key.",
  [S0]: "No digest implementation could be found.",
  [O0]: "Cryptographic operations are only allowed in secure browser contexts. Read more here: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts.",
  [N0]: `This runtime does not support the generation of Ed25519 key pairs.

Install @solana/webcrypto-ed25519-polyfill and call its \`install\` function before generating keys in environments that do not support Ed25519.

For a list of runtimes that currently support Ed25519 operations, visit https://github.com/WICG/webcrypto-secure-curves/issues/20.`,
  [y0]: "No signature verification implementation could be found.",
  [T0]: "No key generation implementation could be found.",
  [I0]: "No signing implementation could be found.",
  [w0]: "No key export implementation could be found.",
  [Mh]: "Timestamp value must be in the range [-(2n ** 63n), (2n ** 63n) - 1]. `$value` given",
  [DR]: "Transaction processing left an account with an outstanding borrowed reference",
  [gR]: "Account in use",
  [mR]: "Account loaded twice",
  [OR]: "Attempt to debit an account but found no record of a prior credit.",
  [zR]: "Transaction loads an address table account that doesn't exist",
  [TR]: "This transaction has already been processed",
  [IR]: "Blockhash not found",
  [wR]: "Loader call chain is too deep",
  [UR]: "Transactions are currently disabled due to cluster maintenance",
  [jR]: "Transaction contains a duplicate instruction ($index) that is not allowed",
  [NR]: "Insufficient funds for fee",
  [YR]: "Transaction results in an account ($accountIndex) with insufficient funds for rent",
  [yR]: "This account may not be used to pay transaction fees",
  [bR]: "Transaction contains an invalid account reference",
  [HR]: "Transaction loads an address table account with invalid data",
  [GR]: "Transaction address table lookup uses an invalid index",
  [VR]: "Transaction loads an address table account with an invalid owner",
  [ZR]: "LoadedAccountsDataSizeLimit set for transaction must be greater than 0.",
  [LR]: "This program may not be used for executing instructions",
  [KR]: "Transaction leaves an account with a lower balance than rent-exempt minimum",
  [PR]: "Transaction loads a writable account that cannot be written",
  [XR]: "Transaction exceeded max loaded accounts data size cap",
  [vR]: "Transaction requires a fee but has no signature present",
  [SR]: "Attempt to load a program that does not exist",
  [QR]: "Execution of the program referenced by account at index $accountIndex is temporarily restricted.",
  [JR]: "ResanitizationNeeded",
  [xR]: "Transaction failed to sanitize accounts offsets correctly",
  [CR]: "Transaction did not pass signature verification",
  [FR]: "Transaction locked too many accounts",
  [eE]: "Sum of account balances before and after transaction do not match",
  [AR]: "The transaction failed with the error `$errorName`",
  [BR]: "Transaction version is unsupported",
  [kR]: "Transaction would exceed account data limit within the block",
  [WR]: "Transaction would exceed total account data limit",
  [$R]: "Transaction would exceed max account limit within the block",
  [MR]: "Transaction would exceed max Block Cost Limit",
  [qR]: "Transaction would exceed max Vote Cost Limit",
  [fR]: "Attempted to sign a transaction with an address that is not a signer for it",
  [aR]: "Transaction is missing an address at index: $index.",
  [hR]: "Transaction has no expected signers therefore it cannot be encoded",
  [pR]: "Transaction size $transactionSize exceeds limit of $transactionSizeLimit bytes",
  [Q_]: "Transaction does not have a blockhash lifetime",
  [eR]: "Transaction is not a durable nonce transaction",
  [nR]: "Contents of these address lookup tables unknown: $lookupTableAddresses",
  [rR]: "Lookup of address at index $highestRequestedIndex failed for lookup table `$lookupTableAddress`. Highest known index is $highestKnownIndex. The lookup table may have been extended since its contents were retrieved",
  [oR]: "No fee payer set in CompiledTransaction",
  [iR]: "Could not find program address at index $index",
  [RR]: "Failed to estimate the compute unit consumption for this transaction message. This is likely because simulating the transaction failed. Inspect the `cause` property of this error to learn more",
  [ER]: "Transaction failed when it was simulated in order to estimate the compute unit consumption. The compute unit estimate provided is for a transaction that failed when simulated and may not be representative of the compute units this transaction would consume if successful. Inspect the `cause` property of this error to learn more",
  [cR]: "Transaction is missing a fee payer.",
  [uR]: "Could not determine this transaction's signature. Make sure that the transaction has been signed by its fee payer.",
  [dR]: "Transaction first instruction is not advance nonce account instruction.",
  [lR]: "Transaction with no instructions cannot be durable nonce transaction.",
  [Z_]: "This transaction includes an address (`$programAddress`) which is both invoked and set as the fee payer. Program addresses may not pay fees",
  [J_]: "This transaction includes an address (`$programAddress`) which is both invoked and marked writable. Program addresses may not be writable",
  [_R]: "The transaction message expected the transaction to have $signerAddressesLength signatures, got $signaturesLength.",
  [sR]: "Transaction is missing signatures for addresses: $addresses.",
  [tR]: "Transaction version must be in the range [0, 127]. `$actualVersion` given"
}, Kt = "i", Pt = "t";
function ME(e, t = {}) {
  const n = DE[e];
  if (n.length === 0)
    return "";
  let r;
  function o(s) {
    if (r[Pt] === 2) {
      const l = n.slice(r[Kt] + 1, s);
      i.push(
        l in t ? (
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${t[l]}`
        ) : `$${l}`
      );
    } else r[Pt] === 1 && i.push(n.slice(r[Kt], s));
  }
  const i = [];
  return n.split("").forEach((s, l) => {
    if (l === 0) {
      r = {
        [Kt]: 0,
        [Pt]: n[0] === "\\" ? 0 : n[0] === "$" ? 2 : 1
        /* Text */
      };
      return;
    }
    let f;
    switch (r[Pt]) {
      case 0:
        f = {
          [Kt]: l,
          [Pt]: 1
          /* Text */
        };
        break;
      case 1:
        s === "\\" ? f = {
          [Kt]: l,
          [Pt]: 0
          /* EscapeSequence */
        } : s === "$" && (f = {
          [Kt]: l,
          [Pt]: 2
          /* Variable */
        });
        break;
      case 2:
        s === "\\" ? f = {
          [Kt]: l,
          [Pt]: 0
          /* EscapeSequence */
        } : s === "$" ? f = {
          [Kt]: l,
          [Pt]: 2
          /* Variable */
        } : s.match(/\w/) || (f = {
          [Kt]: l,
          [Pt]: 1
          /* Text */
        });
        break;
    }
    f && (r !== f && o(l), r = f);
  }), o(), i.join("");
}
function BE(e, t = {}) {
  if (process.env.NODE_ENV !== "production")
    return ME(e, t);
  {
    let n = `Solana error #${e}; Decode this error by running \`npx @solana/errors decode -- ${e}`;
    return Object.keys(t).length && (n += ` '${UE(t)}'`), `${n}\``;
  }
}
var Cn = class extends Error {
  /**
   * Indicates the root cause of this {@link SolanaError}, if any.
   *
   * For example, a transaction error might have an instruction error as its root cause. In this
   * case, you will be able to access the instruction error on the transaction error as `cause`.
   */
  cause = this.cause;
  /**
   * Contains context that can assist in understanding or recovering from a {@link SolanaError}.
   */
  context;
  constructor(...[t, n]) {
    let r, o;
    if (n) {
      const { cause: s, ...l } = n;
      s && (o = { cause: s }), Object.keys(l).length > 0 && (r = l);
    }
    const i = BE(t, r);
    super(i, o), this.context = {
      __code: t,
      ...r
    }, this.name = "SolanaError";
  }
};
function PE(e, t) {
  return "fixedSize" in t ? t.fixedSize : t.getSizeFromValue(e);
}
function $E(e) {
  return Object.freeze({
    ...e,
    encode: (t) => {
      const n = new Uint8Array(PE(t, e));
      return e.write(t, n, 0), n;
    }
  });
}
function kE(e) {
  return Object.freeze({
    ...e,
    decode: (t, n = 0) => e.read(t, n)[0]
  });
}
function Tn(e) {
  return "fixedSize" in e && typeof e.fixedSize == "number";
}
function FE(e, t) {
  if (Tn(e) !== Tn(t))
    throw new Cn(Gc);
  if (Tn(e) && Tn(t) && e.fixedSize !== t.fixedSize)
    throw new Cn(Kc, {
      decoderFixedSize: t.fixedSize,
      encoderFixedSize: e.fixedSize
    });
  if (!Tn(e) && !Tn(t) && e.maxSize !== t.maxSize)
    throw new Cn(qc, {
      decoderMaxSize: t.maxSize,
      encoderMaxSize: e.maxSize
    });
  return {
    ...t,
    ...e,
    decode: t.decode,
    encode: e.encode,
    read: t.read,
    write: e.write
  };
}
function zE(e, t, n = 0) {
  if (t.length - n <= 0)
    throw new Cn(Vc, {
      codecDescription: e
    });
}
function VE(e, t, n, r = 0) {
  const o = n.length - r;
  if (o < t)
    throw new Cn(Hc, {
      bytesLength: o,
      codecDescription: e,
      expected: t
    });
}
function HE(e, t, n, r) {
  if (r < t || r > n)
    throw new Cn(Wc, {
      codecDescription: e,
      max: n,
      min: t,
      value: r
    });
}
function Yc(e) {
  return e?.endian !== 1;
}
function GE(e) {
  return $E({
    fixedSize: e.size,
    write(t, n, r) {
      e.range && HE(e.name, e.range[0], e.range[1], t);
      const o = new ArrayBuffer(e.size);
      return e.set(new DataView(o), t, Yc(e.config)), n.set(new Uint8Array(o), r), r + e.size;
    }
  });
}
function KE(e) {
  return kE({
    fixedSize: e.size,
    read(t, n = 0) {
      zE(e.name, t, n), VE(e.name, e.size, t, n);
      const r = new DataView(qE(t, n, e.size));
      return [e.get(r, Yc(e.config)), n + e.size];
    }
  });
}
function qE(e, t, n) {
  const r = e.byteOffset + (t ?? 0), o = n ?? e.byteLength;
  return e.buffer.slice(r, r + o);
}
var WE = (e = {}) => GE({
  config: e,
  name: "u64",
  range: [0n, BigInt("0xffffffffffffffff")],
  set: (t, n, r) => t.setBigUint64(0, BigInt(n), r),
  size: 8
}), jE = (e = {}) => KE({
  config: e,
  get: (t, n) => t.getBigUint64(0, n),
  name: "u64",
  size: 8
}), YE = (e = {}) => FE(WE(e), jE(e));
class XE extends TypeError {
  constructor(t, n) {
    let r;
    const { message: o, explanation: i, ...s } = t, { path: l } = t, f = l.length === 0 ? o : `At path: ${l.join(".")} -- ${o}`;
    super(i ?? f), i != null && (this.cause = f), Object.assign(this, s), this.name = this.constructor.name, this.failures = () => r ?? (r = [t, ...n()]);
  }
}
function ZE(e) {
  return or(e) && typeof e[Symbol.iterator] == "function";
}
function or(e) {
  return typeof e == "object" && e != null;
}
function Mr(e) {
  return or(e) && !Array.isArray(e);
}
function xt(e) {
  return typeof e == "symbol" ? e.toString() : typeof e == "string" ? JSON.stringify(e) : `${e}`;
}
function JE(e) {
  const { done: t, value: n } = e.next();
  return t ? void 0 : n;
}
function QE(e, t, n, r) {
  if (e === !0)
    return;
  e === !1 ? e = {} : typeof e == "string" && (e = { message: e });
  const { path: o, branch: i } = t, { type: s } = n, { refinement: l, message: f = `Expected a value of type \`${s}\`${l ? ` with refinement \`${l}\`` : ""}, but received: \`${xt(r)}\`` } = e;
  return {
    value: r,
    type: s,
    refinement: l,
    key: o[o.length - 1],
    path: o,
    branch: i,
    ...e,
    message: f
  };
}
function* ua(e, t, n, r) {
  ZE(e) || (e = [e]);
  for (const o of e) {
    const i = QE(o, t, n, r);
    i && (yield i);
  }
}
function* zo(e, t, n = {}) {
  const { path: r = [], branch: o = [e], coerce: i = !1, mask: s = !1 } = n, l = { path: r, branch: o, mask: s };
  i && (e = t.coercer(e, l));
  let f = "valid";
  for (const m of t.validator(e, l))
    m.explanation = n.message, f = "not_valid", yield [m, void 0];
  for (let [m, y, C] of t.entries(e, l)) {
    const D = zo(y, C, {
      path: m === void 0 ? r : [...r, m],
      branch: m === void 0 ? o : [...o, y],
      coerce: i,
      mask: s,
      message: n.message
    });
    for (const v of D)
      v[0] ? (f = v[0].refinement != null ? "not_refined" : "not_valid", yield [v[0], void 0]) : i && (y = v[1], m === void 0 ? e = y : e instanceof Map ? e.set(m, y) : e instanceof Set ? e.add(y) : or(e) && (y !== void 0 || m in e) && (e[m] = y));
  }
  if (f !== "not_valid")
    for (const m of t.refiner(e, l))
      m.explanation = n.message, f = "not_refined", yield [m, void 0];
  f === "valid" && (yield [void 0, e]);
}
let Ft = class {
  constructor(t) {
    const { type: n, schema: r, validator: o, refiner: i, coercer: s = (f) => f, entries: l = function* () {
    } } = t;
    this.type = n, this.schema = r, this.entries = l, this.coercer = s, o ? this.validator = (f, m) => {
      const y = o(f, m);
      return ua(y, m, this, f);
    } : this.validator = () => [], i ? this.refiner = (f, m) => {
      const y = i(f, m);
      return ua(y, m, this, f);
    } : this.refiner = () => [];
  }
  /**
   * Assert that a value passes the struct's validation, throwing if it doesn't.
   */
  assert(t, n) {
    return ep(t, this, n);
  }
  /**
   * Create a value with the struct's coercion logic, then validate it.
   */
  create(t, n) {
    return Xn(t, this, n);
  }
  /**
   * Check if a value passes the struct's validation.
   */
  is(t) {
    return Xc(t, this);
  }
  /**
   * Mask a value, coercing and validating it, but returning only the subset of
   * properties defined by the struct's schema. Masking applies recursively to
   * props of `object` structs only.
   */
  mask(t, n) {
    return tp(t, this, n);
  }
  /**
   * Validate a value with the struct's validation logic, returning a tuple
   * representing the result.
   *
   * You may optionally pass `true` for the `coerce` argument to coerce
   * the value before attempting to validate it. If you do, the result will
   * contain the coerced result when successful. Also, `mask` will turn on
   * masking of the unknown `object` props recursively if passed.
   */
  validate(t, n = {}) {
    return sr(t, this, n);
  }
};
function ep(e, t, n) {
  const r = sr(e, t, { message: n });
  if (r[0])
    throw r[0];
}
function Xn(e, t, n) {
  const r = sr(e, t, { coerce: !0, message: n });
  if (r[0])
    throw r[0];
  return r[1];
}
function tp(e, t, n) {
  const r = sr(e, t, { coerce: !0, mask: !0, message: n });
  if (r[0])
    throw r[0];
  return r[1];
}
function Xc(e, t) {
  return !sr(e, t)[0];
}
function sr(e, t, n = {}) {
  const r = zo(e, t, n), o = JE(r);
  return o[0] ? [new XE(o[0], function* () {
    for (const s of r)
      s[0] && (yield s[0]);
  }), void 0] : [void 0, o[1]];
}
function An(e, t) {
  return new Ft({ type: e, schema: null, validator: t });
}
function np() {
  return An("any", () => !0);
}
function oe(e) {
  return new Ft({
    type: "array",
    schema: e,
    *entries(t) {
      if (e && Array.isArray(t))
        for (const [n, r] of t.entries())
          yield [n, r, e];
    },
    coercer(t) {
      return Array.isArray(t) ? t.slice() : t;
    },
    validator(t) {
      return Array.isArray(t) || `Expected an array value, but received: ${xt(t)}`;
    }
  });
}
function kt() {
  return An("boolean", (e) => typeof e == "boolean");
}
function Vo(e) {
  return An("instance", (t) => t instanceof e || `Expected a \`${e.name}\` instance, but received: ${xt(t)}`);
}
function xe(e) {
  const t = xt(e), n = typeof e;
  return new Ft({
    type: "literal",
    schema: n === "string" || n === "number" || n === "boolean" ? e : null,
    validator(r) {
      return r === e || `Expected the literal \`${t}\`, but received: ${xt(r)}`;
    }
  });
}
function rp() {
  return An("never", () => !1);
}
function se(e) {
  return new Ft({
    ...e,
    validator: (t, n) => t === null || e.validator(t, n),
    refiner: (t, n) => t === null || e.refiner(t, n)
  });
}
function V() {
  return An("number", (e) => typeof e == "number" && !isNaN(e) || `Expected a number, but received: ${xt(e)}`);
}
function ae(e) {
  return new Ft({
    ...e,
    validator: (t, n) => t === void 0 || e.validator(t, n),
    refiner: (t, n) => t === void 0 || e.refiner(t, n)
  });
}
function Zc(e, t) {
  return new Ft({
    type: "record",
    schema: null,
    *entries(n) {
      if (or(n))
        for (const r in n) {
          const o = n[r];
          yield [r, r, e], yield [r, o, t];
        }
    },
    validator(n) {
      return Mr(n) || `Expected an object, but received: ${xt(n)}`;
    },
    coercer(n) {
      return Mr(n) ? { ...n } : n;
    }
  });
}
function ne() {
  return An("string", (e) => typeof e == "string" || `Expected a string, but received: ${xt(e)}`);
}
function Ho(e) {
  const t = rp();
  return new Ft({
    type: "tuple",
    schema: null,
    *entries(n) {
      if (Array.isArray(n)) {
        const r = Math.max(e.length, n.length);
        for (let o = 0; o < r; o++)
          yield [o, n[o], e[o] || t];
      }
    },
    validator(n) {
      return Array.isArray(n) || `Expected an array, but received: ${xt(n)}`;
    },
    coercer(n) {
      return Array.isArray(n) ? n.slice() : n;
    }
  });
}
function Q(e) {
  const t = Object.keys(e);
  return new Ft({
    type: "type",
    schema: e,
    *entries(n) {
      if (or(n))
        for (const r of t)
          yield [r, n[r], e[r]];
    },
    validator(n) {
      return Mr(n) || `Expected an object, but received: ${xt(n)}`;
    },
    coercer(n) {
      return Mr(n) ? { ...n } : n;
    }
  });
}
function mt(e) {
  const t = e.map((n) => n.type).join(" | ");
  return new Ft({
    type: "union",
    schema: null,
    coercer(n, r) {
      for (const o of e) {
        const [i, s] = o.validate(n, {
          coerce: !0,
          mask: r.mask
        });
        if (!i)
          return s;
      }
      return n;
    },
    validator(n, r) {
      const o = [];
      for (const i of e) {
        const [...s] = zo(n, i, r), [l] = s;
        if (l[0])
          for (const [f] of s)
            f && o.push(f);
        else
          return [];
      }
      return [
        `Expected the value to satisfy a union of \`${t}\`, but received: ${xt(n)}`,
        ...o
      ];
    }
  });
}
function $n() {
  return An("unknown", () => !0);
}
function ar(e, t, n) {
  return new Ft({
    ...e,
    coercer: (r, o) => Xc(r, t) ? e.coercer(n(r, o), o) : e.coercer(r, o)
  });
}
var Ar, ip = new Uint8Array(16);
function Jc() {
  if (!Ar && (Ar = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto < "u" && typeof msCrypto.getRandomValues == "function" && msCrypto.getRandomValues.bind(msCrypto), !Ar))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Ar(ip);
}
const op = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function jr(e) {
  return typeof e == "string" && op.test(e);
}
var st = [];
for (var Hi = 0; Hi < 256; ++Hi)
  st.push((Hi + 256).toString(16).substr(1));
function Yr(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = (st[e[t + 0]] + st[e[t + 1]] + st[e[t + 2]] + st[e[t + 3]] + "-" + st[e[t + 4]] + st[e[t + 5]] + "-" + st[e[t + 6]] + st[e[t + 7]] + "-" + st[e[t + 8]] + st[e[t + 9]] + "-" + st[e[t + 10]] + st[e[t + 11]] + st[e[t + 12]] + st[e[t + 13]] + st[e[t + 14]] + st[e[t + 15]]).toLowerCase();
  if (!jr(n))
    throw TypeError("Stringified UUID is invalid");
  return n;
}
var la, Gi, Ki = 0, qi = 0;
function sp(e, t, n) {
  var r = t && n || 0, o = t || new Array(16);
  e = e || {};
  var i = e.node || la, s = e.clockseq !== void 0 ? e.clockseq : Gi;
  if (i == null || s == null) {
    var l = e.random || (e.rng || Jc)();
    i == null && (i = la = [l[0] | 1, l[1], l[2], l[3], l[4], l[5]]), s == null && (s = Gi = (l[6] << 8 | l[7]) & 16383);
  }
  var f = e.msecs !== void 0 ? e.msecs : Date.now(), m = e.nsecs !== void 0 ? e.nsecs : qi + 1, y = f - Ki + (m - qi) / 1e4;
  if (y < 0 && e.clockseq === void 0 && (s = s + 1 & 16383), (y < 0 || f > Ki) && e.nsecs === void 0 && (m = 0), m >= 1e4)
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  Ki = f, qi = m, Gi = s, f += 122192928e5;
  var C = ((f & 268435455) * 1e4 + m) % 4294967296;
  o[r++] = C >>> 24 & 255, o[r++] = C >>> 16 & 255, o[r++] = C >>> 8 & 255, o[r++] = C & 255;
  var D = f / 4294967296 * 1e4 & 268435455;
  o[r++] = D >>> 8 & 255, o[r++] = D & 255, o[r++] = D >>> 24 & 15 | 16, o[r++] = D >>> 16 & 255, o[r++] = s >>> 8 | 128, o[r++] = s & 255;
  for (var v = 0; v < 6; ++v)
    o[r + v] = i[v];
  return t || Yr(o);
}
function Qc(e) {
  if (!jr(e))
    throw TypeError("Invalid UUID");
  var t, n = new Uint8Array(16);
  return n[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24, n[1] = t >>> 16 & 255, n[2] = t >>> 8 & 255, n[3] = t & 255, n[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8, n[5] = t & 255, n[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8, n[7] = t & 255, n[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8, n[9] = t & 255, n[10] = (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255, n[11] = t / 4294967296 & 255, n[12] = t >>> 24 & 255, n[13] = t >>> 16 & 255, n[14] = t >>> 8 & 255, n[15] = t & 255, n;
}
function ap(e) {
  e = unescape(encodeURIComponent(e));
  for (var t = [], n = 0; n < e.length; ++n)
    t.push(e.charCodeAt(n));
  return t;
}
var cp = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", up = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function eu(e, t, n) {
  function r(o, i, s, l) {
    if (typeof o == "string" && (o = ap(o)), typeof i == "string" && (i = Qc(i)), i.length !== 16)
      throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    var f = new Uint8Array(16 + o.length);
    if (f.set(i), f.set(o, i.length), f = n(f), f[6] = f[6] & 15 | t, f[8] = f[8] & 63 | 128, s) {
      l = l || 0;
      for (var m = 0; m < 16; ++m)
        s[l + m] = f[m];
      return s;
    }
    return Yr(f);
  }
  try {
    r.name = e;
  } catch {
  }
  return r.DNS = cp, r.URL = up, r;
}
function lp(e) {
  if (typeof e == "string") {
    var t = unescape(encodeURIComponent(e));
    e = new Uint8Array(t.length);
    for (var n = 0; n < t.length; ++n)
      e[n] = t.charCodeAt(n);
  }
  return dp(fp(hp(e), e.length * 8));
}
function dp(e) {
  for (var t = [], n = e.length * 32, r = "0123456789abcdef", o = 0; o < n; o += 8) {
    var i = e[o >> 5] >>> o % 32 & 255, s = parseInt(r.charAt(i >>> 4 & 15) + r.charAt(i & 15), 16);
    t.push(s);
  }
  return t;
}
function tu(e) {
  return (e + 64 >>> 9 << 4) + 14 + 1;
}
function fp(e, t) {
  e[t >> 5] |= 128 << t % 32, e[tu(t) - 1] = t;
  for (var n = 1732584193, r = -271733879, o = -1732584194, i = 271733878, s = 0; s < e.length; s += 16) {
    var l = n, f = r, m = o, y = i;
    n = ht(n, r, o, i, e[s], 7, -680876936), i = ht(i, n, r, o, e[s + 1], 12, -389564586), o = ht(o, i, n, r, e[s + 2], 17, 606105819), r = ht(r, o, i, n, e[s + 3], 22, -1044525330), n = ht(n, r, o, i, e[s + 4], 7, -176418897), i = ht(i, n, r, o, e[s + 5], 12, 1200080426), o = ht(o, i, n, r, e[s + 6], 17, -1473231341), r = ht(r, o, i, n, e[s + 7], 22, -45705983), n = ht(n, r, o, i, e[s + 8], 7, 1770035416), i = ht(i, n, r, o, e[s + 9], 12, -1958414417), o = ht(o, i, n, r, e[s + 10], 17, -42063), r = ht(r, o, i, n, e[s + 11], 22, -1990404162), n = ht(n, r, o, i, e[s + 12], 7, 1804603682), i = ht(i, n, r, o, e[s + 13], 12, -40341101), o = ht(o, i, n, r, e[s + 14], 17, -1502002290), r = ht(r, o, i, n, e[s + 15], 22, 1236535329), n = _t(n, r, o, i, e[s + 1], 5, -165796510), i = _t(i, n, r, o, e[s + 6], 9, -1069501632), o = _t(o, i, n, r, e[s + 11], 14, 643717713), r = _t(r, o, i, n, e[s], 20, -373897302), n = _t(n, r, o, i, e[s + 5], 5, -701558691), i = _t(i, n, r, o, e[s + 10], 9, 38016083), o = _t(o, i, n, r, e[s + 15], 14, -660478335), r = _t(r, o, i, n, e[s + 4], 20, -405537848), n = _t(n, r, o, i, e[s + 9], 5, 568446438), i = _t(i, n, r, o, e[s + 14], 9, -1019803690), o = _t(o, i, n, r, e[s + 3], 14, -187363961), r = _t(r, o, i, n, e[s + 8], 20, 1163531501), n = _t(n, r, o, i, e[s + 13], 5, -1444681467), i = _t(i, n, r, o, e[s + 2], 9, -51403784), o = _t(o, i, n, r, e[s + 7], 14, 1735328473), r = _t(r, o, i, n, e[s + 12], 20, -1926607734), n = Rt(n, r, o, i, e[s + 5], 4, -378558), i = Rt(i, n, r, o, e[s + 8], 11, -2022574463), o = Rt(o, i, n, r, e[s + 11], 16, 1839030562), r = Rt(r, o, i, n, e[s + 14], 23, -35309556), n = Rt(n, r, o, i, e[s + 1], 4, -1530992060), i = Rt(i, n, r, o, e[s + 4], 11, 1272893353), o = Rt(o, i, n, r, e[s + 7], 16, -155497632), r = Rt(r, o, i, n, e[s + 10], 23, -1094730640), n = Rt(n, r, o, i, e[s + 13], 4, 681279174), i = Rt(i, n, r, o, e[s], 11, -358537222), o = Rt(o, i, n, r, e[s + 3], 16, -722521979), r = Rt(r, o, i, n, e[s + 6], 23, 76029189), n = Rt(n, r, o, i, e[s + 9], 4, -640364487), i = Rt(i, n, r, o, e[s + 12], 11, -421815835), o = Rt(o, i, n, r, e[s + 15], 16, 530742520), r = Rt(r, o, i, n, e[s + 2], 23, -995338651), n = Et(n, r, o, i, e[s], 6, -198630844), i = Et(i, n, r, o, e[s + 7], 10, 1126891415), o = Et(o, i, n, r, e[s + 14], 15, -1416354905), r = Et(r, o, i, n, e[s + 5], 21, -57434055), n = Et(n, r, o, i, e[s + 12], 6, 1700485571), i = Et(i, n, r, o, e[s + 3], 10, -1894986606), o = Et(o, i, n, r, e[s + 10], 15, -1051523), r = Et(r, o, i, n, e[s + 1], 21, -2054922799), n = Et(n, r, o, i, e[s + 8], 6, 1873313359), i = Et(i, n, r, o, e[s + 15], 10, -30611744), o = Et(o, i, n, r, e[s + 6], 15, -1560198380), r = Et(r, o, i, n, e[s + 13], 21, 1309151649), n = Et(n, r, o, i, e[s + 4], 6, -145523070), i = Et(i, n, r, o, e[s + 11], 10, -1120210379), o = Et(o, i, n, r, e[s + 2], 15, 718787259), r = Et(r, o, i, n, e[s + 9], 21, -343485551), n = ln(n, l), r = ln(r, f), o = ln(o, m), i = ln(i, y);
  }
  return [n, r, o, i];
}
function hp(e) {
  if (e.length === 0)
    return [];
  for (var t = e.length * 8, n = new Uint32Array(tu(t)), r = 0; r < t; r += 8)
    n[r >> 5] |= (e[r / 8] & 255) << r % 32;
  return n;
}
function ln(e, t) {
  var n = (e & 65535) + (t & 65535), r = (e >> 16) + (t >> 16) + (n >> 16);
  return r << 16 | n & 65535;
}
function _p(e, t) {
  return e << t | e >>> 32 - t;
}
function Xr(e, t, n, r, o, i) {
  return ln(_p(ln(ln(t, e), ln(r, i)), o), n);
}
function ht(e, t, n, r, o, i, s) {
  return Xr(t & n | ~t & r, e, t, o, i, s);
}
function _t(e, t, n, r, o, i, s) {
  return Xr(t & r | n & ~r, e, t, o, i, s);
}
function Rt(e, t, n, r, o, i, s) {
  return Xr(t ^ n ^ r, e, t, o, i, s);
}
function Et(e, t, n, r, o, i, s) {
  return Xr(n ^ (t | ~r), e, t, o, i, s);
}
var Rp = eu("v3", 48, lp);
function Ep(e, t, n) {
  e = e || {};
  var r = e.random || (e.rng || Jc)();
  if (r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, t) {
    n = n || 0;
    for (var o = 0; o < 16; ++o)
      t[n + o] = r[o];
    return t;
  }
  return Yr(r);
}
function pp(e, t, n, r) {
  switch (e) {
    case 0:
      return t & n ^ ~t & r;
    case 1:
      return t ^ n ^ r;
    case 2:
      return t & n ^ t & r ^ n & r;
    case 3:
      return t ^ n ^ r;
  }
}
function Wi(e, t) {
  return e << t | e >>> 32 - t;
}
function Ap(e) {
  var t = [1518500249, 1859775393, 2400959708, 3395469782], n = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  if (typeof e == "string") {
    var r = unescape(encodeURIComponent(e));
    e = [];
    for (var o = 0; o < r.length; ++o)
      e.push(r.charCodeAt(o));
  } else Array.isArray(e) || (e = Array.prototype.slice.call(e));
  e.push(128);
  for (var i = e.length / 4 + 2, s = Math.ceil(i / 16), l = new Array(s), f = 0; f < s; ++f) {
    for (var m = new Uint32Array(16), y = 0; y < 16; ++y)
      m[y] = e[f * 64 + y * 4] << 24 | e[f * 64 + y * 4 + 1] << 16 | e[f * 64 + y * 4 + 2] << 8 | e[f * 64 + y * 4 + 3];
    l[f] = m;
  }
  l[s - 1][14] = (e.length - 1) * 8 / Math.pow(2, 32), l[s - 1][14] = Math.floor(l[s - 1][14]), l[s - 1][15] = (e.length - 1) * 8 & 4294967295;
  for (var C = 0; C < s; ++C) {
    for (var D = new Uint32Array(80), v = 0; v < 16; ++v)
      D[v] = l[C][v];
    for (var M = 16; M < 80; ++M)
      D[M] = Wi(D[M - 3] ^ D[M - 8] ^ D[M - 14] ^ D[M - 16], 1);
    for (var b = n[0], x = n[1], q = n[2], X = n[3], H = n[4], $ = 0; $ < 80; ++$) {
      var K = Math.floor($ / 20), J = Wi(b, 5) + pp(K, x, q, X) + H + t[K] + D[$] >>> 0;
      H = X, X = q, q = Wi(x, 30) >>> 0, x = b, b = J;
    }
    n[0] = n[0] + b >>> 0, n[1] = n[1] + x >>> 0, n[2] = n[2] + q >>> 0, n[3] = n[3] + X >>> 0, n[4] = n[4] + H >>> 0;
  }
  return [n[0] >> 24 & 255, n[0] >> 16 & 255, n[0] >> 8 & 255, n[0] & 255, n[1] >> 24 & 255, n[1] >> 16 & 255, n[1] >> 8 & 255, n[1] & 255, n[2] >> 24 & 255, n[2] >> 16 & 255, n[2] >> 8 & 255, n[2] & 255, n[3] >> 24 & 255, n[3] >> 16 & 255, n[3] >> 8 & 255, n[3] & 255, n[4] >> 24 & 255, n[4] >> 16 & 255, n[4] >> 8 & 255, n[4] & 255];
}
var gp = eu("v5", 80, Ap);
const mp = "00000000-0000-0000-0000-000000000000";
function Op(e) {
  if (!jr(e))
    throw TypeError("Invalid UUID");
  return parseInt(e.substr(14, 1), 16);
}
const Sp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NIL: mp,
  parse: Qc,
  stringify: Yr,
  v1: sp,
  v3: Rp,
  v4: Ep,
  v5: gp,
  validate: jr,
  version: Op
}, Symbol.toStringTag, { value: "Module" })), nu = /* @__PURE__ */ Co(Sp);
var ji, da;
function Np() {
  if (da) return ji;
  da = 1;
  const e = nu.v4;
  return ji = function(n, r, o, i) {
    if (typeof n != "string")
      throw new TypeError(n + " must be a string");
    i = i || {};
    const s = typeof i.version == "number" ? i.version : 2;
    if (s !== 1 && s !== 2)
      throw new TypeError(s + " must be 1 or 2");
    const l = {
      method: n
    };
    if (s === 2 && (l.jsonrpc = "2.0"), r) {
      if (typeof r != "object" && !Array.isArray(r))
        throw new TypeError(r + " must be an object, array or omitted");
      l.params = r;
    }
    if (typeof o > "u") {
      const f = typeof i.generator == "function" ? i.generator : function() {
        return e();
      };
      l.id = f(l, i);
    } else s === 2 && o === null ? i.notificationIdNull && (l.id = null) : l.id = o;
    return l;
  }, ji;
}
var Yi, fa;
function yp() {
  if (fa) return Yi;
  fa = 1;
  const e = nu.v4, t = Np(), n = function(r, o) {
    if (!(this instanceof n))
      return new n(r, o);
    o || (o = {}), this.options = {
      reviver: typeof o.reviver < "u" ? o.reviver : null,
      replacer: typeof o.replacer < "u" ? o.replacer : null,
      generator: typeof o.generator < "u" ? o.generator : function() {
        return e();
      },
      version: typeof o.version < "u" ? o.version : 2,
      notificationIdNull: typeof o.notificationIdNull == "boolean" ? o.notificationIdNull : !1
    }, this.callServer = r;
  };
  return Yi = n, n.prototype.request = function(r, o, i, s) {
    const l = this;
    let f = null;
    const m = Array.isArray(r) && typeof o == "function";
    if (this.options.version === 1 && m)
      throw new TypeError("JSON-RPC 1.0 does not support batching");
    if (m || !m && r && typeof r == "object" && typeof o == "function")
      s = o, f = r;
    else {
      typeof i == "function" && (s = i, i = void 0);
      const D = typeof s == "function";
      try {
        f = t(r, o, i, {
          generator: this.options.generator,
          version: this.options.version,
          notificationIdNull: this.options.notificationIdNull
        });
      } catch (v) {
        if (D) {
          s(v);
          return;
        }
        throw v;
      }
      if (!D)
        return f;
    }
    let C;
    try {
      C = JSON.stringify(f, this.options.replacer);
    } catch (D) {
      s(D);
      return;
    }
    return this.callServer(C, function(D, v) {
      l._parseResponse(D, v, s);
    }), f;
  }, n.prototype._parseResponse = function(r, o, i) {
    if (r) {
      i(r);
      return;
    }
    if (!o) {
      i();
      return;
    }
    let s;
    try {
      s = JSON.parse(o, this.options.reviver);
    } catch (l) {
      i(l);
      return;
    }
    if (i.length === 3)
      if (Array.isArray(s)) {
        const l = function(m) {
          return typeof m.error < "u";
        }, f = function(m) {
          return !l(m);
        };
        i(null, s.filter(l), s.filter(f));
        return;
      } else {
        i(null, s.error, s.result);
        return;
      }
    i(null, s);
  }, Yi;
}
yp();
var Xi = { exports: {} }, ha;
function Tp() {
  return ha || (ha = 1, (function(e) {
    var t = Object.prototype.hasOwnProperty, n = "~";
    function r() {
    }
    Object.create && (r.prototype = /* @__PURE__ */ Object.create(null), new r().__proto__ || (n = !1));
    function o(f, m, y) {
      this.fn = f, this.context = m, this.once = y || !1;
    }
    function i(f, m, y, C, D) {
      if (typeof y != "function")
        throw new TypeError("The listener must be a function");
      var v = new o(y, C || f, D), M = n ? n + m : m;
      return f._events[M] ? f._events[M].fn ? f._events[M] = [f._events[M], v] : f._events[M].push(v) : (f._events[M] = v, f._eventsCount++), f;
    }
    function s(f, m) {
      --f._eventsCount === 0 ? f._events = new r() : delete f._events[m];
    }
    function l() {
      this._events = new r(), this._eventsCount = 0;
    }
    l.prototype.eventNames = function() {
      var m = [], y, C;
      if (this._eventsCount === 0) return m;
      for (C in y = this._events)
        t.call(y, C) && m.push(n ? C.slice(1) : C);
      return Object.getOwnPropertySymbols ? m.concat(Object.getOwnPropertySymbols(y)) : m;
    }, l.prototype.listeners = function(m) {
      var y = n ? n + m : m, C = this._events[y];
      if (!C) return [];
      if (C.fn) return [C.fn];
      for (var D = 0, v = C.length, M = new Array(v); D < v; D++)
        M[D] = C[D].fn;
      return M;
    }, l.prototype.listenerCount = function(m) {
      var y = n ? n + m : m, C = this._events[y];
      return C ? C.fn ? 1 : C.length : 0;
    }, l.prototype.emit = function(m, y, C, D, v, M) {
      var b = n ? n + m : m;
      if (!this._events[b]) return !1;
      var x = this._events[b], q = arguments.length, X, H;
      if (x.fn) {
        switch (x.once && this.removeListener(m, x.fn, void 0, !0), q) {
          case 1:
            return x.fn.call(x.context), !0;
          case 2:
            return x.fn.call(x.context, y), !0;
          case 3:
            return x.fn.call(x.context, y, C), !0;
          case 4:
            return x.fn.call(x.context, y, C, D), !0;
          case 5:
            return x.fn.call(x.context, y, C, D, v), !0;
          case 6:
            return x.fn.call(x.context, y, C, D, v, M), !0;
        }
        for (H = 1, X = new Array(q - 1); H < q; H++)
          X[H - 1] = arguments[H];
        x.fn.apply(x.context, X);
      } else {
        var $ = x.length, K;
        for (H = 0; H < $; H++)
          switch (x[H].once && this.removeListener(m, x[H].fn, void 0, !0), q) {
            case 1:
              x[H].fn.call(x[H].context);
              break;
            case 2:
              x[H].fn.call(x[H].context, y);
              break;
            case 3:
              x[H].fn.call(x[H].context, y, C);
              break;
            case 4:
              x[H].fn.call(x[H].context, y, C, D);
              break;
            default:
              if (!X) for (K = 1, X = new Array(q - 1); K < q; K++)
                X[K - 1] = arguments[K];
              x[H].fn.apply(x[H].context, X);
          }
      }
      return !0;
    }, l.prototype.on = function(m, y, C) {
      return i(this, m, y, C, !1);
    }, l.prototype.once = function(m, y, C) {
      return i(this, m, y, C, !0);
    }, l.prototype.removeListener = function(m, y, C, D) {
      var v = n ? n + m : m;
      if (!this._events[v]) return this;
      if (!y)
        return s(this, v), this;
      var M = this._events[v];
      if (M.fn)
        M.fn === y && (!D || M.once) && (!C || M.context === C) && s(this, v);
      else {
        for (var b = 0, x = [], q = M.length; b < q; b++)
          (M[b].fn !== y || D && !M[b].once || C && M[b].context !== C) && x.push(M[b]);
        x.length ? this._events[v] = x.length === 1 ? x[0] : x : s(this, v);
      }
      return this;
    }, l.prototype.removeAllListeners = function(m) {
      var y;
      return m ? (y = n ? n + m : m, this._events[y] && s(this, y)) : (this._events = new r(), this._eventsCount = 0), this;
    }, l.prototype.off = l.prototype.removeListener, l.prototype.addListener = l.prototype.on, l.prefixed = n, l.EventEmitter = l, e.exports = l;
  })(Xi)), Xi.exports;
}
Tp();
class ru extends Oc {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Af(t);
    const r = xo(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, i = new Uint8Array(o);
    i.set(r.length > o ? t.create().update(r).digest() : r);
    for (let s = 0; s < i.length; s++)
      i[s] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let s = 0; s < i.length; s++)
      i[s] ^= 106;
    this.oHash.update(i), xn(i);
  }
  update(t) {
    return wr(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    wr(this), er(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: i, blockLen: s, outputLen: l } = this;
    return t = t, t.finished = o, t.destroyed = i, t.blockLen = s, t.outputLen = l, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const iu = (e, t, n) => new ru(e, t).update(n).digest();
iu.create = (e, t) => new ru(e, t);
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function _a(e) {
  e.lowS !== void 0 && dn("lowS", e.lowS), e.prehash !== void 0 && dn("prehash", e.prehash);
}
function Ip(e) {
  const t = Po(e);
  rr(t, {
    a: "field",
    b: "field"
  }, {
    allowInfinityPoint: "boolean",
    allowedPrivateKeyLengths: "array",
    clearCofactor: "function",
    fromBytes: "function",
    isTorsionFree: "function",
    toBytes: "function",
    wrapPrivateKey: "boolean"
  });
  const { endo: n, Fp: r, a: o } = t;
  if (n) {
    if (!r.eql(o, r.ZERO))
      throw new Error("invalid endo: CURVE.a must be 0");
    if (typeof n != "object" || typeof n.beta != "bigint" || typeof n.splitScalar != "function")
      throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
  }
  return Object.freeze({ ...t });
}
class wp extends Error {
  constructor(t = "") {
    super(t);
  }
}
const jt = {
  // asn.1 DER encoding utils
  Err: wp,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (e, t) => {
      const { Err: n } = jt;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length & 1)
        throw new n("tlv.encode: unpadded data");
      const r = t.length / 2, o = Er(r);
      if (o.length / 2 & 128)
        throw new n("tlv.encode: long form length too big");
      const i = r > 127 ? Er(o.length / 2 | 128) : "";
      return Er(e) + i + o + t;
    },
    // v - value, l - left bytes (unparsed)
    decode(e, t) {
      const { Err: n } = jt;
      let r = 0;
      if (e < 0 || e > 256)
        throw new n("tlv.encode: wrong tag");
      if (t.length < 2 || t[r++] !== e)
        throw new n("tlv.decode: wrong tlv");
      const o = t[r++], i = !!(o & 128);
      let s = 0;
      if (!i)
        s = o;
      else {
        const f = o & 127;
        if (!f)
          throw new n("tlv.decode(long): indefinite length not supported");
        if (f > 4)
          throw new n("tlv.decode(long): byte length is too big");
        const m = t.subarray(r, r + f);
        if (m.length !== f)
          throw new n("tlv.decode: length bytes not complete");
        if (m[0] === 0)
          throw new n("tlv.decode(long): zero leftmost byte");
        for (const y of m)
          s = s << 8 | y;
        if (r += f, s < 128)
          throw new n("tlv.decode(long): not minimal encoding");
      }
      const l = t.subarray(r, r + s);
      if (l.length !== s)
        throw new n("tlv.decode: wrong value length");
      return { v: l, l: t.subarray(r + s) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(e) {
      const { Err: t } = jt;
      if (e < Zt)
        throw new t("integer: negative integers are not allowed");
      let n = Er(e);
      if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1)
        throw new t("unexpected DER parsing assertion: unpadded hex");
      return n;
    },
    decode(e) {
      const { Err: t } = jt;
      if (e[0] & 128)
        throw new t("invalid signature integer: negative");
      if (e[0] === 0 && !(e[1] & 128))
        throw new t("invalid signature integer: unnecessary leading zero");
      return En(e);
    }
  },
  toSig(e) {
    const { Err: t, _int: n, _tlv: r } = jt, o = ke("signature", e), { v: i, l: s } = r.decode(48, o);
    if (s.length)
      throw new t("invalid signature: left bytes after parsing");
    const { v: l, l: f } = r.decode(2, i), { v: m, l: y } = r.decode(2, f);
    if (y.length)
      throw new t("invalid signature: left bytes after parsing");
    return { r: n.decode(l), s: n.decode(m) };
  },
  hexFromSig(e) {
    const { _tlv: t, _int: n } = jt, r = t.encode(2, n.encode(e.r)), o = t.encode(2, n.encode(e.s)), i = r + o;
    return t.encode(48, i);
  }
};
function Zi(e, t) {
  return Un(nr(e, t));
}
const Zt = BigInt(0), it = BigInt(1);
BigInt(2);
const Ji = BigInt(3), vp = BigInt(4);
function bp(e) {
  const t = Ip(e), { Fp: n } = t, r = ir(t.n, t.nBitLength), o = t.toBytes || ((H, $, K) => {
    const J = $.toAffine();
    return Dn(Uint8Array.from([4]), n.toBytes(J.x), n.toBytes(J.y));
  }), i = t.fromBytes || ((H) => {
    const $ = H.subarray(1), K = n.fromBytes($.subarray(0, n.BYTES)), J = n.fromBytes($.subarray(n.BYTES, 2 * n.BYTES));
    return { x: K, y: J };
  });
  function s(H) {
    const { a: $, b: K } = t, J = n.sqr(H), te = n.mul(J, H);
    return n.add(n.add(te, n.mul(H, $)), K);
  }
  function l(H, $) {
    const K = n.sqr($), J = s(H);
    return n.eql(K, J);
  }
  if (!l(t.Gx, t.Gy))
    throw new Error("bad curve params: generator point");
  const f = n.mul(n.pow(t.a, Ji), vp), m = n.mul(n.sqr(t.b), BigInt(27));
  if (n.is0(n.add(f, m)))
    throw new Error("bad curve params: a or b");
  function y(H) {
    return Mo(H, it, t.n);
  }
  function C(H) {
    const { allowedPrivateKeyLengths: $, nByteLength: K, wrapPrivateKey: J, n: te } = t;
    if ($ && typeof H != "bigint") {
      if (tr(H) && (H = Un(H)), typeof H != "string" || !$.includes(H.length))
        throw new Error("invalid private key");
      H = H.padStart(K * 2, "0");
    }
    let re;
    try {
      re = typeof H == "bigint" ? H : En(ke("private key", H, K));
    } catch {
      throw new Error("invalid private key, expected hex or " + K + " bytes, got " + typeof H);
    }
    return J && (re = Le(re, te)), Lt("private key", re, it, te), re;
  }
  function D(H) {
    if (!(H instanceof b))
      throw new Error("ProjectivePoint expected");
  }
  const v = Cr((H, $) => {
    const { px: K, py: J, pz: te } = H;
    if (n.eql(te, n.ONE))
      return { x: K, y: J };
    const re = H.is0();
    $ == null && ($ = re ? n.ONE : n.inv(te));
    const j = n.mul(K, $), k = n.mul(J, $), P = n.mul(te, $);
    if (re)
      return { x: n.ZERO, y: n.ZERO };
    if (!n.eql(P, n.ONE))
      throw new Error("invZ was invalid");
    return { x: j, y: k };
  }), M = Cr((H) => {
    if (H.is0()) {
      if (t.allowInfinityPoint && !n.is0(H.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: $, y: K } = H.toAffine();
    if (!n.isValid($) || !n.isValid(K))
      throw new Error("bad point: x or y not FE");
    if (!l($, K))
      throw new Error("bad point: equation left != right");
    if (!H.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return !0;
  });
  class b {
    constructor($, K, J) {
      if ($ == null || !n.isValid($))
        throw new Error("x required");
      if (K == null || !n.isValid(K) || n.is0(K))
        throw new Error("y required");
      if (J == null || !n.isValid(J))
        throw new Error("z required");
      this.px = $, this.py = K, this.pz = J, Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine($) {
      const { x: K, y: J } = $ || {};
      if (!$ || !n.isValid(K) || !n.isValid(J))
        throw new Error("invalid affine point");
      if ($ instanceof b)
        throw new Error("projective point not allowed");
      const te = (re) => n.eql(re, n.ZERO);
      return te(K) && te(J) ? b.ZERO : new b(K, J, n.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ($) {
      const K = Bo(n, $.map((J) => J.pz));
      return $.map((J, te) => J.toAffine(K[te])).map(b.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex($) {
      const K = b.fromAffine(i(ke("pointHex", $)));
      return K.assertValidity(), K;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey($) {
      return b.BASE.multiply(C($));
    }
    // Multiscalar Multiplication
    static msm($, K) {
      return kc(b, r, $, K);
    }
    // "Private method", don't use it directly
    _setWindowSize($) {
      X.setWindowSize(this, $);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      M(this);
    }
    hasEvenY() {
      const { y: $ } = this.toAffine();
      if (n.isOdd)
        return !n.isOdd($);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals($) {
      D($);
      const { px: K, py: J, pz: te } = this, { px: re, py: j, pz: k } = $, P = n.eql(n.mul(K, k), n.mul(re, te)), W = n.eql(n.mul(J, k), n.mul(j, te));
      return P && W;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new b(this.px, n.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: $, b: K } = t, J = n.mul(K, Ji), { px: te, py: re, pz: j } = this;
      let k = n.ZERO, P = n.ZERO, W = n.ZERO, g = n.mul(te, te), a = n.mul(re, re), _ = n.mul(j, j), R = n.mul(te, re);
      return R = n.add(R, R), W = n.mul(te, j), W = n.add(W, W), k = n.mul($, W), P = n.mul(J, _), P = n.add(k, P), k = n.sub(a, P), P = n.add(a, P), P = n.mul(k, P), k = n.mul(R, k), W = n.mul(J, W), _ = n.mul($, _), R = n.sub(g, _), R = n.mul($, R), R = n.add(R, W), W = n.add(g, g), g = n.add(W, g), g = n.add(g, _), g = n.mul(g, R), P = n.add(P, g), _ = n.mul(re, j), _ = n.add(_, _), g = n.mul(_, R), k = n.sub(k, g), W = n.mul(_, a), W = n.add(W, W), W = n.add(W, W), new b(k, P, W);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add($) {
      D($);
      const { px: K, py: J, pz: te } = this, { px: re, py: j, pz: k } = $;
      let P = n.ZERO, W = n.ZERO, g = n.ZERO;
      const a = t.a, _ = n.mul(t.b, Ji);
      let R = n.mul(K, re), N = n.mul(J, j), O = n.mul(te, k), S = n.add(K, J), w = n.add(re, j);
      S = n.mul(S, w), w = n.add(R, N), S = n.sub(S, w), w = n.add(K, te);
      let A = n.add(re, k);
      return w = n.mul(w, A), A = n.add(R, O), w = n.sub(w, A), A = n.add(J, te), P = n.add(j, k), A = n.mul(A, P), P = n.add(N, O), A = n.sub(A, P), g = n.mul(a, w), P = n.mul(_, O), g = n.add(P, g), P = n.sub(N, g), g = n.add(N, g), W = n.mul(P, g), N = n.add(R, R), N = n.add(N, R), O = n.mul(a, O), w = n.mul(_, w), N = n.add(N, O), O = n.sub(R, O), O = n.mul(a, O), w = n.add(w, O), R = n.mul(N, w), W = n.add(W, R), R = n.mul(A, w), P = n.mul(S, P), P = n.sub(P, R), R = n.mul(S, N), g = n.mul(A, g), g = n.add(g, R), new b(P, W, g);
    }
    subtract($) {
      return this.add($.negate());
    }
    is0() {
      return this.equals(b.ZERO);
    }
    wNAF($) {
      return X.wNAFCached(this, $, b.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe($) {
      const { endo: K, n: J } = t;
      Lt("scalar", $, Zt, J);
      const te = b.ZERO;
      if ($ === Zt)
        return te;
      if (this.is0() || $ === it)
        return this;
      if (!K || X.hasPrecomputes(this))
        return X.wNAFCachedUnsafe(this, $, b.normalizeZ);
      let { k1neg: re, k1: j, k2neg: k, k2: P } = K.splitScalar($), W = te, g = te, a = this;
      for (; j > Zt || P > Zt; )
        j & it && (W = W.add(a)), P & it && (g = g.add(a)), a = a.double(), j >>= it, P >>= it;
      return re && (W = W.negate()), k && (g = g.negate()), g = new b(n.mul(g.px, K.beta), g.py, g.pz), W.add(g);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply($) {
      const { endo: K, n: J } = t;
      Lt("scalar", $, it, J);
      let te, re;
      if (K) {
        const { k1neg: j, k1: k, k2neg: P, k2: W } = K.splitScalar($);
        let { p: g, f: a } = this.wNAF(k), { p: _, f: R } = this.wNAF(W);
        g = X.constTimeNegate(j, g), _ = X.constTimeNegate(P, _), _ = new b(n.mul(_.px, K.beta), _.py, _.pz), te = g.add(_), re = a.add(R);
      } else {
        const { p: j, f: k } = this.wNAF($);
        te = j, re = k;
      }
      return b.normalizeZ([te, re])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe($, K, J) {
      const te = b.BASE, re = (k, P) => P === Zt || P === it || !k.equals(te) ? k.multiplyUnsafe(P) : k.multiply(P), j = re(this, K).add(re($, J));
      return j.is0() ? void 0 : j;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine($) {
      return v(this, $);
    }
    isTorsionFree() {
      const { h: $, isTorsionFree: K } = t;
      if ($ === it)
        return !0;
      if (K)
        return K(b, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: $, clearCofactor: K } = t;
      return $ === it ? this : K ? K(b, this) : this.multiplyUnsafe(t.h);
    }
    toRawBytes($ = !0) {
      return dn("isCompressed", $), this.assertValidity(), o(b, this, $);
    }
    toHex($ = !0) {
      return dn("isCompressed", $), Un(this.toRawBytes($));
    }
  }
  b.BASE = new b(t.Gx, t.Gy, n.ONE), b.ZERO = new b(n.ZERO, n.ONE, n.ZERO);
  const { endo: x, nBitLength: q } = t, X = $c(b, x ? Math.ceil(q / 2) : q);
  return {
    CURVE: t,
    ProjectivePoint: b,
    normPrivateKeyToScalar: C,
    weierstrassEquation: s,
    isWithinCurveOrder: y
  };
}
function Cp(e) {
  const t = Po(e);
  return rr(t, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  }), Object.freeze({ lowS: !0, ...t });
}
function Lp(e) {
  const t = Cp(e), { Fp: n, n: r, nByteLength: o, nBitLength: i } = t, s = n.BYTES + 1, l = 2 * n.BYTES + 1;
  function f(_) {
    return Le(_, r);
  }
  function m(_) {
    return fo(_, r);
  }
  const { ProjectivePoint: y, normPrivateKeyToScalar: C, weierstrassEquation: D, isWithinCurveOrder: v } = bp({
    ...t,
    toBytes(_, R, N) {
      const O = R.toAffine(), S = n.toBytes(O.x), w = Dn;
      return dn("isCompressed", N), N ? w(Uint8Array.from([R.hasEvenY() ? 2 : 3]), S) : w(Uint8Array.from([4]), S, n.toBytes(O.y));
    },
    fromBytes(_) {
      const R = _.length, N = _[0], O = _.subarray(1);
      if (R === s && (N === 2 || N === 3)) {
        const S = En(O);
        if (!Mo(S, it, n.ORDER))
          throw new Error("Point is not on curve");
        const w = D(S);
        let A;
        try {
          A = n.sqrt(w);
        } catch (E) {
          const T = E instanceof Error ? ": " + E.message : "";
          throw new Error("Point is not on curve" + T);
        }
        const c = (A & it) === it;
        return (N & 1) === 1 !== c && (A = n.neg(A)), { x: S, y: A };
      } else if (R === l && N === 4) {
        const S = n.fromBytes(O.subarray(0, n.BYTES)), w = n.fromBytes(O.subarray(n.BYTES, 2 * n.BYTES));
        return { x: S, y: w };
      } else {
        const S = s, w = l;
        throw new Error("invalid Point, expected length of " + S + ", or uncompressed " + w + ", got " + R);
      }
    }
  });
  function M(_) {
    const R = r >> it;
    return _ > R;
  }
  function b(_) {
    return M(_) ? f(-_) : _;
  }
  const x = (_, R, N) => En(_.slice(R, N));
  class q {
    constructor(R, N, O) {
      Lt("r", R, it, r), Lt("s", N, it, r), this.r = R, this.s = N, O != null && (this.recovery = O), Object.freeze(this);
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(R) {
      const N = o;
      return R = ke("compactSignature", R, N * 2), new q(x(R, 0, N), x(R, N, 2 * N));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(R) {
      const { r: N, s: O } = jt.toSig(ke("DER", R));
      return new q(N, O);
    }
    /**
     * @todo remove
     * @deprecated
     */
    assertValidity() {
    }
    addRecoveryBit(R) {
      return new q(this.r, this.s, R);
    }
    recoverPublicKey(R) {
      const { r: N, s: O, recovery: S } = this, w = te(ke("msgHash", R));
      if (S == null || ![0, 1, 2, 3].includes(S))
        throw new Error("recovery id invalid");
      const A = S === 2 || S === 3 ? N + t.n : N;
      if (A >= n.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const c = (S & 1) === 0 ? "02" : "03", u = y.fromHex(c + Zi(A, n.BYTES)), E = m(A), T = f(-w * E), U = f(O * E), z = y.BASE.multiplyAndAddUnsafe(u, T, U);
      if (!z)
        throw new Error("point at infinify");
      return z.assertValidity(), z;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return M(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new q(this.r, f(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return vr(this.toDERHex());
    }
    toDERHex() {
      return jt.hexFromSig(this);
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return vr(this.toCompactHex());
    }
    toCompactHex() {
      const R = o;
      return Zi(this.r, R) + Zi(this.s, R);
    }
  }
  const X = {
    isValidPrivateKey(_) {
      try {
        return C(_), !0;
      } catch {
        return !1;
      }
    },
    normPrivateKeyToScalar: C,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const _ = Mc(t.n);
      return Zf(t.randomBytes(_), t.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(_ = 8, R = y.BASE) {
      return R._setWindowSize(_), R.multiply(BigInt(3)), R;
    }
  };
  function H(_, R = !0) {
    return y.fromPrivateKey(_).toRawBytes(R);
  }
  function $(_) {
    if (typeof _ == "bigint")
      return !1;
    if (_ instanceof y)
      return !0;
    const N = ke("key", _).length, O = n.BYTES, S = O + 1, w = 2 * O + 1;
    if (!(t.allowedPrivateKeyLengths || o === S))
      return N === S || N === w;
  }
  function K(_, R, N = !0) {
    if ($(_) === !0)
      throw new Error("first arg must be private key");
    if ($(R) === !1)
      throw new Error("second arg must be public key");
    return y.fromHex(R).multiply(C(_)).toRawBytes(N);
  }
  const J = t.bits2int || function(_) {
    if (_.length > 8192)
      throw new Error("input is too large");
    const R = En(_), N = _.length * 8 - i;
    return N > 0 ? R >> BigInt(N) : R;
  }, te = t.bits2int_modN || function(_) {
    return f(J(_));
  }, re = qr(i);
  function j(_) {
    return Lt("num < 2^" + i, _, Zt, re), nr(_, o);
  }
  function k(_, R, N = P) {
    if (["recovered", "canonical"].some((ie) => ie in N))
      throw new Error("sign() legacy options not supported");
    const { hash: O, randomBytes: S } = t;
    let { lowS: w, prehash: A, extraEntropy: c } = N;
    w == null && (w = !0), _ = ke("msgHash", _), _a(N), A && (_ = ke("prehashed msgHash", O(_)));
    const u = te(_), E = C(R), T = [j(E), j(u)];
    if (c != null && c !== !1) {
      const ie = c === !0 ? S(n.BYTES) : c;
      T.push(ke("extraEntropy", ie));
    }
    const U = Dn(...T), z = u;
    function ee(ie) {
      const me = J(ie);
      if (!v(me))
        return;
      const _e = m(me), fe = y.BASE.multiply(me).toAffine(), Te = f(fe.x);
      if (Te === Zt)
        return;
      const Re = f(_e * f(z + Te * E));
      if (Re === Zt)
        return;
      let ge = (fe.x === Te ? 0 : 2) | Number(fe.y & it), Dt = Re;
      return w && M(Re) && (Dt = b(Re), ge ^= 1), new q(Te, Dt, ge);
    }
    return { seed: U, k2sig: ee };
  }
  const P = { lowS: t.lowS, prehash: !1 }, W = { lowS: t.lowS, prehash: !1 };
  function g(_, R, N = P) {
    const { seed: O, k2sig: S } = k(_, R, N), w = t;
    return zf(w.hash.outputLen, w.nByteLength, w.hmac)(O, S);
  }
  y.BASE._setWindowSize(8);
  function a(_, R, N, O = W) {
    const S = _;
    R = ke("msgHash", R), N = ke("publicKey", N);
    const { lowS: w, prehash: A, format: c } = O;
    if (_a(O), "strict" in O)
      throw new Error("options.strict was renamed to lowS");
    if (c !== void 0 && c !== "compact" && c !== "der")
      throw new Error("format must be compact or der");
    const u = typeof S == "string" || tr(S), E = !u && !c && typeof S == "object" && S !== null && typeof S.r == "bigint" && typeof S.s == "bigint";
    if (!u && !E)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    let T, U;
    try {
      if (E && (T = new q(S.r, S.s)), u) {
        try {
          c !== "compact" && (T = q.fromDER(S));
        } catch (ge) {
          if (!(ge instanceof jt.Err))
            throw ge;
        }
        !T && c !== "der" && (T = q.fromCompact(S));
      }
      U = y.fromHex(N);
    } catch {
      return !1;
    }
    if (!T || w && T.hasHighS())
      return !1;
    A && (R = t.hash(R));
    const { r: z, s: ee } = T, ie = te(R), me = m(ee), _e = f(ie * me), fe = f(z * me), Te = y.BASE.multiplyAndAddUnsafe(U, _e, fe)?.toAffine();
    return Te ? f(Te.x) === z : !1;
  }
  return {
    CURVE: t,
    getPublicKey: H,
    getSharedSecret: K,
    sign: g,
    verify: a,
    ProjectivePoint: y,
    Signature: q,
    utils: X
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function xp(e) {
  return {
    hash: e,
    hmac: (t, ...n) => iu(e, t, Of(...n)),
    randomBytes: Nc
  };
}
function Up(e, t) {
  const n = (r) => Lp({ ...e, ...xp(r) });
  return { ...n(t), create: n };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ou = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), Ra = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Dp = BigInt(0), Mp = BigInt(1), _o = BigInt(2), Ea = (e, t) => (e + t / _o) / t;
function Bp(e) {
  const t = ou, n = BigInt(3), r = BigInt(6), o = BigInt(11), i = BigInt(22), s = BigInt(23), l = BigInt(44), f = BigInt(88), m = e * e * e % t, y = m * m * e % t, C = Be(y, n, t) * y % t, D = Be(C, n, t) * y % t, v = Be(D, _o, t) * m % t, M = Be(v, o, t) * v % t, b = Be(M, i, t) * M % t, x = Be(b, l, t) * b % t, q = Be(x, f, t) * x % t, X = Be(q, l, t) * b % t, H = Be(X, n, t) * y % t, $ = Be(H, s, t) * M % t, K = Be($, r, t) * m % t, J = Be(K, _o, t);
  if (!Ro.eql(Ro.sqr(J), e))
    throw new Error("Cannot find square root");
  return J;
}
const Ro = ir(ou, void 0, void 0, { sqrt: Bp }), Pp = Up({
  a: Dp,
  b: BigInt(7),
  Fp: Ro,
  n: Ra,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  lowS: !0,
  // Allow only low-S signatures by default in sign() and verify()
  endo: {
    // Endomorphism, see above
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: (e) => {
      const t = Ra, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Mp * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, s = BigInt("0x100000000000000000000000000000000"), l = Ea(i * e, t), f = Ea(-r * e, t);
      let m = Le(e - l * n - f * o, t), y = Le(-l * r - f * i, t);
      const C = m > s, D = y > s;
      if (C && (m = t - m), D && (y = t - y), m > s || y > s)
        throw new Error("splitScalar: Endomorphism failed, k=" + e);
      return { k1neg: C, k1: m, k2neg: D, k2: y };
    }
  }
}, Ic);
function pa(e) {
  try {
    return ko.ExtendedPoint.fromHex(e), !0;
  } catch {
    return !1;
  }
}
const su = (e, t) => ko.sign(e, t.slice(0, 32)), $p = ko.verify, Go = (e) => pe.Buffer.isBuffer(e) ? e : e instanceof Uint8Array ? pe.Buffer.from(e.buffer, e.byteOffset, e.byteLength) : pe.Buffer.from(e);
class kp {
  constructor(t) {
    Object.assign(this, t);
  }
  encode() {
    return pe.Buffer.from(Vi.serialize(Nr, this));
  }
  static decode(t) {
    return Vi.deserialize(Nr, this, t);
  }
  static decodeUnchecked(t) {
    return Vi.deserializeUnchecked(Nr, this, t);
  }
}
const Nr = /* @__PURE__ */ new Map();
var au;
const Fp = 32, fn = 32;
function zp(e) {
  return e._bn !== void 0;
}
let Aa = 1;
class le extends kp {
  /**
   * Create a new PublicKey object
   * @param value ed25519 public key as buffer or base-58 encoded string
   */
  constructor(t) {
    if (super({}), this._bn = void 0, zp(t))
      this._bn = t._bn;
    else {
      if (typeof t == "string") {
        const n = gt.decode(t);
        if (n.length != fn)
          throw new Error("Invalid public key input");
        this._bn = new na(n);
      } else
        this._bn = new na(t);
      if (this._bn.byteLength() > fn)
        throw new Error("Invalid public key input");
    }
  }
  /**
   * Returns a unique PublicKey for tests and benchmarks using a counter
   */
  static unique() {
    const t = new le(Aa);
    return Aa += 1, new le(t.toBuffer());
  }
  /**
   * Default public key value. The base58-encoded string representation is all ones (as seen below)
   * The underlying BN number is 32 bytes that are all zeros
   */
  /**
   * Checks if two publicKeys are equal
   */
  equals(t) {
    return this._bn.eq(t._bn);
  }
  /**
   * Return the base-58 representation of the public key
   */
  toBase58() {
    return gt.encode(this.toBytes());
  }
  toJSON() {
    return this.toBase58();
  }
  /**
   * Return the byte array representation of the public key in big endian
   */
  toBytes() {
    const t = this.toBuffer();
    return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
  }
  /**
   * Return the Buffer representation of the public key in big endian
   */
  toBuffer() {
    const t = this._bn.toArrayLike(pe.Buffer);
    if (t.length === fn)
      return t;
    const n = pe.Buffer.alloc(32);
    return t.copy(n, 32 - t.length), n;
  }
  get [Symbol.toStringTag]() {
    return `PublicKey(${this.toString()})`;
  }
  /**
   * Return the base-58 representation of the public key
   */
  toString() {
    return this.toBase58();
  }
  /**
   * Derive a public key from another key, a seed, and a program ID.
   * The program ID will also serve as the owner of the public key, giving
   * it permission to write data to the account.
   */
  /* eslint-disable require-await */
  static async createWithSeed(t, n, r) {
    const o = pe.Buffer.concat([t.toBuffer(), pe.Buffer.from(n), r.toBuffer()]), i = sa(o);
    return new le(i);
  }
  /**
   * Derive a program address from seeds and a program ID.
   */
  /* eslint-disable require-await */
  static createProgramAddressSync(t, n) {
    let r = pe.Buffer.alloc(0);
    t.forEach(function(i) {
      if (i.length > Fp)
        throw new TypeError("Max seed length exceeded");
      r = pe.Buffer.concat([r, Go(i)]);
    }), r = pe.Buffer.concat([r, n.toBuffer(), pe.Buffer.from("ProgramDerivedAddress")]);
    const o = sa(r);
    if (pa(o))
      throw new Error("Invalid seeds, address must fall off the curve");
    return new le(o);
  }
  /**
   * Async version of createProgramAddressSync
   * For backwards compatibility
   *
   * @deprecated Use {@link createProgramAddressSync} instead
   */
  /* eslint-disable require-await */
  static async createProgramAddress(t, n) {
    return this.createProgramAddressSync(t, n);
  }
  /**
   * Find a valid program address
   *
   * Valid program addresses must fall off the ed25519 curve.  This function
   * iterates a nonce until it finds one that when combined with the seeds
   * results in a valid program address.
   */
  static findProgramAddressSync(t, n) {
    let r = 255, o;
    for (; r != 0; ) {
      try {
        const i = t.concat(pe.Buffer.from([r]));
        o = this.createProgramAddressSync(i, n);
      } catch (i) {
        if (i instanceof TypeError)
          throw i;
        r--;
        continue;
      }
      return [o, r];
    }
    throw new Error("Unable to find a viable program address nonce");
  }
  /**
   * Async version of findProgramAddressSync
   * For backwards compatibility
   *
   * @deprecated Use {@link findProgramAddressSync} instead
   */
  static async findProgramAddress(t, n) {
    return this.findProgramAddressSync(t, n);
  }
  /**
   * Check that a pubkey is on the ed25519 curve.
   */
  static isOnCurve(t) {
    const n = new le(t);
    return pa(n.toBytes());
  }
}
au = le;
le.default = new au("11111111111111111111111111111111");
Nr.set(le, {
  kind: "struct",
  fields: [["_bn", "u256"]]
});
new le("BPFLoader1111111111111111111111111111111111");
const Ln = 1232, Ko = 127, Zn = 64;
class Br {
  constructor(t, n) {
    this.staticAccountKeys = void 0, this.accountKeysFromLookups = void 0, this.staticAccountKeys = t, this.accountKeysFromLookups = n;
  }
  keySegments() {
    const t = [this.staticAccountKeys];
    return this.accountKeysFromLookups && (t.push(this.accountKeysFromLookups.writable), t.push(this.accountKeysFromLookups.readonly)), t;
  }
  get(t) {
    for (const n of this.keySegments()) {
      if (t < n.length)
        return n[t];
      t -= n.length;
    }
  }
  get length() {
    return this.keySegments().flat().length;
  }
  compileInstructions(t) {
    if (this.length > 256)
      throw new Error("Account index overflow encountered during compilation");
    const r = /* @__PURE__ */ new Map();
    this.keySegments().flat().forEach((i, s) => {
      r.set(i.toBase58(), s);
    });
    const o = (i) => {
      const s = r.get(i.toBase58());
      if (s === void 0) throw new Error("Encountered an unknown instruction account key during compilation");
      return s;
    };
    return t.map((i) => ({
      programIdIndex: o(i.programId),
      accountKeyIndexes: i.keys.map((s) => o(s.pubkey)),
      data: i.data
    }));
  }
}
const Ae = (e = "publicKey") => L.blob(32, e), Vp = (e = "signature") => L.blob(64, e), wn = (e = "string") => {
  const t = L.struct([L.u32("length"), L.u32("lengthPadding"), L.blob(L.offset(L.u32(), -8), "chars")], e), n = t.decode.bind(t), r = t.encode.bind(t), o = t;
  return o.decode = (i, s) => n(i, s).chars.toString(), o.encode = (i, s, l) => {
    const f = {
      chars: pe.Buffer.from(i, "utf8")
    };
    return r(f, s, l);
  }, o.alloc = (i) => L.u32().span + L.u32().span + pe.Buffer.from(i, "utf8").length, o;
}, Hp = (e = "authorized") => L.struct([Ae("staker"), Ae("withdrawer")], e), Gp = (e = "lockup") => L.struct([L.ns64("unixTimestamp"), L.ns64("epoch"), Ae("custodian")], e), Kp = (e = "voteInit") => L.struct([Ae("nodePubkey"), Ae("authorizedVoter"), Ae("authorizedWithdrawer"), L.u8("commission")], e), qp = (e = "voteAuthorizeWithSeedArgs") => L.struct([L.u32("voteAuthorizationType"), Ae("currentAuthorityDerivedKeyOwnerPubkey"), wn("currentAuthorityDerivedKeySeed"), Ae("newAuthorized")], e);
function yt(e) {
  let t = 0, n = 0;
  for (; ; ) {
    let r = e.shift();
    if (t |= (r & 127) << n * 7, n += 1, (r & 128) === 0)
      break;
  }
  return t;
}
function Tt(e, t) {
  let n = t;
  for (; ; ) {
    let r = n & 127;
    if (n >>= 7, n == 0) {
      e.push(r);
      break;
    } else
      r |= 128, e.push(r);
  }
}
function rt(e, t) {
  if (!e)
    throw new Error(t || "Assertion failed");
}
class Zr {
  constructor(t, n) {
    this.payer = void 0, this.keyMetaMap = void 0, this.payer = t, this.keyMetaMap = n;
  }
  static compile(t, n) {
    const r = /* @__PURE__ */ new Map(), o = (s) => {
      const l = s.toBase58();
      let f = r.get(l);
      return f === void 0 && (f = {
        isSigner: !1,
        isWritable: !1,
        isInvoked: !1
      }, r.set(l, f)), f;
    }, i = o(n);
    i.isSigner = !0, i.isWritable = !0;
    for (const s of t) {
      o(s.programId).isInvoked = !0;
      for (const l of s.keys) {
        const f = o(l.pubkey);
        f.isSigner ||= l.isSigner, f.isWritable ||= l.isWritable;
      }
    }
    return new Zr(n, r);
  }
  getMessageComponents() {
    const t = [...this.keyMetaMap.entries()];
    rt(t.length <= 256, "Max static account keys length exceeded");
    const n = t.filter(([, f]) => f.isSigner && f.isWritable), r = t.filter(([, f]) => f.isSigner && !f.isWritable), o = t.filter(([, f]) => !f.isSigner && f.isWritable), i = t.filter(([, f]) => !f.isSigner && !f.isWritable), s = {
      numRequiredSignatures: n.length + r.length,
      numReadonlySignedAccounts: r.length,
      numReadonlyUnsignedAccounts: i.length
    };
    {
      rt(n.length > 0, "Expected at least one writable signer key");
      const [f] = n[0];
      rt(f === this.payer.toBase58(), "Expected first writable signer key to be the fee payer");
    }
    const l = [...n.map(([f]) => new le(f)), ...r.map(([f]) => new le(f)), ...o.map(([f]) => new le(f)), ...i.map(([f]) => new le(f))];
    return [s, l];
  }
  extractTableLookup(t) {
    const [n, r] = this.drainKeysFoundInLookupTable(t.state.addresses, (s) => !s.isSigner && !s.isInvoked && s.isWritable), [o, i] = this.drainKeysFoundInLookupTable(t.state.addresses, (s) => !s.isSigner && !s.isInvoked && !s.isWritable);
    if (!(n.length === 0 && o.length === 0))
      return [{
        accountKey: t.key,
        writableIndexes: n,
        readonlyIndexes: o
      }, {
        writable: r,
        readonly: i
      }];
  }
  /** @internal */
  drainKeysFoundInLookupTable(t, n) {
    const r = new Array(), o = new Array();
    for (const [i, s] of this.keyMetaMap.entries())
      if (n(s)) {
        const l = new le(i), f = t.findIndex((m) => m.equals(l));
        f >= 0 && (rt(f < 256, "Max lookup table index exceeded"), r.push(f), o.push(l), this.keyMetaMap.delete(i));
      }
    return [r, o];
  }
}
const cu = "Reached end of buffer unexpectedly";
function Jt(e) {
  if (e.length === 0)
    throw new Error(cu);
  return e.shift();
}
function It(e, ...t) {
  const [n] = t;
  if (t.length === 2 ? n + (t[1] ?? 0) > e.length : n >= e.length)
    throw new Error(cu);
  return e.splice(...t);
}
class Bn {
  constructor(t) {
    this.header = void 0, this.accountKeys = void 0, this.recentBlockhash = void 0, this.instructions = void 0, this.indexToProgramIds = /* @__PURE__ */ new Map(), this.header = t.header, this.accountKeys = t.accountKeys.map((n) => new le(n)), this.recentBlockhash = t.recentBlockhash, this.instructions = t.instructions, this.instructions.forEach((n) => this.indexToProgramIds.set(n.programIdIndex, this.accountKeys[n.programIdIndex]));
  }
  get version() {
    return "legacy";
  }
  get staticAccountKeys() {
    return this.accountKeys;
  }
  get compiledInstructions() {
    return this.instructions.map((t) => ({
      programIdIndex: t.programIdIndex,
      accountKeyIndexes: t.accounts,
      data: gt.decode(t.data)
    }));
  }
  get addressTableLookups() {
    return [];
  }
  getAccountKeys() {
    return new Br(this.staticAccountKeys);
  }
  static compile(t) {
    const n = Zr.compile(t.instructions, t.payerKey), [r, o] = n.getMessageComponents(), s = new Br(o).compileInstructions(t.instructions).map((l) => ({
      programIdIndex: l.programIdIndex,
      accounts: l.accountKeyIndexes,
      data: gt.encode(l.data)
    }));
    return new Bn({
      header: r,
      accountKeys: o,
      recentBlockhash: t.recentBlockhash,
      instructions: s
    });
  }
  isAccountSigner(t) {
    return t < this.header.numRequiredSignatures;
  }
  isAccountWritable(t) {
    const n = this.header.numRequiredSignatures;
    if (t >= this.header.numRequiredSignatures) {
      const r = t - n, i = this.accountKeys.length - n - this.header.numReadonlyUnsignedAccounts;
      return r < i;
    } else {
      const r = n - this.header.numReadonlySignedAccounts;
      return t < r;
    }
  }
  isProgramId(t) {
    return this.indexToProgramIds.has(t);
  }
  programIds() {
    return [...this.indexToProgramIds.values()];
  }
  nonProgramIds() {
    return this.accountKeys.filter((t, n) => !this.isProgramId(n));
  }
  serialize() {
    const t = this.accountKeys.length;
    let n = [];
    Tt(n, t);
    const r = this.instructions.map((C) => {
      const {
        accounts: D,
        programIdIndex: v
      } = C, M = Array.from(gt.decode(C.data));
      let b = [];
      Tt(b, D.length);
      let x = [];
      return Tt(x, M.length), {
        programIdIndex: v,
        keyIndicesCount: pe.Buffer.from(b),
        keyIndices: D,
        dataLength: pe.Buffer.from(x),
        data: M
      };
    });
    let o = [];
    Tt(o, r.length);
    let i = pe.Buffer.alloc(Ln);
    pe.Buffer.from(o).copy(i);
    let s = o.length;
    r.forEach((C) => {
      const v = L.struct([L.u8("programIdIndex"), L.blob(C.keyIndicesCount.length, "keyIndicesCount"), L.seq(L.u8("keyIndex"), C.keyIndices.length, "keyIndices"), L.blob(C.dataLength.length, "dataLength"), L.seq(L.u8("userdatum"), C.data.length, "data")]).encode(C, i, s);
      s += v;
    }), i = i.slice(0, s);
    const l = L.struct([L.blob(1, "numRequiredSignatures"), L.blob(1, "numReadonlySignedAccounts"), L.blob(1, "numReadonlyUnsignedAccounts"), L.blob(n.length, "keyCount"), L.seq(Ae("key"), t, "keys"), Ae("recentBlockhash")]), f = {
      numRequiredSignatures: pe.Buffer.from([this.header.numRequiredSignatures]),
      numReadonlySignedAccounts: pe.Buffer.from([this.header.numReadonlySignedAccounts]),
      numReadonlyUnsignedAccounts: pe.Buffer.from([this.header.numReadonlyUnsignedAccounts]),
      keyCount: pe.Buffer.from(n),
      keys: this.accountKeys.map((C) => Go(C.toBytes())),
      recentBlockhash: gt.decode(this.recentBlockhash)
    };
    let m = pe.Buffer.alloc(2048);
    const y = l.encode(f, m);
    return i.copy(m, y), m.slice(0, y + i.length);
  }
  /**
   * Decode a compiled message into a Message object.
   */
  static from(t) {
    let n = [...t];
    const r = Jt(n);
    if (r !== (r & Ko))
      throw new Error("Versioned messages must be deserialized with VersionedMessage.deserialize()");
    const o = Jt(n), i = Jt(n), s = yt(n);
    let l = [];
    for (let D = 0; D < s; D++) {
      const v = It(n, 0, fn);
      l.push(new le(pe.Buffer.from(v)));
    }
    const f = It(n, 0, fn), m = yt(n);
    let y = [];
    for (let D = 0; D < m; D++) {
      const v = Jt(n), M = yt(n), b = It(n, 0, M), x = yt(n), q = It(n, 0, x), X = gt.encode(pe.Buffer.from(q));
      y.push({
        programIdIndex: v,
        accounts: b,
        data: X
      });
    }
    const C = {
      header: {
        numRequiredSignatures: r,
        numReadonlySignedAccounts: o,
        numReadonlyUnsignedAccounts: i
      },
      recentBlockhash: gt.encode(pe.Buffer.from(f)),
      accountKeys: l,
      instructions: y
    };
    return new Bn(C);
  }
}
class Pr {
  constructor(t) {
    this.header = void 0, this.staticAccountKeys = void 0, this.recentBlockhash = void 0, this.compiledInstructions = void 0, this.addressTableLookups = void 0, this.header = t.header, this.staticAccountKeys = t.staticAccountKeys, this.recentBlockhash = t.recentBlockhash, this.compiledInstructions = t.compiledInstructions, this.addressTableLookups = t.addressTableLookups;
  }
  get version() {
    return 0;
  }
  get numAccountKeysFromLookups() {
    let t = 0;
    for (const n of this.addressTableLookups)
      t += n.readonlyIndexes.length + n.writableIndexes.length;
    return t;
  }
  getAccountKeys(t) {
    let n;
    if (t && "accountKeysFromLookups" in t && t.accountKeysFromLookups) {
      if (this.numAccountKeysFromLookups != t.accountKeysFromLookups.writable.length + t.accountKeysFromLookups.readonly.length)
        throw new Error("Failed to get account keys because of a mismatch in the number of account keys from lookups");
      n = t.accountKeysFromLookups;
    } else if (t && "addressLookupTableAccounts" in t && t.addressLookupTableAccounts)
      n = this.resolveAddressTableLookups(t.addressLookupTableAccounts);
    else if (this.addressTableLookups.length > 0)
      throw new Error("Failed to get account keys because address table lookups were not resolved");
    return new Br(this.staticAccountKeys, n);
  }
  isAccountSigner(t) {
    return t < this.header.numRequiredSignatures;
  }
  isAccountWritable(t) {
    const n = this.header.numRequiredSignatures, r = this.staticAccountKeys.length;
    if (t >= r) {
      const o = t - r, i = this.addressTableLookups.reduce((s, l) => s + l.writableIndexes.length, 0);
      return o < i;
    } else if (t >= this.header.numRequiredSignatures) {
      const o = t - n, s = r - n - this.header.numReadonlyUnsignedAccounts;
      return o < s;
    } else {
      const o = n - this.header.numReadonlySignedAccounts;
      return t < o;
    }
  }
  resolveAddressTableLookups(t) {
    const n = {
      writable: [],
      readonly: []
    };
    for (const r of this.addressTableLookups) {
      const o = t.find((i) => i.key.equals(r.accountKey));
      if (!o)
        throw new Error(`Failed to find address lookup table account for table key ${r.accountKey.toBase58()}`);
      for (const i of r.writableIndexes)
        if (i < o.state.addresses.length)
          n.writable.push(o.state.addresses[i]);
        else
          throw new Error(`Failed to find address for index ${i} in address lookup table ${r.accountKey.toBase58()}`);
      for (const i of r.readonlyIndexes)
        if (i < o.state.addresses.length)
          n.readonly.push(o.state.addresses[i]);
        else
          throw new Error(`Failed to find address for index ${i} in address lookup table ${r.accountKey.toBase58()}`);
    }
    return n;
  }
  static compile(t) {
    const n = Zr.compile(t.instructions, t.payerKey), r = new Array(), o = {
      writable: new Array(),
      readonly: new Array()
    }, i = t.addressLookupTableAccounts || [];
    for (const y of i) {
      const C = n.extractTableLookup(y);
      if (C !== void 0) {
        const [D, {
          writable: v,
          readonly: M
        }] = C;
        r.push(D), o.writable.push(...v), o.readonly.push(...M);
      }
    }
    const [s, l] = n.getMessageComponents(), m = new Br(l, o).compileInstructions(t.instructions);
    return new Pr({
      header: s,
      staticAccountKeys: l,
      recentBlockhash: t.recentBlockhash,
      compiledInstructions: m,
      addressTableLookups: r
    });
  }
  serialize() {
    const t = Array();
    Tt(t, this.staticAccountKeys.length);
    const n = this.serializeInstructions(), r = Array();
    Tt(r, this.compiledInstructions.length);
    const o = this.serializeAddressTableLookups(), i = Array();
    Tt(i, this.addressTableLookups.length);
    const s = L.struct([L.u8("prefix"), L.struct([L.u8("numRequiredSignatures"), L.u8("numReadonlySignedAccounts"), L.u8("numReadonlyUnsignedAccounts")], "header"), L.blob(t.length, "staticAccountKeysLength"), L.seq(Ae(), this.staticAccountKeys.length, "staticAccountKeys"), Ae("recentBlockhash"), L.blob(r.length, "instructionsLength"), L.blob(n.length, "serializedInstructions"), L.blob(i.length, "addressTableLookupsLength"), L.blob(o.length, "serializedAddressTableLookups")]), l = new Uint8Array(Ln), m = s.encode({
      prefix: 128,
      header: this.header,
      staticAccountKeysLength: new Uint8Array(t),
      staticAccountKeys: this.staticAccountKeys.map((y) => y.toBytes()),
      recentBlockhash: gt.decode(this.recentBlockhash),
      instructionsLength: new Uint8Array(r),
      serializedInstructions: n,
      addressTableLookupsLength: new Uint8Array(i),
      serializedAddressTableLookups: o
    }, l);
    return l.slice(0, m);
  }
  serializeInstructions() {
    let t = 0;
    const n = new Uint8Array(Ln);
    for (const r of this.compiledInstructions) {
      const o = Array();
      Tt(o, r.accountKeyIndexes.length);
      const i = Array();
      Tt(i, r.data.length);
      const s = L.struct([L.u8("programIdIndex"), L.blob(o.length, "encodedAccountKeyIndexesLength"), L.seq(L.u8(), r.accountKeyIndexes.length, "accountKeyIndexes"), L.blob(i.length, "encodedDataLength"), L.blob(r.data.length, "data")]);
      t += s.encode({
        programIdIndex: r.programIdIndex,
        encodedAccountKeyIndexesLength: new Uint8Array(o),
        accountKeyIndexes: r.accountKeyIndexes,
        encodedDataLength: new Uint8Array(i),
        data: r.data
      }, n, t);
    }
    return n.slice(0, t);
  }
  serializeAddressTableLookups() {
    let t = 0;
    const n = new Uint8Array(Ln);
    for (const r of this.addressTableLookups) {
      const o = Array();
      Tt(o, r.writableIndexes.length);
      const i = Array();
      Tt(i, r.readonlyIndexes.length);
      const s = L.struct([Ae("accountKey"), L.blob(o.length, "encodedWritableIndexesLength"), L.seq(L.u8(), r.writableIndexes.length, "writableIndexes"), L.blob(i.length, "encodedReadonlyIndexesLength"), L.seq(L.u8(), r.readonlyIndexes.length, "readonlyIndexes")]);
      t += s.encode({
        accountKey: r.accountKey.toBytes(),
        encodedWritableIndexesLength: new Uint8Array(o),
        writableIndexes: r.writableIndexes,
        encodedReadonlyIndexesLength: new Uint8Array(i),
        readonlyIndexes: r.readonlyIndexes
      }, n, t);
    }
    return n.slice(0, t);
  }
  static deserialize(t) {
    let n = [...t];
    const r = Jt(n), o = r & Ko;
    rt(r !== o, "Expected versioned message but received legacy message");
    const i = o;
    rt(i === 0, `Expected versioned message with version 0 but found version ${i}`);
    const s = {
      numRequiredSignatures: Jt(n),
      numReadonlySignedAccounts: Jt(n),
      numReadonlyUnsignedAccounts: Jt(n)
    }, l = [], f = yt(n);
    for (let M = 0; M < f; M++)
      l.push(new le(It(n, 0, fn)));
    const m = gt.encode(It(n, 0, fn)), y = yt(n), C = [];
    for (let M = 0; M < y; M++) {
      const b = Jt(n), x = yt(n), q = It(n, 0, x), X = yt(n), H = new Uint8Array(It(n, 0, X));
      C.push({
        programIdIndex: b,
        accountKeyIndexes: q,
        data: H
      });
    }
    const D = yt(n), v = [];
    for (let M = 0; M < D; M++) {
      const b = new le(It(n, 0, fn)), x = yt(n), q = It(n, 0, x), X = yt(n), H = It(n, 0, X);
      v.push({
        accountKey: b,
        writableIndexes: q,
        readonlyIndexes: H
      });
    }
    return new Pr({
      header: s,
      staticAccountKeys: l,
      recentBlockhash: m,
      compiledInstructions: C,
      addressTableLookups: v
    });
  }
}
const qo = {
  deserializeMessageVersion(e) {
    const t = e[0], n = t & Ko;
    return n === t ? "legacy" : n;
  },
  deserialize: (e) => {
    const t = qo.deserializeMessageVersion(e);
    if (t === "legacy")
      return Bn.from(e);
    if (t === 0)
      return Pr.deserialize(e);
    throw new Error(`Transaction message version ${t} deserialization is not supported`);
  }
}, Wp = pe.Buffer.alloc(Zn).fill(0);
class ga {
  constructor(t) {
    this.keys = void 0, this.programId = void 0, this.data = pe.Buffer.alloc(0), this.programId = t.programId, this.keys = t.keys, t.data && (this.data = t.data);
  }
  /**
   * @internal
   */
  toJSON() {
    return {
      keys: this.keys.map(({
        pubkey: t,
        isSigner: n,
        isWritable: r
      }) => ({
        pubkey: t.toJSON(),
        isSigner: n,
        isWritable: r
      })),
      programId: this.programId.toJSON(),
      data: [...this.data]
    };
  }
}
class Jn {
  /**
   * The first (payer) Transaction signature
   *
   * @returns {Buffer | null} Buffer of payer's signature
   */
  get signature() {
    return this.signatures.length > 0 ? this.signatures[0].signature : null;
  }
  /**
   * The transaction fee payer
   */
  // Construct a transaction with a blockhash and lastValidBlockHeight
  // Construct a transaction using a durable nonce
  /**
   * @deprecated `TransactionCtorFields` has been deprecated and will be removed in a future version.
   * Please supply a `TransactionBlockhashCtor` instead.
   */
  /**
   * Construct an empty Transaction
   */
  constructor(t) {
    if (this.signatures = [], this.feePayer = void 0, this.instructions = [], this.recentBlockhash = void 0, this.lastValidBlockHeight = void 0, this.nonceInfo = void 0, this.minNonceContextSlot = void 0, this._message = void 0, this._json = void 0, !!t)
      if (t.feePayer && (this.feePayer = t.feePayer), t.signatures && (this.signatures = t.signatures), Object.prototype.hasOwnProperty.call(t, "nonceInfo")) {
        const {
          minContextSlot: n,
          nonceInfo: r
        } = t;
        this.minNonceContextSlot = n, this.nonceInfo = r;
      } else if (Object.prototype.hasOwnProperty.call(t, "lastValidBlockHeight")) {
        const {
          blockhash: n,
          lastValidBlockHeight: r
        } = t;
        this.recentBlockhash = n, this.lastValidBlockHeight = r;
      } else {
        const {
          recentBlockhash: n,
          nonceInfo: r
        } = t;
        r && (this.nonceInfo = r), this.recentBlockhash = n;
      }
  }
  /**
   * @internal
   */
  toJSON() {
    return {
      recentBlockhash: this.recentBlockhash || null,
      feePayer: this.feePayer ? this.feePayer.toJSON() : null,
      nonceInfo: this.nonceInfo ? {
        nonce: this.nonceInfo.nonce,
        nonceInstruction: this.nonceInfo.nonceInstruction.toJSON()
      } : null,
      instructions: this.instructions.map((t) => t.toJSON()),
      signers: this.signatures.map(({
        publicKey: t
      }) => t.toJSON())
    };
  }
  /**
   * Add one or more instructions to this Transaction
   *
   * @param {Array< Transaction | TransactionInstruction | TransactionInstructionCtorFields >} items - Instructions to add to the Transaction
   */
  add(...t) {
    if (t.length === 0)
      throw new Error("No instructions");
    return t.forEach((n) => {
      "instructions" in n ? this.instructions = this.instructions.concat(n.instructions) : "data" in n && "programId" in n && "keys" in n ? this.instructions.push(n) : this.instructions.push(new ga(n));
    }), this;
  }
  /**
   * Compile transaction data
   */
  compileMessage() {
    if (this._message && JSON.stringify(this.toJSON()) === JSON.stringify(this._json))
      return this._message;
    let t, n;
    if (this.nonceInfo ? (t = this.nonceInfo.nonce, this.instructions[0] != this.nonceInfo.nonceInstruction ? n = [this.nonceInfo.nonceInstruction, ...this.instructions] : n = this.instructions) : (t = this.recentBlockhash, n = this.instructions), !t)
      throw new Error("Transaction recentBlockhash required");
    n.length < 1 && console.warn("No instructions provided");
    let r;
    if (this.feePayer)
      r = this.feePayer;
    else if (this.signatures.length > 0 && this.signatures[0].publicKey)
      r = this.signatures[0].publicKey;
    else
      throw new Error("Transaction fee payer required");
    for (let b = 0; b < n.length; b++)
      if (n[b].programId === void 0)
        throw new Error(`Transaction instruction index ${b} has undefined program id`);
    const o = [], i = [];
    n.forEach((b) => {
      b.keys.forEach((q) => {
        i.push({
          ...q
        });
      });
      const x = b.programId.toString();
      o.includes(x) || o.push(x);
    }), o.forEach((b) => {
      i.push({
        pubkey: new le(b),
        isSigner: !1,
        isWritable: !1
      });
    });
    const s = [];
    i.forEach((b) => {
      const x = b.pubkey.toString(), q = s.findIndex((X) => X.pubkey.toString() === x);
      q > -1 ? (s[q].isWritable = s[q].isWritable || b.isWritable, s[q].isSigner = s[q].isSigner || b.isSigner) : s.push(b);
    }), s.sort(function(b, x) {
      if (b.isSigner !== x.isSigner)
        return b.isSigner ? -1 : 1;
      if (b.isWritable !== x.isWritable)
        return b.isWritable ? -1 : 1;
      const q = {
        localeMatcher: "best fit",
        usage: "sort",
        sensitivity: "variant",
        ignorePunctuation: !1,
        numeric: !1,
        caseFirst: "lower"
      };
      return b.pubkey.toBase58().localeCompare(x.pubkey.toBase58(), "en", q);
    });
    const l = s.findIndex((b) => b.pubkey.equals(r));
    if (l > -1) {
      const [b] = s.splice(l, 1);
      b.isSigner = !0, b.isWritable = !0, s.unshift(b);
    } else
      s.unshift({
        pubkey: r,
        isSigner: !0,
        isWritable: !0
      });
    for (const b of this.signatures) {
      const x = s.findIndex((q) => q.pubkey.equals(b.publicKey));
      if (x > -1)
        s[x].isSigner || (s[x].isSigner = !0, console.warn("Transaction references a signature that is unnecessary, only the fee payer and instruction signer accounts should sign a transaction. This behavior is deprecated and will throw an error in the next major version release."));
      else
        throw new Error(`unknown signer: ${b.publicKey.toString()}`);
    }
    let f = 0, m = 0, y = 0;
    const C = [], D = [];
    s.forEach(({
      pubkey: b,
      isSigner: x,
      isWritable: q
    }) => {
      x ? (C.push(b.toString()), f += 1, q || (m += 1)) : (D.push(b.toString()), q || (y += 1));
    });
    const v = C.concat(D), M = n.map((b) => {
      const {
        data: x,
        programId: q
      } = b;
      return {
        programIdIndex: v.indexOf(q.toString()),
        accounts: b.keys.map((X) => v.indexOf(X.pubkey.toString())),
        data: gt.encode(x)
      };
    });
    return M.forEach((b) => {
      rt(b.programIdIndex >= 0), b.accounts.forEach((x) => rt(x >= 0));
    }), new Bn({
      header: {
        numRequiredSignatures: f,
        numReadonlySignedAccounts: m,
        numReadonlyUnsignedAccounts: y
      },
      accountKeys: v,
      recentBlockhash: t,
      instructions: M
    });
  }
  /**
   * @internal
   */
  _compile() {
    const t = this.compileMessage(), n = t.accountKeys.slice(0, t.header.numRequiredSignatures);
    return this.signatures.length === n.length && this.signatures.every((o, i) => n[i].equals(o.publicKey)) || (this.signatures = n.map((r) => ({
      signature: null,
      publicKey: r
    }))), t;
  }
  /**
   * Get a buffer of the Transaction data that need to be covered by signatures
   */
  serializeMessage() {
    return this._compile().serialize();
  }
  /**
   * Get the estimated fee associated with a transaction
   *
   * @param {Connection} connection Connection to RPC Endpoint.
   *
   * @returns {Promise<number | null>} The estimated fee for the transaction
   */
  async getEstimatedFee(t) {
    return (await t.getFeeForMessage(this.compileMessage())).value;
  }
  /**
   * Specify the public keys which will be used to sign the Transaction.
   * The first signer will be used as the transaction fee payer account.
   *
   * Signatures can be added with either `partialSign` or `addSignature`
   *
   * @deprecated Deprecated since v0.84.0. Only the fee payer needs to be
   * specified and it can be set in the Transaction constructor or with the
   * `feePayer` property.
   */
  setSigners(...t) {
    if (t.length === 0)
      throw new Error("No signers");
    const n = /* @__PURE__ */ new Set();
    this.signatures = t.filter((r) => {
      const o = r.toString();
      return n.has(o) ? !1 : (n.add(o), !0);
    }).map((r) => ({
      signature: null,
      publicKey: r
    }));
  }
  /**
   * Sign the Transaction with the specified signers. Multiple signatures may
   * be applied to a Transaction. The first signature is considered "primary"
   * and is used identify and confirm transactions.
   *
   * If the Transaction `feePayer` is not set, the first signer will be used
   * as the transaction fee payer account.
   *
   * Transaction fields should not be modified after the first call to `sign`,
   * as doing so may invalidate the signature and cause the Transaction to be
   * rejected.
   *
   * The Transaction must be assigned a valid `recentBlockhash` before invoking this method
   *
   * @param {Array<Signer>} signers Array of signers that will sign the transaction
   */
  sign(...t) {
    if (t.length === 0)
      throw new Error("No signers");
    const n = /* @__PURE__ */ new Set(), r = [];
    for (const i of t) {
      const s = i.publicKey.toString();
      n.has(s) || (n.add(s), r.push(i));
    }
    this.signatures = r.map((i) => ({
      signature: null,
      publicKey: i.publicKey
    }));
    const o = this._compile();
    this._partialSign(o, ...r);
  }
  /**
   * Partially sign a transaction with the specified accounts. All accounts must
   * correspond to either the fee payer or a signer account in the transaction
   * instructions.
   *
   * All the caveats from the `sign` method apply to `partialSign`
   *
   * @param {Array<Signer>} signers Array of signers that will sign the transaction
   */
  partialSign(...t) {
    if (t.length === 0)
      throw new Error("No signers");
    const n = /* @__PURE__ */ new Set(), r = [];
    for (const i of t) {
      const s = i.publicKey.toString();
      n.has(s) || (n.add(s), r.push(i));
    }
    const o = this._compile();
    this._partialSign(o, ...r);
  }
  /**
   * @internal
   */
  _partialSign(t, ...n) {
    const r = t.serialize();
    n.forEach((o) => {
      const i = su(r, o.secretKey);
      this._addSignature(o.publicKey, Go(i));
    });
  }
  /**
   * Add an externally created signature to a transaction. The public key
   * must correspond to either the fee payer or a signer account in the transaction
   * instructions.
   *
   * @param {PublicKey} pubkey Public key that will be added to the transaction.
   * @param {Buffer} signature An externally created signature to add to the transaction.
   */
  addSignature(t, n) {
    this._compile(), this._addSignature(t, n);
  }
  /**
   * @internal
   */
  _addSignature(t, n) {
    rt(n.length === 64);
    const r = this.signatures.findIndex((o) => t.equals(o.publicKey));
    if (r < 0)
      throw new Error(`unknown signer: ${t.toString()}`);
    this.signatures[r].signature = pe.Buffer.from(n);
  }
  /**
   * Verify signatures of a Transaction
   * Optional parameter specifies if we're expecting a fully signed Transaction or a partially signed one.
   * If no boolean is provided, we expect a fully signed Transaction by default.
   *
   * @param {boolean} [requireAllSignatures=true] Require a fully signed Transaction
   */
  verifySignatures(t = !0) {
    return !this._getMessageSignednessErrors(this.serializeMessage(), t);
  }
  /**
   * @internal
   */
  _getMessageSignednessErrors(t, n) {
    const r = {};
    for (const {
      signature: o,
      publicKey: i
    } of this.signatures)
      o === null ? n && (r.missing ||= []).push(i) : $p(o, t, i.toBytes()) || (r.invalid ||= []).push(i);
    return r.invalid || r.missing ? r : void 0;
  }
  /**
   * Serialize the Transaction in the wire format.
   *
   * @param {Buffer} [config] Config of transaction.
   *
   * @returns {Buffer} Signature of transaction in wire format.
   */
  serialize(t) {
    const {
      requireAllSignatures: n,
      verifySignatures: r
    } = Object.assign({
      requireAllSignatures: !0,
      verifySignatures: !0
    }, t), o = this.serializeMessage();
    if (r) {
      const i = this._getMessageSignednessErrors(o, n);
      if (i) {
        let s = "Signature verification failed.";
        throw i.invalid && (s += `
Invalid signature for public key${i.invalid.length === 1 ? "" : "(s)"} [\`${i.invalid.map((l) => l.toBase58()).join("`, `")}\`].`), i.missing && (s += `
Missing signature for public key${i.missing.length === 1 ? "" : "(s)"} [\`${i.missing.map((l) => l.toBase58()).join("`, `")}\`].`), new Error(s);
      }
    }
    return this._serialize(o);
  }
  /**
   * @internal
   */
  _serialize(t) {
    const {
      signatures: n
    } = this, r = [];
    Tt(r, n.length);
    const o = r.length + n.length * 64 + t.length, i = pe.Buffer.alloc(o);
    return rt(n.length < 256), pe.Buffer.from(r).copy(i, 0), n.forEach(({
      signature: s
    }, l) => {
      s !== null && (rt(s.length === 64, "signature has invalid length"), pe.Buffer.from(s).copy(i, r.length + l * 64));
    }), t.copy(i, r.length + n.length * 64), rt(i.length <= Ln, `Transaction too large: ${i.length} > ${Ln}`), i;
  }
  /**
   * Deprecated method
   * @internal
   */
  get keys() {
    return rt(this.instructions.length === 1), this.instructions[0].keys.map((t) => t.pubkey);
  }
  /**
   * Deprecated method
   * @internal
   */
  get programId() {
    return rt(this.instructions.length === 1), this.instructions[0].programId;
  }
  /**
   * Deprecated method
   * @internal
   */
  get data() {
    return rt(this.instructions.length === 1), this.instructions[0].data;
  }
  /**
   * Parse a wire transaction into a Transaction object.
   *
   * @param {Buffer | Uint8Array | Array<number>} buffer Signature of wire Transaction
   *
   * @returns {Transaction} Transaction associated with the signature
   */
  static from(t) {
    let n = [...t];
    const r = yt(n);
    let o = [];
    for (let i = 0; i < r; i++) {
      const s = It(n, 0, Zn);
      o.push(gt.encode(pe.Buffer.from(s)));
    }
    return Jn.populate(Bn.from(n), o);
  }
  /**
   * Populate Transaction object from message and signatures
   *
   * @param {Message} message Message of transaction
   * @param {Array<string>} signatures List of signatures to assign to the transaction
   *
   * @returns {Transaction} The populated Transaction
   */
  static populate(t, n = []) {
    const r = new Jn();
    return r.recentBlockhash = t.recentBlockhash, t.header.numRequiredSignatures > 0 && (r.feePayer = t.accountKeys[0]), n.forEach((o, i) => {
      const s = {
        signature: o == gt.encode(Wp) ? null : gt.decode(o),
        publicKey: t.accountKeys[i]
      };
      r.signatures.push(s);
    }), t.instructions.forEach((o) => {
      const i = o.accounts.map((s) => {
        const l = t.accountKeys[s];
        return {
          pubkey: l,
          isSigner: r.signatures.some((f) => f.publicKey.toString() === l.toString()) || t.isAccountSigner(s),
          isWritable: t.isAccountWritable(s)
        };
      });
      r.instructions.push(new ga({
        keys: i,
        programId: t.accountKeys[o.programIdIndex],
        data: gt.decode(o.data)
      }));
    }), r._message = t, r._json = r.toJSON(), r;
  }
}
class Jr {
  get version() {
    return this.message.version;
  }
  constructor(t, n) {
    if (this.signatures = void 0, this.message = void 0, n !== void 0)
      rt(n.length === t.header.numRequiredSignatures, "Expected signatures length to be equal to the number of required signatures"), this.signatures = n;
    else {
      const r = [];
      for (let o = 0; o < t.header.numRequiredSignatures; o++)
        r.push(new Uint8Array(Zn));
      this.signatures = r;
    }
    this.message = t;
  }
  serialize() {
    const t = this.message.serialize(), n = Array();
    Tt(n, this.signatures.length);
    const r = L.struct([L.blob(n.length, "encodedSignaturesLength"), L.seq(Vp(), this.signatures.length, "signatures"), L.blob(t.length, "serializedMessage")]), o = new Uint8Array(2048), i = r.encode({
      encodedSignaturesLength: new Uint8Array(n),
      signatures: this.signatures,
      serializedMessage: t
    }, o);
    return o.slice(0, i);
  }
  static deserialize(t) {
    let n = [...t];
    const r = [], o = yt(n);
    for (let s = 0; s < o; s++)
      r.push(new Uint8Array(It(n, 0, Zn)));
    const i = qo.deserialize(new Uint8Array(n));
    return new Jr(i, r);
  }
  sign(t) {
    const n = this.message.serialize(), r = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures);
    for (const o of t) {
      const i = r.findIndex((s) => s.equals(o.publicKey));
      rt(i >= 0, `Cannot sign with non signer key ${o.publicKey.toBase58()}`), this.signatures[i] = su(n, o.secretKey);
    }
  }
  addSignature(t, n) {
    rt(n.byteLength === 64, "Signature must be 64 bytes long");
    const o = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures).findIndex((i) => i.equals(t));
    rt(o >= 0, `Can not add signature; \`${t.toBase58()}\` is not required to sign this transaction`), this.signatures[o] = n;
  }
}
new le("SysvarC1ock11111111111111111111111111111111");
new le("SysvarEpochSchedu1e111111111111111111111111");
new le("Sysvar1nstructions1111111111111111111111111");
new le("SysvarRecentB1ockHashes11111111111111111111");
new le("SysvarRent111111111111111111111111111111111");
new le("SysvarRewards111111111111111111111111111111");
new le("SysvarS1otHashes111111111111111111111111111");
new le("SysvarS1otHistory11111111111111111111111111");
new le("SysvarStakeHistory1111111111111111111111111");
const jp = L.nu64("lamportsPerSignature"), Yp = L.struct([L.u32("version"), L.u32("state"), Ae("authorizedPubkey"), Ae("nonce"), L.struct([jp], "feeCalculator")]);
Yp.span;
function Pn(e) {
  const t = L.blob(8, e), n = t.decode.bind(t), r = t.encode.bind(t), o = t, i = YE();
  return o.decode = (s, l) => {
    const f = n(s, l);
    return i.decode(f);
  }, o.encode = (s, l, f) => {
    const m = i.encode(s);
    return r(m, l, f);
  }, o;
}
Object.freeze({
  Create: {
    index: 0,
    layout: L.struct([L.u32("instruction"), L.ns64("lamports"), L.ns64("space"), Ae("programId")])
  },
  Assign: {
    index: 1,
    layout: L.struct([L.u32("instruction"), Ae("programId")])
  },
  Transfer: {
    index: 2,
    layout: L.struct([L.u32("instruction"), Pn("lamports")])
  },
  CreateWithSeed: {
    index: 3,
    layout: L.struct([L.u32("instruction"), Ae("base"), wn("seed"), L.ns64("lamports"), L.ns64("space"), Ae("programId")])
  },
  AdvanceNonceAccount: {
    index: 4,
    layout: L.struct([L.u32("instruction")])
  },
  WithdrawNonceAccount: {
    index: 5,
    layout: L.struct([L.u32("instruction"), L.ns64("lamports")])
  },
  InitializeNonceAccount: {
    index: 6,
    layout: L.struct([L.u32("instruction"), Ae("authorized")])
  },
  AuthorizeNonceAccount: {
    index: 7,
    layout: L.struct([L.u32("instruction"), Ae("authorized")])
  },
  Allocate: {
    index: 8,
    layout: L.struct([L.u32("instruction"), L.ns64("space")])
  },
  AllocateWithSeed: {
    index: 9,
    layout: L.struct([L.u32("instruction"), Ae("base"), wn("seed"), L.ns64("space"), Ae("programId")])
  },
  AssignWithSeed: {
    index: 10,
    layout: L.struct([L.u32("instruction"), Ae("base"), wn("seed"), Ae("programId")])
  },
  TransferWithSeed: {
    index: 11,
    layout: L.struct([L.u32("instruction"), Pn("lamports"), wn("seed"), Ae("programId")])
  },
  UpgradeNonceAccount: {
    index: 12,
    layout: L.struct([L.u32("instruction")])
  }
});
new le("11111111111111111111111111111111");
new le("BPFLoader2111111111111111111111111111111111");
L.struct([
  L.u32("typeIndex"),
  Pn("deactivationSlot"),
  L.nu64("lastExtendedSlot"),
  L.u8("lastExtendedStartIndex"),
  L.u8(),
  // option
  L.seq(Ae(), L.offset(L.u8(), -1), "authority")
]);
const $e = ar(Vo(le), ne(), (e) => new le(e)), uu = Ho([ne(), xe("base64")]), Wo = ar(Vo(pe.Buffer), uu, (e) => pe.Buffer.from(e[0], "base64"));
function lu(e) {
  return mt([Q({
    jsonrpc: xe("2.0"),
    id: ne(),
    result: e
  }), Q({
    jsonrpc: xe("2.0"),
    id: ne(),
    error: Q({
      code: $n(),
      message: ne(),
      data: ae(np())
    })
  })]);
}
const Xp = lu($n());
function Ie(e) {
  return ar(lu(e), Xp, (t) => "error" in t ? t : {
    ...t,
    result: Xn(t.result, e)
  });
}
function Ut(e) {
  return Ie(Q({
    context: Q({
      slot: V()
    }),
    value: e
  }));
}
function Qr(e) {
  return Q({
    context: Q({
      slot: V()
    }),
    value: e
  });
}
const Zp = Q({
  foundation: V(),
  foundationTerm: V(),
  initial: V(),
  taper: V(),
  terminal: V()
});
Ie(oe(se(Q({
  epoch: V(),
  effectiveSlot: V(),
  amount: V(),
  postBalance: V(),
  commission: ae(se(V()))
}))));
const Jp = oe(Q({
  slot: V(),
  prioritizationFee: V()
})), Qp = Q({
  total: V(),
  validator: V(),
  foundation: V(),
  epoch: V()
}), eA = Q({
  epoch: V(),
  slotIndex: V(),
  slotsInEpoch: V(),
  absoluteSlot: V(),
  blockHeight: ae(V()),
  transactionCount: ae(V())
}), tA = Q({
  slotsPerEpoch: V(),
  leaderScheduleSlotOffset: V(),
  warmup: kt(),
  firstNormalEpoch: V(),
  firstNormalSlot: V()
}), nA = Zc(ne(), oe(V())), gn = se(mt([Q({}), ne()])), rA = Q({
  err: gn
}), iA = xe("receivedSignature");
Q({
  "solana-core": ne(),
  "feature-set": ae(V())
});
const oA = Q({
  program: ne(),
  programId: $e,
  parsed: $n()
}), sA = Q({
  programId: $e,
  accounts: oe($e),
  data: ne()
});
Ut(Q({
  err: se(mt([Q({}), ne()])),
  logs: se(oe(ne())),
  accounts: ae(se(oe(se(Q({
    executable: kt(),
    owner: ne(),
    lamports: V(),
    data: oe(ne()),
    rentEpoch: ae(V())
  }))))),
  unitsConsumed: ae(V()),
  returnData: ae(se(Q({
    programId: ne(),
    data: Ho([ne(), xe("base64")])
  }))),
  innerInstructions: ae(se(oe(Q({
    index: V(),
    instructions: oe(mt([oA, sA]))
  }))))
}));
Ut(Q({
  byIdentity: Zc(ne(), oe(V())),
  range: Q({
    firstSlot: V(),
    lastSlot: V()
  })
}));
Ie(Zp);
Ie(Qp);
Ie(Jp);
Ie(eA);
Ie(tA);
Ie(nA);
Ie(V());
Ut(Q({
  total: V(),
  circulating: V(),
  nonCirculating: V(),
  nonCirculatingAccounts: oe($e)
}));
const aA = Q({
  amount: ne(),
  uiAmount: se(V()),
  decimals: V(),
  uiAmountString: ae(ne())
});
Ut(oe(Q({
  address: $e,
  amount: ne(),
  uiAmount: se(V()),
  decimals: V(),
  uiAmountString: ae(ne())
})));
Ut(oe(Q({
  pubkey: $e,
  account: Q({
    executable: kt(),
    owner: $e,
    lamports: V(),
    data: Wo,
    rentEpoch: V()
  })
})));
const Eo = Q({
  program: ne(),
  parsed: $n(),
  space: V()
});
Ut(oe(Q({
  pubkey: $e,
  account: Q({
    executable: kt(),
    owner: $e,
    lamports: V(),
    data: Eo,
    rentEpoch: V()
  })
})));
Ut(oe(Q({
  lamports: V(),
  address: $e
})));
const jo = Q({
  executable: kt(),
  owner: $e,
  lamports: V(),
  data: Wo,
  rentEpoch: V()
});
Q({
  pubkey: $e,
  account: jo
});
const cA = ar(mt([Vo(pe.Buffer), Eo]), mt([uu, Eo]), (e) => Array.isArray(e) ? Xn(e, Wo) : e), uA = Q({
  executable: kt(),
  owner: $e,
  lamports: V(),
  data: cA,
  rentEpoch: V()
});
Q({
  pubkey: $e,
  account: uA
});
Q({
  state: mt([xe("active"), xe("inactive"), xe("activating"), xe("deactivating")]),
  active: V(),
  inactive: V()
});
Ie(oe(Q({
  signature: ne(),
  slot: V(),
  err: gn,
  memo: se(ne()),
  blockTime: ae(se(V()))
})));
Ie(oe(Q({
  signature: ne(),
  slot: V(),
  err: gn,
  memo: se(ne()),
  blockTime: ae(se(V()))
})));
Q({
  subscription: V(),
  result: Qr(jo)
});
const lA = Q({
  pubkey: $e,
  account: jo
});
Q({
  subscription: V(),
  result: Qr(lA)
});
const dA = Q({
  parent: V(),
  slot: V(),
  root: V()
});
Q({
  subscription: V(),
  result: dA
});
const fA = mt([Q({
  type: mt([xe("firstShredReceived"), xe("completed"), xe("optimisticConfirmation"), xe("root")]),
  slot: V(),
  timestamp: V()
}), Q({
  type: xe("createdBank"),
  parent: V(),
  slot: V(),
  timestamp: V()
}), Q({
  type: xe("frozen"),
  slot: V(),
  timestamp: V(),
  stats: Q({
    numTransactionEntries: V(),
    numSuccessfulTransactions: V(),
    numFailedTransactions: V(),
    maxTransactionsPerEntry: V()
  })
}), Q({
  type: xe("dead"),
  slot: V(),
  timestamp: V(),
  err: ne()
})]);
Q({
  subscription: V(),
  result: fA
});
Q({
  subscription: V(),
  result: Qr(mt([rA, iA]))
});
Q({
  subscription: V(),
  result: V()
});
Q({
  pubkey: ne(),
  gossip: se(ne()),
  tpu: se(ne()),
  rpc: se(ne()),
  version: se(ne())
});
const ma = Q({
  votePubkey: ne(),
  nodePubkey: ne(),
  activatedStake: V(),
  epochVoteAccount: kt(),
  epochCredits: oe(Ho([V(), V(), V()])),
  commission: V(),
  lastVote: V(),
  rootSlot: se(V())
});
Ie(Q({
  current: oe(ma),
  delinquent: oe(ma)
}));
const hA = mt([xe("processed"), xe("confirmed"), xe("finalized")]), _A = Q({
  slot: V(),
  confirmations: se(V()),
  err: gn,
  confirmationStatus: ae(hA)
});
Ut(oe(se(_A)));
Ie(V());
const du = Q({
  accountKey: $e,
  writableIndexes: oe(V()),
  readonlyIndexes: oe(V())
}), Yo = Q({
  signatures: oe(ne()),
  message: Q({
    accountKeys: oe(ne()),
    header: Q({
      numRequiredSignatures: V(),
      numReadonlySignedAccounts: V(),
      numReadonlyUnsignedAccounts: V()
    }),
    instructions: oe(Q({
      accounts: oe(V()),
      data: ne(),
      programIdIndex: V()
    })),
    recentBlockhash: ne(),
    addressTableLookups: ae(oe(du))
  })
}), fu = Q({
  pubkey: $e,
  signer: kt(),
  writable: kt(),
  source: ae(mt([xe("transaction"), xe("lookupTable")]))
}), hu = Q({
  accountKeys: oe(fu),
  signatures: oe(ne())
}), _u = Q({
  parsed: $n(),
  program: ne(),
  programId: $e
}), Ru = Q({
  accounts: oe($e),
  data: ne(),
  programId: $e
}), RA = mt([Ru, _u]), EA = mt([Q({
  parsed: $n(),
  program: ne(),
  programId: ne()
}), Q({
  accounts: oe(ne()),
  data: ne(),
  programId: ne()
})]), Eu = ar(RA, EA, (e) => "accounts" in e ? Xn(e, Ru) : Xn(e, _u)), pu = Q({
  signatures: oe(ne()),
  message: Q({
    accountKeys: oe(fu),
    instructions: oe(Eu),
    recentBlockhash: ne(),
    addressTableLookups: ae(se(oe(du)))
  })
}), $r = Q({
  accountIndex: V(),
  mint: ne(),
  owner: ae(ne()),
  programId: ae(ne()),
  uiTokenAmount: aA
}), Au = Q({
  writable: oe($e),
  readonly: oe($e)
}), ei = Q({
  err: gn,
  fee: V(),
  innerInstructions: ae(se(oe(Q({
    index: V(),
    instructions: oe(Q({
      accounts: oe(V()),
      data: ne(),
      programIdIndex: V()
    }))
  })))),
  preBalances: oe(V()),
  postBalances: oe(V()),
  logMessages: ae(se(oe(ne()))),
  preTokenBalances: ae(se(oe($r))),
  postTokenBalances: ae(se(oe($r))),
  loadedAddresses: ae(Au),
  computeUnitsConsumed: ae(V()),
  costUnits: ae(V())
}), Xo = Q({
  err: gn,
  fee: V(),
  innerInstructions: ae(se(oe(Q({
    index: V(),
    instructions: oe(Eu)
  })))),
  preBalances: oe(V()),
  postBalances: oe(V()),
  logMessages: ae(se(oe(ne()))),
  preTokenBalances: ae(se(oe($r))),
  postTokenBalances: ae(se(oe($r))),
  loadedAddresses: ae(Au),
  computeUnitsConsumed: ae(V()),
  costUnits: ae(V())
}), kn = mt([xe(0), xe("legacy")]), mn = Q({
  pubkey: ne(),
  lamports: V(),
  postBalance: se(V()),
  rewardType: se(ne()),
  commission: ae(se(V()))
});
Ie(se(Q({
  blockhash: ne(),
  previousBlockhash: ne(),
  parentSlot: V(),
  transactions: oe(Q({
    transaction: Yo,
    meta: se(ei),
    version: ae(kn)
  })),
  rewards: ae(oe(mn)),
  blockTime: se(V()),
  blockHeight: se(V())
})));
Ie(se(Q({
  blockhash: ne(),
  previousBlockhash: ne(),
  parentSlot: V(),
  rewards: ae(oe(mn)),
  blockTime: se(V()),
  blockHeight: se(V())
})));
Ie(se(Q({
  blockhash: ne(),
  previousBlockhash: ne(),
  parentSlot: V(),
  transactions: oe(Q({
    transaction: hu,
    meta: se(ei),
    version: ae(kn)
  })),
  rewards: ae(oe(mn)),
  blockTime: se(V()),
  blockHeight: se(V())
})));
Ie(se(Q({
  blockhash: ne(),
  previousBlockhash: ne(),
  parentSlot: V(),
  transactions: oe(Q({
    transaction: pu,
    meta: se(Xo),
    version: ae(kn)
  })),
  rewards: ae(oe(mn)),
  blockTime: se(V()),
  blockHeight: se(V())
})));
Ie(se(Q({
  blockhash: ne(),
  previousBlockhash: ne(),
  parentSlot: V(),
  transactions: oe(Q({
    transaction: hu,
    meta: se(Xo),
    version: ae(kn)
  })),
  rewards: ae(oe(mn)),
  blockTime: se(V()),
  blockHeight: se(V())
})));
Ie(se(Q({
  blockhash: ne(),
  previousBlockhash: ne(),
  parentSlot: V(),
  rewards: ae(oe(mn)),
  blockTime: se(V()),
  blockHeight: se(V())
})));
Ie(se(Q({
  blockhash: ne(),
  previousBlockhash: ne(),
  parentSlot: V(),
  transactions: oe(Q({
    transaction: Yo,
    meta: se(ei)
  })),
  rewards: ae(oe(mn)),
  blockTime: se(V())
})));
Ie(se(Q({
  blockhash: ne(),
  previousBlockhash: ne(),
  parentSlot: V(),
  signatures: oe(ne()),
  blockTime: se(V())
})));
Ie(se(Q({
  slot: V(),
  meta: se(ei),
  blockTime: ae(se(V())),
  transaction: Yo,
  version: ae(kn)
})));
Ie(se(Q({
  slot: V(),
  transaction: pu,
  meta: se(Xo),
  blockTime: ae(se(V())),
  version: ae(kn)
})));
Ut(Q({
  blockhash: ne(),
  lastValidBlockHeight: V()
}));
Ut(kt());
const pA = Q({
  slot: V(),
  numTransactions: V(),
  numSlots: V(),
  samplePeriodSecs: V()
});
Ie(oe(pA));
Ut(se(Q({
  feeCalculator: Q({
    lamportsPerSignature: V()
  })
})));
Ie(ne());
Ie(ne());
const AA = Q({
  err: gn,
  logs: oe(ne()),
  signature: ne()
});
Q({
  result: Qr(AA),
  subscription: V()
});
Object.freeze({
  CreateLookupTable: {
    index: 0,
    layout: L.struct([L.u32("instruction"), Pn("recentSlot"), L.u8("bumpSeed")])
  },
  FreezeLookupTable: {
    index: 1,
    layout: L.struct([L.u32("instruction")])
  },
  ExtendLookupTable: {
    index: 2,
    layout: L.struct([L.u32("instruction"), Pn(), L.seq(Ae(), L.offset(L.u32(), -8), "addresses")])
  },
  DeactivateLookupTable: {
    index: 3,
    layout: L.struct([L.u32("instruction")])
  },
  CloseLookupTable: {
    index: 4,
    layout: L.struct([L.u32("instruction")])
  }
});
new le("AddressLookupTab1e1111111111111111111111111");
Object.freeze({
  RequestUnits: {
    index: 0,
    layout: L.struct([L.u8("instruction"), L.u32("units"), L.u32("additionalFee")])
  },
  RequestHeapFrame: {
    index: 1,
    layout: L.struct([L.u8("instruction"), L.u32("bytes")])
  },
  SetComputeUnitLimit: {
    index: 2,
    layout: L.struct([L.u8("instruction"), L.u32("units")])
  },
  SetComputeUnitPrice: {
    index: 3,
    layout: L.struct([L.u8("instruction"), Pn("microLamports")])
  }
});
new le("ComputeBudget111111111111111111111111111111");
L.struct([L.u8("numSignatures"), L.u8("padding"), L.u16("signatureOffset"), L.u16("signatureInstructionIndex"), L.u16("publicKeyOffset"), L.u16("publicKeyInstructionIndex"), L.u16("messageDataOffset"), L.u16("messageDataSize"), L.u16("messageInstructionIndex")]);
new le("Ed25519SigVerify111111111111111111111111111");
Pp.utils.isValidPrivateKey;
L.struct([L.u8("numSignatures"), L.u16("signatureOffset"), L.u8("signatureInstructionIndex"), L.u16("ethAddressOffset"), L.u8("ethAddressInstructionIndex"), L.u16("messageDataOffset"), L.u16("messageDataSize"), L.u8("messageInstructionIndex"), L.blob(20, "ethAddress"), L.blob(64, "signature"), L.u8("recoveryId")]);
new le("KeccakSecp256k11111111111111111111111111111");
var gu;
new le("StakeConfig11111111111111111111111111111111");
class mu {
  /**
   * Create a new Lockup object
   */
  constructor(t, n, r) {
    this.unixTimestamp = void 0, this.epoch = void 0, this.custodian = void 0, this.unixTimestamp = t, this.epoch = n, this.custodian = r;
  }
  /**
   * Default, inactive Lockup value
   */
}
gu = mu;
mu.default = new gu(0, 0, le.default);
Object.freeze({
  Initialize: {
    index: 0,
    layout: L.struct([L.u32("instruction"), Hp(), Gp()])
  },
  Authorize: {
    index: 1,
    layout: L.struct([L.u32("instruction"), Ae("newAuthorized"), L.u32("stakeAuthorizationType")])
  },
  Delegate: {
    index: 2,
    layout: L.struct([L.u32("instruction")])
  },
  Split: {
    index: 3,
    layout: L.struct([L.u32("instruction"), L.ns64("lamports")])
  },
  Withdraw: {
    index: 4,
    layout: L.struct([L.u32("instruction"), L.ns64("lamports")])
  },
  Deactivate: {
    index: 5,
    layout: L.struct([L.u32("instruction")])
  },
  Merge: {
    index: 7,
    layout: L.struct([L.u32("instruction")])
  },
  AuthorizeWithSeed: {
    index: 8,
    layout: L.struct([L.u32("instruction"), Ae("newAuthorized"), L.u32("stakeAuthorizationType"), wn("authoritySeed"), Ae("authorityOwner")])
  }
});
new le("Stake11111111111111111111111111111111111111");
Object.freeze({
  InitializeAccount: {
    index: 0,
    layout: L.struct([L.u32("instruction"), Kp()])
  },
  Authorize: {
    index: 1,
    layout: L.struct([L.u32("instruction"), Ae("newAuthorized"), L.u32("voteAuthorizationType")])
  },
  Withdraw: {
    index: 3,
    layout: L.struct([L.u32("instruction"), L.ns64("lamports")])
  },
  UpdateValidatorIdentity: {
    index: 4,
    layout: L.struct([L.u32("instruction")])
  },
  AuthorizeWithSeed: {
    index: 10,
    layout: L.struct([L.u32("instruction"), qp()])
  }
});
new le("Vote111111111111111111111111111111111111111");
new le("Va1idator1nfo111111111111111111111111111111");
Q({
  name: ne(),
  website: ae(ne()),
  details: ae(ne()),
  iconUrl: ae(ne()),
  keybaseUsername: ae(ne())
});
new le("Vote111111111111111111111111111111111111111");
L.struct([
  Ae("nodePubkey"),
  Ae("authorizedWithdrawer"),
  L.u8("commission"),
  L.nu64(),
  // votes.length
  L.seq(L.struct([L.nu64("slot"), L.u32("confirmationCount")]), L.offset(L.u32(), -8), "votes"),
  L.u8("rootSlotValid"),
  L.nu64("rootSlot"),
  L.nu64(),
  // authorizedVoters.length
  L.seq(L.struct([L.nu64("epoch"), Ae("authorizedVoter")]), L.offset(L.u32(), -8), "authorizedVoters"),
  L.struct([L.seq(L.struct([Ae("authorizedPubkey"), L.nu64("epochOfLastAuthorizedSwitch"), L.nu64("targetEpoch")]), 32, "buf"), L.nu64("idx"), L.u8("isEmpty")], "priorVoters"),
  L.nu64(),
  // epochCredits.length
  L.seq(L.struct([L.nu64("epoch"), L.nu64("credits"), L.nu64("prevCredits")]), L.offset(L.u32(), -8), "epochCredits"),
  L.struct([L.nu64("slot"), L.nu64("timestamp")], "lastTimestamp")
]);
var gA = 1, mA = 2, OA = 3, SA = 4, NA = 5, yA = 6, TA = 7, IA = 8, wA = 9, vA = 10, bA = 11, CA = 12, LA = -32700, xA = -32603, UA = -32602, DA = -32601, MA = -32600, BA = -32021, PA = -32020, $A = -32019, kA = -32018, FA = -32017, zA = -32016, VA = -32015, HA = -32014, GA = -32013, KA = -32012, qA = -32011, WA = -32010, jA = -32009, YA = -32008, XA = -32007, ZA = -32006, JA = -32005, QA = -32004, eg = -32003, tg = -32002, ng = -32001, rg = 28e5, ig = 2800001, og = 2800002, sg = 2800003, ag = 2800004, cg = 2800005, ug = 2800006, lg = 2800007, dg = 2800008, fg = 2800009, hg = 2800010, _g = 2800011, Rg = 323e4, Eg = 32300001, pg = 3230002, Ag = 3230003, gg = 3230004, mg = 361e4, Og = 3610001, Sg = 3610002, Ng = 3610003, yg = 3610004, Tg = 3610005, Ig = 3610006, wg = 3610007, vg = 3611e3, bg = 3704e3, Cg = 3704001, Lg = 3704002, xg = 3704003, Ug = 3704004, Dg = 3704005, Mg = 3704006, Bg = 3712e3, Pg = 4128e3, $g = 4128001, kg = 4128002, po = 4615e3, Fg = 4615001, zg = 4615002, Vg = 4615003, Hg = 4615004, Gg = 4615005, Kg = 4615006, qg = 4615007, Wg = 4615008, jg = 4615009, Yg = 4615010, Xg = 4615011, Zg = 4615012, Jg = 4615013, Qg = 4615014, em = 4615015, tm = 4615016, nm = 4615017, rm = 4615018, im = 4615019, om = 4615020, sm = 4615021, am = 4615022, cm = 4615023, um = 4615024, lm = 4615025, dm = 4615026, fm = 4615027, hm = 4615028, _m = 4615029, Rm = 4615030, Em = 4615031, pm = 4615032, Am = 4615033, gm = 4615034, mm = 4615035, Om = 4615036, Sm = 4615037, Nm = 4615038, ym = 4615039, Tm = 4615040, Im = 4615041, wm = 4615042, vm = 4615043, bm = 4615044, Cm = 4615045, Lm = 4615046, xm = 4615047, Um = 4615048, Dm = 4615049, Mm = 4615050, Bm = 4615051, Pm = 4615052, $m = 4615053, km = 4615054, Fm = 5508e3, zm = 5508001, Vm = 5508002, Hm = 5508003, Gm = 5508004, Km = 5508005, qm = 5508006, Wm = 5508007, jm = 5508008, Ym = 5508009, Xm = 5508010, Zm = 5508011, Jm = 5508012, Qm = 5607e3, e1 = 5607001, t1 = 5607002, n1 = 5607003, r1 = 5607004, i1 = 5607005, o1 = 5607006, s1 = 5607007, a1 = 5607008, c1 = 5607009, u1 = 5607010, l1 = 5607011, d1 = 5607012, f1 = 5607013, h1 = 5607014, _1 = 5607015, R1 = 5607016, E1 = 5607017, p1 = 5663e3, A1 = 5663001, g1 = 5663002, m1 = 5663003, O1 = 5663004, S1 = 5663005, N1 = 5663006, y1 = 5663007, T1 = 5663008, I1 = 5663009, w1 = 5663010, v1 = 5663011, b1 = 5663012, C1 = 5663013, L1 = 5663014, x1 = 5663015, U1 = 5663016, D1 = 5663017, M1 = 5663018, B1 = 5663019, P1 = 5663020, $1 = 5663021, k1 = 5663022, F1 = 5663023, z1 = 5663024, V1 = 5663025, H1 = 5663026, G1 = 5663027, K1 = 5663028, q1 = 5663029, W1 = 5663030, j1 = 5663031, Y1 = 5663032, X1 = 5663033, Z1 = 5663034, J1 = 5663035, Q1 = 5663036, eO = 5663037, tO = 705e4, nO = 7050001, rO = 7050002, iO = 7050003, oO = 7050004, sO = 7050005, aO = 7050006, cO = 7050007, uO = 7050008, lO = 7050009, dO = 7050010, fO = 7050011, hO = 7050012, _O = 7050013, RO = 7050014, EO = 7050015, pO = 7050016, AO = 7050017, gO = 7050018, mO = 7050019, OO = 7050020, SO = 7050021, NO = 7050022, yO = 7050023, TO = 7050024, IO = 7050025, wO = 7050026, vO = 7050027, bO = 7050028, CO = 7050029, LO = 7050030, xO = 7050031, UO = 7050032, DO = 7050033, MO = 7050034, BO = 7050035, PO = 7050036, $O = 7618e3, kO = 7618001, FO = 7618002, zO = 7618003, VO = 7618004, HO = 7618005, GO = 7618006, KO = 7618007, qO = 7618008, WO = 7618009, jO = 8078e3, YO = 8078001, XO = 8078002, ZO = 8078003, JO = 8078004, QO = 8078005, eS = 8078006, tS = 8078007, nS = 8078008, rS = 8078009, iS = 8078010, oS = 8078011, Ao = 8078012, sS = 8078013, aS = 8078014, cS = 8078015, uS = 8078016, lS = 8078017, dS = 8078018, fS = 8078019, hS = 8078020, _S = 8078021, RS = 8078022, ES = 8078023, pS = 8078024, AS = 8078025, gS = 809e4, mS = 8090001, OS = 8090002, SS = 8090003, NS = 8090004, yS = 8090005, TS = 8090006, IS = 8090007, wS = 8090008, vS = 8090009, bS = 8090010, CS = 8090011, LS = 8090012, xS = 81e5, US = 8100001, DS = 8100002, MS = 8100003, BS = 819e4, PS = 8190001, $S = 8190002, kS = 8190003, FS = 8190004, zS = 8195e3, VS = 85e5, HS = 8500001, GS = 8500002, KS = 8500003, qS = 8500004, WS = 8500005, jS = 8500006, YS = 89e5, XS = 8900001, ZS = 8900002, JS = 8900003, QS = 99e5, eN = 9900001, tN = 9900002, nN = 9900003, rN = 9900004, iN = 9900005, oN = 9900006;
function Ou(e) {
  return Array.isArray(e) ? "%5B" + e.map(Ou).join(
    "%2C%20"
    /* ", " */
  ) + /* "]" */
  "%5D" : typeof e == "bigint" ? `${e}n` : encodeURIComponent(
    String(
      e != null && Object.getPrototypeOf(e) === null ? (
        // Plain objects with no prototype don't have a `toString` method.
        // Convert them before stringifying them.
        { ...e }
      ) : e
    )
  );
}
function sN([e, t]) {
  return `${e}=${Ou(t)}`;
}
function aN(e) {
  const t = Object.entries(e).map(sN).join("&");
  return btoa(t);
}
var cN = {
  [Rg]: "Account not found at address: $address",
  [gg]: "Not all accounts were decoded. Encoded accounts found at addresses: $addresses.",
  [Ag]: "Expected decoded account at address: $address",
  [pg]: "Failed to decode account data at address: $address",
  [Eg]: "Accounts not found at addresses: $addresses",
  [fg]: "Unable to find a viable program address bump seed.",
  [og]: "$putativeAddress is not a base58-encoded address.",
  [rg]: "Expected base58 encoded address to decode to a byte array of length 32. Actual length: $actualLength.",
  [sg]: "The `CryptoKey` must be an `Ed25519` public key.",
  [_g]: "$putativeOffCurveAddress is not a base58-encoded off-curve address.",
  [dg]: "Invalid seeds; point must fall off the Ed25519 curve.",
  [ag]: "Expected given program derived address to have the following format: [Address, ProgramDerivedAddressBump].",
  [ug]: "A maximum of $maxSeeds seeds, including the bump seed, may be supplied when creating an address. Received: $actual.",
  [lg]: "The seed at index $index with length $actual exceeds the maximum length of $maxSeedLength bytes.",
  [cg]: "Expected program derived address bump to be in the range [0, 255], got: $bump.",
  [hg]: "Program address cannot end with PDA marker.",
  [ig]: "Expected base58-encoded address string of length in the range [32, 44]. Actual length: $actualLength.",
  [SA]: "Expected base58-encoded blockhash string of length in the range [32, 44]. Actual length: $actualLength.",
  [gA]: "The network has progressed past the last block for which this transaction could have been committed.",
  [jO]: "Codec [$codecDescription] cannot decode empty byte arrays.",
  [RS]: "Enum codec cannot use lexical values [$stringValues] as discriminators. Either remove all lexical values or set `useValuesAsDiscriminators` to `false`.",
  [hS]: "Sentinel [$hexSentinel] must not be present in encoded bytes [$hexEncodedBytes].",
  [QO]: "Encoder and decoder must have the same fixed size, got [$encoderFixedSize] and [$decoderFixedSize].",
  [eS]: "Encoder and decoder must have the same max size, got [$encoderMaxSize] and [$decoderMaxSize].",
  [JO]: "Encoder and decoder must either both be fixed-size or variable-size.",
  [nS]: "Enum discriminator out of range. Expected a number in [$formattedValidDiscriminators], got $discriminator.",
  [XO]: "Expected a fixed-size codec, got a variable-size one.",
  [sS]: "Codec [$codecDescription] expected a positive byte length, got $bytesLength.",
  [ZO]: "Expected a variable-size codec, got a fixed-size one.",
  [fS]: "Codec [$codecDescription] expected zero-value [$hexZeroValue] to have the same size as the provided fixed-size item [$expectedSize bytes].",
  [YO]: "Codec [$codecDescription] expected $expected bytes, got $bytesLength.",
  [dS]: "Expected byte array constant [$hexConstant] to be present in data [$hexData] at offset [$offset].",
  [rS]: "Invalid discriminated union variant. Expected one of [$variants], got $value.",
  [iS]: "Invalid enum variant. Expected one of [$stringValues] or a number in [$formattedNumericalValues], got $variant.",
  [cS]: "Invalid literal union variant. Expected one of [$variants], got $value.",
  [tS]: "Expected [$codecDescription] to have $expected items, got $actual.",
  [Ao]: "Invalid value $value for base $base with alphabet $alphabet.",
  [uS]: "Literal union discriminator out of range. Expected a number between $minRange and $maxRange, got $discriminator.",
  [oS]: "Codec [$codecDescription] expected number to be in the range [$min, $max], got $value.",
  [aS]: "Codec [$codecDescription] expected offset to be in the range [0, $bytesLength], got $offset.",
  [_S]: "Expected sentinel [$hexSentinel] to be present in decoded bytes [$hexDecodedBytes].",
  [lS]: "Union variant out of range. Expected an index between $minRange and $maxRange, got $variant.",
  [ES]: "This decoder expected a byte array of exactly $expectedLength bytes, but $numExcessBytes unexpected excess bytes remained after decoding. Are you sure that you have chosen the correct decoder for this data?",
  [pS]: "Invalid pattern match value. The provided value does not match any of the specified patterns.",
  [AS]: "Invalid pattern match bytes. The provided byte array does not match any of the specified patterns.",
  [vg]: "No random values implementation could be found.",
  [bA]: "Failed to send transaction$causeMessage",
  [CA]: "Failed to send transactions$causeMessages",
  [IS]: "Fixed-point operation `$operation` of kind `$kind` overflowed. Expected a raw bigint in [$min, $max], got $result.",
  [vS]: "Fixed-point division by zero for value of kind `$kind` ($signedness, $totalBits bits).",
  [SS]: "`fractionalBits` ($fractionalBits) must not exceed `totalBits` ($totalBits).",
  [OS]: "Invalid `decimals`. Expected a non-negative integer, got $decimals.",
  [mS]: "Invalid `fractionalBits`. Expected a non-negative integer, got $fractionalBits.",
  [yS]: "Invalid string `$input` for fixed-point value of kind `$kind`.",
  [gS]: "Invalid `totalBits`. Expected a positive integer, got $totalBits.",
  [TS]: "Invalid ratio $numerator/$denominator for fixed-point value of kind `$kind`. Denominator must be non-zero.",
  [CS]: "Fixed-point value of kind `$kind` has a malformed `raw` field. Expected a bigint, got `$raw`.",
  [wS]: "Fixed-point `$operation` operation expected $expectedKind ($expectedSignedness, $expectedTotalBits bits, $expectedScale $expectedScaleLabel); got $actualKind ($actualSignedness, $actualTotalBits bits, $actualScale $actualScaleLabel).",
  [bS]: "Fixed-point operation `$operation` of kind `$kind` cannot be performed exactly; pass a rounding mode other than `strict` to allow a rounded result.",
  [LS]: "Fixed-point codec of kind `$kind` requires `totalBits` to be a multiple of 8; got $totalBits.",
  [NS]: "Fixed-point value of kind `$kind` is out of range for $signedness $totalBits-bit storage. Expected a raw bigint in [$min, $max], got $raw.",
  [Bg]: "Filesystem operation `$operation` is not supported in this environment.",
  [jg]: "Instruction requires an uninitialized account",
  [cm]: "Instruction tries to borrow reference for an account which is already borrowed",
  [um]: "Instruction left account with an outstanding borrowed reference",
  [sm]: "Program other than the account's owner changed the size of the account data",
  [Gg]: "Account data too small for instruction",
  [am]: "Instruction expected an executable account",
  [Lm]: "An account does not have enough lamports to be rent-exempt",
  [Um]: "Program arithmetic overflowed",
  [Cm]: "Failed to serialize or deserialize account data",
  [km]: "Builtin programs must consume compute units",
  [pm]: "Cross-program invocation call depth too deep",
  [Nm]: "Computational budget exceeded",
  [dm]: "Custom program error: #$code",
  [nm]: "Instruction contains duplicate accounts",
  [lm]: "Instruction modifications of multiply-passed account differ",
  [Rm]: "Executable accounts must be rent exempt",
  [hm]: "Instruction changed executable accounts data",
  [_m]: "Instruction changed the balance of an executable account",
  [rm]: "Instruction changed executable bit of an account",
  [Qg]: "Instruction modified data of an account it does not own",
  [Jg]: "Instruction spent from the balance of an account it does not own",
  [Fg]: "Generic instruction error",
  [Mm]: "Provided owner is not allowed",
  [vm]: "Account is immutable",
  [bm]: "Incorrect authority provided",
  [qg]: "Incorrect program id for instruction",
  [Kg]: "Insufficient funds for instruction",
  [Hg]: "Invalid account data for instruction",
  [xm]: "Invalid account owner",
  [zg]: "Invalid program argument",
  [fm]: "Program returned invalid error code",
  [Vg]: "Invalid instruction data",
  [Sm]: "Failed to reallocate account data",
  [Om]: "Provided seeds do not result in a valid address",
  [Bm]: "Accounts data allocations exceeded the maximum allowed per transaction",
  [Pm]: "Max accounts exceeded",
  [$m]: "Max instruction trace length exceeded",
  [mm]: "Length of the seed is too long for address generation",
  [Am]: "An account required by the instruction is missing",
  [Wg]: "Missing required signature for instruction",
  [Zg]: "Instruction illegally modified the program id of an account",
  [om]: "Insufficient account keys for instruction",
  [ym]: "Cross-program invocation with unauthorized signer or writable account",
  [Tm]: "Failed to create program execution environment",
  [wm]: "Program failed to compile",
  [Im]: "Program failed to complete",
  [tm]: "Instruction modified data of a read-only account",
  [em]: "Instruction changed the balance of a read-only account",
  [gm]: "Cross-program invocation reentrancy not allowed for this instruction",
  [im]: "Instruction modified rent epoch of an account",
  [Xg]: "Sum of account balances before and after instruction do not match",
  [Yg]: "Instruction requires an initialized account",
  [po]: "The instruction failed with the error: $errorName",
  [Em]: "Unsupported program id",
  [Dm]: "Unsupported sysvar",
  [iN]: "Invalid instruction plan kind: $kind.",
  [FO]: "The provided instruction plan is empty.",
  [HO]: "No failed transaction plan result was found in the provided transaction plan result.",
  [VO]: "This transaction plan executor does not support non-divisible sequential plans. To support them, you may create your own executor such that multi-transaction atomicity is preserved — e.g. by targetting RPCs that support transaction bundles.",
  [zO]: "The provided transaction plan failed to execute. See the `transactionPlanResult` attribute for more details. Note that the `cause` property is deprecated, and a future version will not set it.",
  [$O]: "The provided message has insufficient capacity to accommodate the next instruction(s) in this plan. Expected at least $numBytesRequired free byte(s), got $numFreeBytes byte(s).",
  [oN]: "Invalid transaction plan kind: $kind.",
  [kO]: "No more instructions to pack; the message packer has completed the instruction plan.",
  [GO]: "Unexpected instruction plan. Expected $expectedKind plan, got $actualKind plan.",
  [KO]: "Unexpected transaction plan. Expected $expectedKind plan, got $actualKind plan.",
  [qO]: "Unexpected transaction plan result. Expected $expectedKind plan, got $actualKind plan.",
  [WO]: "Expected a successful transaction plan result. I.e. there is at least one failed or cancelled transaction in the plan.",
  [Pg]: "The instruction does not have any accounts.",
  [$g]: "The instruction does not have any data.",
  [kg]: "Expected instruction to have progress address $expectedProgramAddress, got $actualProgramAddress.",
  [NA]: "Expected base58 encoded blockhash to decode to a byte array of length 32. Actual length: $actualLength.",
  [mA]: "The nonce `$expectedNonceValue` is no longer valid. It has advanced to `$actualNonceValue`",
  [tN]: "Invariant violation: Found no abortable iterable cache entry for key `$cacheKey`. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [rN]: "Invariant violation: This data publisher does not publish to the channel named `$channelName`. Supported channels include $supportedChannelNames.",
  [eN]: "Invariant violation: WebSocket message iterator state is corrupt; iterated without first resolving existing message promise. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [QS]: "Invariant violation: WebSocket message iterator is missing state storage. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [nN]: "Invariant violation: Switch statement non-exhaustive. Received unexpected value `$unexpectedValue`. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [xA]: "JSON-RPC error: Internal JSON-RPC error ($__serverMessage)",
  [UA]: "JSON-RPC error: Invalid method parameter(s) ($__serverMessage)",
  [MA]: "JSON-RPC error: The JSON sent is not a valid `Request` object ($__serverMessage)",
  [DA]: "JSON-RPC error: The method does not exist / is not available ($__serverMessage)",
  [LA]: "JSON-RPC error: An error occurred on the server while parsing the JSON text ($__serverMessage)",
  [KA]: "$__serverMessage",
  [ng]: "$__serverMessage",
  [QA]: "$__serverMessage",
  [HA]: "$__serverMessage",
  [FA]: "Epoch rewards period still active at slot $slot",
  [PA]: "$__serverMessage",
  [WA]: "$__serverMessage",
  [jA]: "$__serverMessage",
  [$A]: "Failed to query long-term storage; please try again",
  [zA]: "Minimum context slot has not been reached",
  [JA]: "Node is unhealthy; behind by $numSlotsBehind slots",
  [BA]: "No slot history",
  [YA]: "No snapshot",
  [tg]: "Transaction simulation failed",
  [kA]: "Rewards cannot be found because slot $slot is not the epoch boundary. This may be due to gap in the queried node's local ledger or long-term storage",
  [XA]: "$__serverMessage",
  [qA]: "Transaction history is not available from this node",
  [ZA]: "$__serverMessage",
  [GA]: "Transaction signature length mismatch",
  [eg]: "Transaction signature verification failure",
  [VA]: "$__serverMessage",
  [Dg]: "The grind regex `/$source/` contains the character `$character`, which is not in the base58 alphabet and can never match a Solana address.",
  [bg]: "Key pair bytes must be of length 64, got $byteLength.",
  [Cg]: "Expected private key bytes with length 32. Actual length: $actualLength.",
  [Lg]: "Expected base58-encoded signature to decode to a byte array of length 64. Actual length: $actualLength.",
  [Ug]: "The provided private key does not match the provided public key.",
  [xg]: "Expected base58-encoded signature string of length in the range [64, 88]. Actual length: $actualLength.",
  [Mg]: "Writing a key pair to disk is not supported in this environment.",
  [yA]: "Lamports value must be in the range [0, 2e64-1]",
  [TA]: "`$value` cannot be parsed as a `BigInt`",
  [vA]: "$message",
  [IA]: "`$value` cannot be parsed as a `Number`",
  [OA]: "No nonce account could be found at address `$nonceAccountAddress`",
  [n1]: "Expected base58 encoded application domain to decode to a byte array of length 32. Actual length: $actualLength.",
  [f1]: "Attempted to sign an offchain message with an address that is not a signer for it",
  [t1]: "Expected base58-encoded application domain string of length in the range [32, 44]. Actual length: $actualLength.",
  [d1]: "The signer addresses in this offchain message envelope do not match the list of required signers in the message preamble. These unexpected signers were present in the envelope: `[$unexpectedSigners]`. These required signers were missing from the envelope `[$missingSigners]`.",
  [Qm]: "The message body provided has a byte-length of $actualBytes. The maximum allowable byte-length is $maxBytes",
  [s1]: "Expected message format $expectedMessageFormat, got $actualMessageFormat",
  [a1]: "The message length specified in the message preamble is $specifiedLength bytes. The actual length of the message is $actualLength bytes.",
  [c1]: "Offchain message content must be non-empty",
  [i1]: "Offchain message must specify the address of at least one required signer",
  [u1]: "Offchain message envelope must reserve space for at least one signature",
  [r1]: "The offchain message preamble specifies $numRequiredSignatures required signature(s), got $signaturesLength.",
  [_1]: "The signatories of this offchain message must be listed in lexicographical order",
  [R1]: "An address must be listed no more than once among the signatories of an offchain message",
  [l1]: "Offchain message is missing signatures for addresses: $addresses.",
  [E1]: "Offchain message signature verification failed. Signature mismatch for required signatories [$signatoriesWithInvalidSignatures]. Missing signatures for signatories [$signatoriesWithMissingSignatures]",
  [e1]: "The message body provided contains characters whose codes fall outside the allowed range. In order to ensure clear-signing compatiblity with hardware wallets, the message may only contain line feeds and characters in the range [\\x20-\\x7e].",
  [h1]: "Expected offchain message version $expectedVersion. Got $actualVersion.",
  [o1]: "This version of Kit does not support decoding offchain messages with version $unsupportedVersion. The current max supported version is 0.",
  [jS]: "The provided account could not be identified as an account from the $programName program.",
  [GS]: "The provided instruction could not be identified as an instruction from the $programName program.",
  [VS]: "The provided instruction is missing some accounts. Expected at least $expectedAccountMetas account(s), got $actualAccountMetas.",
  [qS]: "Expected resolved instruction input '$inputName' to be non-null.",
  [KS]: "Expected resolved instruction input '$inputName' to be of type `$expectedType`.",
  [WS]: "Unrecognized account type '$accountType' for the $programName program.",
  [HS]: "Unrecognized instruction type '$instructionType' for the $programName program.",
  [BS]: "The notification name must end in 'Notifications' and the API must supply a subscription plan creator function for the notification '$notificationName'.",
  [$S]: "WebSocket was closed before payload could be added to the send buffer",
  [kS]: "WebSocket connection closed",
  [FS]: "WebSocket failed to connect",
  [PS]: "Failed to obtain a subscription id from the server",
  [MS]: "Could not find an API plan for RPC method: `$method`",
  [xS]: "The $argumentLabel argument to the `$methodName` RPC method$optionalPathLabel was `$value`. This number is unsafe for use with the Solana JSON-RPC because it exceeds `Number.MAX_SAFE_INTEGER`.",
  [DS]: "HTTP error ($statusCode): $message",
  [US]: "HTTP header(s) forbidden: $headers. Learn more at https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name.",
  [Fm]: "Multiple distinct signers were identified for address `$address`. Please ensure that you are using the same signer instance for each address.",
  [zm]: "The provided value does not implement the `KeyPairSigner` interface",
  [Hm]: "The provided value does not implement the `MessageModifyingSigner` interface",
  [Gm]: "The provided value does not implement the `MessagePartialSigner` interface",
  [Vm]: "The provided value does not implement any of the `MessageSigner` interfaces",
  [qm]: "The provided value does not implement the `TransactionModifyingSigner` interface",
  [Wm]: "The provided value does not implement the `TransactionPartialSigner` interface",
  [jm]: "The provided value does not implement the `TransactionSendingSigner` interface",
  [Km]: "The provided value does not implement any of the `TransactionSigner` interfaces",
  [Ym]: "More than one `TransactionSendingSigner` was identified.",
  [Xm]: "No `TransactionSendingSigner` was identified. Please provide a valid `TransactionWithSingleSendingSigner` transaction.",
  [Jm]: "The wallet account $address cannot be used to create a transaction signer because it does not implement either the `solana:signTransaction` or `solana:signAndSendTransaction` feature. At least one of these features is required. The account supports the following features: $supportedFeatures.",
  [Zm]: "Wallet account signers do not support signing multiple messages/transactions in a single operation",
  [zS]: "This `ReactiveStreamStore` does not support retry. Use `createReactiveStoreFromDataPublisherFactory` to construct a retryable store.",
  [wg]: "Cannot export a non-extractable key.",
  [Og]: "No digest implementation could be found.",
  [mg]: "Cryptographic operations are only allowed in secure browser contexts. Read more here: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts.",
  [Sg]: `This runtime does not support the generation of Ed25519 key pairs.

Install @solana/webcrypto-ed25519-polyfill and call its \`install\` function before generating keys in environments that do not support Ed25519.

For a list of runtimes that currently support Ed25519 operations, visit https://github.com/WICG/webcrypto-secure-curves/issues/20.`,
  [Ng]: "No key export implementation could be found.",
  [yg]: "No key generation implementation could be found.",
  [Tg]: "No signing implementation could be found.",
  [Ig]: "No signature verification implementation could be found.",
  [wA]: "Timestamp value must be in the range [-(2n ** 63n), (2n ** 63n) - 1]. `$value` given",
  [pO]: "Transaction processing left an account with an outstanding borrowed reference",
  [nO]: "Account in use",
  [rO]: "Account loaded twice",
  [iO]: "Attempt to debit an account but found no record of a prior credit.",
  [yO]: "Transaction loads an address table account that doesn't exist",
  [cO]: "This transaction has already been processed",
  [uO]: "Blockhash not found",
  [lO]: "Loader call chain is too deep",
  [EO]: "Transactions are currently disabled due to cluster maintenance",
  [LO]: "Transaction contains a duplicate instruction ($index) that is not allowed",
  [sO]: "Insufficient funds for fee",
  [xO]: "Transaction results in an account ($accountIndex) with insufficient funds for rent",
  [aO]: "This account may not be used to pay transaction fees",
  [fO]: "Transaction contains an invalid account reference",
  [IO]: "Transaction loads an address table account with invalid data",
  [wO]: "Transaction address table lookup uses an invalid index",
  [TO]: "Transaction loads an address table account with an invalid owner",
  [DO]: "LoadedAccountsDataSizeLimit set for transaction must be greater than 0.",
  [_O]: "This program may not be used for executing instructions",
  [vO]: "Transaction leaves an account with a lower balance than rent-exempt minimum",
  [mO]: "Transaction loads a writable account that cannot be written",
  [UO]: "Transaction exceeded max loaded accounts data size cap",
  [dO]: "Transaction requires a fee but has no signature present",
  [oO]: "Attempt to load a program that does not exist",
  [BO]: "Execution of the program referenced by account at index $accountIndex is temporarily restricted.",
  [MO]: "ResanitizationNeeded",
  [RO]: "Transaction failed to sanitize accounts offsets correctly",
  [hO]: "Transaction did not pass signature verification",
  [NO]: "Transaction locked too many accounts",
  [PO]: "Sum of account balances before and after transaction do not match",
  [tO]: "The transaction failed with the error `$errorName`",
  [gO]: "Transaction version is unsupported",
  [SO]: "Transaction would exceed account data limit within the block",
  [CO]: "Transaction would exceed total account data limit",
  [OO]: "Transaction would exceed max account limit within the block",
  [AO]: "Transaction would exceed max Block Cost Limit",
  [bO]: "Transaction would exceed max Vote Cost Limit",
  [x1]: "Attempted to sign a transaction with an address that is not a signer for it",
  [w1]: "Transaction is missing an address at index: $index.",
  [U1]: "Transaction has no expected signers therefore it cannot be encoded",
  [P1]: "Transaction size $transactionSize exceeds limit of $transactionSizeLimit bytes",
  [g1]: "Transaction does not have a blockhash lifetime",
  [m1]: "Transaction is not a durable nonce transaction",
  [S1]: "Contents of these address lookup tables unknown: $lookupTableAddresses",
  [N1]: "Lookup of address at index $highestRequestedIndex failed for lookup table `$lookupTableAddress`. Highest known index is $highestKnownIndex. The lookup table may have been extended since its contents were retrieved",
  [T1]: "No fee payer set in CompiledTransaction",
  [y1]: "Could not find program address at index $index",
  [M1]: "Failed to estimate the compute unit consumption for this transaction message. This is likely because simulating the transaction failed. Inspect the `cause` property of this error to learn more",
  [Q1]: "Failed to estimate the loaded accounts data size for this transaction message. The RPC did not return a `loadedAccountsDataSize` value from simulation. This value is required for version 1 transactions",
  [B1]: "Transaction failed when it was simulated in order to estimate the compute unit consumption. The compute unit estimate provided is for a transaction that failed when simulated and may not be representative of the compute units this transaction would consume if successful. Inspect the `cause` property of this error to learn more",
  [eO]: "Transaction failed when it was simulated in order to estimate its resource limits. The resource limit estimates provided are for a transaction that failed when simulated and may not be representative of the resources this transaction would consume if successful. Inspect the `cause` property of this error to learn more",
  [v1]: "Transaction is missing a fee payer.",
  [b1]: "Could not determine this transaction's signature. Make sure that the transaction has been signed by its fee payer.",
  [L1]: "Transaction first instruction is not advance nonce account instruction.",
  [C1]: "Transaction with no instructions cannot be durable nonce transaction.",
  [p1]: "This transaction includes an address (`$programAddress`) which is both invoked and set as the fee payer. Program addresses may not pay fees",
  [A1]: "This transaction includes an address (`$programAddress`) which is both invoked and marked writable. Program addresses may not be writable",
  [D1]: "The transaction message expected the transaction to have $numRequiredSignatures signatures, got $signaturesLength.",
  [I1]: "Transaction is missing signatures for addresses: $addresses.",
  [O1]: "Transaction version must be in the range [0, 127]. `$actualVersion` given",
  [$1]: "This version of Kit does not support decoding transactions with version $unsupportedVersion. The current max supported version is 1.",
  [k1]: "The transaction has a durable nonce lifetime (with nonce `$nonce`), but the nonce account address is in a lookup table. The lifetime constraint cannot be constructed without fetching the lookup tables for the transaction.",
  [K1]: "Invalid transaction config mask: $mask. Bits 0 and 1 must match (both set or both unset)",
  [F1]: "Transaction message bytes are malformed: $messageBytes",
  [z1]: "Transaction message bytes are empty, so the transaction cannot be encoded",
  [V1]: "Transaction bytes are empty, so no transaction can be decoded",
  [H1]: "Transaction version 0 must be encoded with signatures first. This transaction was encoded with first byte $firstByte, which is expected to be a signature count for v0 transactions.",
  [G1]: "The provided transaction bytes expect that there should be $numExpectedSignatures signatures, but the bytes are not long enough to contain a transaction message with this many signatures. The provided bytes are $transactionBytesLength bytes long.",
  [q1]: "The transaction has a durable nonce lifetime, but the nonce account index is invalid. Expected a nonce account index less than $numberOfStaticAccounts, got $nonceAccountIndex.",
  [W1]: "The transaction config value for $configName has the incorrect kind. Expected $expectedKind, got $actualKind.",
  [j1]: "The transaction does not have the same number of instruction headers and instruction payloads. Got $numInstructionHeaders instruction headers, and $numInstructionPayloads instruction payloads.",
  [Y1]: "Transaction has $actualCount unique signer addresses but the maximum allowed is $maxAllowed",
  [X1]: "Transaction has $actualCount unique account addresses but the maximum allowed is $maxAllowed",
  [Z1]: "Transaction has $actualCount instructions but the maximum allowed is $maxAllowed",
  [J1]: "The instruction at index $instructionIndex has $actualCount account references but the maximum allowed is $maxAllowed",
  [YS]: "Cannot $operation: no wallet connected",
  [XS]: "No signing wallet connected (status: $status)",
  [ZS]: "Connected wallet does not support signing",
  [JS]: 'Account $address is not available in wallet "$walletName"'
}, uN = 1e3, qt = "i", $t = "t";
function lN(e, t = {}) {
  const n = cN[e];
  if (n.length === 0)
    return "";
  let r;
  function o(l) {
    if (r[$t] === 2) {
      const f = n.slice(r[qt] + 1, l);
      i.push(
        f in t ? (
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${t[f]}`
        ) : `$${f}`
      );
    } else r[$t] === 1 && i.push(n.slice(r[qt], l));
  }
  const i = [];
  n.split("").forEach((l, f) => {
    if (f === 0) {
      r = {
        [qt]: 0,
        [$t]: n[0] === "\\" ? 0 : n[0] === "$" ? 2 : 1
        /* Text */
      };
      return;
    }
    let m;
    switch (r[$t]) {
      case 0:
        m = {
          [qt]: f,
          [$t]: 1
          /* Text */
        };
        break;
      case 1:
        l === "\\" ? m = {
          [qt]: f,
          [$t]: 0
          /* EscapeSequence */
        } : l === "$" && (m = {
          [qt]: f,
          [$t]: 2
          /* Variable */
        });
        break;
      case 2:
        l === "\\" ? m = {
          [qt]: f,
          [$t]: 0
          /* EscapeSequence */
        } : l === "$" ? m = {
          [qt]: f,
          [$t]: 2
          /* Variable */
        } : l.match(/\w/) || (m = {
          [qt]: f,
          [$t]: 1
          /* Text */
        });
        break;
    }
    m && (r !== m && o(f), r = m);
  }), o();
  let s = i.join("");
  return e >= po && e < po + uN && "index" in t && (s += ` (instruction #${t.index + 1})`), s;
}
function dN(e, t = {}) {
  if (process.env.NODE_ENV !== "production")
    return lN(e, t);
  {
    let n = `Solana error #${e}; Decode this error by running \`npx @solana/errors decode -- ${e}`;
    return Object.keys(t).length && (n += ` '${aN(t)}'`), `${n}\``;
  }
}
var Oa = class extends Error {
  /**
   * Indicates the root cause of this {@link SolanaError}, if any.
   *
   * For example, a transaction error might have an instruction error as its root cause. In this
   * case, you will be able to access the instruction error on the transaction error as `cause`.
   */
  cause = this.cause;
  /**
   * Contains context that can assist in understanding or recovering from a {@link SolanaError}.
   */
  context;
  constructor(...[e, t]) {
    let n, r;
    t && Object.entries(Object.getOwnPropertyDescriptors(t)).forEach(([i, s]) => {
      i === "cause" ? r = { cause: s.value } : (n === void 0 && (n = {
        __code: e
      }), Object.defineProperty(n, i, s));
    });
    const o = dN(e, n);
    super(o, r), this.context = Object.freeze(
      n === void 0 ? {
        __code: e
      } : n
    ), this.name = "SolanaError";
  }
};
function fN(e, t) {
  return "fixedSize" in t ? t.fixedSize : t.getSizeFromValue(e);
}
function Su(e) {
  return Object.freeze({
    ...e,
    encode: (t) => {
      const n = new Uint8Array(fN(t, e));
      return e.write(t, n, 0), n;
    }
  });
}
function Zo(e) {
  return Object.freeze({
    ...e,
    decode: (t, n = 0) => e.read(t, n)[0]
  });
}
var hN = (e) => Zo({
  read(t, n) {
    const r = n === 0 || n <= -t.byteLength ? t : t.slice(n);
    if (r.length === 0) return ["", 0];
    let o = r.findIndex((f) => f !== 0);
    o = o === -1 ? r.length : o;
    const i = e[0].repeat(o);
    if (o === r.length) return [i, t.length];
    const s = r.slice(o).reduce((f, m) => f * 256n + BigInt(m), 0n), l = _N(s, e);
    return [i + l, t.length];
  }
});
function _N(e, t) {
  const n = BigInt(t.length), r = [];
  for (; e > 0n; )
    r.unshift(t[Number(e % n)]), e /= n;
  return r.join("");
}
var RN = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", EN = () => hN(RN), Sa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", pN = () => Su({
  getSizeFromValue: (e) => {
    try {
      return atob(e).length;
    } catch {
      throw new Oa(Ao, {
        alphabet: Sa,
        base: 64,
        value: e
      });
    }
  },
  write(e, t, n) {
    try {
      const r = atob(e).split("").map((o) => o.charCodeAt(0));
      return t.set(r, n), r.length + n;
    } catch {
      throw new Oa(Ao, {
        alphabet: Sa,
        base: 64,
        value: e
      });
    }
  }
}), Nu = () => Zo({
  read(e, t = 0) {
    const n = e.slice(t);
    return [btoa(String.fromCharCode(...n)), e.length];
  }
}), AN = (e) => (
  // eslint-disable-next-line no-control-regex
  e.replace(/\u0000/g, "")
), gN = globalThis.TextDecoder, Na = globalThis.TextEncoder, yu = () => {
  let e;
  return Su({
    getSizeFromValue: (t) => (e ||= new Na()).encode(t).length,
    write: (t, n, r) => {
      const o = (e ||= new Na()).encode(t);
      return n.set(o, r), r + o.length;
    }
  });
}, mN = () => {
  let e;
  return Zo({
    read(t, n) {
      const r = (e ||= new gN()).decode(t.slice(n));
      return [AN(r), t.length];
    }
  });
};
function ON(e) {
  return Nu().decode(yu().encode(e));
}
function kr(e, t) {
  return Nu().decode(e);
}
function Jo(e) {
  return pN().encode(e);
}
function Tu(e) {
  return EN().decode(e);
}
function SN(e) {
  return Tu(Jo(e));
}
function NN(e) {
  return kr(new Uint8Array(e));
}
function yN(e) {
  return Tu(e);
}
function Iu(e) {
  return kr(e);
}
function Qi(e) {
  return Jo(e);
}
function TN(e) {
  return mN().decode(e);
}
function IN(e) {
  return yu().encode(e);
}
function wN(e) {
  let t = `${e.domain} wants you to sign in with your Solana account:
`;
  t += `${e.address}`, e.statement && (t += `

${e.statement}`);
  const n = [];
  if (e.uri && n.push(`URI: ${e.uri}`), e.version && n.push(`Version: ${e.version}`), e.chainId && n.push(`Chain ID: ${e.chainId}`), e.nonce && n.push(`Nonce: ${e.nonce}`), e.issuedAt && n.push(`Issued At: ${e.issuedAt}`), e.expirationTime && n.push(`Expiration Time: ${e.expirationTime}`), e.notBefore && n.push(`Not Before: ${e.notBefore}`), e.requestId && n.push(`Request ID: ${e.requestId}`), e.resources) {
    n.push("Resources:");
    for (const r of e.resources)
      n.push(`- ${r}`);
  }
  return n.length && (t += `

${n.join(`
`)}`), t;
}
const en = {
  ERROR_ASSOCIATION_PORT_OUT_OF_RANGE: "ERROR_ASSOCIATION_PORT_OUT_OF_RANGE",
  ERROR_FORBIDDEN_WALLET_BASE_URL: "ERROR_FORBIDDEN_WALLET_BASE_URL",
  ERROR_SECURE_CONTEXT_REQUIRED: "ERROR_SECURE_CONTEXT_REQUIRED",
  ERROR_SESSION_CLOSED: "ERROR_SESSION_CLOSED",
  ERROR_SESSION_TIMEOUT: "ERROR_SESSION_TIMEOUT",
  ERROR_WALLET_NOT_FOUND: "ERROR_WALLET_NOT_FOUND",
  ERROR_INVALID_PROTOCOL_VERSION: "ERROR_INVALID_PROTOCOL_VERSION"
};
var tn = class extends Error {
  data;
  code;
  constructor(...e) {
    const [t, n, r] = e;
    super(n), this.code = t, this.data = r, this.name = "SolanaMobileWalletAdapterError";
  }
}, wu = class extends Error {
  data;
  code;
  jsonRpcMessageId;
  constructor(...e) {
    const [t, n, r, o] = e;
    super(r), this.code = n, this.data = o, this.jsonRpcMessageId = t, this.name = "SolanaMobileWalletAdapterProtocolError";
  }
};
async function eo(e, t) {
  const n = await crypto.subtle.exportKey("raw", e), r = await crypto.subtle.sign({
    hash: "SHA-256",
    name: "ECDSA"
  }, t, n), o = new Uint8Array(n.byteLength + r.byteLength);
  return o.set(new Uint8Array(n), 0), o.set(new Uint8Array(r), n.byteLength), o;
}
function vN(e) {
  return wN(e);
}
function bN(e) {
  return ON(vN(e)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const CN = "solana:signTransactions", ya = "solana:cloneAuthorization";
function LN(e, t) {
  return new Proxy({}, {
    get(n, r) {
      return r === "then" ? null : (n[r] == null && (n[r] = async function(o) {
        const { method: i, params: s } = xN(r, o, e), l = await t(i, s);
        return i === "authorize" && s.sign_in_payload && !l.sign_in_result && (l.sign_in_result = await DN(s.sign_in_payload, l, t)), UN(r, l, e);
      }), n[r]);
    },
    defineProperty() {
      return !1;
    },
    deleteProperty() {
      return !1;
    }
  });
}
function xN(e, t, n) {
  let r = t, o = e.toString().replace(/[A-Z]/g, (i) => `_${i.toLowerCase()}`).toLowerCase();
  switch (e) {
    case "authorize": {
      const i = r;
      let { chain: s } = i;
      if (n === "legacy") {
        switch (s) {
          case "solana:testnet":
            s = "testnet";
            break;
          case "solana:devnet":
            s = "devnet";
            break;
          case "solana:mainnet":
            s = "mainnet-beta";
            break;
          default:
            s = i.cluster;
        }
        i.cluster = s, r = i;
      } else {
        switch (s) {
          case "testnet":
          case "devnet":
            s = `solana:${s}`;
            break;
          case "mainnet-beta":
            s = "solana:mainnet";
            break;
        }
        i.chain = s, r = i;
      }
    }
    case "reauthorize": {
      const { auth_token: i, identity: s } = r;
      if (i) switch (n) {
        case "legacy":
          o = "reauthorize", r = {
            auth_token: i,
            identity: s
          };
          break;
        default:
          o = "authorize";
          break;
      }
      break;
    }
  }
  return {
    method: o,
    params: r
  };
}
function UN(e, t, n) {
  switch (e) {
    case "getCapabilities": {
      const r = t;
      switch (n) {
        case "legacy": {
          const o = [CN];
          return r.supports_clone_authorization === !0 && o.push(ya), {
            ...r,
            features: o
          };
        }
        case "v1":
          return {
            ...r,
            supports_sign_and_send_transactions: !0,
            supports_clone_authorization: r.features.includes(ya)
          };
      }
    }
  }
  return t;
}
async function DN(e, t, n) {
  const r = e.domain ?? window.location.host, o = t.accounts[0].address, i = bN({
    ...e,
    domain: r,
    address: SN(o)
  }), s = Jo((await n("sign_messages", {
    addresses: [o],
    payloads: [i]
  })).signed_payloads[0]), l = kr(s.slice(0, s.length - 64)), f = kr(s.slice(s.length - 64));
  return {
    address: o,
    signed_message: l.length == 0 ? i : l,
    signature: f
  };
}
function MN(e) {
  if (e >= 4294967296) throw new Error("Outbound sequence number overflow. The maximum sequence number is 32-bytes.");
  const t = /* @__PURE__ */ new ArrayBuffer(4);
  return new DataView(t).setUint32(0, e, !1), new Uint8Array(t);
}
const go = 12;
async function BN(e, t, n) {
  const r = MN(t), o = new Uint8Array(go);
  crypto.getRandomValues(o);
  const i = await crypto.subtle.encrypt(bu(r, o), n, IN(e)), s = new Uint8Array(r.byteLength + o.byteLength + i.byteLength);
  return s.set(new Uint8Array(r), 0), s.set(new Uint8Array(o), r.byteLength), s.set(new Uint8Array(i), r.byteLength + o.byteLength), s;
}
async function vu(e, t) {
  const n = e.slice(0, 4), r = e.slice(4, 4 + go), o = e.slice(4 + go), i = await crypto.subtle.decrypt(bu(n, r), t, o);
  return TN(new Uint8Array(i));
}
function bu(e, t) {
  return {
    additionalData: e,
    iv: t,
    name: "AES-GCM",
    tagLength: 128
  };
}
async function PN() {
  return await crypto.subtle.generateKey({
    name: "ECDSA",
    namedCurve: "P-256"
  }, !1, ["sign"]);
}
async function to() {
  return await crypto.subtle.generateKey({
    name: "ECDH",
    namedCurve: "P-256"
  }, !1, ["deriveKey", "deriveBits"]);
}
function $N() {
  return Cu(49152 + Math.floor(Math.random() * 16384));
}
function Cu(e) {
  if (e < 49152 || e > 65535) throw new tn(en.ERROR_ASSOCIATION_PORT_OUT_OF_RANGE, `Association port number must be between 49152 and 65535. ${e} given.`, { port: e });
  return e;
}
function kN(e) {
  return e.replace(/[/+=]/g, (t) => ({
    "/": "_",
    "+": "-",
    "=": "."
  })[t]);
}
const FN = "solana-wallet";
function Ta(e) {
  return e.replace(/(^\/+|\/+$)/g, "").split("/");
}
function zN(e, t) {
  let n = null;
  n ||= new URL(`${FN}:/`);
  const r = e.startsWith("/") ? e : [...Ta(n.pathname), ...Ta(e)].join("/");
  return new URL(r, n);
}
async function VN(e, t, n, r = ["v1"]) {
  const o = Cu(t), i = NN(await crypto.subtle.exportKey("raw", e)), s = zN("v1/associate/local");
  return s.searchParams.set("association", kN(i)), s.searchParams.set("port", `${o}`), r.forEach((l) => {
    s.searchParams.set("v", l);
  }), s;
}
async function HN(e, t) {
  const n = JSON.stringify(e), r = e.id;
  return BN(n, r, t);
}
async function GN(e, t) {
  const n = await vu(e, t), r = JSON.parse(n);
  if (Object.hasOwnProperty.call(r, "error")) throw new wu(r.id, r.error.code, r.error.message);
  return r;
}
async function KN(e, t, n) {
  const [r, o] = await Promise.all([crypto.subtle.exportKey("raw", t), crypto.subtle.importKey("raw", e.slice(0, 65), {
    name: "ECDH",
    namedCurve: "P-256"
  }, !1, [])]), i = await crypto.subtle.deriveBits({
    name: "ECDH",
    public: o
  }, n, 256), s = await crypto.subtle.importKey("raw", i, "HKDF", !1, ["deriveKey"]);
  return await crypto.subtle.deriveKey({
    name: "HKDF",
    hash: "SHA-256",
    salt: new Uint8Array(r),
    info: new Uint8Array()
  }, s, {
    name: "AES-GCM",
    length: 128
  }, !1, ["encrypt", "decrypt"]);
}
async function qN(e, t) {
  const n = await vu(e, t), r = JSON.parse(n);
  let o = "legacy";
  if (Object.hasOwnProperty.call(r, "v")) switch (r.v) {
    case 1:
    case "1":
    case "v1":
      o = "v1";
      break;
    case "legacy":
      o = "legacy";
      break;
    default:
      throw new tn(en.ERROR_INVALID_PROTOCOL_VERSION, `Unknown/unsupported protocol version: ${r.v}`);
  }
  return { protocol_version: o };
}
const Fr = {
  Firefox: 0,
  Other: 1
};
function WN() {
  return navigator.userAgent.indexOf("Firefox/") !== -1 ? Fr.Firefox : Fr.Other;
}
function jN() {
  return new Promise((e, t) => {
    function n() {
      clearTimeout(o), window.removeEventListener("blur", r);
    }
    function r() {
      n(), e();
    }
    window.addEventListener("blur", r);
    const o = setTimeout(() => {
      n(), t();
    }, 3e3);
  });
}
let Hn = null;
function YN(e) {
  Hn == null && (Hn = document.createElement("iframe"), Hn.style.display = "none", document.body.appendChild(Hn)), Hn.contentWindow.location.href = e.toString();
}
async function XN(e) {
  if (e.protocol === "https:") window.location.assign(e);
  else try {
    const t = WN();
    switch (t) {
      case Fr.Firefox:
        YN(e);
        break;
      case Fr.Other: {
        const n = jN();
        window.location.assign(e), await n;
        break;
      }
      default:
    }
  } catch {
    throw new tn(en.ERROR_WALLET_NOT_FOUND, "Found no installed wallet that supports the mobile wallet protocol.");
  }
}
async function ZN(e, t) {
  const n = $N();
  return await XN(await VN(e, n)), n;
}
const Ia = {
  retryDelayScheduleMs: [
    150,
    150,
    200,
    500,
    500,
    750,
    750,
    1e3
  ],
  timeoutMs: 3e4
}, JN = "com.solana.mobilewalletadapter.v1";
function QN() {
  if (typeof window > "u" || window.isSecureContext !== !0) throw new tn(en.ERROR_SECURE_CONTEXT_REQUIRED, "The mobile wallet adapter protocol must be used in a secure context (`https`).");
}
function ey(e) {
  let t;
  try {
    t = new URL(e);
  } catch {
    throw new tn(en.ERROR_FORBIDDEN_WALLET_BASE_URL, "Invalid base URL supplied by wallet");
  }
  if (t.protocol !== "https:") throw new tn(en.ERROR_FORBIDDEN_WALLET_BASE_URL, "Base URLs supplied by wallets must be valid `https` URLs");
}
function wa(e) {
  return new DataView(e).getUint32(0, !1);
}
async function ty(e, t) {
  const { wallet: n, close: r } = await ny();
  try {
    return await e(await n);
  } finally {
    r();
  }
}
async function ny(e) {
  QN();
  const t = await PN(), n = `ws://localhost:${await ZN(t.publicKey)}/solana-wallet`;
  let r;
  const o = (() => {
    const C = [...Ia.retryDelayScheduleMs];
    return () => C.length > 1 ? C.shift() : C[0];
  })();
  let i = 1, s = 0, l = { __type: "disconnected" }, f, m = !1, y;
  return {
    close: () => {
      f.close(), y();
    },
    wallet: new Promise((C, D) => {
      const v = {}, M = async () => {
        if (l.__type !== "connecting") {
          console.warn(`Expected adapter state to be \`connecting\` at the moment the websocket opens. Got \`${l.__type}\`.`);
          return;
        }
        f.removeEventListener("open", M);
        const { associationKeypair: K } = l, J = await to();
        f.send(await eo(J.publicKey, K.privateKey)), l = {
          __type: "hello_req_sent",
          associationPublicKey: K.publicKey,
          ecdhPrivateKey: J.privateKey
        };
      }, b = (K) => {
        K.wasClean ? l = { __type: "disconnected" } : D(new tn(en.ERROR_SESSION_CLOSED, `The wallet session dropped unexpectedly (${K.code}: ${K.reason}).`, { closeEvent: K })), X();
      }, x = async (K) => {
        X(), Date.now() - r >= Ia.timeoutMs ? D(new tn(en.ERROR_SESSION_TIMEOUT, `Failed to connect to the wallet websocket at ${n}.`)) : (await new Promise((J) => {
          const te = o();
          H = window.setTimeout(J, te);
        }), $());
      }, q = async (K) => {
        const J = await K.data.arrayBuffer();
        switch (l.__type) {
          case "connecting": {
            if (J.byteLength !== 0) throw new Error("Encountered unexpected message while connecting");
            const te = await to();
            f.send(await eo(te.publicKey, t.privateKey)), l = {
              __type: "hello_req_sent",
              associationPublicKey: t.publicKey,
              ecdhPrivateKey: te.privateKey
            };
            break;
          }
          case "connected":
            try {
              const te = wa(J.slice(0, 4));
              if (te !== s + 1) throw new Error("Encrypted message has invalid sequence number");
              s = te;
              const re = await GN(J, l.sharedSecret), j = v[re.id];
              delete v[re.id], j.resolve(re.result);
            } catch (te) {
              if (te instanceof wu) {
                const re = v[te.jsonRpcMessageId];
                delete v[te.jsonRpcMessageId], re.reject(te);
              } else throw te;
            }
            break;
          case "hello_req_sent": {
            if (J.byteLength === 0) {
              const P = await to();
              f.send(await eo(P.publicKey, t.privateKey)), l = {
                __type: "hello_req_sent",
                associationPublicKey: t.publicKey,
                ecdhPrivateKey: P.privateKey
              };
              break;
            }
            const te = await KN(J, l.associationPublicKey, l.ecdhPrivateKey), re = J.slice(65), j = re.byteLength !== 0 ? await (async () => {
              const P = wa(re.slice(0, 4));
              if (P !== s + 1) throw new Error("Encrypted message has invalid sequence number");
              return s = P, qN(re, te);
            })() : { protocol_version: "legacy" };
            l = {
              __type: "connected",
              sharedSecret: te,
              sessionProperties: j
            };
            const k = LN(j.protocol_version, async (P, W) => {
              const g = i++;
              return f.send(await HN({
                id: g,
                jsonrpc: "2.0",
                method: P,
                params: W ?? {}
              }, te)), new Promise((a, _) => {
                v[g] = {
                  resolve(R) {
                    switch (P) {
                      case "authorize":
                      case "reauthorize": {
                        const { wallet_uri_base: N } = R;
                        if (N != null) try {
                          ey(N);
                        } catch (O) {
                          _(O);
                          return;
                        }
                        break;
                      }
                    }
                    a(R);
                  },
                  reject: _
                };
              });
            });
            m = !0;
            try {
              C(k);
            } catch (P) {
              D(P);
            }
            break;
          }
        }
      };
      y = () => {
        f.removeEventListener("message", q), X(), m || D(new tn(en.ERROR_SESSION_CLOSED, "The wallet session was closed before connection.", { closeEvent: new CloseEvent("socket was closed before connection") }));
      };
      let X, H;
      const $ = () => {
        X && X(), l = {
          __type: "connecting",
          associationKeypair: t
        }, r === void 0 && (r = Date.now()), f = new WebSocket(n, [JN]), f.addEventListener("open", M), f.addEventListener("close", b), f.addEventListener("error", x), f.addEventListener("message", q), X = () => {
          window.clearTimeout(H), f.removeEventListener("open", M), f.removeEventListener("close", b), f.removeEventListener("error", x), f.removeEventListener("message", q);
        };
      };
      $();
    })
  };
}
function va(e) {
  return Iu("version" in e ? e.serialize() : e.serialize({
    requireAllSignatures: !1,
    verifySignatures: !1
  }));
}
function ry(e) {
  const t = e[0] * Zn + 1;
  return qo.deserializeMessageVersion(e.slice(t, e.length)) === "legacy" ? Jn.from(e) : Jr.deserialize(e);
}
async function Qo(e, t) {
  return await ty((r) => e(iy(r)));
}
function iy(e) {
  return new Proxy({}, {
    get(t, n) {
      if (t[n] == null) switch (n) {
        case "signAndSendTransactions":
          t[n] = async function({ minContextSlot: r, commitment: o, skipPreflight: i, maxRetries: s, waitForCommitmentToSendNextTransaction: l, transactions: f, ...m }) {
            const y = f.map(va), C = {
              min_context_slot: r,
              commitment: o,
              skip_preflight: i,
              max_retries: s,
              wait_for_commitment_to_send_next_transaction: l
            }, { signatures: D } = await e.signAndSendTransactions({
              ...m,
              ...Object.values(C).some((v) => v != null) ? { options: C } : null,
              payloads: y
            });
            return D.map(Qi).map(yN);
          };
          break;
        case "signMessages":
          t[n] = async function({ payloads: r, ...o }) {
            const i = r.map(Iu), { signed_payloads: s } = await e.signMessages({
              ...o,
              payloads: i
            });
            return s.map(Qi);
          };
          break;
        case "signTransactions":
          t[n] = async function({ transactions: r, ...o }) {
            const i = r.map(va), { signed_payloads: s } = await e.signTransactions({
              ...o,
              payloads: i
            });
            return s.map(Qi).map(ry);
          };
          break;
        default:
          t[n] = e[n];
          break;
      }
      return t[n];
    },
    defineProperty() {
      return !1;
    },
    deleteProperty() {
      return !1;
    }
  });
}
const ba = ju.QuickBase64;
ba && typeof global.base64FromArrayBuffer != "function" && ba.install();
function Lu(e, t = !1) {
  return new Uint8Array(global.base64ToArrayBuffer(e, t));
}
var no, Ca;
function oy() {
  return Ca || (Ca = 1, no = (e) => {
    if (Object.prototype.toString.call(e) !== "[object Object]")
      return !1;
    const t = Object.getPrototypeOf(e);
    return t === null || t === Object.prototype;
  }), no;
}
var gr, La;
function sy() {
  if (La) return gr;
  La = 1;
  const e = oy(), { hasOwnProperty: t } = Object.prototype, { propertyIsEnumerable: n } = Object, r = (v, M, b) => Object.defineProperty(v, M, {
    value: b,
    writable: !0,
    enumerable: !0,
    configurable: !0
  }), o = gr, i = {
    concatArrays: !1,
    ignoreUndefined: !1
  }, s = (v) => {
    const M = [];
    for (const b in v)
      t.call(v, b) && M.push(b);
    if (Object.getOwnPropertySymbols) {
      const b = Object.getOwnPropertySymbols(v);
      for (const x of b)
        n.call(v, x) && M.push(x);
    }
    return M;
  };
  function l(v) {
    return Array.isArray(v) ? f(v) : e(v) ? m(v) : v;
  }
  function f(v) {
    const M = v.slice(0, 0);
    return s(v).forEach((b) => {
      r(M, b, l(v[b]));
    }), M;
  }
  function m(v) {
    const M = Object.getPrototypeOf(v) === null ? /* @__PURE__ */ Object.create(null) : {};
    return s(v).forEach((b) => {
      r(M, b, l(v[b]));
    }), M;
  }
  const y = (v, M, b, x) => (b.forEach((q) => {
    typeof M[q] > "u" && x.ignoreUndefined || (q in v && v[q] !== Object.getPrototypeOf(v) ? r(v, q, D(v[q], M[q], x)) : r(v, q, l(M[q])));
  }), v), C = (v, M, b) => {
    let x = v.slice(0, 0), q = 0;
    return [v, M].forEach((X) => {
      const H = [];
      for (let $ = 0; $ < X.length; $++)
        t.call(X, $) && (H.push(String($)), X === v ? r(x, q++, X[$]) : r(x, q++, l(X[$])));
      x = y(x, X, s(X).filter(($) => !H.includes($)), b);
    }), x;
  };
  function D(v, M, b) {
    return b.concatArrays && Array.isArray(v) && Array.isArray(M) ? C(v, M, b) : !e(M) || !e(v) ? l(M) : y(v, M, s(M), b);
  }
  return gr = function(...v) {
    const M = D(l(i), this !== o && this || {}, i);
    let b = { _: {} };
    for (const x of v)
      if (x !== void 0) {
        if (!e(x))
          throw new TypeError("`" + x + "` is not an Option Object");
        b = D(b, { _: x }, M);
      }
    return b._;
  }, gr;
}
var ay = sy();
const cy = /* @__PURE__ */ bo(ay), uy = cy.bind({
  concatArrays: !0,
  ignoreUndefined: !0
});
function ly(e, t) {
  const n = window.localStorage.getItem(e);
  if (n) {
    const r = JSON.parse(n), o = JSON.parse(t), i = JSON.stringify(uy(r, o));
    window.localStorage.setItem(e, i);
  } else
    window.localStorage.setItem(e, t);
}
function In(e, t) {
  return new Promise((n, r) => {
    try {
      const o = e();
      t?.(null, o), n(o);
    } catch (o) {
      t?.(o), r(o);
    }
  });
}
function mr(e, t, n) {
  return Promise.all(e).then((r) => {
    const o = n?.(r) ?? null;
    return t?.(null, o), Promise.resolve(o);
  }, (r) => (t?.(r), Promise.reject(r)));
}
const Qt = {
  /**
   * Fetches `key` value.
   */
  getItem: (e, t) => In(() => window.localStorage.getItem(e), t),
  /**
   * Sets `value` for `key`.
   */
  setItem: (e, t, n) => In(() => window.localStorage.setItem(e, t), n),
  /**
   * Removes a `key`
   */
  removeItem: (e, t) => In(() => window.localStorage.removeItem(e), t),
  /**
   * Merges existing value with input value, assuming they are stringified JSON.
   */
  mergeItem: (e, t, n) => In(() => ly(e, t), n),
  /**
   * Erases *all* AsyncStorage for the domain.
   */
  clear: (e) => In(() => window.localStorage.clear(), e),
  /**
   * Gets *all* keys known to the app, for all callers, libraries, etc.
   */
  getAllKeys: (e) => In(() => {
    const t = window.localStorage.length, n = [];
    for (let r = 0; r < t; r += 1) {
      const o = window.localStorage.key(r) || "";
      n.push(o);
    }
    return n;
  }, e),
  /**
   * (stub) Flushes any pending requests using a single batch call to get the data.
   */
  flushGetRequests: () => {
  },
  /**
   * multiGet resolves to an array of key-value pair arrays that matches the
   * input format of multiSet.
   *
   *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
   */
  multiGet: (e, t) => {
    const n = e.map((o) => Qt.getItem(o));
    return mr(n, t, (o) => o.map((i, s) => [e[s], i]));
  },
  /**
   * Takes an array of key-value array pairs.
   *   multiSet([['k1', 'val1'], ['k2', 'val2']])
   */
  multiSet: (e, t) => {
    const n = e.map((r) => Qt.setItem(r[0], r[1]));
    return mr(n, t);
  },
  /**
   * Delete all the keys in the `keys` array.
   */
  multiRemove: (e, t) => {
    const n = e.map((r) => Qt.removeItem(r));
    return mr(n, t);
  },
  /**
   * Takes an array of key-value array pairs and merges them with existing
   * values, assuming they are stringified JSON.
   *
   *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
   */
  multiMerge: (e, t) => {
    const n = e.map((r) => Qt.mergeItem(r[0], r[1]));
    return mr(n, t);
  }
}, es = "cr_mwa_auth_token", xu = "cr_mwa_base64_address";
async function ti() {
  return Qt.getItem(es);
}
async function dy(e, t) {
  await Promise.all([
    Qt.setItem(es, e),
    Qt.setItem(xu, t)
  ]);
}
async function Uu() {
  await Promise.all([Qt.removeItem(es), Qt.removeItem(xu)]);
}
const fy = "Chainrails", hy = {
  "solana-mainnet": "solana:mainnet",
  "solana-devnet": "solana:devnet"
}, _y = /* @__PURE__ */ new Set(["solana:mainnet", "solana:devnet"]);
function Ry() {
  if (wt.OS !== "android")
    throw new Error("Mobile Wallet Adapter is only supported on Android.");
}
function Ey(e, t, n) {
  e.postToWebView({
    type: ot.SEND_TRANSACTION_RESULT,
    provider: "mwa",
    requestId: t,
    ...n
  });
}
function Or(e, t, n) {
  Ey(e, t, {
    error: `cr-error: ${n}`
  });
}
function py(e) {
  return e.chain && _y.has(e.chain) ? e.chain : e.chainId ? hy[e.chainId] ?? null : null;
}
function Ay(e) {
  if (Array.isArray(e))
    return new Uint8Array(e);
  if (typeof e == "string")
    return Lu(e);
  throw new Error("Invalid transaction bytes");
}
function gy(e) {
  try {
    return Jr.deserialize(e);
  } catch {
    return Jn.from(e);
  }
}
async function my(e, t, n) {
  try {
    Ry();
    const r = py(e);
    if (!r)
      return Or(n, t, "Requested chain is not supported."), null;
    if (!e.rpcUrl?.trim())
      return Or(n, t, "Missing Solana RPC URL."), null;
    const i = await ti();
    if (!i)
      return Or(n, t, "No connected Solana account."), null;
    const s = gy(Ay(e.transaction)), l = e.options;
    return await Qo(async (m) => {
      await m.authorize({
        auth_token: i,
        chain: r,
        identity: { name: n.client?.name?.trim() || fy }
      });
      const C = (await m.signAndSendTransactions({
        transactions: [s],
        ...l?.skipPreflight !== void 0 ? { skipPreflight: l.skipPreflight } : {},
        ...l?.maxRetries !== void 0 ? { maxRetries: l.maxRetries } : {},
        ...l?.commitment !== void 0 ? { commitment: l.commitment } : {}
      }))[0];
      if (!C)
        throw new Error("Wallet returned no transaction signature");
      return C;
    });
  } catch (r) {
    const o = r instanceof Error ? r.message : String(r);
    return Or(n, t, o), null;
  }
}
const Oy = "Chainrails", Sy = "Solana Wallet", Ny = "solana:mainnet";
function ts(e) {
  return e instanceof Error ? e.message : String(e);
}
function Du() {
  if (wt.OS !== "android")
    throw new Error("Mobile Wallet Adapter is only supported on Android.");
}
function yy(e) {
  return new le(Lu(e)).toBase58();
}
async function Ty(e, t) {
  const n = await ti(), r = await e.authorize({
    auth_token: n ?? void 0,
    chain: Ny,
    identity: { name: t.client?.name?.trim() || Oy }
  }), o = r.accounts[0];
  if (!o)
    throw new Error("Wallet returned no authorized account");
  return await dy(r.auth_token, o.address), {
    address: yy(o.address),
    walletName: Sy
  };
}
function Iy(e, t, n) {
  e.postToWebView({
    type: ot.CONNECTED,
    provider: "mwa",
    isConnected: !0,
    address: t,
    walletName: n
  });
}
function Mu(e, t) {
  e.postToWebView({
    type: ot.CONNECTED,
    provider: "mwa",
    isConnected: !1,
    address: null,
    walletName: null,
    error: t
  });
}
function yr(e, t) {
  e.postToWebView({
    type: ot.DISCONNECTED,
    provider: "mwa",
    isConnected: !1,
    address: null,
    walletName: null,
    ...t ? { error: t } : {}
  });
}
async function wy(e) {
  try {
    Du();
    const { address: t, walletName: n } = await Qo(async (r) => Ty(r, e));
    Iy(e, t, n);
  } catch (t) {
    Mu(e, ts(t));
  }
}
async function vy(e) {
  try {
    if (!await ti()) return;
    await Uu(), yr(e);
  } catch (t) {
    console.error("[mwa] reset session failed:", ts(t));
  }
}
function by(e) {
  Mu(e, "Connection cancelled");
}
async function Cy(e) {
  try {
    Du();
    const t = await ti();
    if (!t) {
      yr(e);
      return;
    }
    await Qo(async (n) => {
      await n.deauthorize({ auth_token: t });
    }), await Uu(), yr(e);
  } catch (t) {
    yr(e, ts(t));
  }
}
async function Ly(e, t, n) {
  const r = await my(t, n, e);
  r && e.postToWebView({
    type: ot.SEND_TRANSACTION_RESULT,
    provider: "mwa",
    requestId: n,
    signature: r
  });
}
function xy(e, t) {
  e.postToWebView({
    type: ot.SEND_TRANSACTION_RESULT,
    provider: "mwa",
    requestId: t,
    error: "cr-error: Transaction cancelled"
  });
}
const xa = "#171717", Uy = "#f0f0f0";
function Dy({
  visible: e,
  isDarkMode: t,
  accentColor: n,
  isBusy: r,
  title: o,
  confirmLabel: i,
  cancelLabel: s = "Cancel",
  onConfirm: l,
  onClose: f
}) {
  const m = vn(() => My(t, n), [t, n]);
  return e ? /* @__PURE__ */ Pe.createElement(un, { style: Wt.root, pointerEvents: "box-none" }, /* @__PURE__ */ Pe.createElement(un, { style: Wt.overlay }, /* @__PURE__ */ Pe.createElement(un, { style: m.card }, /* @__PURE__ */ Pe.createElement(Oi, { style: m.title }, o), /* @__PURE__ */ Pe.createElement(un, { style: Wt.actions }, /* @__PURE__ */ Pe.createElement(
    ps,
    {
      style: ({ pressed: y }) => [
        Wt.button,
        m.cancelButton,
        (r || y) && Wt.buttonPressed,
        r && Wt.buttonDisabled
      ],
      onPress: f,
      disabled: r
    },
    /* @__PURE__ */ Pe.createElement(Oi, { style: m.cancelLabel }, s)
  ), /* @__PURE__ */ Pe.createElement(
    ps,
    {
      style: ({ pressed: y }) => [
        Wt.button,
        m.confirmButton,
        (r || y) && Wt.buttonPressed,
        r && Wt.buttonDisabled
      ],
      onPress: l,
      disabled: r
    },
    /* @__PURE__ */ Pe.createElement(Oi, { style: m.confirmLabel }, i)
  ))))) : null;
}
function My(e, t) {
  const n = t || (e ? Uy : xa), r = e ? xa : "#ffffff";
  return jn.create({
    card: {
      marginHorizontal: 12,
      paddingVertical: 32,
      paddingHorizontal: 20,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: e ? "#202020" : "#e8e8e8",
      backgroundColor: e ? "#141414" : "#f8f8f8"
    },
    title: {
      marginBottom: 20,
      fontSize: 15,
      fontWeight: "500",
      lineHeight: 22,
      textAlign: "center",
      color: e ? "#fbfbfb" : "#494949"
    },
    cancelButton: {
      backgroundColor: e ? "#1f1f1f" : "#f2f2f2",
      borderWidth: e ? 1 : 0,
      borderColor: e ? "#202020" : "transparent"
    },
    cancelLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: e ? "#ffffff" : "#2f2f2f"
    },
    confirmButton: {
      backgroundColor: n
    },
    confirmLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: r
    }
  });
}
const Wt = jn.create({
  root: {
    ...jn.absoluteFillObject,
    zIndex: 10,
    elevation: 10
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12
  },
  buttonPressed: {
    opacity: 0.9
  },
  buttonDisabled: {
    opacity: 0.6
  }
});
function By(e) {
  return e.type === ot.REQUEST_CONNECT || e.type === ot.REQUEST_DISCONNECT;
}
function Py(e) {
  return e.type !== ot.REQUEST_SEND_TRANSACTION ? !1 : typeof e.requestId == "string" && !!e.params;
}
function $y({
  platformCtx: e,
  isOpen: t,
  isDarkMode: n,
  accentColor: r,
  request: o,
  onRequestHandled: i
}) {
  const [s, l] = at(!1), [f, m] = at(null), [y, C] = at(!1), [D, v] = at(null), M = Yt(() => {
    l(!1), m(null), C(!1), v(null), i();
  }, [i]);
  Ct(() => {
    t || (l(!1), m(null), C(!1), v(null));
  }, [t]), Ct(() => {
    if (!(!o || o.provider !== "mwa")) {
      if (Py(o)) {
        v({ requestId: o.requestId, params: o.params }), m("send"), l(!0);
        return;
      }
      if (o.type === ot.REQUEST_DEEP_LINK) {
        i();
        return;
      }
      if (!By(o)) {
        i();
        return;
      }
      if (o.type === ot.REQUEST_CONNECT) {
        v(null), C(!1), m("connect"), l(!0), vy(e);
        return;
      }
      m("disconnect"), l(!0);
    }
  }, [o, e, i]);
  const b = Yt(async () => {
    C(!0);
    try {
      await wy(e);
    } finally {
      M();
    }
  }, [e, M]), x = Yt(async () => {
    C(!0);
    try {
      await Cy(e);
    } finally {
      M();
    }
  }, [e, M]), q = Yt(async () => {
    if (D) {
      C(!0);
      try {
        await Ly(e, D.params, D.requestId);
      } finally {
        M();
      }
    }
  }, [e, D, M]), X = Yt(() => {
    f === "connect" ? by(e) : f === "send" && D && xy(e, D.requestId), M();
  }, [f, e, D, M]);
  if (!s || !f) return null;
  const H = f === "send" ? y ? "Approve in your wallet, or cancel to try again" : "Approve this payment in your wallet" : f === "disconnect" ? "Disconnect your Solana wallet?" : "Connect a wallet on Solana to continue", $ = f === "send" ? y ? "Waiting for wallet…" : "Open wallet" : f === "disconnect" ? y ? "Disconnecting…" : "Disconnect" : y ? "Connecting…" : "Connect wallet", K = f === "send" ? q : f === "disconnect" ? x : b;
  return /* @__PURE__ */ Pe.createElement(
    Dy,
    {
      visible: s,
      isDarkMode: n,
      accentColor: r,
      isBusy: y,
      title: H,
      confirmLabel: $,
      onConfirm: K,
      onClose: X
    }
  );
}
function ky() {
  return wt.OS !== "android" ? null : wt.constants ?? null;
}
function Fy(e) {
  return e.filter((t) => typeof t == "string" && t.length > 0).join(" ").toLowerCase();
}
function Bu() {
  const e = ky();
  if (!e) return !1;
  const t = Fy([
    e.Brand,
    e.Manufacturer,
    e.Model,
    e.Fingerprint,
    e.ServerHost
  ]);
  return t.length === 0 ? !1 : !!(t.includes("seeker") || t.includes("solana") && t.includes("mobile"));
}
function zy({ hasAmount: e = !1, theme: t = "system" }) {
  const n = Yu(), r = t === "system" ? n === "dark" : t === "dark", o = bn(new Ot.Value(0)).current, i = bn(new Ot.Value(4)).current, s = bn(new Ot.Value(1)).current;
  Ct(() => {
    Ot.sequence([
      Ot.delay(100),
      Ot.timing(o, {
        toValue: 1,
        duration: 300,
        easing: As.out(As.cubic),
        useNativeDriver: !0
      })
    ]).start(), Ot.sequence([
      Ot.delay(1850),
      Ot.timing(i, {
        toValue: 0,
        duration: 200,
        useNativeDriver: !0
      })
    ]).start();
    const f = Ot.loop(
      Ot.sequence([
        Ot.timing(s, {
          toValue: 0.5,
          duration: 750,
          useNativeDriver: !0
        }),
        Ot.timing(s, {
          toValue: 1,
          duration: 750,
          useNativeDriver: !0
        })
      ])
    );
    return f.start(), () => {
      f.stop();
    };
  }, []);
  const l = [
    cn.container,
    Bu() ? cn.containerSeeker : r ? cn.containerDark : cn.containerLight,
    // hasAmount ? styles.containerWithAmount : styles.containerNoAmount,
    cn.containerNoAmount
  ];
  return /* @__PURE__ */ Pe.createElement(un, { style: l }, /* @__PURE__ */ Pe.createElement(
    Ot.View,
    {
      style: [
        cn.loaderWrapper,
        {
          transform: [{ scale: o }],
          opacity: s
        }
      ]
    },
    /* @__PURE__ */ Pe.createElement(un, { style: cn.logoContainer }, /* @__PURE__ */ Pe.createElement(Vy, { isDark: r }))
  ));
}
function Vy({ isDark: e }) {
  return /* @__PURE__ */ Pe.createElement(
    un,
    {
      style: [cn.logo, { filter: e ? "invert(1)" : "invert(0)" }],
      accessibilityRole: "progressbar",
      "aria-label": "Loading payment"
    },
    /* @__PURE__ */ Pe.createElement(
      Xu,
      {
        width: 66,
        height: 66,
        crossOrigin: "anonymous",
        source: {
          uri: "https://res.cloudinary.com/du2uqkpsq/image/upload/v1776586593/Asset_2_1_yudke1.png"
        }
      }
    )
  );
}
const cn = jn.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  containerLight: {
    backgroundColor: "#f8f8f8"
  },
  containerDark: {
    backgroundColor: "#141414"
  },
  containerSeeker: {
    backgroundColor: "#0c1615"
  },
  containerNoAmount: {
    height: 280
  },
  containerWithAmount: {
    height: 350
  },
  loaderWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 66,
    height: 66,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2
  },
  leftLink: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center"
  },
  leftLinkInner: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  rightLink: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center"
  },
  rightLinkInner: {
    width: 10,
    height: 10,
    borderRadius: 5
  }
});
function Hy() {
  return wt.OS !== "android" ? !1 : Zu.get("SolanaMobileWalletAdapter") != null;
}
async function Gy() {
  const e = [];
  return Hy() && e.push("mwa"), e;
}
const Ky = /* @__PURE__ */ new Set([
  ot.REQUEST_CONNECT,
  ot.REQUEST_DISCONNECT,
  ot.REQUEST_SEND_TRANSACTION,
  ot.REQUEST_DEEP_LINK
]);
function Ua(e, t = {}) {
  return {
    provider: "mwa",
    type: e,
    ...t
  };
}
function qy(e) {
  if (!e || typeof e != "object") return null;
  const t = e, n = t.type;
  if (typeof n != "string" || !Ky.has(n))
    return null;
  const r = typeof t.requestId == "string" ? t.requestId : void 0, o = t.params;
  return typeof t.provider == "string" ? t.provider !== "mwa" ? null : Ua(n, { requestId: r, params: o }) : Ua(n, { requestId: r, params: o });
}
function Wy(e, t) {
  if (!e) return;
  const n = JSON.stringify(t);
  e.injectJavaScript(`
    (function() {
      try {
        var data = ${n};
        if (typeof window._cr_init === 'function') {
          window._cr_init({ data: data });
        }
        var event = new MessageEvent('message', { data: data });
        window.dispatchEvent(event);
        document.dispatchEvent(event);
      } catch (e) {
        console.error('[cr] failed to deliver host message', e);
      }
    })();
    true;
  `);
}
function jy(e) {
  if (e === "closed" || e === "completed") return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
const Yy = ["light", "dark", "system"], Xy = ["mailto:", "tel:", "sms:", "geo:", "wap:", "javascript:", "data:"], Zy = [
  // Phantom
  "phantom.com",
  "phantom.app",
  // MetaMask
  "link.metamask.io",
  "metamask.io",
  // Coinbase
  "keys.coinbase.com",
  "coinbase.com",
  "go.cb-w.com",
  "cb-w.com",
  // Binance
  "app.binance.com",
  "www.binance.com",
  "binance.com",
  // Trust Wallet
  "link.trustwallet.com",
  "trustwallet.com",
  // SafePal
  "universal.safepal.com",
  "safepal.com",
  // Rainbow
  "rainbow.me",
  "rainbow.app",
  // Zerion
  "zerion.io",
  // BitKeep
  "bitkeep.com",
  // Coin98
  "coin98.com",
  // Ledger
  "ledger.com",
  "ledger.live",
  // Rabby
  "rabby.io",
  // Frame
  "frame.io",
  // Keystone
  "keyst.one",
  // OneKey
  "onekey.so",
  // TokenPocket
  "tokenpocket.pro",
  // MathWallet
  "mathwallet.org",
  // AlphaWallet
  "alphawallet.com",
  // Frontier
  "frontier.xyz",
  // OKX
  "okx.com",
  "www.okx.com",
  // Bybit
  "bybit.com",
  "www.bybit.com",
  // Uniswap
  "uniswap.org",
  // ParaSwap
  "paraswap.io",
  // Yearn
  "yearn.finance",
  // Exodus
  "exodus.com",
  // Atomic
  "atomicwallet.io",
  // Crypto.com
  "crypto.com",
  // Huobi
  "www.huobi.com",
  // Bitget
  "web.bitget.com",
  "bitget.com",
  // Gate
  "www.gate.io",
  // MEXC
  "www.mexc.com",
  // Bitrue
  "bitrue.com",
  // Woo
  "woo.org",
  // Ramp services
  "onramp.money",
  "pay.fonbnk.com"
];
function Jy(e) {
  if (!e || typeof e != "string")
    return null;
  let t = e.trim();
  return t ? t.startsWith("://") || t.startsWith(":") ? (console.warn("Invalid URL scheme:", t), null) : (!t.includes("://") && !t.startsWith("mailto:") && !t.startsWith("tel:") && !t.startsWith("sms:") && !t.startsWith("intent:") && !t.startsWith("data:") && (t = "https://" + t), (t.includes(" ") || t.includes(`
`) || t.includes("	")) && (t = t.replace(/\s/g, "%20")), t) : null;
}
function Qy(e) {
  const t = Jy(e);
  if (!t)
    return console.warn("Invalid URL - could not normalize:", e), "block";
  const n = t;
  try {
    const r = new URL(n), o = r.protocol.toLowerCase(), i = r.hostname.toLowerCase();
    for (const s of Zy)
      if (i.toLowerCase() === s)
        return "external";
    if (o === "https:")
      return "allow";
    if (o === "http:")
      return i === "localhost" || i === "127.0.0.1" || i === "10.0.2.2" ? "allow" : "external";
    for (const s of Xy)
      if (o === s)
        return "external";
    return o === "intent:" || o.endsWith(":") ? "external" : "block";
  } catch (r) {
    return console.warn("Failed to parse URL, attempting external handle:", n, r), n.startsWith("intent://") || n.includes("://") && !n.startsWith("http") ? "external" : "block";
  }
}
function DT(e) {
  const {
    amount: t,
    styles: n,
    css: r,
    excludeChains: o,
    client: i,
    isOpen: s,
    isPending: l,
    close: f,
    onCancel: m,
    onSuccess: y,
    sessionToken: C,
    env: D,
    disableSeekerThemeAutoApply: v
  } = e, [M, b] = at(0), [x, q] = at(""), [X, H] = at(null), [$, K] = at(!1), [J, te] = at(!1), [re, j] = at(null), [k, P] = at(!1), W = bn(null), g = vn(
    () => ({
      webViewRef: W,
      postToWebView: (u) => Wy(W.current, u),
      client: i
    }),
    [i]
  ), a = vn(() => {
    const u = n?.theme;
    if (u) return u;
    if (!v)
      return Bu() ? _f : void 0;
  }, [n?.theme, v]), _ = vn(
    () => a ? { ...n, theme: a } : n,
    [n, a]
  );
  Ct(() => {
    const u = gs.addListener(
      wt.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => K(!0)
    ), E = gs.addListener(
      wt.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => K(!1)
    );
    return () => {
      u.remove(), E.remove();
    };
  }, []), Ct(() => {
    const u = a;
    if (u === "dark") {
      P(!0);
      return;
    }
    if (u === "light") {
      P(!1);
      return;
    }
    const E = () => P(ms.getColorScheme() === "dark");
    E();
    const T = ms.addChangeListener(E);
    return () => T.remove();
  }, [a]), Oe.config({
    api_key: "",
    // @ts-expect-error
    env: D === "internal" ? "internal" : "production"
  });
  const R = Yt((u) => {
    const { url: E } = u, T = E?.replace("trust://open_url", "https://link.trustwallet.com/open_url")?.replace("https://keys.coinbase.com", "https://go.cb-w.com")?.replace("phantom://", "https://phantom.app/")?.replace("rainbow://", "https://rainbow.me/")?.replace("zerion://", "https://zerion.io/")?.replace("bitkeep://", "https://bitkeep.com/")?.replace("coin98://", "https://coin98.com/")?.replace("ledger://", "https://ledger.com/")?.replace("rabby://", "https://rabby.io/")?.replace("frame://", "https://frame.io/")?.replace("keystone://", "https://keyst.one/")?.replace("onekey://", "https://onekey.so/")?.replace("tokenpocket://", "https://tokenpocket.pro/")?.replace("mathwallet://", "https://mathwallet.org/")?.replace("alphawallet://", "https://alphawallet.com/")?.replace("frontier://", "https://frontier.xyz/")?.replace("okx://", "https://okx.com/")?.replace("bybit://", "https://bybit.com/")?.replace("uniswap://", "https://uniswap.org/")?.replace("exodus://", "https://exodus.com/")?.replace("atomic://", "https://atomicwallet.io/")?.replace("crypto.com://", "https://crypto.com/")?.replace("huobi://", "https://www.huobi.com/")?.replace("gate://", "https://www.gate.io/")?.replace("mexc://", "https://www.mexc.com/")?.replace("bitrue://", "https://bitrue.com/")?.replace("woo://", "https://woo.org/");
    if (!T || T === "about:blank" || T.startsWith("data:"))
      return !0;
    const U = Qy(T);
    return U === "allow" ? !0 : U === "external" ? (Ju.openURL(T).catch((z) => {
      if (z && z.code === -1002 || z && z.message && z.message.includes("unsupported URL")) {
        if (console.warn("Unsupported URL scheme:", T), T.startsWith("intent://")) {
          const ee = T.match(/package=([^&]+)/);
          ee && console.warn("Intent URL for package:", ee[1]);
        }
      } else
        console.warn("Failed to open external URL:", T, z);
    }), !1) : (console.warn("Blocked navigation to:", T), !1);
  }, []);
  Ct(() => {
    q(Oe.getPayModalUrl(t));
  }, [t]), Ct(() => {
    const u = a;
    if (!u || Yy.includes(u)) {
      H(null);
      return;
    }
    let E = !1;
    return (async () => {
      try {
        const U = Oe.getBaseUrl(), z = await fetch(`${U}/themes/${u}`);
        if (!z.ok) return;
        const ee = await z.json();
        !E && ee.status === "approved" && ee.cssContent && H(ee.cssContent);
      } catch (U) {
        console.error("Failed to fetch theme:", U);
      }
    })(), () => {
      E = !0;
    };
  }, [a]);
  const N = Yt(
    (u) => {
      const E = jy(u.nativeEvent.data);
      if (E === ot.CLOSED || E === "closed") {
        f(), m?.();
        return;
      }
      if (E === ot.COMPLETED || E === "completed" || typeof E == "object" && E !== null && E.type === ot.COMPLETED) {
        setTimeout(f, 2e3);
        const z = typeof E == "object" && E !== null ? E.transactionHash : void 0;
        y?.(z ? { transactionHash: z } : void 0);
        return;
      }
      const U = qy(E);
      U?.provider === "mwa" && j(U);
    },
    [f, m, y]
  ), O = Yt(() => {
    j(null);
  }, []);
  function S(u) {
    return `
      (function() {
        const event = {
          data: ${JSON.stringify(u)}
        }
        window._cr_init(event)
      })();
    `;
  }
  Ct(() => {
    if (!C) return;
    let u = !1;
    return (async () => {
      const T = r || X || void 0, U = o?.map(Vl).join(","), z = await Gy(), ee = {
        type: "session",
        session_token: C,
        environment: Oe.getEnv() || vo.PRODUCTION,
        client: i,
        styles: _,
        props: {
          excludeChains: U,
          providers: z,
          isFarcasterMiniApp: !1
        },
        ...T ? { css: T } : {}
      };
      u || (W.current?.injectJavaScript(S(ee)), setTimeout(() => {
        u || W.current?.injectJavaScript(S(ee));
      }, 1e3));
    })(), () => {
      u = !0;
    };
  }, [C, M, s, _, X, o, r]);
  function w() {
    b(Math.random()), te(!0);
  }
  const A = M === 0 || l, c = a === "light" || a === "dark" || a === "system" ? a : "system";
  return /* @__PURE__ */ Pe.createElement(Qu, { visible: s, animationType: "fade", transparent: !0, onRequestClose: f }, /* @__PURE__ */ Pe.createElement(
    el,
    {
      behavior: wt.OS === "ios" ? "padding" : "height",
      style: Gn.keyboardAvoidingView,
      keyboardVerticalOffset: 0
    },
    /* @__PURE__ */ Pe.createElement(un, { style: Gn.container }, /* @__PURE__ */ Pe.createElement(zy, { hasAmount: !!t, theme: c }), /* @__PURE__ */ Pe.createElement(
      tl,
      {
        ref: W,
        source: { uri: x || Oe.getPayModalUrl("100") },
        onLoad: w,
        style: [Gn.webView, A ? Gn.invisible : Gn.visible],
        originWhitelist: ["*"],
        onMessage: N,
        onShouldStartLoadWithRequest: R,
        allowsInlineMediaPlayback: !0,
        mediaPlaybackRequiresUserAction: !0,
        startInLoadingState: !1,
        javaScriptEnabled: !0,
        domStorageEnabled: !0,
        scalesPageToFit: wt.OS === "ios",
        scrollEnabled: wt.OS === "ios" ? !$ : !1,
        bounces: wt.OS === "ios",
        overScrollMode: wt.OS === "ios" ? "always" : "never",
        mixedContentMode: "always",
        allowFileAccess: !1,
        keyboardDisplayRequiresUserAction: !1
      }
    ), /* @__PURE__ */ Pe.createElement(
      $y,
      {
        platformCtx: g,
        isOpen: s,
        isDarkMode: k,
        accentColor: n?.accentColor,
        request: re,
        onRequestHandled: O
      }
    ))
  ));
}
const Gn = jn.create({
  keyboardAvoidingView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.875)"
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent"
  },
  invisible: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
}), eT = Symbol(), ns = Symbol(), Kn = "a", Pu = "f", Da = "p", $u = "c", ku = "t", rs = "h", Wn = "w", is = "o", os = "k";
let tT = (e, t) => new Proxy(e, t);
const mo = Object.getPrototypeOf, Oo = /* @__PURE__ */ new WeakMap(), Fu = (e) => e && (Oo.has(e) ? Oo.get(e) : mo(e) === Object.prototype || mo(e) === Array.prototype), zr = (e) => typeof e == "object" && e !== null, nT = (e) => Object.values(Object.getOwnPropertyDescriptors(e)).some((t) => !t.configurable && !t.writable), rT = (e) => {
  if (Array.isArray(e))
    return Array.from(e);
  const t = Object.getOwnPropertyDescriptors(e);
  return Object.values(t).forEach((n) => {
    n.configurable = !0;
  }), Object.create(mo(e), t);
}, iT = (e, t) => {
  const n = {
    [Pu]: t
  };
  let r = !1;
  const o = (l, f) => {
    if (!r) {
      let m = n[Kn].get(e);
      if (m || (m = {}, n[Kn].set(e, m)), l === Wn)
        m[Wn] = !0;
      else {
        let y = m[l];
        y || (y = /* @__PURE__ */ new Set(), m[l] = y), y.add(f);
      }
    }
  }, i = () => {
    r = !0, n[Kn].delete(e);
  }, s = {
    get(l, f) {
      return f === ns ? e : (o(os, f), zu(Reflect.get(l, f), n[Kn], n[$u], n[ku]));
    },
    has(l, f) {
      return f === eT ? (i(), !0) : (o(rs, f), Reflect.has(l, f));
    },
    getOwnPropertyDescriptor(l, f) {
      return o(is, f), Reflect.getOwnPropertyDescriptor(l, f);
    },
    ownKeys(l) {
      return o(Wn), Reflect.ownKeys(l);
    }
  };
  return t && (s.set = s.deleteProperty = () => !1), [s, n];
}, ss = (e) => (
  // unwrap proxy
  e[ns] || // otherwise
  e
), zu = (e, t, n, r) => {
  if (!Fu(e))
    return e;
  let o = r && r.get(e);
  if (!o) {
    const f = ss(e);
    nT(f) ? o = [f, rT(f)] : o = [f], r?.set(e, o);
  }
  const [i, s] = o;
  let l = n && n.get(i);
  return (!l || l[1][Pu] !== !!s) && (l = iT(i, !!s), l[1][Da] = tT(s || i, l[0]), n && n.set(i, l)), l[1][Kn] = t, l[1][$u] = n, l[1][ku] = r, l[1][Da];
}, oT = (e, t) => {
  const n = Reflect.ownKeys(e), r = Reflect.ownKeys(t);
  return n.length !== r.length || n.some((o, i) => o !== r[i]);
}, Vu = (e, t, n, r, o = Object.is) => {
  if (o(e, t))
    return !1;
  if (!zr(e) || !zr(t))
    return !0;
  const i = n.get(ss(e));
  if (!i)
    return !0;
  if (r) {
    if (r.get(e) === t)
      return !1;
    r.set(e, t);
  }
  let s = null;
  for (const l of i[rs] || [])
    if (s = Reflect.has(e, l) !== Reflect.has(t, l), s)
      return s;
  if (i[Wn] === !0) {
    if (s = oT(e, t), s)
      return s;
  } else
    for (const l of i[is] || []) {
      const f = !!Reflect.getOwnPropertyDescriptor(e, l), m = !!Reflect.getOwnPropertyDescriptor(t, l);
      if (s = f !== m, s)
        return s;
    }
  for (const l of i[os] || [])
    if (s = Vu(e[l], t[l], n, r, o), s)
      return s;
  if (s === null)
    throw new Error("invalid used");
  return s;
}, sT = (e) => Fu(e) && e[ns] || null, Ma = (e, t = !0) => {
  Oo.set(e, t);
}, aT = (e, t, n) => {
  const r = [], o = /* @__PURE__ */ new WeakSet(), i = (s, l) => {
    var f, m, y;
    if (o.has(s))
      return;
    zr(s) && o.add(s);
    const C = zr(s) && t.get(ss(s));
    if (C) {
      if ((f = C[rs]) === null || f === void 0 || f.forEach((D) => {
        const v = `:has(${String(D)})`;
        r.push(l ? [...l, v] : [v]);
      }), C[Wn] === !0) {
        const D = ":ownKeys";
        r.push(l ? [...l, D] : [D]);
      } else
        (m = C[is]) === null || m === void 0 || m.forEach((D) => {
          const v = `:hasOwn(${String(D)})`;
          r.push(l ? [...l, v] : [v]);
        });
      (y = C[os]) === null || y === void 0 || y.forEach((D) => {
        "value" in (Object.getOwnPropertyDescriptor(s, D) || {}) && i(s[D], l ? [...l, D] : [D]);
      });
    } else l && r.push(l);
  };
  return i(e), r;
}, Vr = {}, as = (e) => typeof e == "object" && e !== null, cT = (e) => as(e) && !cs.has(e) && (Array.isArray(e) || !(Symbol.iterator in e)) && !(e instanceof WeakMap) && !(e instanceof WeakSet) && !(e instanceof Error) && !(e instanceof Number) && !(e instanceof Date) && !(e instanceof String) && !(e instanceof RegExp) && !(e instanceof ArrayBuffer) && !(e instanceof Promise), Hu = (e, t) => {
  const n = Ba.get(e);
  if (n?.[0] === t)
    return n[1];
  const r = Array.isArray(e) ? [] : Object.create(Object.getPrototypeOf(e));
  return Ma(r, !0), Ba.set(e, [t, r]), Reflect.ownKeys(e).forEach((o) => {
    if (Object.getOwnPropertyDescriptor(r, o))
      return;
    const i = Reflect.get(e, o), { enumerable: s } = Reflect.getOwnPropertyDescriptor(
      e,
      o
    ), l = {
      value: i,
      enumerable: s,
      // This is intentional to avoid copying with proxy-compare.
      // It's still non-writable, so it avoids assigning a value.
      configurable: !0
    };
    if (cs.has(i))
      Ma(i, !1);
    else if (pn.has(i)) {
      const [f, m] = pn.get(
        i
      );
      l.value = Hu(f, m());
    }
    Object.defineProperty(r, o, l);
  }), Object.preventExtensions(r);
}, uT = (e, t, n, r) => ({
  deleteProperty(o, i) {
    const s = Reflect.get(o, i);
    n(i);
    const l = Reflect.deleteProperty(o, i);
    return l && r(["delete", [i], s]), l;
  },
  set(o, i, s, l) {
    const f = !e() && Reflect.has(o, i), m = Reflect.get(o, i, l);
    if (f && (Pa(m, s) || Hr.has(s) && Pa(m, Hr.get(s))))
      return !0;
    n(i), as(s) && (s = sT(s) || s);
    const y = !pn.has(s) && dT(s) ? Gu(s) : s;
    return t(i, y), Reflect.set(o, i, y, l), r(["set", [i], s, m]), !0;
  }
}), pn = /* @__PURE__ */ new WeakMap(), cs = /* @__PURE__ */ new WeakSet(), Ba = /* @__PURE__ */ new WeakMap(), ro = [1], Hr = /* @__PURE__ */ new WeakMap();
let Pa = Object.is, lT = (e, t) => new Proxy(e, t), dT = cT, fT = Hu, hT = uT;
function Gu(e = {}) {
  if (!as(e))
    throw new Error("object required");
  const t = Hr.get(e);
  if (t)
    return t;
  let n = ro[0];
  const r = /* @__PURE__ */ new Set(), o = (x, q = ++ro[0]) => {
    n !== q && (i = n = q, r.forEach((X) => X(x, q)));
  };
  let i = n;
  const s = (x = ro[0]) => (i !== x && (i = x, f.forEach(([q]) => {
    const X = q[1](x);
    X > n && (n = X);
  })), n), l = (x) => (q, X) => {
    const H = [...q];
    H[1] = [x, ...H[1]], o(H, X);
  }, f = /* @__PURE__ */ new Map(), m = (x, q) => {
    const X = !cs.has(q) && pn.get(q);
    if (X) {
      if ((Vr ? "production" : void 0) !== "production" && f.has(x))
        throw new Error("prop listener already exists");
      if (r.size) {
        const H = X[2](l(x));
        f.set(x, [X, H]);
      } else
        f.set(x, [X]);
    }
  }, y = (x) => {
    var q;
    const X = f.get(x);
    X && (f.delete(x), (q = X[1]) == null || q.call(X));
  }, C = (x) => (r.add(x), r.size === 1 && f.forEach(([X, H], $) => {
    if ((Vr ? "production" : void 0) !== "production" && H)
      throw new Error("remove already exists");
    const K = X[2](l($));
    f.set($, [X, K]);
  }), () => {
    r.delete(x), r.size === 0 && f.forEach(([X, H], $) => {
      H && (H(), f.set($, [X]));
    });
  });
  let D = !0;
  const v = hT(
    () => D,
    m,
    y,
    o
  ), M = lT(e, v);
  Hr.set(e, M);
  const b = [e, s, C];
  return pn.set(M, b), Reflect.ownKeys(e).forEach((x) => {
    const q = Object.getOwnPropertyDescriptor(
      e,
      x
    );
    "value" in q && q.writable && (M[x] = e[x]);
  }), D = !1, M;
}
function _T(e, t, n) {
  const r = pn.get(e);
  (Vr ? "production" : void 0) !== "production" && !r && console.warn("Please use proxy object");
  let o;
  const i = [], s = r[2];
  let l = !1;
  const m = s((y) => {
    i.push(y), o || (o = Promise.resolve().then(() => {
      o = void 0, l && t(i.splice(0));
    }));
  });
  return l = !0, () => {
    l = !1, m();
  };
}
function $a(e) {
  const t = pn.get(e);
  (Vr ? "production" : void 0) !== "production" && !t && console.warn("Please use proxy object");
  const [n, r] = t;
  return fT(n, r());
}
const RT = {}, ET = (e, t) => {
  const n = bn(void 0);
  Ct(() => {
    n.current = aT(e, t);
  }), Wu(n.current);
}, pT = ET, AT = /* @__PURE__ */ new WeakMap();
function gT(e, t) {
  const r = vn(
    () => e && /* @__PURE__ */ new WeakMap(),
    [e]
  ), o = bn(void 0);
  let i = !0;
  const s = Ku(
    Yt(
      (f) => {
        const m = _T(e, f);
        return f(), m;
      },
      [e, void 0]
    ),
    () => {
      const f = $a(e);
      try {
        if (!i && o.current && !Vu(
          o.current,
          f,
          r,
          /* @__PURE__ */ new WeakMap()
        ))
          return o.current;
      } catch {
      }
      return f;
    },
    () => $a(e)
  );
  i = !1, qu(() => {
    o.current = s;
  }), (RT ? "production" : void 0) !== "production" && pT(s, r);
  const l = vn(() => /* @__PURE__ */ new WeakMap(), []);
  return zu(s, r, l, AT);
}
const an = Gu({
  data: null,
  isPending: !1,
  error: null
});
function MT({ session_url: e, onCancel: t, onSuccess: n }) {
  const r = gT(an), [o, i] = at(!1), [s, l] = at(Date.now()), f = r?.data?.sessionToken, m = r?.data?.amount;
  function y() {
    f || window.setTimeout(() => {
      f && i(!0);
    }, 200), i(!0);
  }
  function C() {
    i(!1);
  }
  const D = () => {
    const v = Date.now();
    an.isPending = !0, an.error = null, an.data = null, fetch(e, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((M) => M.json()).then((M) => {
      v < s || (an.data = M, an.isPending = !1, l(v));
    }).catch((M) => {
      v < s || (an.error = M?.toString(), an.isPending = !1, l(v), setInterval(D, 5e3));
    });
  };
  return Ct(() => {
    D();
  }, [e]), {
    sessionToken: f,
    amount: m,
    isOpen: o,
    session_url: e,
    open: y,
    close: C,
    isPending: r.isPending,
    error: r.error,
    refetch: D,
    onSuccess: n,
    onCancel: t
  };
}
function BT({
  sessionToken: e,
  amount: t,
  client: n,
  onCancel: r,
  onSuccess: o
}) {
  const [i, s] = at(!1), [l, f] = at(e), [m, y] = at(t), [C, D] = at(n);
  function v({ sessionToken: x, amount: q, client: X }) {
    f(x), y(q), D(X);
  }
  Ct(() => {
    f(e);
  }, [e]);
  function M() {
    l || window.setTimeout(() => {
      l && s(!0);
    }, 200), s(!0);
  }
  function b() {
    s(!1);
  }
  return {
    sessionToken: l,
    updateSession: v,
    amount: m,
    client: C,
    isOpen: i,
    open: M,
    close: b,
    onSuccess: o,
    onCancel: r
  };
}
export {
  Z as AmountSymbols,
  Oe as Chainrails,
  vT as Chains,
  DT as PaymentModal,
  zy as PaymentModalLoader,
  bT as crapi,
  BT as usePaymentModal,
  MT as usePaymentSession
};
