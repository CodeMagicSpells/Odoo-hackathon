from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Cart, Purchase

purchases_bp = Blueprint("purchases", __name__)

@purchases_bp.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    if not cart_items:
        return jsonify({"error": "Cart is empty"}), 400

    for item in cart_items:
        purchase = Purchase(user_id=user_id, product_id=item.product_id)
        db.session.add(purchase)
        db.session.delete(item)

    db.session.commit()
    return jsonify({"message": "Checkout successful!"})

@purchases_bp.route("/history", methods=["GET"])
@jwt_required()
def purchase_history():
    user_id = get_jwt_identity()
    purchases = Purchase.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "purchase_id": p.id,
        "product_id": p.product_id,
        "purchased_at": p.purchased_at
    } for p in purchases])
