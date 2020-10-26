const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const { writeFileSync } = require('fs')
const { generateKeyPairSync } = require('crypto')

var argsRaw = process.argv
var args = argsRaw.slice(2, argsRaw.length)

switch (args[0]) {
    case '--decrypt': // --decrypt <file_to_decrypt> <path_to_priKey> <export_path>

        if (args[1] && args[2] && args[3]) {

            var decryptFilePath = path.resolve(args[1])
            var privateKeyPath = args[2]
            var exportPath = path.resolve(args[3])

            if (!fs.lstatSync(decryptFilePath).isFile()) return console.log('<file_to_decrypt> must be a valid path to a file')
            if (!fs.lstatSync(privateKeyPath).isFile()) return console.log('<path_to_priKey> must be a valid path to a private key pem file')
            if (!fs.lstatSync(exportPath).isDirectory()) return console.log('<export_path> must be a valid directory path')

            var fileExt = path.extname(decryptFilePath)
            var fileName = path.basename(decryptFilePath, fileExt)

            var output = decrypt(fs.readFileSync(decryptFilePath, 'utf-8'), privateKeyPath)

            fs.writeFile(`${exportPath}/${fileName}`, output, (err) => {
                if (!err) return console.log(`successfully decrypted!\nFile exportet to ${exportPath}`)
            })
        } else {
            return console.log('please use\n --decrypt <file_to_decrypt> <path_to_priKey> <export_path>')
        }

        break;

    case '--encrypt': // --encrypt <file_to_encrypt> <path_to_pubKey> <export_path>

        if (args[1] || args[2] || args[3]) {

            var encryptFilePath = path.resolve(args[1])
            var publicKeyPath = args[2]
            var exportPath = path.resolve(args[3])

            if (!fs.lstatSync(encryptFilePath).isFile()) return console.log('<file_to_encrypt> must be a valid path to a file')
            if (!fs.lstatSync(publicKeyPath).isFile()) return console.log('<path_to_pubKey> must be a valid path to a public key pem file')
            if (!fs.lstatSync(exportPath).isDirectory()) return console.log('<export_path> must be a valid directory path')


            var fileExt = path.extname(encryptFilePath)
            var fileName = path.basename(encryptFilePath, fileExt)

            var output = encrypt(fs.readFileSync(encryptFilePath, 'utf-8'), publicKeyPath)

            fs.writeFile(`${exportPath}/${fileName}${fileExt}.ec`, output, (err) => {
                if (!err) return console.log(`successfully encrypted!\nFile exportet to ${exportPath}`)
            })

        } else {
            return console.log('please use\n --encrypt <file_to_encrypt> <path_to_pubKey> <export_path>')
        }

        break;

    case '--genKeys': // --genKeys <export_path>
        if (args[1]) {
            var exportPath = path.resolve(args[1])
            if(!fs.lstatSync(exportPath).isDirectory()) return console.log('<export_path> must be a valid directory path')

            generateKeys(exportPath)

            return console.log(`key pare successfully creaed!\nFiles exportet to ${exportPath}`)
        }
        break;

    case '--help':
    default:
        var cmdsArray = [
            "--decrypt <file_to_decrypt> <path_to_priKey> <export_path>",
            "--encrypt <file_to_encrypt> <path_to_pubKey> <export_path>",
            "--genKeys <export_path>"
        ]

        console.log('How it works:')
        console.log('1. run the command "--genKeys <export_path>"')
        console.log('2. give the file publicKey.pem the other perosn ho will encrypt a file for you ')
        console.log('List of all commands:')

        cmdsArray.forEach(cmd => {
            console.log(` ${cmd}`)
        })
        return
        break;
}

function generateKeys(export_path) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: '',
        },
    })

    writeFileSync(`${export_path}/privateKey.pem`, privateKey)
    writeFileSync(`${export_path}/publicKey.pem`, publicKey)
}

function encrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey)
    const publicKey = fs.readFileSync(absolutePath, 'utf8')
    const buffer = Buffer.from(toEncrypt, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('base64')
}

function decrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
    const privateKey = fs.readFileSync(absolutePath, 'utf8')
    const buffer = Buffer.from(toDecrypt, 'base64')
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey.toString(),
            passphrase: '',
        },
        buffer,
    )
    return decrypted.toString('utf8')
}