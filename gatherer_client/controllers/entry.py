import requests

ENDPOINT = 'http://caterpie.cloud.citta.org.br:6060' #'http://10.0.0.112:9000'
def list_entries(parameters=None, endpoint=ENDPOINT):
    result = requests.get(endpoint + '/data')
    return result.text


def show_entry_by_id(id_parameter, endpoint=ENDPOINT):
    result = requests.get(endpoint + '/data/' + id_parameter)
    print result
    print result.json
    return result.text
