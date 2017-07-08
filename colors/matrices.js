
function vecDot(a, b) {
    var ret = 0;
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
    for (var i = 0; i < m[0].length; i++) {
        ret.push(m[i][col]);
    }
    return ret;
}

function matMul(a, b) {
    const n = a[0].length;
    const ret = [];
    for (let y = 0; y < n; y++) {
        const row = [];
        for (let x = 0; x < n; x++) {
            const val = vecDot(matRow(a, y), matCol(b, x));
            row.push(val);
        }
        ret.push(row);
    }
    return ret;
}

function matMulVec(a, b) {
    const n = a[0].length;
    const ret = [];
    for (let y = 0; y < n; y++) {
        ret.push(vecDot(a[y], b));
    }
    return ret;
}

function matAdd(a, b) {
    const n = a[0].length;
    const ret = [];
    for (let y = 0; y < n; y++) {
        const row = [];
        for (let x = 0; x < n; x++) {
            const val = a[y][x] + b[y][x];
            row.push(val);
        }
        ret.push(row);
    }
    return ret;
}

function matNeg(a) {
    const n = a[0].length;
    const ret = [];
    for (let y = 0; y < n; y++) {
        const row = [];
        for (let x = 0; x < n; x++) {
            const val = -a[y][x];
            row.push(val);
        }
        ret.push(row);
    }
    return ret;
}

function matDet(m) {
    const n = m[0].length;
    if (n == 1)
        return m[0][0];

    let ret = 0;
    for (let x = 0; x < n; x++) {
        const cofact = matCofactor(m, x, 0);
        ret += m[0][x]*cofact;
    }
    return ret;
}

function matString(m) {
    const rows = [];
    const n = m[0].length;
    for (let i = 0; i < n; i++) {
        const row = matRow(m, i);
        const format = function(x) {
            let str = x.toFixed(5);
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
    const minorMat = matMinorMat(m, X, Y);
    const minor = matDet(minorMat);
    let cofactor = minor;
    if ((X+Y) % 2 == 1) {
        cofactor *= -1;
    }
    return cofactor;
}

function matScale(m, k) {
    const n = m[0].length;
    const ret = [];
    for (let y = 0; y < n; y++) {
        const row = [];
        for (let x = 0; x < n; x++) {
            row.push(m[y][x] * k);
        }
        ret.push(row);
    }
    return ret;
}

function matComatrix(m) {
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

function matInv(m) {
    const det = matDet(m);
    //console.log('matDet', det);
    const comat = matComatrix(m);
    //console.log('comat', matString(comat));
    const adj = matTrans(comat);
    //console.log('adj', matString(adj));
    const inv = matScale(adj, 1/det);
    //console.log('inv', matString(inv));
    return inv;
}
