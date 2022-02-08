#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask
from flask import render_template, send_from_directory
from flask import request, url_for
from flask import jsonify

import requests
import ast

from gatherer_client.api import entry

"""[summary]
	Start Gatheer Client Flask Application
"""
app = Flask('gatherer-client', static_url_path='')
app = Flask(__name__.split('.')[0])


"""[summary]
	Define main route to index file html template

Returns:
	[template]: html template
"""
@app.route('/')
def index():
    return render_template('index.html') 

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)


"""[summary]
	Define entry method to get, post, put and delete data files

Returns:
	[json]: Data stored in data gatherer server
"""
@app.route('/entry', methods=['GET'], defaults={'id_parameter': None})
@app.route('/entry/<string:id_parameter>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def create_list_entry(id_parameter=None):
	if request.method == 'GET':
		if id_parameter:
			result = entry.show_entry_by_id(id_parameter)
			return result
                else:
                        page = request.args['page']
                        limit = request.args['limit']
                        print page, limit
                        result = entry.list_entries(page=page, limit=limit)
                        #if len(result) == 0:
                        #    return 'not found', 404
                        return result
	elif request.method == 'DELETE':
		if id_parameter:
			result = entry.delete_entry(id_parameter)
			return result
	elif request.method == 'PUT':
		if id_parameter:
			data = request.json
			put_result = entry.update_entry(id_parameter, data)
			return  jsonify(put_result)

@app.route('/search', methods=['GET'])
def search_data():
	page = request.args['page']
	limit = request.args['limit']
	
	data = {}

	data.update({'author': request.args.get('author', None)})
	data.update({'uploader': request.args.get('uploader', None)})
	data.update({'title': request.args.get('title', None)})
	data.update({'org': request.args.get('org', None)})
	data.update({'period_start': request.args.get('period_start', None)})
	data.update({'period_end': request.args.get('period_end', None)})

	print page, limit
	result = entry.list_entries(page=page, limit=limit, search_params=data)
	return result

@app.route('/create_entry', methods=['POST'])
def create_entry():
    form = request.form
    data = {}
    data.update({'author': form.get('author', None)})
    data.update({'uploader': form.get('uploader', None)})
    data.update({'title': form.get('title', None)})
    data.update({'org': form.get('org', None)})
    data.update({'period_start': form.get('period_start', None)})
    data.update({'period_end': form.get('period_end', None)})
    data.update({'file_name': form.get('file_name', None)})
    data.update({'file_content': form.get('file_content', None)})
    creation_result = entry.create_entry(data)
    return jsonify(creation_result), creation_result.get('status_code')


@app.route('/create_entry_file', methods=['POST'])
def create_entry_file():
	data_file = request.form['datafile']
	response = entry.create_entry_file(request.args, data_file)
	return response

@app.route('/put_entry_file/<string:id_parameter>', methods=['PUT'])
def put_entry_file(id_parameter):
	data_file = request.form['datafile']
	response = entry.put_entry_file(id_parameter, data_file)
	return response


@app.route('/data/', methods=['GET'])
def get_entries():
    parameters = request.json
    page = parameters.get('page', None)
    limit = parameters.get('limit', None)
    order = parameters.get('order', None)
    order_by = parameters.get('order_by', None)

    response = entry.get_data(page, limit, order, order_by)
    return response
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
