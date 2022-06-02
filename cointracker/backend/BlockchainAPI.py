import requests


class BlockchainAPI(object):

    def get_transaction(self, address, base_url='https://blockchain.info/rawaddr/'):
        """
        get transactions for an account (max 50 due to API limit)

        :param address: user account address
        :param base_url: blockchain.com API base
        :return:
        """
        response = requests.get(base_url + address)
        result = response.json()

        if 'error' in result:
            raise ValueError(result['error'])

        return result

    def get_balance(self, address, base_url='https://blockchain.info/balance?active='):
        """
        get balance for an account

        :param address: user account address
        :param base_url: blockchain.com API base
        :return: float
        """
        response = requests.get(base_url + address)
        result = response.json()
        balance = result[address]['final_balance'] / (10**8)

        if 'error' in result:
            raise ValueError(result['error'])

        return balance
