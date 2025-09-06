from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Cart, Product

cart_bp = Blueprint("cart", __name__)

@cart_bp.route("/", methods=["GET"])
@jwt_required()
def view_cart():
    user_id = get_jwt_identity()
    items = Cart.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "cart_id": item.id,
        "product_id": item.product_id
    } for item in items])

@cart_bp.route("/", methods=["POST"])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get("product_id")

    if not Product.query.get(product_id):
        return jsonify({"error": "Product not found"}), 404

    cart_item = Cart(user_id=user_id, product_id=product_id)
    db.session.add(cart_item)
    db.session.commit()
    return jsonify({"message": "Product added to cart!"}), 201

@cart_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def remove_from_cart(id):
    user_id = get_jwt_identity()
    item = Cart.query.get_or_404(id)

    if item.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Product removed from cart!"})
