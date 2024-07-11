from flask import jsonify, request
from app.models import Pedidos

def index():
    return jsonify({'message': 'Welcome to the M.C contact form'})

def create_pedido(): 
    try:
        data = request.json
        nuevo_pedido = Pedidos(Nombre=data['Nombre'], Apellido=data['Apellido'], email=data['email'], Mueble=data['Mueble'], fecha_entrega=data['fecha_entrega'], Color=data['Color'])
        nuevo_pedido.save()
        return jsonify({'message': 'Pedido creado exitosamente'}), 201
    except Exception as e:
        return jsonify({'message': f'Error al crear el pedido: {str(e)}'}), 400

def get_all_pedidos():
    try:
        pedidos = Pedidos.get_all()
        return jsonify([pedido.serialize() for pedido in pedidos])
    except Exception as e:
        return jsonify({'message': f'Error al obtener todos los pedidos: {str(e)}'}), 500

def get_pedido(id_pedido):
    try:
        pedido = Pedidos.get_by_id(id_pedido)
        if not pedido:
            return jsonify({'message': 'Pedido no encontrado en la base de datos'}), 404
        return jsonify(pedido.serialize())
    except Exception as e:
        return jsonify({'message': f'Error al obtener el pedido: {str(e)}'}), 500

def update_pedido(id_pedido): 
    try:
        pedido = Pedidos.get_by_id(id_pedido)
        if not pedido:
            return jsonify({'message': 'Pedido no encontrado en la base de datos'}), 404
        data = request.json
        pedido.Nombre = data['Nombre']
        pedido.Apellido = data['Apellido']
        pedido.email = data['email']
        pedido.Mueble = data['Mueble']
        pedido.fecha_entrega = data['fecha_entrega']
        pedido.Color = data['Color']
        pedido.save()
        return jsonify({'message': 'Pedido actualizado exitosamente'})
    except Exception as e:
        return jsonify({'message': f'Error al actualizar el pedido: {str(e)}'}), 400

def delete_pedido(id_pedido):
    try:
        pedido = Pedidos.get_by_id(id_pedido)
        if not pedido:
            return jsonify({'message': 'Pedido no encontrado en la base de datos'}), 404
        pedido.delete()
        return jsonify({'message': 'Pedido eliminado exitosamente'})
    except Exception as e:
        return jsonify({'message': f'Error al eliminar el pedido: {str(e)}'}), 500
