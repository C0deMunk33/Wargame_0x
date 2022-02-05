const Migrations = artifacts.require("Migrations");
const War_Core_3 = artifacts.require("War_Core_3");
const Unit_Tokens = artifacts.require("Unit_Tokens");

module.exports = async function (deployer) {
  await deployer.deploy(Migrations);
  let ipfs_asset_deployment_cid = "[CID GOES HERE]"
  let unit_token_instance = await deployer.deploy(Unit_Tokens, "ipfs:"+ ipfs_asset_deployment_cid +"/\{id\}/metadata.json");
  await deployer.deploy(War_Core_3, unit_token_instance.address);
};
