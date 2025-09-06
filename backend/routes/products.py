from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Product

products_bp = Blueprint("products", __name__)

@products_bp.route("/", methods=["GET"])
def get_products():
    category = request.args.get("category")
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    products = query.all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "price": p.price,
        "category": p.category,
        "image_url": p.image_url
    } for p in products])

@products_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    data = request.get_json()

    new_product = Product(
        user_id=user_id,
        title=data["title"],
        description=data["description"],
        category=data["category"],
        price=data["price"],
        image_url=data.get("image_url")
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product created successfully!"}), 201

@products_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):
    user_id = get_jwt_identity()
    product = Product.query.get_or_404(id)

    if product.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    product.title = data.get("title", product.title)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.category = data.get("category", product.category)
    product.image_url = data.get("image_url", product.image_url)

    db.session.commit()
    return jsonify({"message": "Product updated successfully!"})

@products_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    user_id = get_jwt_identity()
    product = Product.query.get_or_404(id)

    if product.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully!"})
