# crypton-cli

### first steps:<br>
- `git clone https://github.com/NikiNikOfficially/crypton-cli.git`
- `cd crypton-cli` cd to cloned repo
- `npm i` install node packages from *package.json* file
- now you can use *crypton-cli*

### Command list:<br>
##### `--genKeys <exportPath>`
- `<exportPath>` \<string\> path to folder wehre the keys will be saved

##### `--encrypt <clearFile> <publicKeyPath> <exportPath>`
- `clearFile` \<string\> path to the file to be encrypted
- `privateKeyPath` \<string\>  path to *publicKey.pem*
- `exportPath` \<string\> Path to output directory, the encrypted file will be saved there

##### `--decrypt <encryptedFile> <privateKeyPath> <exportPath>`
- `encryptedFile` \<string\> Path to the encrypted file
- `privateKeyPath` \<string\> path to *privateKey.pem*
- `exportPath` \<string\> Path to output directory, the decrypted file will be saved there
