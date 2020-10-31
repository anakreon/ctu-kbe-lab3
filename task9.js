
export const getXorKey = (plaintext, base64hashed) => {
    const bufferObj = Buffer.from(base64hashed, "base64");
    const decodedHash = bufferObj.toString("utf8");
    if (plaintext.length !== decodedHash.length) {
        throw "length mismatch!";
    }
    let key = '';
    for (var i = 0; i < plaintext.length; ++i) {
        const plainkey = plaintext.charCodeAt(i);
        const hashkey = decodedHash.charCodeAt(i);
        key += parseInt(plainkey ^ hashkey, 10).toString(16);
    }
    return key;
} 
