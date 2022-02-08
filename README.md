# service-broker

This is a web service for data gathering, proxying and caching.

It provides a simple way to make data available and easily providing them through an extensible API. It is plugin oriented, developed to be a data aggregator as much as a broker between the frontend and other data providers. It offer an API complaint with Cloud Foundry, so it can be deployed as a service broker in this PaaS.

This project provides a web api to connect the  Data Gatherer Server. 
This project provides a web front end client to store, insert, edit, delete and search data files in Data  Gatherer Server.


![Service Broker](https://i.ibb.co/y4sQSzc/service-broker-graph.png)

## Data Gatherer

Provides an API to make data available by receiving spreadsheets and any other documents with a simple metadata and remotely storing them. Once created, it possible to execute queries and retrieve the original or parsed content. Parsed contents are available only for some formats (xls and xlsx), you can retrieve the content as json or the original format.

You can see how it is handled at: [DataGathering.java]() 

## OpenData Plugins

Routes configurable /opendata/* requests to previously implemented plugins. These plugins can retrieve data from other sites, aggregating and formatting them to store in a local database or storage to speed up future accesses.

Requests are handled by: [OpenData.java]()

More information at our [wiki]()
