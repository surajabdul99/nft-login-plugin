var NFTLOGIN = (function () {
  var nftlogin = {};

  var tokenABI = [
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  var statusElem = document.getElementById("nftlogin_status");

  function set_status(color, message) {
    if (color) {
      statusElem.style.color = color;
    }
    statusElem.innerHTML = message;
  }

  nftlogin.connect_wallet = async function nftlogin_connect_wallet() {
    const Web3Modal = window.Web3Modal.default;
    const WalletConnectProvider = window.WalletConnectProvider.default;

    const providerOptions = {
      /* See Provider Options Section */
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "5901345316dc4c3eaa66ac2c45f8a25f", // required
        },
      },
    };

    const web3Modal = new Web3Modal({
      providerOptions,
    });

    try {
      provider = await web3Modal.connect();
      return provider;
    } catch (e) {
      console.log("Unable to get a wallet connection", e);
      set_status("red", "Unable to get a wallet connection");
      return false;
    }
  };

  nftlogin.connect_and_verify = async function nftlogin_connect_and_verify(
    addressOfContract,
    submitForm,
    chainId,
    chainName
  ) {
    console.log("testing", submitForm);

    set_status(null, "");

    var statusElem = document.getElementById("nftlogin_status");
    statusElem.innerHTML = "";
    var addressElem = document.getElementById("nftlogin_address");
    addressElem.value = "";
    var tokenIdElem = document.getElementById("nftlogin_token_id");
    tokenIdElem.value = "";
    var address = "";
    var userWalletAddress = ""
    //    Initiate DAppClient
    const dAppClient = new beacon.DAppClient({
      name: "NFT Login", // Name of the DApp,
      preferredNetwork: beacon.NetworkType.DELPHINET,
    });
    // Check if we are connected. If not, do a permission request first.
    const activeAccount = await dAppClient.getActiveAccount();
    if (!activeAccount) {
      const permissions = await dAppClient.requestPermissions();
      console.log("New connection:", permissions.address);
      let myAddress = permissions.address;
      // for testing purposes use tz1eCYp6E1yZL8zqdF7zPSC3UVYubFJHDuVF
      // Address that has the 
      
      userWalletAddress = permissions.address;
    } else {
      let myAddress = activeAccount.address;
      userWalletAddress = activeAccount.address
    }
    var testAddress = "tz1eCYp6E1yZL8zqdF7zPSC3UVYubFJHDuVF"
    var notOwner = "tz1Rgrva5Jian91STmzkErjKxAptg5sV5joa"
    // make call to better-call API to check if user has an nft containing the set nft address
    // https://api.better-call.dev/v1/account/mainnet/${testAddress}/token_balances
    
    fetch(
      `https://api.tzkt.io/v1/tokens/balances?account.eq=${notOwner}&token.contract.eq=${addressOfContract}`
    )
      .then((response) => response.json())
      .then((data) => {
          console.log("dataa", data)
        if(data.length > 0){
            console.log("yes in", data);
            tokenIdElem.value = data[0].token.tokenId;
            set_status("green", "Verified owner of token " + data[0].token.tokenId);
            addressElem.value = data[0].account.address
            console.log("value", data[0].account.address)
        } else {
            set_status("red", "Connected address does not own token");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (submitForm) {
          document.getElementById(submitForm).submit();
          return;
        }
      });
  };

  return nftlogin;
})();
