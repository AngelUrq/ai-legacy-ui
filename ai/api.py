from flask import Flask, request
from flask_cors import CORS, cross_origin
from sentence_transformers import SentenceTransformer

import json

model = SentenceTransformer('all-mpnet-base-v2')

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods=['GET', 'POST'])
@cross_origin()
def get_embedding():
    if request.method == 'POST':
        query =  json.loads(request.data)['query']
        embedding = model.encode(query)
        response = json.dumps(list(embedding.astype(float)), separators=(',', ':'))

        return response
