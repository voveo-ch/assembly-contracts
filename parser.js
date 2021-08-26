const localpath = "./build/contracts";

const { Console } = require("console");
const fs = require("fs");
const path = require("path");

console.log("Into the parser");

module.exports = async (network) => {
  console.log("Starting the Parser");
  fs.readdir(localpath, (err, files) => {
    const artifactsDir = __dirname + "/artifacts/" + `${network}`;
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir);
    }

    files.forEach((file) => {
      const filePath = path.resolve(__dirname, `${localpath}/${file}`);
      const fileContent = JSON.parse(fs.readFileSync(filePath));

      try {
        const contractName = fileContent.contractName;
        const abi = fileContent.abi;
        const bytecode = fileContent.bytecode;

        fs.writeFile(
          `${artifactsDir}/${contractName}.json`,
          `{ "bytecode" : "${bytecode}","abi" : ${JSON.stringify(abi)}}
            `,
          (err) => err ? Console.warn("Error", err) : -1
        );
      } catch (error) {
        Console.warn("Invalid");
      }
    });
  });

  console.log("Done Parsing");
};
