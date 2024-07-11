from flask import Flask
from app.database import init_app
from app.views import *
from flask_cors import CORS

app = Flask(__name__)

init_app(app)

CORS(app)

app.route('/', methods=['GET'])(index)
app.route('/api/pedidos/', methods=['POST'])(create_pedido)
app.route('/api/pedidos/', methods=['GET'])(get_all_pedidos)
app.route('/api/pedidos/<int:id_pedido>', methods=['GET'])(get_pedido)
app.route('/api/pedidos/<int:id_pedido>', methods=['PUT'])(update_pedido)
app.route('/api/pedidos/<int:id_pedido>', methods=['DELETE'])(delete_pedido)

if __name__ == '__main__': 
    app.run(debug=True)
