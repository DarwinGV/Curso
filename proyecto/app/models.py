from app.database import get_db

class Pedidos:
    
    def __init__(self, id_pedido=None, Nombre=None, Apellido=None, email=None, Mueble=None, fecha_entrega=None, Color=None):
        self.id_pedido = id_pedido
        self.Nombre = Nombre
        self.Apellido = Apellido
        self.email = email
        self.Mueble = Mueble
        self.fecha_entrega = fecha_entrega
        self.Color = Color

    def save(self): 
        db = get_db() 
        cursor = db.cursor()
        if self.id_pedido:
            cursor.execute("""
                UPDATE pedidos SET Nombre = %s, Apellido = %s, email = %s, Mueble = %s, fecha_entrega = %s, Color = %s
                WHERE id_pedido = %s
            """, (self.Nombre, self.Apellido, self.email, self.Mueble, self.fecha_entrega, self.Color, self.id_pedido))
        else: 
            cursor.execute("""
                INSERT INTO pedidos (Nombre, Apellido, email, Mueble, fecha_entrega, Color) VALUES (%s, %s, %s, %s, %s, %s)
            """, (self.Nombre, self.Apellido, self.email, self.Mueble, self.fecha_entrega, self.Color))
            self.id_pedido = cursor.lastrowid
        db.commit() 
        cursor.close()

    @staticmethod 
    def get_all(): 
        try:
            db = get_db() 
            cursor = db.cursor() 
            cursor.execute("SELECT * FROM pedidos") 
            rows = cursor.fetchall()
            pedidos = [Pedidos(id_pedido=row[0], Nombre=row[1], Apellido=row[2], email=row[3], Mueble=row[4], fecha_entrega=row[5], Color=row[6]) for row in rows] 
            cursor.close() 
            return pedidos
        except Exception as e:
            print(f"Error al obtener todos los pedidos: {e}")
            return []

    @staticmethod
    def get_by_id(id_pedido):
        try:
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT * FROM pedidos WHERE id_pedido = %s", (id_pedido,)) 
            row = cursor.fetchone() 
            cursor.close()
            if row:
                return Pedidos(id_pedido=row[0], Nombre=row[1], Apellido=row[2], email=row[3], Mueble=row[4], fecha_entrega=row[5], Color=row[6])
            return None
        except Exception as e:
            print(f"Error al obtener pedido por ID: {e}")
            return None

    def delete(self):
        try:
            db = get_db()
            cursor = db.cursor()
            cursor.execute("DELETE FROM pedidos WHERE id_pedido = %s", (self.id_pedido,)) 
            db.commit()
            cursor.close()
        except Exception as e:
            print(f"Error al eliminar pedido: {e}")

    def serialize(self): 
        return {
            'id_pedido': self.id_pedido,
            'Nombre': self.Nombre,
            'Apellido': self.Apellido,
            'email': self.email,
            'Mueble': self.Mueble,
            'fecha_entrega': self.fecha_entrega.strftime('%Y-%m-%d'),
            'Color': self.Color,
        }


