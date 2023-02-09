const EXTRA = [-2147483648, 8388608, 32768, 128];

const SHIFT = [24, 16, 8, 0];

export class Sha1 {

    public start = 0;
    public bytes = 0;
    public hBytes = 0;

    public finalized = false;
    public hashed = false;

    public lastByteIndex: number = 0;

    public block = 0;
    public blocks = new Array(17).fill(0);

    public h = new Uint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);

    public hash() {
        let a = this.h[0];
        let b = this.h[1];
        let c = this.h[2];
        let d = this.h[3];
        let e = this.h[4];
        var f, j, t, blocks = this.blocks;

        for (j = 16; j < 80; ++j) {
            t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
            blocks[j] = (t << 1) | (t >>> 31);
        }

        for (j = 0; j < 20; j += 5) {
            f = (b & c) | ((~b) & d);
            t = (a << 5) | (a >>> 27);
            e = t + f + e + 1518500249 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = (a & b) | ((~a) & c);
            t = (e << 5) | (e >>> 27);
            d = t + f + d + 1518500249 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = (e & a) | ((~e) & b);
            t = (d << 5) | (d >>> 27);
            c = t + f + c + 1518500249 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = (d & e) | ((~d) & a);
            t = (c << 5) | (c >>> 27);
            b = t + f + b + 1518500249 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = (c & d) | ((~c) & e);
            t = (b << 5) | (b >>> 27);
            a = t + f + a + 1518500249 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for (; j < 40; j += 5) {
            f = b ^ c ^ d;
            t = (a << 5) | (a >>> 27);
            e = t + f + e + 1859775393 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = a ^ b ^ c;
            t = (e << 5) | (e >>> 27);
            d = t + f + d + 1859775393 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = e ^ a ^ b;
            t = (d << 5) | (d >>> 27);
            c = t + f + c + 1859775393 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = d ^ e ^ a;
            t = (c << 5) | (c >>> 27);
            b = t + f + b + 1859775393 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = c ^ d ^ e;
            t = (b << 5) | (b >>> 27);
            a = t + f + a + 1859775393 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for (; j < 60; j += 5) {
            f = (b & c) | (b & d) | (c & d);
            t = (a << 5) | (a >>> 27);
            e = t + f + e - 1894007588 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = (a & b) | (a & c) | (b & c);
            t = (e << 5) | (e >>> 27);
            d = t + f + d - 1894007588 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = (e & a) | (e & b) | (a & b);
            t = (d << 5) | (d >>> 27);
            c = t + f + c - 1894007588 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = (d & e) | (d & a) | (e & a);
            t = (c << 5) | (c >>> 27);
            b = t + f + b - 1894007588 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = (c & d) | (c & e) | (d & e);
            t = (b << 5) | (b >>> 27);
            a = t + f + a - 1894007588 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for (; j < 80; j += 5) {
            f = b ^ c ^ d;
            t = (a << 5) | (a >>> 27);
            e = t + f + e - 899497514 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = a ^ b ^ c;
            t = (e << 5) | (e >>> 27);
            d = t + f + d - 899497514 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = e ^ a ^ b;
            t = (d << 5) | (d >>> 27);
            c = t + f + c - 899497514 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = d ^ e ^ a;
            t = (c << 5) | (c >>> 27);
            b = t + f + b - 899497514 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = c ^ d ^ e;
            t = (b << 5) | (b >>> 27);
            a = t + f + a - 899497514 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        this.h[0] += a;
        this.h[1] += b;
        this.h[2] += c;
        this.h[3] += d;
        this.h[4] += e;
    }

    public update(bytes: Uint8Array) {
        if (this.finalized) {
            return;
        }

        const nBytes = bytes.length;
        const blocks = this.blocks;
        let ptr = 0;
        let i = 0;

        while (ptr < nBytes) {
            if (this.hashed) {
                this.hashed = false;
                blocks[0] = this.block;
                blocks.fill(0);
            }

            for (i = this.start; ptr < nBytes && i < 64; ++ptr) {
                blocks[i >> 2] |= bytes[ptr] << SHIFT[i++ & 3];
            }

            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
                this.block = blocks[16];
                this.start = i - 64;
                this.hash();
                this.hashed = true;
            } else {
                this.start = i;
            }
        }

        if (this.bytes > 4294967295) {
            this.hBytes += this.bytes / 4294967296 << 0;
            this.bytes = this.bytes % 4294967296;
        }

        return this;
    }

    public finalize() {
        if (this.finalized) {
            return;
        }
        this.finalized = true;
        var blocks = this.blocks, i = this.lastByteIndex;
        blocks[16] = this.block;
        blocks[i >> 2] |= EXTRA[i & 3];
        this.block = blocks[16];
        if (i >= 56) {
            if (!this.hashed) {
                this.hash();
            }
            blocks[0] = this.block;
            blocks.fill(0);
        }
        blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
        blocks[15] = this.bytes << 3;
        this.hash();
    }

    public digest() {
        this.finalize();
        const b = new Uint8Array(this.h.byteLength);
        for (let i = 0, ptr = 0; i < this.h.length; i++, ptr += 4) {
            const chunk = this.h[i];
            b[ptr + 0] = (chunk >> 24) & 0xff;
            b[ptr + 1] = (chunk >> 16) & 0xff;
            b[ptr + 2] = (chunk >> 8) & 0xff;
            b[ptr + 3] = chunk & 0xff;
        }
        return b;
    }

    public hexDigest() {
        this.finalize();
        return this.h.reduce((hex, chunk) => hex + chunk.toString(16).padStart(8, '0'), '')
    }

    public toString() {
        return this.hexDigest();
    }
}