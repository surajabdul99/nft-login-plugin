<?php

class Nft_Login_Util
{

    const ETHEREUM_CHAIN_ID = '0x1';
    const POLYGON_CHAIN_ID = '0x89';
    const TEZOS_CHAIN_ID = 'NetXnHfVqm9iesp';

    public function __construct()
    {
    }


    public function chain_id_to_name ($chain_id) {
        if ($chain_id == Nft_Login_Util::ETHEREUM_CHAIN_ID) {
            return 'Ethereum';
        } else if ($chain_id == Nft_Login_Util::POLYGON_CHAIN_ID) {
            return 'Polygon';
        } else if ($chain_id == Nft_Login_Util::TEZOS_CHAIN_ID) {
            return 'Tezos';
        } 
    }

    public function chain_id_to_scan_url ($chain_id) {
        if ($chain_id == Nft_Login_Util::ETHEREUM_CHAIN_ID) {
            return 'https://etherscan.io/token/';
        } else if ($chain_id == Nft_Login_Util::POLYGON_CHAIN_ID) {
            return 'https://polygonscan.com/token/';
        }
        else if ($chain_id == Nft_Login_Util::TEZOS_CHAIN_ID) {
            return 'https://api.tzstats.com/explorer/contract/';
        }
    }

    public function verify_contract_exists($address, $chain_id)
    {
        var_dump($chain_id);
        if ($chain_id == Nft_Login_Util::ETHEREUM_CHAIN_ID) {
            $node = 'https://cloudflare-eth.com';
        } else if ($chain_id == Nft_Login_Util::POLYGON_CHAIN_ID) {
            $node = 'https://polygon-rpc.com';
        } else if ($chain_id == Nft_Login_Util::TEZOS_CHAIN_ID) {
            $node = 'https://api.tzstats.com/explorer/contract/';
        }
        if ($chain_id == Nft_Login_Util::TEZOS_CHAIN_ID) {
// verify tezos here..
$tezosResponse = wp_remote_get($node.''.$address);	
$http_code = wp_remote_retrieve_response_code( $tezosResponse );
if ($http_code == 200){
     return true;
}
        } else {
            $response = wp_remote_post($node, array(
                'headers' => array('Content-Type' => 'application/json'),
                'body' => json_encode(array('jsonrpc' => '2.0',
                    'method' => 'eth_getCode',
                    'id' => 1,
                    'params' => array($address, "latest")
                )),
                'method' => 'POST',
                'data_format' => 'body',
            ));

            $body = json_decode($response['body']);
          
    
            if (isset($body->result) && $body->result != '0x' ) {
                return true;
            }
        }

        return false;
    }
}