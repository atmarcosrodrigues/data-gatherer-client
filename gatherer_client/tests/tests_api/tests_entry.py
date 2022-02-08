import requests
import os
from gatherer_client.api import entry
from gatherer_client.app import app
import ast

def test_create_delete_entry():
    with app.test_request_context():
        listing = entry.list_entries()
        listing_dict = ast.literal_eval(listing.get_data())#.get('entries') or None
        entries = listing_dict.get('data').get('entries') or None
        for item in entries:
            entry.delete_entry(item[u'_id'])
        payload = {'author': 'fulano',
                   'org': 'some-org',
                   'period_start': '05-08-1989',
                   'period_end': '20-08-1989',
                   'uploader': 'cicrano',
                   'title': 'my-title'
                }

        result = entry.create_entry(payload)

        assert result['data']['period_start'] == '05-08-1989'
        assert result['status'] == 'Ok'
        next_step_url = result['next_step']

        entry_id = result['data']['_id']
        payload.update({'org': 'new-org'})
        update_result = entry.update_entry(entry_id, payload)
        update_check = entry.show_entry_by_id(entry_id)
        assert update_check['org'] == 'new-org'
        assert update_check['status'] == 'MISSING_FILE'


        payload.update({'org': 'yet-another-org'})
        script_dir = os.path.dirname(__file__)
        rel_path = "test-files/update_file"
        abs_file_path = os.path.join(script_dir, rel_path)
        with open(abs_file_path, mode='rb') as update_file:
            payload.update({'file_to_upload': update_file})
            update_result = entry.update_entry(entry_id, payload)
            update_check = entry.show_entry_by_id(entry_id)
            assert update_check.get('file_metadata', None) != None
            assert update_check['org'] == 'yet-another-org'

        payload.update({'author': 'outro-autor'})
        abs_file_path = os.path.join(script_dir, 'test-files/first_temp_file')
        with open(abs_file_path, mode='rb') as first_temp_file:
            payload.update({'file_to_upload': first_temp_file})
            result = entry.create_entry(payload)
            assert result['status'] == 'Ok'
            assert result['data']['status'] == 'TO_INDEX'


        abs_file_path = os.path.join(script_dir, 'test-files/temp_file')
        with open(abs_file_path, mode='rb') as temp_file:
            upload_result = entry.upload_file(next_step_url, temp_file)
            assert upload_result.status_code == 200
            upload_result = entry.upload_file(next_step_url[:-1], temp_file)
            assert upload_result.status_code == 406

        listing = entry.list_entries()
        listing_dict = ast.literal_eval(listing.get_data())
        entries = listing_dict.get('data').get('entries')
        assert entries is not None
        first_entry = entries[0]
        second_entry = entries[1]
        assert 'outro-autor' in second_entry['author']
        assert 'fulano' in first_entry['author']

        search_list = entry.list_entries(search_params={'content': "content"})
        """
        This breaks the service broker
        search_list = entry.list_entries(search_params={'content': '--'})
        """
        search_list = entry.list_entries(search_params={'content': 'xx'})
        entry_by_id = entry.show_entry_by_id(entry_id)
        assert entry_by_id['author'] == 'fulano'

        search_list = entry.list_entries(search_params={'author': 'fulano'})
        listing_dict = ast.literal_eval(search_list.get_data())
        entries = listing_dict.get('data').get('entries')
        assert len(entries) == 1

        search_list = entry.list_entries(search_params={'author': 'outro-autor'})
        listing = entry.list_entries()
        listing_dict = ast.literal_eval(search_list.get_data())
        entries = listing_dict.get('data').get('entries')
        assert len(entries) == 1

        search_list = entry.list_entries(search_params={'author': 'inexistente'})
        listing = entry.list_entries()
        listing_dict = ast.literal_eval(search_list.get_data())
        entries = listing_dict.get('data').get('entries')
        assert len(entries) == 0

        delete_result = entry.delete_entry(entry_id)
        result = ast.literal_eval(delete_result.get_data())
        assert result['status'] == 'Ok'
        assert result['message'] == 'Entry deleted'

        delete_result = entry.delete_entry('invalid-id')
        result = ast.literal_eval(delete_result.get_data())
        assert result['status'] == 'Error'

        delete_result = entry.delete_entry(entry_id)
        result = ast.literal_eval(delete_result.get_data())
        assert result['status'] == 'Error'
        assert 'Entry not found' in result['message']
