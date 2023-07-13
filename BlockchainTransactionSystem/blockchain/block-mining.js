const crypto = require('crypto');

const SHA256 = message => crypto.createHash("sha256").update(message).digest('hex');

class Block {
  #timestamp;
  #prevBlockHash;
  #prevBlockId;
  #blockId;
  #transaction;
  #blockHash;

constructor(timestamp, prevBlockId, prevBlockHash, transaction = {accountWallet, recipient, amount}) {
  this.#timestamp = timestamp;
  this.#prevBlockHash = prevBlockHash;
  this.#prevBlockId = prevBlockId;
  this.#blockId = ++prevBlockId;
  this.#transaction = transaction;
  this.#blockHash = this.getHash();
}
get timestamp(){return this.#timestamp;}

get prevBlockHash(){return this.#prevBlockHash;}

get prevBlockId(){return this.#prevBlockId;}

get blockId(){return this.#blockId;}

get transaction(){return this.#transaction;}

get blockHash(){return this.#blockHash}

// The mining function
getHash() {
  let nonce = 0;
  let hash = "";

  const startTime = process.hrtime();

  while (hash.substring(0, 3) !== "000") { // Continue looping until the hash substring from index 0 to 2 is equal to "000" (Modify to increase or decrease the mining difficulty)
    nonce++;
    hash = SHA256(
      this.#prevBlockHash +
      this.#timestamp +
      this.#blockId +
      JSON.stringify(this.#transaction) +
      nonce.toString()
    );
  }
  const endTime = process.hrtime(startTime);
  const durationSeconds = endTime[0] + endTime[1] / 1e9;
  console.log(`Mining time: ${durationSeconds.toFixed(2)} sec`);

  return hash;
} 

}

module.exports = Block;