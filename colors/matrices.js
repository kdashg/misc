
function vecDot(a, b) {
    var ret = 0;
    if (a.length !== b.length) throw new Error(`${a.length} !== ${b.length}`);
    for (var i = 0; i < a.length; i++) {
        ret += a[i]*b[i];
    }
    return ret;
}

function matRow(m, row) {
    return m[row];
}

function matCol(m, col) {
    let ret = [];
    for (var i = 0; i < m.length; i++) {
        ret.push(m[i][col]);
    }
    return ret;
}

function matMul(a, b) {
    const ret = [];
    for (let y = 0; y < a.length; y++) {
        const row = [];
        for (let x = 0; x < b[0].length; x++) {
            const val = vecDot(matRow(a, y), matCol(b, x));
            row.push(val);
        }
        ret.push(row);
    }
    return ret;
}

function matMulVec(a, b) {
    b = [b];
    b = matTrans(b);
    return matMul(a, b);
}

function matAdd(a, b) {
    if (a.length !== b.length) throw new Error(`${a.length} !== ${b.length}`);
    const ret = [];
    for (let y = 0; y < a.length; y++) {
        if (a[y].length !== b[y].length) throw new Error(`${a[y].length} !== ${b[y].length}`);
        const row = [];
        for (let x = 0; x < a[y].length; x++) {
            const val = a[y][x] + b[y][x];
            row.push(val);
        }
        ret.push(row);
    }
    return ret;
}

function matNeg(a) {
    const ret = [];
    for (let y = 0; y < a.length; y++) {
        const row = [];
        for (let x = 0; x < a[y].length; x++) {
            const val = -a[y][x];
            row.push(val);
        }
        ret.push(row);
    }
    return ret;
}

function matDet(m) {
    if (m.length === 1) {
        if (m[0].length !== m.length) throw new Error(`${m[0].length} !== ${m.length}`);
        return m[0][0];
    }

    let ret = 0;
    for (let x = 0; x < m.length; x++) {
        if (m[x].length !== m.length) throw new Error(`${m[x].length} !== ${m.length}`);
        const cofact = matCofactor(m, x, 0);
        ret += m[0][x]*cofact;
    }
    return ret;
}

function matString(m, precision) {
    precision = precision || 5;
    const rows = [];
    for (let i = 0; i < m.length; i++) {
        if (m[i].length !== m[0].length) throw new Error(`${m[i].length} !== ${m[0].length}`);
        const row = matRow(m, i);
        const format = function(x) {
            let str = x.toFixed(precision);
            if (str[0] != '-')
                str = ' ' + str;
            return str;
        };
        const rowStrs = row.map(format);
        const rowStr = rowStrs.join(',');
        rows.push(rowStr);
    }
    const rowsStr = '[' + rows.join(',\n ') + ' ]';
    return rowsStr;
}

function matTrans(m) {
    const n = m[0].length;
    const ret = [];
    for (let i = 0; i < n; i++) {
        ret.push(matCol(m, i));
    }
    return ret;
}

function matMinorMat(m, X, Y) {
    if (m[0].length !== m.length) throw new Error(`${m[0].length} !== ${m.length}`);
    const n = m[0].length;
    const ret = [];
    for (let y = 0; y < n; y++) {
        if (y == Y)
            continue;

        const row = [];
        for (let x = 0; x < n; x++) {
            if (x == X)
                continue;

            row.push(m[y][x]);
        }
        ret.push(row);
    }
    return ret;
}

function matCofactor(m, X, Y) {
    if (m[0].length !== m.length) throw new Error(`${m[0].length} !== ${m.length}`);
    const minorMat = matMinorMat(m, X, Y);
    const minor = matDet(minorMat);
    let cofactor = minor;
    if ((X+Y) % 2 == 1) {
        cofactor *= -1;
    }
    return cofactor;
}

function matScale(m, k) {
    const ret = [];
    for (let y = 0; y < m.length; y++) {
        const row = [];
        for (let x = 0; x < m[y].length; x++) {
            row.push(m[y][x] * k);
        }
        ret.push(row);
    }
    return ret;
}

function matComatrix(m) {
    if (m[0].length !== m.length) throw new Error(`${m[0].length} !== ${m.length}`);
    const n = m[0].length;
    const ret = [];
    for (let y = 0; y < n; y++) {
        const row = [];
        for (let x = 0; x < n; x++) {
            row.push(matCofactor(m, x, y));
        }
        ret.push(row);
    }
    return ret;
}

function matInv(A) {
    const rows = A.length;
    const cols = A[0].length;
    if (cols === rows + 1) {
        // Affine inverse.
        let b = matCol(A, cols-1);
        const B = A.map(r => r.slice(0, rows));
        const ret = matInv(B);
        const bPrime = matMulVec(ret, b);
        for (let y = 0; y < rows; y++) {
            ret[y].push(-bPrime[y]);
        }
        return ret;
    }

    const det = matDet(A);
    //console.log('matDet', det);
    const comat = matComatrix(A);
    //console.log('comat', matString(comat));
    const adj = matTrans(comat);
    //console.log('adj', matString(adj));
    const inv = matScale(adj, 1/det);
    //console.log('inv', matString(inv));
    return inv;
}

function matIdent(m_rows, n_cols) {
    n_cols = n_cols || m_rows;

    const ret = [];
    for (let y = 0; y < m_rows; y++) {
        const row = [];
        for (let x = 0; x < n_cols; x++) {
            let val = 0;
            if (x == y) {
                val = 1;
            }
            row.push(val);
        }
        ret.push(row);
    }
    return ret;
}

function matResized(A, m_rows, n_cols) {
    const ret = matIdent(m_rows, n_cols);
    for (let y = 0; y < Math.min(A.length, ret.length); y++) {
        for (let x = 0; x < Math.min(A[y].length, ret[y].length); x++) {
            ret[y][x] = A[y][x];
        }
    }
    return ret;
}
