---
sidebar_position: 8
title: "Using FHIR Repository Connector"
description: Fast Healthcare Interoperability Resources (FHIR) is an interoperability standard for electronic exchange of healthcare information.
---

# Using FHIR Repository Connector

Fast Healthcare Interoperability Resources (FHIR) is an interoperability standard for electronic exchange of healthcare information. The WSO2 FHIR Repository connector can be used to seamlessly integrate with a FHIR repository of your choice.

:::note
These guides use [Ballerina](https://ballerina.io/), a language designed for integration and network services, to build healthcare integrations as microservices.
:::


The Ballerina FHIR client will allow the users to interact with a FHIR server. The client supports all the standard interactions specified in the FHIR specification.

The following example demonstrates how to use the FHIR Repository client to interact with a FHIR server.

## Step 1: Set Up Ballerina

Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

## Step 2: Implement the logic to connect to the FHIR Repository

1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.

    ```bash
    $ bal new fhir_repository_client_sample
    ```

2. Import the required modules to the Ballerina program. In this sample, we are using the FHIR R4 module to interact with the FHIR server. Therefore, we need to import the `ballerinax/health.clients.fhir` package.

    ```ballerina
    import ballerinax/health.clients.fhir;
    import ballerina/io;
    ```
3. Implement the logic to connect to the FHIR Repository. In this sample, we are connecting to a HAPI Public FHIR server using the FHIR Repository client.

    ```ballerina
    import ballerinax/health.clients.fhir;
    import ballerina/io;

    // Define the FHIR server connection configuration. If your server requires authentication, you can configure 
    // it using the `authConfig` field.
    fhir:FHIRConnectorConfig fhirServerConfig = {
        baseURL: "https://hapi.fhir.org/baseR4",
        mimeType: fhir:FHIR_JSON
    };

    // Create a new FHIR connector using the configuration.
    fhir:FHIRConnector fhirConnector = check new (fhirServerConfig);

    public function main4() returns error? {
        // Search for a patient with the name "homer". You can provide additional search parameters as a map.
        // There are other client operations available in the FHIR connector, such as `create`, `update`, `delete` etc.
        fhir:FHIRResponse|fhir:FHIRError response = fhirConnector->search("Patient", {"name": "homer"});
        if response is fhir:FHIRResponse {
            io:println("response status code: ", response.httpStatusCode);
            io:println("response content: ", response.'resource);
        }
    }        
    ```
## Step 3: Run the Ballerina Program

Run the Ballerina program using the following command:

    ```bash
    $ bal run
    ```

## Operations

### Instance Level Interactions

:::note Get FHIR resource by ID
This method will allow the user to retrieve fhir resources by specifying the resource ID and type

| Method name     | getById                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
|                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource                                                                  |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
|                 | *summary* - to specify the subset of the resource content to be [returned](https://www.hl7.org/fhir/search.html#summary:~:text=3.1.1.5.8-,Summary,-The%20client%20can).                                                                  |
| Returns         | Requested FHIR resource in specified format \| operationOutcome                                                                                  |
| Server endpoint | [Read](https://www.hl7.org/fhir/http.html#read) operation                                                                                                                                   |

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError response = fhirConnector->getById("Patient", "1");
```

:::
:::note Get version specific FHIR resource by ID
This method will allow the user to retrieve version specific fhir resources by specifying the resource ID and type.

| Method name     | getByVersion                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
|                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource    
|                 | *version* - FHIR version specific identifier                                                              |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
|                 | *summary* - to specify the subset of the resource content to be [returned](https://www.hl7.org/fhir/search.html#summary:~:text=3.1.1.5.8-,Summary,-The%20client%20can).                                                                  |
| Returns         | Requested version specific FHIR resource in specified format \| operationOutcome                                                                                  |
| Server endpoint | [vread](https://www.hl7.org/fhir/http.html#vread) operation                                                                                                                                   |

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError response = fhirConnector->getByVersion("Patient", "1", "1");
```

:::
:::note Update FHIR resource
This method will allow the user to create a new current version for an existing resource, and if the resource doesn’t exist an initial version of the resource will be created. This method can be used when the  user wants to specify their own id instead of the server assigning the resource Id.

| Method name     | update                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *data* - resource data                                                            |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
|                 | returnPreference - specifies what the return response should [contain](https://www.hl7.org/fhir/http.html#return:~:text=3.1.0.1.8%20create/update/patch/transaction) default - return full resource?                                                                  |
| Returns         | Returns the updated resource \| operationOutcome                                                                                  |
| Server endpoint | [Update](https://www.hl7.org/fhir/http.html#update) operation                                                                                                                                   |

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->update({"resourceType": "Patient", "id": "example"});
```

:::
:::note Patch FHIR resource
This method will allow the user to create a new current version for an existing resource by updating part of the resource.For we only support [FHIRPath Patch](https://hl7.org/FHIR/fhirpatch.html), the remaining content types will be supported in the future releases.

| Method name     | getByVersion                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
|                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource    
|                 | *data* - resource data                                                             |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
|                 | returnPreference - specifies what the return response should [contain](https://www.hl7.org/fhir/http.html#return:~:text=3.1.0.1.8%20create/update/patch/transaction) default - return full resource?                                                                  |
| Returns         | Returns the patched resource \| operationOutcome                                                                                  |
| Server endpoint | [Patch](https://www.hl7.org/fhir/http.html#patch) operation                                                                                                                                   | 

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->patch("Patient","123", {"resourceType": "Patient", "id": "1", "active": true});
```

:::
:::note Delete FHIR resource
This method will allow the user to delete an existing resource.

| Method name     | delete                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
|                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource    
| Returns         | nothing \| operationOutcome                                                                                  |
| Server endpoint | [Delete](https://www.hl7.org/fhir/http.html#delete) operation                                                                                                                                   | 

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->delete("Patient","123");
```

:::
:::note Retrieve history of a FHIR resource
This method will allow the user to retrieve the change history for a particular resource.

| Method name     | getByVersion                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
|                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource    
|                 | *Parameters* - history search parameters (i.e count, since, at)                                                            |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
|                 | uriParameters - additional [params](https://www.hl7.org/fhir/http.html#history:~:text=_format%20parameter%2C%20the-,parameters,-to%20this%20interaction) as a name value map |
| Returns         | Requesed histories \| operationOutcomee                                                                                  |
| Server endpoint | [History](https://www.hl7.org/fhir/http.html#history) operation                                                                                                                                   |   

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->getInstanceHistory("Patient", "123");
```

:::
### Type Level Interactions

:::note Create FHIR resource
This method will allow the user to create a  new for a specified type. Here the user doesn't have control over the resource ID, it will be assigned by the server.

| Method name     | create                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *data* - resource data                                                                                             |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
|                 | *returnPreference* - specifies what the return response should [contain](https://www.hl7.org/fhir/http.html#return:~:text=3.1.0.1.8%20create/update/patch/transaction) default = minimal |
| Returns         | Returns the created resource \| operationOutcome                                                                                  |
| Server endpoint | [Create](https://www.hl7.org/fhir/http.html#create) operation                                                                                                                                   | 

**sample usage**
```ballerina
    fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->create(
        {
            "resourceType": "Patient",
            "name": [{"family": "Simpson", "given": ["Homer"]}]
        }
    );
```

:::
:::note Search resources on a given type
This method will allow the user to search all resources of a particular type by defining search parameters.

| Method name     | search                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *type* - The name of a resource type (e.g. "Patient")
|                 | *searchParams* - this will be a map of user defined name value pairs (once search parameter records are implemented the map will be replaced.) |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
| Returns         | Search response \| operationOutcome                                                                                  |
| Server endpoint | [Search](https://www.hl7.org/fhir/http.html#search) operation   |

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->search("Patient", {"id": "123"});
```

:::
:::note Retrieve history of a resource type
This method will allow the user to retrieve the change history for a particular resource type.

| Method name     | getHistory                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *type* - The name of a resource type (e.g. "Patient")
|                 | *Parameters* - history search parameters (i.e count, since, at) |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
| Returns         | Requesed histories \| operationOutcome                                                                                  |
| Server endpoint | [History](https://www.hl7.org/fhir/http.html#history) operation   |

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->getHistory("Patient", {"_count": "10"});
```

:::
### System Level Interactions

:::note Get server capabilities
This method will allow the user to retrieve information about a server's capabilities.

| Method name     | getConformance                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *mode* - what type of information needs to be [returned](https://www.hl7.org/fhir/http.html#capabilities:~:text=value%20of%20the-,mode,-parameter%3A) default -full |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
|                 | *uriParameters* - additional params as a name value map |
| Returns         | capability  statement \| operationOutcome                                                                                  |
| Server endpoint | [capabilities](https://www.hl7.org/fhir/http.html#capabilities) operation   |

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->getConformance();
```

:::
:::note Retrieve history  for all the resources
This method will allow the user to retrieve the change history for all resources supported by the system.

| Method name     | getAllHistory                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *Parameters* - history search parameters (i.e count, since, at) |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
| Returns         | Requesed histories \| operationOutcome                                                                                  |
| Server endpoint | [History](https://www.hl7.org/fhir/http.html#history) operation   |

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->getAllHistory({"_count": "10"});
```

:::
:::note Search resources across all resource types
This method will allow the user to search across all resource types by defining search parameters.

| Method name     | searchAll                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | searchParams - this will be a map of user defined key value pairs (once search parameter records are implemented the map will be replaced. Here we can only use base [search params](https://www.hl7.org/fhir/resource.html#search)) |
| Returns         | Search results \| operationOutcome                                                                                  |
| Server endpoint | [Search](https://www.hl7.org/fhir/http.html#search) operation   |

**sample usage**
```ballerina
fhir:SearchParameters searchParams = {_lastUpdated: ["gt2021-01-01T00:00:00Z"]};
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->searchAll(searchParams);
```

:::
:::note Execute batch operations
This operation will allow the user to submit a set of actions to perform on a server in a single request. Single request can consist of all the request [types](https://www.hl7.org/fhir/http.html#transaction:~:text=Multiple%20actions%20on%20multiple%20resources%20of%20the%20same%20or%20different%20types%20may%20be%20submitted%2C%20and%20they%20may%20be%20a%20mix%20of%20other%20interactions%20defined%20on%20this%20page%20(e.g.%20read%2C%20search%2C%20create%2C%20update%2C%20delete%2C%20etc.)%2C%20or%20using%20the%20operations%20framework.).

| Method name     | batchRequest                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *data* -  request data (bundle with type batch) |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
| Returns         | Batch request results \| operationOutcome                                                                                  |
| Server endpoint | [Batch](https://www.hl7.org/fhir/http.html#transaction) operation   |

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->batchRequest({"resourceType": "Bundle", "type": "message", "entry": [{"request": {"method": "GET", "url": "Patient?_lastUpdated=gt2021-01-01T00:00:00Z"}}]});
```

:::
:::note Execute transaction operation
This operation will allow the user to submit a set of actions to perform on a server in a single request in a transactional manner. Single request can consist of all the request [types](https://www.hl7.org/fhir/http.html#transaction:~:text=Multiple%20actions%20on%20multiple%20resources%20of%20the%20same%20or%20different%20types%20may%20be%20submitted%2C%20and%20they%20may%20be%20a%20mix%20of%20other%20interactions%20defined%20on%20this%20page%20(e.g.%20read%2C%20search%2C%20create%2C%20update%2C%20delete%2C%20etc.)%2C%20or%20using%20the%20operations%20framework.).

| Method name     | batchRequest                                                                                                                                          |
|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| Parameters      | *data* -  request data (bundle with type batch) |
|                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
| Returns         | Batch request results \| operationOutcome                                                                                  |
| Server endpoint | [Transaction](https://www.hl7.org/fhir/http.html#transaction) operation   |

Both batch and transaction will be using the FHIR [bundle](https://www.hl7.org/fhir/bundle.html) resource with the types batch and transaction respectively.
For delete,  get methods: the request will have the [format](https://www.hl7.org/fhir/bundle-transaction.json.html#:~:text=%7B%0A%20%20%20%20%20%20%22request%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22method%22%3A%20%22DELETE%22%2C%0A%20%20%20%20%20%20%20%20%22url%22%3A%20%22Patient/234%22%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D), for post,patch, update the request will have the [format](https://www.hl7.org/fhir/bundle-transaction.json.html#:~:text=%7B%0A%20%20%20%20%20%20%22fullUrl%22%3A%20%22urn%3Auuid%3A88f151c0,fhir/ids%7C234234%22%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C).

**sample usage**
```ballerina
fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->'transaction({"resourceType": "Bundle", "type": "transaction", "entry": [{"request": {"method": "GET", "url": "Patient/1"}}]});
```

:::
:::note
- The default MIME type value is `application/fhir+json`, and can be changed at operation level.

- Function parameter summary is an enum consisting of a set of types specified in the FHIR specification.

- Required fields are marked with an asterisk (`*`).

- In the initial implementation, JSON or XML is used instead of record representation of the resource types, since the FHIR model implementation is not yet complete.

- In search-related operations, search parameters are a map of key-value pairs (for example: `{"key": "value"}`).
:::
![FHIR Repository connector](/assets/img/guildes/handling-fhir/fhir-repository-connector.png)

