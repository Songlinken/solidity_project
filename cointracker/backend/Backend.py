from flask import Flask
from BlockchainAPI import BlockchainAPI

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World'


@app.route('/get/balance/<string:address>/')
def get_balance(address):
    return str(BlockchainAPI().get_balance(address))


@app.route('/get/trans/<string:address>/')
def get_transaction(address):
    return str(BlockchainAPI().get_transaction(address))


if __name__ == '__main__':
    app.run()
