from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

atk_data = [
    {"id": 1, "nama": "Pulpen Gel Hitam", "jenis": "Alat Tulis", "qty": 20},
    {"id": 2, "nama": "Kertas HVS A4", "jenis": "Kertas", "qty": 50}
]

last_id = 2

@app.route("/api/atk", methods=["GET"])
def get_all_atk():
    return jsonify(atk_data), 200

@app.route("/api/atk", methods=["POST"])
def create_atk():
    global last_id
    data = request.json

    if data["qty"] <= 0:
        return jsonify({"error": "Qty harus lebih dari 0"}), 400

    last_id += 1
    new_item = {
        "id": last_id,
        "nama": data["nama"],
        "jenis": data["jenis"],
        "qty": data["qty"]
    }

    atk_data.append(new_item)
    return jsonify(new_item), 201

@app.route("/api/atk/<int:item_id>", methods=["GET"])
def get_atk(item_id):
    for item in atk_data:
        if item["id"] == item_id:
            return jsonify(item), 200
    return jsonify({"error": "Item tidak ditemukan"}), 404

@app.route("/api/atk/<int:item_id>", methods=["PUT"])
def update_atk(item_id):
    data = request.json

    for item in atk_data:
        if item["id"] == item_id:
            if "qty" in data and data["qty"] <= 0:
                return jsonify({"error": "Qty harus lebih dari 0"}), 400
            item["nama"] = data.get("nama", item["nama"])
            item["jenis"] = data.get("jenis", item["jenis"])
            item["qty"] = data.get("qty", item["qty"])
            return jsonify(item), 200

    return jsonify({"error": "Item tidak ditemukan"}), 404

@app.route("/api/atk/<int:item_id>", methods=["DELETE"])
def delete_atk(item_id):
    global atk_data
    for item in atk_data:
        if item["id"] == item_id:
            atk_data = [i for i in atk_data if i["id"] != item_id]
            return jsonify({"message": "Item berhasil dihapus"}), 200
    return jsonify({"error": "Item tidak ditemukan"}), 404

if __name__ == "__main__":
    app.run(debug=True)
