#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import json
from flask.json import jsonify

ENDPOINT = "http://caterpie.cloud.citta.org.br:6060/data"
ENDPOINT_1 = "http://blastoise.cloud.citta.org.br:6060/data"

def create_entry(kwargs):
    payload = _create_entry_payload(kwargs)
    file_name = kwargs.get('file_name', None)
    file_content = kwargs.get('file_content', None)
    if not file_content:
        result = requests.post(ENDPOINT, data=payload)
    else:
        files = {file_name: file_content}
        result = requests.post(ENDPOINT, data=payload, files=files)
    result_return = result.json()

    entry_id = result_return.get('data').get('_id')
    upload_path = '{endpoint}/upload/{id}'.format(endpoint=ENDPOINT, id=entry_id)

    result_return.update({"next_step": upload_path})
    result_return.update({'status_code': result.status_code})

    return result_return


def delete_entry(_id):
    url_request = '{endpoint}/{id}'.format(endpoint=ENDPOINT, id=_id)
    result = requests.delete(url_request)
    return jsonify(result.json())

def update_entry(entry_id, payload):
    url_request = '{endpoint}/{id}'.format(endpoint=ENDPOINT, id=entry_id)
    file_to_upload = payload.get('file_to_upload', None)
    if not file_to_upload:
        update_result = requests.put(url_request, data=payload)
    else:
        files = {'datafile': file_to_upload}
        update_result = requests.put(url_request, data=payload, files=files)

    return update_result.json()

def upload_file(url, file_to_upload):
    upload_result = requests.post(url, files=dict(datafile=file_to_upload))
    return upload_result
	

def create_entry_file(title, author, org, uploader, period_start, period_end, data_file):
    # FIXME: should be using a form
	url_request = '{endpoint}/{id}'.format(endpoint=ENDPOINT, id=_id)
	result = requests.delete(url_request).text

	return result


def put_entry(_id, kwargs):
	payload = _create_entry_payload(kwargs)
	url_request = '{endpoint}/{id}'.format(endpoint=ENDPOINT, id=_id)
	result = requests.put(url_request, json=payload)
	result_return = result.json()

	upload_path = '{endpoint}/{id}'.format(endpoint=ENDPOINT, id=_id)
	result_return.update({"next_step": upload_path})
	result_return.update({'status_code': result.status_code})

	return result_return


def create_entry_file(args, data_file):
	title = args.get('title')
	author = args.get('author')
	org = args.get('org')
	uploader = args.get('uploader')
	period_start = args.get('period_start')
	period_end = args.get('period_start')

	url_request = "{endpoint}?title={title}&author={author}&org={org}&uploader={uploader}&period_start={period_start}&period_end={period_end}".format(endpoint=ENDPOINT, title=title, author=author, org=org, uploader=uploader, period_start=period_start, period_end=period_end)
	response = requests.post(url_request, files=dict(datafile=data_file))

	return response.text


def put_entry_file(_id, data_file):
	url_request = "{endpoint}/upload/{_id}".format(endpoint=ENDPOINT, _id=_id)
        files = {'datafile': data_file}
	#files = {file_name: file_content}

	response = requests.put(url_request, files=files)
	
	return response.text 

def _create_entry_payload(kwargs):
    data = kwargs
    payload = {}

    author = data.get("author", None)
    title = data.get("title", None)
    org = data.get("org", None)
    period_start = data.get("period_start", None)
    period_end = data.get("period_end", None)
    uploader = data.get("uploader", None)
    datafile = data.get("datafile", None)

    if title:
        payload.update({"title": title})
    if author:
        payload.update({"author": author})
    if org:
        payload.update({"org": org})
    if period_start:
        payload.update({"period_start": period_start})
    if period_end:
        payload.update({"period_end": period_end})
    if uploader:
        payload.update({"uploader": uploader})
    if datafile:
        payload.update({"datafile": uploader})


    return payload

def list_entries(page=0, limit=500, order='ASC', order_by='created_at',search_params=None):
    request_url = '{0}?page={1}&limit={2}&order={3}&order_by={4}'.format(ENDPOINT, page, limit, order, order_by)
    additional_params = ''
    if search_params:
        for key in search_params:
            if search_params[key] != None:
                additional_params += '&' + key + '=' + search_params[key]
        request_url += additional_params
    print request_url
    r = requests.get(request_url)
    #print r.json()
    if 'data' in r.json():
        return jsonify(r.json()) #r.json()['data']
    return jsonify({data:'not found', status:404})

def show_entry_by_id(id):
    r = requests.get(ENDPOINT+"/"+id)
    if 'data' in r.json():
        return r.json()['data']
    return r


