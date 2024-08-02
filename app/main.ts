import * as zlib from 'zlib'
import * as fs from 'fs';
import * as crypto from 'crypto'

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
    Init = "init",
    CatFile = 'cat-file',
    HashObject='hash-object'
}

switch (command) {
    case Commands.Init:{
        // You can use print statements as follows for debugging, they'll be visible when running tests.
        console.log("Logs from your program will appear here!");

        //Uncomment this block to pass the first stage
        fs.mkdirSync(".git", { recursive: true });
        fs.mkdirSync(".git/objects", { recursive: true });
        fs.mkdirSync(".git/refs", { recursive: true });
        fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
        console.log("Initialized git directory");
        break;
    }
    case Commands.CatFile:{
        const blobDir = args[2].substring(0, 2);
        const blobFile = args[2].substring(2);
        const blob = fs.readFileSync(`.git/objects/${blobDir}/${blobFile}`);
        const decompressedBuffer = zlib.unzipSync(blob);
        const nullByteIndex = decompressedBuffer.indexOf(0);
        const blobContent = decompressedBuffer.subarray(nullByteIndex + 1).toString();
        process.stdout.write(blobContent);
        break;
    }

    case Commands.HashObject:{
        const fileName = args[2];
        const data = fs.readFileSync(fileName);
        const blobContent = Buffer.from(`blob ${data.length}\0${data}`);
        const hash = crypto.createHash('sha1').update(blobContent).digest('hex');
        const compressedData = zlib.deflateSync(blobContent);
        const objectPath = `.git/objects/${hash.slice(0, 2)}/${hash.slice(2)}`;
        fs.mkdirSync(`.git/objects/${hash.slice(0, 2)}`, { recursive: true });
        fs.writeFileSync(objectPath, compressedData);
        break;
    }
    default:
        throw new Error(`Unknown command ${command}`);
}
